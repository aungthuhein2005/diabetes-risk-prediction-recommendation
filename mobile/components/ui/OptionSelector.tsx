import React from 'react';
import { Pressable, Text, View } from 'react-native';

type OptionSelectorProps = {
  options: string[];
  value: string;
  onChange: (value: string) => void;
};

export function OptionSelector({ options, value, onChange }: OptionSelectorProps) {
  return (
    <View className="mt-2 flex-row flex-wrap gap-2">
      {options.map((option) => {
        const active = option === value;
        return (
          <Pressable
            key={option}
            onPress={() => onChange(option)}
            className={`rounded-full border px-3 py-1.5 ${
              active ? 'border-blue-500 bg-blue-500' : 'border-slate-200 bg-white'
            }`}>
            <Text className={`text-xs font-medium ${active ? 'text-white' : 'text-slate-600'}`}>
              {option}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
