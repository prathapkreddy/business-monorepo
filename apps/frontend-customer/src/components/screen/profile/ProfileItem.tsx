import React from 'react';
import { View, Text, TextInput } from 'react-native';

interface ProfileItemProps {
    icon: any;
    label: string;
    value: string;
    isEditing: boolean;
    editable?: boolean;
    onChangeText?: (text: string) => void;
}

const ProfileItem = ({
    icon: Icon,
    label,
    value,
    isEditing,
    editable = false,
    onChangeText,
}: ProfileItemProps) => (
    <View className="border-b border-[#f0f0f0] py-[15px]">
        <View className="mb-1 flex-row items-center">
            <Icon size={20} color="#666" className="mr-2.5" />
            <Text className="text-sm font-medium text-[#888]">{label}</Text>
        </View>
        {isEditing && editable ? (
            <TextInput
                className="border-b border-[#5856D6] py-1 pl-[30px] text-base text-[#333]"
                value={value}
                onChangeText={onChangeText}
                placeholder={`Enter ${label}`}
            />
        ) : (
            <Text
                className={`pl-[30px] text-base text-[#333] ${!value ? 'italic text-[#ccc]' : ''}`}
            >
                {value || `No ${label} provided`}
            </Text>
        )}
    </View>
);

export default ProfileItem;
