import React from 'react';
import { Text, View } from 'react-native';

type ProgressBarProps = {
  value: number;
};

export function ProgressBar({ value }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(value, 100));

  return (
    <View className="mb-4">
      <View className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
        <View className="h-full rounded-full bg-blue-500" style={{ width: `${clamped}%` }} />
      </View>
      <Text className="mt-1 text-right text-xs font-medium text-slate-500">{clamped}%</Text>
    </View>
  );
}
