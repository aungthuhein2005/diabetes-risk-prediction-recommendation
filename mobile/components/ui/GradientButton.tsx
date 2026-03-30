import type { ReactNode } from 'react';
import { Pressable, Text } from 'react-native';

type GradientButtonProps = {
  title?: string;
  children?: ReactNode;
  onPress?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary';
};

export function GradientButton({
  title,
  children,
  onPress,
  className = '',
  variant = 'primary',
}: GradientButtonProps) {
  const variantStyles =
    variant === 'primary'
      ? 'bg-blue-500 active:bg-blue-600'
      : 'bg-emerald-500 active:bg-emerald-600';

  return (
    <Pressable
      onPress={onPress}
      className={`items-center rounded-full px-4 py-3 ${variantStyles} ${className}`}>
      {children ?? <Text className="text-sm font-semibold text-white">{title}</Text>}
    </Pressable>
  );
}
