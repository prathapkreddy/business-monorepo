import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

interface LinkItemProps {
    icon: any;
    label: string;
    onPress: () => void;
    color?: string;
}

const LinkItem = ({ icon: Icon, label, onPress, color = '#333' }: LinkItemProps) => (
    <TouchableOpacity
        className="flex-row items-center justify-between border-b border-[#f0f0f0] py-[15px]"
        onPress={onPress}
    >
        <View className="flex-row items-center">
            <Icon size={20} color={color} className="mr-2.5" />
            <Text className="text-base font-medium" style={{ color }}>
                {label}
            </Text>
        </View>
        <ChevronRight size={20} color="#ccc" />
    </TouchableOpacity>
);

export default LinkItem;
