import React, { useState } from 'react';
import { useApp, DayEntry } from '../context/AppContext';

const MOOD_COLORS = ['','#FFCDD2','#FFE0B2','#FFF9C4','#B7E4C7','#D8F3DC'];

export default function Progress() {
  const { lang, entries, streak, nickname } = useApp();
  const [range, setRange] = useState<7|30>(7);

  const today = new Date();
  const days = Array.from({ length: range }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (range - 1 - i));
    return d.toISOString().split('T')[0];
  });

  const get = (date: string): DayEntry | undefined => entries.find(e => e.date === date);

  const moods = days.map(d => get(d)?.mood ?? 0);
  const sleeps = days.map(d => get(d)?.sleep ?? 0);
  const avgMood = moods.filter(Boolean).length
    ? (moods.filter(Boolean).reduce((a,b)=>a+b,0) / moods.filter(Boolean).length).toFixed(1) : '—';
  const avgSleep = sleeps.filter(Boolean).length
    ? (sleeps.filter(Boolean).reduce((a,b)=>a+b,0) / sleeps.filter(Boolean).length).toFixed(1) : '—';

  const dayLabel = (iso: string) => new Date(iso).toLocaleDateString(lang === 'rw' ? 'fr-RW' : 'en-GB', { weekday: 'short' }).slice(0,2);

  return (
    <div className="page">
      <h1 className="section-title">{lang === 'rw' ? 'Iterambere ryanjye' : 'My Progress'}</h1>
      <p className="section-sub">{lang === 'rw' ? 'Reba uburyo ubuzima bwawe buhinduka iminsi yose' : 'Track how your wellbeing changes over time'}</p>

      {/* Streak */}
      <div className="streak-banner" style={{ marginBottom: 24 }}>
        <div>
          <div className="streak-num">{streak} 🔥</div>
          <div className="streak-label">{lang === 'rw' ? 'iminsi yinjiye' : 'day streak'}</div>
        </div>
        <div className="streak-msg">
          {streak >= 7
            ? (lang === 'rw' ? `Wakoze iminsi ${streak} yinjiye — intwari!` : `${streak} days in a row — that takes real strength!`)
            : (lang === 'rw' ? 'Buri munsi winjiye ni intsinzi nini.' : 'Every day you show up is a victory.')}
        </div>
      </div>

      {/* Stats row */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="card stat-card">
          <div className="stat-label">{lang === 'rw' ? 'Imyumvire ubusanzwe' : 'Avg mood'}</div>
          <div className="stat-value">{avgMood}</div>
          <div className="stat-sub">{lang === 'rw' ? 'kuri 5' : 'out of 5'}</div>
        </div>
        <div className="card stat-card">
          <div className="stat-label">{lang === 'rw' ? 'Ibitotsi ubusanzwe' : 'Avg sleep'}</div>
          <div className="stat-value">{avgSleep !== '—' ? `${avgSleep}h` : '—'}</div>
        </div>
        <div className="card stat-card">
          <div className="stat-label">{lang === 'rw' ? 'Ibitabo byanditswe' : 'Journals written'}</div>
          <div className="stat-value">{days.filter(d => get(d)?.journalText).length}</div>
        </div>
      </div>

      {/* Range toggle */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {([7,30] as const).map(r => (
          <button key={r} className={`btn ${range===r ? 'btn-primary' : 'btn-outline'} btn-sm`} onClick={() => setRange(r)}>
            {r===7 ? (lang==='rw' ? 'Icyumweru' : '7 days') : (lang==='rw' ? 'Ukwezi' : '30 days')}
          </button>
        ))}
      </div>

      {/* Mood chart */}
      <div className="card card-pad" style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20, color: 'var(--gray-900)' }}>
          {lang === 'rw' ? 'Imigenzo y\'ibihe' : 'Mood over time'}
        </div>
        <div className="bar-chart">
          {days.map(d => {
            const mood = get(d)?.mood ?? 0;
            const h = mood ? (mood/5)*90 : 4;
            return (
              <div key={d} className="bar-col">
                <div style={{ height: 90, display: 'flex', alignItems: 'flex-end' }}>
                  <div className="bar" style={{ height: h, background: mood ? MOOD_COLORS[mood] : 'var(--gray-200)', border: mood ? `1px solid ${MOOD_COLORS[mood]}` : '1px solid var(--border)' }} />
                </div>
                <span className="bar-label">{dayLabel(d)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sleep chart */}
      <div className="card card-pad">
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20, color: 'var(--gray-900)' }}>
          {lang === 'rw' ? 'Ibitotsi by\'ibihe' : 'Sleep over time'}
        </div>
        <div className="bar-chart">
          {days.map(d => {
            const s = get(d)?.sleep ?? 0;
            const h = s ? (s/10)*90 : 4;
            const col = s>=6 ? '#D8F3DC' : s>=4 ? '#FFF9C4' : s>0 ? '#FFE0B2' : 'var(--gray-200)';
            return (
              <div key={d} className="bar-col">
                <div style={{ height: 90, display: 'flex', alignItems: 'flex-end' }}>
                  <div className="bar" style={{ height: h, background: col }} />
                </div>
                <span className="bar-label">{dayLabel(d)}</span>
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 14, flexWrap: 'wrap' }}>
          {[['#D8F3DC', lang==='rw' ? '6h+' : '6h+'],['#FFF9C4', '4–5h'],['#FFE0B2', '<4h']].map(([c,l]) => (
            <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--gray-500)' }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: c, display: 'inline-block' }} />{l}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
