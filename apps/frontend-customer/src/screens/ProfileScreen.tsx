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
import { LogOut, User, Phone, Mail, Shield, HelpCircle, Info, FileText } from 'lucide-react-native';
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
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const WA_NUMBER = '919490599600';
    const WA_MESSAGE = encodeURIComponent("Hi! I'd like to book a home service.");
    const WA_URL = `https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`;

    const handleSetName = React.useCallback((text: string) => setName(text), []);
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
            setName(customer.name || authUser?.displayName || '');
            setPhoneNumber(formatPhoneNumber(customer.phoneNumber || ''));
            setEmail(customer.email || authUser?.email || '');
            setPhotoUrl(customer.photoUrl || authUser?.photoURL || '');
        } catch (error) {
            console.error('Error fetching profile:', error);
            // Fallback to authUser if DB fetch fails
            setName(authUser?.displayName || '');
            setEmail(authUser?.email || '');
            setPhotoUrl(authUser?.photoURL || '');
        } finally {
            setFetching(false);
        }
    };

    const handleUpdateProfile = async () => {
        setLoading(true);
        try {
            await axiosInstance.put('/customers/profile', {
                name,
                phoneNumber: phoneNumber.replace(/\D/g, ''),
            });
            customAlert('Profile Updated', 'Your profile has been updated successfully.');
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            customAlert('Update Failed', 'There was an error updating your profile.');
        } finally {
            setLoading(false);
        }
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
                    <TouchableOpacity
                        className="rounded-full border border-[#5856D6] bg-[#F0F0FF] px-5 py-2"
                        onPress={() => (isEditing ? handleUpdateProfile() : setIsEditing(true))}
                    >
                        <Text className="font-semibold text-[#5856D6]">
                            {isEditing ? 'Save Changes' : 'Edit Profile'}
                        </Text>
                    </TouchableOpacity>
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
