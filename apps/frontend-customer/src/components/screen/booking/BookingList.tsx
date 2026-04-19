import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { Calendar } from 'lucide-react-native';
import axiosInstance from '../../../api/axiosInstance';
import BookingItem from './BookingItem';

interface BookingListProps {
    type: 'current' | 'past';
}

const BookingList = ({ type }: BookingListProps) => {
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

export default BookingList;
