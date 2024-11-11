// App.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import LoginComponent from './components/login';
import { useAuth } from './context/auth-context';
import Home from './components/home';
import SignUpComponent from './components/signup';

const App: React.FC = () => {
  const { accessToken } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginComponent />} />
      <Route path="/signup" element={<SignUpComponent />} />

      {/* Apply ProtectedRoute directly on the component, not as Route */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      {/* Redirect to /items if authenticated, else to /login */}
      <Route
        path="/"
        element={<Navigate to={accessToken ? '/home' : '/login'} />}
      />
    </Routes>
  );
};

export default App;
