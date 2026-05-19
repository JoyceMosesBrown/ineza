import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { Lang } from '../context/AppContext';
import { DISTRICTS } from '../data/content';

export default function Onboarding() {
  const { finish } = useApp();
  const [lang, setLang] = useState<Lang>('rw');
  const [step, setStep] = useState(0);
  const [nickname, setNickname] = useState('');
  const [district, setDistrict] = useState('');
  const [pin, setPin] = useState('');

  const handleFinish = () => {
    if (!nickname.trim() || !district || pin.length < 4) return;
    finish(nickname.trim(), district, lang);
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--green-50)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
          <div className="logo-icon" style={{ width: 44, height: 44, fontSize: 22 }}>in</div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--green-900)' }}>ineza</div>
            <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>your wellbeing companion</div>
          </div>
        </div>

        <div className="card">
          {step === 0 && (
            <div className="card-pad">
              <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--gray-900)', marginBottom: 6 }}>
                {lang === 'rw' ? 'Murakaza neza' : 'Welcome'}
              </h1>
              <p style={{ color: 'var(--gray-500)', fontSize: 14, marginBottom: 24 }}>
                {lang === 'rw'
                  ? 'Hitamo ururimi wakunze gukoreshaho'
                  : 'Choose your preferred language'}
              </p>

              <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
                {(['rw', 'en'] as Lang[]).map(l => (
                  <button key={l} onClick={() => setLang(l)}
                    style={{
                      flex: 1, padding: '16px', borderRadius: 12,
                      border: `2px solid ${lang === l ? 'var(--green-700)' : 'var(--border)'}`,
                      background: lang === l ? 'var(--green-50)' : 'var(--white)',
                      cursor: 'pointer', textAlign: 'center',
                    }}>
                    <div style={{ fontSize: 28, marginBottom: 6 }}>{l === 'rw' ? '🇷🇼' : '🇬🇧'}</div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: lang === l ? 'var(--green-700)' : 'var(--gray-700)' }}>
                      {l === 'rw' ? 'Kinyarwanda' : 'English'}
                    </div>
                  </button>
                ))}
              </div>
              <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={() => setStep(1)}>
                {lang === 'rw' ? 'Komeza →' : 'Continue →'}
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="card-pad">
              <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>
                {lang === 'rw' ? 'Aho uri wowe' : 'A little about you'}
              </h2>
              <p style={{ color: 'var(--gray-500)', fontSize: 14, marginBottom: 24 }}>
                {lang === 'rw' ? 'Nta mazina nyayo — ibanga ryawe rirabitswe.' : 'No real name needed — your privacy is protected.'}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label className="label">{lang === 'rw' ? 'Izina ryo mu rugo' : 'Nickname'}</label>
                  <input className="input" placeholder={lang === 'rw' ? 'urugero: Keza' : 'e.g. Grace'}
                    value={nickname} onChange={e => setNickname(e.target.value)} maxLength={20} />
                </div>
                <div>
                  <label className="label">{lang === 'rw' ? 'Akarere' : 'District'}</label>
                  <select className="input" value={district} onChange={e => setDistrict(e.target.value)}>
                    <option value="">{lang === 'rw' ? 'Hitamo akarere...' : 'Select district...'}</option>
                    {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">{lang === 'rw' ? 'PIN (imibare 4)' : 'PIN (4 digits)'}</label>
                  <input className="input" type="password" inputMode="numeric" maxLength={6}
                    placeholder="••••" value={pin} onChange={e => setPin(e.target.value.replace(/\D/g,''))} />
                  <p style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 4 }}>
                    {lang === 'rw' ? 'Ukoresheje PIN nk\'igifaransa.' : 'Used to protect your account.'}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 28 }}>
                <button className="btn btn-outline" onClick={() => setStep(0)}>←</button>
                <button className="btn btn-primary btn-lg" style={{ flex: 1 }}
                  onClick={handleFinish}
                  disabled={!nickname.trim() || !district || pin.length < 4}>
                  {lang === 'rw' ? 'Tangira' : "Get started"} →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Safe space note */}
        <div style={{ textAlign: 'center', marginTop: 20, display: 'flex', justifyContent: 'center', gap: 20 }}>
          {['🔒 ' + (lang === 'rw' ? 'Ibanga' : 'Private'),
            '🤝 ' + (lang === 'rw' ? 'Ubufasha' : 'Support'),
            '💛 ' + (lang === 'rw' ? 'Impuhwe' : 'Warmth')].map(item => (
            <span key={item} style={{ fontSize: 13, color: 'var(--gray-500)' }}>{item}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
