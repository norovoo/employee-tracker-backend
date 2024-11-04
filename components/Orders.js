import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Orders.css'; // Import your CSS file for styling

const API_KEY = 'a2F8ZikP6c37aDLijmdFb1o4YCDEG0Mc20ZX31TL'; // Your API key
const LAMBDA_URL = 'https://6d6qnwzps73kzauiqbl6nkdrwy0ylkcn.lambda-url.us-east-1.on.aws/';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    buildersOrder: '',
    suppliersOrder: '',
    lotNumber: '',
    blockNumber: '',
    account: '',
    subdivision: '',
    jobAddress: '',
    orderStatus: '',
    acceptedDate: '',
  });

  const fetchOrders = async () => {
    setLoading(true); // Start loading
    setError(''); // Reset error

    try {
      console.log("Fetching orders with filters:", filters); // Debugging log
      const response = await axios.get(LAMBDA_URL, {
        headers: { 'x-api-key': API_KEY },
        params: filters, // Send filters as query parameters
      });

      if (response.data && response.data.orders) {
        setOrders(response.data.orders); // Safely set orders
      } else {
        setOrders([]); // Reset orders if API response is not as expected
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      setError('Error fetching orders: ' + errorMsg);
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    fetchOrders(); // Fetch orders when the component mounts
  }, []); // Only run once on mount

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    fetchOrders(); // Fetch orders based on current filters
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>; // Display error message if present

  return (
    <div className="orders-container">
      <h2>Order Management</h2>
      <div className="search-criteria">
        <input
          type="text"
          name="buildersOrder"
          placeholder="Builder's Order #"
          value={filters.buildersOrder}
          onChange={handleChange}
        />
        <input
          type="text"
          name="suppliersOrder"
          placeholder="Supplier's Order #"
          value={filters.suppliersOrder}
          onChange={handleChange}
        />
        <input
          type="text"
          name="lotNumber"
          placeholder="Lot #"
          value={filters.lotNumber}
          onChange={handleChange}
        />
        <input
          type="text"
          name="blockNumber"
          placeholder="Block #"
          value={filters.blockNumber}
          onChange={handleChange}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      
      <table className="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Task</th>
            <th>Address</th>
            <th>Order Date</th>
            <th>Order Total</th>
            <th>Order Status</th>

          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order.OrderID}>
                <td>{order.OrderID}</td>
                <td>{order.header.task.name}</td>
                <td>{order.header.billingInformation.address.name}</td>
                <td>{order.header.startDate}</td>
                <td>{order.summary.orderTotal}</td>
                <td>{order.buyerStatus}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No orders found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;