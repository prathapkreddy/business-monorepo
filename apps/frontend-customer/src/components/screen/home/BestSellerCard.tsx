import React from 'react';
import { TouchableOpacity, Image, View, Text } from 'react-native';
import { Star } from 'lucide-react-native';

interface BestSellerCardProps {
    item: any;
}

const BestSellerCard = ({ item }: BestSellerCardProps) => (
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

export default BestSellerCard;
