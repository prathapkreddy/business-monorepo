import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    FlatList,
    Dimensions,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useNavigation } from '@react-navigation/native';
import axiosInstance from '../api/axiosInstance';
import * as LucideIcons from 'lucide-react-native';
import { Star, User } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.7;

const HomeScreen = () => {
    const navigation = useNavigation<any>();
    const { user: authUser } = useSelector((state: RootState) => state.auth);
    const [name, setName] = useState('');
    const [profilePic, setProfilePic] = useState('');
    const [fetching, setFetching] = useState(true);
    const [services, setServices] = useState<any[]>([]);
    const [offers, setOffers] = useState<any[]>([]);
    const [bestSellers, setBestSellers] = useState<any[]>([]);
    const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setFetching(true);
        try {
            const [profileRes, homeRes] = await Promise.all([
                axiosInstance.get('/customers/profile'),
                axiosInstance.get('/home/data'),
            ]);

            const customer = profileRes.data;
            setName(customer.name || authUser?.displayName || 'User');
            setProfilePic(customer.photoUrl || authUser?.photoURL || '');

            const homeData = homeRes.data;
            setServices(homeData.services || []);
            setOffers(homeData.offers || []);
            setBestSellers(homeData.bestSellers || []);
            setRecentlyViewed(homeData.recentlyViewed || []);
        } catch (error) {
            console.error('Error fetching home data:', error);
            setName(authUser?.displayName || 'User');
            // If home data fails, keep arrays empty
        } finally {
            setFetching(false);
        }
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    const ServiceCard = ({ item }: { item: any }) => {
        const Icon = (LucideIcons as any)[item.icon] || LucideIcons.Home;
        return (
            <TouchableOpacity
                className="elevation-5 mb-2.5 mr-5 rounded-[20px] bg-white p-5 shadow-lg shadow-black/10"
                style={{ width: CARD_WIDTH }}
            >
                <View
                    className="mb-[15px] h-[60px] w-[60px] items-center justify-center rounded-[15px]"
                    style={{ backgroundColor: item.color + '15' }}
                >
                    <Icon color={item.color} size={32} />
                </View>
                <Text className="mb-2.5 text-lg font-semibold text-[#1C1C1E]" numberOfLines={1}>
                    {item.name}
                </Text>
                <View className="mt-1 flex-row items-end justify-between">
                    <View>
                        <View className="mb-1 flex-row items-center">
                            <Text className="mr-2 text-lg font-bold text-[#5856D6]">
                                ₹{item.price}
                            </Text>
                            <Text className="text-sm text-[#8E8E93] line-through">₹{item.mrp}</Text>
                        </View>
                        <View className="flex-row items-center rounded-lg bg-[#FFFBE6] px-2 py-1">
                            <Star size={14} color="#FFD60A" fill="#FFD60A" />
                            <Text className="ml-1 text-xs font-semibold text-[#FFD60A]">
                                {item.rating}
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const OfferCard = ({ item }: { item: any }) => (
        <View
            className="mr-[15px] flex-row items-center justify-between rounded-[20px] p-5"
            style={{ width: width * 0.7, backgroundColor: item.color }}
        >
            <View>
                <Text className="text-xl font-bold text-white">{item.title}</Text>
                <Text className="mt-1 text-[13px] text-white/90">{item.subtitle}</Text>
            </View>
            <View className="rounded-[10px] bg-white px-3 py-2">
                <Text className="text-xs font-bold" style={{ color: item.color }}>
                    {item.code}
                </Text>
            </View>
        </View>
    );

    const BestSellerCard = ({ item }: { item: any }) => (
        <TouchableOpacity className="elevation-2 mb-[15px] flex-row overflow-hidden rounded-[20px] border border-[#F2F2F7] bg-white shadow-sm shadow-black/5">
            <Image source={{ uri: item.image }} className="h-[100px] w-[100px]" />
            <View className="flex-1 justify-center p-[15px]">
                <Text className="mb-2 text-base font-bold text-[#1C1C1E]">{item.name}</Text>
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        <Text className="mr-2 text-lg font-bold text-[#5856D6]">₹{item.price}</Text>
                        <Text className="text-sm text-[#8E8E93] line-through">₹{item.mrp}</Text>
                    </View>
                    <View className="flex-row items-center rounded-lg bg-[#FFFBE6] px-2 py-1">
                        <Star size={12} color="#FFD60A" fill="#FFD60A" />
                        <Text className="ml-0.5 text-[11px] font-semibold text-[#FFD60A]">
                            {item.rating}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    if (fetching) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#5856D6" />
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white" style={{ flex: 1 }}>
            <ScrollView
                className="flex-1"
                style={{ flex: 1 }}
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
            >
                <View className="flex-row items-center justify-between px-5 py-5">
                    <View>
                        <Text className="text-base text-[#8E8E93]">{getGreeting()},</Text>
                        <Text className="text-2xl font-bold text-[#1C1C1E]">{name}</Text>
                    </View>
                    <TouchableOpacity className="p-1">
                        {profilePic ? (
                            <Image
                                source={{ uri: profilePic }}
                                className="h-[44px] w-[44px] rounded-full bg-[#F2F2F7]"
                            />
                        ) : (
                            <View className="h-[44px] w-[44px] items-center justify-center rounded-full bg-[#F2F2F7]">
                                <User color="#8E8E93" size={24} />
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                <View>
                    <View className="mb-[15px] mt-[25px] flex-row items-center justify-between px-5">
                        <Text className="text-xl font-bold text-[#1C1C1E]">Featured Services</Text>
                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate('ServiceList', {
                                    title: 'Featured Services',
                                    data: services,
                                    type: 'services',
                                })
                            }
                        >
                            <Text className="text-sm font-semibold text-[#5856D6]">See All</Text>
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={services}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item.id}
                        snapToInterval={CARD_WIDTH + 20}
                        decelerationRate="fast"
                        contentContainerStyle={{ paddingLeft: 20, paddingRight: 10 }}
                        renderItem={({ item }) => <ServiceCard item={item} />}
                    />

                    <View className="mb-[15px] mt-[25px] flex-row items-center justify-between px-5">
                        <Text className="text-xl font-bold text-[#1C1C1E]">Top Offers</Text>
                    </View>

                    <FlatList
                        data={offers}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{ paddingLeft: 20, paddingRight: 10 }}
                        renderItem={({ item }) => <OfferCard item={item} />}
                    />

                    <View className="m-5 h-[140px] flex-row overflow-hidden rounded-[20px] bg-[#5856D6] p-5">
                        <View className="flex-1 justify-center">
                            <Text className="text-[28px] font-extrabold text-white">₹150 OFF</Text>
                            <Text className="mb-[15px] text-base text-white/80">
                                On your first booking
                            </Text>
                            <TouchableOpacity className="self-start rounded-[10px] bg-white px-[15px] py-2">
                                <Text className="text-sm font-bold text-[#5856D6]">Book Now</Text>
                            </TouchableOpacity>
                        </View>
                        <View className="absolute -right-[30px] -top-[30px] h-[150px] w-[150px] rounded-full bg-white/10" />
                    </View>

                    <View className="mb-[15px] mt-[25px] flex-row items-center justify-between px-5">
                        <Text className="text-xl font-bold text-[#1C1C1E]">Best Sellers</Text>
                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate('ServiceList', {
                                    title: 'Best Sellers',
                                    data: bestSellers,
                                    type: 'bestSellers',
                                })
                            }
                        >
                            <Text className="text-sm font-semibold text-[#5856D6]">See All</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="px-5 pb-5">
                        {bestSellers.map((item) => (
                            <BestSellerCard key={item.id} item={item} />
                        ))}
                    </View>

                    {recentlyViewed.length > 0 && (
                        <>
                            <View className="mb-[15px] mt-[25px] flex-row items-center justify-between px-5">
                                <Text className="text-xl font-bold text-[#1C1C1E]">
                                    Recently Viewed
                                </Text>
                            </View>
                            <View className="mb-[30px] flex-row justify-between px-5">
                                <View
                                    className="h-[100px] rounded-[15px] bg-[#F2F2F7]"
                                    style={{ width: (width - 60) / 2 }}
                                />
                                <View
                                    className="h-[100px] rounded-[15px] bg-[#F2F2F7]"
                                    style={{ width: (width - 60) / 2 }}
                                />
                            </View>
                        </>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default HomeScreen;
