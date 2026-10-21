import React, { useState } from 'react';
import { Button } from '../common/Button';
import { useDemo } from '../../context/DemoContext';
import { Check, Zap, Sparkles } from 'lucide-react';

export const PricingSection: React.FC = () => {
  const { navigate, addToast } = useDemo();
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: 'Boutique Host',
      desc: 'Ideal for luxury chalets, boutique villas, and single high-yield properties.',
      priceMonthly: 340,
      priceAnnual: 290,
      units: 'Up to 10 units',
      workers: '2 Concurrent Headless Workers',
      features: [
        'Deterministic Flash Drop Sniper',
        'Direct Booking Engine Bridge',
        'Standard Residential Proxy Pool (EU)',
        'Cloudflare Turnstile Auto-Solver',
        'Daily Sync Audit Logs',
        'Email & WhatsApp Alerts',
      ],
      isPopular: false,
      ctaText: 'Select Boutique Plan',
    },
    {
      name: 'Luxury Collection',
      desc: 'Designed for boutique hotel groups, luxury estates, and exclusive dining venues.',
      priceMonthly: 790,
      priceAnnual: 680,
      units: 'Up to 40 units',
      workers: '8 Concurrent Headless Workers',
      features: [
        'Zero-Collision Channel Shield (OTA Arbiter)',
        'Multi-Platform 2-Way Sync (Booking/Airbnb/Agoda)',
        'Global Residential ISP Proxies (DE, CH, UK, US)',
        'Instant Waitlist Auto-Recovery (Stornierung)',
        'Real-time Deterministic Simulation Engine',
        'Priority Phone & Dedicated Concierge Engineer',
      ],
      isPopular: true,
      ctaText: 'Deploy Collection Plan',
    },
    {
      name: 'Enterprise Hospitality',
      desc: 'Tailored for multi-property resort portfolios and Michelin-tier dining syndicates.',
      priceMonthly: 2150,
      priceAnnual: 1850,
      units: 'Unlimited units',
      workers: 'Custom Dedicated Headless Cluster',
      features: [
        'Dedicated Private IP Subnets & AS3320 Peers',
        'Custom Webhook & PMS Bi-directional Drivers',
        'Sub-100ms Execution SLA Guarantee',
        'Role-Based Granular Access & SOC2 Compliance',
        '24/7 Dedicated Operations Architect on Call',
        'Custom Simulation Scenario Authoring',
      ],
      isPopular: false,
      ctaText: 'Contact Enterprise Sales',
    },
  ];

  const handleSelectPlan = (planName: string) => {
    addToast('Plan Selected', `Configured prototype demo for "${planName}". Launching workspace...`, 'success');
    navigate('/dashboard');
  };

  return (
    <section
      id="pricing"
      style={{
        padding: '5rem 0',
        backgroundColor: '#F8FAFC',
        borderTop: '1px solid #E2E8F0',
      }}
    >
      <div className="container-marketing">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3.5rem auto' }}>
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
            Predictable Investment
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
            Transparent plans for high-yield operations
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#64748B', lineHeight: 1.6, marginBottom: '2rem' }}>
            Pays for itself with a single recovered high-demand reservation.
          </p>

          {/* Toggle */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '9999px',
              padding: '0.25rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <button
              onClick={() => setIsAnnual(false)}
              style={{
                padding: '0.45rem 1.1rem',
                borderRadius: '9999px',
                fontSize: '0.82rem',
                fontWeight: 600,
                backgroundColor: !isAnnual ? '#0D4E43' : 'transparent',
                color: !isAnnual ? '#FFFFFF' : '#64748B',
                transition: 'all 150ms ease',
              }}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              style={{
                padding: '0.45rem 1.1rem',
                borderRadius: '9999px',
                fontSize: '0.82rem',
                fontWeight: 600,
                backgroundColor: isAnnual ? '#0D4E43' : 'transparent',
                color: isAnnual ? '#FFFFFF' : '#64748B',
                transition: 'all 150ms ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <span>Annual Billing</span>
              <span
                style={{
                  fontSize: '0.68rem',
                  backgroundColor: '#DCFCE7',
                  color: '#15803D',
                  padding: '0.1rem 0.4rem',
                  borderRadius: '9999px',
                  fontWeight: 700,
                }}
              >
                Save 18%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
            alignItems: 'stretch',
          }}
        >
          {plans.map((p) => {
            const price = isAnnual ? p.priceAnnual : p.priceMonthly;

            return (
              <div
                key={p.name}
                style={{
                  backgroundColor: p.isPopular ? '#0D4E43' : '#FFFFFF',
                  color: p.isPopular ? '#FFFFFF' : '#0F172A',
                  borderRadius: '20px',
                  border: p.isPopular ? '2px solid #0D4E43' : '1px solid #E2E8F0',
                  boxShadow: p.isPopular
                    ? '0 20px 35px -10px rgba(13, 78, 67, 0.3)'
                    : '0 4px 12px rgba(15, 23, 42, 0.04)',
                  padding: '2.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  transform: p.isPopular ? 'scale(1.02)' : 'none',
                  transition: 'all 200ms ease',
                }}
              >
                {p.isPopular && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-12px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: '#10B981',
                      color: '#FFFFFF',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '0.25rem 0.85rem',
                      borderRadius: '9999px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      boxShadow: '0 2px 8px rgba(16, 185, 129, 0.4)',
                    }}
                  >
                    Most Popular
                  </div>
                )}

                <div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
                    {p.name}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.86rem',
                      color: p.isPopular ? 'rgba(255, 255, 255, 0.8)' : '#64748B',
                      lineHeight: 1.5,
                      marginBottom: '1.75rem',
                      minHeight: '40px',
                    }}
                  >
                    {p.desc}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '2.75rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
                      €{price}
                    </span>
                    <span style={{ fontSize: '0.88rem', color: p.isPopular ? 'rgba(255, 255, 255, 0.7)' : '#64748B' }}>
                      / month
                    </span>
                  </div>

                  <div
                    style={{
                      fontSize: '0.78rem',
                      color: p.isPopular ? '#6EE7B7' : '#0D4E43',
                      fontWeight: 700,
                      marginBottom: '2rem',
                    }}
                  >
                    {p.units} · {p.workers}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2.5rem' }}>
                    {p.features.map((feat) => (
                      <div key={feat} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', fontSize: '0.85rem' }}>
                        <span
                          style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            backgroundColor: p.isPopular ? 'rgba(255, 255, 255, 0.15)' : '#DCFCE7',
                            color: p.isPopular ? '#FFFFFF' : '#15803D',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            marginTop: '2px',
                          }}
                        >
                          <Check size={12} strokeWidth={3} />
                        </span>
                        <span style={{ color: p.isPopular ? 'rgba(255, 255, 255, 0.95)' : '#334155', lineHeight: 1.4 }}>
                          {feat}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  variant={p.isPopular ? 'emerald' : 'primary'}
                  size="md"
                  fullWidth
                  onClick={() => handleSelectPlan(p.name)}
                >
                  {p.ctaText}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
