import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const safeParse = (key, fallback) => {
    try {
      const value = localStorage.getItem(key);
      if (value === null || value === 'undefined') return fallback;
      return JSON.parse(value);
    } catch (e) {
      return fallback;
    }
  };

  const user = safeParse('user', {});
  const roles = safeParse('roles', []);
  const name = safeParse('name', '');
  const departmentId = safeParse('department', null);

  const [departmentName, setDepartmentName] = useState('Loading...');

  useEffect(() => {
    const fetchDepartmentName = async () => {
      if (!departmentId) {
        setDepartmentName('No Department');
        return;
      }

      try {
        const res = await fetch(`http://localhost:5000/departments/getById/${departmentId}`);
        const data = await res.json();
        if (data?.name) {
          setDepartmentName(data.name);
        } else {
          setDepartmentName('No Department');
        }
      } catch (error) {
        console.error('Error fetching department:', error);
        setDepartmentName('No Department');
      }
    };

    fetchDepartmentName();
  }, [departmentId]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <nav style={{ background: '#333', color: '#fff', padding: '1rem', display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
      <span style={{ marginRight: '1rem', fontWeight: 'bold' }}>
        👋 Hello, {name || 'User'} - {departmentName}
      </span>

      {roles.includes('admin') && <button onClick={() => navigate('/admin/dashboard')}>Admin Panel</button>}
      {roles.includes('principal') && <button onClick={() => navigate('/principal/dashboard')}>Principal Panel</button>}
      {roles.includes('hod') && <button onClick={() => navigate('/hod/dashboard')}>HOD Panel</button>}
      {roles.includes('faculty') && <button onClick={() => navigate('/faculty/dashboard')}>Faculty Panel</button>}
      {roles.includes('student') && <button onClick={() => navigate('/student/dashboard')}>Student Panel</button>}

      <button onClick={handleLogout} style={{ marginLeft: 'auto', background: '#e74c3c', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
