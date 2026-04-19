import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    FlatList,
    Dimensions,
    Image,
    RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useNavigation, useFocusEffect, useScrollToTop } from '@react-navigation/native';
import axiosInstance from '../api/axiosInstance';
import { User } from 'lucide-react-native';
import ServiceCard from '../components/screen/home/ServiceCard';
import OfferCard from '../components/screen/home/OfferCard';
import Services from '../components/screen/home/Services';
import OfferDetailModal from '../components/homeScreen/OfferDetailModal';
import { contentApi } from '../api/contentApi';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.7;

const HomeScreen = () => {
    const navigation = useNavigation<any>();
    const scrollRef = useRef<ScrollView>(null);
    useScrollToTop(scrollRef);
    const { user: authUser } = useSelector((state: RootState) => state.auth);
    const [name, setName] = useState('');
    const [profilePic, setProfilePic] = useState('');
    const [fetching, setFetching] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [services, setServices] = useState<any[]>([]);
    const [offers, setOffers] = useState<any[]>([]);
    const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);
    const [selectedOffer, setSelectedOffer] = useState<any>(null);
    const [offerModalVisible, setOfferModalVisible] = useState(false);

    const fetchData = useCallback(
        async (showRefreshing = true) => {
            // We only want to show the full screen loader if we have NO data at all
            const hasData = services.length > 0 || offers.length > 0;

            if (!hasData) {
                setFetching(true);
            } else if (showRefreshing) {
                setIsRefreshing(true);
            }

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
                setRecentlyViewed(homeData.recentlyViewed || []);
            } catch (error) {
                console.error('Error fetching home data:', error);
                setName(authUser?.displayName || 'User');
                // If home data fails, keep arrays empty
            } finally {
                setFetching(false);
                setIsRefreshing(false);
            }
        },
        [authUser?.displayName, authUser?.photoURL]
    );

    useFocusEffect(
        useCallback(() => {
            fetchData(false);
        }, [fetchData])
    );

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    const handleOfferPress = async (offer: any) => {
        try {
            // Fetch fresh data for the offer to ensure we have all details
            const freshOffer = await contentApi.getOfferDetails(offer.id);
            setSelectedOffer(freshOffer || offer);
        } catch (error) {
            console.error('Error fetching offer details:', error);
            setSelectedOffer(offer);
        }
        setOfferModalVisible(true);
    };

    if (fetching && services.length === 0 && offers.length === 0) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#5856D6" />
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white" style={{ flex: 1 }}>
            <ScrollView
                ref={scrollRef}
                className="flex-1"
                style={{ flex: 1 }}
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={fetchData} />}
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
                    </View>

                    <FlatList
                        data={services}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item.id}
                        snapToInterval={CARD_WIDTH + 20}
                        decelerationRate="fast"
                        contentContainerStyle={{
                            paddingLeft: 20,
                            paddingRight: 10,
                            marginBottom: 10,
                            marginTop: 10,
                        }}
                        renderItem={({ item }) => <ServiceCard item={item} width={CARD_WIDTH} />}
                    />

                    <View className="mb-[15px] mt-[25px] flex-row items-center justify-between px-5">
                        <Text className="text-xl font-bold text-[#1C1C1E]">Top Offers</Text>
                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate('ServiceList', {
                                    title: 'All Offers',
                                    data: offers,
                                    type: 'offers',
                                    onOfferPress: handleOfferPress,
                                })
                            }
                        >
                            <Text className="text-sm font-semibold text-[#5856D6]">See All</Text>
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={offers}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{ paddingLeft: 20, paddingRight: 10 }}
                        renderItem={({ item }) => (
                            <OfferCard
                                item={item}
                                width={width * 0.7}
                                onPress={() => handleOfferPress(item)}
                            />
                        )}
                    />

                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate('ServiceList', {
                                title: 'All Offers',
                                data: offers,
                                type: 'offers',
                                onOfferPress: handleOfferPress,
                            })
                        }
                        activeOpacity={0.9}
                        className="m-5 h-[140px] flex-row overflow-hidden rounded-[20px] bg-[#5856D6] p-5"
                    >
                        <View className="flex-1 justify-center">
                            <Text className="text-[24px] font-extrabold text-white">
                                Many More Offers!
                            </Text>
                            <Text className="mb-[15px] text-base text-white/80">
                                Click here to see all available offers
                            </Text>
                            <View className="self-start rounded-[10px] bg-white px-[15px] py-2">
                                <Text className="text-sm font-bold text-[#5856D6]">View All</Text>
                            </View>
                        </View>
                        <View className="absolute -right-[30px] -top-[30px] h-[150px] w-[150px] rounded-full bg-white/10" />
                    </TouchableOpacity>

                    <View className="mb-[15px] mt-[25px] flex-row items-center justify-between px-5">
                        <Text className="text-xl font-bold text-[#1C1C1E]">Services</Text>
                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate('ServiceList', {
                                    title: 'Services',
                                    data: services,
                                    type: 'services',
                                })
                            }
                        >
                            <Text className="text-sm font-semibold text-[#5856D6]">See All</Text>
                        </TouchableOpacity>
                    </View>

                    <Services services={services} />

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

            <OfferDetailModal
                visible={offerModalVisible}
                onClose={() => setOfferModalVisible(false)}
                offer={selectedOffer}
            />
        </SafeAreaView>
    );
};

export default HomeScreen;
