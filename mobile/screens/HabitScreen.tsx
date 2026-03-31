import Slider from '@react-native-community/slider';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Card } from '../components/ui/Card';
import { GradientButton } from '../components/ui/GradientButton';
import type { HabitAnswers } from './types';
import React from 'react';

type HabitScreenProps = {
  answers: HabitAnswers;
  onAnswersChange: (next: HabitAnswers) => void;
  onAnalyze: () => void;
  onBack: () => void;
};

export function HabitScreen({ answers, onAnswersChange, onAnalyze, onBack }: HabitScreenProps) {
  const updateNumber = (key: keyof HabitAnswers, value: number) => {
    onAnswersChange({ ...answers, [key]: value });
  };

  return (
    <View className="flex-1 bg-gray-100">
      <ScrollView className="flex-1" contentContainerClassName="px-4 py-4 pb-28">
        <View>
          <View className="mb-4 flex-row items-center">
            <Pressable
              onPress={onBack}
              className="h-8 w-8 items-center justify-center rounded-full bg-slate-200/50">
              <MaterialCommunityIcons name="chevron-left" size={20} color="#64748b" />
            </Pressable>
            <View className="flex-1 pr-8">
              <Text className="text-center text-2xl font-bold text-slate-900">
                Your Health Features
              </Text>
            </View>
          </View>

          <View className="gap-3">
            {featureSections.map((section) => (
              <View key={section.title} className="mt-1">
                <View className="mb-2 flex-row items-center gap-2">
                  <MaterialCommunityIcons name={section.icon as any} size={18} color="#64748b" />
                  <Text className="text-base font-bold text-slate-700">{section.title}</Text>
                </View>

                <View className="gap-3">
                  {section.fields.map((field) => (
                    <FeatureField
                      key={field.key}
                      label={field.label}
                      hint={field.hint}
                      value={answers[field.key]}
                      min={field.min}
                      max={field.max}
                      step={field.step}
                      unit={field.unit}
                      normalRange={field.normalRange}
                      icon={field.icon}
                      onChangeValue={(value) => updateNumber(field.key, value)}
                    />
                  ))}
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-gray-100 px-4 pb-6 pt-2">
        <GradientButton title="Analyze" variant="secondary" onPress={onAnalyze} />
      </View>
    </View>
  );
}

type FeatureFieldProps = {
  label: string;
  hint: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  normalRange: string;
  icon: string;
  onChangeValue: (value: number) => void;
};

function FeatureField({
  label,
  hint,
  value,
  min,
  max,
  step,
  unit,
  normalRange,
  icon,
  onChangeValue,
}: FeatureFieldProps) {
  const displayValue = Number.isInteger(value) ? value.toString() : value.toFixed(2);

  return (
    <View className="rounded-2xl border border-slate-100 bg-white px-3 py-3 shadow-sm">
      <View className="mb-2 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <MaterialCommunityIcons name={icon as any} size={16} color="#64748b" />
          <Text className="text-sm font-bold text-slate-800">{label}</Text>
        </View>
        <Text className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-600">
          {displayValue}
          {unit ? ` ${unit}` : ''}
        </Text>
      </View>

      <Text className="mb-3 text-xs text-slate-500">{hint}</Text>

      <Slider
        value={value}
        minimumValue={min}
        maximumValue={max}
        step={step}
        minimumTrackTintColor="#3b82f6"
        maximumTrackTintColor="#cbd5e1"
        thumbTintColor="#3b82f6"
        onValueChange={onChangeValue}
      />

      <Text className="mt-1 text-xs font-medium text-emerald-600">Normal: {normalRange}</Text>
    </View>
  );
}

const featureSections: {
  title: string;
  icon: string;
  fields: {
    key: keyof HabitAnswers;
    label: string;
    hint: string;
    min: number;
    max: number;
    step: number;
    unit?: string;
    normalRange: string;
    icon: string;
  }[];
}[] = [
  {
    title: 'Personal',
    icon: 'account-cog',
    fields: [
      {
        key: 'Age',
        label: 'Age',
        hint: 'Your current age in years',
        min: 18,
        max: 90,
        step: 1,
        unit: 'yrs',
        normalRange: '18 - 60 years',
        icon: 'account',
      },
      {
        key: 'Pregnancies',
        label: 'Pregnancies',
        hint: 'Number of times pregnant',
        min: 0,
        max: 15,
        step: 1,
        normalRange: '0 - 6',
        icon: 'baby-carriage',
      },
    ],
  },
  {
    title: 'Vitals',
    icon: 'heart-pulse',
    fields: [
      {
        key: 'Glucose',
        label: 'Glucose',
        hint: 'Your blood sugar level',
        min: 50,
        max: 220,
        step: 1,
        unit: 'mg/dL',
        normalRange: '70 - 140 mg/dL',
        icon: 'water',
      },
      {
        key: 'BloodPressure',
        label: 'Blood Pressure',
        hint: 'Diastolic blood pressure',
        min: 40,
        max: 130,
        step: 1,
        unit: 'mmHg',
        normalRange: '60 - 90 mmHg',
        icon: 'heart',
      },
      {
        key: 'Insulin',
        label: 'Insulin',
        hint: '2-hour serum insulin',
        min: 0,
        max: 400,
        step: 1,
        unit: 'mu U/ml',
        normalRange: '16 - 166 mu U/ml',
        icon: 'needle',
      },
    ],
  },
  {
    title: 'Body Metrics',
    icon: 'chart-bar',
    fields: [
      {
        key: 'BMI',
        label: 'BMI',
        hint: 'Body mass index',
        min: 10,
        max: 60,
        step: 0.1,
        normalRange: '18.5 - 24.9',
        icon: 'scale-bathroom',
      },
      {
        key: 'SkinThickness',
        label: 'Skin Thickness',
        hint: 'Triceps skin fold thickness',
        min: 0,
        max: 60,
        step: 1,
        unit: 'mm',
        normalRange: '10 - 40 mm',
        icon: 'ruler',
      },
    ],
  },
  {
    title: 'Risk Factor',
    icon: 'flask',
    fields: [
      {
        key: 'DiabetesPedigreeFunction',
        label: 'Diabetes Pedigree Function',
        hint: 'Family history diabetes score',
        min: 0,
        max: 2.5,
        step: 0.01,
        normalRange: '0.1 - 0.8',
        icon: 'dna',
      },
    ],
  },
];
