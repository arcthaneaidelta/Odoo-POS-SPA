import React from 'react';
import { Check, X, Minus } from 'lucide-react';

export const ComparisonTable: React.FC = () => {
  const rows = [
    {
      feature: 'Reservation Drop Acquisition (Flash Sniper)',
      reserva: 'Headless Sub-Second Bot (280ms)',
      traditional: 'Not supported (Manual only)',
      manual: 'Seconds too slow (Misses drops)',
    },
    {
      feature: 'Cross-Channel Conflict Arbitration',
      reserva: 'Dynamic Margin-Based (Instant)',
      traditional: 'Delayed iCal Sync (15–60 mins)',
      manual: 'High risk of double booking',
    },
    {
      feature: 'Anti-Bot & Turnstile Solver',
      reserva: 'Automated Biometric Fingerprints',
      traditional: 'Blocked by target WAF',
      manual: 'Manual captcha solving',
    },
    {
      feature: 'Dynamic Waitlist Backfill on Stornierung',
      reserva: 'Automated within 1.2s',
      traditional: 'Manual notification emails',
      manual: 'Hours of staff outreach',
    },
    {
      feature: 'Dedicated Residential ISP Proxy Pool',
      reserva: 'Integrated Global Fleet (6+ Nodes)',
      traditional: 'None (Direct IP only)',
      manual: 'Single local IP',
    },
    {
      feature: 'Deterministic Simulation Sandbox',
      reserva: 'Full 4-Scenario Testing Engine',
      traditional: 'Mock test mode only',
      manual: 'None',
    },
  ];

  return (
    <section
      style={{
        padding: '5rem 0',
        backgroundColor: '#FFFFFF',
      }}
    >
      <div className="container-marketing">
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
            Competitive Edge
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
            Why modern operators choose Reserva Flow
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#64748B', lineHeight: 1.6 }}>
            Traditional channel managers only synchronize calendars with high latency. Reserva Flow actively acquires inventory and resolves collisions autonomously.
          </p>
        </div>

        <div
          style={{
            overflowX: 'auto',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
          }}
        >
          <table style={{ width: '100%', minWidth: '700px', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.86rem', color: '#64748B', fontWeight: 600 }}>
                  Operational Capability
                </th>
                <th
                  style={{
                    padding: '1.25rem 1.5rem',
                    fontSize: '0.95rem',
                    color: '#0D4E43',
                    fontWeight: 800,
                    backgroundColor: '#F0FAF7',
                    borderLeft: '2px solid #0D4E43',
                    borderRight: '2px solid #0D4E43',
                  }}
                >
                  RESERVA FLOW (Autonomous)
                </th>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.86rem', color: '#64748B', fontWeight: 600 }}>
                  Legacy Channel Managers
                </th>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.86rem', color: '#64748B', fontWeight: 600 }}>
                  Manual Staff Handling
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr
                  key={row.feature}
                  style={{
                    borderBottom: idx < rows.length - 1 ? '1px solid #E2E8F0' : 'none',
                    backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FAFAFA',
                  }}
                >
                  <td style={{ padding: '1.1rem 1.5rem', fontSize: '0.88rem', fontWeight: 700, color: '#0F172A' }}>
                    {row.feature}
                  </td>
                  <td
                    style={{
                      padding: '1.1rem 1.5rem',
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      color: '#065F46',
                      backgroundColor: '#F0FAF7',
                      borderLeft: '2px solid #0D4E43',
                      borderRight: '2px solid #0D4E43',
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
                      <Check size={16} color="#10B981" strokeWidth={3} />
                      {row.reserva}
                    </span>
                  </td>
                  <td style={{ padding: '1.1rem 1.5rem', fontSize: '0.85rem', color: '#64748B' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
                      <X size={15} color="#EF4444" />
                      {row.traditional}
                    </span>
                  </td>
                  <td style={{ padding: '1.1rem 1.5rem', fontSize: '0.85rem', color: '#94A3B8' }}>
                    {row.manual}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
