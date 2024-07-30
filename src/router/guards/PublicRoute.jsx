import React from 'react';
import { Navigate } from 'react-router-dom';

export const PublicRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      return <Navigate to="/home" />;
    }
    return children;
};