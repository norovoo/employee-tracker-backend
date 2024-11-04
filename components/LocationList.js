import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LocationList = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = 'http://192.168.254.86:3001/api/locations'; // Change this to your actual backend URL

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get(API_URL);
        if (response.data && Array.isArray(response.data)) {
          setLocations(response.data);
        } else {
          throw new Error('Unexpected response structure');
        }
      } catch (err) {
        setError(`Error fetching locations: ${err.response ? err.response.data.error : err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, [API_URL]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Technician Locations</h2>
      {locations.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Technician ID</th>
              <th>Latitude</th>
              <th>Longitude</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {locations.map((location) => (
              <tr key={location.id}>
                <td>{location.technician_id}</td>
                <td>{location.latitude}</td>
                <td>{location.longitude}</td>
                <td>{new Date(location.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No locations available.</p>
      )}
    </div>
  );
};

export default LocationList;