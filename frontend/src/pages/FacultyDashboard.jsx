import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const FacultyDashboard = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div style={{ padding: '1rem' }}>
        <h2>Faculty Dashboard</h2>
        <button
          style={btn}
          onClick={() => navigate('/faculty/my-subjects')}
        >
          📘 My Subjects
        </button>
      </div>
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

export default FacultyDashboard;