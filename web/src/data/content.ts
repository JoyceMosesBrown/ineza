import type { Lang } from '../context/AppContext';

export const QUOTES: Record<Lang, string[]> = {
  rw: [
    'Ushobora kurangiza uyu munsi. Tugendana.',
    'Nturi wenyine. Dufite hamwe nawe.',
    'Intwari si uutatinya. Ni uutiruka agakomeza.',
    'Mwana wawe akunda kuko uri we.',
    'Iterambere ntabwo rigaragara buri gihe, ariko riragenda.',
  ],
  en: [
    'You can get through today. We walk together.',
    'You are not alone. We are here with you.',
    'Courage is not the absence of fear. It is taking the next step anyway.',
    'Your baby loves you because you are their mother.',
    'Progress is not always visible, but it is always real.',
  ],
};

export interface AIResponse {
  message: string;
  steps: { icon: string; title: string; detail: string }[];
}

export const AI_RESPONSES: Record<string, Record<Lang, AIResponse[]>> = {
  struggling: {
    rw: [
      {
        message: 'Ndakumva. Ubyumvamo ni bikomeye, kandi ubwo ni ukuri bwawe. Ibyiyumvo byawe bifite agaciro. Ntibihindura umutegetsi wawe nk\'umubyeyi. Uriho, kandi ubwo ni bihagije.',
        steps: [
          { icon: 'Wind', title: 'Guhuma gato', detail: 'Humeka mu maso amagana 4, hahiriza amagana 4, sohora amagana 6. Subiramo inshuro 3. Ibyo biganisha ubwonko bwawe gukora neza.' },
          { icon: 'Droplets', title: 'Unywe amazi', detail: 'Nywa glasi imwe y\'amazi none none. Inzara n\'ubunaniro bitura mu mubiri udafite amazi ahagije.' },
          { icon: 'Heart', title: 'Shyira intoki ku gituza', detail: 'Shyira intoki ku gituza. Wumve umutima wawe. Ubwo bwirabura buzana amahoro.' },
          { icon: 'Phone', title: 'Vugana n\'umuntu', detail: 'Hamagara umujyanama wawe cyangwa umuryango. Ntuvuge gusa ko uri meza. Bwira ukuri.' },
        ],
      },
      {
        message: 'Iki gihe ni gikomeye, ariko ntukirangirire. Ibimenyetso wumva ni ibimenyetso bya PPD. Si ikosa ryawe, si indangagaciro yawe nk\'umubyeyi. Tujye tugendana.',
        steps: [
          { icon: 'Moon', title: 'Ryama gato', detail: 'Niba mwana araryamye, ryama nawe none none, ndetse n\'iminota 15. Ubunaniro bwiyongera bikagorana.' },
          { icon: 'Utensils', title: 'Rya ikintu gito', detail: 'Kurya ikintu gito nk\'umwibo cyangwa igitoki bifasha ubwonko kugira ingufu.' },
          { icon: 'Activity', title: 'Genda inzira ngufi', detail: 'Sohoka hanze iminota 5 gusa. Urumuri rw\'izuba rw\'izuba n\'umwuka biganisha gutura imitima.' },
          { icon: 'PenLine', title: 'Andika icyo wumva', detail: 'Andika ijambo rimwe cyangwa ibiri ku mpapuro. Gukora ibyo bifasha ubwonko gusohora ibyiyumvo.' },
        ],
      },
    ],
    en: [
      {
        message: "I hear you. What you're feeling is real and completely valid. Feeling unwell does not make you a bad mother. It means your body and mind need care right now. You reached out, and that took courage.",
        steps: [
          { icon: 'Wind', title: 'Try box breathing', detail: 'Breathe in for 4 counts, hold for 4, breathe out for 6. Repeat 3 times. This calms your nervous system quickly.' },
          { icon: 'Droplets', title: 'Drink a glass of water', detail: 'Right now, drink one full glass of water. Dehydration makes exhaustion and anxiety feel much worse.' },
          { icon: 'Heart', title: 'Place a hand on your chest', detail: 'Put your hand over your heart. Feel it beating. Breathe slowly. This simple act tells your brain you are safe.' },
          { icon: 'Phone', title: 'Tell someone how you feel', detail: "Text or call your CHW or someone you trust. You don't have to say much. Even saying 'I'm struggling today' is enough." },
        ],
      },
      {
        message: "Feeling unwell is your body asking for rest and care. It is not a sign of weakness. You are doing something hard every single day. These small steps below can help you feel a little better right now.",
        steps: [
          { icon: 'Moon', title: 'Rest when baby rests', detail: 'If your baby is asleep, lie down, even for 15 minutes. Sleep deprivation makes everything feel harder.' },
          { icon: 'Utensils', title: 'Eat something small', detail: 'A banana, bread, or any small snack gives your brain the fuel it needs to regulate your emotions.' },
          { icon: 'Activity', title: 'Step outside briefly', detail: 'Walk outside for just 5 minutes. Sunlight and fresh air have a measurable effect on your mood.' },
          { icon: 'PenLine', title: 'Write one feeling down', detail: 'Write just one word or sentence about what you feel. Getting it out of your head helps reduce its weight.' },
        ],
      },
    ],
  },
  okay: {
    rw: [
      {
        message: 'Urakora neza kuruta uko utekereza. Buri munsi winjiye ni intsinzi nini, ndetse n\'iminsi ikomeye. Komeza ukomere.',
        steps: [
          { icon: 'Leaf', title: 'Ibuka intsinzi zawe', detail: 'Tekereza ikintu kimwe neza wakoreye uyu munsi, ndetse n\'ikintu gito nka kuvura mwana, kurya, cyangwa gusoma iki.' },
          { icon: 'Droplets', title: 'Unywe amazi', detail: 'Amazi afasha umubiri wawe kugira ingufu no gutuza ubwonko.' },
          { icon: 'Wind', title: 'Guhuma gato', detail: 'Humeka burambe inshuro 5. Ibyo bifasha umubiri wawe kuguma mu mahoro.' },
          { icon: 'Heart', title: 'Ikunda rimwe', detail: 'Jya mu maso y\'icyerekezo. Bwira ubwoko bwawe: "Ndakora neza. Ndi intwari."' },
        ],
      },
    ],
    en: [
      {
        message: "You are doing better than you think. Showing up every day, even on the hard days, is strength. These small actions can help you keep that momentum going.",
        steps: [
          { icon: 'Leaf', title: 'Acknowledge one win', detail: "Think of one thing you did well today, even something small like feeding your baby, eating, or reading this. That counts." },
          { icon: 'Droplets', title: 'Stay hydrated', detail: 'Drink water throughout the day. It keeps your energy stable and helps your brain regulate mood.' },
          { icon: 'Wind', title: 'Breathe intentionally', detail: 'Take 5 slow, deep breaths whenever you feel tension rising. It resets your nervous system.' },
          { icon: 'Heart', title: 'Say one kind thing to yourself', detail: 'Look in the mirror or just say quietly: "I am doing enough. I am a good mother."' },
        ],
      },
    ],
  },
  good: {
    rw: [
      {
        message: 'Bishimishije kumva ko uramutse neza! Iterambere ryawe rirabagaragara. Komeza ugire amahoro. Uyu munsi nziza ni impano.',
        steps: [
          { icon: 'BookOpen', title: 'Andika ibimenyetso by\'umunsi mwiza', detail: 'Andika ikintu kimwe cyakugiriye akamaro uyu munsi. Ibi bifasha ubwonko bwawe gusubira ku bihe byiza.' },
          { icon: 'Baby', title: 'Tangira iminota y\'isano', detail: 'Gira iminota 10 y\'isano na mwana wawe. Usekerane, umwite, cyangwa umwiririre.' },
          { icon: 'Activity', title: 'Genda hanze', detail: 'Niba bishoboka, genda inzira ngufi. Ubwenge bwiza bujya hamwe n\'umubiri uzima.' },
          { icon: 'Star', title: 'Kubaha uyu munsi', detail: 'Umunsi mwiza si wa buri gihe. Ubwike neza kandi wishime.' },
        ],
      },
    ],
    en: [
      {
        message: "So glad you're feeling well today! Your progress is real and it is showing. Hold onto this feeling. Use it to build a little more strength for the days ahead.",
        steps: [
          { icon: 'BookOpen', title: 'Journal your good moments', detail: "Write down what made today feel okay. On harder days, you can read this back as a reminder that good days exist." },
          { icon: 'Baby', title: 'Spend bonding time', detail: 'Use this energy for 10 minutes of connection with your baby. Play, sing, or just sit together peacefully.' },
          { icon: 'Activity', title: 'Go for a short walk', detail: 'If you can, step outside. Good mental health and physical movement reinforce each other.' },
          { icon: 'Star', title: 'Appreciate this day', detail: 'Good days are not always guaranteed. Be grateful for this one. You earned it.' },
        ],
      },
    ],
  },
};

