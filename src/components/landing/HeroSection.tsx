import React from 'react';
import { useDemo } from '../../context/DemoContext';
import { Button } from '../common/Button';
import {
  ArrowRight,
  Play,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Zap,
  Globe,
  Lock,
} from 'lucide-react';

import { LiveAmbientHeroBackground } from './LiveAmbientHeroBackground';

export const HeroSection: React.FC = () => {
  const { navigate, runScenario } = useDemo();

  return (
    <section
      style={{
        position: 'relative',
        padding: '5rem 0 4rem 0',
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
      }}
    >
      {/* Live Cinematic Ambient Video & Canvas Background */}
      <LiveAmbientHeroBackground />

      <div
        className="container-marketing"
        style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          maxWidth: '1060px',
        }}
      >
        {/* Pill Badge inspired by Reference Image 2 SYLVA */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 0.85rem',
            backgroundColor: '#F0FAF7',
            border: '1px solid #D1FAE5',
            borderRadius: '9999px',
            marginBottom: '1.75rem',
            boxShadow: '0 1px 2px rgba(13, 78, 67, 0.05)',
          }}
        >
          <span
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: '#10B981',
            }}
          />
          <span
            style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#0D4E43',
              letterSpacing: '0.01em',
            }}
          >
            All-in-one Autonomous Platform
          </span>
        </div>

        {/* Hero Headline inspired by Reference Image 2 */}
        <h1
          style={{
            fontSize: 'clamp(2.5rem, 5.5vw, 4.2rem)',
            fontWeight: 800,
            color: '#0F172A',
            letterSpacing: '-0.035em',
            lineHeight: 1.1,
            marginBottom: '1.5rem',
          }}
        >
          One platform <br />
          <span style={{ color: '#0D4E43' }}>for your entire workflow</span>
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 'clamp(1rem, 1.8vw, 1.22rem)',
            color: '#475569',
            maxWidth: '720px',
            margin: '0 auto 2.5rem auto',
            lineHeight: 1.6,
            fontWeight: 400,
          }}
        >
          Reserva Flow is an all-in-one platform to orchestrate high-demand reservations,
          reconcile cross-channel overbookings in milliseconds, and deploy headless browser workers without complexity.
        </p>

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
            marginBottom: '3.5rem',
          }}
        >
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/dashboard')}
            iconRight={<ArrowRight size={18} />}
          >
            Launch Live Prototype
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={() => {
              navigate('/simulator');
              setTimeout(() => runScenario('flash_booking'), 300);
            }}
            iconLeft={<Play size={16} color="#10B981" />}
          >
            Simulate Drop Snipe (Scenario 1)
          </Button>
        </div>

        {/* Trust Badges */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2rem',
            flexWrap: 'wrap',
            color: '#64748B',
            fontSize: '0.82rem',
            fontWeight: 600,
            marginBottom: '4rem',
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
            <CheckCircle2 size={16} color="#10B981" /> 0% OTA Commission Leak
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
            <Zap size={16} color="#10B981" /> 280ms Turnstile Solve
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
            <ShieldCheck size={16} color="#10B981" /> 99.98% Zero Overbooking
          </span>
        </div>

        {/* Interactive Dashboard Mockup Hero Showcase (matching Reference Image 2 & 1) */}
        <div
          style={{
            position: 'relative',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.12), 0 0 0 1px rgba(15, 23, 42, 0.05)',
            backgroundColor: '#F4F6F8',
            overflow: 'hidden',
            padding: '1rem',
            textAlign: 'left',
          }}
        >
          {/* Mock Window Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.4rem 0.75rem',
              marginBottom: '0.85rem',
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10B981' }} />
              <span style={{ marginLeft: '0.75rem', fontSize: '0.75rem', color: '#64748B', fontFamily: 'var(--font-mono)' }}>
                https://app.reservaflow.io/dashboard · Live Interactive Preview
              </span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
              style={{ fontSize: '0.75rem' }}
            >
              Open Fullscreen →
            </Button>
          </div>

          {/* Mini Interactive Preview Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            {/* Occupancy card */}
            <div
              onClick={() => navigate('/dashboard')}
              style={{
                backgroundColor: '#0D4E43',
                color: '#FFFFFF',
                borderRadius: '10px',
                padding: '1.25rem',
                cursor: 'pointer',
                transition: 'transform 150ms ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <div style={{ fontSize: '0.8rem', opacity: 0.85 }}>Occupancy Rate</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, margin: '0.25rem 0' }}>87%</div>
              <div style={{ fontSize: '0.75rem', color: '#6EE7B7' }}>+5% vs last week · 100% capacity preserved</div>
            </div>

            {/* Check-ins card */}
            <div
              onClick={() => navigate('/bookings')}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '10px',
                padding: '1.25rem',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Check-ins Today</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', margin: '0.25rem 0' }}>24</div>
              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>12 Processed · 12 Pending</div>
            </div>

            {/* Revenue card */}
            <div
              onClick={() => navigate('/dashboard')}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '10px',
                padding: '1.25rem',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Revenue Today</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', margin: '0.25rem 0' }}>$5,820</div>
              <div style={{ fontSize: '0.75rem', color: '#16A34A' }}>+12% vs yesterday</div>
            </div>

            {/* Tasks card */}
            <div
              onClick={() => navigate('/dashboard')}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '10px',
                padding: '1.25rem',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Active Tasks</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', margin: '0.25rem 0' }}>7</div>
              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>3 Overdue · 4 Completed</div>
            </div>
          </div>

          {/* Floating simulation preview pill */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
              padding: '0.85rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#10B981',
                  animation: 'pulseGlow 1.5s infinite',
                }}
              />
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#0F172A' }}>
                Active Session: Hermes-Stealth-02 locked Room 305 Son Felipe (€4,250)
              </span>
            </div>

            <Button
              variant="emerald"
              size="sm"
              onClick={() => navigate('/simulator')}
              iconLeft={<Zap size={14} />}
            >
              Test Simulation
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
