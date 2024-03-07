import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { backendBaseUrl } from '../../config';

// This could be moved to a separate file
const useAuth = () => {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await axios.get(`https://${backendBaseUrl}/api/logout/`);
      localStorage.removeItem('token');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return { logout };
};

const LogoutAndRedirect = () => {
  const { logout } = useAuth();

  useEffect(() => {
    logout();
  }, [logout]);

  return null;
};

export default LogoutAndRedirect;