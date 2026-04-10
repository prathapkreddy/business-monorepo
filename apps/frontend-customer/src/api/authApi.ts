import axiosInstance from './axiosInstance';

export const authApi = {
    signInWithGoogle: async (idToken: string) => {
        // This calls the backend to verify the token and potentially create/login the user
        const response = await axiosInstance.post('/auth/google-signin', { idToken });
        return response.data;
    },
    signUpWithGoogle: async (idToken: string) => {
        // Usually, sign-up and sign-in with Google are the same on the backend
        const response = await axiosInstance.post('/auth/google-signup', { idToken });
        return response.data;
    },
};
