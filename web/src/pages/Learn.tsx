import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { ARTICLES } from '../data/content';

function useSpeech() {
  const [speaking, setSpeaking] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const uttRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = (text: string, lang: string, id: string) => {
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);

    // Pick best available voice for the language
    const voices = window.speechSynthesis.getVoices();
    const preferred =
      voices.find(v => v.lang.startsWith(lang === 'rw' ? 'fr' : 'en') && v.localService) ||
      voices.find(v => v.lang.startsWith(lang === 'rw' ? 'fr' : 'en')) ||
      voices[0];
    if (preferred) utt.voice = preferred;

    utt.lang = lang === 'rw' ? 'fr-FR' : 'en-US'; // fr fallback — closest to Kinyarwanda cadence
    utt.rate = 0.88;
    utt.pitch = 1;

    utt.onstart = () => { setSpeaking(true); setCurrentId(id); };
    utt.onend = () => { setSpeaking(false); setCurrentId(null); };
    utt.onerror = () => { setSpeaking(false); setCurrentId(null); };

    uttRef.current = utt;
    window.speechSynthesis.speak(utt);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setCurrentId(null);
  };

  useEffect(() => () => { window.speechSynthesis.cancel(); }, []);

  return { speak, stop, speaking, currentId };
}

export default function Learn() {
  const { lang } = useApp();
  const [open, setOpen] = useState<string | null>(null);
  const { speak, stop, speaking, currentId } = useSpeech();
  const article = ARTICLES.find(a => a.id === open);

  const handleListen = (e: React.MouseEvent, id: string, text: string) => {
    e.stopPropagation();
    if (speaking && currentId === id) { stop(); return; }
    speak(text, lang, id);
  };

  const handleClose = () => {
    stop();
    setOpen(null);
  };

  return (
    <div className="page" style={{ maxWidth: 780 }}>
      <h1 className="section-title">{lang === 'rw' ? 'Kwiga' : 'Learn'}</h1>
      <p className="section-sub">
        {lang === 'rw'
          ? 'Amakuru yoroheje akubafasha gusobanukirwa ubuzima bwawe — iminota 2 buri nyandiko'
          : 'Simple knowledge to support your wellbeing — 2 minutes per article'}
      </p>

      {/* Listening hint banner */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, background: 'var(--green-50)',
        border: '1px solid var(--green-100)', borderRadius: 10, padding: '12px 16px', marginBottom: 20,
      }}>
        <span style={{ fontSize: 20 }}>🔊</span>
        <span style={{ fontSize: 13, color: 'var(--green-700)' }}>
          {lang === 'rw'
            ? 'Ntabwo ushobora gusoma? Kanda "Wumva" kugira ngo nyandiko isome ubwayo.'
            : "Can't read? Click \"Listen\" on any article and it will be read aloud for you."}
        </span>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        {ARTICLES.map((a, i) => {
          const isPlaying = speaking && currentId === a.id;
          const body = lang === 'rw' ? a.bodyRw : a.bodyEn;
          const title = lang === 'rw' ? a.titleRw : a.titleEn;

          return (
            <div key={a.id}
              className="article-card"
              style={{ borderBottom: i < ARTICLES.length - 1 ? '1px solid var(--border)' : 'none' }}
              onClick={() => setOpen(a.id)}
            >
              <div className="article-icon" style={{ background: a.color }}>{a.icon}</div>

              <div className="article-body">
                <div className="article-title">{title}</div>
                <div className="article-summary">
                  {lang === 'rw' ? a.summaryRw : a.summaryEn}
                </div>
                <div className="article-meta" style={{ gap: 8 }}>
                  <span className="badge badge-green">⏱ 2 min</span>

                  {/* Listen button */}
                  <button
                    className={`badge${isPlaying ? ' badge-amber' : ' badge-gray'}`}
                    style={{ cursor: 'pointer', border: 'none', display: 'flex', alignItems: 'center', gap: 4 }}
                    onClick={e => handleListen(e, a.id, `${title}. ${body}`)}
                  >
                    {isPlaying ? '⏸ ' : '🔊 '}
                    {isPlaying
                      ? (lang === 'rw' ? 'Hagarika' : 'Stop')
                      : (lang === 'rw' ? 'Wumva' : 'Listen')}
                  </button>
                </div>
              </div>

              <span style={{ color: 'var(--gray-400)', fontSize: 20, marginLeft: 8 }}>›</span>
            </div>
          );
        })}
      </div>

      {/* Article Modal */}
      {open && article && (
        <div className="modal-overlay" onClick={handleClose}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{
                width: 48, height: 48, borderRadius: 12, background: article.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0,
              }}>
                {article.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 16 }}>
                  {lang === 'rw' ? article.titleRw : article.titleEn}
                </div>
                <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 2 }}>⏱ 2 min read</div>
              </div>

              {/* Listen button in modal */}
              <button
                onClick={e => handleListen(
                  e, article.id,
                  `${lang === 'rw' ? article.titleRw : article.titleEn}. ${lang === 'rw' ? article.bodyRw : article.bodyEn}`
                )}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
                  background: speaking && currentId === article.id ? 'var(--amber-light)' : 'var(--green-50)',
                  color: speaking && currentId === article.id ? '#B45309' : 'var(--green-700)',
                  fontWeight: 600, fontSize: 13,
                  animation: speaking && currentId === article.id ? 'pulse 1.2s infinite' : 'none',
                }}
              >
                {speaking && currentId === article.id ? '⏸' : '🔊'}
                {speaking && currentId === article.id
                  ? (lang === 'rw' ? 'Hagarika' : 'Stop')
                  : (lang === 'rw' ? 'Wumva' : 'Listen')}
              </button>

              <button className="modal-close" onClick={handleClose}>✕</button>
            </div>

            {/* Reading progress indicator */}
            {speaking && currentId === article.id && (
              <div style={{
                padding: '10px 28px', background: 'var(--green-50)',
                borderBottom: '1px solid var(--green-100)',
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <div style={{ display: 'flex', gap: 4 }}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{
                      width: 6, height: 6, borderRadius: 3,
                      background: 'var(--green-500)',
                      animation: `pulse ${0.6 + i * 0.2}s infinite`,
                    }} />
                  ))}
                </div>
                <span style={{ fontSize: 13, color: 'var(--green-700)', fontWeight: 500 }}>
                  {lang === 'rw' ? 'Irimo gusomwa...' : 'Reading aloud...'}
                </span>
              </div>
            )}

            <div className="modal-body" style={{ whiteSpace: 'pre-line' }}>
              {lang === 'rw' ? article.bodyRw : article.bodyEn}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
