import React from 'react';
import {
  Cpu,
  ShieldCheck,
  Zap,
  RotateCcw,
  Globe2,
  FileCheck2,
  ArrowUpRight,
} from 'lucide-react';
import { useDemo } from '../../context/DemoContext';

export const FeatureGrid: React.FC = () => {
  const { navigate, runScenario } = useDemo();

  const features = [
    {
      icon: <Cpu size={24} color="#0D4E43" />,
      title: 'Headless Browser Cluster',
      description:
        'Dispatches stealth Chromium instances with humanized bezier cursor curves and genuine macOS canvas fingerprints to navigate booking drops.',
      badge: 'Sub-second',
      actionRoute: '/sessions',
      actionText: 'View Worker Fleet',
    },
    {
      icon: <Zap size={24} color="#0D4E43" />,
      title: 'Zero-Collision Channel Shield',
      description:
        'Resolves concurrent double-booking attempts across Airbnb, Booking.com, and Direct engines in 320ms using dynamic net-margin arbitration.',
      badge: '99.98% Safe',
      scenarioTrigger: 'channel_conflict' as const,
      actionText: 'Simulate Conflict',
    },
    {
      icon: <ShieldCheck size={24} color="#0D4E43" />,
      title: 'Biometric Anti-Bot Solver',
      description:
        'Bypasses Cloudflare Turnstile, DataDome, and PerimeterX challenges with an average 280ms solve time and zero IP bans.',
      badge: '99.4% Pass',
      scenarioTrigger: 'antibot_challenge' as const,
      actionText: 'Simulate Bypass',
    },
    {
      icon: <RotateCcw size={24} color="#0D4E43" />,
      title: 'Instant Waitlist Yield Recovery',
      description:
        'Detects OTA cancellations instantly and backfills open inventory with pre-authorized VIP waitlisted guests in under 2 seconds.',
      badge: '100% Occupancy',
      scenarioTrigger: 'cancellation_recovery' as const,
      actionText: 'Simulate Recovery',
    },
    {
      icon: <Globe2 size={24} color="#0D4E43" />,
      title: 'Global Residential Proxy Pool',
      description:
        'Routes automation traffic through premium ISP residential nodes in Frankfurt, Zurich, London, and Tokyo for pristine reputation scoring.',
      badge: '38ms Latency',
      actionRoute: '/sessions',
      actionText: 'Inspect Proxies',
    },
    {
      icon: <FileCheck2 size={24} color="#0D4E43" />,
      title: 'Deterministic Audit Log Stream',
      description:
        'Every agent step, proxy rotation, biometric handshake, and credit pre-authorization is cryptographically recorded for full compliance.',
      badge: 'SOC2 Ready',
      actionRoute: '/activity',
      actionText: 'Inspect Audit Log',
    },
  ];

  return (
    <section
      id="features"
      style={{
        padding: '5rem 0',
        backgroundColor: '#F8FAFC',
        borderTop: '1px solid #E2E8F0',
        borderBottom: '1px solid #E2E8F0',
      }}
    >
      <div className="container-marketing">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 4rem auto' }}>
          <span
            style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#0D4E43',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              display: 'block',
              marginBottom: '0.65rem',
            }}
          >
            Core Infrastructure
          </span>
          <h2
            style={{
              fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
              fontWeight: 800,
              letterSpacing: '-0.025em',
              color: '#0F172A',
              marginBottom: '1rem',
            }}
          >
            Engineered for high-volume, high-stakes reservation operations
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#64748B', lineHeight: 1.6 }}>
            Replace unreliable browser extensions, delayed iCal updates, and manual reservation data entry with deterministic headless workers.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {features.map((feat) => (
            <div
              key={feat.title}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '2rem',
                border: '1px solid #E2E8F0',
                boxShadow: '0 2px 4px rgba(15, 23, 42, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 200ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 12px 24px -6px rgba(15, 23, 42, 0.08)';
                e.currentTarget.style.borderColor = '#CBD5E1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(15, 23, 42, 0.04)';
                e.currentTarget.style.borderColor = '#E2E8F0';
              }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1.25rem',
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      backgroundColor: '#F0FAF7',
                      border: '1px solid #D1FAE5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {feat.icon}
                  </div>

                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      backgroundColor: '#DCFCE7',
                      color: '#15803D',
                      padding: '0.2rem 0.55rem',
                      borderRadius: '9999px',
                    }}
                  >
                    {feat.badge}
                  </span>
                </div>

                <h3
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: '#0F172A',
                    marginBottom: '0.65rem',
                    letterSpacing: '-0.015em',
                  }}
                >
                  {feat.title}
                </h3>

                <p
                  style={{
                    fontSize: '0.9rem',
                    color: '#475569',
                    lineHeight: 1.55,
                    marginBottom: '1.5rem',
                  }}
                >
                  {feat.description}
                </p>
              </div>

              <div>
                <button
                  onClick={() => {
                    if (feat.scenarioTrigger) {
                      navigate('/simulator');
                      setTimeout(() => runScenario(feat.scenarioTrigger), 300);
                    } else if (feat.actionRoute) {
                      navigate(feat.actionRoute);
                    }
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    color: '#0D4E43',
                    transition: 'gap 150ms ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.gap = '0.65rem')}
                  onMouseLeave={(e) => (e.currentTarget.style.gap = '0.4rem')}
                >
                  {feat.actionText} <ArrowUpRight size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
