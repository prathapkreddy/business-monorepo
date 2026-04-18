import React from 'react';
import { View, Text, Linking, TouchableOpacity } from 'react-native';

const BlockadeScreen = () => {
    return (
        <View className="flex-1 items-center justify-center bg-white p-5">
            <View className="max-w-[400px] items-center">
                <Text className="mb-5 text-center text-[28px] font-bold text-[#333]">
                    Mobile Only Access
                </Text>
                <Text className="mb-[30px] text-center text-lg leading-[26px] text-[#666]">
                    This application is optimized for mobile devices. Please access it from your
                    smartphone for the best experience.
                </Text>
                <TouchableOpacity
                    className="rounded-lg bg-[#007AFF] px-[30px] py-[15px]"
                    onPress={() => Linking.openURL('https://apps.apple.com')} // Placeholder
                >
                    <Text className="text-lg font-bold text-white">Download App</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default BlockadeScreen;
