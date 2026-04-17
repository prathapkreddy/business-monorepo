import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import axiosInstance from '../api/axiosInstance';
import { Calendar, Clock, MapPin, ChevronRight } from 'lucide-react-native';

const Tab = createMaterialTopTabNavigator();

const BookingItem = ({ item }: { item: any }) => {
    const date = new Date(item.date);
    const formattedDate = date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    });
    const formattedTime = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <TouchableOpacity className="elevation-2 mb-[15px] flex-row items-center justify-between rounded-[12px] border border-[#f0f0f0] bg-white p-[15px] shadow-sm shadow-black/5">
            <View className="flex-row items-center">
                <View className="mr-[15px] h-[50px] w-[50px] items-center justify-center rounded-[10px] bg-[#F0F0FF]">
                    <Text className="text-lg font-bold text-[#5856D6]">{date.getDate()}</Text>
                    <Text className="text-[10px] font-bold text-[#5856D6]">
                        {date.toLocaleString('en-US', { month: 'short' }).toUpperCase()}
                    </Text>
                </View>
                <View className="flex-1">
                    <Text className="mb-1 text-base font-bold text-[#333]">{item.serviceName}</Text>
                    <View className="mb-1 flex-row items-center">
                        <Clock size={14} color="#666" className="mr-1" />
                        <Text className="text-[13px] text-[#666]">{formattedTime}</Text>
                    </View>
                    <View
                        className={`self-start rounded-[10px] px-2 py-0.5 ${
                            item.status === 'CANCELLED'
                                ? 'bg-[#FFF0F0]'
                                : item.status === 'CONFIRMED'
                                  ? 'bg-[#F0FFF0]'
                                  : 'bg-[#FFF9F0]'
                        }`}
                    >
                        <Text
                            className={`text-[11px] font-bold ${
                                item.status === 'CANCELLED'
                                    ? 'text-[#FF3B30]'
                                    : item.status === 'CONFIRMED'
                                      ? 'text-[#34C759]'
                                      : 'text-[#FF9500]'
                            }`}
                        >
                            {item.status}
                        </Text>
                    </View>
                </View>
            </View>
            <ChevronRight size={20} color="#ccc" />
        </TouchableOpacity>
    );
};

const BookingList = ({ type }: { type: 'current' | 'past' }) => {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchBookings = async () => {
        try {
            const endpoint = type === 'current' ? '/bookings/current' : '/bookings/past';
            const response = await axiosInstance.get(endpoint);
            setBookings(response.data);
        } catch (error) {
            console.error(`Error fetching ${type} bookings:`, error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchBookings();
    };

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#5856D6" />
            </View>
        );
    }

    return (
        <FlatList
            className="flex-1"
            style={{ flex: 1 }}
            data={bookings}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <BookingItem item={item} />}
            contentContainerStyle={{ padding: 15, flexGrow: 1 }}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={['#5856D6']}
                />
            }
            ListEmptyComponent={
                <View className="mt-[100px] flex-1 items-center justify-center">
                    <Calendar size={48} color="#ccc" />
                    <Text className="mt-2.5 text-base text-[#999]">No {type} bookings found</Text>
                </View>
            }
        />
    );
};

const BookingScreen = () => {
    return (
        <SafeAreaView className="flex-1 bg-white" style={{ flex: 1 }}>
            <Tab.Navigator
                screenOptions={{
                    tabBarActiveTintColor: '#5856D6',
                    tabBarInactiveTintColor: '#8E8E93',
                    tabBarIndicatorStyle: {
                        backgroundColor: '#5856D6',
                        height: 3,
                    },
                    tabBarLabelStyle: {
                        fontSize: 14,
                        fontWeight: 'bold',
                        textTransform: 'none',
                    },
                    tabBarStyle: {
                        elevation: 0,
                        shadowOpacity: 0,
                        borderBottomWidth: 1,
                        borderBottomColor: '#eee',
                    },
                }}
            >
                <Tab.Screen name="Current" children={() => <BookingList type="current" />} />
                <Tab.Screen name="Past" children={() => <BookingList type="past" />} />
            </Tab.Navigator>
        </SafeAreaView>
    );
};

export default BookingScreen;
