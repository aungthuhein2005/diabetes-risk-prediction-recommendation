import type { ReactNode } from 'react';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Markdown from 'react-native-markdown-display';
import { Card } from '../components/ui/Card';
import { GradientButton } from '../components/ui/GradientButton';
import { downloadRecommendationPdf } from '../utils/pdfGenerator';
import React from 'react';
import type { AnalyzeResult } from './types';

type RecommendationScreenProps = {
  onBack: () => void;
  result: AnalyzeResult | null;
};

export function RecommendationScreen({ onBack, result }: RecommendationScreenProps) {
  const predictionResult: AnalyzeResult = result ?? {
    risk: 'Medium',
    probability: 0,
    top_factors: [],
    advice:
      'No recommendation data yet. Run an analysis first to generate personalized advice.',
  };
  const probabilityPercent = (predictionResult.probability * 100).toFixed(1);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPdf = async () => {
    try {
      setIsDownloading(true);
      await downloadRecommendationPdf(predictionResult);
    } catch {
      Alert.alert('Download failed', 'Unable to create recommendation PDF right now.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-100">
      <ScrollView className="flex-1" contentContainerClassName="px-4 py-4 pb-40">
        <View className="mb-4">
          <View className="mb-4 flex-row items-center">
            <Pressable
              onPress={onBack}
              className="h-8 w-8 items-center justify-center rounded-full bg-slate-200/50">
              <MaterialCommunityIcons name="chevron-left" size={20} color="#64748b" />
            </Pressable>
            <View className="flex-1 pr-8">
              <Text className="text-center text-2xl font-bold text-slate-900">
                Health Recommendations
              </Text>
            </View>
          </View>

          <View className="mb-4 flex-row gap-3">
            <Card className="flex-1 rounded-xl bg-red-50 p-3">
              <Text className="text-xs font-bold uppercase text-red-500">Risk</Text>
              <Text className="mt-1 text-xl font-bold text-red-600">{predictionResult.risk}</Text>
            </Card>
            <Card className="flex-1 rounded-xl bg-blue-50 p-3">
              <Text className="text-xs font-bold uppercase text-blue-500">Probability</Text>
              <Text className="mt-1 text-xl font-bold text-blue-600">{probabilityPercent}%</Text>
            </Card>
          </View>

          <Text className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Top Factors
          </Text>
          <View className="mb-1 flex-row flex-wrap gap-2">
            {predictionResult.top_factors.map((factor) => (
              <View
                key={factor.feature}
                className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1">
                <Text className="text-xs font-semibold text-amber-700">
                  {factor.feature} ({factor.impact})
                </Text>
              </View>
            ))}
          </View>
        </View>

        <SectionCard
          title="Personalized Advice"
          icon={<MaterialCommunityIcons name="medical-bag" size={18} color="#2563eb" />}
          markdownContent={predictionResult.advice}
          footerText="Note: This guidance is not a diagnosis. Always consult a qualified healthcare professional for individualized care."
        />
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 gap-2 bg-gray-100 px-4 pb-6 pt-2">
        <GradientButton variant="secondary" className="w-full">
          <View className="flex-row items-center gap-2">
            <MaterialCommunityIcons name="content-save" size={16} color="#ffffff" />
            <Text className="text-sm font-semibold text-white">Save Plan</Text>
          </View>
        </GradientButton>
        <GradientButton variant="primary" className="mt-1" onPress={handleDownloadPdf}>
          <View className="flex-row items-center gap-2">
            <MaterialCommunityIcons name="download" size={16} color="#ffffff" />
            <Text className="text-sm font-semibold text-white">
              {isDownloading ? 'Generating PDF...' : 'Download PDF'}
            </Text>
          </View>
        </GradientButton>
      </View>
    </View>
  );
}

type SectionCardProps = {
  title: string;
  icon: ReactNode;
  content?: string;
  markdownContent?: string;
  bulletItems?: string[];
  footerText?: string;
};

function SectionCard({ title, icon, content, markdownContent, bulletItems, footerText }: SectionCardProps) {
  return (
    <Card className="mb-4">
      <View className="mb-2 flex-row items-center gap-2">
        {icon}
        <Text className="text-lg font-bold text-slate-800">{title}</Text>
      </View>

      {markdownContent ? (
        <Markdown
          style={{
            body: { color: '#334155', fontSize: 14, lineHeight: 22 },
            paragraph: { marginTop: 0, marginBottom: 10 },
            strong: { color: '#1f2937', fontWeight: '700' },
            list_item: { marginBottom: 6 },
            bullet_list: { marginBottom: 6 },
            ordered_list: { marginBottom: 6 },
          }}
        >
          {markdownContent}
        </Markdown>
      ) : null}

      {content ? <Text className="text-sm leading-6 text-slate-700">{content}</Text> : null}

      {bulletItems ? (
        <View className="gap-2">
          {bulletItems.map((item) => (
            <View key={item} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
              <MaterialCommunityIcons name="circle-small" size={20} color="#64748b" style={{ marginTop: 2 }} />
              <Text className="flex-1 text-sm leading-6 text-slate-700">{item}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {footerText ? <Text className="mt-3 text-xs text-slate-500">{footerText}</Text> : null}
    </Card>
  );
}
