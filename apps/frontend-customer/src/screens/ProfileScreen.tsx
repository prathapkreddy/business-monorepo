import React, { useState, useEffect, useRef } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Image,
    TextInput,
    ScrollView,
    ActivityIndicator,
    Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import customAlert from '../utils/alert';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { logout } from '../store/slices/authSlice';
import { authApi } from '../api/authApi';
import { LogOut, User, Phone, Mail, Shield, HelpCircle, Info, FileText, Gift, ChevronRight } from 'lucide-react-native';
import { useNavigation, useScrollToTop } from '@react-navigation/native';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../hooks/useAuth';
import ProfileItem from '../components/screen/profile/ProfileItem';
import LinkItem from '../components/screen/profile/LinkItem';

const ProfileScreen = () => {
    const navigation = useNavigation<any>();
    const scrollRef = useRef<ScrollView>(null);
    useScrollToTop(scrollRef);
    const dispatch = useDispatch();
    const { handleSignOut: handleAuthSignOut } = useAuth();
    const { user: authUser } = useSelector((state: RootState) => state.auth);
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [photoUrl, setPhotoUrl] = useState('');
    const [referralCode, setReferralCode] = useState('');
    const [originalName, setOriginalName] = useState('');
    const [originalPhoneNumber, setOriginalPhoneNumber] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [nameError, setNameError] = useState('');
    const [phoneError, setPhoneError] = useState('');

    const WA_NUMBER = '919490599600';
    const WA_MESSAGE = encodeURIComponent("Hi! I'd like to book a home service.");
    const WA_URL = `https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`;

    const handleSetName = React.useCallback((text: string) => {
        // Only alphabets and spaces, max length 20
        const filtered = text.replace(/[^a-zA-Z\s]/g, '');
        if (filtered.length <= 20) {
            setName(filtered);
            setNameError('');
        }
    }, []);
    const formatPhoneNumber = (text: string) => {
        const cleaned = text.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
        if (match) {
            const part1 = match[1];
            const part2 = match[2];
            const part3 = match[3];

            if (part3) {
                return `(${part1}) ${part2}-${part3}`;
            } else if (part2) {
                return `(${part1}) ${part2}`;
            } else if (part1) {
                return `(${part1}`;
            }
        }
        return text;
    };

    const handleSetPhoneNumber = React.useCallback((text: string) => {
        const cleaned = text.replace(/\D/g, '');
        if (cleaned.length <= 10) {
            setPhoneNumber(formatPhoneNumber(cleaned));
            setPhoneError('');
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setFetching(true);
        try {
            const response = await axiosInstance.get('/customers/profile');
            const customer = response.data;
            const fetchedName = customer.name || authUser?.displayName || '';
            const fetchedPhone = customer.phoneNumber || '';
            setName(fetchedName);
            setOriginalName(fetchedName);
            setPhoneNumber(formatPhoneNumber(fetchedPhone));
            setOriginalPhoneNumber(formatPhoneNumber(fetchedPhone));
            setEmail(customer.email || authUser?.email || '');
            setPhotoUrl(customer.photoUrl || authUser?.photoURL || '');
            setReferralCode(customer.referralCode || '');
        } catch (error) {
            console.error('Error fetching profile:', error);
            // Fallback to authUser if DB fetch fails
            const fallbackName = authUser?.displayName || '';
            setName(fallbackName);
            setOriginalName(fallbackName);
            setEmail(authUser?.email || '');
            setPhotoUrl(authUser?.photoURL || '');
        } finally {
            setFetching(false);
        }
    };

    const handleUpdateProfile = async () => {
        const cleanedPhone = phoneNumber.replace(/\D/g, '');

        // Check if no changes are made
        if (name === originalName && cleanedPhone === originalPhoneNumber.replace(/\D/g, '')) {
            setIsEditing(false);
            return;
        }

        // Validation
        let hasError = false;
        if (!name.trim()) {
            setNameError('Name is required');
            hasError = true;
        } else if (name.length > 20) {
            setNameError('Name must be max 20 characters');
            hasError = true;
        }

        if (cleanedPhone.length !== 10) {
            setPhoneError('Phone number must be exactly 10 digits');
            hasError = true;
        }

        if (hasError) return;

        setLoading(true);
        try {
            await axiosInstance.put('/customers/profile', {
                name: name.trim(),
                phoneNumber: cleanedPhone,
            });
            customAlert('Profile Updated', 'Your profile has been updated successfully.');
            setOriginalName(name.trim());
            setOriginalPhoneNumber(phoneNumber);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            customAlert('Update Failed', 'There was an error updating your profile.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setName(originalName);
        setPhoneNumber(originalPhoneNumber);
        setNameError('');
        setPhoneError('');
        setIsEditing(false);
    };

    const handleSignOut = () => {
        customAlert('Sign Out', 'Are you sure you want to sign out?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Sign Out',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await handleAuthSignOut();
                        dispatch(logout());
                    } catch (error) {
                        console.error('Logout error:', error);
                    }
                },
            },
        ]);
    };

    if (fetching) {
        return (
            <View className="flex-1 items-center justify-center bg-[#f8f9fa]">
                <ActivityIndicator size="large" color="#5856D6" />
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-[#f8f9fa]" style={{ flex: 1 }}>
            <ScrollView
                ref={scrollRef}
                className="flex-1"
                style={{ flex: 1 }}
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
            >
                <View className="items-center border-b border-[#eee] bg-white p-[30px]">
                    {photoUrl ? (
                        <Image
                            source={{ uri: photoUrl }}
                            className="mb-[15px] h-[100px] w-[100px] rounded-full bg-[#eee]"
                        />
                    ) : (
                        <View className="mb-[15px] h-[100px] w-[100px] items-center justify-center rounded-full bg-[#F2F2F7]">
                            <User size={50} color="#8E8E93" />
                        </View>
                    )}
                    <Text className="mb-2.5 text-[22px] font-bold text-[#333]">
                        {name || 'User'}
                    </Text>
                    <View className="mt-4 flex-row items-center space-x-4">
                        <TouchableOpacity
                            className={`flex-1 rounded-xl px-6 py-3 shadow-sm ${
                                isEditing ? 'bg-[#5856D6]' : 'bg-[#5856D6]'
                            }`}
                            onPress={() => (isEditing ? handleUpdateProfile() : setIsEditing(true))}
                            activeOpacity={0.7}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFFFFF" size="small" />
                            ) : (
                                <Text className="text-center font-bold text-white">
                                    {isEditing ? 'Save Changes' : 'Edit Profile'}
                                </Text>
                            )}
                        </TouchableOpacity>
                        {isEditing && (
                            <TouchableOpacity
                                className="ml-2 flex-1 rounded-xl border border-[#C7C7CC] bg-white px-6 py-3 shadow-sm"
                                onPress={handleCancel}
                                activeOpacity={0.7}
                            >
                                <Text className="text-center font-bold text-[#8E8E93]">Cancel</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                <View className="mt-5 border-y border-[#eee] bg-white px-5">
                    <ProfileItem
                        key="name"
                        icon={User}
                        label="Name"
                        value={name}
                        isEditing={isEditing}
                        editable={true}
                        onChangeText={handleSetName}
                    />
                    {nameError ? (
                        <Text className="mb-2 ml-[40px] mt-[-5px] text-xs text-[#FF3B30]">
                            {nameError}
                        </Text>
                    ) : null}
                    <ProfileItem
                        key="phone"
                        icon={Phone}
                        label="Phone Number"
                        value={phoneNumber}
                        isEditing={isEditing}
                        editable={true}
                        onChangeText={handleSetPhoneNumber}
                        keyboardType="phone-pad"
                        maxLength={14}
                    />
                    {phoneError ? (
                        <Text className="mb-2 ml-[40px] mt-[-5px] text-xs text-[#FF3B30]">
                            {phoneError}
                        </Text>
                    ) : null}
                    <ProfileItem
                        key="email"
                        icon={Mail}
                        label="Email"
                        value={email}
                        isEditing={isEditing}
                        editable={false}
                    />
                    <Text className="mb-2.5 mt-1 text-right text-xs text-[#999]">
                        Email cannot be updated
                    </Text>
                </View>

                {/* Refer and Earn Banner */}
                {!isEditing && (
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate('WebViewProfile', {
                                title: 'Refer & Earn',
                                referralCode: referralCode,
                            })
                        }
                        className="mx-5 mt-5 overflow-hidden rounded-2xl bg-[#5856D6]"
                        activeOpacity={0.9}
                    >
                        <View className="flex-row items-center justify-between p-5">
                            <View className="flex-1 pr-4">
                                <View className="mb-2 flex-row items-center">
                                    <Gift size={20} color="#FFD700" />
                                    <Text className="ml-2 font-bold text-white">Refer & Earn</Text>
                                </View>
                                <Text className="text-sm leading-5 text-white/90">
                                    Refer your friends and earn ₹50! Both you and your friend will
                                    earn ₹50.
                                </Text>
                            </View>
                            <ChevronRight size={24} color="white" />
                        </View>
                    </TouchableOpacity>
                )}

                <View className="mt-5 border-y border-[#eee] bg-white px-5">
                    <LinkItem
                        icon={Info}
                        label="About Us"
                        onPress={() => navigation.navigate('WebViewProfile', { title: 'About Us' })}
                    />
                    <LinkItem
                        icon={Shield}
                        label="Privacy Policy"
                        onPress={() =>
                            navigation.navigate('WebViewProfile', { title: 'Privacy Policy' })
                        }
                    />
                    <LinkItem
                        icon={FileText}
                        label="Terms of Service"
                        onPress={() =>
                            navigation.navigate('WebViewProfile', { title: 'Terms of Service' })
                        }
                    />
                    <LinkItem
                        icon={HelpCircle}
                        label="Help & Support"
                        onPress={() => Linking.openURL(WA_URL)}
                    />
                    {/*<LinkItem*/}
                    {/*    icon={Trash2}*/}
                    {/*    label="Request Account Deletion"*/}
                    {/*    onPress={() => {}}*/}
                    {/*    color="#FF3B30"*/}
                    {/*/>*/}
                </View>

                <TouchableOpacity
                    className="mx-5 mt-[30px] flex-row items-center justify-center rounded-[12px] bg-[#F2F2F7] p-[15px]"
                    onPress={handleSignOut}
                >
                    <View style={{ width: 28, alignItems: 'center', marginRight: 12 }}>
                        <LogOut size={24} color="#FF3B30" />
                    </View>
                    <Text className="text-base font-bold text-[#FF3B30]">Logout</Text>
                </TouchableOpacity>

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
};

export default ProfileScreen;
