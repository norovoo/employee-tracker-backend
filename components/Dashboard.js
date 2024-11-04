// Dashboard.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTechnicianLocations, getMeasurements, fetchRecentOrders } from '../api/api';
import TechnicianMap from './TechnicianMap';
import MeasurementList from './MeasurementList';
import Logo from '../assets/Logo.png';
import ArrowDown from '../assets/down.png';
import ProfilePicture from '../assets/profile-pic.jpg';

const Dashboard = ({ token, username, onLogout }) => {
  const [locations, setLocations] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        // Fetch technician locations
        const locationResponse = await getTechnicianLocations(token);
        setLocations(locationResponse.data);

        // Fetch measurements
        const measurementResponse = await getMeasurements(token);
        setMeasurements(measurementResponse.data);

        // Fetch recent orders
        const recentOrderResponse = await fetchRecentOrders();
        setOrders(recentOrderResponse);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    onLogout();
    setDropdownOpen(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      {/* Left Sidebar Menu */}
      <aside className="sidebar">
        <div className="logo-container">
          <img
            src={Logo}
            width={220}
            alt="Logo"
            className="logo"
            onClick={() => window.location.href = '/dashboard'}
            style={{ cursor: 'pointer' }}
          />
        </div>
        <ul className="menu">
          <li><Link to="/dashboard/orders">Orders</Link></li>
          <li><Link to="/dashboard/locations">Locations</Link></li>
          <li><Link to="/dashboard/measurements">Measurements</Link></li>
          <li><Link to="/dashboard/schedule">Schedule</Link></li>
          <li><Link to="/dashboard/invoices">Invoices</Link></li>
          <li><Link to="/dashboard/quickbooks-integration">QuickBooks Integration</Link></li> {/* Updated Path */}
          <li><button className="logout-button" onClick={handleLogout}>Log Out</button></li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="top-banner">
          <div className="profile-section" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <span className="username">Welcome, {username}!</span>
            <img
              src={ProfilePicture}
              alt="Profile"
              className="profile-picture"
              style={{ cursor: 'pointer', marginLeft: '10px', width: '30px', height: '30px' }}
            />
            <img
              src={ArrowDown}
              alt="Dropdown Arrow"
              width={20}
              className="dropdown-arrow"
              onClick={toggleDropdown}
              style={{ cursor: 'pointer', marginLeft: '5px' }}
            />
            {dropdownOpen && (
              <div className="dropdown-menu">
                <ul>
                  <li><Link to="/dashboard/profile">Profile</Link></li>
                  <li><Link to="/dashboard/settings">Settings</Link></li>
                  <li><button onClick={handleLogout}>Log Out</button></li>
                </ul>
              </div>
            )}
          </div>
        </header>

        {/* Display Recent Orders */}
        <section>
          <h2>Recent Orders</h2>
          <ul>
            {orders.length > 0 ? (
              orders.map((order) => (
                <li key={order.OrderID}>
                  <p>Order ID: {order.OrderID}</p>
                  <p>Location: {order.location}</p>
                  <p>Lot Number: {order.lotNumber}</p>
                  <p>Order Number: {order.orderNumber}</p>
                </li>
              ))
            ) : (
              <p>No recent orders found.</p>
            )}
          </ul>
        </section>

        {/* Technician Locations */}
        <section>
          <h2>Technician Locations</h2>
          <TechnicianMap locations={locations} />
        </section>

        {/* Measurements */}
        <section>
          <h2>Measurements</h2>
          <MeasurementList measurements={measurements} />
        </section>
      </main>
    </div>
  );
};

export default Dashboard;