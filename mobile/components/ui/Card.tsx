import type { ReactNode } from 'react';
import { View } from 'react-native';

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className = '' }: CardProps) {
  return (
    <View
      className={`mb-4 rounded-3xl border border-white/80 bg-slate-50 px-4 py-5 shadow-xl shadow-blue-100 ${className}`}>
      {children}
    </View>
  );
}
