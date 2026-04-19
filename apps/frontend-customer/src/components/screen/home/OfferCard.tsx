import React from 'react';
import { View, Text } from 'react-native';

interface OfferCardProps {
    item: any;
    width: number;
}

const OfferCard = ({ item, width }: OfferCardProps) => (
    <View
        className="mr-[15px] flex-row items-center justify-between rounded-[20px] p-5"
        style={{ width, backgroundColor: item.color }}
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

export default OfferCard;
