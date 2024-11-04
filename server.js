require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const axios = require('axios');
const session = require('express-session');
const { v4: uuidv4 } = require('uuid');
const authRoutes = require('./routes/authRoutes');
const locationRoutes = require('./routes/locationRoutes');
const measurementRoutes = require('./routes/measurementRoutes');
const jobRoutes = require('./routes/jobRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(
  session({
    secret: 'your-secret-key', // Replace with a strong secret in production
    resave: false,
    saveUninitialized: true,
  })
);

// Generate QuickBooks OAuth URL with a unique `state` parameter
app.get('/api/quickbooks/auth', (req, res) => {
  const state = uuidv4(); // Generate a unique state value for this session
  req.session.state = state; // Store `state` in session for validation later
  const quickbooksAuthUrl = `https://appcenter.intuit.com/connect/oauth2?client_id=${process.env.QUICKBOOKS_CLIENT_ID}&redirect_uri=${process.env.QUICKBOOKS_REDIRECT_URI}&response_type=code&scope=com.intuit.quickbooks.accounting&state=${state}`;
  res.redirect(quickbooksAuthUrl);
});

// Handle OAuth callback, validate `state`, and exchange code for tokens
app.get('/api/quickbooks/callback', async (req, res) => {
  const { code, state } = req.query;

  // Validate the `state` parameter
  if (state !== req.session.state) {
    return res.status(400).json({ error: 'State validation failed' });
  }
  delete req.session.state; // Clear the `state` from the session after validation

  try {
    const tokenResponse = await axios.post(
      'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: process.env.QUICKBOOKS_REDIRECT_URI,
      }).toString(),
      {
        auth: {
          username: process.env.QUICKBOOKS_CLIENT_ID,
          password: process.env.QUICKBOOKS_CLIENT_SECRET,
        },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );

    const { access_token, refresh_token } = tokenResponse.data;

    // Store tokens securely (in this example, in memory; ideally in a database)
    app.locals.access_token = access_token;
    app.locals.refresh_token = refresh_token;

    // Redirect to the frontend dashboard or another appropriate page after successful authentication
    res.redirect('/dashboard'); // Adjust this URL as needed for your frontend
  } catch (error) {
    console.error('OAuth error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to authenticate with QuickBooks', details: error.response?.data });
  }
});

// Middleware to check for a valid access token before making QuickBooks API calls
const requireAuth = (req, res, next) => {
  if (!app.locals.access_token) {
    return res.status(401).json({ error: 'Unauthorized, please authenticate with QuickBooks' });
  }
  next();
};

// QuickBooks create invoice route with token check
app.post('/api/quickbooks/create-invoice', requireAuth, async (req, res) => {
  const { CustomerRef, Line } = req.body;

  try {
    const response = await axios.post(
      `https://sandbox-quickbooks.api.intuit.com/v3/company/${process.env.COMPANY_ID}/invoice`,
      { CustomerRef, Line },
      {
        headers: {
          Authorization: `Bearer ${app.locals.access_token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error creating invoice:', error.response?.data || error.message);

    // Log full error details for debugging
    if (error.response?.data) {
      console.error('Error details:', JSON.stringify(error.response.data, null, 2));
    }

    res.status(500).json({
      error: 'Failed to create invoice in QuickBooks',
      details: error.response?.data?.Fault?.Error[0]?.Message || 'Unknown error',
    });
  }
});

// QuickBooks record payment route with token check
app.post('/api/quickbooks/record-payment', requireAuth, async (req, res) => {
  const { CustomerRef, TotalAmt, LinkedTxn } = req.body;

  try {
    const response = await axios.post(
      `https://sandbox-quickbooks.api.intuit.com/v3/company/${process.env.COMPANY_ID}/payment`,
      { CustomerRef, TotalAmt, Line: [{ Amount: TotalAmt, LinkedTxn }] },
      {
        headers: {
          Authorization: `Bearer ${app.locals.access_token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error recording payment:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to record payment in QuickBooks', details: error.response?.data });
  }
});

// Root route
app.get('/', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Welcome to the Glass Tech Tracker API' });
});

// Define API routes
app.use('/api/auth', authRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/measurements', measurementRoutes);
app.use('/api/jobs', jobRoutes);

// Handle unknown routes
app.use((req, res, next) => {
  res.status(404).json({ status: 'fail', message: 'Route not found', path: req.originalUrl });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({ status: 'error', message: err.message || 'Internal server error' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});