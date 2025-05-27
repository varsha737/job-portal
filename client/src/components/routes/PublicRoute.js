import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  if (!localStorage.getItem('token')) {
    return <Navigate to="/dashboard" />;
  }
  return children;
};

export default PrivateRoute;

