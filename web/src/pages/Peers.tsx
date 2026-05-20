import React, { useState } from 'react';
import { Heart, ThumbsUp, ShieldCheck, Users, Send } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PEER_MESSAGES } from '../data/content';

interface Msg {
  id: string;
  author: string;
  time: string;
  text: string;
  reactions: { heart: number; pray: number };
  mine?: boolean;
}

// Generate a consistent anonymous display name from the author string
function anonName(author: string, lang: 'rw' | 'en') {
  const letter = author.replace('Mama ', '').charAt(0).toUpperCase();
  return lang === 'rw' ? `Mama ${letter}.` : `Mama ${letter}.`;
}

export default function Peers() {
  const { lang, nickname, t } = useApp();
  const [msgs, setMsgs] = useState<Msg[]>(PEER_MESSAGES);
  const [draft, setDraft] = useState('');
  const [reacted, setReacted] = useState<Record<string, boolean>>({});
  const [showHow, setShowHow] = useState(false);

  const send = () => {
    if (!draft.trim()) return;
    setMsgs(p => [{
      id: Date.now().toString(),
      author: `Mama ${nickname || 'A'}`,
      time: lang === 'rw' ? 'Nonaha' : 'Just now',
      text: draft.trim(),
      reactions: { heart: 0, pray: 0 },
      mine: true,
    }, ...p]);
    setDraft('');
  };

  const react = (id: string, type: 'heart' | 'pray') => {
    const k = `${id}_${type}`;
    if (reacted[k]) return;
    setReacted(p => ({ ...p, [k]: true }));
    setMsgs(p => p.map(m => m.id === id
      ? { ...m, reactions: { ...m.reactions, [type]: m.reactions[type] + 1 } }
      : m));
  };

  return (
    <div className="page" style={{ maxWidth: 700 }}>
      <h1 className="section-title">{t('peersTitle')}</h1>

      {/* Anonymity banner */}
      <div style={{
        background: 'var(--green-50)', border: '1px solid var(--green-100)',
        borderRadius: 12, padding: '14px 18px', marginBottom: 20,
        display: 'flex', alignItems: 'flex-start', gap: 12,
      }}>
        <ShieldCheck size={20} color="var(--green-700)" strokeWidth={1.8} style={{ flexShrink: 0, marginTop: 1 }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--green-700)', marginBottom: 2 }}>
            {lang === 'rw' ? 'Ibanga ryawe rirabitswe' : 'Your identity is protected'}
          </div>
          <div style={{ fontSize: 13, color: 'var(--gray-600)', lineHeight: 1.5 }}>
            {lang === 'rw'
              ? 'Nta mazina nyayo akoreshwa. Abanyamategeko nibo gusa bashobora kubona imyirondoro yawe mu bihe by\'impanuka.'
              : 'No real names are ever shown. Posts appear as "Mama K." with only a single letter. No one can identify you.'}
          </div>
          <button
            onClick={() => setShowHow(!showHow)}
            style={{ marginTop: 6, fontSize: 12, color: 'var(--green-700)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            {showHow
              ? (lang === 'rw' ? '▲ Funga' : '▲ Hide')
              : (lang === 'rw' ? '▼ Uko bikora' : '▼ How it works')}
          </button>

          {showHow && (
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                {
                  n: '1',
                  rw: 'Wandika ubutumwa kandi buri muntu muri akarere kawe ashobora kubuona.',
                  en: 'You write a message and everyone in your district circle can see it.',
                },
                {
                  n: '2',
                  rw: 'Izina ryawe ntirireba. Abandi babona "Mama K." gusa, inyuguti imwe.',
                  en: 'Your name is never shown. Others only see "Mama K." with just one letter.',
                },
                {
                  n: '3',
                  rw: 'Ushobora gushimira ubutumwa bw\'undi muntu ukoresheje imbuto zitangwa.',
                  en: 'You can support others by reacting to their messages.',
                },
                {
                  n: '4',
                  rw: 'Nta muntu ushobora kukuhamagara cyangwa kukumenya aho utuye.',
                  en: 'No one can contact you or find out who you are.',
                },
              ].map(step => (
                <div key={step.n} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%', background: 'var(--green-100)',
                    color: 'var(--green-700)', fontSize: 11, fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>{step.n}</div>
                  <span style={{ fontSize: 13, color: 'var(--gray-700)', lineHeight: 1.5 }}>
                    {lang === 'rw' ? step.rw : step.en}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Online status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <Users size={14} color="var(--gray-400)" strokeWidth={2} />
        <div style={{ width: 7, height: 7, borderRadius: 4, background: '#22c55e' }} />
        <span style={{ fontSize: 13, color: 'var(--gray-500)' }}>
          {lang === 'rw' ? '6 banyina muri akarere kawe' : '6 mamas in your district circle'}
        </span>
      </div>

      {/* Messages */}
      <div className="card" style={{ marginBottom: 16, overflow: 'hidden' }}>
        <div className="chat-feed">
          {msgs.map(m => (
            <div key={m.id} className={`chat-bubble-wrap${m.mine ? ' mine' : ''}`}>
              <div className="chat-avatar">{m.author.replace('Mama ', '').charAt(0)}</div>
              <div className="chat-body">
                <div className="chat-author">
                  {m.mine
                    ? (lang === 'rw' ? 'Wowe' : 'You')
                    : anonName(m.author, lang)}
                  {' · '}
                  <span style={{ fontWeight: 400 }}>{m.time}</span>
                </div>
                <div className="chat-text">{m.text}</div>
                {!m.mine && (
                  <div className="chat-reactions">
                    <button
                      className={`react-chip${reacted[`${m.id}_heart`] ? ' reacted' : ''}`}
                      onClick={() => react(m.id, 'heart')}
                    >
                      <Heart size={13} strokeWidth={2} /> {m.reactions.heart}
                    </button>
                    <button
                      className={`react-chip${reacted[`${m.id}_pray`] ? ' reacted' : ''}`}
                      onClick={() => react(m.id, 'pray')}
                    >
                      <ThumbsUp size={13} strokeWidth={2} /> {m.reactions.pray}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compose */}
      <div className="card card-pad">
        <div style={{ fontSize: 12, color: 'var(--gray-400)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
          <ShieldCheck size={12} strokeWidth={2} />
          {lang === 'rw'
            ? 'Ubutumwa bwawe buzagaragara nka "Mama ' + (nickname || 'A').charAt(0).toUpperCase() + '." gusa'
            : 'Your post will appear as "Mama ' + (nickname || 'A').charAt(0).toUpperCase() + '." only'}
        </div>
        <textarea
          className="input"
          style={{ minHeight: 80, marginBottom: 12 }}
          placeholder={t('share')}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          maxLength={300}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: 'var(--gray-400)' }}>{draft.length}/300</span>
          <button
            className="btn btn-primary btn-sm"
            disabled={!draft.trim()}
            onClick={send}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Send size={13} strokeWidth={2} />
            {t('post')}
          </button>
        </div>
      </div>
    </div>
  );
}
