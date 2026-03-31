import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image, ScrollView, Text, View } from 'react-native';
import { Card } from '../components/ui/Card';
import { GradientButton } from '../components/ui/GradientButton';
import React from 'react';

type OnBoardScreenProps = {
  onNext: () => void;
};

export function OnBoardScreen({ onNext }: OnBoardScreenProps) {
  return (
    <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1, padding: 16 }}>
      <Card className="flex-1 items-center justify-between">
        <View className="mt-1 h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
          <MaterialCommunityIcons name="heart-pulse" size={34} color="#10b981" />
        </View>

        <Text className="text-3xl font-bold text-slate-800">DiaPredict</Text>
        <Text className="mt-2 text-center text-4xl font-bold leading-tight text-slate-900">
          Check Your{'\n'}Diabetes Risk
        </Text>
        <Text className="mt-2 text-sm text-slate-500">AI-powered health prediction</Text>

        <View className="my-4 w-full items-center justify-center rounded-2xl bg-blue-50 p-3">
          <Image
            source={require('../assets/images/welcome.png')}
            className="h-72 w-full rounded-xl"
            resizeMode="cover"
          />
        </View>

        <GradientButton title="Next" className="w-full" onPress={onNext} />
      </Card>
    </ScrollView>
  );
}
