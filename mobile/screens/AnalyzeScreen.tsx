import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { GradientButton } from '../components/ui/GradientButton';
import React from 'react';

type AnalyzeScreenProps = {
  analysisPercent: number;
  onViewPlan: () => void;
  onRetake: () => void;
};

export function AnalyzeScreen({ analysisPercent, onViewPlan, onRetake }: AnalyzeScreenProps) {
  const clampedPercent = Math.max(0, Math.min(analysisPercent, 100));

  const chartSize = 220;
  const segmentCount = 44;
  const filledSegments = Math.round((clampedPercent / 100) * segmentCount);
  const ringRadius = 78;
  const segmentWidth = 8;
  const segmentHeight = 18;
  const center = chartSize / 2;

  // Dynamic risk state
  const risk =
    clampedPercent > 65
      ? { label: 'High Risk', bg: 'bg-rose-100', text: 'text-rose-600', stroke: '#f43f5e' }
      : clampedPercent > 35
        ? { label: 'Moderate Risk', bg: 'bg-amber-100', text: 'text-amber-600', stroke: '#f59e0b' }
        : { label: 'Low Risk', bg: 'bg-emerald-100', text: 'text-emerald-600', stroke: '#10b981' };

  return (
    <View className="flex-1 bg-gray-100">
      {/* Scroll Content */}
      <ScrollView contentContainerClassName="px-4 pt-4 pb-32">
        {/* HEADER */}
        <View className="mb-4 flex-row items-center">
          <Pressable
            onPress={onRetake}
            className="h-9 w-9 items-center justify-center rounded-full bg-slate-200/50">
            <MaterialCommunityIcons name="chevron-left" size={20} color="#64748b" />
          </Pressable>

          <View className="flex-1 pr-8">
            <Text className="text-center text-2xl font-bold text-slate-900">Your Analysis</Text>
          </View>
        </View>

        {/* HERO CHART SECTION */}
        <View className="mb-5 rounded-3xl bg-white px-4 pb-6 pt-4 shadow-sm">
          <View className="items-center">
            <View
              style={{ width: chartSize, height: chartSize }}
              className="items-center justify-center">
              {Array.from({ length: segmentCount }).map((_, index) => {
                const angle = (index / segmentCount) * Math.PI * 2 - Math.PI / 2;
                const x = center + ringRadius * Math.cos(angle);
                const y = center + ringRadius * Math.sin(angle);

                return (
                  <View
                    key={`segment-${index}`}
                    style={{
                      position: 'absolute',
                      left: x - segmentWidth / 2,
                      top: y - segmentHeight / 2,
                      width: segmentWidth,
                      height: segmentHeight,
                      borderRadius: 8,
                      backgroundColor: index < filledSegments ? risk.stroke : '#e2e8f0',
                      transform: [{ rotate: `${(angle * 180) / Math.PI + 90}deg` }],
                    }}
                  />
                );
              })}

              <View className="h-36 w-36 items-center justify-center rounded-full border border-slate-200 bg-white">
                <Text className="text-5xl font-bold text-slate-900">{clampedPercent}%</Text>
                <View className={`mt-1 rounded-full px-3 py-0.5 ${risk.bg}`}>
                  <Text className={`text-sm font-semibold ${risk.text}`}>{risk.label}</Text>
                </View>
              </View>
            </View>

            <Text className="-mt-2 text-center text-sm text-slate-500">
              Percentage indicates your current estimated risk level
            </Text>
          </View>
        </View>

        {/* INSIGHT CARD */}
        <View className="mb-4 rounded-2xl bg-white p-4">
          <View className="mb-2 flex-row items-center gap-2">
            <MaterialCommunityIcons name="brain" size={18} color="#64748b" />
            <Text className="text-base font-semibold text-slate-800">What this means</Text>
          </View>
          <Text className="text-sm leading-6 text-slate-600">
            Your results indicate a higher likelihood of developing health risks related to blood
            sugar and metabolism. This doesn’t mean a diagnosis, but it’s a strong signal to take
            preventive action early.
          </Text>
        </View>

        {/* QUICK ACTIONS */}
        <View className="mb-4 rounded-2xl bg-white p-4">
          <View className="mb-3 flex-row items-center gap-2">
            <MaterialCommunityIcons name="lightning-bolt" size={18} color="#64748b" />
            <Text className="text-base font-semibold text-slate-800">What you can do now</Text>
          </View>

          <View className="gap-2">
            {[
              { icon: 'candy-off',          color: '#ef4444', bg: '#fee2e2', label: 'Reduce sugar intake' },
              { icon: 'run-fast',            color: '#f59e0b', bg: '#fef3c7', label: 'Exercise 30 mins daily' },
              { icon: 'water-outline',       color: '#0284c7', bg: '#e0f2fe', label: 'Drink more water' },
              { icon: 'sleep',               color: '#8b5cf6', bg: '#ede9fe', label: 'Improve sleep habits' },
            ].map((item) => (
              <View key={item.label} className="flex-row items-center gap-3 rounded-xl bg-slate-50 px-3 py-3">
                <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: item.bg, alignItems: 'center', justifyContent: 'center' }}>
                  <MaterialCommunityIcons name={item.icon as any} size={17} color={item.color} />
                </View>
                <Text className="text-sm text-slate-700 flex-1">{item.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* STICKY ACTIONS */}
      <View className="absolute bottom-0 left-0 right-0 bg-gray-100 px-4 pb-6 pt-2">
        <GradientButton title="View Health Plan" onPress={onViewPlan} />

        <Pressable onPress={onRetake} className="mt-3 items-center">
          <Text className="text-sm font-semibold text-slate-500">Retake Assessment</Text>
        </Pressable>
      </View>
    </View>
  );
}
