import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const MSGS_RW = [
  { from: 'chw', text: 'Amakuru, Mama! Uzagiye neza uyu munsi?', time: '9:00' },
  { from: 'me', text: 'Neza gato. Nashakaga kukubwira.', time: '9:05' },
  { from: 'chw', text: 'Ndikuriho. Tuvugane.', time: '9:06' },
];
const MSGS_EN = [
  { from: 'chw', text: 'Hello Mama! How are you doing today?', time: '9:00' },
  { from: 'me', text: 'A little better. I wanted to tell you something.', time: '9:05' },
  { from: 'chw', text: "I'm here. Let's talk.", time: '9:06' },
];

export default function CHW() {
  const { lang, district, t } = useApp();
  const [tab, setTab] = useState<'about'|'messages'>('about');
  const msgs = lang === 'rw' ? MSGS_RW : MSGS_EN;

  const action = (label: string) => alert(label);

  return (
    <div className="page" style={{ maxWidth: 680 }}>
      <h1 className="section-title">{t('chwTitle')}</h1>
      <p className="section-sub">{lang === 'rw' ? 'Umujyanama wawe w\'ubuzima — hafi nawe igihe cyose' : 'Your community health worker — always here for you'}</p>

      {/* Profile card */}
      <div className="card" style={{ marginBottom: 16, overflow: 'hidden' }}>
        <div style={{ background: 'var(--green-700)', padding: '24px', display: 'flex', alignItems: 'center', gap: 20 }}>
          <div className="chw-avatar" style={{ background: 'rgba(255,255,255,.2)' }}>👩‍⚕️</div>
          <div>
            <div className="chw-name" style={{ color: 'var(--white)' }}>Chantal Uwamahoro</div>
            <div className="chw-role" style={{ color: 'rgba(255,255,255,.75)' }}>
              {lang === 'rw' ? 'Umujyanama w\'ubuzima' : 'Community Health Worker'} · {district || 'Gasabo'}
            </div>
            <div className="chw-actions">
              <button className="btn btn-sm" style={{ background: 'rgba(255,255,255,.2)', color: 'var(--white)', border: 'none' }} onClick={() => action('Calling CHW...')}>
                📞 {t('call')}
              </button>
              <button className="btn btn-sm" style={{ background: 'rgba(255,255,255,.2)', color: 'var(--white)', border: 'none' }} onClick={() => setTab('messages')}>
                💬 {t('message')}
              </button>
              <button className="btn btn-sm" style={{ background: 'rgba(255,255,255,.2)', color: 'var(--white)', border: 'none' }} onClick={() => action(lang==='rw' ? 'Ubusabe bwatumwe!' : 'Visit request sent!')}>
                🏠 {t('visit')}
              </button>
            </div>
          </div>
        </div>

        {/* Next visit */}
        <div style={{ padding: '16px 24px', background: 'var(--green-50)', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--border)' }}>
          <span style={{ fontSize: 22 }}>📅</span>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-500)' }}>{lang==='rw' ? 'INSHURO IKURIKIRA' : 'NEXT VISIT'}</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--gray-900)', marginTop: 2 }}>
              {lang==='rw' ? 'Kuwa Gatanu, 22 Gicurasi' : 'Thursday, 22 May'}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
          {(['about','messages'] as const).map(t2 => (
            <button key={t2}
              onClick={() => setTab(t2)}
              style={{
                flex: 1, padding: '14px', fontWeight: 600, fontSize: 14, border: 'none', cursor: 'pointer',
                background: tab===t2 ? 'var(--white)' : 'var(--gray-100)',
                color: tab===t2 ? 'var(--green-700)' : 'var(--gray-500)',
                borderBottom: tab===t2 ? '2px solid var(--green-700)' : '2px solid transparent',
                transition: 'all .15s',
              }}>
              {t2==='about' ? (lang==='rw' ? 'Amakuru' : 'About') : (lang==='rw' ? 'Ibiganiro' : 'Messages')}
            </button>
          ))}
        </div>

        <div style={{ padding: 24 }}>
          {tab === 'about' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { icon: '📍', text: district || 'Gasabo' },
                { icon: '📞', text: '+250 788 000 000' },
                { icon: '⭐', text: lang==='rw' ? 'Imyaka 5 y\'uburambe' : '5 years experience' },
              ].map((r,i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 18, width: 28 }}>{r.icon}</span>
                  <span style={{ fontSize: 14, color: 'var(--gray-700)' }}>{r.text}</span>
                </div>
              ))}
              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-500)', marginBottom: 10 }}>
                  {lang==='rw' ? 'AHO AKUGEZA' : 'HOW YOUR CHW HELPS'}
                </div>
                {[
                  lang==='rw' ? 'Inshuro buri kwezi azakugana inzu' : 'Monthly home visits',
                  lang==='rw' ? 'Akurikirana ubuzima bwawe' : 'Tracks your health trends',
                  lang==='rw' ? 'Agufasha kubona inkunga' : 'Connects you to health services',
                  lang==='rw' ? 'Atumanahana nawe igihe cyose' : 'Always available to message',
                ].map((b,i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: 3, background: 'var(--green-500)', flexShrink: 0 }} />
                    <span style={{ fontSize: 14, color: 'var(--gray-700)' }}>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {msgs.map((m,i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: m.from==='me' ? 'flex-end' : 'flex-start', gap: 3 }}>
                  <div style={{ fontSize: 11, color: 'var(--gray-400)', fontWeight: 600 }}>
                    {m.from==='chw' ? 'Chantal' : (lang==='rw' ? 'Wowe' : 'You')} · {m.time}
                  </div>
                  <div style={{
                    maxWidth: '75%', padding: '10px 16px', borderRadius: m.from==='me' ? '12px 12px 0 12px' : '12px 12px 12px 0',
                    background: m.from==='me' ? 'var(--green-700)' : 'var(--gray-100)',
                    color: m.from==='me' ? 'var(--white)' : 'var(--gray-900)',
                    fontSize: 14, lineHeight: 1.55,
                  }}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
