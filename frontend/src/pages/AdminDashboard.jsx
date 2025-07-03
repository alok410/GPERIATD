import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <>
      <Navbar />
      <div style={pageStyle}>
        <h2 style={titleStyle}>🛠️ Admin Dashboard</h2>

        <div style={gridStyle}>
          <button onClick={() => navigate('/admin/students')} style={cardBtn}>👨‍🎓 Students</button>
          <button onClick={() => navigate('/admin/faculty')} style={cardBtn}>👨‍🏫 Faculty</button>
          <button onClick={() => navigate('/admin/hod')} style={cardBtn}>🏢 HOD</button>
          <button onClick={() => navigate('/admin/principal')} style={cardBtn}>👤 Principal</button>
          <button onClick={() => navigate('/admin/classes')} style={cardBtn}>🏫 Classes</button>
          <button onClick={handleLogout} style={{ ...cardBtn, backgroundColor: '#e74c3c' }}>🔓 Logout</button>
        </div>
      </div>
    </>
  );
};

const pageStyle = {
  minHeight: '100vh',
  background: 'linear-gradient(to bottom right, #1f2937, #0f172a)',
  color: '#fff',
  padding: '2rem',
  fontFamily: 'Arial, sans-serif'
};

const titleStyle = {
  textAlign: 'center',
  marginBottom: '2rem',
  fontSize: '2rem'
};

const gridStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: '1.5rem'
};

const cardBtn = {
  height: '180px',
  width: '260px',
  background: 'rgba(255, 255, 255, 0.08)',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  borderRadius: '16px',
  color: '#fff',
  fontSize: '1.1rem',
  fontWeight: 'bold',
  cursor: 'pointer',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  transition: 'transform 0.2s ease, background 0.3s ease',
  textAlign: 'center',
  padding: '1rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

// Optional: hover effect (if you want to add inline logic with JS, or apply CSS in external file)

export default AdminDashboard;
