import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, Radius, Typography } from '../../theme';

interface Props {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export default function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  textStyle,
  fullWidth = false,
}: Props) {
  const heights: Record<string, number> = { sm: 40, md: 50, lg: 56 };
  const fontSizes: Record<string, number> = { sm: 13, md: 15, lg: 17 };
  const h = heights[size];
  const fs = fontSizes[size];

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.85}
        style={[fullWidth && { width: '100%' }, style]}
      >
        <LinearGradient
          colors={disabled ? ['#A8C5B5', '#A8C5B5'] : [Colors.primaryLight, Colors.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.base, { height: h, borderRadius: Radius.full }]}
        >
          {loading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={[styles.primaryText, { fontSize: fs }, textStyle]}>{label}</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  const variantStyle: Record<string, ViewStyle> = {
    secondary: {
      backgroundColor: Colors.primaryPale,
      borderRadius: Radius.full,
      height: h,
    },
    ghost: {
      backgroundColor: 'transparent',
      borderRadius: Radius.full,
      height: h,
      borderWidth: 1.5,
      borderColor: Colors.primary,
    },
    danger: {
      backgroundColor: Colors.danger,
      borderRadius: Radius.full,
      height: h,
    },
  };

  const textColors: Record<string, string> = {
    secondary: Colors.primary,
    ghost: Colors.primary,
    danger: Colors.white,
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.base,
        variantStyle[variant],
        fullWidth && { width: '100%' },
        disabled && { opacity: 0.5 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColors[variant]} />
      ) : (
        <Text style={[styles.text, { fontSize: fs, color: textColors[variant] }, textStyle]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  primaryText: {
    color: Colors.white,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  text: {
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
