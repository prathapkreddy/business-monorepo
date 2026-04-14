import { Platform } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

export const useGoogleSignIn = () => {
    const [request, response, promptAsync] = Google.useAuthRequest({
        webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
        androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID,
        responseType: 'id_token',  // explicitly request id_token
        usePKCE: false,            // required when using id_token on web
    });

    console.log('Redirect URI:', request?.redirectUri);

    const signIn = async (): Promise<string | null> => {
        const result = await promptAsync();
        console.log('Auth result:', result);
        if (result?.type === 'success') {
            return result.params.id_token;
        }
        return null;
    };

    return { signIn, loading: !request };
};