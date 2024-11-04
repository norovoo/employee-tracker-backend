import React from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';

const TechnicianMap = ({ locations = [] }) => { // Default to an empty array
  if (!locations.length) {
    return <p>No technician locations available</p>;
  }

  return (
    <GoogleMap
      center={{ lat: 0, lng: 0 }}  // Default center if no location data
      zoom={10}
      mapContainerStyle={{ width: '100%', height: '400px' }}
    >
      {locations.map((location, index) => {
        const latitude = parseFloat(location.latitude);
        const longitude = parseFloat(location.longitude);

        // Ensure latitude and longitude are valid numbers
        if (isNaN(latitude) || isNaN(longitude)) {
          console.warn(`Invalid coordinates for location at index ${index}:`, location);
          return null; // Skip invalid coordinates
        }

        return (
          <Marker
            key={index}
            position={{ lat: latitude, lng: longitude }}
          />
        );
      })}
    </GoogleMap>
  );
};

export default TechnicianMap;