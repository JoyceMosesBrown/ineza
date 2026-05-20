import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, ClipboardList, TrendingUp, GraduationCap, HeartPulse,
  CheckCircle, Wind, Droplets, Phone, Moon, Heart, PenLine, ChevronRight,
} from 'lucide-react';
import { useApp, MoodLevel } from '../context/AppContext';
import { QUOTES } from '../data/content';

const MOODS: { level: MoodLevel; rw: string; en: string; color: string; dot: string }[] = [
  { level: 5, rw: 'Neza cyane',  en: 'Great',      color: '#D8F3DC', dot: '#40916C' },
  { level: 4, rw: 'Neza',        en: 'Good',        color: '#B7E4C7', dot: '#52B788' },
  { level: 3, rw: 'Meza neza',   en: 'Okay',        color: '#FFF9C4', dot: '#D4A017' },
  { level: 2, rw: 'Gato bigoye', en: 'Low',         color: '#FFE0B2', dot: '#F4A261' },
  { level: 1, rw: 'Bigoye',      en: 'Struggling',  color: '#FFCDD2', dot: '#E53935' },
];

const QUICK = [
  { label: { rw: 'Ibitabo byanjye', en: 'My Journal'    }, to: '/journal',  Icon: BookOpen,      color: '#EEF4F1' },
  { label: { rw: 'Gukurikirana',    en: 'Daily Tracker'  }, to: '/tracker',  Icon: ClipboardList, color: '#FFF9C4' },
  { label: { rw: 'Iterambere',      en: 'Progress'       }, to: '/progress', Icon: TrendingUp,    color: '#EEF4F1' },
  { label: { rw: 'Kwiga',           en: 'Learn'          }, to: '/learn',    Icon: GraduationCap, color: '#FFF3E0' },
];

// Immediate support shown when mood is Low (2) or Struggling (1)
const SUPPORT = {
  rw: {
    1: {
      message: 'Ndakumva. Ibyiyumvo byawe bifite agaciro. Ntibigaragaza umutegetsi wawe nk\'umubyeyi. Uriho, kandi ubwo ni bihagije. Gerageza ibintu bikurikira none none:',
      steps: [
        { Icon: Wind,     title: 'Guhuma gato',        detail: 'Humeka burambe inshuro 4. Ibyo biganisha ubwonko bwawe gukora neza.' },
        { Icon: Droplets, title: 'Unywe amazi',         detail: 'Nywa glasi imwe y\'amazi none none. Bitera ingufu no gutuza.' },
        { Icon: Phone,    title: 'Vugana n\'umuntu',    detail: 'Hamagara umujyanama wawe. Ntuvuge gusa ko uri meza. Bwira ukuri.' },
        { Icon: Moon,     title: 'Ryama gato',          detail: 'Niba mwana araryamye, ryama nawe, ndetse n\'iminota 15.' },
      ],
    },
    2: {
      message: 'Urakora neza kuruta uko utekereza. Iminsi igoranye ni igice cy\'inzira, si iherezo. Gerageza ibintu bikurikira:',
      steps: [
        { Icon: Wind,    title: 'Guhuma gato',     detail: 'Humeka burambe inshuro 5 kugira ngo utuze.' },
        { Icon: Heart,   title: 'Ikunda rimwe',    detail: 'Bwira ubwoko bwawe: "Ndakora neza. Ndi intwari."' },
        { Icon: PenLine, title: 'Andika icyo wumva', detail: 'Andika ijambo rimwe. Gusohora ibyiyumvo bifasha.' },
      ],
    },
  },
  en: {
    1: {
      message: "I hear you. What you're feeling is real and valid. It doesn't make you a bad mother. You are here, and that takes courage. Try these right now:",
      steps: [
        { Icon: Wind,     title: 'Box breathing',     detail: 'Breathe in 4 counts, hold 4, out 6. Repeat 3 times. This calms your nervous system fast.' },
        { Icon: Droplets, title: 'Drink water',        detail: 'One full glass right now. Dehydration makes anxiety and exhaustion feel much worse.' },
        { Icon: Phone,    title: 'Tell someone',       detail: "Text or call your CHW. Even saying 'I'm struggling today' is enough." },
        { Icon: Moon,     title: 'Rest if you can',    detail: 'If your baby is sleeping, lie down. Even 15 minutes helps.' },
      ],
    },
    2: {
      message: "You're doing better than you think. Hard days are part of the journey, not the end of it. A few small things that can help right now:",
      steps: [
        { Icon: Wind,    title: 'Breathe slowly',       detail: 'Take 5 slow breaths to reset your nervous system.' },
        { Icon: Heart,   title: 'Say something kind',   detail: 'Tell yourself quietly: "I am doing enough. I am a good mother."' },
        { Icon: PenLine, title: 'Write one feeling',    detail: 'Write one word about how you feel. Getting it out reduces its weight.' },
      ],
    },
  },
};

