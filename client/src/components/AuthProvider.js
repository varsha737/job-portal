import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/features/auth/authSlice';
import axios from '../api/axios';

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const { data } = await axios.get('/auth/current-user', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (data?.success) {
            dispatch(setUser(data.user));
          }
        }
      } catch (error) {
        console.error('Error loading user:', error);
        localStorage.removeItem('token');
      }
    };

    loadUser();
  }, [dispatch]);

  return <>{children}</>;
};

export default AuthProvider; 