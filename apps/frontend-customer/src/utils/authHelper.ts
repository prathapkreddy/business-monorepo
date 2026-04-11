import { Platform } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { 
    GoogleAuthProvider, 
    signInWithCredential, 
    signInWithPopup 
} from 'firebase/auth';
import { auth } from '../config/firebase';

WebBrowser.maybeCompleteAuthSession();

export const useGoogleSignIn = () => {
    const [request, response, promptAsync] = Google.useAuthRequest({
        webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID || 'dummy-web-id',
        iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
        androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID,
    });

    const signIn = async () => {
        if (Platform.OS === 'web') {
            const provider = new GoogleAuthProvider();
            // Optional: provider.addScope('profile');
            // Optional: provider.addScope('email');
            const result = await signInWithPopup(auth, provider);
            return result.user;
        } else {
            const result = await promptAsync();
            if (result?.type === 'success') {
                const { id_token } = result.params;
                const credential = GoogleAuthProvider.credential(id_token);
                const userCredential = await signInWithCredential(auth, credential);
                return userCredential.user;
            }
            return null;
        }
    };

    return { signIn, loading: !request && Platform.OS !== 'web' };
};
