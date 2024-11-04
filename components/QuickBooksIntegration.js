// src/components/QuickBooksIntegration.js

import React, { useState } from 'react';
import axios from 'axios';

const QuickBooksIntegration = () => {
  const [invoiceStatus, setInvoiceStatus] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);

  // Redirect to QuickBooks for authentication
  const handleQuickBooksAuth = () => {
    window.location.href = 'http://localhost:3000/api/quickbooks/auth';
  };

  // Create an invoice
  const handleCreateInvoice = async () => {
    const invoiceData = {
      CustomerRef: { value: "1" }, // Replace with actual customer ID
      Line: [
        {
          Amount: 150.0, // Invoice amount
          DetailType: "SalesItemLineDetail",
          SalesItemLineDetail: {
            ItemRef: { value: "1" }, // Replace with actual item ID
          },
        },
      ],
    };

    try {
      const response = await axios.post('http://localhost:3000/api/quickbooks/create-invoice', invoiceData);
      setInvoiceStatus(`Invoice created successfully with ID: ${response.data.Id}`);
    } catch (error) {
      console.error('Error creating invoice:', error.response?.data || error.message);
      setInvoiceStatus(`Failed to create invoice: ${error.response?.data?.Fault?.Error[0]?.Message || 'Unknown error'}`);
    }
  };

  // Record a payment
  const handleRecordPayment = async () => {
    const paymentData = {
      CustomerRef: { value: "1" }, // Replace with actual customer ID
      TotalAmt: 150.0, // Payment amount
      LinkedTxn: [
        {
          TxnId: "123", // Replace with actual Invoice ID to which this payment is linked
          TxnType: "Invoice",
        },
      ],
    };

    try {
      const response = await axios.post('http://localhost:3000/api/quickbooks/record-payment', paymentData);
      setPaymentStatus(`Payment recorded successfully with ID: ${response.data.Id}`);
    } catch (error) {
      console.error('Error recording payment:', error.response?.data || error.message);
      setPaymentStatus(`Failed to record payment: ${error.response?.data?.Fault?.Error[0]?.Message || 'Unknown error'}`);
    }
  };

  return (
    <div>
      <h2>QuickBooks Integration</h2>
      
      <button onClick={handleQuickBooksAuth}>Authenticate with QuickBooks</button>
      
      <div style={{ marginTop: '20px' }}>
        <h3>Create Invoice</h3>
        <button onClick={handleCreateInvoice}>Create Invoice</button>
        {invoiceStatus && <p>{invoiceStatus}</p>}
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <h3>Record Payment</h3>
        <button onClick={handleRecordPayment}>Record Payment</button>
        {paymentStatus && <p>{paymentStatus}</p>}
      </div>
    </div>
  );
};

export default QuickBooksIntegration;