export const ARTICLES = [
  {
    id: '1', icon: 'Brain', color: '#D8F3DC',
    titleRw: 'Kwiheba nyuma yo kubyara ni iki?', titleEn: 'What is postpartum depression?',
    summaryRw: 'Kwiheba nyuma yo kubyara ni indwara itangwa na imitsi ya ubwonko. Si ikosa ryawe.',
    summaryEn: 'Postpartum depression is a medical condition of the brain. It is not your fault.',
    bodyRw: `Kwiheba nyuma yo kubyara (PPD) ni indwara igira ingaruka ku buzima bw'ubwonko. Si ikosa ryawe, kandi si ibimenyetso ko uri nyina mubi.\n\nIbimenyetso birimo:\n• Uburakari cyangwa agahinda\n• Kunanirwa kugira isano na mwana wawe\n• Kwiyumvamo nk'udafite agaciro\n• Kutinya cyangwa kubona ibintu bibi\n• Kunanirwa gusinzira no kurya\n\nIbi byose bituruka ku mpinduka za horomo nyuma yo kubyara. Ufite ubufasha. Vugana na umujyanama wawe.`,
    bodyEn: `Postpartum depression (PPD) is a medical condition that affects your brain chemistry. It is not your fault, and it does not make you a bad mother.\n\nSymptoms include:\n• Sadness or irritability\n• Difficulty bonding with your baby\n• Feeling worthless or hopeless\n• Anxiety or intrusive thoughts\n• Trouble sleeping or eating\n\nAll of these come from hormonal changes after birth. You deserve help. Talk to your CHW.`,
  },
  {
    id: '2', icon: 'Heart', color: '#FFF9C4',
    titleRw: 'Nturi nyina mubi', titleEn: 'You are not a bad mother',
    summaryRw: 'Gutekereza ko uri nyina mubi ni ibimenyetso by\'indwara, si ukuri.',
    summaryEn: 'Feeling like a bad mother is a symptom of the illness, not the truth.',
    bodyRw: `Gutekereza ko uri nyina mubi ni ibimenyetso bya PPD. Si ukuri.\n\nIyo wumva:\n• Ntibashe gukunda mwana wawe bihagije\n• Uri mubi kuruta abandi banyina\n• Mwana wawe wari kubyara undi nyina\n\nIbi ni ibitekerezo by'indwara, si ukuri. Buri nyina wumva gutyo rimwe na rimwe.`,
    bodyEn: `Feeling like a bad mother is a symptom of PPD. It is not the truth about you.\n\nWhen you feel:\n• You can't love your baby enough\n• You're worse than other mothers\n• Your baby would be better off with someone else\n\nThese are thoughts from the illness, not reality. Every mother feels this sometimes.`,
  },
  {
    id: '3', icon: 'Baby', color: '#FFDDD2',
    titleRw: 'Uko wongera isano na mwana wawe', titleEn: 'How to bond with your baby',
    summaryRw: 'Inzira zoroheje zo gusanga mwana wawe buri munsi.',
    summaryEn: 'Simple ways to connect with your baby every day.',
    bodyRw: `Inzira zoroheje zo gusanga mwana wawe:\n\n🤲 Gusekura: ushike mwana wawe ku ngingo\n👁️ Kumwitegereza: umwite ku maso\n🎵 Indirimbo: imba indirimbo zo mu Rwanda\n🛁 Kumukaraba hamwe: ni igihe cy'isano nziza\n🌬️ Guhuma hamwe: muruhuke hamwe\n\nNtabwo bigomba gutangwa icyarimwe. Intambwe nto buri munsi ni intsinzi nini.`,
    bodyEn: `Simple ways to bond with your baby:\n\n🤲 Skin-to-skin contact: hold your baby close\n👁️ Eye contact: look into their eyes and talk softly\n🎵 Sing: any song, even humming, is enough\n🛁 Bath time: make it a moment of calm connection\n🌬️ Breathe together: rest near each other after feeds\n\nYou don't have to do it all at once. Small moments every day add up.`,
  },
  {
    id: '4', icon: 'Handshake', color: '#EEF4F1',
    titleRw: 'Gusaba ubufasha nta ngorane', titleEn: 'How to ask for help without shame',
    summaryRw: 'Gusaba ubufasha ni ingufu. Si intsinzi.',
    summaryEn: 'Asking for help is strength. It is not weakness.',
    bodyRw: `Gusaba ubufasha si ubunyangamugayo. Ni intwari.\n\nUzagerageza kuvuga:\n• "Ndumva ngoye. Nshaka ubufasha."\n• "Nawe ushobora kunsindira rimwe na rimwe?"\n• "Nshaka kuvugana na umujyanama."\n\nAbantu bakunda bashaka gufasha, ariko bakenera kumenya ko ukenye. Witinya.`,
    bodyEn: `Asking for help is not weakness. It is courage.\n\nTry saying:\n• "I'm struggling. I need support."\n• "Could you help me sometimes?"\n• "I want to talk to a health worker."\n\nPeople who love you want to help. They just need to know you need it.`,
  },
  {
    id: '5', icon: 'Leaf', color: '#D8F3DC',
    titleRw: 'Ubushyuhe bw\'umubiri wawe', titleEn: 'What your body is going through',
    summaryRw: 'Impinduka za horomo nyuma yo kubyara zishobora guhindura uburyo wumva.',
    summaryEn: 'Hormonal changes after birth can deeply affect how you feel.',
    bodyRw: `Nyuma yo kubyara, horomo zawe zigwa vuba cyane: estrogène na progestérone. Ibi bishobora guhindura:\n• Uburyo wumva (agahinda, uburakari)\n• Ibitotsi (bigoranye kusinzira)\n• Gukunda kurya no kutabona inzara\n• Ingufu (wumva unaniwe cyane)\n\nIbi ni imiterere ya kamere. Ubuzima bwawe buzagaruka.`,
    bodyEn: `After birth, your hormone levels drop dramatically. This can affect:\n• Your emotions (sadness, irritability, anxiety)\n• Your sleep (difficulty sleeping even when exhausted)\n• Your appetite\n• Your energy levels\n\nThis is a natural process. It won't last forever. Your body is healing.`,
  },
];

