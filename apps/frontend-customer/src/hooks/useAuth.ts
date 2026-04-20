import { useState } from 'react';
import {
    getAuth,
    signInWithCredential,
    GoogleAuthProvider,
    getIdToken,
    signOut,
} from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { authApi } from '../api/authApi';

GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
});

export const useAuth = () => {
    const [loading, setLoading] = useState(false);

    const handleGoogleAuth = async (referralCode?: string) => {
        setLoading(true);
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();

            const googleIdToken = userInfo?.data?.idToken;
            if (!googleIdToken) throw new Error('No ID token received');

            const credential = GoogleAuthProvider.credential(googleIdToken);
            const { user } = await signInWithCredential(getAuth(), credential);

            // Get the Firebase ID token from the signed-in user
            const firebaseIdToken = await getIdToken(user);

            try {
                await authApi.authenticateWithGoogle(firebaseIdToken, referralCode);
            } catch (backendError: any) {
                console.error('Backend auth error:', backendError);
                await signOut(getAuth());
                throw backendError;
            }
        } catch (error: any) {
            console.error('Auth error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        setLoading(true);
        try {
            await authApi.signOut();
            await signOut(getAuth()); // sign out from Firebase
            await GoogleSignin.revokeAccess(); // force account picker on next sign-in
            await GoogleSignin.signOut(); // clear Google session
        } catch (error: any) {
            console.error('Sign out error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        handleGoogleAuth,
        handleSignOut,
    };
};
