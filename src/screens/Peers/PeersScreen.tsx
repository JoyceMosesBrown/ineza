import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, Typography, Radius, Shadow } from '../../theme';
import Card from '../../components/common/Card';
import { useApp } from '../../context/AppContext';
import { PEER_MESSAGES } from '../../data/content';

interface Props { navigation: any }

interface Message {
  id: string;
  author: string;
  time: string;
  text: string;
  reactions: { heart: number; pray: number };
  mine?: boolean;
}

export default function PeersScreen({ navigation }: Props) {
  const { language, nickname } = useApp();
  const [messages, setMessages] = useState<Message[]>(PEER_MESSAGES);
  const [draft, setDraft] = useState('');
  const [reacted, setReacted] = useState<Record<string, boolean>>({});

  const sendMessage = () => {
    if (!draft.trim()) return;
    const newMsg: Message = {
      id: Date.now().toString(),
      author: `Mama ${nickname}`,
      time: language === 'rw' ? 'Nonaha' : 'Just now',
      text: draft.trim(),
      reactions: { heart: 0, pray: 0 },
      mine: true,
    };
    setMessages(prev => [newMsg, ...prev]);
    setDraft('');
  };

  const react = (id: string, type: 'heart' | 'pray') => {
    const key = `${id}_${type}`;
    if (reacted[key]) return;
    setReacted(prev => ({ ...prev, [key]: true }));
    setMessages(prev =>
      prev.map(m =>
        m.id === id
          ? { ...m, reactions: { ...m.reactions, [type]: m.reactions[type] + 1 } }
          : m
      )
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>
            {language === 'rw' ? 'Inzira Yacu' : 'Our Circle'}
          </Text>
          <View style={styles.onlineBadge}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>
              {language === 'rw' ? '6 banyina' : '6 mamas'}
            </Text>
          </View>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Circle info banner */}
      <LinearGradient
        colors={[Colors.primaryPale, Colors.white]}
        style={styles.infoBanner}
      >
        <Text style={styles.infoIcon}>🤝</Text>
        <Text style={styles.infoText}>
          {language === 'rw'
            ? 'Aha nta mazina nyayo — wiyandikisha nka "Mama" gusa. Aho ni ahantu hatazo n\'amakuba.'
            : "Anonymous circle — no real names here. This is a safe, judgment-free space."}
        </Text>
      </LinearGradient>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          contentContainerStyle={styles.feed}
          showsVerticalScrollIndicator={false}
        >
          {messages.map(msg => (
            <View
              key={msg.id}
              style={[styles.messageWrap, msg.mine && styles.messageWrapMine]}
            >
              <View style={[styles.bubble, msg.mine && styles.bubbleMine]}>
                <View style={styles.bubbleHeader}>
                  <View style={[styles.avatar, msg.mine && styles.avatarMine]}>
                    <Text style={styles.avatarText}>{msg.author.slice(5, 6)}</Text>
                  </View>
                  <View>
                    <Text style={[styles.author, msg.mine && styles.authorMine]}>{msg.author}</Text>
                    <Text style={styles.time}>{msg.time}</Text>
                  </View>
                </View>
                <Text style={[styles.messageText, msg.mine && styles.messageTextMine]}>
                  {msg.text}
                </Text>
                {!msg.mine && (
                  <View style={styles.reactRow}>
                    <TouchableOpacity
                      style={[styles.reactBtn, reacted[`${msg.id}_heart`] && styles.reactBtnActive]}
                      onPress={() => react(msg.id, 'heart')}
                    >
                      <Text style={styles.reactEmoji}>💛</Text>
                      <Text style={styles.reactCount}>{msg.reactions.heart}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.reactBtn, reacted[`${msg.id}_pray`] && styles.reactBtnActive]}
                      onPress={() => react(msg.id, 'pray')}
                    >
                      <Text style={styles.reactEmoji}>🙏</Text>
                      <Text style={styles.reactCount}>{msg.reactions.pray}</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          ))}

          <View style={{ height: Spacing.xl }} />
        </ScrollView>

        {/* Input */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder={
              language === 'rw' ? 'Ndagufasha ute? Andika...' : 'Share with your circle...'
            }
            placeholderTextColor={Colors.textMuted}
            value={draft}
            onChangeText={setDraft}
            multiline
            maxLength={300}
          />
          <TouchableOpacity
            style={[styles.sendBtn, !draft.trim() && { opacity: 0.4 }]}
            onPress={sendMessage}
            disabled={!draft.trim()}
          >
            <LinearGradient
              colors={[Colors.primaryLight, Colors.primary]}
              style={styles.sendGrad}
            >
              <Text style={styles.sendText}>→</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
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
  headerCenter: { alignItems: 'center' },
  headerTitle: { fontWeight: '700', fontSize: Typography.size.md, color: Colors.textPrimary },
  onlineBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  onlineDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.success },
  onlineText: { color: Colors.textSecondary, fontSize: 11 },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  infoIcon: { fontSize: 20 },
  infoText: { flex: 1, color: Colors.textSecondary, fontSize: 12, lineHeight: 18 },
  feed: { padding: Spacing.md, gap: Spacing.sm },
  messageWrap: { alignItems: 'flex-start' },
  messageWrapMine: { alignItems: 'flex-end' },
  bubble: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderBottomLeftRadius: 4,
    padding: Spacing.md,
    maxWidth: '85%',
    ...Shadow.soft,
  },
  bubbleMine: {
    backgroundColor: Colors.primaryPale,
    borderBottomLeftRadius: Radius.lg,
    borderBottomRightRadius: 4,
  },
  bubbleHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarMine: { backgroundColor: Colors.primaryLight },
  avatarText: { fontWeight: '700', color: Colors.primary, fontSize: 14 },
  author: { fontWeight: '700', fontSize: 13, color: Colors.textPrimary },
  authorMine: { color: Colors.primary },
  time: { color: Colors.textMuted, fontSize: 11 },
  messageText: { color: Colors.textPrimary, fontSize: Typography.size.base, lineHeight: 22 },
  messageTextMine: { color: Colors.textPrimary },
  reactRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm },
  reactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.full,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  reactBtnActive: { backgroundColor: Colors.primaryPale },
  reactEmoji: { fontSize: 14 },
  reactCount: { color: Colors.textSecondary, fontSize: 12, fontWeight: '600' },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    backgroundColor: Colors.white,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    fontSize: Typography.size.base,
    color: Colors.textPrimary,
    maxHeight: 100,
  },
  sendBtn: { borderRadius: Radius.full, overflow: 'hidden' },
  sendGrad: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendText: { color: Colors.white, fontWeight: '700', fontSize: 18 },
});
