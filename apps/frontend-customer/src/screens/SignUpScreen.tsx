import React, { useState } from 'react';
import { Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import customAlert from '../utils/alert';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { authApi } from '../api/authApi';
import { useGoogleSignIn } from '../utils/authHelper';

const SignUpScreen = ({ navigation }: any) => {
    const [loading, setLoading] = useState(false);
    const { signIn, loading: authLoading } = useGoogleSignIn();

    const handleGoogleSignUp = async () => {
        setLoading(true);
        try {
            const user = await signIn();
            if (!user) {
                setLoading(false);
                return;
            }
            const idToken = await signIn();

            // Integrate with backend
            try {
                await authApi.signUpWithGoogle(idToken);
            } catch (backendError) {
                // If backend integration fails, sign out from Firebase
                await signOut(auth);
                throw backendError;
            }

            customAlert('Success', 'Account created successfully');
        } catch (error: any) {
            console.error('Sign up error:', error);
            customAlert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    const isButtonDisabled = loading || authLoading;

    return (
        <View className="flex-1 justify-center bg-white p-5">
            <Text className="mb-2.5 text-center text-[28px] font-bold">Create Account</Text>
            <Text className="mb-[30px] text-center text-base text-[#666]">Join us today</Text>

            <TouchableOpacity
                className="flex-row items-center justify-center rounded-lg bg-[#DB4437] p-[15px]"
                onPress={handleGoogleSignUp}
                disabled={isButtonDisabled}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text className="text-base font-bold text-white">Sign up with Google</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                <Text className="mt-5 text-center text-[#007AFF]">
                    Already have an account? Sign In
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default SignUpScreen;
