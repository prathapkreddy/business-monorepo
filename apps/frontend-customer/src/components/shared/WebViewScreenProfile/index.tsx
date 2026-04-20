import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { useWebViewContent } from '../WebViewScreen/useWebViewContent';
import {
    WebViewContentAboutUs,
    WebViewContentPrivacyPolicy,
    WebViewContentService,
} from '../WebViewScreen/WebViewContent';

const WebViewScreenProfile = () => {
    const { title, pageData, loading, error, handleClose, navigation } = useWebViewContent();
    const insets = useSafeAreaInsets();

    const headerPaddingTop = insets.top > 0 ? insets.top : 0;

    const Header = (
        <View
            className="flex-row items-center justify-between border-b border-[#F2F2F7] bg-white px-2.5 pb-[15px] shadow-sm shadow-black/10"
            style={{ paddingTop: headerPaddingTop + 20, elevation: 3 }}
        >
            <TouchableOpacity onPress={handleClose} className="p-2.5">
                <ArrowLeft color="#1C1C1E" size={28} />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-[#1C1C1E]">{title}</Text>
            <View className="w-12" />
        </View>
    );

    if (loading) {
        return (
            <View className="flex-1 bg-white">
                {Header}
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#5856D6" />
                </View>
            </View>
        );
    }

    if (error || !pageData) {
        return (
            <View className="flex-1 bg-white">
                {Header}
                <View className="flex-1 items-center justify-center">
                    <Text className="text-base text-[#6b6b67]">Failed to load content</Text>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="mt-4 rounded-full bg-[#5856D6] px-6 py-2"
                    >
                        <Text className="text-white">Go Back</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    const Content =
        title === 'About Us' ? (
            <WebViewContentAboutUs data={pageData} />
        ) : title === 'Privacy Policy' || title === 'Terms of Service' ? (
            <WebViewContentPrivacyPolicy data={pageData} />
        ) : pageData?.category ? (
            <WebViewContentService data={pageData} />
        ) : (
            <View className="flex-1 items-center justify-center bg-white">
                <Text className="text-base text-[#6b6b67]">Coming Soon</Text>
            </View>
        );

    return (
        <View className="flex-1 bg-white">
            {Header}
            {Content}
        </View>
    );
};

export default WebViewScreenProfile;
