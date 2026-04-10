import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    RefreshControl,
    SafeAreaView,
} from 'react-native';
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
        <TouchableOpacity style={styles.bookingItem}>
            <View style={styles.bookingLeft}>
                <View style={styles.dateBadge}>
                    <Text style={styles.dateBadgeDay}>{date.getDate()}</Text>
                    <Text style={styles.dateBadgeMonth}>
                        {date.toLocaleString('en-US', { month: 'short' }).toUpperCase()}
                    </Text>
                </View>
                <View style={styles.bookingDetails}>
                    <Text style={styles.serviceName}>{item.serviceName}</Text>
                    <View style={styles.detailRow}>
                        <Clock size={14} color="#666" style={styles.detailIcon} />
                        <Text style={styles.detailText}>{formattedTime}</Text>
                    </View>
                    <View
                        style={[
                            styles.statusBadge,
                            item.status === 'CANCELLED' && styles.statusBadgeCancelled,
                            item.status === 'CONFIRMED' && styles.statusBadgeConfirmed,
                        ]}
                    >
                        <Text
                            style={[
                                styles.statusText,
                                item.status === 'CANCELLED' && styles.statusTextCancelled,
                                item.status === 'CONFIRMED' && styles.statusTextConfirmed,
                            ]}
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
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#5856D6" />
            </View>
        );
    }

    return (
        <FlatList
            data={bookings}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <BookingItem item={item} />}
            contentContainerStyle={styles.listContent}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={['#5856D6']}
                />
            }
            ListEmptyComponent={
                <View style={styles.emptyContainer}>
                    <Calendar size={48} color="#ccc" />
                    <Text style={styles.emptyText}>No {type} bookings found</Text>
                </View>
            }
        />
    );
};

const BookingScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: 15,
    },
    bookingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#f0f0f0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    bookingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateBadge: {
        width: 50,
        height: 50,
        backgroundColor: '#F0F0FF',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    dateBadgeDay: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#5856D6',
    },
    dateBadgeMonth: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#5856D6',
    },
    bookingDetails: {
        flex: 1,
    },
    serviceName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    detailIcon: {
        marginRight: 5,
    },
    detailText: {
        fontSize: 13,
        color: '#666',
    },
    statusBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        backgroundColor: '#FFF9F0', // Default PENDING
    },
    statusBadgeCancelled: {
        backgroundColor: '#FFF0F0',
    },
    statusBadgeConfirmed: {
        backgroundColor: '#F0FFF0',
    },
    statusText: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#FF9500', // Default PENDING
    },
    statusTextCancelled: {
        color: '#FF3B30',
    },
    statusTextConfirmed: {
        color: '#34C759',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: {
        marginTop: 10,
        fontSize: 16,
        color: '#999',
    },
});

export default BookingScreen;
