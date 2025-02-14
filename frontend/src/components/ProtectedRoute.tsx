import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAuth } from '../store/slices/authSlice';
import Header from './Shared/Header';

interface ProtectedRouteProps {
  element: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const isAuth = useSelector(selectAuth);

  if (!isAuth) {
    return <Navigate to='/' />;
  }

  return <>{element}</>;
};

export default ProtectedRoute;
