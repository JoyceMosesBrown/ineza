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
import { useApp, DayEntry } from '../../context/AppContext';

const { width } = Dimensions.get('window');
const BAR_MAX_H = 80;

interface Props { navigation: any }

const MOOD_COLORS = ['', Colors.moodBad, Colors.moodLow, Colors.moodOkay, Colors.moodGood, Colors.moodGreat];
const MOOD_LABELS_RW = ['', 'Bigoye', 'Gato bigoye', 'Meza neza', 'Neza', 'Neza cyane'];
const MOOD_LABELS_EN = ['', 'Struggling', 'Low', 'Okay', 'Good', 'Great'];

export default function ProgressScreen({ navigation }: Props) {
  const { language, entries, streak, nickname } = useApp();
  const [range, setRange] = useState<7 | 30>(7);

  const today = new Date();
  const days = Array.from({ length: range }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (range - 1 - i));
    return d.toISOString().split('T')[0];
  });

  const getEntry = (date: string): DayEntry | undefined =>
    entries.find(e => e.date === date);

  const avgMood = (() => {
    const moods = days.map(d => getEntry(d)?.mood).filter(Boolean) as number[];
    if (!moods.length) return 0;
    return moods.reduce((a, b) => a + b, 0) / moods.length;
  })();

  const avgSleep = (() => {
    const sleeps = days.map(d => getEntry(d)?.sleep).filter(s => s !== undefined && s! > 0) as number[];
    if (!sleeps.length) return 0;
    return sleeps.reduce((a, b) => a + b, 0) / sleeps.length;
  })();

  const journalCount = days.filter(d => getEntry(d)?.journalText).length;

  const dayLabel = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString(language === 'rw' ? 'fr-RW' : 'en-GB', { weekday: 'short' }).slice(0, 2);
  };

  const streakMessage = () => {
    if (streak >= 7) return language === 'rw' ? `Wakoze iminsi ${streak} yinjiye — intwari!` : `${streak} days in a row — that takes real strength!`;
    if (streak >= 3) return language === 'rw' ? `Iminsi ${streak} yinjiye. Komeza!` : `${streak} days in. Keep going!`;
    return language === 'rw' ? 'Tangira uyu munsi. Buri munsi ni intsinzi.' : 'Start today. Every day counts.';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {language === 'rw' ? 'Iterambere ryanjye' : 'My Progress'}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        {/* Streak card */}
        <LinearGradient
          colors={[Colors.primary, Colors.primaryLight]}
          style={styles.streakCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.streakRow}>
            <Text style={styles.streakEmoji}>🔥</Text>
            <View>
              <Text style={styles.streakNum}>{streak}</Text>
              <Text style={styles.streakLabel}>
                {language === 'rw' ? 'iminsi yinjiye' : 'day streak'}
              </Text>
            </View>
          </View>
          <Text style={styles.streakMessage}>{streakMessage()}</Text>
        </LinearGradient>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <Card style={styles.statCard} variant="tinted" padding={Spacing.md}>
            <Text style={styles.statIcon}>😊</Text>
            <Text style={styles.statValue}>
              {avgMood > 0 ? avgMood.toFixed(1) : '—'}
            </Text>
            <Text style={styles.statLabel}>
              {language === 'rw' ? 'Ubusanzwe' : 'Avg mood'}
            </Text>
          </Card>
          <Card style={styles.statCard} variant="tinted" padding={Spacing.md}>
            <Text style={styles.statIcon}>😴</Text>
            <Text style={styles.statValue}>
              {avgSleep > 0 ? avgSleep.toFixed(1) + 'h' : '—'}
            </Text>
            <Text style={styles.statLabel}>
              {language === 'rw' ? 'Ibitotsi' : 'Avg sleep'}
            </Text>
          </Card>
          <Card style={styles.statCard} variant="tinted" padding={Spacing.md}>
            <Text style={styles.statIcon}>📖</Text>
            <Text style={styles.statValue}>{journalCount}</Text>
            <Text style={styles.statLabel}>
              {language === 'rw' ? 'Ibitabo' : 'Journals'}
            </Text>
          </Card>
        </View>

        {/* Range Toggle */}
        <View style={styles.rangeToggle}>
          {([7, 30] as const).map(r => (
            <TouchableOpacity
              key={r}
              style={[styles.rangeBtn, range === r && styles.rangeBtnActive]}
              onPress={() => setRange(r)}
            >
              <Text style={[styles.rangeBtnText, range === r && styles.rangeBtnTextActive]}>
                {r === 7
                  ? language === 'rw' ? 'Icyumweru' : '7 days'
                  : language === 'rw' ? 'Ukwezi' : '30 days'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Mood chart */}
        <Card padding={Spacing.md} style={styles.chartCard}>
          <Text style={styles.chartTitle}>
            {language === 'rw' ? 'Imigenzo y\'ibihe' : 'Mood over time'}
          </Text>
          <View style={styles.chart}>
            {days.map(d => {
              const entry = getEntry(d);
              const mood = entry?.mood ?? 0;
              const barH = mood > 0 ? (mood / 5) * BAR_MAX_H : 4;
              const color = mood > 0 ? MOOD_COLORS[mood] : Colors.border;
              return (
                <View key={d} style={styles.barCol}>
                  <View style={{ height: BAR_MAX_H, justifyContent: 'flex-end' }}>
                    <View style={[styles.bar, { height: barH, backgroundColor: color }]} />
                  </View>
                  <Text style={styles.barLabel}>{dayLabel(d)}</Text>
                </View>
              );
            })}
          </View>
          <View style={styles.legend}>
            {[1, 3, 5].map(l => (
              <View key={l} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: MOOD_COLORS[l] }]} />
                <Text style={styles.legendText}>
                  {language === 'rw' ? MOOD_LABELS_RW[l] : MOOD_LABELS_EN[l]}
                </Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Sleep chart */}
        <Card padding={Spacing.md} style={styles.chartCard}>
          <Text style={styles.chartTitle}>
            {language === 'rw' ? 'Ibitotsi by\'ibihe' : 'Sleep over time'}
          </Text>
          <View style={styles.chart}>
            {days.map(d => {
              const entry = getEntry(d);
              const sleep = entry?.sleep ?? 0;
              const barH = sleep > 0 ? (sleep / 10) * BAR_MAX_H : 4;
              const color = sleep >= 6 ? Colors.moodGreat : sleep >= 4 ? Colors.moodOkay : sleep > 0 ? Colors.moodLow : Colors.border;
              return (
                <View key={d} style={styles.barCol}>
                  <View style={{ height: BAR_MAX_H, justifyContent: 'flex-end' }}>
                    <View style={[styles.bar, { height: barH, backgroundColor: color }]} />
                  </View>
                  <Text style={styles.barLabel}>{dayLabel(d)}</Text>
                </View>
              );
            })}
          </View>
        </Card>

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

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
  body: { padding: Spacing.md, gap: Spacing.md },
  streakCard: {
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    ...Shadow.medium,
  },
  streakRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.sm },
  streakEmoji: { fontSize: 44 },
  streakNum: { color: Colors.white, fontSize: Typography.size.hero, fontWeight: '800' },
  streakLabel: { color: 'rgba(255,255,255,0.75)', fontSize: Typography.size.base },
  streakMessage: { color: 'rgba(255,255,255,0.9)', fontSize: Typography.size.base, lineHeight: 22 },
  statsRow: { flexDirection: 'row', gap: Spacing.sm },
  statCard: { flex: 1, alignItems: 'center', ...Shadow.soft },
  statIcon: { fontSize: 24, marginBottom: 4 },
  statValue: { fontWeight: '800', fontSize: Typography.size.xl, color: Colors.textPrimary },
  statLabel: { color: Colors.textSecondary, fontSize: Typography.size.xs, textAlign: 'center' },
  rangeToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.full,
    padding: 4,
  },
  rangeBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: Radius.full,
    alignItems: 'center',
  },
  rangeBtnActive: { backgroundColor: Colors.white, ...Shadow.soft },
  rangeBtnText: { color: Colors.textSecondary, fontWeight: '600', fontSize: 13 },
  rangeBtnTextActive: { color: Colors.primary },
  chartCard: { ...Shadow.soft },
  chartTitle: {
    fontWeight: '700',
    fontSize: Typography.size.base,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
    justifyContent: 'space-between',
  },
  barCol: { flex: 1, alignItems: 'center', gap: 4 },
  bar: { width: '100%', borderRadius: 4, minWidth: 8 },
  barLabel: { fontSize: 10, color: Colors.textMuted, fontWeight: '500' },
  legend: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.md, flexWrap: 'wrap' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { color: Colors.textSecondary, fontSize: 11 },
});
