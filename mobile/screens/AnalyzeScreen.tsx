import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { GradientButton } from '../components/ui/GradientButton';
import React from 'react';
import type { AnalyzeResult } from './types';

type AnalyzeScreenProps = {
  analysisPercent: number;
  result: AnalyzeResult | null;
  onViewPlan: () => void;
  onRetake: () => void;
};

export function AnalyzeScreen({ analysisPercent, result, onViewPlan, onRetake }: AnalyzeScreenProps) {
  const clampedPercent = Math.max(
    0,
    Math.min(result ? Math.round(result.probability * 100) : analysisPercent, 100),
  );

  const chartSize = 220;
  const segmentCount = 44;
  const filledSegments = Math.round((clampedPercent / 100) * segmentCount);
  const ringRadius = 78;
  const segmentWidth = 8;
  const segmentHeight = 18;
  const center = chartSize / 2;

  // Dynamic risk state
  const risk =
    result?.risk === 'High'
      ? { label: 'High Risk', bg: 'bg-rose-100', text: 'text-rose-600', stroke: '#f43f5e' }
      : result?.risk === 'Medium'
        ? { label: 'Moderate Risk', bg: 'bg-amber-100', text: 'text-amber-600', stroke: '#f59e0b' }
        : result?.risk === 'Low'
          ? { label: 'Low Risk', bg: 'bg-emerald-100', text: 'text-emerald-600', stroke: '#10b981' }
          : clampedPercent > 65
            ? { label: 'High Risk', bg: 'bg-rose-100', text: 'text-rose-600', stroke: '#f43f5e' }
            : clampedPercent > 35
              ? { label: 'Moderate Risk', bg: 'bg-amber-100', text: 'text-amber-600', stroke: '#f59e0b' }
              : { label: 'Low Risk', bg: 'bg-emerald-100', text: 'text-emerald-600', stroke: '#10b981' };

  const adviceText =
    result?.advice ??
    "Your results indicate a higher likelihood of developing health risks related to blood sugar and metabolism. This doesn't mean a diagnosis, but it's a strong signal to take preventive action early.";

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
        <View className="mb-5 w-full max-w-xl self-center rounded-3xl bg-white px-4 pb-6 pt-4 shadow-sm">
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
