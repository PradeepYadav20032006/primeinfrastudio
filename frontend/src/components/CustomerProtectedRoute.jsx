import { Navigate } from 'react-router-dom';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import Loader from './Loader';

const CustomerProtectedRoute = ({ children }) => {
  const { loading, isAuthenticated } = useCustomerAuth();

  if (loading) return <Loader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children;
};

export default CustomerProtectedRoute;
