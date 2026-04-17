import axios from 'axios';
import { store } from '../store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const axiosInstance = axios.create({
    baseURL: process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    async (config) => {
        let token = store.getState().auth.idToken;

        if (!token) {
            // If token is not in Redux state (e.g. after refresh), check AsyncStorage
            try {
                token = await AsyncStorage.getItem('authToken');
            } catch (e) {
                console.error('Error reading token from AsyncStorage', e);
            }
        }

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
