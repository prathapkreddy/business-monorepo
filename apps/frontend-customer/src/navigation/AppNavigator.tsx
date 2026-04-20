import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import SignInScreen from '../components/auth/SignInScreen';
import SignUpScreen from '../components/auth/SignUpScreen';
import SplashScreen from '../components/onboarding/SplashScreen';
import OnboardingScreen from '../components/onboarding/OnboardingScreen';
import MainTabNavigator from './MainTabNavigator';
import WebViewScreenProfile from '../components/shared/WebViewScreenProfile';
import { ActivityIndicator, View, useWindowDimensions, Platform } from 'react-native';
import BlockadeScreen from '../components/shared/BlockadeScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const { width } = useWindowDimensions();
    const isLargeScreen = Platform.OS === 'web' && width > 768;

    if (isLargeScreen) {
        return <BlockadeScreen />;
    }

    return (
        <View className="flex-1">
            <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
                    <Stack.Screen name="Splash" component={SplashScreen} />
                    <Stack.Screen name="Onboarding" component={OnboardingScreen} />
                    {user ? (
                        // Protected Routes
                        <>
                            <Stack.Screen name="Main" component={MainTabNavigator} />
                            <Stack.Screen
                                name="WebViewProfile"
                                component={WebViewScreenProfile}
                                options={{ presentation: 'card' }}
                            />
                        </>
                    ) : (
                        // Auth Routes
                        <>
                            <Stack.Screen name="SignIn" component={SignInScreen} />
                            <Stack.Screen name="SignUp" component={SignUpScreen} />
                        </>
                    )}
                </Stack.Navigator>
            </NavigationContainer>
        </View>
    );
};

export default AppNavigator;
