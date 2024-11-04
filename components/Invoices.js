// components/Invoice.js
import React, { useState } from 'react';
import axios from 'axios';

const Invoice = () => {
  const [invoice, setInvoice] = useState({
    clientName: '',
    daytimePhone: '',
    organization: '',
    address: '',
  });
  const [invoiceList, setInvoiceList] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInvoice({ ...invoice, [name]: value });
  };

  const handleSaveInvoice = async () => {
    try {
      // Add new invoice to list
      setInvoiceList([...invoiceList, invoice]);

      // Send invoice to backend (adjust URL as needed)
      await axios.post('http://192.168.254.86:3000/api/invoices', invoice);

      // Send email with invoice details
      await sendInvoiceEmail(invoice);

      // Clear form after saving
      setInvoice({
        clientName: '',
        daytimePhone: '',
        organization: '',
        address: '',
      });

      alert('Invoice saved and emailed successfully!');
    } catch (error) {
      console.error('Error saving invoice:', error);
    }
  };

  const sendInvoiceEmail = async (invoice) => {
    try {
      // Send email through backend endpoint for email (adjust URL as needed)
      await axios.post('http://192.168.254.86:3000/api/send-email', {
        subject: 'New Invoice',
        recipient: 'client@example.com', // Update to client email or dynamically pull client email
        message: `
          Invoice Details:
          Client Name: ${invoice.clientName}
          Daytime Phone: ${invoice.daytimePhone}
          Organization: ${invoice.organization}
          Address: ${invoice.address}
        `,
      });
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  return (
    <div>
      <h2>Invoice Information</h2>

      <div>
        <label>Client Name</label>
        <input
          type="text"
          name="clientName"
          value={invoice.clientName}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <label>Daytime Phone</label>
        <input
          type="tel"
          name="daytimePhone"
          value={invoice.daytimePhone}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <label>Organization</label>
        <input
          type="text"
          name="organization"
          value={invoice.organization}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <label>Address</label>
        <input
          type="text"
          name="address"
          value={invoice.address}
          onChange={handleInputChange}
        />
      </div>

      <button onClick={handleSaveInvoice}>Save Invoice</button>

      <h3>Invoice List</h3>
      <ul>
        {invoiceList.map((inv, index) => (
          <li key={index}>
            <strong>Client Name:</strong> {inv.clientName}, <strong>Phone:</strong> {inv.daytimePhone}, <strong>Organization:</strong> {inv.organization}, <strong>Address:</strong> {inv.address}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Invoice;