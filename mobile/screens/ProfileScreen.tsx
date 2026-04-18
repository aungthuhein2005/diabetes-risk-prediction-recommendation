import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

type ProfileScreenProps = {
  onBack: () => void;
};

type RiskLevel = 'High' | 'Moderate' | 'Low';

const user = {
  name: 'Max',
  email: 'max@example.com',
  joined: 'January 2026',
  initials: 'MAX',
};

const savedPlans: {
  id: number;
  date: string;
  risk: RiskLevel;
  probability: number;
  factors: string[];
}[] = [
  { id: 1, date: 'Mar 29, 2026', risk: 'High', probability: 71.7, factors: ['Glucose', 'Insulin', 'Age'] },
  { id: 2, date: 'Mar 15, 2026', risk: 'Moderate', probability: 44.2, factors: ['BMI', 'Blood Pressure'] },
  { id: 3, date: 'Feb 28, 2026', risk: 'Moderate', probability: 38.9, factors: ['Glucose', 'Age'] },
  { id: 4, date: 'Feb 10, 2026', risk: 'Low', probability: 22.1, factors: ['BMI'] },
];

const riskStyle = {
  High: { text: '#b91c1c', bg: '#fee2e2', bar: '#ef4444' },
  Moderate: { text: '#b45309', bg: '#fef3c7', bar: '#f59e0b' },
  Low: { text: '#047857', bg: '#d1fae5', bar: '#10b981' },
};

export function ProfileScreen({ onBack }: ProfileScreenProps) {
  return (
    <View className="flex-1 bg-gray-100">
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 36 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
          <Pressable
            onPress={onBack}
            style={{
              marginRight: 12,
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: '#ffffff',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: '#e2e8f0',
            }}
          >
            <MaterialCommunityIcons name="arrow-left" size={20} color="#0f172a" />
          </Pressable>
          <Text className="text-2xl font-bold text-slate-900">Profile</Text>
        </View>

        <View className="mb-4 rounded-2xl bg-white p-5">
          <View className="mb-3 items-center">
            <View className="mb-3 h-16 w-16 items-center justify-center rounded-full bg-blue-600">
              <Text className="text-xl font-bold text-white">{user.initials}</Text>
            </View>
            <Text className="text-base font-semibold text-slate-900">{user.name}</Text>
            <Text className="text-sm text-slate-400">{user.email}</Text>
            <Text className="mt-1 text-xs text-slate-400">Member since {user.joined}</Text>
          </View>
          <Pressable className="rounded-lg border border-slate-200 bg-white py-2">
            <Text className="text-center text-sm font-semibold text-slate-600">Edit Profile</Text>
          </Pressable>
        </View>

        <View className="mb-4 rounded-2xl bg-white p-4">
          <Text className="mb-3 text-sm font-semibold text-slate-700">Stats</Text>
          <View className="grid grid-cols-2 gap-2">
            <View className="rounded-xl bg-slate-50 p-3">
              <Text className="text-xs text-slate-400">Assessments</Text>
              <Text className="mt-1 text-lg font-bold text-slate-900">4</Text>
            </View>
            <View className="rounded-xl bg-slate-50 p-3">
              <Text className="text-xs text-slate-400">Latest Risk</Text>
              <Text className="mt-1 text-lg font-bold text-slate-900">High</Text>
            </View>
            <View className="rounded-xl bg-slate-50 p-3">
              <Text className="text-xs text-slate-400">Average Risk</Text>
              <Text className="mt-1 text-lg font-bold text-slate-900">44%</Text>
            </View>
            <View className="rounded-xl bg-slate-50 p-3">
              <Text className="text-xs text-slate-400">Days Active</Text>
              <Text className="mt-1 text-lg font-bold text-slate-900">21</Text>
            </View>
          </View>
        </View>

        <View className="rounded-2xl bg-white p-4">
          <Text className="mb-3 text-sm font-semibold text-slate-700">Saved Plans</Text>
          <View className="gap-3">
            {savedPlans.map((plan) => (
              <View key={plan.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <View className="mb-2 flex-row items-center justify-between">
                  <Text className="text-xs text-slate-400">{plan.date}</Text>
                  <View
                    style={{ backgroundColor: riskStyle[plan.risk].bg }}
                    className="rounded-full px-2 py-0.5"
                  >
                    <Text style={{ color: riskStyle[plan.risk].text }} className="text-xs font-semibold">
                      {plan.risk}
                    </Text>
                  </View>
                </View>
                <View className="mb-2 h-2 overflow-hidden rounded-full bg-slate-200">
                  <View
                    style={{ width: `${plan.probability}%`, backgroundColor: riskStyle[plan.risk].bar }}
                    className="h-full rounded-full"
                  />
                </View>
                <View className="flex-row flex-wrap gap-1">
                  {plan.factors.map((f) => (
                    <View key={f} className="rounded-md border border-slate-200 bg-white px-1.5 py-0.5">
                      <Text className="text-[11px] text-slate-500">{f}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
