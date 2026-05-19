import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography, Radius, Shadow } from '../../theme';
import Button from '../../components/common/Button';
import InezaLogo from '../../components/logo/InezaLogo';
import { useApp, Language } from '../../context/AppContext';
import { DISTRICTS } from '../../data/content';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const { completeOnboarding } = useApp();
  const [step, setStep] = useState(0);
  const [lang, setLang] = useState<Language>('rw');
  const [nickname, setNickname] = useState('');
  const [district, setDistrict] = useState('');
  const [showDistricts, setShowDistricts] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const goNext = () => {
    const next = step + 1;
    setStep(next);
    scrollRef.current?.scrollTo({ x: width * next, animated: true });
  };

  const finish = () => {
    completeOnboarding(nickname.trim() || 'Mama', district || 'Kigali', lang);
  };

  return (
    <LinearGradient colors={[Colors.primary, Colors.primaryLight]} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          style={{ flex: 1 }}
        >
          {/* Step 0 — Language */}
          <View style={[styles.slide, { width }]}>
            <View style={styles.center}>
              <InezaLogo size={64} light />
              <Text style={styles.heroTitle}>Murakaza neza{'\n'}Welcome</Text>
              <Text style={styles.heroSub}>Hitamo ururimi / Choose your language</Text>
              <View style={styles.langRow}>
                <TouchableOpacity
                  style={[styles.langCard, lang === 'rw' && styles.langCardActive]}
                  onPress={() => setLang('rw')}
                >
                  <Text style={styles.langFlag}>🇷🇼</Text>
                  <Text style={[styles.langLabel, lang === 'rw' && styles.langLabelActive]}>
                    Kinyarwanda
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.langCard, lang === 'en' && styles.langCardActive]}
                  onPress={() => setLang('en')}
                >
                  <Text style={styles.langFlag}>🇬🇧</Text>
                  <Text style={[styles.langLabel, lang === 'en' && styles.langLabelActive]}>
                    English
                  </Text>
                </TouchableOpacity>
              </View>
              <Button
                label={lang === 'rw' ? 'Komeza' : 'Continue'}
                onPress={goNext}
                size="lg"
                style={styles.nextBtn}
                textStyle={{ color: Colors.primary }}
              />
            </View>
          </View>

          {/* Step 1 — Safe space intro */}
          <View style={[styles.slide, { width }]}>
            <View style={styles.center}>
              <Text style={styles.emoji}>🌿</Text>
              <Text style={styles.stepTitle}>
                {lang === 'rw' ? 'Aha ni ahantu hatazo n\'amakuba' : 'This is your safe space'}
              </Text>
              <Text style={styles.stepBody}>
                {lang === 'rw'
                  ? 'Nta makosa. Nta ngorane. Aha ugaragaza ibyiyumvo byawe uko bishaka.\n\nNturi wenyine.'
                  : 'No judgment. No pressure. Here you express yourself freely.\n\nYou are not alone.'}
              </Text>
              <View style={styles.pillRow}>
                {['🔒', '🤝', '💛'].map((icon, i) => (
                  <View key={i} style={styles.pill}>
                    <Text style={styles.pillIcon}>{icon}</Text>
                    <Text style={styles.pillText}>
                      {i === 0
                        ? lang === 'rw' ? 'Ibanga' : 'Private'
                        : i === 1
                        ? lang === 'rw' ? 'Ubufasha' : 'Support'
                        : lang === 'rw' ? 'Impuhwe' : 'Warmth'}
                    </Text>
                  </View>
                ))}
              </View>
              <Button
                label={lang === 'rw' ? 'Komeza' : 'Continue'}
                onPress={goNext}
                size="lg"
                style={styles.nextBtn}
                textStyle={{ color: Colors.primary }}
              />
            </View>
          </View>

          {/* Step 2 — Nickname + District */}
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ width }}
          >
            <ScrollView contentContainerStyle={styles.center} keyboardShouldPersistTaps="handled">
              <Text style={styles.stepTitle}>
                {lang === 'rw' ? 'Tuvuge twese' : 'A little about you'}
              </Text>
              <Text style={styles.stepBody}>
                {lang === 'rw'
                  ? 'Nta mazina nyayo — ibanga ryawe rirabitswe.'
                  : 'No real name needed — your privacy is protected.'}
              </Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  {lang === 'rw' ? 'Izina ryo mu rugo' : 'Nickname'}
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder={lang === 'rw' ? 'urugero: Keza' : 'e.g. Grace'}
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={nickname}
                  onChangeText={setNickname}
                  maxLength={20}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  {lang === 'rw' ? 'Akarere' : 'District'}
                </Text>
                <TouchableOpacity
                  style={styles.input}
                  onPress={() => setShowDistricts(!showDistricts)}
                >
                  <Text style={{ color: district ? Colors.white : 'rgba(255,255,255,0.5)', fontSize: 15 }}>
                    {district || (lang === 'rw' ? 'Hitamo akarere...' : 'Select district...')}
                  </Text>
                </TouchableOpacity>
                {showDistricts && (
                  <View style={styles.dropdown}>
                    <FlatList
                      data={DISTRICTS}
                      keyExtractor={d => d}
                      style={{ maxHeight: 200 }}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={styles.dropdownItem}
                          onPress={() => { setDistrict(item); setShowDistricts(false); }}
                        >
                          <Text style={styles.dropdownText}>{item}</Text>
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                )}
              </View>

              <Button
                label={lang === 'rw' ? 'Tangira' : "Let's begin"}
                onPress={finish}
                size="lg"
                style={{ ...styles.nextBtn, marginTop: Spacing.xl }}
                textStyle={{ color: Colors.primary }}
                disabled={!nickname.trim()}
              />
            </ScrollView>
          </KeyboardAvoidingView>
        </ScrollView>

        {/* Step indicators */}
        <View style={styles.dotsRow}>
          {[0, 1, 2].map(i => (
            <View key={i} style={[styles.dot, step === i && styles.dotActive]} />
          ))}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  slide: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  heroTitle: {
    color: Colors.white,
    fontSize: Typography.size.xxl,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: Spacing.lg,
    lineHeight: 38,
  },
  heroSub: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: Typography.size.base,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xl,
    textAlign: 'center',
  },
  langRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  langCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 130,
  },
  langCardActive: {
    backgroundColor: Colors.white,
    borderColor: Colors.white,
  },
  langFlag: { fontSize: 32, marginBottom: 6 },
  langLabel: {
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '600',
    fontSize: Typography.size.base,
  },
  langLabelActive: { color: Colors.primary },
  nextBtn: {
    backgroundColor: Colors.white,
    width: '100%',
    maxWidth: 320,
  },
  emoji: { fontSize: 56, marginBottom: Spacing.md },
  stepTitle: {
    color: Colors.white,
    fontSize: Typography.size.xl,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  stepBody: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: Typography.size.md,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: Spacing.xl,
  },
  pillRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  pill: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: Radius.full,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  pillIcon: { fontSize: 16 },
  pillText: { color: Colors.white, fontSize: 13, fontWeight: '500' },
  inputGroup: { width: '100%', marginBottom: Spacing.md },
  inputLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 6,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: Radius.md,
    padding: Spacing.md,
    color: Colors.white,
    fontSize: Typography.size.base,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
  },
  dropdown: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    marginTop: 4,
    ...Shadow.medium,
  },
  dropdownItem: {
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  dropdownText: { color: Colors.textPrimary, fontSize: Typography.size.base },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: Spacing.lg,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  dotActive: {
    backgroundColor: Colors.white,
    width: 24,
  },
});
