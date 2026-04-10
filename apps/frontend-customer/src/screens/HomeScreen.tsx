import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    FlatList,
    Dimensions,
    Image,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import axiosInstance from '../api/axiosInstance';
import { Scissors, Zap, Car, Home as HomeIcon, Star, User } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.7;

const DUMMY_SERVICES = [
    {
        id: '1',
        name: 'Haircut & Styling',
        icon: Scissors,
        color: '#5856D6',
        price: '$30',
        rating: 4.8,
    },
    { id: '2', name: 'Electrical Repair', icon: Zap, color: '#FF9500', price: '$50', rating: 4.9 },
    { id: '3', name: 'Car Wash', icon: Car, color: '#007AFF', price: '$20', rating: 4.7 },
    { id: '4', name: 'Home Cleaning', icon: HomeIcon, color: '#34C759', price: '$40', rating: 4.9 },
];

const HomeScreen = () => {
    const { user: authUser } = useSelector((state: RootState) => state.auth);
    const [name, setName] = useState('');
    const [profilePic, setProfilePic] = useState('');
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setFetching(true);
        try {
            const response = await axiosInstance.get('/customers/profile');
            const customer = response.data;
            console.log('Customer:', { customer, authUser });
            setName(customer.name || authUser?.displayName || 'User');
            setProfilePic(customer.photoUrl || authUser?.photoURL || '');
        } catch (error) {
            console.error('Error fetching profile:', error);
            setName(authUser?.displayName || 'User');
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        console.log(profilePic);
    }, []);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    const ServiceCard = ({ item }: { item: (typeof DUMMY_SERVICES)[0] }) => {
        const Icon = item.icon;
        return (
            <TouchableOpacity style={styles.card}>
                <View style={[styles.iconContainer, { backgroundColor: item.color + '15' }]}>
                    <Icon color={item.color} size={32} />
                </View>
                <Text style={styles.serviceName}>{item.name}</Text>
                <View style={styles.cardFooter}>
                    <Text style={styles.price}>{item.price}</Text>
                    <View style={styles.ratingRow}>
                        <Star size={14} color="#FFD60A" fill="#FFD60A" />
                        <Text style={styles.ratingText}>{item.rating}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    if (fetching) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#5856D6" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.greetingText}>{getGreeting()},</Text>
                    <Text style={styles.nameText}>{name}</Text>
                </View>
                <TouchableOpacity style={styles.notificationButton}>
                    {profilePic ? (
                        <Image source={{ uri: profilePic }} style={styles.avatar} />
                    ) : (
                        <View style={[styles.avatar, styles.placeholderAvatar]}>
                            <User color="#8E8E93" size={24} />
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Featured Services</Text>
                    <TouchableOpacity>
                        <Text style={styles.seeAllText}>See All</Text>
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={DUMMY_SERVICES}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.id}
                    snapToInterval={CARD_WIDTH + 20}
                    decelerationRate="fast"
                    contentContainerStyle={styles.carouselContainer}
                    renderItem={({ item }) => <ServiceCard item={item} />}
                />

                <View style={styles.promoCard}>
                    <View style={styles.promoContent}>
                        <Text style={styles.promoTitle}>20% OFF</Text>
                        <Text style={styles.promoSubtitle}>On your first booking</Text>
                        <TouchableOpacity style={styles.promoButton}>
                            <Text style={styles.promoButtonText}>Book Now</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.promoCircle} />
                </View>

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recently Viewed</Text>
                </View>

                {/* Just for UI filling */}
                <View style={styles.placeholderRow}>
                    <View style={styles.placeholderItem} />
                    <View style={styles.placeholderItem} />
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
    },
    greetingText: {
        fontSize: 16,
        color: '#8E8E93',
    },
    nameText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1C1C1E',
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F2F2F7',
    },
    placeholderAvatar: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationButton: {
        padding: 4,
    },
    content: {
        flex: 1,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 25,
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1C1C1E',
    },
    seeAllText: {
        fontSize: 14,
        color: '#5856D6',
        fontWeight: '600',
    },
    carouselContainer: {
        paddingLeft: 20,
        paddingRight: 10,
    },
    card: {
        width: CARD_WIDTH,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        marginRight: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        marginBottom: 10,
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    serviceName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1C1C1E',
        marginBottom: 10,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 5,
    },
    price: {
        fontSize: 16,
        fontWeight: '700',
        color: '#5856D6',
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFBE6',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    ratingText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#FFD60A',
        marginLeft: 4,
    },
    promoCard: {
        margin: 20,
        padding: 20,
        backgroundColor: '#5856D6',
        borderRadius: 20,
        height: 140,
        flexDirection: 'row',
        overflow: 'hidden',
    },
    promoContent: {
        flex: 1,
        justifyContent: 'center',
    },
    promoTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#fff',
    },
    promoSubtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: 15,
    },
    promoButton: {
        backgroundColor: '#fff',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 10,
        alignSelf: 'flex-start',
    },
    promoButtonText: {
        color: '#5856D6',
        fontWeight: '700',
        fontSize: 14,
    },
    promoCircle: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        position: 'absolute',
        right: -30,
        top: -30,
    },
    placeholderRow: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    placeholderItem: {
        width: (width - 60) / 2,
        height: 100,
        backgroundColor: '#F2F2F7',
        borderRadius: 15,
    },
});

export default HomeScreen;
