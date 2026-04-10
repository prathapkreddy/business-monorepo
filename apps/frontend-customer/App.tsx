import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';
import { AuthSync } from './src/components/AuthSync';

export default function App() {
    return (
        <Provider store={store}>
            <AuthSync />
            <StatusBar style="auto" />
            <AppNavigator />
        </Provider>
    );
}
