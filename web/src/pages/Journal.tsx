import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { detectSentiment, pickAI, type AIResponse } from '../data/content';

// Web Speech API types
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function Journal() {
  const { lang, today, entries, saveEntry, t } = useApp();
  const [text, setText] = useState(today?.journalText ?? '');
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(() => {
    if (!today?.aiResponse) return null;
    try { return JSON.parse(today.aiResponse) as AIResponse; } catch { return null; }
  });
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [recording, setRecording] = useState(false);
  const recognitionRef = useRef<any>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const speechSupported = !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  const startVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const r = new SR();
    r.lang = lang === 'rw' ? 'rw-RW' : 'en-US';
    r.continuous = true;
    r.interimResults = true;
    r.onresult = (e: any) => {
      let transcript = '';
      for (let i = 0; i < e.results.length; i++) transcript += e.results[i][0].transcript;
      setText(transcript);
    };
    r.onend = () => setRecording(false);
    r.start();
    recognitionRef.current = r;
    setRecording(true);
  };

  const stopVoice = () => {
    recognitionRef.current?.stop();
    setRecording(false);
  };

  const handleSend = () => {
    if (!text.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const bucket = detectSentiment(text);
      const response = pickAI(bucket, lang);
      setAiResponse(response);
      saveEntry({ journalText: text.trim(), aiResponse: JSON.stringify(response) });
      setLoading(false);
    }, 1400);
  };

  const past = entries
    .filter(e => e.journalText && e.date !== new Date().toISOString().split('T')[0])
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 15);

  const fmt = (iso: string) => new Date(iso).toLocaleDateString(lang === 'rw' ? 'fr-RW' : 'en-GB', { day: 'numeric', month: 'short' });

  return (
    <div className="page" style={{ maxWidth: 780 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 className="section-title">{t('journal')}</h1>
          <p className="section-sub" style={{ marginBottom: 0 }}>
            {lang === 'rw' ? 'Andika ibyiyumvo byawe uko bishaka. Nta mategeko.' : 'Write freely. No rules, no judgment.'}
          </p>
        </div>
        <button className="btn btn-outline btn-sm" onClick={() => setShowHistory(!showHistory)}>
          {showHistory ? (lang === 'rw' ? '← Subira' : '← Back') : t('history')}
        </button>
      </div>

      {showHistory ? (
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', fontWeight: 700, fontSize: 14, color: 'var(--gray-500)' }}>
            {lang === 'rw' ? 'IBITABO BYA VUBA' : 'PAST ENTRIES'}
          </div>
          {past.length === 0 && (
            <div style={{ padding: 32, textAlign: 'center', color: 'var(--gray-500)' }}>
              {lang === 'rw' ? 'Nta makuru yabonetse.' : 'No past entries yet.'}
            </div>
          )}
          {past.map(e => (
            <div key={e.date} style={{ padding: '20px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-500)', marginBottom: 6 }}>{fmt(e.date)}</div>
              <p style={{ fontSize: 14, color: 'var(--gray-700)', lineHeight: 1.6, marginBottom: e.aiResponse ? 10 : 0 }}>
                {e.journalText}
              </p>
              {e.aiResponse && (() => {
                let parsed: AIResponse | null = null;
                try { parsed = JSON.parse(e.aiResponse); } catch { /* legacy string */ }
                return parsed ? (
                  <div style={{ background: 'var(--green-50)', borderRadius: 8, padding: '12px 14px', fontSize: 13, color: 'var(--green-700)', borderLeft: '3px solid var(--green-400)' }}>
                    <p style={{ margin: '0 0 8px 0', fontWeight: 600 }}>💛 {parsed.message}</p>
                    {parsed.steps.map(s => (
                      <div key={s.title} style={{ display: 'flex', gap: 8, marginTop: 6, alignItems: 'flex-start' }}>
                        <span>{s.icon}</span>
                        <span><strong>{s.title}:</strong> {s.detail}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ background: 'var(--green-50)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: 'var(--green-700)', borderLeft: '3px solid var(--green-400)' }}>
                    💛 {e.aiResponse}
                  </div>
                );
              })()}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Write area */}
          <div className="card card-pad">
            <label className="label" style={{ marginBottom: 10 }}>
              {lang === 'rw' ? 'Ibitabo byanjye wa none' : "Today's entry"}
            </label>
            <textarea
              ref={inputRef}
              className="input"
              placeholder={t('write')}
              value={text}
              onChange={e => setText(e.target.value)}
              style={{ minHeight: 180, marginBottom: 14 }}
              maxLength={3000}
            />

            {/* Voice hint */}
            {speechSupported && (
              <div style={{ fontSize: 12, color: 'var(--gray-500)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                🎙 {t('voiceHint')}
              </div>
            )}

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {speechSupported && (
                <button
                  className={`voice-btn${recording ? ' recording' : ''}`}
                  onClick={recording ? stopVoice : startVoice}
                >
                  🎙 {recording ? t('voiceStop') : t('voiceStart')}
                  {recording && <span style={{ fontSize: 12 }}> — {lang === 'rw' ? 'Vuga hano...' : 'Listening...'}</span>}
                </button>
              )}
              <button
                className="btn btn-primary"
                onClick={handleSend}
                disabled={!text.trim() || loading}
                style={{ marginLeft: 'auto' }}
              >
                {loading
                  ? (lang === 'rw' ? 'Gutegereza...' : 'Thinking...')
                  : t('send')} →
              </button>
            </div>

            <div style={{ marginTop: 8, fontSize: 12, color: 'var(--gray-400)', textAlign: 'right' }}>{text.length}/3000</div>
          </div>

          {/* AI Response */}
          {loading && (
            <div className="card card-pad" style={{ background: 'var(--green-50)' }}>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', color: 'var(--green-700)' }}>
                <span style={{ animation: 'pulse 1s infinite' }}>●</span>
                <span style={{ fontSize: 14 }}>{lang === 'rw' ? 'Inkuru yawe irimo gusobanurwa...' : 'Reading your entry...'}</span>
              </div>
            </div>
          )}

          {!loading && aiResponse && (
            <div className="ai-box">
              <div className="ai-box-header">
                <div className="ai-dot" />
                <span className="ai-label">{lang === 'rw' ? 'Inkuru y\'ineza' : 'A message for you'}</span>
              </div>
              <p className="ai-text">{aiResponse.message}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
                {aiResponse.steps.map(step => (
                  <div key={step.title} style={{
                    display: 'flex', gap: 14, alignItems: 'flex-start',
                    background: 'var(--white)', border: '1px solid var(--green-100)',
                    borderRadius: 12, padding: '14px 16px',
                  }}>
                    <span style={{ fontSize: 24, lineHeight: 1, flexShrink: 0 }}>{step.icon}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--gray-900)', marginBottom: 4 }}>{step.title}</div>
                      <div style={{ fontSize: 13, color: 'var(--gray-600)', lineHeight: 1.55 }}>{step.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
