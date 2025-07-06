
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dark, setDark] = useState(false);
  const navigate = useNavigate();

  const toggleDarkMode = () => setDark(!dark);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('https://gperiatd.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      localStorage.setItem('token', data.token);
      localStorage.setItem('roles', JSON.stringify(data.roles));
      localStorage.setItem('name', JSON.stringify(data.user.name));
      localStorage.setItem('id', JSON.stringify(data.user.id));
      localStorage.setItem('department', JSON.stringify(data.user.department_id));

      const roles = data.roles;
      if (roles.includes('admin')) navigate('/admin/dashboard');
      else if (roles.includes('hod')) navigate('/hod/dashboard');
      else if (roles.includes('faculty')) navigate('/faculty/dashboard');
      else if (roles.includes('principal')) navigate('/principal/dashboard');
      else if (roles.includes('student')) navigate('/student/dashboard');
      else throw new Error('No valid role found');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const testAccounts = [
    { email: 'TestFaculty@gmail.com', password: '123', role: 'Faculty', icon: '🧑‍🏫' },
    { email: 'TestAdmin@gmail.com', password: '123456', role: 'Admin', icon: '🛡️' },
    { email: 'Testhod@gmail.com', password: '123', role: 'HOD', icon: '🏢' },
    { email: '244600307001@gmail.com', password: '244600307001', role: 'Student', icon: '🎓' },
    { email: 'TestPrincipal@gmail.com', password: '123', role: 'Principal', icon: '👤' },
    { email: 'hodMech@gmail.com', password: '1', role: 'HOD Mechanical', icon: '🏭' },
  ];

  const containerStyle = {
    minHeight: '100vh',
    background: dark
      ? 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)'
      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '1rem',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    transition: 'all 0.3s ease',
  };

  const cardStyle = {
    display: 'grid',
    gridTemplateColumns: window.innerWidth > 768 ? '1fr 1fr' : '1fr',
    gap: '2rem',
    background: dark 
      ? 'linear-gradient(145deg, #1e293b, #334155)' 
      : 'rgba(255, 255, 255, 0.95)',
    padding: '2.5rem',
    borderRadius: '20px',
    maxWidth: '1100px',
    width: '100%',
    boxShadow: dark
      ? '0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1)'
      : '0 20px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.2)',
    color: dark ? '#f1f5f9' : '#1e293b',
    backdropFilter: 'blur(10px)',
    border: dark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
  };

  const leftSideStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: window.innerWidth <= 768 ? 'center' : 'left',
  };

  const titleStyle = {
    fontSize: window.innerWidth <= 768 ? '1.8rem' : '2.5rem',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '1rem',
    lineHeight: '1.2',
  };

  const subtitleStyle = {
    fontSize: '1.1rem',
    opacity: '0.8',
    marginBottom: '2rem',
    fontWeight: '400',
  };

  const featureStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    fontSize: '1rem',
    lineHeight: '1.6',
  };

  const featureItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 0',
  };

  const rightSideStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  };

  const formTitleStyle = {
    fontSize: '1.8rem',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: '0.5rem',
  };

  const inputStyle = {
    padding: '1rem',
    borderRadius: '12px',
    border: dark ? '2px solid #475569' : '2px solid #e2e8f0',
    background: dark ? '#334155' : '#ffffff',
    color: dark ? '#f1f5f9' : '#1e293b',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    outline: 'none',
  };

  const buttonStyle = {
    padding: '1rem',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: '#ffffff',
    fontWeight: '600',
    borderRadius: '12px',
    border: 'none',
    cursor: isLoading ? 'not-allowed' : 'pointer',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    opacity: isLoading ? 0.7 : 1,
    transform: isLoading ? 'scale(0.98)' : 'scale(1)',
  };

  const errorStyle = {
    backgroundColor: '#fecaca',
    color: '#b91c1c',
    padding: '0.75rem',
    borderRadius: '8px',
    fontSize: '0.9rem',
    textAlign: 'center',
    border: '1px solid #f87171',
  };

  const testAccountsStyle = {
    display: 'grid',
    gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : 'repeat(2, 1fr)',
    gap: '0.75rem',
  };

  const testAccountStyle = {
    background: dark 
      ? 'linear-gradient(145deg, #475569, #64748b)' 
      : 'linear-gradient(145deg, #f8fafc, #e2e8f0)',
    padding: '1rem',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    lineHeight: '1.4',
    transition: 'all 0.3s ease',
    border: dark ? '1px solid #64748b' : '1px solid #cbd5e1',
  };

  const darkModeButtonStyle = {
    position: 'fixed',
    top: '1rem',
    right: '1rem',
    background: dark ? '#f8fafc' : '#1e293b',
    color: dark ? '#1e293b' : '#f8fafc',
    border: 'none',
    padding: '0.75rem 1rem',
    borderRadius: '50px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.9rem',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    zIndex: 1000,
  };

  return (
    <div style={containerStyle}>
      <button
        onClick={toggleDarkMode}
        style={darkModeButtonStyle}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
        }}
      >
        {dark ? '☀️ Light' : '🌙 Dark'}
      </button>

      <div style={cardStyle}>
        <div style={leftSideStyle}>
          <h1 style={titleStyle}>
            Welcome Back to GPERI Attendance System
          </h1>
          <p style={subtitleStyle}>
            Access your institutional portal with secure authentication
          </p>
          <div style={featureStyle}>
            <div style={featureItemStyle}>
              <span style={{ fontSize: '1.2rem' }}>🛡️</span>
              <span>Secure authentication system</span>
            </div>
            <div style={featureItemStyle}>
              <span style={{ fontSize: '1.2rem' }}>👥</span>
              <span>Multi-role access control</span>
            </div>
            <div style={featureItemStyle}>
              <span style={{ fontSize: '1.2rem' }}>🎓</span>
              <span>Comprehensive dashboard</span>
            </div>
            <div style={featureItemStyle}>
              <span style={{ fontSize: '1.2rem' }}>📊</span>
              <span>Real-time attendance tracking</span>
            </div>
          </div>
        </div>

        <div style={rightSideStyle}>
          <h2 style={formTitleStyle}>Sign In</h2>
          
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = dark ? '#475569' : '#e2e8f0';
                e.target.style.boxShadow = 'none';
              }}
            />
            
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ ...inputStyle, width: '85%', paddingRight: '3rem' }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#667eea';
                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = dark ? '#475569' : '#e2e8f0';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  padding: '0.25rem',
                }}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>

            {error && <div style={errorStyle}>{error}</div>}

            <button
              type="submit"
              disabled={isLoading}
              style={buttonStyle}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 10px 20px rgba(102, 126, 234, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                } 
              }}
            >
              {isLoading ? '🔄 Signing In...' : '🚀 Sign In'}
            </button>
          </form>

            {/* <div>
              <h4 style={{ marginBottom: '1rem', textAlign: 'center', opacity: '0.8' }}>
                Quick Test Accounts
              </h4>
              <div style={testAccountsStyle}>
                {testAccounts.map((acc, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setEmail(acc.email);
                      setPassword(acc.password);
                    }}
                    style={testAccountStyle}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                      {acc.icon} {acc.role}
                    </div>
                    <div style={{ fontSize: '0.8rem', opacity: '0.8' }}>
                      {acc.email}
                    </div>
                    <div style={{ fontSize: '0.75rem', opacity: '0.6' }}>
                      Password: {acc.password}
                    </div>
                  </div>
                ))}
              </div>
            </div> */}
        </div>
      </div>
    </div>
  );
};

export default Login;