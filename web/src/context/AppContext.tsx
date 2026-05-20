import React, { createContext, useContext, useState, useEffect } from 'react';

export type Lang = 'rw' | 'en';
export type MoodLevel = 1 | 2 | 3 | 4 | 5;

export interface DayEntry {
  date: string;
  mood: MoodLevel | null;
  sleep: number;
  ate: 'yes' | 'little' | 'no' | null;
  cried: boolean | null;
  babyBond: number | null;
  anxiety: 'yes' | 'sometimes' | 'no' | null;
  social: boolean | null;
  journalText: string;
  feeling: string;
  aiResponse: string;
}

interface State {
  lang: Lang;
  nickname: string;
  district: string;
  onboarded: boolean;
  streak: number;
  entries: DayEntry[];
}

interface Ctx extends State {
  setLang: (l: Lang) => void;
  finish: (nickname: string, district: string, lang: Lang) => void;
  saveEntry: (data: Partial<DayEntry>) => void;
  logout: () => void;
  today: DayEntry | null;
  t: (k: string) => string;
}

const T: Record<Lang, Record<string, string>> = {
  rw: {
    home: 'Ahabanza', journal: 'Ibitabo byanjye', tracker: 'Gukurikirana',
    progress: 'Iterambere', learn: 'Kwiga', peers: 'Inzira yacu', chw: 'Umujyanama wanjye',
    sos: 'Ndakeneye ubufasha', howFeel: 'Uyu munsi wumva ute?',
    checkIn: 'Injira uyu munsi', streak: 'iminsi yinjiye',
    write: 'Andika ibyiyumvo byawe...', send: 'Ohereza', history: 'Kabaye',
    voiceStart: 'Vuga', voiceStop: 'Hagarika', voiceHint: 'Kanda uvuge mu Kinyarwanda cyangwa Icyongereza',
    great: 'Neza cyane', good: 'Neza', okay: 'Meza neza', low: 'Gato bigoye', bad: 'Bigoye',
    sleepQ: 'Wasinziye amasaha angahe?', ateQ: 'Wariye uyu munsi?',
    criedQ: 'Wararize uyu munsi?', bondQ: 'Wiyumvaho hafi na mwana wawe?',
    anxQ: 'Wumva uri mubitishije?', socialQ: 'Waganiriye n\'umuntu?',
    yes: 'Yego', no: 'Oya', little: 'Gato', sometimes: 'Rimwe na rimwe',
    saveLog: 'Bika amakuru', saved: 'Byabitswe!',
    settings: 'Igenamiterere', language: 'Ururimi',
    quote: 'Ijambo ry\'uyu munsi',
    learnTitle: 'Kwiga', learnSub: 'Amakuru yoroheje akubafasha',
    peersTitle: 'Inzira Yacu', circleNote: 'Aha nta mazina nyayo. Ibanga ryawe rirabitswe.',
    share: 'Andika ubutumwa...', post: 'Tuma',
    chwTitle: 'Umujyanama wanjye', call: 'Hamagara', message: 'Ubutumwa', visit: 'Saba inzu',
    nickname: 'Izina ryo mu rugo', district: 'Akarere', pin: 'PIN (imibare 4)',
    register: 'Tangira', welcome: 'Murakaza neza ku Ineza',
    tagline: 'Aho ubuzima bwawe bugaragarira, mu Kinyarwanda cyangwa Icyongereza',
  },
  en: {
    home: 'Home', journal: 'My Journal', tracker: 'Daily Tracker',
    progress: 'My Progress', learn: 'Learn', peers: 'Our Circle', chw: 'My CHW',
    sos: 'I need help', howFeel: 'How are you feeling today?',
    checkIn: 'Check in today', streak: 'day streak',
    write: 'Write how you feel...', send: 'Send', history: 'History',
    voiceStart: 'Speak', voiceStop: 'Stop', voiceHint: 'Click to speak in Kinyarwanda or English',
    great: 'Great', good: 'Good', okay: 'Okay', low: 'Low', bad: 'Struggling',
    sleepQ: 'How many hours did you sleep?', ateQ: 'Did you eat today?',
    criedQ: 'Did you cry today?', bondQ: 'Do you feel close to your baby?',
    anxQ: 'Are you feeling anxious?', socialQ: 'Did you talk to someone?',
    yes: 'Yes', no: 'No', little: 'A little', sometimes: 'Sometimes',
    saveLog: 'Save log', saved: 'Saved!',
    settings: 'Settings', language: 'Language',
    quote: "Today's thought",
    learnTitle: 'Learn', learnSub: 'Simple knowledge to support your wellbeing',
    peersTitle: 'Our Circle', circleNote: 'Anonymous, no real names. A safe, judgment-free space.',
    share: 'Share with your circle...', post: 'Post',
    chwTitle: 'My CHW', call: 'Call', message: 'Message', visit: 'Request visit',
    nickname: 'Nickname', district: 'District', pin: 'PIN (4 digits)',
    register: 'Get started', welcome: 'Welcome to Ineza',
    tagline: 'Your safe space for wellbeing, in Kinyarwanda or English',
  },
};

const Ctx = createContext<Ctx | null>(null);

const defaultEntry = (date: string): DayEntry => ({
  date, mood: null, sleep: 0, ate: null, cried: null,
  babyBond: null, anxiety: null, social: null, journalText: '', feeling: '', aiResponse: '',
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>(() => {
    try {
      const s = localStorage.getItem('ineza_web');
      return s ? JSON.parse(s) : { lang: 'rw', nickname: '', district: '', onboarded: false, streak: 0, entries: [] };
    } catch { return { lang: 'rw', nickname: '', district: '', onboarded: false, streak: 0, entries: [] }; }
  });

  useEffect(() => { localStorage.setItem('ineza_web', JSON.stringify(state)); }, [state]);

  const todayStr = new Date().toISOString().split('T')[0];
  const today = state.entries.find(e => e.date === todayStr) ?? null;

  const setLang = (lang: Lang) => setState(s => ({ ...s, lang }));

  const logout = () => {
    localStorage.removeItem('ineza_web');
    setState({ lang: 'rw', nickname: '', district: '', onboarded: false, streak: 0, entries: [] });
  };

  const finish = (nickname: string, district: string, lang: Lang) =>
    setState(s => ({ ...s, nickname, district, lang, onboarded: true }));

  const saveEntry = (data: Partial<DayEntry>) => {
    setState(s => {
      const existing = s.entries.find(e => e.date === todayStr) ?? defaultEntry(todayStr);
      const updated = { ...existing, ...data };
      const entries = [...s.entries.filter(e => e.date !== todayStr), updated];
      let streak = 0;
      const d = new Date();
      for (let i = 0; i < 365; i++) {
        const k = d.toISOString().split('T')[0];
        const e = entries.find(x => x.date === k);
        if (e && (e.mood || e.journalText)) { streak++; d.setDate(d.getDate() - 1); }
        else break;
      }
      return { ...s, entries, streak };
    });
  };

  const t = (k: string) => T[state.lang][k] ?? k;

  return <Ctx.Provider value={{ ...state, setLang, finish, saveEntry, logout, today, t }}>{children}</Ctx.Provider>;
}

export const useApp = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('useApp outside AppProvider');
  return c;
};
