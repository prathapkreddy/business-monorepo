import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from './axiosInstance';

export const authApi = {
    authenticateWithGoogle: async (idToken: string, referralCode?: string) => {
        const response = await axiosInstance.post('/auth/google', { idToken, referralCode });
        const { token, user } = response.data;
        await AsyncStorage.setItem('authToken', token);
        return { token, user };
    },
    signOut: async () => {
        await AsyncStorage.removeItem('authToken');
    },
};
