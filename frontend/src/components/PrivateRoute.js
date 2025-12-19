import React from 'react';
import {Navigate} from 'react-router-dom';
import {useAuth} from '../store/hooks';

const PrivateRoute = ({children}) => {
  const {user, loading} = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
