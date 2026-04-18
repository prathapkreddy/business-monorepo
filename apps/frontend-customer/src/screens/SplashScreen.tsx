import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const SplashScreen = ({ navigation }: any) => {
    const { user, loading } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (loading) return;

        const init = async () => {
            try {
                const onboardingDone = await AsyncStorage.getItem('onboarding_done');

                setTimeout(() => {
                    if (user) {
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Main' }],
                        });
                    } else {
                        if (onboardingDone === 'true') {
                            navigation.replace('SignIn');
                        } else {
                            navigation.replace('Onboarding');
                        }
                    }
                }, 1200);
            } catch (e) {
                navigation.replace('Onboarding');
            }
        };

        init();
    }, [navigation, loading]);

    return (
        <View className="flex-1 items-center justify-center bg-[#4F46E5]">
            {/* Logo */}
            <Image
                source={require('../../assets/icon.png')}
                style={{ width: 90, height: 90, marginBottom: 20 }}
                resizeMode="contain"
            />

            <Text className="text-xl font-bold text-white">YourApp</Text>

            <ActivityIndicator color="#fff" style={{ marginTop: 20 }} />
        </View>
    );
};

export default SplashScreen;
