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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchDepartmentName = async () => {
      if (!departmentId) {
        setDepartmentName('No Department');
        return;
      }

      try {
        const res = await fetch(`https://gperiatd.onrender.com/departments/getById/${departmentId}`);
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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navStyles = {
    background: '#333',
    color: '#fff',
    padding: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    position: 'relative',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  const userInfoStyles = {
    fontWeight: 'bold',
    fontSize: '1rem',
    marginRight: '1rem',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  };

  const buttonContainerStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    flexWrap: 'wrap'
  };

  const roleButtonStyles = {
    background: '#007bff',
    color: '#fff',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'background-color 0.3s ease',
    whiteSpace: 'nowrap'
  };

  const roleButtonHoverStyles = {
    background: '#0056b3'
  };

  const logoutButtonStyles = {
    background: '#e74c3c',
    color: '#fff',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'background-color 0.3s ease'
  };

  const logoutButtonHoverStyles = {
    background: '#c0392b'
  };

  const mobileMenuButtonStyles = {
    display: 'none',
    background: 'transparent',
    border: 'none',
    color: '#fff',
    fontSize: '1.5rem',
    cursor: 'pointer',
    padding: '0.25rem'
  };

  const mobileMenuStyles = {
    display: isMobileMenuOpen ? 'flex' : 'none',
    position: 'absolute',
    top: '100%',
    left: '0',
    right: '0',
    background: '#333',
    flexDirection: 'column',
    padding: '1rem',
    gap: '0.5rem',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    zIndex: 1000
  };

  const desktopMenuStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    flexWrap: 'wrap'
  };

  // Media query styles
  const mediaQueryStyles = `
    @media (max-width: 768px) {
      .navbar-desktop-menu {
        display: none !important;
      }
      .navbar-mobile-toggle {
        display: block !important;
      }
      .navbar-user-info {
        font-size: 0.9rem !important;
        max-width: 200px !important;
      }
      .navbar {
        padding: 0.75rem !important;
      }
    }
    @media (max-width: 480px) {
      .navbar-user-info {
        font-size: 0.8rem !important;
        max-width: 150px !important;
      }
      .navbar {
        padding: 0.5rem !important;
      }
    }
  `;

  return (
    <>
      <style>{mediaQueryStyles}</style>
      <nav style={navStyles} className="navbar">
        <span style={userInfoStyles} className="navbar-user-info">
          👋 Hello, {name || 'User'} - {departmentName}
        </span>

        {/* Mobile menu toggle button */}
        <button 
          style={mobileMenuButtonStyles}
          className="navbar-mobile-toggle"
          onClick={toggleMobileMenu}
        >
          ☰
        </button>

        {/* Desktop menu */}
        <div style={desktopMenuStyles} className="navbar-desktop-menu">
          <div style={buttonContainerStyles}>
            {roles.includes('admin') && (
              <button 
                style={roleButtonStyles}
                onMouseOver={(e) => e.target.style.background = roleButtonHoverStyles.background}
                onMouseOut={(e) => e.target.style.background = roleButtonStyles.background}
                onClick={() => navigate('/admin/dashboard')}
              >
                Admin Panel
              </button>
            )}
            {roles.includes('principal') && (
              <button 
                style={roleButtonStyles}
                onMouseOver={(e) => e.target.style.background = roleButtonHoverStyles.background}
                onMouseOut={(e) => e.target.style.background = roleButtonStyles.background}
                onClick={() => navigate('/principal/dashboard')}
              >
                Principal Panel
              </button>
            )}
            {roles.includes('hod') && (
              <button 
                style={roleButtonStyles}
                onMouseOver={(e) => e.target.style.background = roleButtonHoverStyles.background}
                onMouseOut={(e) => e.target.style.background = roleButtonStyles.background}
                onClick={() => navigate('/hod/dashboard')}
              >
                HOD Panel
              </button>
            )}
            {roles.includes('faculty') && (
              <button 
                style={roleButtonStyles}
                onMouseOver={(e) => e.target.style.background = roleButtonHoverStyles.background}
                onMouseOut={(e) => e.target.style.background = roleButtonStyles.background}
                onClick={() => navigate('/faculty/dashboard')}
              >
                Faculty Panel
              </button>
            )}
            {roles.includes('student') && (
              <button 
                style={roleButtonStyles}
                onMouseOver={(e) => e.target.style.background = roleButtonHoverStyles.background}
                onMouseOut={(e) => e.target.style.background = roleButtonStyles.background}
                onClick={() => navigate('/student/dashboard')}
              >
                Student Panel
              </button>
            )}
          </div>
          
          <button 
            style={logoutButtonStyles}
            onMouseOver={(e) => e.target.style.background = logoutButtonHoverStyles.background}
            onMouseOut={(e) => e.target.style.background = logoutButtonStyles.background}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        {/* Mobile menu */}
        <div style={mobileMenuStyles}>
          {roles.includes('admin') && (
            <button 
              style={roleButtonStyles}
              onClick={() => {
                navigate('/admin/dashboard');
                setIsMobileMenuOpen(false);
              }}
            >
              Admin Panel
            </button>
          )}
          {roles.includes('principal') && (
            <button 
              style={roleButtonStyles}
              onClick={() => {
                navigate('/principal/dashboard');
                setIsMobileMenuOpen(false);
              }}
            >
              Principal Panel
            </button>
          )}
          {roles.includes('hod') && (
            <button 
              style={roleButtonStyles}
              onClick={() => {
                navigate('/hod/dashboard');
                setIsMobileMenuOpen(false);
              }}
            >
              HOD Panel
            </button>
          )}
          {roles.includes('faculty') && (
            <button 
              style={roleButtonStyles}
              onClick={() => {
                navigate('/faculty/dashboard');
                setIsMobileMenuOpen(false);
              }}
            >
              Faculty Panel
            </button>
          )}
          {roles.includes('student') && (
            <button 
              style={roleButtonStyles}
              onClick={() => {
                navigate('/student/dashboard');
                setIsMobileMenuOpen(false);
              }}
            >
              Student Panel
            </button>
          )}
          
          <button 
            style={logoutButtonStyles}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;