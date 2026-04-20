import React, { useRef, useState } from 'react';
import { View, Text, FlatList, Dimensions, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const slides = [
    {
        id: '1',
        title: 'Book Services Instantly',
        desc: 'Find trusted professionals in seconds',
        image: require('../../../assets/icon.png'),
    },
    {
        id: '2',
        title: 'Trusted Experts',
        desc: 'Verified and highly rated professionals',
        image: require('../../../assets/icon.png'),
    },
    {
        id: '3',
        title: 'At Your Doorstep',
        desc: 'Fast, reliable and on-demand service',
        image: require('../../../assets/icon.png'),
    },
];

const OnboardingScreen = ({ navigation }: any) => {
    const [index, setIndex] = useState(0);
    const ref = useRef<FlatList>(null);

    const onNext = async () => {
        if (index < slides.length - 1) {
            const newIndex = index + 1;
            setIndex(newIndex);
            ref.current?.scrollToIndex({ index: newIndex, animated: true });
        } else {
            await AsyncStorage.setItem('onboarding_done', 'true');
            navigation.replace('Auth');
        }
    };

    const getItemLayout = (_: any, index: number) => ({
        length: width,
        offset: width * index,
        index,
    });

    return (
        <View className="flex-1 bg-white">
            {/* SLIDER */}
            <FlatList
                ref={ref}
                data={slides}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                getItemLayout={getItemLayout}
                onMomentumScrollEnd={(e) => {
                    const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
                    setIndex(newIndex);
                }}
                renderItem={({ item }) => (
                    <View style={{ width }} className="items-center justify-center px-8">
                        <Image
                            source={item.image}
                            style={{ width: 260, height: 260 }}
                            resizeMode="contain"
                        />

                        <Text className="mt-10 text-center text-2xl font-bold">{item.title}</Text>

                        <Text className="mt-3 text-center text-gray-500">{item.desc}</Text>
                    </View>
                )}
            />

            {/* DOTS */}
            <View className="mb-6 flex-row justify-center">
                {slides.map((_, i) => (
                    <View
                        key={i}
                        className={`mx-1 h-2 w-2 rounded-full ${
                            i === index ? 'bg-black' : 'bg-gray-300'
                        }`}
                    />
                ))}
            </View>

            {/* BUTTON */}
            <TouchableOpacity onPress={onNext} className="mx-6 mb-10 rounded-xl bg-black py-4">
                <Text className="text-center font-semibold text-white">
                    {index === slides.length - 1 ? 'Get Started' : 'Next'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default OnboardingScreen;
