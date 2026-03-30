import type { ReactNode } from 'react';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { Card } from '../components/ui/Card';
import { GradientButton } from '../components/ui/GradientButton';
import {
  ChevronLeft,
  CircleAlert,
  Download,
  HeartPulse,
  ListChecks,
  Save,
  Stethoscope,
} from 'lucide-react-native';
import { downloadRecommendationPdf } from '../utils/pdfGenerator';

type RecommendationScreenProps = {
  onBack: () => void;
};

const predictionResult = {
  risk: 'High',
  probability: 0.7171334,
  top_factors: [
    { feature: 'Glucose', impact: 'High' },
    { feature: 'Insulin', impact: 'High' },
    { feature: 'Age', impact: 'High' },
  ],
  advice:
    '1. **Simple Explanation**  \nYour risk level is high due to elevated glucose (blood sugar), insulin levels, and age. These factors are linked to conditions like diabetes, metabolic syndrome, or heart disease. While this doesn’t mean you have a specific illness, it highlights the need to address these risks early to protect your health.\n\n2. **Lifestyle Advice**  \n- **Diet**: Focus on whole foods (vegetables, lean proteins, whole grains) and limit refined sugars, processed foods, and sugary drinks.  \n- **Exercise**: Aim for 30–60 minutes of moderate activity (e.g., walking, swimming) most days to improve insulin sensitivity and glucose control.  \n- **Weight Management**: Even a 5–10% reduction in body weight can significantly lower blood sugar and insulin levels.  \n- **Sleep & Stress**: Prioritize 7–8 hours of sleep and practice stress-reduction techniques (e.g., meditation, yoga) to support metabolic health.  \n\n3. **Preventive Steps**  \n- **Monitor Health Metrics**: Regularly check blood sugar levels (if recommended by a healthcare provider) and track cholesterol or blood pressure.  \n- **Hydration**: Drink plenty of water to support kidney function and metabolism.  \n- **Avoid Harmful Habits**: Limit alcohol, quit smoking, and reduce sedentary behavior (e.g., screen time).  \n- **Stay Informed**: Learn about your family health history and discuss risks with a professional.  \n\n4. **Suggest Consulting a Doctor**  \nA healthcare provider can assess your risk through blood tests (e.g., HbA1c, lipid panel) and create a personalized plan. Early intervention can reduce complications and improve long-term outcomes.  \n\n**Note**: This guidance is not a diagnosis. Always consult a qualified healthcare professional for individualized care.',
};

export function RecommendationScreen({ onBack }: RecommendationScreenProps) {
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
              <ChevronLeft size={18} color="#64748b" />
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
          title="Explanation"
          icon={<CircleAlert size={18} color="#2563eb" />}
          content="Your risk level is high due to elevated glucose, insulin, and age. These are early warning indicators linked to diabetes and related metabolic conditions. It is not a confirmed diagnosis, but taking action now can protect long-term health."
        />

        <SectionCard
          title="Action Plan"
          icon={<ListChecks size={18} color="#0891b2" />}
          bulletItems={[
            'Monitor blood sugar and blood pressure regularly.',
            'Stay hydrated to support kidney and metabolic function.',
            'Reduce sedentary time and avoid smoking or excess alcohol.',
            'Track risk factors consistently and review trends monthly.',
          ]}
        />

        <SectionCard
          title="Lifestyle"
          icon={<HeartPulse size={18} color="#16a34a" />}
          bulletItems={[
            'Diet: Focus on whole foods and reduce refined sugars.',
            'Exercise: Aim for 30-60 minutes of moderate activity most days.',
            'Weight: A 5-10% weight reduction can improve insulin response.',
            'Sleep and Stress: Maintain 7-8 hours sleep and practice stress control.',
          ]}
        />

        <SectionCard
          title="Doctor Advice"
          icon={<Stethoscope size={18} color="#7c3aed" />}
          content="Consult a healthcare provider for confirmatory tests such as HbA1c and lipid panel. A personalized medical plan can reduce complications and improve long-term outcomes."
          footerText="Note: This guidance is not a diagnosis. Always consult a qualified healthcare professional for individualized care."
        />
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 gap-2 bg-gray-100 px-4 pb-6 pt-2">
        <GradientButton variant="secondary" className="w-full">
          <View className="flex-row items-center gap-2">
            <Save size={16} color="#ffffff" />
            <Text className="text-sm font-semibold text-white">Save Plan</Text>
          </View>
        </GradientButton>
        <GradientButton variant="primary" className="mt-1" onPress={handleDownloadPdf}>
          <View className="flex-row items-center gap-2">
            <Download size={16} color="#ffffff" />
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
  bulletItems?: string[];
  footerText?: string;
};

function SectionCard({ title, icon, content, bulletItems, footerText }: SectionCardProps) {
  return (
    <Card className="mb-4">
      <View className="mb-2 flex-row items-center gap-2">
        {icon}
        <Text className="text-lg font-bold text-slate-800">{title}</Text>
      </View>

      {content ? <Text className="text-sm leading-6 text-slate-700">{content}</Text> : null}

      {bulletItems ? (
        <View className="gap-2">
          {bulletItems.map((item) => (
            <Text key={item} className="text-sm leading-6 text-slate-700">
              {'\u2022'} {item}
            </Text>
          ))}
        </View>
      ) : null}

      {footerText ? <Text className="mt-3 text-xs text-slate-500">{footerText}</Text> : null}
    </Card>
  );
}
