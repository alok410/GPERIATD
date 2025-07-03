import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const roles = JSON.parse(localStorage.getItem('roles') || '[]');

  if (!token) {
    return <Navigate to="/" replace />;
  }

  const hasAccess = roles.some(role => allowedRoles.includes(role));
  if (!hasAccess) {
    return <Navigate to="/403" replace />;
  }

  return children;
};

export default ProtectedRoute;
