import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ roles, children }) {
  const rol = localStorage.getItem('rol');

  if (!rol) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(rol)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;