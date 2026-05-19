import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, Typography, Radius, Shadow } from '../../theme';
import Card from '../../components/common/Card';
import SOSButton from '../../components/common/SOSButton';
import { useApp } from '../../context/AppContext';
import { AI_RESPONSES } from '../../data/content';

const { width } = Dimensions.get('window');

function getAIResponse(text: string, lang: 'rw' | 'en'): string {
  const lower = text.toLowerCase();
  const strugglingWords = ['bigoye', 'nkiheba', 'nkibuza', 'scared', 'afraid', 'struggling', 'hard', 'tired', 'cry', 'hopeless'];
  const goodWords = ['neza', 'nishimye', 'good', 'happy', 'great', 'better', 'improved'];

  let bucket: 'struggling' | 'okay' | 'good' = 'okay';
  if (strugglingWords.some(w => lower.includes(w))) bucket = 'struggling';
  else if (goodWords.some(w => lower.includes(w))) bucket = 'good';

  const responses = AI_RESPONSES[bucket][lang];
  return responses[Math.floor(Math.random() * responses.length)];
}

interface Props {
  navigation: any;
}

export default function JournalScreen({ navigation }: Props) {
  const { language, todayEntry, entries, saveEntry, t } = useApp();
  const [text, setText] = useState(todayEntry?.journalText ?? '');
  const [aiResponse, setAiResponse] = useState(todayEntry?.aiResponse ?? '');
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const handleSend = () => {
    if (!text.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const response = getAIResponse(text, language);
      setAiResponse(response);
      saveEntry({ journalText: text.trim(), aiResponse: response });
      setLoading(false);
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 1800);
  };

  const pastEntries = entries
    .filter(e => e.journalText && e.date !== new Date().toISOString().split('T')[0])
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 10);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString(language === 'rw' ? 'fr-RW' : 'en-GB', {
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('myJournal')}</Text>
          <TouchableOpacity
            onPress={() => setShowHistory(!showHistory)}
            style={styles.historyBtn}
          >
            <Text style={styles.historyBtnText}>
              {language === 'rw' ? 'Kabaye' : 'History'}
            </Text>
          </TouchableOpacity>
        </View>

        {showHistory ? (
          <ScrollView style={styles.historyList} showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionLabel}>
              {language === 'rw' ? 'Ibitabo bya vuba' : 'Recent entries'}
            </Text>
            {pastEntries.length === 0 && (
              <Text style={styles.emptyText}>
                {language === 'rw' ? 'Nta makuru yabonetse.' : 'No past entries yet.'}
              </Text>
            )}
            {pastEntries.map(entry => (
              <Card key={entry.date} style={styles.historyCard} padding={Spacing.md}>
                <Text style={styles.historyDate}>{formatDate(entry.date)}</Text>
                <Text style={styles.historyText} numberOfLines={3}>{entry.journalText}</Text>
                {entry.aiResponse ? (
                  <View style={styles.historyAI}>
                    <Text style={styles.historyAIText}>💛 {entry.aiResponse}</Text>
                  </View>
                ) : null}
              </Card>
            ))}
            <View style={{ height: Spacing.xxl }} />
          </ScrollView>
        ) : (
          <ScrollView
            ref={scrollRef}
            style={{ flex: 1 }}
            contentContainerStyle={styles.body}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Prompt */}
            <LinearGradient
              colors={[Colors.primaryPale, Colors.white]}
              style={styles.promptBanner}
            >
              <Text style={styles.promptEmoji}>✍️</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.promptTitle}>
                  {language === 'rw' ? 'Andika ibyiyumvo byawe' : 'Write how you feel'}
                </Text>
                <Text style={styles.promptSub}>
                  {language === 'rw'
                    ? 'Nta mategeko. Andika uko bishaka.'
                    : 'No rules. No judgment. Just you.'}
                </Text>
              </View>
            </LinearGradient>

            {/* Text input */}
            <Card style={styles.inputCard} padding={0}>
              <TextInput
                style={styles.input}
                placeholder={t('writeJournal')}
                placeholderTextColor={Colors.textMuted}
                multiline
                textAlignVertical="top"
                value={text}
                onChangeText={setText}
                maxLength={2000}
              />
              <View style={styles.inputFooter}>
                <Text style={styles.charCount}>{text.length}/2000</Text>
                <TouchableOpacity
                  style={[styles.sendBtn, !text.trim() && { opacity: 0.4 }]}
                  onPress={handleSend}
                  disabled={!text.trim() || loading}
                >
                  <LinearGradient
                    colors={[Colors.primaryLight, Colors.primary]}
                    style={styles.sendGrad}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    {loading ? (
                      <ActivityIndicator color={Colors.white} size="small" />
                    ) : (
                      <Text style={styles.sendText}>{t('send')} →</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </Card>

            {/* AI Response */}
            {loading && (
              <Card variant="tinted" style={styles.aiCard} padding={Spacing.md}>
                <View style={styles.aiTyping}>
                  <Text style={styles.aiTypingDot}>●</Text>
                  <Text style={styles.aiTypingDot}>●</Text>
                  <Text style={styles.aiTypingDot}>●</Text>
                </View>
                <Text style={styles.aiTypingLabel}>
                  {language === 'rw' ? 'Inkuru yawe irimo gusobanurwa...' : 'Reading your entry...'}
                </Text>
              </Card>
            )}

            {!loading && aiResponse ? (
              <Card variant="tinted" style={styles.aiCard} padding={Spacing.md}>
                <View style={styles.aiHeader}>
                  <View style={styles.aiBadge}>
                    <Text style={styles.aiBadgeText}>💛</Text>
                  </View>
                  <Text style={styles.aiFrom}>
                    {language === 'rw' ? 'Inkuru y\'ineza' : 'A message for you'}
                  </Text>
                </View>
                <Text style={styles.aiText}>{aiResponse}</Text>

                <View style={styles.tipsRow}>
                  {[
                    { icon: '🌬️', labelRw: 'Guhuma', labelEn: 'Breathe' },
                    { icon: '🚶', labelRw: 'Genda gato', labelEn: 'Walk' },
                    { icon: '💧', labelRw: 'Unywe amazi', labelEn: 'Hydrate' },
                  ].map((tip, i) => (
                    <View key={i} style={styles.tip}>
                      <Text style={styles.tipIcon}>{tip.icon}</Text>
                      <Text style={styles.tipLabel}>
                        {language === 'rw' ? tip.labelRw : tip.labelEn}
                      </Text>
                    </View>
                  ))}
                </View>
              </Card>
            ) : null}

            <View style={{ marginTop: Spacing.md }}>
              <SOSButton />
            </View>
            <View style={{ height: Spacing.xxl }} />
          </ScrollView>
        )}
      </KeyboardAvoidingView>
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
  historyBtn: { padding: 8 },
  historyBtnText: { color: Colors.primary, fontWeight: '600', fontSize: Typography.size.sm },
  body: { padding: Spacing.md, gap: Spacing.md, paddingBottom: Spacing.xxl },
  promptBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radius.lg,
  },
  promptEmoji: { fontSize: 28 },
  promptTitle: { fontWeight: '700', fontSize: Typography.size.base, color: Colors.textPrimary },
  promptSub: { color: Colors.textSecondary, fontSize: Typography.size.sm, marginTop: 2 },
  inputCard: { ...Shadow.soft },
  input: {
    minHeight: 160,
    padding: Spacing.md,
    fontSize: Typography.size.base,
    color: Colors.textPrimary,
    lineHeight: 24,
  },
  inputFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  charCount: { color: Colors.textMuted, fontSize: Typography.size.xs },
  sendBtn: { borderRadius: Radius.full, overflow: 'hidden' },
  sendGrad: {
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: Radius.full,
    minWidth: 100,
    alignItems: 'center',
  },
  sendText: { color: Colors.white, fontWeight: '700', fontSize: 14 },
  aiCard: { borderRadius: Radius.lg },
  aiTyping: { flexDirection: 'row', gap: 6, marginBottom: 6 },
  aiTypingDot: { color: Colors.primaryLight, fontSize: 18 },
  aiTypingLabel: { color: Colors.textSecondary, fontSize: Typography.size.sm },
  aiHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  aiBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.soft,
  },
  aiBadgeText: { fontSize: 18 },
  aiFrom: { color: Colors.textSecondary, fontWeight: '600', fontSize: Typography.size.sm },
  aiText: {
    color: Colors.textPrimary,
    fontSize: Typography.size.base,
    lineHeight: 24,
    marginBottom: Spacing.md,
  },
  tipsRow: { flexDirection: 'row', gap: Spacing.sm },
  tip: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.sm,
    alignItems: 'center',
    gap: 4,
  },
  tipIcon: { fontSize: 22 },
  tipLabel: { color: Colors.textSecondary, fontSize: 11, fontWeight: '500', textAlign: 'center' },
  historyList: { flex: 1, padding: Spacing.md },
  sectionLabel: {
    color: Colors.textMuted,
    fontSize: Typography.size.xs,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.md,
  },
  historyCard: { marginBottom: Spacing.sm, ...Shadow.soft },
  historyDate: {
    color: Colors.textMuted,
    fontSize: Typography.size.xs,
    fontWeight: '600',
    marginBottom: 4,
  },
  historyText: {
    color: Colors.textPrimary,
    fontSize: Typography.size.base,
    lineHeight: 22,
  },
  historyAI: {
    marginTop: Spacing.sm,
    backgroundColor: Colors.primaryPale,
    borderRadius: Radius.md,
    padding: Spacing.sm,
  },
  historyAIText: { color: Colors.primary, fontSize: Typography.size.sm, lineHeight: 20 },
  emptyText: { color: Colors.textMuted, textAlign: 'center', marginTop: Spacing.xl },
});
