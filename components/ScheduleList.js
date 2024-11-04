// ScheduleList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';

const ScheduleList = () => {
  const [ordersByMonth, setOrdersByMonth] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/orders');
        const groupedOrders = response.data.reduce((acc, order) => {
          const month = moment(order.orderDate).format('MMMM YYYY');
          if (!acc[month]) acc[month] = [];
          acc[month].push(order);
          return acc;
        }, {});
        setOrdersByMonth(groupedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div>
      <h2>Orders by Month</h2>
      {Object.entries(ordersByMonth).map(([month, orders]) => (
        <div key={month}>
          <h3>{month}</h3>
          <ul>
            {orders.map(order => (
              <li key={order.id}>
                <p><strong>Order ID:</strong> {order.id}</p>
                <p><strong>Order Title:</strong> {order.title}</p>
                <p><strong>Date:</strong> {moment(order.orderDate).format('MMM D, YYYY')}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ScheduleList;