export const PEER_MESSAGES = [
  { id: '1', author: 'Mama Keza', time: '2h ago', text: 'Uyu munsi byahenze gato, ariko nakomeje. Twarabana hamwe twese.', reactions: { heart: 4, pray: 2 } },
  { id: '2', author: 'Mama Amani', time: '4h ago', text: 'Mwana wanjye yararyamye amasaha 3. Nshimira Imana.', reactions: { heart: 7, pray: 3 } },
  { id: '3', author: 'Mama Ingabire', time: '6h ago', text: 'Ni nde wibuka ko neza? Urashimishije kuko uriho.', reactions: { heart: 12, pray: 5 } },
];

export const DISTRICTS = [
  'Gasabo','Kicukiro','Nyarugenge','Bugesera','Gatsibo','Kayonza','Kirehe','Ngoma',
  'Nyagatare','Rwamagana','Burera','Gakenke','Gicumbi','Musanze','Rulindo',
  'Gisagara','Huye','Kamonyi','Muhanga','Nyamagabe','Nyanza','Nyaruguru','Ruhango',
  'Karongi','Ngororero','Nyabihu','Nyamasheke','Rubavu','Rutsiro','Rusizi',
];

export function detectSentiment(text: string): 'good' | 'okay' | 'struggling' {
  const l = text.toLowerCase();
  if (['bigoye','nkiheba','scared','struggling','hard','tired','hopeless','ntibishoboka'].some(w => l.includes(w))) return 'struggling';
  if (['neza','nishimye','good','happy','great','better','improved'].some(w => l.includes(w))) return 'good';
  return 'okay';
}

export function pickAI(bucket: 'good'|'okay'|'struggling', lang: Lang): AIResponse {
  const list = AI_RESPONSES[bucket][lang];
  return list[Math.floor(Math.random() * list.length)];
}
