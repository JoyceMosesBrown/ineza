import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PEER_MESSAGES } from '../data/content';

interface Msg { id: string; author: string; time: string; text: string; reactions: { heart: number; pray: number }; mine?: boolean; }

export default function Peers() {
  const { lang, nickname, t } = useApp();
  const [msgs, setMsgs] = useState<Msg[]>(PEER_MESSAGES);
  const [draft, setDraft] = useState('');
  const [reacted, setReacted] = useState<Record<string,boolean>>({});

  const send = () => {
    if (!draft.trim()) return;
    setMsgs(p => [{ id: Date.now().toString(), author: `Mama ${nickname}`, time: lang==='rw' ? 'Nonaha' : 'Just now', text: draft.trim(), reactions: { heart: 0, pray: 0 }, mine: true }, ...p]);
    setDraft('');
  };

  const react = (id: string, type: 'heart'|'pray') => {
    const k = `${id}_${type}`;
    if (reacted[k]) return;
    setReacted(p => ({ ...p, [k]: true }));
    setMsgs(p => p.map(m => m.id===id ? { ...m, reactions: { ...m.reactions, [type]: m.reactions[type]+1 } } : m));
  };

  return (
    <div className="page" style={{ maxWidth: 700 }}>
      <h1 className="section-title">{t('peersTitle')}</h1>
      <p className="section-sub">{t('circleNote')}</p>

      {/* Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <div style={{ width: 8, height: 8, borderRadius: 4, background: '#22c55e' }} />
        <span style={{ fontSize: 13, color: 'var(--gray-500)' }}>
          {lang === 'rw' ? '6 banyina muri kaminuza yawe' : '6 mamas in your district circle'}
        </span>
      </div>

      {/* Messages */}
      <div className="card" style={{ marginBottom: 16, overflow: 'hidden' }}>
        <div className="chat-feed">
          {msgs.map(m => (
            <div key={m.id} className={`chat-bubble-wrap${m.mine ? ' mine' : ''}`}>
              <div className="chat-avatar">{m.author.slice(5, 6)}</div>
              <div className="chat-body">
                <div className="chat-author">
                  {m.author} · <span style={{ fontWeight: 400 }}>{m.time}</span>
                </div>
                <div className="chat-text">{m.text}</div>
                {!m.mine && (
                  <div className="chat-reactions">
                    <button className={`react-chip${reacted[`${m.id}_heart`] ? ' reacted' : ''}`} onClick={() => react(m.id, 'heart')}>
                      💛 {m.reactions.heart}
                    </button>
                    <button className={`react-chip${reacted[`${m.id}_pray`] ? ' reacted' : ''}`} onClick={() => react(m.id, 'pray')}>
                      🙏 {m.reactions.pray}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="card card-pad">
        <textarea className="input" style={{ minHeight: 80, marginBottom: 12 }}
          placeholder={t('share')} value={draft} onChange={e => setDraft(e.target.value)} maxLength={300} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: 'var(--gray-400)' }}>{draft.length}/300</span>
          <button className="btn btn-primary" disabled={!draft.trim()} onClick={send}>
            {t('post')} →
          </button>
        </div>
      </div>
    </div>
  );
}
