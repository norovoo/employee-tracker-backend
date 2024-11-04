import React from 'react';

const MapComponent = ({ locations }) => {
  if (!locations || locations.length === 0) {
    return <p>No technician locations available</p>;
  }

  return (
    <div className="map-container">
      <h2>Technician Map</h2>
      <ul>
        {locations.map((location) => (
          <li key={location.id}>
            <p><strong>{location.name}</strong></p>
            <p>Latitude: {location.latitude}</p>
            <p>Longitude: {location.longitude}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MapComponent;