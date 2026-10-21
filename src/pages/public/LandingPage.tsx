import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  Utensils,
  Building,
  CreditCard,
  ShieldCheck,
  ChevronDown,
  CheckCircle2
} from 'lucide-react';
import { PublicNavbar } from '../../components/layout/PublicNavbar';
import { PublicFooter } from '../../components/layout/PublicFooter';
import { OperationalEcosystemMap } from '../../components/diagrams/OperationalEcosystemMap';
import { useApp } from '../../context/AppContext';

export const LandingPage: React.FC = () => {
  const { t, settings, formatPrice } = useApp();
  const navigate = useNavigate();
  const isEs = settings.language === 'es';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)' }}>
      <PublicNavbar />

      {/* Hero Section */}
      <section
        id="resort"
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          paddingTop: '80px',
          paddingBottom: '60px'
        }}
      >
        {/* Full-bleed Coastal Photograph with warm overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url('/assets/hero_resort.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.82) saturate(1.05)'
          }}
        />

        {/* Ambient Gradient Overlay for Readability */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(41, 45, 44, 0.45) 0%, rgba(41, 45, 44, 0.25) 45%, rgba(41, 45, 44, 0.75) 100%)'
          }}
        />

        {/* Hero Content Container */}
        <div
          className="container-max"
          style={{
            position: 'relative',
            zIndex: 10,
            textAlign: 'center',
            maxWidth: '860px',
            color: '#FFFFFF'
          }}
        >
          {/* Subtle Contextual Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'rgba(255, 255, 255, 0.16)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              fontSize: '0.75rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: 24,
              fontWeight: 600
            }}
          >
            {t('heroSubtitle')}
          </div>

          {/* Editorial Hero Heading */}
          <h1
            style={{
              fontFamily: 'var(--font-editorial)',
              fontSize: 'clamp(2.75rem, 5.5vw, 4.25rem)',
              fontWeight: 400,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              marginBottom: 24,
              textShadow: '0 2px 12px rgba(0, 0, 0, 0.35)'
            }}
          >
            {t('heroTitleLine1')}
            <br />
            <span style={{ fontStyle: 'italic', fontWeight: 500, color: '#EDE7DD' }}>
              {t('heroTitleLine2')}
            </span>
          </h1>

          {/* Supporting Description */}
          <p
            style={{
              fontSize: 'clamp(1rem, 1.3vw, 1.1875rem)',
              color: 'rgba(255, 255, 255, 0.92)',
              maxWidth: '680px',
              margin: '0 auto 36px',
              lineHeight: 1.65,
              textShadow: '0 1px 4px rgba(0, 0, 0, 0.4)'
            }}
          >
            {t('heroDescription')}
          </p>

          {/* Action CTAs */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 16
            }}
          >
            <button
              onClick={() => navigate('/app')}
              className="btn btn-primary btn-lg"
              style={{
                backgroundColor: 'var(--accent-primary)',
                borderColor: 'var(--accent-primary)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8
              }}
            >
              <span>{t('heroCtaSecondary')}</span>
              <ArrowRight size={18} />
            </button>

            <a
              href="#ecosystem"
              className="btn btn-lg"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.16)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.35)',
                color: '#FFFFFF'
              }}
            >
              {t('heroCtaPrimary')}
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <a
          href="#experiences"
          style={{
            position: 'absolute',
            bottom: 28,
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'rgba(255, 255, 255, 0.8)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            fontSize: '0.6875rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            gap: 4
          }}
        >
          <span>Explore</span>
          <ChevronDown size={16} />
        </a>
      </section>

      {/* Experience Introduction - 4 Editorial Cards */}
      <section id="experiences" style={{ padding: 'var(--space-16) 0' }}>
        <div className="container-max">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto var(--space-12)' }}>
            <span
              style={{
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                color: 'var(--accent-primary)',
                fontWeight: 600,
                display: 'block',
                marginBottom: 8
              }}
            >
              CASA MAREA ECOSYSTEM
            </span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', marginBottom: 12 }}>
              {t('ecosystemHeading')}
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
              {t('ecosystemSubheading')}
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 'var(--space-6)'
            }}
          >
            {/* Card 1: Dining */}
            <div
              className="card"
              onClick={() => navigate('/app/restaurant')}
              style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--accent-primary-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16
                }}
              >
                <Utensils size={22} color="var(--accent-primary)" />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: 8 }}>{t('diningCardTitle')}</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, flex: 1, marginBottom: 16 }}>
                {t('diningCardDesc')}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem', fontWeight: 600, color: 'var(--accent-primary)' }}>
                <span>{isEs ? 'Ver TPV y Plano' : 'View POS & Floor Plan'}</span>
                <ArrowRight size={14} />
              </div>
            </div>

            {/* Card 2: Spa */}
            <div
              className="card"
              onClick={() => navigate('/app/spa')}
              style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--accent-warm-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16
                }}
              >
                <Sparkles size={22} color="var(--accent-warm)" />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: 8 }}>{t('spaCardTitle')}</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, flex: 1, marginBottom: 16 }}>
                {t('spaCardDesc')}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem', fontWeight: 600, color: 'var(--accent-primary)' }}>
                <span>{isEs ? 'Explorar Agenda de Spa' : 'Explore Spa Calendar'}</span>
                <ArrowRight size={14} />
              </div>
            </div>

            {/* Card 3: Guest & PMS */}
            <div
              className="card"
              onClick={() => navigate('/app/folios')}
              style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--state-success-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16
                }}
              >
                <Building size={22} color="var(--state-success)" />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: 8 }}>{t('guestCardTitle')}</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, flex: 1, marginBottom: 16 }}>
                {t('guestCardDesc')}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem', fontWeight: 600, color: 'var(--accent-primary)' }}>
                <span>{isEs ? 'Ver Sincronización PMS' : 'Inspect Folio Sync'}</span>
                <ArrowRight size={14} />
              </div>
            </div>

            {/* Card 4: Payments & CFDI */}
            <div
              className="card"
              onClick={() => navigate('/app/invoicing')}
              style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--surface-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16
                }}
              >
                <CreditCard size={22} color="var(--text-primary)" />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: 8 }}>{t('boutiqueCardTitle')}</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, flex: 1, marginBottom: 16 }}>
                {t('boutiqueCardDesc')}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem', fontWeight: 600, color: 'var(--accent-primary)' }}>
                <span>{isEs ? 'Ver Facturación CFDI' : 'Inspect CFDI Invoicing'}</span>
                <ArrowRight size={14} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Operational Ecosystem Interactive Diagram Section */}
      <section id="ecosystem" style={{ padding: 'var(--space-16) 0', backgroundColor: 'var(--surface-primary)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container-max">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto var(--space-8)' }}>
            <span
              style={{
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                color: 'var(--accent-primary)',
                fontWeight: 600,
                display: 'block',
                marginBottom: 8
              }}
            >
              UNIFIED OPERATIONS ARCHITECTURE
            </span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.375rem)', marginBottom: 12 }}>
              {isEs ? 'El Ecosistema Operativo de Casa Marea' : 'The Connected Resort Ecosystem'}
            </h2>
            <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>
              {isEs
                ? 'Haga clic en cualquiera de los nodos para explorar la arquitectura técnica de Odoo propuesta y la pantalla correspondiente.'
                : 'Select any operational node below to inspect how data seamlessly flows between outlets, spa, guest folios, and Mexican accounting.'}
            </p>
          </div>

          <OperationalEcosystemMap />
        </div>
      </section>

      {/* Spa Preview Split Layout (PRD Section 5.4) */}
      <section id="spa" style={{ padding: 'var(--space-16) 0' }}>
        <div className="container-max">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 'var(--space-10)',
              alignItems: 'center'
            }}
          >
            {/* Left: Spa Image */}
            <div style={{ position: 'relative', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
              <img
                src="/assets/spa_wellness.jpg"
                alt="Casa Marea Spa Sanctuary"
                style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: 16,
                  left: 16,
                  backgroundColor: 'rgba(255, 255, 255, 0.92)',
                  backdropFilter: 'blur(8px)',
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)'
                }}
              >
                Travertine Treatment Sanctuary · Cabina con Vista al Mar
              </div>
            </div>

            {/* Right: Copy & Treatment Cards */}
            <div>
              <span
                style={{
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  color: 'var(--accent-primary)',
                  fontWeight: 600,
                  display: 'block',
                  marginBottom: 8
                }}
              >
                SPA & WELLNESS LOGIC
              </span>
              <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.375rem)', marginBottom: 14 }}>
                {isEs ? 'Bienestar, sin fricción operativa.' : 'Wellness, without the friction.'}
              </h2>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 24 }}>
                {isEs
                  ? 'Desde la disponibilidad en tiempo real de cabinas hasta la asignación de terapeutas, tiempos de sanitización y cobro automático del saldo restante en el TPV.'
                  : 'From treatment availability and room scheduling to therapist assignment, mandatory cleanup buffers, and seamless balance routing into POS checkout.'}
              </p>

              {/* Sample Treatment Showcase */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                <div
                  style={{
                    padding: '12px 16px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Signature Relaxation Massage</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>60 min · Swedish long-stroke technique with sea salt compress</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, color: 'var(--accent-primary)', fontSize: '0.9375rem' }}>{formatPrice(1850)}</div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>50% deposit required</div>
                  </div>
                </div>

                <div
                  style={{
                    padding: '12px 16px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Desert Stone Basalt Massage</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>90 min · Heated volcanic river stone release</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, color: 'var(--accent-primary)', fontSize: '0.9375rem' }}>{formatPrice(2400)}</div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>Elena Ruiz / Mateo Solís</div>
                  </div>
                </div>
              </div>

              {/* CTAs: PRD 5.4 requirements */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                <button onClick={() => navigate('/book-spa')} className="btn btn-warm">
                  <span>{isEs ? 'Reservar Tratamiento (Público)' : 'Book a Treatment (Public Flow)'}</span>
                  <ArrowRight size={16} />
                </button>
                <button onClick={() => navigate('/app/spa')} className="btn btn-secondary">
                  <span>{isEs ? 'Ver Agenda Operativa' : 'Explore Spa Operations'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dining & Pool Service Preview (PRD 5.5) */}
      <section id="dining" style={{ padding: 'var(--space-16) 0', backgroundColor: 'var(--surface-secondary)' }}>
        <div className="container-max">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto var(--space-12)' }}>
            <span
              style={{
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                color: 'var(--accent-primary)',
                fontWeight: 600,
                display: 'block',
                marginBottom: 8
              }}
            >
              POINT OF SALE OUTLETS
            </span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.375rem)', marginBottom: 12 }}>
              {isEs ? 'Servicio de Restaurante, Bar y Playa Conectado' : 'Connected Dining, Bar & Poolside Service'}
            </h2>
            <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>
              {isEs
                ? 'Cuentas divididas al instante, órdenes enviadas a cocina y cargos directos al folio del huésped sin errores de transcripción.'
                : 'Instant table check management, split billing, kitchen dispatching, and verified in-house guest room charging.'}
            </p>
          </div>

          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-8)',
              boxShadow: 'var(--shadow-md)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 'var(--space-8)',
              alignItems: 'center'
            }}
          >
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 8px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--accent-primary-light)', color: 'var(--accent-primary)', fontSize: '0.75rem', fontWeight: 600, marginBottom: 12 }}>
                Live POS Table Preview
              </div>
              <h3 style={{ fontSize: '1.375rem', marginBottom: 10 }}>
                Table 01 — Terrace Ocean View
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
                Elena Ruiz is serving Sofia Alatorre (Room 214). Order items have been dispatched to the wood-fired kitchen and agave bar stations.
              </p>

              <div style={{ backgroundColor: 'var(--bg-main)', padding: '14px', borderRadius: 'var(--radius-md)', marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: 6 }}>
                  <span>2x Baja Fish Tacos</span>
                  <strong>{formatPrice(570)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: 6 }}>
                  <span>2x Mezcal Marea Margarita</span>
                  <strong>{formatPrice(480)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: 6 }}>
                  <span>1x Grilled Pacific Octopus</span>
                  <strong>{formatPrice(420)}</strong>
                </div>
                <div style={{ borderTop: '1px dashed var(--border-subtle)', paddingTop: 6, display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '0.9375rem', color: 'var(--accent-primary)' }}>
                  <span>Total Due:</span>
                  <span>{formatPrice(1850)}</span>
                </div>
              </div>

              <button onClick={() => navigate('/app/pos')} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <span>{isEs ? 'Abrir Terminal Punto de Venta' : 'Launch POS Outlet Simulator'}</span>
                <ArrowRight size={16} />
              </button>
            </div>

            {/* Right: Outlets overview */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ padding: '16px', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: 4 }}>Marea Terraza</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 10 }}>Oceanfront Dining · 4 active checks</div>
                <span className="badge badge-success">Open · 60 FPS</span>
              </div>
              <div style={{ padding: '16px', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: 4 }}>El Mirador Bar</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 10 }}>Agave & Tapas · 2 active checks</div>
                <span className="badge badge-success">Open · 60 FPS</span>
              </div>
              <div style={{ padding: '16px', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: 4 }}>Las Rocas Beach Club</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 10 }}>Poolside Cabanas · 3 active checks</div>
                <span className="badge badge-success">Open · 60 FPS</span>
              </div>
              <div style={{ padding: '16px', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: 4 }}>La Colección Boutique</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 10 }}>Mexican Linens · Multi-currency</div>
                <span className="badge badge-success">Open · 60 FPS</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA (PRD Section 5.7) */}
      <section style={{ padding: 'var(--space-20) 0', textAlign: 'center' }}>
        <div className="container-max" style={{ maxWidth: '680px' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontFamily: 'var(--font-editorial)', fontStyle: 'italic', marginBottom: 16 }}>
            {isEs ? 'Una estancia más conectada comienza aquí.' : 'A more connected stay starts here.'}
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 32 }}>
            {isEs
              ? 'Descubra cómo una arquitectura basada en Odoo Enterprise puede unificar las operaciones de su resort de lujo con elegancia y solidez técnica.'
              : 'Explore how thoughtful, unified hospitality software can bring your resort outlets, spa scheduling, folios, and Mexican invoicing together.'}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 14 }}>
            <button onClick={() => navigate('/app')} className="btn btn-primary btn-lg" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <span>{isEs ? 'Explorar el Demo Operativo' : 'Explore the Operations Demo'}</span>
              <ArrowRight size={18} />
            </button>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="btn btn-outline btn-lg">
              {isEs ? 'Volver al Inicio' : 'Return to Top'}
            </button>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};
