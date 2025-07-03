import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const HODDashboard = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <h2>HOD Dashboard</h2>

      <button style={btn} onClick={() => navigate('/hod/assign-subject')}>
        <h3>Assign Subject to Faculty</h3>
      </button>
      
      <button style={btn} onClick={() => navigate('/hod/create-subject')}>
        <h3>Create Subject</h3> 
      </button>
    </>
  );
};
const btn = {
  height: "200px",
  width: "300px",
  cursor: "pointer",
  border: "none",
  borderRadius: "10%",
  color: "white",
  backgroundColor: "blue",
  margin: "10px"
};
export default HODDashboard;
