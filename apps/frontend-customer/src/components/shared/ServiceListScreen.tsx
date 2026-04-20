import React from 'react';
import { Text, View, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, Star } from 'lucide-react-native';
import * as LucideIcons from 'lucide-react-native';

const { width } = Dimensions.get('window');

const ServiceListScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { title, data, type } = route.params as any;

    const handleServicePress = (item: any) => {
        (navigation as any).navigate('WebView', {
            title: item.name,
            serviceId: item.id,
            type: 'service',
        });
    };

    const renderServiceItem = ({ item }: { item: any }) => {
        const Icon = (LucideIcons as any)[item.icon] || LucideIcons.Home;
        return (
            <TouchableOpacity
                onPress={() => handleServicePress(item)}
                className="mb-[15px] flex-row items-center rounded-[15px] border border-[#F2F2F7] bg-white p-[15px]"
            >
                <View
                    className="mr-[15px] h-[50px] w-[50px] items-center justify-center rounded-[12px]"
                    style={{ backgroundColor: item.color + '15' }}
                >
                    <Icon color={item.color} size={24} />
                </View>
                <View className="flex-1">
                    <Text className="mb-1 text-base font-semibold text-[#1C1C1E]">{item.name}</Text>
                    <View className="flex-row items-center">
                        <Text className="mr-2 text-base font-bold text-[#5856D6]">
                            ₹{item.price}
                        </Text>
                        <Text className="text-[13px] text-[#8E8E93] line-through">₹{item.mrp}</Text>
                    </View>
                </View>
                <View className="flex-row items-center rounded-lg bg-[#FFFBE6] px-2 py-1">
                    <Star size={14} color="#FFD60A" fill="#FFD60A" />
                    <Text className="ml-1 text-xs font-semibold text-[#FFD60A]">{item.rating}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    const renderBestSellerItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            onPress={() => handleServicePress(item)}
            className="mb-[15px] flex-row overflow-hidden rounded-[15px] border border-[#F2F2F7] bg-white"
        >
            <Image source={{ uri: item.image }} className="h-20 w-20" />
            <View className="flex-1 justify-center p-3">
                <Text className="mb-1.5 text-[15px] font-bold text-[#1C1C1E]">{item.name}</Text>
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        <Text className="mr-2 text-base font-bold text-[#5856D6]">
                            ₹{item.price}
                        </Text>
                        <Text className="text-[13px] text-[#8E8E93] line-through">₹{item.mrp}</Text>
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

    const renderOfferItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            onPress={() => (route.params as any).onOfferPress?.(item)}
            activeOpacity={0.8}
            className="mb-[15px] flex-row items-center justify-between rounded-[20px] p-5"
            style={{ backgroundColor: item.color }}
        >
            <View className="mr-2 flex-1">
                <Text className="text-xl font-bold text-white" numberOfLines={1}>
                    {item.title}
                </Text>
                <Text className="mt-1 text-[13px] text-white/90" numberOfLines={1}>
                    {item.subtitle}
                </Text>
            </View>
            <View className="rounded-[10px] bg-white px-3 py-2">
                <Text className="text-xs font-bold" style={{ color: item.color }}>
                    {item.code}
                </Text>
            </View>
        </TouchableOpacity>
    );

    const getRenderItem = () => {
        if (type === 'offers') return renderOfferItem;
        return renderServiceItem;
    };

    return (
        <SafeAreaView className="flex-1 bg-white" style={{ flex: 1 }}>
            <View
                className="flex-row items-center justify-between border-b border-[#F2F2F7] bg-white px-2.5 py-[18px] shadow-sm shadow-black/10"
                style={{ elevation: 3 }}
            >
                <TouchableOpacity onPress={() => navigation.goBack()} className="p-2.5">
                    <ArrowLeft color="#1C1C1E" size={28} />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-[#1C1C1E]">{title}</Text>
                <View className="w-12" />
            </View>

            <FlatList
                className="flex-1"
                style={{ flex: 1 }}
                data={data}
                keyExtractor={(item) => item.id}
                renderItem={getRenderItem()}
                contentContainerStyle={{ padding: 20, flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
};

export default ServiceListScreen;
