import React from 'react';
import { BrandLogo } from '../common/BrandLogo';
import { useDemo } from '../../context/DemoContext';
import { Shield, ExternalLink, Zap } from 'lucide-react';

export const LandingFooter: React.FC = () => {
  const { navigate, runScenario } = useDemo();

  return (
    <footer
      style={{
        backgroundColor: '#082F28',
        color: '#FFFFFF',
        padding: '4.5rem 0 2.5rem 0',
        borderTop: '1px solid #0B3F36',
      }}
    >
      <div className="container-marketing">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '3rem',
            marginBottom: '3.5rem',
          }}
        >
          {/* Brand Info */}
          <div>
            <BrandLogo size="md" light showBadge />
            <p
              style={{
                fontSize: '0.85rem',
                color: 'rgba(255, 255, 255, 0.7)',
                lineHeight: 1.6,
                marginTop: '1.25rem',
                marginBottom: '1.5rem',
              }}
            >
              The premier autonomous reservation orchestration platform for luxury boutique hotels, private estates, and Michelin dining groups.
            </p>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.75rem',
                color: '#6EE7B7',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                padding: '0.35rem 0.75rem',
                borderRadius: '9999px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#10B981',
                }}
              />
              All Systems Operational · 99.98% SLA
            </div>
          </div>

          {/* Navigation Column */}
          <div>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1.2rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Platform Routes
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem' }}>
              <button
                onClick={() => navigate('/dashboard')}
                style={{ textAlign: 'left', color: 'rgba(255,255,255,0.75)', cursor: 'pointer' }}
              >
                Executive Dashboard
              </button>
              <button
                onClick={() => navigate('/workflows')}
                style={{ textAlign: 'left', color: 'rgba(255,255,255,0.75)', cursor: 'pointer' }}
              >
                Workflow Studio & Wizard
              </button>
              <button
                onClick={() => navigate('/bookings')}
                style={{ textAlign: 'left', color: 'rgba(255,255,255,0.75)', cursor: 'pointer' }}
              >
                Bookings Management Grid
              </button>
              <button
                onClick={() => navigate('/sessions')}
                style={{ textAlign: 'left', color: 'rgba(255,255,255,0.75)', cursor: 'pointer' }}
              >
                Browser Session Workers
              </button>
              <button
                onClick={() => navigate('/activity')}
                style={{ textAlign: 'left', color: 'rgba(255,255,255,0.75)', cursor: 'pointer' }}
              >
                Activity Audit Stream
              </button>
            </div>
          </div>

          {/* Simulations Column */}
          <div>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1.2rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Deterministic Sandbox
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem' }}>
              <button
                onClick={() => {
                  navigate('/simulator');
                  setTimeout(() => runScenario('flash_booking'), 300);
                }}
                style={{ textAlign: 'left', color: '#34D399', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <Zap size={14} /> Flash Snipe (Scenario 1)
              </button>
              <button
                onClick={() => {
                  navigate('/simulator');
                  setTimeout(() => runScenario('channel_conflict'), 300);
                }}
                style={{ textAlign: 'left', color: '#34D399', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <Zap size={14} /> Channel Conflict (Scenario 2)
              </button>
              <button
                onClick={() => {
                  navigate('/simulator');
                  setTimeout(() => runScenario('antibot_challenge'), 300);
                }}
                style={{ textAlign: 'left', color: '#34D399', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <Zap size={14} /> Anti-Bot Bypass (Scenario 3)
              </button>
              <button
                onClick={() => {
                  navigate('/simulator');
                  setTimeout(() => runScenario('cancellation_recovery'), 300);
                }}
                style={{ textAlign: 'left', color: '#34D399', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <Zap size={14} /> Waitlist Recovery (Scenario 4)
              </button>
            </div>
          </div>

          {/* Legal / Compliance */}
          <div>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1.2rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Safety & Prototype Notice
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.65)', lineHeight: 1.5 }}>
              This web application is a high-fidelity SaaS frontend demonstration. All reservations, guests, and transactions are fictional. No actual reservations are transmitted to external services.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            paddingTop: '2rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.78rem',
            color: 'rgba(255, 255, 255, 0.5)',
          }}
        >
          <div>
            © 2026 RESERVA FLOW Inc. All rights reserved. Built with precision for hospitality leaders.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