export default function Home() {
  const { lang, nickname, streak, today, saveEntry, t } = useApp();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<MoodLevel | null>(today?.mood ?? null);

  const quote = QUOTES[lang][new Date().getDay() % QUOTES[lang].length];
  const hr = new Date().getHours();
  const greeting = lang === 'rw'
    ? (hr < 12 ? 'Mwaramutse' : hr < 17 ? 'Mwiriwe' : 'Bwiriwe')
    : (hr < 12 ? 'Good morning' : hr < 17 ? 'Good afternoon' : 'Good evening');

  const handleMood = (level: MoodLevel) => {
    setSelected(level);
    saveEntry({ mood: level });
  };

  const selectedMood = MOODS.find(m => m.level === selected);
  const support = selected && selected <= 2
    ? (SUPPORT[lang] as any)[selected]
    : null;

  return (
    <div className="page">
      {/* Greeting */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--gray-900)' }}>
          {greeting}, {nickname}
        </h1>
        <p style={{ color: 'var(--gray-500)', marginTop: 4 }}>
          {lang === 'rw' ? 'Amakuru yawe ari hano.' : "Here's your wellbeing summary."}
        </p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="card stat-card">
          <div className="stat-label">{t('streak')}</div>
          <div className="stat-value">{streak}</div>
          <div className="stat-sub">{lang === 'rw' ? 'iminsi yinjiye' : 'days in a row'}</div>
        </div>
        <div className="card stat-card">
          <div className="stat-label">{lang === 'rw' ? 'Imyumvire ya none' : "Today's mood"}</div>
          {selectedMood ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: selectedMood.dot, flexShrink: 0 }} />
              <div className="stat-value" style={{ fontSize: 18 }}>
                {lang === 'rw' ? selectedMood.rw : selectedMood.en}
              </div>
            </div>
          ) : (
            <div className="stat-value" style={{ fontSize: 20, color: 'var(--gray-300)' }}>—</div>
          )}
          <div className="stat-sub">
            {!selected && (lang === 'rw' ? 'Ntarinjiye' : 'Not checked in')}
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-label">{t('quote')}</div>
          <div style={{ fontSize: 13, fontStyle: 'italic', color: 'var(--gray-700)', lineHeight: 1.6, marginTop: 4 }}>
            "{quote}"
          </div>
        </div>
      </div>

      {/* Mood check-in */}
      <div className="card card-pad" style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 16 }}>
          <div className="section-title" style={{ fontSize: 17 }}>{t('howFeel')}</div>
          <div style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 2 }}>
            {lang === 'rw' ? 'Kanda ku kisubizo kimwe' : 'Select one'}
          </div>
        </div>
        <div className="mood-row">
          {MOODS.map(m => (
            <button key={m.level}
              className={`mood-chip${selected === m.level ? ' selected' : ''}`}
              onClick={() => handleMood(m.level)}
              style={selected === m.level ? { background: m.color, borderColor: m.dot } : {}}
            >
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: m.dot, flexShrink: 0 }} />
              {lang === 'rw' ? m.rw : m.en}
            </button>
          ))}
        </div>

        {/* Good mood confirmation */}
        {selected && selected >= 3 && (
          <div style={{ marginTop: 16, padding: '12px 16px', background: 'var(--green-50)', borderRadius: 10, fontSize: 14, color: 'var(--green-700)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircle size={16} strokeWidth={2} />
            {lang === 'rw' ? 'Winjiye uyu munsi. Urashimishije.' : "Checked in today. You're doing great."}
          </div>
        )}
      </div>

      {/* ── Immediate support card (mood 1 or 2) ── */}
      {support && (
        <div style={{
          background: selected === 1 ? '#FFF5F5' : '#FFFBEB',
          border: `1.5px solid ${selected === 1 ? '#FECACA' : '#FDE68A'}`,
          borderRadius: 16, padding: '24px', marginBottom: 28,
        }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{
              width: 10, height: 10, borderRadius: '50%',
              background: selected === 1 ? '#E53935' : '#F4A261', flexShrink: 0,
            }} />
            <span style={{ fontWeight: 700, fontSize: 13, color: selected === 1 ? '#B91C1C' : '#92400E', textTransform: 'uppercase', letterSpacing: '.5px' }}>
              {lang === 'rw' ? 'Ubufasha bwa none' : 'Support for right now'}
            </span>
          </div>

          <p style={{ fontSize: 15, color: 'var(--gray-700)', lineHeight: 1.7, marginBottom: 20 }}>
            {support.message}
          </p>

          {/* Step cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
            {support.steps.map((step: any) => (
              <div key={step.title} style={{
                display: 'flex', gap: 14, alignItems: 'flex-start',
                background: 'var(--white)', border: '1px solid var(--border)',
                borderRadius: 12, padding: '14px 16px',
              }}>
                <div style={{ color: 'var(--green-600)', flexShrink: 0, marginTop: 2 }}>
                  <step.Icon size={20} strokeWidth={1.8} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--gray-900)', marginBottom: 3 }}>{step.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--gray-600)', lineHeight: 1.55 }}>{step.detail}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/journal')}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <PenLine size={14} />
              {lang === 'rw' ? 'Andika ibyiyumvo byawe' : 'Write how you feel'}
            </button>
            <button className="btn btn-outline btn-sm" onClick={() => navigate('/chw')}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Phone size={14} />
              {lang === 'rw' ? 'Vugana na CHW wawe' : 'Talk to your CHW'}
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      )}

      {/* Quick actions — only show when mood is okay or better */}
      {(!selected || selected >= 3) && (
        <>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14, color: 'var(--gray-900)' }}>
            {lang === 'rw' ? 'Ibikoresho byawe' : 'Your tools'}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 28 }}>
            {QUICK.map(q => (
              <button key={q.to}
                onClick={() => navigate(q.to)}
                style={{
                  background: q.color, border: '1px solid var(--border)', borderRadius: 12,
                  padding: '20px', textAlign: 'left', cursor: 'pointer', transition: 'box-shadow .15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = 'var(--shadow)')}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
              >
                <div style={{ marginBottom: 10, color: 'var(--green-700)' }}>
                  <q.Icon size={26} strokeWidth={1.6} />
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--gray-900)' }}>
                  {q.label[lang]}
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* CHW banner */}
      <div className="card" style={{ background: 'var(--green-700)', border: 'none', cursor: 'pointer' }}
        onClick={() => navigate('/chw')}>
        <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--white)' }}>
              {lang === 'rw' ? 'Umujyanama wawe' : 'Your CHW'}
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,.75)', marginTop: 4 }}>
              {lang === 'rw' ? 'Uhabwa, yawe, hafi nawe' : 'Here for you, always'} →
            </div>
          </div>
          <HeartPulse size={36} color="rgba(255,255,255,0.8)" strokeWidth={1.4} />
        </div>
      </div>
    </div>
  );
}
