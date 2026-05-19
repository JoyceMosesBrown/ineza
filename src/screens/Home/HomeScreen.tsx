import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, Typography, Radius, Shadow } from '../../theme';
import Card from '../../components/common/Card';
import SOSButton from '../../components/common/SOSButton';
import InezaLogo from '../../components/logo/InezaLogo';
import { useApp, MoodLevel } from '../../context/AppContext';
import { DAILY_QUOTES_RW, DAILY_QUOTES_EN } from '../../data/content';

const { width } = Dimensions.get('window');

const MOODS: { level: MoodLevel; emojiRw: string; emojiEn: string; icon: string; color: string }[] = [
  { level: 5, emojiRw: 'Neza cyane', emojiEn: 'Great', icon: '😄', color: Colors.moodGreat },
  { level: 4, emojiRw: 'Neza', emojiEn: 'Good', icon: '🙂', color: Colors.moodGood },
  { level: 3, emojiRw: 'Meza neza', emojiEn: 'Okay', icon: '😐', color: Colors.moodOkay },
  { level: 2, emojiRw: 'Bigoye gato', emojiEn: 'Low', icon: '😔', color: Colors.moodLow },
  { level: 1, emojiRw: 'Bigoye', emojiEn: 'Struggling', icon: '😢', color: Colors.moodBad },
];

const QUICK_ACTIONS = [
  { icon: '📖', labelRw: 'Ibitabo', labelEn: 'Journal', route: 'Journal', bg: '#D8F3DC' },
  { icon: '📊', labelRw: 'Gukurikirana', labelEn: 'Tracker', route: 'Tracker', bg: '#FFDDD2' },
  { icon: '📈', labelRw: 'Iterambere', labelEn: 'Progress', route: 'Progress', bg: '#FFF3CD' },
  { icon: '🤝', labelRw: 'Inzira', labelEn: 'Circle', route: 'Peers', bg: '#EEF4F1' },
];

