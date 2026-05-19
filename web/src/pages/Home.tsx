import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, MoodLevel } from '../context/AppContext';
import { QUOTES } from '../data/content';

const MOODS: { level: MoodLevel; rw: string; en: string; emoji: string; color: string }[] = [
  { level: 5, rw: 'Neza cyane', en: 'Great', emoji: '😄', color: '#D8F3DC' },
  { level: 4, rw: 'Neza', en: 'Good', emoji: '🙂', color: '#B7E4C7' },
  { level: 3, rw: 'Meza neza', en: 'Okay', emoji: '😐', color: '#FFF9C4' },
  { level: 2, rw: 'Gato bigoye', en: 'Low', emoji: '😔', color: '#FFE0B2' },
  { level: 1, rw: 'Bigoye', en: 'Struggling', emoji: '😢', color: '#FFCDD2' },
];

const QUICK: { label: { rw: string; en: string }; to: string; icon: string; color: string }[] = [
  { label: { rw: 'Ibitabo byanjye', en: 'My Journal' }, to: '/journal', icon: '✏️', color: '#EEF4F1' },
  { label: { rw: 'Gukurikirana', en: 'Daily Tracker' }, to: '/tracker', icon: '◎', color: '#FFF9C4' },
  { label: { rw: 'Iterambere', en: 'Progress' }, to: '/progress', icon: '↗', color: '#EEF4F1' },
  { label: { rw: 'Kwiga', en: 'Learn' }, to: '/learn', icon: '📚', color: '#FFF3E0' },
];

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

  return (
    <div className="page">
      {/* Greeting */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--gray-900)' }}>
          {greeting}, {nickname} 👋
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
          <div className="stat-label">{lang === 'rw' ? 'Imyumvire ya none' : 'Today\'s mood'}</div>
          <div className="stat-value" style={{ fontSize: 36 }}>
            {selected ? MOODS.find(m => m.level === selected)?.emoji : '—'}
          </div>
          <div className="stat-sub">
            {selected
              ? (lang === 'rw'
                  ? MOODS.find(m => m.level === selected)?.rw
                  : MOODS.find(m => m.level === selected)?.en)
              : (lang === 'rw' ? 'Ntarinjiye' : 'Not checked in')}
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-label">{t('quote')}</div>
          <div style={{ fontSize: 13, fontStyle: 'italic', color: 'var(--gray-700)', lineHeight: 1.6, marginTop: 4 }}>
            "{quote}"
          </div>
        </div>
      </div>

      {/* Check-in */}
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
              style={selected === m.level ? { background: m.color } : {}}
            >
              <span style={{ fontSize: 20 }}>{m.emoji}</span>
              {lang === 'rw' ? m.rw : m.en}
            </button>
          ))}
        </div>
        {selected && (
          <div style={{ marginTop: 16, padding: '12px 16px', background: 'var(--green-50)', borderRadius: 10, fontSize: 14, color: 'var(--green-700)' }}>
            ✓ {lang === 'rw' ? 'Winjiye uyu munsi. Urashimishije.' : 'Checked in today. You\'re doing great.'}
          </div>
        )}
      </div>

      {/* Quick actions */}
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
            <div style={{ fontSize: 28, marginBottom: 8 }}>{q.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--gray-900)' }}>
              {q.label[lang]}
            </div>
          </button>
        ))}
      </div>

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
          <span style={{ fontSize: 40 }}>👩‍⚕️</span>
        </div>
      </div>
    </div>
  );
}
