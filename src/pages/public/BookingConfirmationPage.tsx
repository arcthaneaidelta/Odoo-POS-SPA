import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, Calendar, Clock, Sparkles, ArrowRight, Home } from 'lucide-react';
import { PublicNavbar } from '../../components/layout/PublicNavbar';
import { PublicFooter } from '../../components/layout/PublicFooter';
import { useApp } from '../../context/AppContext';

export const BookingConfirmationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { spaBookings, formatPrice, settings } = useApp();
  const isEs = settings.language === 'es';

  const bookingRef = searchParams.get('ref') || 'SPA-2026-1044';
  const bookingId = searchParams.get('id');

  const booking = spaBookings.find(b => (bookingId ? b.id === bookingId : b.bookingRef === bookingRef)) || spaBookings[0];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)' }}>
      <PublicNavbar />

      <main style={{ paddingTop: '120px', paddingBottom: 'var(--space-16)' }}>
        <div className="container-max" style={{ maxWidth: '640px' }}>
          <div className="card" style={{ padding: 'var(--space-10)', textAlign: 'center' }}>
            {/* Green Check Icon */}
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                backgroundColor: 'var(--state-success-bg)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20
              }}
            >
              <CheckCircle2 size={36} color="var(--state-success)" />
            </div>

            <span
              style={{
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                color: 'var(--state-success)',
                fontWeight: 700,
                display: 'block',
                marginBottom: 6
              }}
            >
              {isEs ? 'RESERVA CONFIRMADA' : 'RESERVATION CONFIRMED'}
            </span>

            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: 8 }}>
              {isEs ? 'Esperamos darle la bienvenida' : 'We Look Forward to Welcoming You'}
            </h1>

            <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', marginBottom: 28 }}>
              {isEs
                ? `Su ritual ha sido agendado. El anticipo ha sido registrado exitosamente en el sistema de Casa Marea.`
                : `Your restorative wellness appointment is secured. Your 50% deposit has been registered in the Casa Marea operations ecosystem.`}
            </p>

            {/* Reference Badge */}
            <div
              style={{
                display: 'inline-flex',
                flexDirection: 'column',
                padding: '12px 24px',
                backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                marginBottom: 28
              }}
            >
              <span style={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)' }}>
                Confirmation Reference
              </span>
              <strong style={{ fontFamily: 'monospace', fontSize: '1.25rem', color: 'var(--accent-primary)', letterSpacing: '0.05em' }}>
                {booking?.bookingRef || bookingRef}
              </strong>
            </div>

            {/* Booking Details Card */}
            {booking && (
              <div
                style={{
                  backgroundColor: 'var(--bg-main)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px',
                  textAlign: 'left',
                  border: '1px solid var(--border-subtle)',
                  marginBottom: 28,
                  fontSize: '0.875rem'
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Treatment</span>
                    <div style={{ fontWeight: 600 }}>{booking.treatmentName}</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Guest</span>
                    <div style={{ fontWeight: 600 }}>{booking.guestName}</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Date & Time</span>
                    <div style={{ fontWeight: 600 }}>{booking.date} at {booking.startTime}</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Therapist & Cabin</span>
                    <div style={{ fontWeight: 600 }}>{booking.therapistName} ({booking.roomName})</div>
                  </div>
                </div>

                <div style={{ borderTop: '1px dashed var(--border-subtle)', marginTop: 14, paddingTop: 12, display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Deposit Paid:</span>
                    <div style={{ fontWeight: 700, color: 'var(--state-success)' }}>{formatPrice(booking.depositPaidMxn)}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Due at Checkout:</span>
                    <div style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>{formatPrice(booking.remainingBalanceMxn)}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Actions: Return to resort or inspect on operations dashboard */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }}>
              <button
                onClick={() => navigate('/app/spa')}
                className="btn btn-primary btn-lg"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
              >
                <Sparkles size={18} />
                <span>{isEs ? 'Ver Cita en Agenda Operativa (/app/spa)' : 'Inspect in Operations Calendar (/app/spa)'}</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={() => navigate('/')}
                className="btn btn-outline btn-lg"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
              >
                <Home size={16} />
                <span>{isEs ? 'Volver al Inicio' : 'Return to Resort'}</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};
