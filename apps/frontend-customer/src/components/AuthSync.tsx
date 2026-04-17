import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setUser, setLoading } from '../store/slices/authSlice';
import axiosInstance from '../api/axiosInstance';

export const AuthSync: React.FC = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const restoreSession = async () => {
            dispatch(setLoading(true));
            try {
                const token = await AsyncStorage.getItem('authToken');
                if (!token) {
                    dispatch(setUser({ user: null, idToken: null }));
                    return;
                }

                // Validate token and fetch user from your backend
                const response = await axiosInstance.get('/customers/profile');
                const user = response.data;

                dispatch(
                    setUser({
                        user: {
                            uid: user.id,
                            email: user.email,
                            displayName: user.name,
                            photoURL: user.photoUrl,
                        },
                        idToken: token,
                    })
                );
            } catch (error) {
                // Token invalid or expired — clear it
                await AsyncStorage.removeItem('authToken');
                dispatch(setUser({ user: null, idToken: null }));
            } finally {
                dispatch(setLoading(false));
            }
        };

        restoreSession();
    }, [dispatch]);

    return null;
};
