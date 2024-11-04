// Measurements.js
import React, { useState } from 'react';
import axios from 'axios';
import './Measurements.css'; // Ensure you have a CSS file for styles

const Measurements = ({ token }) => {
  const [data, setData] = useState({ location: '', lot: '', measurementData: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log("Token used for authorization:", token);  // Log the token

      const response = await axios.post(
        `http://192.168.254.86:3000/api/measurements/mirror`,  // Ensure this endpoint is correct
        { ...data },
        {
          headers: {
            Authorization: `Bearer ${token}`,  // Use the token in the authorization header
          },
        }
      );

      alert(response.data.message);  // Alert success message
      setData({ location: '', lot: '', measurementData: '' });  // Reset form data
    } catch (error) {
      console.error('Error submitting measurement:', error);  // Log the error
      setError('Error submitting measurement: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);  // Reset loading state
    }
  };

  return (
    <div className="measurements-container">
      <h2>Submit Measurement</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="location"
          placeholder="Location"
          onChange={handleChange}
          value={data.location}
          required
        />
        <input
          name="lot"
          placeholder="Lot Number"
          onChange={handleChange}
          value={data.lot}
          required
        />
        <input
          name="measurementData"
          placeholder="Measurement Data"
          onChange={handleChange}
          value={data.measurementData}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Measurement'}
        </button>
      </form>
      {error && <p className="error">{error}</p>} {/* Display error if it exists */}
    </div>
  );
};

export default Measurements;