import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
const PrincipalDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <>
      <Navbar />
        <div style={{ padding: '1rem' }}>

      <h2>Principal Dashboard</h2>
        </div>
    </>
  );
};

export default PrincipalDashboard;
