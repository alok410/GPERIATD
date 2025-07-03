import React from 'react';
import { Link } from 'react-router-dom';

const Forbidden = () => {
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>403 - Forbidden</h1>
      <p>You do not have permission to access this page.</p>
      <Link to="/">Go to Login</Link>
    </div>
  );
};

export default Forbidden;
