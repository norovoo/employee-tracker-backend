import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';

// Icon for Leaflet marker
const icon = L.icon({
  iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-green.png',
  iconSize: [38, 95],
});

const LocationMap = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = 'http://192.168.254.86:3001/api/locations'; // Update this with your API URL

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

  if (loading) return <div>Loading map...</div>;
  if (error) return <div>{error}</div>;

  // Center the map based on the first location or a default position
  const centerPosition = locations.length > 0 
    ? [locations[0].latitude, locations[0].longitude] 
    : [51.505, -0.09]; // Default coordinates

  return (
    <MapContainer center={centerPosition} zoom={13} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      {locations.map((location) => (
        <Marker
          key={location.id}
          position={[location.latitude, location.longitude]}
          icon={icon}
        >
          <Popup>
            Technician ID: {location.technician_id} <br /> Last seen here.
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default LocationMap;