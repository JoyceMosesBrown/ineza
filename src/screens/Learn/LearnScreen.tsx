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
import { Colors, Spacing, Typography, Radius, Shadow } from '../../theme';
import Card from '../../components/common/Card';
import { useApp } from '../../context/AppContext';
import { LEARN_ARTICLES } from '../../data/content';

const { width } = Dimensions.get('window');

const ARTICLE_CONTENT: Record<string, { rw: string; en: string }> = {
  '1': {
    rw: `Kwiheba nyuma yo kubyara (PPD) ni indwara igira ingaruka ku buzima bw'ubwonko. Si ikosa ryawe, kandi si ibimenyetso ko uri nyina mubi.\n\nIbimenyetso birimo:\n• Uburakari cyangwa agahinda\n• Kunanirwa kugira isano na mwana wawe\n• Kwiyumvamo nk'udafite agaciro\n• Kutinya cyangwa kubona ibintu bibi\n• Kunanirwa gusinzira no kurya\n\nIbi byose bituruka ku mpinduka za horomo nyuma yo kubyara. Ufite ubufasha. Vugana na umujyanama wawe.`,
    en: `Postpartum depression (PPD) is a medical condition that affects your brain chemistry. It is not your fault, and it does not make you a bad mother.\n\nSymptoms include:\n• Sadness or irritability\n• Difficulty bonding with your baby\n• Feeling worthless or hopeless\n• Anxiety or intrusive thoughts\n• Trouble sleeping or eating\n\nAll of these come from hormonal changes after birth. You deserve help. Talk to your CHW.`,
  },
  '2': {
    rw: `Gutekereza ko uri nyina mubi ni ibimenyetso bya PPD — si ukuri.\n\nIyo wumva:\n• Ntibashe gukunda mwana wawe bihagije\n• Uri mubi kuruta abandi banyina\n• Mwana wawe wari kubyara undi nyina\n\nIbi ni ibitekerezo by'indwara, si ukuri. Buri nyina wumva gutyo rimwe na rimwe. Ufite impuhwe nini ku mwana wawe — kuko ubyihangana.`,
    en: `Feeling like a bad mother is a symptom of PPD — not the truth about you.\n\nWhen you feel:\n• You can't love your baby enough\n• You're worse than other mothers\n• Your baby would be better off with someone else\n\nThese are thoughts from the illness, not reality. Every mother feels this sometimes. The fact that you care so deeply proves what kind of mother you are.`,
  },
  '3': {
    rw: `Inzira zoroheje zo gusanga mwana wawe:\n\n🤲 Gusekura — ushike mwana wawe ku ngingo, ameze hafi nawe\n👁️ Kumwitegereza — umwite ku maso, umubwire injyana nziza\n🎵 Indirimbo — imba indirimbo zo mu Rwanda\n🛁 Kumukaraba hamwe — ni igihe cy'isano nziza\n🌬️ Guhuma hamwe — muruhuke hamwe nyuma y'iryo ryama\n\nNtabwo bigomba gutangwa icyarimwe. Intambwe nto buri munsi ni intsinzi nini.`,
    en: `Simple ways to bond with your baby:\n\n🤲 Skin-to-skin contact — hold your baby close against your chest\n👁️ Eye contact — look into their eyes and talk softly\n🎵 Sing — any song, even humming, is enough\n🛁 Bath time — make it a moment of calm connection\n🌬️ Breathe together — rest near each other after feeds\n\nYou don't have to do it all at once. Small moments every day add up to something beautiful.`,
  },
  '4': {
    rw: `Gusaba ubufasha si ubunyangamugayo — ni intwari.\n\nUzagerageza kuvuga:\n• "Ndumva ngoye. Nshaka ubufasha."\n• "Nawe ushobora kunsindira rimwe na rimwe?"\n• "Nshaka kuvugana na umujyanama."\n\nAbantu bakunda bashaka gufasha — ariko bakenera kumenya ko ukenye. Intambwe ya mbere ni nziza. Witinya.`,
    en: `Asking for help is not weakness — it is courage.\n\nTry saying:\n• "I'm struggling. I need support."\n• "Could you help me sometimes?"\n• "I want to talk to a health worker."\n\nPeople who love you want to help — they just need to know you need it. The first step is always the hardest. You can do this.`,
  },
  '5': {
    rw: `Nyuma yo kubyara, horomo zawe zigwa vuba cyane — estrogène na progestérone. Ibi bishobora guhindura:\n• Uburyo wumva (agahinda, uburakari)\n• Ibitotsi (bigoranye kusinzira nubwo unaniwe)\n• Gukunda kurya no kutabona inzara\n• Ingufu (wumva unaniwe cyane)\n\nIbi ni imiterere ya kamere. Ntabwo bimara igihe kirekire. Ubuzima bwawe buzagaruka.`,
    en: `After birth, your hormone levels drop dramatically — estrogen and progesterone fall suddenly. This can affect:\n• Your emotions (sadness, irritability, anxiety)\n• Your sleep (difficulty sleeping even when exhausted)\n• Your appetite (eating too much or too little)\n• Your energy (feeling deeply drained)\n\nThis is a natural process. It won't last forever. Your body is healing.`,
  },
  '6': {
    rw: `Imyitozo yoroheje yo guhumeka:\n\n4-7-8 Breathing:\n1. Fumba akanwa\n2. Humeka utwi akanya ka 4\n3. Hahiriza umwuka akanya ka 7\n4. Sohora umwuka mporo akanya ka 8\n5. Subiramo inshuro 3-4\n\nUgenzure ubwo bumera kubaka — wumve ubushyuhe bw'amaguru, umeze meza. Ibi bikorerwa igihe cyose — mu gitanda, mu gikondo, mu isoko.`,
    en: `A simple breathing exercise:\n\n4-7-8 Breathing:\n1. Close your mouth\n2. Inhale through your nose for 4 counts\n3. Hold your breath for 7 counts\n4. Exhale slowly for 8 counts\n5. Repeat 3-4 times\n\nCheck in with your body as you go — feel the ground beneath you, soften your shoulders. This works anywhere — in bed, feeding your baby, anywhere you are.`,
  },
};

