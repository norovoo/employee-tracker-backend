import axios from 'axios';

const API_URL = process.env.API_BASE_URL || 'http://192.168.254.86:3001';
const LAMBDA_URL = 'https://6d6qnwzps73kzauiqbl6nkdrwy0ylkcn.lambda-url.us-east-1.on.aws/';
const API_KEY = 'a2F8ZikP6c37aDLijmdFb1o4YCDEG0Mc20ZX31TL'; // Your API key

export const getTechnicianLocations = async (token) => {
  try {
    const response = await axios.get(`http://192.168.254.86:3000/api/locations`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data; // Return the data for easier use in components
  } catch (error) {
    console.error('Error fetching technician locations:', error);
    throw error; // Rethrow the error to handle it in the component
  }
};

export const fetchJobs = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/jobs');
    return response.data;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
};

export const getMeasurements = async (token) => {
  try {
    const response = await axios.get(`http://192.168.254.86:3000/api/measurements`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data; // Return the data for easier use in components
  } catch (error) {
    console.error('Error fetching measurements:', error);
    throw error; // Rethrow the error to handle it in the component
  }
};

export const fetchOrders = async (filters = {}) => {
  const { location, lotNumber, orderNumber } = filters;

  try {
    const response = await axios.get(LAMBDA_URL, {
      headers: {
        'x-api-key': API_KEY, // Include the API key here
      },
      params: { location, lotNumber, orderNumber },
    });
    return response.data.orders; // Return the orders for easier use in components
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error; // Rethrow the error to handle it in the component
  }
};

export const fetchRecentOrders = async () => {
  try {
      const response = await axios.get(`${LAMBDA_URL}?recent=true`, {
          headers: {
              'x-api-key': API_KEY, // Include the API key here
          },
      });
      return response.data.orders; // Return the orders for easier use in components
  } catch (error) {
      console.error('Error fetching recent orders:', error);
      throw error; // Rethrow the error to handle it in the component
  }
};