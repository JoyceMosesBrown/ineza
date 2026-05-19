import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, Typography, Radius, Shadow } from '../../theme';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import SOSButton from '../../components/common/SOSButton';
import { useApp } from '../../context/AppContext';

const { width } = Dimensions.get('window');

interface Props { navigation: any }

export default function TrackerScreen({ navigation }: Props) {
  const { language, todayEntry, saveEntry, t } = useApp();

  const [sleep, setSleep] = useState<number>(todayEntry?.sleep ?? 0);
  const [ate, setAte] = useState<'yes' | 'little' | 'no' | null>(todayEntry?.ate ?? null);
  const [cried, setCried] = useState<boolean | null>(todayEntry?.cried ?? null);
  const [bond, setBond] = useState<number>(todayEntry?.babyBond ?? 0);
  const [anxiety, setAnxiety] = useState<'yes' | 'sometimes' | 'no' | null>(todayEntry?.anxiety ?? null);
  const [social, setSocial] = useState<boolean | null>(todayEntry?.social ?? null);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    saveEntry({ sleep, ate, cried, babyBond: bond, anxiety, social });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const sleepHours = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const bondLevels = [1, 2, 3, 4, 5];
  const bondEmojis = ['😞', '😕', '😐', '🙂', '💛'];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {language === 'rw' ? 'Gukurikirana' : 'Daily Tracker'}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        {/* Intro */}
        <LinearGradient
          colors={[Colors.primaryPale, Colors.white]}
          style={styles.introBanner}
        >
          <Text style={styles.introEmoji}>📊</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.introTitle}>
              {language === 'rw' ? 'Uyu munsi' : "Today's log"}
            </Text>
            <Text style={styles.introSub}>
              {language === 'rw' ? 'Bitwara munsi ya 2 min' : 'Takes under 2 minutes'}
            </Text>
          </View>
        </LinearGradient>

        {/* Sleep */}
        <Card style={styles.section} padding={Spacing.md}>
          <View style={styles.questionRow}>
            <Text style={styles.questionIcon}>😴</Text>
            <Text style={styles.questionText}>{t('sleepQ')}</Text>
          </View>
          <View style={styles.sleepRow}>
            {sleepHours.map(h => (
              <TouchableOpacity
                key={h}
                style={[styles.sleepBtn, sleep === h && styles.sleepBtnActive]}
                onPress={() => setSleep(h)}
              >
                <Text style={[styles.sleepBtnText, sleep === h && styles.sleepBtnTextActive]}>
                  {h === 8 ? '8+' : h}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.answerLabel}>
            {sleep === 0 ? (language === 'rw' ? 'Ntisinziye' : 'No sleep') : `${sleep}h`}
          </Text>
        </Card>

        {/* Ate */}
        <Card style={styles.section} padding={Spacing.md}>
          <View style={styles.questionRow}>
            <Text style={styles.questionIcon}>🍽️</Text>
            <Text style={styles.questionText}>{t('ateQ')}</Text>
          </View>
          <View style={styles.optionRow}>
            {(['yes', 'little', 'no'] as const).map(opt => (
              <TouchableOpacity
                key={opt}
                style={[styles.optBtn, ate === opt && styles.optBtnActive]}
                onPress={() => setAte(opt)}
              >
                <Text style={[styles.optText, ate === opt && styles.optTextActive]}>
                  {opt === 'yes' ? t('yes') : opt === 'little' ? t('little') : t('no')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Cried */}
        <Card style={styles.section} padding={Spacing.md}>
          <View style={styles.questionRow}>
            <Text style={styles.questionIcon}>😢</Text>
            <Text style={styles.questionText}>{t('criedQ')}</Text>
          </View>
          <View style={styles.optionRow}>
            {[true, false].map(opt => (
              <TouchableOpacity
                key={String(opt)}
                style={[styles.optBtn, cried === opt && styles.optBtnActive]}
                onPress={() => setCried(opt)}
              >
                <Text style={[styles.optText, cried === opt && styles.optTextActive]}>
                  {opt ? t('yes') : t('no')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Baby bond */}
        <Card style={styles.section} padding={Spacing.md}>
          <View style={styles.questionRow}>
            <Text style={styles.questionIcon}>👶</Text>
            <Text style={styles.questionText}>{t('bondQ')}</Text>
          </View>
          <View style={styles.bondRow}>
            {bondLevels.map((lvl, i) => (
              <TouchableOpacity
                key={lvl}
                onPress={() => setBond(lvl)}
                style={[styles.bondBtn, bond === lvl && styles.bondBtnActive]}
              >
                <Text style={styles.bondEmoji}>{bondEmojis[i]}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Anxiety */}
        <Card style={styles.section} padding={Spacing.md}>
          <View style={styles.questionRow}>
            <Text style={styles.questionIcon}>😰</Text>
            <Text style={styles.questionText}>{t('anxietyQ')}</Text>
          </View>
          <View style={styles.optionRow}>
            {(['yes', 'sometimes', 'no'] as const).map(opt => (
              <TouchableOpacity
                key={opt}
                style={[styles.optBtn, anxiety === opt && styles.optBtnActive]}
                onPress={() => setAnxiety(opt)}
              >
                <Text style={[styles.optText, anxiety === opt && styles.optTextActive]}>
                  {opt === 'yes' ? t('yes') : opt === 'sometimes' ? t('sometimes') : t('no')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Social */}
        <Card style={styles.section} padding={Spacing.md}>
          <View style={styles.questionRow}>
            <Text style={styles.questionIcon}>🗣️</Text>
            <Text style={styles.questionText}>{t('socialQ')}</Text>
          </View>
          <View style={styles.optionRow}>
            {[true, false].map(opt => (
              <TouchableOpacity
                key={String(opt)}
                style={[styles.optBtn, social === opt && styles.optBtnActive]}
                onPress={() => setSocial(opt)}
              >
                <Text style={[styles.optText, social === opt && styles.optTextActive]}>
                  {opt ? t('yes') : t('no')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Save Button */}
        {saved ? (
          <View style={styles.savedBadge}>
            <Text style={styles.savedText}>
              ✓ {language === 'rw' ? 'Ibikwa neza!' : 'Saved!'}
            </Text>
          </View>
        ) : (
          <Button
            label={language === 'rw' ? 'Bika ibisubizo' : 'Save my log'}
            onPress={handleSave}
            size="lg"
            fullWidth
          />
        )}

        <View style={{ marginTop: Spacing.md }}>
          <SOSButton />
        </View>
        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const OPTION_W = (width - Spacing.lg * 2 - Spacing.md * 2 - Spacing.sm * 2) / 3;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    backgroundColor: Colors.white,
  },
  backBtn: { padding: 8 },
  backIcon: { fontSize: 20, color: Colors.primary },
  headerTitle: { fontWeight: '700', fontSize: Typography.size.md, color: Colors.textPrimary },
  body: { padding: Spacing.md, gap: Spacing.sm, paddingBottom: Spacing.xxl },
  introBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    marginBottom: Spacing.sm,
  },
  introEmoji: { fontSize: 28 },
  introTitle: { fontWeight: '700', fontSize: Typography.size.base, color: Colors.textPrimary },
  introSub: { color: Colors.textSecondary, fontSize: Typography.size.sm, marginTop: 2 },
  section: { ...Shadow.soft },
  questionRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.md },
  questionIcon: { fontSize: 22 },
  questionText: { color: Colors.textPrimary, fontSize: Typography.size.base, fontWeight: '600', flex: 1 },
  sleepRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  sleepBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  sleepBtnActive: { backgroundColor: Colors.primaryPale, borderColor: Colors.primary },
  sleepBtnText: { color: Colors.textSecondary, fontSize: 13, fontWeight: '600' },
  sleepBtnTextActive: { color: Colors.primary },
  answerLabel: { color: Colors.textSecondary, fontSize: Typography.size.sm, marginTop: 6 },
  optionRow: { flexDirection: 'row', gap: Spacing.sm },
  optBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  optBtnActive: { backgroundColor: Colors.primaryPale, borderColor: Colors.primary },
  optText: { color: Colors.textSecondary, fontWeight: '600', fontSize: Typography.size.sm },
  optTextActive: { color: Colors.primary },
  bondRow: { flexDirection: 'row', gap: Spacing.sm, justifyContent: 'space-around' },
  bondBtn: {
    padding: 10,
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  bondBtnActive: { backgroundColor: Colors.primaryPale, borderColor: Colors.primary },
  bondEmoji: { fontSize: 30 },
  savedBadge: {
    backgroundColor: Colors.primaryPale,
    borderRadius: Radius.full,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.primaryLight,
  },
  savedText: { color: Colors.primary, fontWeight: '700', fontSize: Typography.size.base },
});
