import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #0f172a, #1e3a8a, #0f172a)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem',
      fontFamily: 'sans-serif'
    }}>
      <style>{`
        input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
        }
        button:hover:not(:disabled) {
          transform: scale(1.02);
        }
      `}</style>
      <div style={{ maxWidth: '1200px', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'center' }}>
        {/* Left Side */}
        <div style={{ color: 'white', padding: '1rem' }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            background: 'linear-gradient(to right, #60a5fa, #22d3ee)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>Welcome Back To GPERI Attendance System</h1>
          <p style={{ fontSize: '1.2rem', color: '#cbd5e1' }}>Access your institutional portal</p>
          <ul style={{ marginTop: '2rem', color: '#cbd5e1' }}>
            <li>🛡️ Secure authentication system</li>
            <li>👥 Multi-role access control</li>
            <li>🎓 Comprehensive portal management</li>
          </ul>
        </div>

        {/* Right Side */}
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '1rem',
          padding: '2rem',
          color: 'white'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{
              width: '64px', height: '64px', margin: '0 auto',
              background: 'linear-gradient(to right, #3b82f6, #06b6d4)',
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2rem'
            }}>🔒</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Sign In</h2>
            <p style={{ color: '#cbd5e1' }}>Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%', padding: '0.75rem',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '0.5rem',
                  color: 'white'
                }}
              />
            </div>
            <div>
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: '93%', padding: '0.75rem',
                    paddingRight: '3rem',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '0.5rem',
                    color: 'white'
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
                    color: 'white',
                    fontSize: '1rem',
                    cursor: 'pointer'
                  }}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {error && <div style={{ backgroundColor: 'rgba(255,0,0,0.2)', color: '#fca5a5', padding: '0.5rem', borderRadius: '0.5rem' }}>{error}</div>}

            <button
              type="submit"
              disabled={isLoading}
              style={{
                padding: '0.75rem',
                background: 'linear-gradient(to right, #2563eb, #06b6d4)',
                color: 'white',
                fontWeight: 'bold',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                border: 'none'
              }}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Test Accounts */}
          <div style={{ marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '1rem' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>Test Accounts</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {testAccounts.map((acc, index) => (
                <div
                  key={index}
                  onClick={() => { setEmail(acc.email); setPassword(acc.password); }}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ fontSize: '1.25rem' }}>{acc.icon}</div>
                    <div>
                      <p style={{ fontWeight: 'bold' }}>{acc.role}</p>
                      <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{acc.email}</p>
                      <p style={{ fontSize: '0.7rem', color: '#64748b' }}>Password: {acc.password}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', textAlign: 'center', marginTop: '1rem' }}>
              Click on any account above to auto-fill credentials
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
