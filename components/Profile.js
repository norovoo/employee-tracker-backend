import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../config';

const Profile = () => {
  const [profileData, setProfileData] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`${config.BASE_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfileData(response.data);
      } catch (error) {
        setError('Failed to fetch profile data.');
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="profile-container">
      <h2>Profile</h2>
      {error ? <p>{error}</p> : (
        <>
          <p><strong>Name:</strong> {profileData.name}</p>
          <p><strong>Email:</strong> {profileData.email}</p>
        </>
      )}
    </div>
  );
};

export default Profile;