import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function Tracker() {
  const { lang, today, saveEntry, t } = useApp();
  const [sleep, setSleep] = useState(today?.sleep ?? 0);
  const [ate, setAte] = useState<'yes'|'little'|'no'|null>(today?.ate ?? null);
  const [cried, setCried] = useState<boolean|null>(today?.cried ?? null);
  const [bond, setBond] = useState(today?.babyBond ?? 0);
  const [anxiety, setAnxiety] = useState<'yes'|'sometimes'|'no'|null>(today?.anxiety ?? null);
  const [social, setSocial] = useState<boolean|null>(today?.social ?? null);
  const [saved, setSaved] = useState(false);

  const submit = () => {
    saveEntry({ sleep, ate, cried, babyBond: bond, anxiety, social });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const Q = ({ icon, question, children }: { icon: string; question: string; children: React.ReactNode }) => (
    <div style={{ padding: '20px 0', borderBottom: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <span style={{ fontSize: 22 }}>{icon}</span>
        <span style={{ fontWeight: 600, fontSize: 15, color: 'var(--gray-900)' }}>{question}</span>
      </div>
      {children}
    </div>
  );

  const bondEmojis = ['😞','😕','😐','🙂','💛'];

  return (
    <div className="page" style={{ maxWidth: 680 }}>
      <h1 className="section-title">{lang === 'rw' ? 'Gukurikirana' : 'Daily Tracker'}</h1>
      <p className="section-sub">
        {lang === 'rw' ? 'Ibisubizo by\'uyu munsi — bitwara munsi ya 2 min' : "Today's log — takes under 2 minutes"}
      </p>

      <div className="card card-pad">
        <Q icon="😴" question={t('sleepQ')}>
          <div className="sleep-bubbles">
            {[0,1,2,3,4,5,6,7,8].map(h => (
              <button key={h} className={`sleep-bubble${sleep===h?' selected':''}`} onClick={() => setSleep(h)}>
                {h === 8 ? '8+' : h}
              </button>
            ))}
          </div>
        </Q>

        <Q icon="🍽️" question={t('ateQ')}>
          <div className="option-group">
            {(['yes','little','no'] as const).map(o => (
              <button key={o} className={`opt-chip${ate===o?' selected':''}`} onClick={() => setAte(o)}>
                {o === 'yes' ? t('yes') : o === 'little' ? t('little') : t('no')}
              </button>
            ))}
          </div>
        </Q>

        <Q icon="😢" question={t('criedQ')}>
          <div className="option-group">
            {[true,false].map(v => (
              <button key={String(v)} className={`opt-chip${cried===v?' selected':''}`} onClick={() => setCried(v)}>
                {v ? t('yes') : t('no')}
              </button>
            ))}
          </div>
        </Q>

        <Q icon="👶" question={t('bondQ')}>
          <div style={{ display: 'flex', gap: 10 }}>
            {[1,2,3,4,5].map((v,i) => (
              <button key={v} onClick={() => setBond(v)}
                style={{
                  width: 52, height: 52, borderRadius: 12,
                  border: `2px solid ${bond===v ? 'var(--green-700)' : 'var(--border)'}`,
                  background: bond===v ? 'var(--green-50)' : 'var(--white)',
                  fontSize: 26, cursor: 'pointer', transition: 'all .15s',
                }}>
                {bondEmojis[i]}
              </button>
            ))}
          </div>
        </Q>

        <Q icon="😰" question={t('anxQ')}>
          <div className="option-group">
            {(['yes','sometimes','no'] as const).map(o => (
              <button key={o} className={`opt-chip${anxiety===o?' selected':''}`} onClick={() => setAnxiety(o)}>
                {o === 'yes' ? t('yes') : o === 'sometimes' ? t('sometimes') : t('no')}
              </button>
            ))}
          </div>
        </Q>

        <Q icon="🗣️" question={t('socialQ')}>
          <div className="option-group">
            {[true,false].map(v => (
              <button key={String(v)} className={`opt-chip${social===v?' selected':''}`} onClick={() => setSocial(v)}>
                {v ? t('yes') : t('no')}
              </button>
            ))}
          </div>
        </Q>

        <div style={{ paddingTop: 24 }}>
          {saved ? (
            <div style={{ background: 'var(--green-100)', color: 'var(--green-700)', borderRadius: 10, padding: '14px', textAlign: 'center', fontWeight: 700, fontSize: 15 }}>
              ✓ {lang === 'rw' ? 'Byabitswe!' : 'Saved!'}
            </div>
          ) : (
            <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={submit}>
              {lang === 'rw' ? 'Bika amakuru' : 'Save my log'} →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
