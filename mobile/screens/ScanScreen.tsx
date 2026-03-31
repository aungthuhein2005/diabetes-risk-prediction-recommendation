import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

type ScanMode = 'menu' | 'camera' | 'result';

type ScanScreenProps = {
  onBack: () => void;
};

type ScanResult = {
  imageUri: string;
  source: 'camera' | 'gallery';
  status: 'analyzing' | 'done';
  risk?: number;
  label?: string;
  notes?: string;
};

// ── Theme tokens (matches HomeScreen) ──────────────────────────────────
const T = {
  bg: '#f1f5f9',        // bg-gray-100
  card: '#ffffff',      // white cards
  text: '#0f172a',      // slate-900
  subtext: '#64748b',   // slate-500
  muted: '#94a3b8',     // slate-400
  border: '#e2e8f0',    // slate-200
  blue: '#0284c7',      // sky-600
  blueBg: '#e0f2fe',    // sky-100
  blueDark: '#0369a1',  // sky-700
  purple: '#7c3aed',
  purpleBg: '#ede9fe',
};

export function ScanScreen({ onBack }: ScanScreenProps) {
  const [mode, setMode] = useState<ScanMode>('menu');
  const [cameraFacing, setCameraFacing] = useState<'front' | 'back'>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  // ── Simulate AI analysis ──────────────────────────────────────────────
  const analyzeImage = (uri: string, source: 'camera' | 'gallery') => {
    setIsAnalyzing(true);
    setScanResult({ imageUri: uri, source, status: 'analyzing' });
    setMode('result');

    setTimeout(() => {
      const risk = Math.floor(Math.random() * 60) + 20;
      const label = risk < 40 ? 'Low Risk' : risk < 65 ? 'Moderate Risk' : 'High Risk';
      const notes =
        risk < 40
          ? 'Your scan looks healthy. Keep maintaining your current lifestyle.'
          : risk < 65
            ? 'Some markers suggest elevated risk. Consider a clinical glucose test.'
            : 'Several risk indicators detected. Please consult a healthcare professional soon.';

      setScanResult({ imageUri: uri, source, status: 'done', risk, label, notes });
      setIsAnalyzing(false);
    }, 2500);
  };

  // ── Camera capture ────────────────────────────────────────────────────
  const handleCapture = async () => {
    if (!cameraRef.current) return;
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      if (photo?.uri) analyzeImage(photo.uri, 'camera');
    } catch {
      Alert.alert('Error', 'Failed to capture photo. Please try again.');
    }
  };

  // ── Gallery picker ────────────────────────────────────────────────────
  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Needed', 'Please allow access to your photo library.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.canceled && result.assets[0]) {
      analyzeImage(result.assets[0].uri, 'gallery');
    }
  };

  // ── Open Camera ───────────────────────────────────────────────────────
  const openCamera = async () => {
    if (!permission?.granted) {
      const res = await requestPermission();
      if (!res.granted) {
        Alert.alert('Permission Needed', 'Camera access is required to scan images.');
        return;
      }
    }
    setMode('camera');
  };

  const reset = () => {
    setScanResult(null);
    setIsAnalyzing(false);
    setMode('menu');
  };

  // ─────────────────────────────────────────────────────────────────────
  // RENDER: CAMERA VIEW
  // ─────────────────────────────────────────────────────────────────────
  if (mode === 'camera') {
    return (
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        <CameraView ref={cameraRef} style={{ flex: 1 }} facing={cameraFacing}>
          {/* Top bar */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 16, paddingTop: 48 }}>
            <Pressable
              onPress={() => setMode('menu')}
              style={{ backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 24, padding: 10 }}
            >
              <MaterialCommunityIcons name="arrow-left" size={24} color="#0f172a" />
            </Pressable>
            <Pressable
              onPress={() => setCameraFacing(f => (f === 'back' ? 'front' : 'back'))}
              style={{ backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 24, padding: 10 }}
            >
              <MaterialCommunityIcons name="camera-flip-outline" size={24} color="#0f172a" />
            </Pressable>
          </View>

          {/* Viewfinder */}
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ width: 240, height: 240, borderWidth: 2.5, borderColor: '#38bdf8', borderRadius: 20 }} />
            <View style={{ marginTop: 14, backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 6 }}>
              <Text style={{ color: '#0f172a', fontSize: 13, fontWeight: '600' }}>
                Position scan area within frame
              </Text>
            </View>
          </View>

          {/* Bottom bar */}
          <View style={{ alignItems: 'center', paddingBottom: 48, gap: 14 }}>
            <View style={{ backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <MaterialCommunityIcons name="robot-outline" size={14} color="#0284c7" />
              <Text style={{ color: '#0284c7', fontSize: 12, fontWeight: '600' }}>AI will analyze your image instantly</Text>
            </View>
            <Pressable
              onPress={handleCapture}
              style={{
                width: 76, height: 76, borderRadius: 38,
                backgroundColor: '#0284c7',
                alignItems: 'center', justifyContent: 'center',
                borderWidth: 4, borderColor: '#fff',
                shadowColor: '#0284c7', shadowOpacity: 0.5, shadowRadius: 14, elevation: 8,
              }}
            >
              <MaterialCommunityIcons name="camera" size={34} color="#fff" />
            </Pressable>
          </View>
        </CameraView>
      </View>
    );
  }

  // ─────────────────────────────────────────────────────────────────────
  // RENDER: RESULT VIEW
  // ─────────────────────────────────────────────────────────────────────
  if (mode === 'result') {
    const risk = scanResult?.risk ?? 0;
    const riskColor = risk < 40 ? '#10b981' : risk < 65 ? '#f59e0b' : '#ef4444';
    const riskBg   = risk < 40 ? '#d1fae5' : risk < 65 ? '#fef3c7' : '#fee2e2';

    return (
      <View style={{ flex: 1, backgroundColor: T.bg }}>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>

          {/* Header */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, paddingTop: 4 }}>
            <Pressable
              onPress={reset}
              style={{ marginRight: 12, width: 36, height: 36, borderRadius: 18, backgroundColor: T.card, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: T.border }}
            >
              <MaterialCommunityIcons name="arrow-left" size={20} color={T.text} />
            </Pressable>
            <Text style={{ color: T.text, fontSize: 18, fontWeight: '800' }}>Scan Result</Text>
          </View>

          {/* Image preview */}
          {scanResult?.imageUri && (
            <View style={{ borderRadius: 20, overflow: 'hidden', marginBottom: 16, borderWidth: 1, borderColor: T.border }}>
              <Image source={{ uri: scanResult.imageUri }} style={{ width: '100%', height: 200 }} resizeMode="cover" />
            </View>
          )}

          {/* Analysis */}
          {isAnalyzing ? (
            <View style={{ backgroundColor: T.card, borderRadius: 20, padding: 40, alignItems: 'center', gap: 16, borderWidth: 1, borderColor: T.border }}>
              <ActivityIndicator size="large" color={T.blue} />
              <Text style={{ color: T.subtext, fontSize: 15, fontWeight: '600' }}>AI is analyzing your image…</Text>
              <Text style={{ color: T.muted, fontSize: 12 }}>This usually takes a few seconds</Text>
            </View>
          ) : (
            <>
              {/* Risk Score Card */}
              <View style={{ backgroundColor: T.card, borderRadius: 20, padding: 20, marginBottom: 12, borderWidth: 1, borderColor: T.border, alignItems: 'center', gap: 10 }}>
                <Text style={{ color: T.subtext, fontSize: 13, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Diabetes Risk Score
                </Text>
                <Text style={{ color: riskColor, fontSize: 56, fontWeight: '800', lineHeight: 64 }}>
                  {risk}%
                </Text>
                <View style={{ backgroundColor: riskBg, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 5 }}>
                  <Text style={{ color: riskColor, fontSize: 13, fontWeight: '700' }}>{scanResult?.label}</Text>
                </View>
              </View>

              {/* Risk bar */}
              <View style={{ backgroundColor: T.card, borderRadius: 20, padding: 18, marginBottom: 12, borderWidth: 1, borderColor: T.border }}>
                <Text style={{ color: T.subtext, fontSize: 12, fontWeight: '600', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>Risk Level</Text>
                <View style={{ height: 10, backgroundColor: T.border, borderRadius: 6, overflow: 'hidden' }}>
                  <View style={{ height: '100%', width: `${risk}%` as `${number}%`, backgroundColor: riskColor, borderRadius: 6 }} />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                  <Text style={{ color: '#10b981', fontSize: 11, fontWeight: '600' }}>Low</Text>
                  <Text style={{ color: '#f59e0b', fontSize: 11, fontWeight: '600' }}>Moderate</Text>
                  <Text style={{ color: '#ef4444', fontSize: 11, fontWeight: '600' }}>High</Text>
                </View>
              </View>

              {/* AI Notes */}
              <View style={{ backgroundColor: T.card, borderRadius: 20, padding: 18, marginBottom: 12, borderWidth: 1, borderColor: T.border }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <MaterialCommunityIcons name="robot-outline" size={18} color={T.blue} />
                  <Text style={{ color: T.text, fontSize: 13, fontWeight: '700' }}>AI Assessment</Text>
                </View>
                <Text style={{ color: T.subtext, fontSize: 14, lineHeight: 22 }}>{scanResult?.notes}</Text>
              </View>

              {/* Source badge */}
              <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: T.blueBg, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6 }}>
                  <MaterialCommunityIcons
                    name={scanResult?.source === 'camera' ? 'camera-outline' : 'image-outline'}
                    size={14} color={T.blue}
                  />
                  <Text style={{ color: T.blueDark, fontSize: 12, fontWeight: '600' }}>
                    {scanResult?.source === 'camera' ? 'Camera Scan' : 'Gallery Upload'}
                  </Text>
                </View>
              </View>

              {/* Actions */}
              <Pressable
                onPress={reset}
                style={({ pressed }) => ({
                  backgroundColor: pressed ? '#0369a1' : T.blue,
                  borderRadius: 16, padding: 16, alignItems: 'center',
                  shadowColor: T.blue, shadowOpacity: 0.25, shadowRadius: 10, elevation: 4,
                })}
              >
                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>Scan Again</Text>
              </Pressable>

              <Pressable onPress={onBack} style={{ marginTop: 12, alignItems: 'center', padding: 14 }}>
                <Text style={{ color: T.subtext, fontSize: 14, fontWeight: '600' }}>← Back to Home</Text>
              </Pressable>
            </>
          )}
        </ScrollView>
      </View>
    );
  }

  // ─────────────────────────────────────────────────────────────────────
  // RENDER: MENU VIEW
  // ─────────────────────────────────────────────────────────────────────
  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>

        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, paddingTop: 4 }}>
          <Pressable
            onPress={onBack}
            style={{ marginRight: 12, width: 36, height: 36, borderRadius: 18, backgroundColor: T.card, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: T.border }}
          >
            <MaterialCommunityIcons name="arrow-left" size={20} color={T.text} />
          </Pressable>
          <View>
            <Text style={{ color: T.text, fontSize: 20, fontWeight: '800' }}>AI Image Scan</Text>
            <Text style={{ color: T.subtext, fontSize: 13 }}>Analyze diabetic risk from images</Text>
          </View>
        </View>

        {/* Hero card */}
        <View style={{ backgroundColor: T.card, borderRadius: 20, padding: 24, marginBottom: 16, borderWidth: 1, borderColor: T.border, alignItems: 'center', gap: 10 }}>
          <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: T.blueBg, alignItems: 'center', justifyContent: 'center' }}>
            <MaterialCommunityIcons name="line-scan" size={36} color={T.blue} />
          </View>
          <Text style={{ color: T.text, fontSize: 17, fontWeight: '800', textAlign: 'center' }}>
            Instant AI Risk Detection
          </Text>
          <Text style={{ color: T.subtext, fontSize: 13, textAlign: 'center', lineHeight: 20 }}>
            Our AI analyzes diabetic risk indicators from your images using computer vision models.
          </Text>
        </View>

        {/* Option 1 — Camera Scan */}
        <Pressable
          onPress={openCamera}
          style={({ pressed }) => ({
            backgroundColor: pressed ? '#e0f2fe' : T.card,
            borderRadius: 20, padding: 18, marginBottom: 12,
            borderWidth: 1.5, borderColor: '#38bdf8',
            flexDirection: 'row', alignItems: 'center', gap: 16,
          })}
        >
          <View style={{ width: 54, height: 54, borderRadius: 16, backgroundColor: T.blueBg, alignItems: 'center', justifyContent: 'center' }}>
            <MaterialCommunityIcons name="camera-outline" size={28} color={T.blue} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: T.text, fontSize: 15, fontWeight: '700', marginBottom: 3 }}>
              Scan with Camera
            </Text>
            <Text style={{ color: T.subtext, fontSize: 13, lineHeight: 18 }}>
              Use your camera to capture and analyze an image in real-time
            </Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={20} color={T.blue} />
        </Pressable>

        {/* Option 2 — Gallery Upload */}
        <Pressable
          onPress={handlePickImage}
          style={({ pressed }) => ({
            backgroundColor: pressed ? '#ede9fe' : T.card,
            borderRadius: 20, padding: 18, marginBottom: 20,
            borderWidth: 1.5, borderColor: '#a78bfa',
            flexDirection: 'row', alignItems: 'center', gap: 16,
          })}
        >
          <View style={{ width: 54, height: 54, borderRadius: 16, backgroundColor: T.purpleBg, alignItems: 'center', justifyContent: 'center' }}>
            <MaterialCommunityIcons name="image-search-outline" size={28} color={T.purple} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: T.text, fontSize: 15, fontWeight: '700', marginBottom: 3 }}>
              Upload from Gallery
            </Text>
            <Text style={{ color: T.subtext, fontSize: 13, lineHeight: 18 }}>
              Select an existing photo from your library to analyze
            </Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={20} color={T.purple} />
        </Pressable>

        {/* How it works */}
        <Text style={{ color: T.muted, fontSize: 11, fontWeight: '700', marginBottom: 14, textTransform: 'uppercase', letterSpacing: 1.2 }}>
          How it works
        </Text>
        {[
          { icon: 'camera-outline', title: 'Capture or Upload', desc: 'Take a photo or pick one from your gallery', color: T.blue, bg: T.blueBg },
          { icon: 'robot-outline', title: 'AI Analysis', desc: 'Our model detects risk indicators within seconds', color: '#8b5cf6', bg: '#ede9fe' },
          { icon: 'chart-bar', title: 'Get Your Risk Score', desc: 'Receive a detailed risk assessment with recommendations', color: '#10b981', bg: '#d1fae5' },
        ].map((item, i) => (
          <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 14, marginBottom: 16, backgroundColor: T.card, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: T.border }}>
            <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: item.bg, alignItems: 'center', justifyContent: 'center' }}>
              <MaterialCommunityIcons name={item.icon as any} size={20} color={item.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: T.text, fontSize: 14, fontWeight: '700', marginBottom: 2 }}>{item.title}</Text>
              <Text style={{ color: T.subtext, fontSize: 13 }}>{item.desc}</Text>
            </View>
          </View>
        ))}

        {/* Disclaimer */}
        <View style={{ backgroundColor: '#fefce8', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#fde68a', flexDirection: 'row', gap: 10, alignItems: 'flex-start', marginTop: 4 }}>
          <MaterialCommunityIcons name="alert-outline" size={18} color="#d97706" style={{ marginTop: 1 }} />
          <Text style={{ color: '#92400e', fontSize: 12, lineHeight: 18, flex: 1 }}>
            <Text style={{ fontWeight: '700' }}>Disclaimer: </Text>
            This tool is for informational purposes only and does not replace professional medical advice.
          </Text>
        </View>

      </ScrollView>
    </View>
  );
}
