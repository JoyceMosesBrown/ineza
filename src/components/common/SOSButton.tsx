import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  Alert,
  View,
} from 'react-native';
import { Colors, Radius, Shadow } from '../../theme';

export default function SOSButton() {
  const scale = useRef(new Animated.Value(1)).current;

  const pulse = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.94, duration: 100, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const handlePress = () => {
    pulse();
    Alert.alert(
      'Ubufasha butangira',
      'Ubutumwa bwatumwe kuri umujyanama wawe. Ntutinye — dufite hamwe nawe.\n\n"Nturi wenyine. Ubufasha buragera. Uri intwari."',
      [
        { text: 'Hamagara CHW', style: 'default' },
        { text: 'Funga', style: 'cancel' },
      ]
    );
  };

  return (
    <Animated.View style={[styles.wrapper, { transform: [{ scale }] }]}>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.9} style={styles.button}>
        <View style={styles.inner}>
          <Text style={styles.icon}>🆘</Text>
          <Text style={styles.label}>Ndakeneye ubufasha</Text>
          <Text style={styles.sub}>I need help</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: 'center',
  },
  button: {
    backgroundColor: Colors.danger,
    borderRadius: Radius.xl,
    paddingVertical: 14,
    paddingHorizontal: 28,
    ...Shadow.medium,
  },
  inner: {
    alignItems: 'center',
    gap: 2,
  },
  icon: {
    fontSize: 22,
  },
  label: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.2,
  },
  sub: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
  },
});
