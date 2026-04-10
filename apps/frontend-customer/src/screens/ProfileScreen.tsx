import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    TextInput,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import customAlert from '../utils/alert';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import {
    LogOut,
    ChevronRight,
    User,
    Phone,
    Mail,
    Shield,
    HelpCircle,
    Info,
    Trash2,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import axiosInstance from '../api/axiosInstance';

const ProfileScreen = () => {
    const navigation = useNavigation<any>();
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
        console.log('Sign out clicked');
        customAlert('Sign Out', 'Are you sure you want to sign out?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Sign Out', style: 'destructive', onPress: () => signOut(auth) },
        ]);
    };

    const ProfileItem = ({ icon: Icon, label, value, editable = false, onChangeText }: any) => (
        <View style={styles.itemContainer}>
            <View style={styles.itemHeader}>
                <Icon size={20} color="#666" style={styles.itemIcon} />
                <Text style={styles.itemLabel}>{label}</Text>
            </View>
            {isEditing && editable ? (
                <TextInput
                    style={styles.itemInput}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={`Enter ${label}`}
                />
            ) : (
                <Text style={[styles.itemValue, !value && styles.placeholderText]}>
                    {value || `No ${label} provided`}
                </Text>
            )}
        </View>
    );

    const LinkItem = ({ icon: Icon, label, onPress, color = '#333' }: any) => (
        <TouchableOpacity style={styles.linkItem} onPress={onPress}>
            <View style={styles.linkLeft}>
                <Icon size={20} color={color} style={styles.itemIcon} />
                <Text style={[styles.linkLabel, { color }]}>{label}</Text>
            </View>
            <ChevronRight size={20} color="#ccc" />
        </TouchableOpacity>
    );

    if (fetching) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#5856D6" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                {photoUrl ? (
                    <Image source={{ uri: photoUrl }} style={styles.profilePic} />
                ) : (
                    <View style={[styles.profilePic, styles.placeholderPic]}>
                        <User size={50} color="#8E8E93" />
                    </View>
                )}
                <Text style={styles.userName}>{name || 'User'}</Text>
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => (isEditing ? handleUpdateProfile() : setIsEditing(true))}
                >
                    <Text style={styles.editButtonText}>
                        {isEditing ? 'Save Changes' : 'Edit Profile'}
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <ProfileItem
                    icon={User}
                    label="Name"
                    value={name}
                    editable={true}
                    onChangeText={setName}
                />
                <ProfileItem
                    icon={Phone}
                    label="Phone Number"
                    value={phoneNumber}
                    editable={true}
                    onChangeText={setPhoneNumber}
                />
                <ProfileItem icon={Mail} label="Email" value={email} editable={false} />
                <Text style={styles.infoText}>Email cannot be updated</Text>
            </View>

            <View style={styles.section}>
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

            <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                <LogOut size={20} color="#FF3B30" style={{ marginRight: 10 }} />
                <Text style={styles.signOutText}>Logout</Text>
            </TouchableOpacity>

            <View style={{ height: 40 }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        alignItems: 'center',
        padding: 30,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    profilePic: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 15,
        backgroundColor: '#eee',
    },
    placeholderPic: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F2F2F7',
    },
    userName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    editButton: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F0F0FF',
        borderWidth: 1,
        borderColor: '#5856D6',
    },
    editButtonText: {
        color: '#5856D6',
        fontWeight: '600',
    },
    section: {
        backgroundColor: '#fff',
        marginTop: 20,
        paddingHorizontal: 20,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    itemContainer: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    itemHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    itemIcon: {
        marginRight: 10,
    },
    itemLabel: {
        fontSize: 14,
        color: '#888',
        fontWeight: '500',
    },
    itemValue: {
        fontSize: 16,
        color: '#333',
        paddingLeft: 30,
    },
    itemInput: {
        fontSize: 16,
        color: '#333',
        paddingLeft: 30,
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#5856D6',
    },
    placeholderText: {
        color: '#ccc',
        fontStyle: 'italic',
    },
    infoText: {
        fontSize: 12,
        color: '#999',
        textAlign: 'right',
        marginTop: 5,
        marginBottom: 10,
    },
    linkItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    linkLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    linkLabel: {
        fontSize: 16,
        fontWeight: '500',
    },
    signOutButton: {
        flexDirection: 'row',
        backgroundColor: '#F2F2F7',
        marginHorizontal: 20,
        marginTop: 30,
        padding: 15,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    signOutText: {
        color: '#FF3B30',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default ProfileScreen;
