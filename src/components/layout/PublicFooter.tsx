import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PublicFooter: React.FC = () => {
  const { t, settings, setLanguage } = useApp();
  const isEs = settings.language === 'es';

  return (
    <footer
      style={{
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid var(--border-subtle)',
        paddingTop: 'var(--space-16)',
        paddingBottom: 'var(--space-10)',
        marginTop: 'var(--space-16)'
      }}
    >
      <div className="container-max">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 'var(--space-8)',
            marginBottom: 'var(--space-12)'
          }}
        >
          {/* Brand Column */}
          <div style={{ maxWidth: '320px' }}>
            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.25rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                color: 'var(--text-primary)',
                textTransform: 'uppercase',
                marginBottom: 8
              }}
            >
              CASA MAREA
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
              {isEs
                ? 'Un refugio de lujo frente al Mar de Cortés en Baja California Sur. Arquitectura serena, bienestar consciente y excelencia gastronómica.'
                : 'A serene luxury coastal sanctuary on the Sea of Cortez in Baja California Sur. Restrained architecture, mindful wellness, and culinary precision.'}
            </p>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--surface-secondary)',
                fontSize: '0.6875rem',
                color: 'var(--text-secondary)',
                fontWeight: 600
              }}
            >
              <ShieldCheck size={13} color="var(--accent-primary)" />
              <span>Odoo 20 Architecture Prototype</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16, color: 'var(--text-primary)' }}>
              {isEs ? 'Explorar' : 'Explore'}
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.875rem' }}>
              <li><a href="#resort" style={{ color: 'var(--text-secondary)' }}>{t('navResort')}</a></li>
              <li><a href="#spa" style={{ color: 'var(--text-secondary)' }}>{t('navSpa')}</a></li>
              <li><a href="#dining" style={{ color: 'var(--text-secondary)' }}>{t('navDining')}</a></li>
              <li><Link to="/book-spa" style={{ color: 'var(--accent-primary)', fontWeight: 500 }}>{t('navBookSpa')}</Link></li>
              <li><a href="#ecosystem" style={{ color: 'var(--text-secondary)' }}>{t('navApproach')}</a></li>
            </ul>
          </div>

          {/* Operations Demo Links */}
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16, color: 'var(--text-primary)' }}>
              {isEs ? 'Módulos Operativos' : 'Operations Demo'}
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.875rem' }}>
              <li><Link to="/app" style={{ color: 'var(--text-secondary)' }}>{t('menuOverview')}</Link></li>
              <li><Link to="/app/pos" style={{ color: 'var(--text-secondary)' }}>{t('menuPos')}</Link></li>
              <li><Link to="/app/restaurant" style={{ color: 'var(--text-secondary)' }}>{t('menuRestaurant')}</Link></li>
              <li><Link to="/app/spa" style={{ color: 'var(--text-secondary)' }}>{t('menuSpa')}</Link></li>
              <li><Link to="/app/folios" style={{ color: 'var(--text-secondary)' }}>{t('menuFolios')}</Link></li>
              <li><Link to="/app/invoicing" style={{ color: 'var(--text-secondary)' }}>{t('menuInvoicing')}</Link></li>
            </ul>
          </div>

          {/* Contact & Demo Details */}
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16, color: 'var(--text-primary)' }}>
              {isEs ? 'Ubicación y Contacto' : 'Location & Contacts'}
            </h4>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <p style={{ margin: 0 }}>Km 28 Carretera Transpeninsular</p>
              <p style={{ margin: 0 }}>San José del Cabo, BCS 23405</p>
              <p style={{ margin: '12px 0 0', color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>
                * Fictional resort & demonstration contact data *
              </p>
              <div style={{ marginTop: 14 }}>
                <button
                  onClick={() => setLanguage(settings.language === 'en' ? 'es' : 'en')}
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <Globe size={13} />
                  <span>{settings.language === 'en' ? 'Cambiar a Español' : 'Switch to English'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: 'var(--space-6)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            fontSize: '0.75rem',
            color: 'var(--text-tertiary)'
          }}
        >
          <div>
            © 2026-2027 CASA MAREA Resort & Residences. All simulated operational rights reserved.
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <span>Privacy Policy (Simulated)</span>
            <span>Terms of Service (Simulated)</span>
            <span>Mexican CFDI 4.0 Demonstration</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
