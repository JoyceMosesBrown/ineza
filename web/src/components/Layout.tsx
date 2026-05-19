import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const NAV = [
  { to: '/',         icon: '⊞', rw: 'Ahabanza',         en: 'Home' },
  { to: '/journal',  icon: '✏', rw: 'Ibitabo byanjye',  en: 'My Journal' },
  { to: '/tracker',  icon: '◎', rw: 'Gukurikirana',     en: 'Daily Tracker' },
  { to: '/progress', icon: '↗', rw: 'Iterambere',       en: 'My Progress' },
  { to: '/learn',    icon: '📚', rw: 'Kwiga',            en: 'Learn' },
  { to: '/peers',    icon: '◉', rw: 'Inzira yacu',      en: 'Our Circle' },
  { to: '/chw',      icon: '♥', rw: 'Umujyanama wanjye',en: 'My CHW' },
];

const PAGE_TITLES: Record<string, { rw: string; en: string }> = {
  '/':         { rw: 'Ahabanza',          en: 'Home' },
  '/journal':  { rw: 'Ibitabo byanjye',   en: 'My Journal' },
  '/tracker':  { rw: 'Gukurikirana',      en: 'Daily Tracker' },
  '/progress': { rw: 'Iterambere ryanjye',en: 'My Progress' },
  '/learn':    { rw: 'Kwiga',             en: 'Learn' },
  '/peers':    { rw: 'Inzira Yacu',       en: 'Our Circle' },
  '/chw':      { rw: 'Umujyanama wanjye', en: 'My CHW' },
};

function SOSAlert({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 440 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header" style={{ borderColor: '#FEE2E2' }}>
          <div style={{ fontSize: 32 }}>🆘</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 17 }}>Ndakeneye ubufasha</div>
            <div style={{ fontSize: 13, color: 'var(--gray-500)' }}>I need help</div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--gray-900)', marginBottom: 12 }}>
            Ubutumwa bwoherejwe kuri umujyanama wawe.
          </p>
          <p style={{ color: 'var(--gray-600)', marginBottom: 20 }}>
            Your message has been sent to your CHW. Help is on the way.
          </p>
          <div style={{ background: 'var(--green-50)', border: '1px solid var(--green-100)', borderRadius: 12, padding: '16px 20px', fontSize: 15, fontStyle: 'italic', color: 'var(--green-700)' }}>
            "Nturi wenyine. Ubufasha buragera. Uri intwari."<br />
            <span style={{ fontSize: 13, fontStyle: 'normal', color: 'var(--gray-500)' }}>You are not alone. Help is coming. You are brave.</span>
          </div>
          <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
            <a href="tel:+250788000000" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>📞 Call CHW</a>
            <button className="btn btn-outline" style={{ flex: 1 }} onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const { lang, setLang, t, nickname, logout } = useApp();
  const [sos, setSos] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const path = window.location.pathname;
  const pageTitle = PAGE_TITLES[path]?.[lang] ?? 'Ineza';

  const closeSidebar = () => setMobileOpen(false);

  return (
    <div className="app-shell">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar} />
      )}

      {/* Sidebar */}
      <aside className={`sidebar${mobileOpen ? ' open' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-icon">in</div>
          <div>
            <div className="logo-text">ineza</div>
            <div className="logo-sub">wellbeing companion</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
              onClick={closeSidebar}
            >
              <span style={{ fontSize: 16, width: 18, textAlign: 'center' }}>{item.icon}</span>
              {lang === 'rw' ? item.rw : item.en}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 8 }}>
            {t('language')}
          </div>
          <div className="lang-toggle" style={{ marginBottom: 14 }}>
            <button className={`lang-btn${lang === 'rw' ? ' active' : ''}`} onClick={() => setLang('rw')}>🇷🇼 Kinyarwanda</button>
            <button className={`lang-btn${lang === 'en' ? ' active' : ''}`} onClick={() => setLang('en')}>🇬🇧 English</button>
          </div>

          <button
            onClick={logout}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              width: '100%', padding: '9px 12px', borderRadius: 8,
              border: '1.5px solid var(--border)', background: 'var(--white)',
              color: 'var(--gray-500)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              transition: 'all .15s',
            }}
            onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.background = '#FEF2F2'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#FCA5A5'; (e.currentTarget as HTMLButtonElement).style.color = '#DC2626'; }}
            onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--white)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--gray-500)'; }}
          >
            <span>⎋</span>
            {lang === 'rw' ? 'Sohoka' : 'Log out'}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="main-content">
        <header className="topbar">
          {/* Hamburger — shown on mobile only via CSS */}
          <button
            className="hamburger-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Open menu"
          >
            <span /><span /><span />
          </button>

          <span className="topbar-title">{pageTitle}</span>

          <div className="topbar-right">
            {nickname && (
              <span className="topbar-nickname">
                👋 {nickname}
              </span>
            )}
            <div className="topbar-lang">
              <button
                onClick={() => setLang('rw')}
                className={`topbar-lang-btn${lang === 'rw' ? ' active' : ''}`}
              >🇷🇼 RW</button>
              <button
                onClick={() => setLang('en')}
                className={`topbar-lang-btn${lang === 'en' ? ' active' : ''}`}
              >🇬🇧 EN</button>
            </div>
            <button className="sos-btn" onClick={() => setSos(true)}>
              🆘 <span className="sos-text">{t('sos')}</span>
            </button>
          </div>
        </header>

        <main>{children}</main>
      </div>

      {sos && <SOSAlert onClose={() => setSos(false)} />}
    </div>
  );
}
