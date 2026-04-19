import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import BookingList from '../components/screen/booking/BookingList';

const Tab = createMaterialTopTabNavigator();

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
