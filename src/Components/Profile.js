import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import axios from 'axios';
import { FaUser } from 'react-icons/fa';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import "./profile.css"

function UserProfile() {
  const { userId } = useContext(AuthContext);
  const [avatarUrl, ] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`https://personalfinanceapp1.azurewebsites.net/users/${userId}`);
        setUserInfo(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserInfo();
  }, [userId]);

  return (
    <div className="avatar-container">
      <div className="avatar-outer">
        <div className="avatar">
          {avatarUrl ? (
            <img src={avatarUrl} alt="User avatar" />
          ) : (
            <FaUser size={80} />
          )}
        </div>
      </div>
      {userInfo && (
        <div className="user-info-container">
          <Card className="user-info-card">
            <h2>{userInfo.name}</h2>
            <Divider />
            <div className="user-info-details">
              <p>Balance: {userInfo.balance}</p>
              <p>Helping you keep track of your finances since:</p>
              <p className="user-info-date">{userInfo.signInDate}</p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
  
}

export default UserProfile;
