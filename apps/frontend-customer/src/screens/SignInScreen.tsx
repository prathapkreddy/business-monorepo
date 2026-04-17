import React, { useState } from 'react';
import { Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import customAlert from '../utils/alert';
import { authApi } from '../api/authApi';
import { useGoogleSignIn } from '../utils/authHelper';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/slices/authSlice';

const SignInScreen = ({ navigation }: any) => {
    const [loading, setLoading] = useState(false);
    const { signIn, loading: authLoading } = useGoogleSignIn();
    const dispatch = useDispatch();
    const handleGoogleSignIn = async () => {
        setLoading(true);
        try {
            const idToken = await signIn();
            if (!idToken) return;

            const { token, user } = await authApi.signInWithGoogle(idToken);
            dispatch(setUser({ user, idToken: token }));
        } catch (error: any) {
            console.error('Sign in error:', error);
            customAlert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 justify-center bg-white p-5">
            <Text className="mb-2.5 text-center text-[28px] font-bold">Welcome</Text>
            <Text className="mb-[30px] text-center text-base text-[#666]">Sign in to continue</Text>

            <TouchableOpacity
                className="flex-row items-center justify-center rounded-lg bg-[#DB4437] p-[15px]"
                onPress={handleGoogleSignIn}
                disabled={loading || authLoading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text className="text-base font-bold text-white">Sign in with Google</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text className="mt-5 text-center text-[#007AFF]">
                    Don't have an account? Sign Up
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default SignInScreen;
