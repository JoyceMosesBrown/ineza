import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Radius, Shadow, Spacing } from '../../theme';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'tinted' | 'outlined';
  padding?: number;
}

export default function Card({ children, style, variant = 'default', padding = Spacing.md }: Props) {
  const variantStyle: ViewStyle =
    variant === 'tinted'
      ? { backgroundColor: Colors.surfaceAlt }
      : variant === 'outlined'
      ? { backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border }
      : { backgroundColor: Colors.white, ...Shadow.soft };

  return (
    <View style={[styles.card, variantStyle, { padding }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },
});
