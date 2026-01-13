import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // 1. Show a loading spinner while checking authentication status
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-sm text-gray-500">Verifying session...</p>
        </div>
      </div>
    );
  }

  // 2. If no user is found, redirect to Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. If authenticated, render the protected page
  return children;
};

export default PrivateRoute;