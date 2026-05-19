import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Path, G } from 'react-native-svg';
import { Colors, Typography } from '../../theme';

interface Props {
  size?: number;
  variant?: 'full' | 'icon' | 'wordmark';
  light?: boolean;
}

export default function InezaLogo({ size = 48, variant = 'full', light = false }: Props) {
  const iconSize = variant === 'full' ? size : size;
  const textColor = light ? Colors.white : Colors.primary;
  const leafColor = light ? Colors.white : Colors.primaryLight;
  const heartColor = light ? Colors.accentLight : Colors.accent;

  const Icon = () => (
    <Svg width={iconSize} height={iconSize} viewBox="0 0 48 48">
      {/* Outer circle background */}
      <Circle cx="24" cy="24" r="24" fill={light ? 'rgba(255,255,255,0.15)' : Colors.primaryPale} />

      {/* Leaf / plant growing upward — symbol of growth and nurturing */}
      <G transform="translate(24, 26)">
        {/* Stem */}
        <Path
          d="M0,8 L0,-4"
          stroke={light ? Colors.white : Colors.primary}
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Left leaf */}
        <Path
          d="M0,2 C-5,0 -7,-5 -3,-8 C-1,-9 0,-7 0,-4"
          fill={leafColor}
          opacity={0.85}
        />
        {/* Right leaf */}
        <Path
          d="M0,0 C5,-2 7,-7 3,-10 C1,-11 0,-9 0,-6"
          fill={leafColor}
        />
      </G>

      {/* Small heart — warmth and care */}
      <Path
        d="M24,19 C24,19 21,15.5 19,17 C17,18.5 18,21 21,23.5 C22,24.3 23.2,25 24,25.5 C24.8,25 26,24.3 27,23.5 C30,21 31,18.5 29,17 C27,15.5 24,19 24,19 Z"
        fill={heartColor}
        opacity={0.9}
      />
    </Svg>
  );

  if (variant === 'icon') {
    return <Icon />;
  }

  if (variant === 'wordmark') {
    return (
      <Text style={[styles.wordmark, { color: textColor, fontSize: size * 0.6 }]}>
        ineza
      </Text>
    );
  }

  return (
    <View style={styles.row}>
      <Icon />
      <View style={styles.textBlock}>
        <Text style={[styles.name, { color: textColor, fontSize: size * 0.45 }]}>
          ineza
        </Text>
        <Text style={[styles.tagline, { color: light ? 'rgba(255,255,255,0.7)' : Colors.textSecondary, fontSize: size * 0.18 }]}>
          your wellbeing companion
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  textBlock: {
    justifyContent: 'center',
  },
  name: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  wordmark: {
    fontWeight: '700',
    letterSpacing: 1,
  },
  tagline: {
    fontWeight: '400',
    letterSpacing: 0.3,
    marginTop: 1,
  },
});
