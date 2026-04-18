import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import MainTabNavigator from './MainTabNavigator';
import { ActivityIndicator, View, useWindowDimensions, Platform } from 'react-native';
import BlockadeScreen from '../screens/BlockadeScreen';

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
                        <Stack.Screen name="Main" component={MainTabNavigator} />
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
