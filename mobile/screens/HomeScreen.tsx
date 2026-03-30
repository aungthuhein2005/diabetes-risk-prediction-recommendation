import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { GradientButton } from '../components/ui/GradientButton';

type HomeScreenProps = {
  onStartAssessment: () => void;
};

export function HomeScreen({ onStartAssessment }: HomeScreenProps) {
  const [fontsLoaded] = useFonts({
    PlaywriteIE_400Regular: require('../assets/fonts/PlaywriteIE_400Regular.ttf'),
  });

  const [activities, setActivities] = useState([
    { id: 'walk', label: 'Walk 30 mins', done: false },
    { id: 'water', label: 'Drink 2L water', done: true },
    { id: 'sugar', label: 'Avoid sugar today', done: false },
    { id: 'sleep', label: 'Sleep 7-8 hours', done: false },
  ]);


  const completedCount = activities.filter((item) => item.done).length;
  const progressPercent = Math.round((completedCount / activities.length) * 100);
  const healthRiskPercent = 58;

  const toggleActivity = (id: string) => {
    setActivities((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  return (
    <View className="flex-1 bg-gray-100">
      {/* Scroll Content */}
      <ScrollView contentContainerClassName="px-4 pt-4 pb-28">
        
        {/* HEADER */}
        <View className="mb-4 flex-row items-center justify-between">
          <View>
            <Text
              className="pt-1 text-2xl text-slate-900"
              style={{ fontFamily: fontsLoaded ? 'PlaywriteIE_400Regular' : undefined }}>
              DiaPredict
            </Text>
          </View>

          <Pressable className="h-10 w-10 items-center justify-center rounded-full bg-slate-200">
            <MaterialCommunityIcons name="account-outline" size={20} color="#334155" />
          </Pressable>
        </View>

        {/* CAROUSEL */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-4"
          contentContainerClassName="pr-2">

          {/* Card 1 */}
          <View className="mr-3 w-72 rounded-2xl bg-blue-100 p-4">
            <Text className="text-sm font-semibold text-blue-500">💡 Tip</Text>
            <Text className="mt-1 text-lg font-bold text-blue-700">
              Drink more water today
            </Text>
            <Text className="mt-2 text-xs text-blue-500">
              Staying hydrated helps regulate blood sugar.
            </Text>

            <GradientButton
              title="Check Now"
              className="mt-3"
              onPress={onStartAssessment}
            />
          </View>

          {/* Card 2 */}
          <View className="w-72 rounded-2xl bg-emerald-100 p-4">
            <Text className="text-sm font-semibold text-emerald-600">📊 Progress</Text>
            <Text className="mt-1 text-lg font-bold text-emerald-700">
              You improved 12%
            </Text>
            <Text className="mt-2 text-xs text-emerald-600">
              Keep going, you're doing great.
            </Text>
          </View>
        </ScrollView>

        {/* STATS */}
        <View className="mb-4 flex-row gap-3">
          <View className="flex-1 rounded-2xl bg-white p-4">
            <Text className="text-xs text-slate-500">Health Score</Text>
            <Text className="mt-1 text-2xl font-bold text-slate-900">58</Text>
          </View>

          <View className="flex-1 rounded-2xl bg-white p-4">
            <Text className="text-xs text-slate-500">Last Check</Text>
            <Text className="mt-1 text-2xl font-bold text-slate-900">2d ago</Text>
          </View>
        </View>

        {/* CHART */}
        <View className="mb-4 rounded-2xl bg-white p-4">
          <View className="mb-2 flex-row justify-between">
            <Text className="text-sm font-semibold text-slate-500">
              Health Risk Trend
            </Text>
            <Text className="text-base font-bold text-rose-500">
              {healthRiskPercent}%
            </Text>
          </View>

          <Svg width="100%" height={120} viewBox="0 0 320 120">
            <Defs>
              <LinearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor="#38bdf8" stopOpacity="0.5" />
                <Stop offset="100%" stopColor="#38bdf8" stopOpacity="0.08" />
              </LinearGradient>
            </Defs>

            <Path
              d="M 0 110 L 35 78 L 70 55 L 105 88 L 140 92 L 175 78 L 210 22 L 245 50 L 280 58 L 320 24 L 320 120 L 0 120 Z"
              fill="url(#chartFill)"
            />
            <Path
              d="M 0 110 L 35 78 L 70 55 L 105 88 L 140 92 L 175 78 L 210 22 L 245 50 L 280 58 L 320 24"
              fill="none"
              stroke="#38bdf8"
              strokeWidth={3}
            />
          </Svg>
        </View>

        {/* AI ACTIVITIES */}
        <View className="mb-4 rounded-2xl bg-white p-4">
          <Text className="mb-3 text-base font-semibold text-slate-800">
            🤖 Suggested for You
          </Text>

          <View className="gap-2">
            {activities.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => toggleActivity(item.id)}
                className="flex-row items-center justify-between rounded-xl bg-slate-50 px-3 py-3">

                <Text className="text-sm text-slate-800">{item.label}</Text>

                <View
                  className={`h-6 w-6 items-center justify-center rounded-full border ${
                    item.done
                      ? 'border-emerald-500 bg-emerald-500'
                      : 'border-slate-300'
                  }`}>
                  {item.done && (
                    <MaterialCommunityIcons name="check" size={14} color="#fff" />
                  )}
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* PROGRESS */}
        <View className="mb-4 rounded-2xl bg-white p-4">
          <Text className="text-sm font-semibold text-slate-800">
            Today&apos;s Progress
          </Text>

          <View className="mt-2 h-3 w-full rounded-full bg-slate-200 overflow-hidden">
            <View
              className="h-full bg-blue-500"
              style={{ width: `${progressPercent}%` }}
            />
          </View>

          <Text className="mt-2 text-sm font-semibold text-blue-600">
            {progressPercent}%
          </Text>
        </View>

      </ScrollView>

      {/* 🔥 STICKY CTA */}
      <View className="absolute bottom-0 left-0 right-0 bg-gray-100 px-4 pb-6 pt-2">
        <GradientButton
          title="Start Health Check"
          onPress={onStartAssessment}
        />
      </View>
    </View>
  );
}