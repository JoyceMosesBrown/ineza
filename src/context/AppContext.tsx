import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Language = 'rw' | 'en';
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
  aiResponse: string;
}

interface AppState {
  language: Language;
  nickname: string;
  district: string;
  onboarded: boolean;
  streak: number;
  entries: DayEntry[];
  todayEntry: DayEntry | null;
}

interface AppContextType extends AppState {
  setLanguage: (l: Language) => void;
  completeOnboarding: (nickname: string, district: string, lang: Language) => void;
  saveEntry: (entry: Partial<DayEntry>) => void;
  t: (key: string) => string;
}

const defaultState: AppState = {
  language: 'rw',
  nickname: '',
  district: '',
  onboarded: false,
  streak: 0,
  entries: [],
  todayEntry: null,
};

const translations: Record<Language, Record<string, string>> = {
  rw: {
    welcome: 'Murakaza neza',
    tagline: 'Aho ubuzima bwawe bugaragarira',
    howAreYou: 'Uyu munsi wumva ute?',
    great: 'Neza cyane',
    good: 'Neza',
    okay: 'Meza neza',
    low: 'Bigoye gato',
    bad: 'Bigoye',
    journal: 'Ibitabo byanjye',
    tracker: 'Gukurikirana',
    progress: 'Iterambere ryanjye',
    learn: 'Kwiga',
    peers: 'Inzira yacu',
    chw: 'Umujyanama wanjye',
    sos: 'Ndakeneye ubufasha',
    streak: 'Iminsi yinjiye',
    days: 'iminsi',
    checkIn: 'Injira uyu munsi',
    writeJournal: 'Andika ibyiyumvo byawe...',
    save: 'Bika',
    cancel: 'Reka',
    send: 'Ohereza',
    loading: 'Gutegereza...',
    encouragement: 'Urashimishije. Urakora neza.',
    notAlone: 'Nturi wenyine.',
    brave: 'Uri intwari.',
    sleepQ: 'Wasinziye amasaha angahe?',
    ateQ: 'Wariye uyu munsi?',
    criedQ: 'Wararize uyu munsi?',
    bondQ: 'Wiyumvaho hafi na mwana wawe?',
    anxietyQ: 'Wumva uri mubitishije?',
    socialQ: 'Waganiriye n\'umuntu uyu munsi?',
    yes: 'Yego',
    no: 'Oya',
    little: 'Gato',
    sometimes: 'Rimwe na rimwe',
    submit: 'Ohereza',
    home: 'Ahabanza',
    myJournal: 'Ibitabo byanjye',
    myProgress: 'Iterambere ryanjye',
    community: 'Umuryango',
    dailyQuote: 'Ijambo ry\'uyu munsi',
    seeAll: 'Reba byose',
    back: 'Subira',
    morning: 'Mwaramutse',
    afternoon: 'Mwiriwe',
    evening: 'Bwiriwe',
  },
  en: {
    welcome: 'Welcome',
    tagline: 'Your safe space for wellbeing',
    howAreYou: 'How are you feeling today?',
    great: 'Great',
    good: 'Good',
    okay: 'Okay',
    low: 'Low',
    bad: 'Struggling',
    journal: 'My Journal',
    tracker: 'Tracker',
    progress: 'My Progress',
    learn: 'Learn',
    peers: 'Our Circle',
    chw: 'My CHW',
    sos: 'I need help',
    streak: 'Day streak',
    days: 'days',
    checkIn: 'Check in today',
    writeJournal: 'Write how you feel...',
    save: 'Save',
    cancel: 'Cancel',
    send: 'Send',
    loading: 'Loading...',
    encouragement: 'You are doing beautifully. Keep going.',
    notAlone: 'You are not alone.',
    brave: 'You are brave.',
    sleepQ: 'How many hours did you sleep?',
    ateQ: 'Did you eat today?',
    criedQ: 'Did you cry today?',
    bondQ: 'Do you feel close to your baby?',
    anxietyQ: 'Are you feeling anxious?',
    socialQ: 'Did you talk to someone today?',
    yes: 'Yes',
    no: 'No',
    little: 'A little',
    sometimes: 'Sometimes',
    submit: 'Submit',
    home: 'Home',
    myJournal: 'Journal',
    myProgress: 'Progress',
    community: 'Community',
    dailyQuote: "Today's thought",
    seeAll: 'See all',
    back: 'Back',
    morning: 'Good morning',
    afternoon: 'Good afternoon',
    evening: 'Good evening',
  },
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState);

  useEffect(() => {
    loadState();
  }, []);

  const loadState = async () => {
    try {
      const stored = await AsyncStorage.getItem('ineza_state');
      if (stored) {
        const parsed = JSON.parse(stored);
        const today = new Date().toISOString().split('T')[0];
        const todayEntry = parsed.entries?.find((e: DayEntry) => e.date === today) || null;
        setState({ ...parsed, todayEntry });
      }
    } catch (_) {}
  };

  const persist = async (newState: AppState) => {
    try {
      await AsyncStorage.setItem('ineza_state', JSON.stringify(newState));
    } catch (_) {}
  };

  const setLanguage = (language: Language) => {
    const next = { ...state, language };
    setState(next);
    persist(next);
  };

  const completeOnboarding = (nickname: string, district: string, lang: Language) => {
    const next = { ...state, nickname, district, language: lang, onboarded: true };
    setState(next);
    persist(next);
  };

  const saveEntry = (entry: Partial<DayEntry>) => {
    const today = new Date().toISOString().split('T')[0];
    const existing = state.entries.find(e => e.date === today);
    const updated: DayEntry = {
      date: today,
      mood: null,
      sleep: 0,
      ate: null,
      cried: null,
      babyBond: null,
      anxiety: null,
      social: null,
      journalText: '',
      aiResponse: '',
      ...existing,
      ...entry,
    };
    const entries = [
      ...state.entries.filter(e => e.date !== today),
      updated,
    ];
    // recalculate streak
    let streak = 0;
    const d = new Date();
    while (true) {
      const key = d.toISOString().split('T')[0];
      if (entries.find(e => e.date === key && (e.mood || e.journalText))) {
        streak++;
        d.setDate(d.getDate() - 1);
      } else break;
    }
    const next = { ...state, entries, todayEntry: updated, streak };
    setState(next);
    persist(next);
  };

  const t = (key: string) => translations[state.language][key] ?? key;

  return (
    <AppContext.Provider value={{ ...state, setLanguage, completeOnboarding, saveEntry, t }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}
