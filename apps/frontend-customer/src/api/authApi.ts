import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from './axiosInstance';

export const authApi = {
    signInWithGoogle: async (idToken: string) => {
        const response = await axiosInstance.post('/auth/google-signin', { idToken });
        const { token, user } = response.data; // adjust to match your backend's response shape
        await AsyncStorage.setItem('authToken', token);
        return { token, user };
    },
    signOut: async () => {
        await AsyncStorage.removeItem('authToken');
    },
};