import React, { useState } from 'react';
import { Text, View, TouchableOpacity, ActivityIndicator, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useAuth } from '../../hooks/useAuth';

const AuthScreen = () => {
    const { loading, handleGoogleAuth } = useAuth();
    const [referralCode, setReferralCode] = useState('');
    const [showReferralInput, setShowReferralInput] = useState(false);
    const [isReferralApplied, setIsReferralApplied] = useState(false);
    const [tempReferralCode, setTempReferralCode] = useState('');

    const handleApplyReferral = () => {
        if (tempReferralCode.trim()) {
            setReferralCode(tempReferralCode.trim());
            setIsReferralApplied(true);
        }
    };

    const handleCancelReferral = () => {
        setTempReferralCode('');
        setReferralCode('');
        setIsReferralApplied(false);
        setShowReferralInput(false);
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-white"
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-6">
                <View className="flex-1 justify-center">
                    <View className="mb-12 items-center">
                        <Text className="text-3xl font-bold text-[#1a1a18]">Welcome</Text>
                        <Text className="mt-2 text-base text-[#666] text-center">
                            Continue with Google to access your home services
                        </Text>
                    </View>

                    <TouchableOpacity
                        className="flex-row items-center justify-center rounded-xl bg-[#DB4437] py-4 shadow-sm"
                        onPress={() => handleGoogleAuth(referralCode)}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text className="text-lg font-bold text-white">Continue with Google</Text>
                        )}
                    </TouchableOpacity>

                    <View className="mt-8">
                        {!showReferralInput ? (
                            <TouchableOpacity onPress={() => setShowReferralInput(true)}>
                                <Text className="text-center text-[#007AFF] font-medium">
                                    Have a referral code?
                                </Text>
                            </TouchableOpacity>
                        ) : (
                            <View className="animate-fade-in">
                                <View className="flex-row justify-between items-center mb-2">
                                    <Text className="text-sm font-medium text-[#1a1a18]">Referral Code</Text>
                                    {isReferralApplied && (
                                        <Text className="text-xs font-bold text-green-600">✓ APPLIED</Text>
                                    )}
                                </View>
                                
                                <View className="flex-row space-x-2">
                                    <TextInput
                                        className={`h-12 flex-1 rounded-xl border ${isReferralApplied ? 'border-green-500 bg-green-50' : 'border-[#e8e8e4] bg-[#fafaf8]'} px-4 text-base`}
                                        placeholder="Enter referral code"
                                        value={tempReferralCode}
                                        onChangeText={setTempReferralCode}
                                        autoCapitalize="characters"
                                        editable={!isReferralApplied}
                                    />
                                    {!isReferralApplied ? (
                                        <TouchableOpacity 
                                            onPress={handleApplyReferral}
                                            className="h-12 bg-[#1a1a18] px-6 rounded-xl justify-center items-center ml-2"
                                        >
                                            <Text className="text-white font-bold">Apply</Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <TouchableOpacity 
                                            onPress={() => setIsReferralApplied(false)}
                                            className="h-12 bg-gray-200 px-6 rounded-xl justify-center items-center"
                                        >
                                            <Text className="text-[#1a1a18] font-bold">Edit</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>

                                <TouchableOpacity 
                                    onPress={handleCancelReferral}
                                    className="mt-3"
                                >
                                    <Text className="text-center text-red-500 text-sm font-medium">
                                        Cancel
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>

                <View className="mt-auto pt-8">
                    <Text className="text-center text-xs text-[#999] leading-5">
                        By continuing, you agree to our{' '}
                        <Text className="underline">Terms of Service</Text> and{' '}
                        <Text className="underline">Privacy Policy</Text>.
                    </Text>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default AuthScreen;
