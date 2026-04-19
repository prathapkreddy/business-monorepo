import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Image,
    TextInput,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import customAlert from '../utils/alert';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { logout } from '../store/slices/authSlice';
import { authApi } from '../api/authApi';
import { LogOut, User, Phone, Mail, Shield, HelpCircle, Info, Trash2 } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../hooks/useAuth';
import ProfileItem from '../components/screen/profile/ProfileItem';
import LinkItem from '../components/screen/profile/LinkItem';

const ProfileScreen = () => {
    const navigation = useNavigation<any>();
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

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setFetching(true);
        try {
            const response = await axiosInstance.get('/customers/profile');
            const customer = response.data;
            setName(customer.name || authUser?.displayName || '');
            setPhoneNumber(customer.phoneNumber || '');
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
                phoneNumber,
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
                        icon={User}
                        label="Name"
                        value={name}
                        isEditing={isEditing}
                        editable={true}
                        onChangeText={setName}
                    />
                    <ProfileItem
                        icon={Phone}
                        label="Phone Number"
                        value={phoneNumber}
                        isEditing={isEditing}
                        editable={true}
                        onChangeText={setPhoneNumber}
                    />
                    <ProfileItem
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
                        icon={Shield}
                        label="Privacy Policy"
                        onPress={() => navigation.navigate('WebView', { title: 'Privacy Policy' })}
                    />
                    <LinkItem
                        icon={HelpCircle}
                        label="Help & Support"
                        onPress={() => navigation.navigate('WebView', { title: 'Help & Support' })}
                    />
                    <LinkItem
                        icon={Info}
                        label="About Us"
                        onPress={() => navigation.navigate('WebView', { title: 'About Us' })}
                    />
                    <LinkItem
                        icon={Trash2}
                        label="Request Account Deletion"
                        onPress={() => {}}
                        color="#FF3B30"
                    />
                </View>

                <TouchableOpacity
                    className="mx-5 mt-[30px] flex-row items-center justify-center rounded-[12px] bg-[#F2F2F7] p-[15px]"
                    onPress={handleSignOut}
                >
                    <LogOut size={20} color="#FF3B30" className="mr-2.5" />
                    <Text className="text-base font-bold text-[#FF3B30]">Logout</Text>
                </TouchableOpacity>

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
};

export default ProfileScreen;