interface Props { navigation: any }

export default function LearnScreen({ navigation }: Props) {
  const { language } = useApp();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = LEARN_ARTICLES.find(a => a.id === selectedId);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {language === 'rw' ? 'Kwiga' : 'Learn'}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.intro}>
          {language === 'rw'
            ? 'Amakuru yoroheje akubafasha gusobanukirwa ubuzima bwawe'
            : 'Simple knowledge to help you understand your wellbeing'}
        </Text>

        {LEARN_ARTICLES.map(article => (
          <TouchableOpacity
            key={article.id}
            onPress={() => setSelectedId(article.id)}
            activeOpacity={0.8}
          >
            <Card style={{ ...styles.articleCard, backgroundColor: article.color }} padding={Spacing.md}>
              <View style={styles.articleRow}>
                <View style={styles.articleIconWrap}>
                  <Text style={styles.articleIcon}>{article.icon}</Text>
                </View>
                <View style={styles.articleText}>
                  <Text style={styles.articleTitle}>
                    {language === 'rw' ? article.titleRw : article.titleEn}
                  </Text>
                  <Text style={styles.articleSummary}>
                    {language === 'rw' ? article.summaryRw : article.summaryEn}
                  </Text>
                  <View style={styles.durationRow}>
                    <Text style={styles.durationText}>⏱ {article.duration} min</Text>
                  </View>
                </View>
                <Text style={styles.chevron}>›</Text>
              </View>
            </Card>
          </TouchableOpacity>
        ))}

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>

      {/* Article Modal */}
      <Modal
        visible={!!selectedId}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedId(null)}
      >
        <SafeAreaView style={styles.modalContainer} edges={['top']}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setSelectedId(null)} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle} numberOfLines={2}>
              {selected ? (language === 'rw' ? selected.titleRw : selected.titleEn) : ''}
            </Text>
          </View>
          <ScrollView contentContainerStyle={styles.modalBody}>
            {selected && (
              <>
                <View style={[styles.modalIconWrap, { backgroundColor: selected.color }]}>
                  <Text style={styles.modalIcon}>{selected.icon}</Text>
                </View>
                <Text style={styles.articleContent}>
                  {ARTICLE_CONTENT[selected.id]?.[language] ?? ''}
                </Text>
              </>
            )}
            <View style={{ height: Spacing.xxl }} />
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
  body: { padding: Spacing.md, gap: Spacing.sm },
  intro: {
    color: Colors.textSecondary,
    fontSize: Typography.size.base,
    lineHeight: 22,
    marginBottom: Spacing.sm,
  },
  articleCard: { ...Shadow.soft },
  articleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  articleIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  articleIcon: { fontSize: 24 },
  articleText: { flex: 1 },
  articleTitle: {
    fontWeight: '700',
    fontSize: Typography.size.base,
    color: Colors.textPrimary,
    marginBottom: 3,
  },
  articleSummary: {
    color: Colors.textSecondary,
    fontSize: Typography.size.sm,
    lineHeight: 18,
    marginBottom: 6,
  },
  durationRow: { flexDirection: 'row' },
  durationText: { color: Colors.textMuted, fontSize: Typography.size.xs },
  chevron: { color: Colors.textMuted, fontSize: 22 },
  modalContainer: { flex: 1, backgroundColor: Colors.white },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    gap: Spacing.md,
  },
  closeBtn: { padding: 8 },
  closeText: { fontSize: 18, color: Colors.textSecondary },
  modalTitle: { flex: 1, fontWeight: '700', fontSize: Typography.size.md, color: Colors.textPrimary },
  modalBody: { padding: Spacing.lg },
  modalIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: Spacing.lg,
  },
  modalIcon: { fontSize: 36 },
  articleContent: {
    color: Colors.textPrimary,
    fontSize: Typography.size.md,
    lineHeight: 28,
  },
});
