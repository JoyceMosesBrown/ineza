import React, { useState } from 'react';
import { Phone, Home, Calendar, MapPin, Stethoscope } from 'lucide-react';
import { useApp } from '../context/AppContext';
import HospitalMap from '../components/HospitalMap';

export default function CHW() {
  const { lang, district, t } = useApp();
  const [toast, setToast] = useState('');
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  return (
    <div className="page" style={{ maxWidth: 680 }}>
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          background: 'var(--green-700)', color: 'var(--white)', borderRadius: 10,
          padding: '12px 24px', fontSize: 14, fontWeight: 600, zIndex: 999,
          boxShadow: '0 4px 20px rgba(0,0,0,.2)',
        }}>{toast}</div>
      )}

      <h1 className="section-title">{t('chwTitle')}</h1>
      <p className="section-sub">
        {lang === 'rw' ? 'Umujyanama wawe w\'ubuzima ni hafi nawe igihe cyose' : 'Your community health worker is always here for you'}
      </p>

      {/* CHW profile card */}
      <div className="card" style={{ marginBottom: 20, overflow: 'hidden' }}>
        <div style={{ background: 'var(--green-700)', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 18 }}>
          <div className="chw-avatar" style={{ background: 'rgba(255,255,255,.15)', color: 'var(--white)' }}>
            <Stethoscope size={26} strokeWidth={1.6} />
          </div>
          <div style={{ flex: 1 }}>
            <div className="chw-name" style={{ color: 'var(--white)' }}>Chantal Uwamahoro</div>
            <div className="chw-role" style={{ color: 'rgba(255,255,255,.75)' }}>
              {lang === 'rw' ? 'Umujyanama w\'ubuzima' : 'Community Health Worker'} · {district || 'Gasabo'}
            </div>
          </div>
        </div>

        {/* Next visit */}
        <div style={{ padding: '14px 24px', background: 'var(--green-50)', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--border)' }}>
          <Calendar size={18} strokeWidth={1.8} color="var(--green-600)" />
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '.5px' }}>
              {lang === 'rw' ? 'Inshuro ikurikira' : 'Next visit'}
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--gray-900)', marginTop: 1 }}>
              {lang === 'rw' ? 'Kuwa Gatanu, 22 Gicurasi' : 'Thursday, 22 May'}
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div style={{ padding: '16px 24px', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <a href="tel:+250788000000"
            style={{
              display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px',
              borderRadius: 20, background: 'var(--green-700)', color: 'var(--white)',
              fontSize: 13, fontWeight: 700, textDecoration: 'none', border: 'none',
            }}>
            <Phone size={14} strokeWidth={2} /> {t('call')}
          </a>
          <button
            onClick={() => showToast(lang === 'rw' ? 'Ubusabe bwatumwe. Chantal azakugana vuba.' : 'Visit request sent. Chantal will contact you soon.')}
            style={{
              display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px',
              borderRadius: 20, background: 'var(--white)', color: 'var(--green-700)',
              fontSize: 13, fontWeight: 700, border: '1.5px solid var(--green-300)', cursor: 'pointer',
            }}>
            <Home size={14} strokeWidth={2} /> {t('visit')}
          </button>
        </div>
      </div>

      {/* Hospitals near you */}
      <div className="card card-pad">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <MapPin size={18} strokeWidth={1.8} color="var(--green-600)" />
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--gray-900)' }}>
              {lang === 'rw' ? 'Ibitaro biri hafi nawe' : 'Hospitals Near You'}
            </div>
            <div style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 1 }}>
              {lang === 'rw' ? 'Hitamo akarere kawe ubone ibitaro biri hafi' : 'Select your district to see nearby health facilities'}
            </div>
          </div>
        </div>
        <HospitalMap district={district || 'Gasabo'} lang={lang} />
      </div>
    </div>
  );
}
