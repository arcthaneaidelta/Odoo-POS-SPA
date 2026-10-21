import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { HeroSection } from '../components/landing/HeroSection';
import { FeatureGrid } from '../components/landing/FeatureGrid';
import { WorkflowVisualizer } from '../components/landing/WorkflowVisualizer';
import { RoiCalculator } from '../components/landing/RoiCalculator';
import { ComparisonTable } from '../components/landing/ComparisonTable';
import { PricingSection } from '../components/landing/PricingSection';
import { FaqSection } from '../components/landing/FaqSection';
import { LandingFooter } from '../components/landing/LandingFooter';
import { ToastContainer } from '../components/common/Toast';
import { Button } from '../components/common/Button';
import { useDemo } from '../context/DemoContext';
import { ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { navigate, runScenario } = useDemo();

  const partnerLogos = [
    { name: 'Booking.com', tag: 'OTA Bridge' },
    { name: 'Airbnb Luxury', tag: 'Channel Sync' },
    { name: 'OpenTable', tag: 'Dining API' },
    { name: 'Resy VIP', tag: 'Flash Drop' },
    { name: 'Opera Cloud PMS', tag: 'Direct Two-Way' },
    { name: 'Agoda Homes', tag: 'Global Feed' },
    { name: 'Cloudflare', tag: 'Turnstile Certified' },
    { name: 'Stripe Vault', tag: 'PCI-DSS Token' },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#FFFFFF' }}>
      <Navbar />

      <main style={{ flex: 1 }}>
        <HeroSection />

        {/* Partner Integrations Ticker */}
        <section
          style={{
            padding: '2.5rem 0',
            backgroundColor: '#FAFAFA',
            borderTop: '1px solid #E2E8F0',
            borderBottom: '1px solid #E2E8F0',
          }}
        >
          <div className="container-marketing">
            <p
              style={{
                textAlign: 'center',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#94A3B8',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '1.5rem',
              }}
            >
              Integrates with leading reservation engines and property management systems
            </p>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2.5rem',
                flexWrap: 'wrap',
              }}
            >
              {partnerLogos.map((logo) => (
                <div
                  key={logo.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    color: '#475569',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    letterSpacing: '-0.01em',
                  }}
                >
                  <span>{logo.name}</span>
                  <span
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 600,
                      backgroundColor: '#E2E8F0',
                      color: '#475569',
                      padding: '0.1rem 0.35rem',
                      borderRadius: '4px',
                    }}
                  >
                    {logo.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <FeatureGrid />
        <WorkflowVisualizer />
        <RoiCalculator />
        <ComparisonTable />
        <PricingSection />
        <FaqSection />

        {/* Pre-Footer Final CTA Banner */}
        <section
          style={{
            padding: '5rem 0',
            backgroundColor: '#0D4E43',
            color: '#FFFFFF',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at 50% 50%, rgba(52, 211, 153, 0.15) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          <div className="container-marketing" style={{ position: 'relative', zIndex: 2, maxWidth: '750px' }}>
            <h2
              style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                color: '#FFFFFF',
                marginBottom: '1rem',
              }}
            >
              Experience the prototype live in action
            </h2>
            <p
              style={{
                fontSize: '1.1rem',
                color: '#A7F3D0',
                lineHeight: 1.6,
                marginBottom: '2.5rem',
              }}
            >
              Explore all 7 routes, trigger deterministic simulation scenarios, and inspect real-time state synchronization across metrics, bookings, and worker sessions.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Button
                variant="emerald"
                size="lg"
                onClick={() => navigate('/dashboard')}
                iconRight={<ArrowRight size={18} />}
              >
                Open Executive Dashboard
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => {
                  navigate('/simulator');
                  setTimeout(() => runScenario('flash_booking'), 300);
                }}
                iconLeft={<Zap size={18} color="#0D4E43" />}
              >
                Run Execution Simulator
              </Button>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
      <ToastContainer />
    </div>
  );
};
