import { createContext, useContext, useState, useEffect } from 'react';
import customerApi from '../utils/customerApi';

const CustomerAuthContext = createContext();

export const CustomerAuthProvider = ({ children }) => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('pis_customer_token');
    if (!token) {
      setLoading(false);
      return;
    }
    customerApi
      .get('/customer-auth/me')
      .then((res) => setCustomer(res.data.customer))
      .catch(() => {
        localStorage.removeItem('pis_customer_token');
        setCustomer(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const register = async (data) => {
    const res = await customerApi.post('/customer-auth/register', data);
    localStorage.setItem('pis_customer_token', res.data.token);
    setCustomer(res.data.customer);
    return res.data.customer;
  };

  const login = async (email, password) => {
    const res = await customerApi.post('/customer-auth/login', { email, password });
    localStorage.setItem('pis_customer_token', res.data.token);
    setCustomer(res.data.customer);
    return res.data.customer;
  };

  // credential = the Google ID token (JWT) handed to us by the Google
  // Identity Services button on success. The backend verifies it directly
  // with Google before trusting it.
  const googleLogin = async (credential) => {
    const res = await customerApi.post('/customer-auth/google', { credential });
    localStorage.setItem('pis_customer_token', res.data.token);
    setCustomer(res.data.customer);
    return res.data.customer;
  };

  const logout = async () => {
    try {
      await customerApi.post('/customer-auth/logout');
    } catch (e) {
      /* ignore network errors on logout */
    }
    localStorage.removeItem('pis_customer_token');
    setCustomer(null);
  };

  return (
    <CustomerAuthContext.Provider
      value={{ customer, setCustomer, register, login, googleLogin, logout, loading, isAuthenticated: !!customer }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
};

export const useCustomerAuth = () => useContext(CustomerAuthContext);
