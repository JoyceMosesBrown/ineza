import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, Typography, Radius, Shadow } from '../../theme';
import Card from '../../components/common/Card';
import SOSButton from '../../components/common/SOSButton';
import { useApp } from '../../context/AppContext';

interface Props { navigation: any }

const CHW_DATA = {
  name: 'Chantal Uwamahoro',
  role: { rw: 'Umujyanama w\'ubuzima', en: 'Community Health Worker' },
  district: 'Gasabo',
  phone: '+250788000000',
  avatar: '👩‍⚕️',
  nextVisit: '2026-05-22',
};

const VISIT_MESSAGES_RW = [
  { from: 'CHW', text: 'Amakuru, Mama! Uzagiye neza uyu munsi?', time: '9:00' },
  { from: 'me', text: 'Neza gato. Nashakaga kukubwira.', time: '9:05' },
  { from: 'CHW', text: 'Ndikuriho. Tuvugane.', time: '9:06' },
];

const VISIT_MESSAGES_EN = [
  { from: 'CHW', text: 'Hello Mama! How are you doing today?', time: '9:00' },
  { from: 'me', text: 'A little better. I wanted to tell you something.', time: '9:05' },
  { from: 'CHW', text: "I'm here. Let's talk.", time: '9:06' },
];

export default function CHWScreen({ navigation }: Props) {
  const { language, district } = useApp();
  const [activeTab, setActiveTab] = useState<'profile' | 'message'>('profile');

  const callCHW = () => {
    Alert.alert(
      language === 'rw' ? 'Hamagara CHW' : 'Call CHW',
      `${CHW_DATA.name}\n${CHW_DATA.phone}`,
      [
        {
          text: language === 'rw' ? 'Hamagara' : 'Call',
          onPress: () => Linking.openURL(`tel:${CHW_DATA.phone}`),
        },
        { text: language === 'rw' ? 'Reka' : 'Cancel', style: 'cancel' },
      ]
    );
  };

  const requestVisit = () => {
    Alert.alert(
      language === 'rw' ? 'Gusaba kubarizwa' : 'Request home visit',
      language === 'rw'
        ? 'Ubusabe bw\'inzu bwoherejwe kuri umujyanama. Azavugana nawe vuba.'
        : 'Your home visit request has been sent to your CHW. They will contact you soon.',
      [{ text: 'OK' }]
    );
  };

  const messages = language === 'rw' ? VISIT_MESSAGES_RW : VISIT_MESSAGES_EN;

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString(language === 'rw' ? 'fr-RW' : 'en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {language === 'rw' ? 'Umujyanama wanjye' : 'My CHW'}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        {/* CHW Profile */}
        <LinearGradient
          colors={[Colors.primary, Colors.primaryLight]}
          style={styles.profileCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.avatarWrap}>
            <Text style={styles.avatar}>{CHW_DATA.avatar}</Text>
          </View>
          <Text style={styles.chwName}>{CHW_DATA.name}</Text>
          <Text style={styles.chwRole}>
            {CHW_DATA.role[language]} · {district || CHW_DATA.district}
          </Text>
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionBtn} onPress={callCHW}>
              <Text style={styles.actionBtnIcon}>📞</Text>
              <Text style={styles.actionBtnText}>
                {language === 'rw' ? 'Hamagara' : 'Call'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={() => setActiveTab('message')}>
              <Text style={styles.actionBtnIcon}>💬</Text>
              <Text style={styles.actionBtnText}>
                {language === 'rw' ? 'Ubutumwa' : 'Message'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={requestVisit}>
              <Text style={styles.actionBtnIcon}>🏠</Text>
              <Text style={styles.actionBtnText}>
                {language === 'rw' ? 'Saba inzu' : 'Visit'}
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Next visit */}
        <Card variant="tinted" padding={Spacing.md}>
          <View style={styles.nextVisitRow}>
            <Text style={styles.nextVisitIcon}>📅</Text>
            <View>
              <Text style={styles.nextVisitLabel}>
                {language === 'rw' ? 'Inshuro ikurikira' : 'Next scheduled visit'}
              </Text>
              <Text style={styles.nextVisitDate}>{formatDate(CHW_DATA.nextVisit)}</Text>
            </View>
          </View>
        </Card>

        {/* Tab toggle */}
        <View style={styles.tabRow}>
          {(['profile', 'message'] as const).map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab === 'profile'
                  ? language === 'rw' ? 'Amakuru' : 'About'
                  : language === 'rw' ? 'Ibiganiro' : 'Messages'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === 'profile' ? (
          <>
            <Card padding={Spacing.md}>
              <Text style={styles.sectionLabel}>
                {language === 'rw' ? 'Umwirondoro' : 'Profile'}
              </Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoIcon}>📍</Text>
                <Text style={styles.infoText}>{district || CHW_DATA.district}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoIcon}>📞</Text>
                <Text style={styles.infoText}>{CHW_DATA.phone}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoIcon}>⭐</Text>
                <Text style={styles.infoText}>
                  {language === 'rw' ? 'Imyaka 5 y\'uburambe' : '5 years experience'}
                </Text>
              </View>
            </Card>

            <Card variant="tinted" padding={Spacing.md}>
              <Text style={styles.sectionLabel}>
                {language === 'rw' ? 'Aho ungana nawe' : 'How your CHW helps you'}
              </Text>
              {[
                language === 'rw' ? 'Agatumira inzu buri kwezi' : 'Monthly home visits',
                language === 'rw' ? 'Akora raporo ku buzima bwawe' : 'Tracks your health trends',
                language === 'rw' ? 'Agufasha kubona inkunga' : 'Connects you to health services',
                language === 'rw' ? 'Atumanahana nawe igihe cyose' : 'Always available to message',
              ].map((item, i) => (
                <View key={i} style={styles.bulletRow}>
                  <View style={styles.bullet} />
                  <Text style={styles.bulletText}>{item}</Text>
                </View>
              ))}
            </Card>
          </>
        ) : (
          <Card padding={Spacing.md}>
            <Text style={styles.sectionLabel}>
              {language === 'rw' ? 'Ibiganiro bya vuba' : 'Recent messages'}
            </Text>
            {messages.map((msg, i) => (
              <View
                key={i}
                style={[styles.msgRow, msg.from === 'me' && styles.msgRowMe]}
              >
                <View style={[styles.msgBubble, msg.from === 'me' && styles.msgBubbleMe]}>
                  <Text style={[styles.msgText, msg.from === 'me' && styles.msgTextMe]}>
                    {msg.text}
                  </Text>
                  <Text style={styles.msgTime}>{msg.time}</Text>
                </View>
              </View>
            ))}
          </Card>
        )}

        <View style={{ marginTop: Spacing.md }}>
          <SOSButton />
        </View>
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
  profileCard: {
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    alignItems: 'center',
    ...Shadow.medium,
  },
  avatarWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  avatar: { fontSize: 44 },
  chwName: { color: Colors.white, fontWeight: '700', fontSize: Typography.size.lg },
  chwRole: { color: 'rgba(255,255,255,0.8)', fontSize: Typography.size.sm, marginTop: 2, marginBottom: Spacing.lg },
  actionsRow: { flexDirection: 'row', gap: Spacing.md },
  actionBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: Radius.lg,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    gap: 4,
    minWidth: 70,
  },
  actionBtnIcon: { fontSize: 20 },
  actionBtnText: { color: Colors.white, fontWeight: '600', fontSize: 12 },
  nextVisitRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  nextVisitIcon: { fontSize: 28 },
  nextVisitLabel: { color: Colors.textSecondary, fontSize: Typography.size.sm },
  nextVisitDate: { color: Colors.textPrimary, fontWeight: '700', fontSize: Typography.size.base, marginTop: 2 },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.full,
    padding: 4,
  },
  tab: { flex: 1, paddingVertical: 8, borderRadius: Radius.full, alignItems: 'center' },
  tabActive: { backgroundColor: Colors.white, ...Shadow.soft },
  tabText: { color: Colors.textSecondary, fontWeight: '600', fontSize: 13 },
  tabTextActive: { color: Colors.primary },
  sectionLabel: {
    color: Colors.textMuted,
    fontSize: Typography.size.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.md,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  infoIcon: { fontSize: 18, width: 28 },
  infoText: { color: Colors.textPrimary, fontSize: Typography.size.base },
  bulletRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  bullet: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.primaryLight },
  bulletText: { color: Colors.textPrimary, fontSize: Typography.size.base, flex: 1 },
  msgRow: { alignItems: 'flex-start', marginBottom: Spacing.sm },
  msgRowMe: { alignItems: 'flex-end' },
  msgBubble: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.lg,
    borderBottomLeftRadius: 4,
    padding: Spacing.sm,
    maxWidth: '80%',
  },
  msgBubbleMe: {
    backgroundColor: Colors.primaryPale,
    borderBottomLeftRadius: Radius.lg,
    borderBottomRightRadius: 4,
  },
  msgText: { color: Colors.textPrimary, fontSize: Typography.size.base },
  msgTextMe: { color: Colors.primary },
  msgTime: { color: Colors.textMuted, fontSize: 10, marginTop: 4, alignSelf: 'flex-end' },
});
