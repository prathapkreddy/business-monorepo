import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import * as LucideIcons from 'lucide-react-native';
import { Star } from 'lucide-react-native';

interface ServiceCardProps {
    item: any;
    width: number;
}

const ServiceCard = ({ item, width }: ServiceCardProps) => {
    const Icon = (LucideIcons as any)[item.icon] || LucideIcons.Home;
    return (
        <TouchableOpacity
            className="elevation-5 mb-2.5 mr-5 rounded-[20px] bg-white p-5 shadow-lg shadow-black/10"
            style={{ width }}
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
                        <Text className="mr-2 text-lg font-bold text-[#5856D6]">₹{item.price}</Text>
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

export default ServiceCard;
