import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hideLoading, showLoading } from '../../redux/features/alertSlice';
import axios from '../../api/axios';
import { setUser } from '../../redux/features/auth/authSlice';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const getUser = async () => {
        try {
            dispatch(showLoading());
            const token = localStorage.getItem('token');
            
            if (!token) {
                throw new Error('No token found');
            }

            const { data } = await axios.post('/auth/get-user', 
                { token }, 
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            dispatch(hideLoading());
            
            if (data.success) {
                dispatch(setUser(data.user));
            } else {
                localStorage.clear();
                return <Navigate to="/login" />;
            }
        } catch (error) {
            console.error('Private route error:', error);
            localStorage.clear();
            dispatch(hideLoading());
            return <Navigate to="/login" />;
        }
    };

    useEffect(() => {
        if (!user) {
            getUser();
        }
    }, [user]);

    if (!localStorage.getItem('token')) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default PrivateRoute;
