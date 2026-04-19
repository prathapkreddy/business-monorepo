import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Clock, ChevronRight } from 'lucide-react-native';

interface BookingItemProps {
    item: any;
}

const BookingItem = ({ item }: BookingItemProps) => {
    const date = new Date(item.date);
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

export default BookingItem;
