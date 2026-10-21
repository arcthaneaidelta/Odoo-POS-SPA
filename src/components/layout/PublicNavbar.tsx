import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Globe, ArrowRight, Menu, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PublicNavbar: React.FC = () => {
  const { t, settings, setLanguage } = useApp();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        transition: 'all var(--transition-normal)',
        backgroundColor: scrolled ? 'rgba(247, 245, 240, 0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border-subtle)' : '1px solid transparent',
        padding: scrolled ? '14px 0' : '22px 0'
      }}
    >
      <div className="container-max" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Brand */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '8px',
              backgroundColor: 'var(--accent-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: '0.875rem'
            }}
          >
            CM
          </div>
          <div>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.25rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                color: scrolled ? 'var(--text-primary)' : '#FFFFFF',
                textTransform: 'uppercase',
                textShadow: scrolled ? 'none' : '0 1px 4px rgba(0,0,0,0.4)',
                transition: 'color var(--transition-normal)'
              }}
            >
              CASA MAREA
            </span>
            <div
              style={{
                fontSize: '0.625rem',
                letterSpacing: '0.18em',
                color: scrolled ? 'var(--text-secondary)' : 'rgba(255,255,255,0.85)',
                textTransform: 'uppercase',
                lineHeight: 1
              }}
            >
              Baja California Sur
            </div>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div style={{ display: 'none', alignItems: 'center', gap: '28px' }} className="public-nav-links">
          <a
            href="#resort"
            style={{
              fontSize: '0.875rem',
              fontWeight: 500,
              color: scrolled ? 'var(--text-primary)' : '#FFFFFF',
              transition: 'color var(--transition-fast)'
            }}
          >
            {t('navResort')}
          </a>
          <a
            href="#spa"
            style={{
              fontSize: '0.875rem',
              fontWeight: 500,
              color: scrolled ? 'var(--text-primary)' : '#FFFFFF',
              transition: 'color var(--transition-fast)'
            }}
          >
            {t('navSpa')}
          </a>
          <a
            href="#dining"
            style={{
              fontSize: '0.875rem',
              fontWeight: 500,
              color: scrolled ? 'var(--text-primary)' : '#FFFFFF',
              transition: 'color var(--transition-fast)'
            }}
          >
            {t('navDining')}
          </a>
          <a
            href="#ecosystem"
            style={{
              fontSize: '0.875rem',
              fontWeight: 500,
              color: scrolled ? 'var(--text-primary)' : '#FFFFFF',
              transition: 'color var(--transition-fast)'
            }}
          >
            {t('navApproach')}
          </a>
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(settings.language === 'en' ? 'es' : 'en')}
            className="btn btn-sm"
            style={{
              color: scrolled ? 'var(--text-primary)' : '#FFFFFF',
              backgroundColor: scrolled ? 'var(--surface-secondary)' : 'rgba(0,0,0,0.25)',
              border: scrolled ? '1px solid var(--border-subtle)' : '1px solid rgba(255,255,255,0.3)',
              padding: '6px 10px',
              fontSize: '0.75rem',
              fontWeight: 600
            }}
            title="Switch Language EN / ES"
          >
            <Globe size={13} />
            <span>{settings.language.toUpperCase()}</span>
          </button>

          {/* Book Spa Public Link */}
          <Link
            to="/book-spa"
            className="btn btn-outline btn-sm book-spa-btn"
            style={{
              color: scrolled ? 'var(--text-primary)' : '#FFFFFF',
              borderColor: scrolled ? 'var(--border-subtle)' : 'rgba(255,255,255,0.5)',
              backgroundColor: scrolled ? '#FFFFFF' : 'rgba(255,255,255,0.15)',
              display: 'none'
            }}
          >
            {t('navBookSpa')}
          </Link>

          {/* Operations Demo CTA */}
          <button
            onClick={() => navigate('/app')}
            className="btn btn-primary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <span>{t('navExploreOps')}</span>
            <ArrowRight size={14} />
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn-icon mobile-hamburger"
            style={{ color: scrolled ? 'var(--text-primary)' : '#FFFFFF', display: 'flex' }}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid var(--border-subtle)',
            padding: '20px 24px',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            flexDirection: 'column',
            gap: 16
          }}
        >
          <a
            href="#resort"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-primary)' }}
          >
            {t('navResort')}
          </a>
          <a
            href="#spa"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-primary)' }}
          >
            {t('navSpa')}
          </a>
          <a
            href="#dining"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-primary)' }}
          >
            {t('navDining')}
          </a>
          <a
            href="#ecosystem"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-primary)' }}
          >
            {t('navApproach')}
          </a>
          <Link
            to="/book-spa"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--accent-primary)' }}
          >
            {t('navBookSpa')}
          </Link>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              navigate('/app');
            }}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: 8 }}
          >
            {t('navExploreOps')}
          </button>
        </div>
      )}

      <style>{`
        @media (min-width: 900px) {
          .public-nav-links { display: flex !important; }
          .book-spa-btn { display: inline-flex !important; }
          .mobile-hamburger { display: none !important; }
        }
      `}</style>
    </nav>
  );
};
