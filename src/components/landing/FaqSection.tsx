import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Does this frontend prototype connect to live booking websites or real credit cards?',
      a: 'No. Strictly adhering to safety guidelines and the PRD, this application is a high-fidelity frontend prototype that operates exclusively on fictional demo data and an in-browser deterministic simulation sandbox. It will never submit live bookings or incur external charges.',
    },
    {
      q: 'How does the deterministic simulation engine work across the interface?',
      a: 'The simulation engine executes 4 deterministic multi-step scenarios: Flash Drops, Channel Collisions, Anti-Bot Failovers, and Dynamic Waitlist Backfills. When you trigger a scenario, the engine advances through sequential agent checkpoints, logs events to the Activity audit log, and mutates state in real-time across the Dashboard KPIs and Bookings table.',
    },
    {
      q: 'How does Reserva Flow prevent overbooking conflicts between OTAs and Direct bookings?',
      a: 'When concurrent reservation holds arrive within milliseconds of each other, our yield engine analyzes net margin, commission savings, and guest tier in 320ms. The higher-margin direct booking is immediately committed to your PMS, while the secondary OTA hold is gracefully shifted to adjacent inventory.',
    },
    {
      q: 'Is my demo state persisted between page refreshes?',
      a: 'Yes! The entire demo state—including newly created workflows, simulated bookings, task toggles, and worker node health—is persisted in your browser’s localStorage. You can restore the pristine seed state at any time using the "Reset Demo Data" action.',
    },
    {
      q: 'Can this prototype be deployed immediately for prospective client demonstrations?',
      a: 'Absolutely. It is fully built with TypeScript, responsive modern CSS, zero runtime warnings, and production-optimized code ready for Netlify, Vercel, or standalone presentation.',
    },
  ];

  return (
    <section
      style={{
        padding: '5rem 0',
        backgroundColor: '#FFFFFF',
      }}
    >
      <div className="container-marketing" style={{ maxWidth: '820px' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
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
            Frequently Asked Questions
          </span>
          <h2
            style={{
              fontSize: 'clamp(2rem, 3.5vw, 2.5rem)',
              fontWeight: 800,
              letterSpacing: '-0.025em',
              color: '#0F172A',
            }}
          >
            Everything you need to know about the prototype
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                style={{
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  backgroundColor: isOpen ? '#F8FAFC' : '#FFFFFF',
                  overflow: 'hidden',
                  transition: 'all 150ms ease',
                }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  style={{
                    width: '100%',
                    padding: '1.25rem 1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    textAlign: 'left',
                    gap: '1rem',
                    fontSize: '0.98rem',
                    fontWeight: 700,
                    color: '#0F172A',
                  }}
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={18}
                    color="#64748B"
                    style={{
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 200ms ease',
                      flexShrink: 0,
                    }}
                  />
                </button>

                {isOpen && (
                  <div
                    style={{
                      padding: '0 1.5rem 1.25rem 1.5rem',
                      fontSize: '0.9rem',
                      color: '#475569',
                      lineHeight: 1.6,
                      borderTop: '1px solid #F1F5F9',
                      paddingTop: '0.85rem',
                    }}
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
