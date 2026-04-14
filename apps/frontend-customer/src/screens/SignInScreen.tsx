import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import customAlert from '../utils/alert';
import { authApi } from '../api/authApi';
import { useGoogleSignIn } from '../utils/authHelper';
import {useDispatch} from "react-redux";
import {setUser} from "../store/slices/authSlice";

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
        <View style={styles.container}>
            <Text style={styles.title}>Welcome</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>

            <TouchableOpacity
                style={styles.googleButton}
                onPress={handleGoogleSignIn}
                disabled={loading || authLoading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Sign in with Google</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30,
        textAlign: 'center',
    },
    googleButton: {
        backgroundColor: '#DB4437', // Google Red
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    linkText: {
        marginTop: 20,
        color: '#007AFF',
        textAlign: 'center',
    },
});

export default SignInScreen;