function getGreeting(lang: string): string {
  const h = new Date().getHours();
  if (lang === 'rw') {
    if (h < 12) return 'Mwaramutse';
    if (h < 17) return 'Mwiriwe';
    return 'Bwiriwe';
  }
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function getDayQuote(lang: string): string {
  const idx = new Date().getDay();
  return lang === 'rw' ? DAILY_QUOTES_RW[idx] : DAILY_QUOTES_EN[idx];
}

interface Props {
  navigation: any;
}

export default function HomeScreen({ navigation }: Props) {
  const { language, nickname, streak, todayEntry, saveEntry, t } = useApp();
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [selectedMood, setSelectedMood] = useState<MoodLevel | null>(todayEntry?.mood ?? null);

  const greeting = getGreeting(language);
  const quote = getDayQuote(language);

  const handleMoodSelect = (level: MoodLevel) => {
    setSelectedMood(level);
    saveEntry({ mood: level });
    setTimeout(() => setShowMoodModal(false), 600);
  };

  const checkedIn = !!todayEntry?.mood;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Spacing.xxl + 60 }}
      >
        {/* Header */}
        <LinearGradient
          colors={[Colors.primary, Colors.primaryLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>{greeting},</Text>
              <Text style={styles.name}>{nickname} 👋</Text>
            </View>
            <InezaLogo size={36} variant="icon" light />
          </View>

          {/* Streak */}
          <View style={styles.streakBadge}>
            <Text style={styles.streakIcon}>🔥</Text>
            <Text style={styles.streakText}>
              {streak} {language === 'rw' ? 'iminsi yinjiye' : 'day streak'}
            </Text>
          </View>
        </LinearGradient>

        <View style={styles.body}>
          {/* Daily Check-In Card */}
          <Card style={styles.checkInCard} padding={Spacing.lg}>
            {checkedIn ? (
              <View style={styles.checkedInRow}>
                <Text style={styles.checkedInEmoji}>
                  {MOODS.find(m => m.level === selectedMood)?.icon ?? '✅'}
                </Text>
                <View>
                  <Text style={styles.checkedInTitle}>
                    {language === 'rw' ? 'Winjiye uyu munsi' : "Today's check-in done"}
                  </Text>
                  <Text style={styles.checkedInSub}>
                    {MOODS.find(m => m.level === selectedMood)?.[language === 'rw' ? 'emojiRw' : 'emojiEn']}
                  </Text>
                </View>
              </View>
            ) : (
              <>
                <Text style={styles.checkInTitle}>{t('howAreYou')}</Text>
                <TouchableOpacity
                  style={styles.checkInBtn}
                  onPress={() => setShowMoodModal(true)}
                >
                  <LinearGradient
                    colors={[Colors.primaryLight, Colors.primary]}
                    style={styles.checkInGradBtn}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.checkInBtnText}>{t('checkIn')}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </>
            )}
          </Card>

          {/* Daily Quote */}
          <Card variant="tinted" style={styles.quoteCard} padding={Spacing.md}>
            <Text style={styles.quoteLabel}>{t('dailyQuote')}</Text>
            <Text style={styles.quoteText}>"{quote}"</Text>
          </Card>

          {/* Quick Actions */}
          <Text style={styles.sectionTitle}>
            {language === 'rw' ? 'Igikoresho cyawe' : 'Your tools'}
          </Text>
          <View style={styles.grid}>
            {QUICK_ACTIONS.map((action) => (
              <TouchableOpacity
                key={action.route}
                style={[styles.actionCard, { backgroundColor: action.bg }]}
                onPress={() => navigation.navigate(action.route)}
                activeOpacity={0.8}
              >
                <Text style={styles.actionIcon}>{action.icon}</Text>
                <Text style={styles.actionLabel}>
                  {language === 'rw' ? action.labelRw : action.labelEn}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* CHW Banner */}
          <TouchableOpacity
            onPress={() => navigation.navigate('CHW')}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={[Colors.accent, '#E76F51']}
              style={styles.chwBanner}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View>
                <Text style={styles.chwBannerTitle}>
                  {language === 'rw' ? 'Umujyanama wawe' : 'Your CHW'}
                </Text>
                <Text style={styles.chwBannerSub}>
                  {language === 'rw' ? 'Uhabwa, yawe, hafi nawe' : 'Here for you, always'}
                </Text>
              </View>
              <Text style={styles.chwBannerIcon}>👩‍⚕️</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* SOS */}
          <View style={{ marginTop: Spacing.lg }}>
            <SOSButton />
          </View>
        </View>
      </ScrollView>

      {/* Mood Modal */}
      <Modal visible={showMoodModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>{t('howAreYou')}</Text>
            <Text style={styles.modalSub}>
              {language === 'rw' ? 'Kanda ku ikintu kimwe' : 'Tap to select'}
            </Text>
            <View style={styles.moodGrid}>
              {MOODS.map(mood => (
                <TouchableOpacity
                  key={mood.level}
                  style={[
                    styles.moodItem,
                    selectedMood === mood.level && { backgroundColor: mood.color + '30', borderColor: mood.color, borderWidth: 2 },
                  ]}
                  onPress={() => handleMoodSelect(mood.level)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.moodEmoji}>{mood.icon}</Text>
                  <Text style={styles.moodLabel}>
                    {language === 'rw' ? mood.emojiRw : mood.emojiEn}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  greeting: { color: 'rgba(255,255,255,0.75)', fontSize: Typography.size.base },
  name: { color: Colors.white, fontSize: Typography.size.xl, fontWeight: '700' },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'flex-start',
    borderRadius: Radius.full,
    paddingVertical: 6,
    paddingHorizontal: 14,
    gap: 6,
  },
  streakIcon: { fontSize: 16 },
  streakText: { color: Colors.white, fontWeight: '600', fontSize: 13 },
  body: { padding: Spacing.lg, gap: Spacing.md },
  checkInCard: { ...Shadow.soft },
  checkInTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.size.md,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  checkInBtn: { borderRadius: Radius.full, overflow: 'hidden' },
  checkInGradBtn: {
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: Radius.full,
  },
  checkInBtnText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: Typography.size.base,
    letterSpacing: 0.3,
  },
  checkedInRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  checkedInEmoji: { fontSize: 40 },
  checkedInTitle: { fontWeight: '700', fontSize: Typography.size.md, color: Colors.textPrimary },
  checkedInSub: { color: Colors.textSecondary, fontSize: Typography.size.base, marginTop: 2 },
  quoteCard: {},
  quoteLabel: {
    color: Colors.textSecondary,
    fontSize: Typography.size.xs,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  quoteText: {
    color: Colors.textPrimary,
    fontSize: Typography.size.base,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.size.md,
    fontWeight: '700',
    marginTop: Spacing.xs,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  actionCard: {
    width: (width - Spacing.lg * 2 - Spacing.sm) / 2,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: 'flex-start',
    gap: 8,
    ...Shadow.soft,
  },
  actionIcon: { fontSize: 28 },
  actionLabel: {
    color: Colors.textPrimary,
    fontWeight: '600',
    fontSize: Typography.size.base,
  },
  chwBanner: {
    borderRadius: Radius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...Shadow.soft,
  },
  chwBannerTitle: { color: Colors.white, fontWeight: '700', fontSize: Typography.size.md },
  chwBannerSub: { color: 'rgba(255,255,255,0.8)', fontSize: Typography.size.sm, marginTop: 2 },
  chwBannerIcon: { fontSize: 36 },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: Radius.full,
    alignSelf: 'center',
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    fontSize: Typography.size.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  modalSub: {
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: Spacing.lg,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    justifyContent: 'center',
  },
  moodItem: {
    alignItems: 'center',
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    width: (width - Spacing.lg * 2 - Spacing.sm * 4) / 5,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  moodEmoji: { fontSize: 28 },
  moodLabel: {
    color: Colors.textSecondary,
    fontSize: 10,
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '500',
  },
});
