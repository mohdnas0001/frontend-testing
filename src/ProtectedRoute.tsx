// ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './context/auth-context';

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { accessToken } = useAuth();

  if (!accessToken) {
    // If the user is not authenticated, redirect to login
    return <Navigate to="/login" />;
  }

  // If the user is authenticated, render the children (protected component)
  return children;
};

export default ProtectedRoute;
