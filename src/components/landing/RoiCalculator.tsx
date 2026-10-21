import React, { useState } from 'react';
import { Button } from '../common/Button';
import { useDemo } from '../../context/DemoContext';
import { Calculator, ArrowRight, DollarSign, Clock, ShieldCheck } from 'lucide-react';

export const RoiCalculator: React.FC = () => {
  const { navigate, addToast } = useDemo();

  const [unitsCount, setUnitsCount] = useState(25);
  const [adr, setAdr] = useState(420); // Average Daily Rate €
  const [avgStayNights, setAvgStayNights] = useState(4);
  const [directShareCurrent, setDirectShareCurrent] = useState(30); // 30%

  // Calculations
  const monthlyBookingsPerUnit = 4;
  const totalAnnualBookings = unitsCount * monthlyBookingsPerUnit * 12;
  const grossAnnualRevenue = totalAnnualBookings * (adr * avgStayNights);
  const otaShare = (100 - directShareCurrent) / 100;
  const otaRevenue = grossAnnualRevenue * otaShare;

  // Assuming 18% OTA commission fee
  const annualOtaCommissionsPaid = otaRevenue * 0.18;

  // Reserva Flow increases direct share to 65% (+35% shift)
  const recoveredCommission = annualOtaCommissionsPaid * 0.55;
  const preventedOverbookingLosses = unitsCount * 1850;
  const totalRecoveredAnnualYield = recoveredCommission + preventedOverbookingLosses;
  const manualHoursSaved = Math.round(totalAnnualBookings * 0.45);

  const handleApply = () => {
    addToast(
      'Yield Profile Calibrated',
      `Applied ${unitsCount} units portfolio (€${Math.round(totalRecoveredAnnualYield).toLocaleString()} yield) to session.`,
      'success'
    );
    navigate('/dashboard');
  };

  return (
    <section
      id="roi"
      style={{
        padding: '5rem 0',
        backgroundColor: '#F8FAFC',
        borderTop: '1px solid #E2E8F0',
        borderBottom: '1px solid #E2E8F0',
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
            Yield Optimization
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
            Calculate your annual recovered net revenue
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#64748B', lineHeight: 1.6 }}>
            Eliminating third-party OTA fees and capturing high-demand reservations through autonomous headless direct engines dramatically elevates net margins.
          </p>
        </div>

        {/* Interactive Grid */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 4px 20px rgba(15, 23, 42, 0.06)',
            padding: '2.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
          }}
        >
          {/* Sliders Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {/* Slider 1: Units Count */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <label style={{ fontSize: '0.88rem', fontWeight: 600, color: '#334155' }}>
                  Managed Luxury Units / Rooms
                </label>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: '#0D4E43' }}>
                  {unitsCount} units
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={150}
                step={5}
                value={unitsCount}
                onChange={(e) => setUnitsCount(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#0D4E43', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94A3B8', marginTop: '0.2rem' }}>
                <span>5 units</span>
                <span>150 units</span>
              </div>
            </div>

            {/* Slider 2: Average Daily Rate (ADR) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <label style={{ fontSize: '0.88rem', fontWeight: 600, color: '#334155' }}>
                  Average Daily Rate (ADR)
                </label>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: '#0D4E43' }}>
                  €{adr} / night
                </span>
              </div>
              <input
                type="range"
                min={120}
                max={1200}
                step={20}
                value={adr}
                onChange={(e) => setAdr(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#0D4E43', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94A3B8', marginTop: '0.2rem' }}>
                <span>€120</span>
                <span>€1,200</span>
              </div>
            </div>

            {/* Slider 3: Current Direct Booking Share */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <label style={{ fontSize: '0.88rem', fontWeight: 600, color: '#334155' }}>
                  Current Direct Booking Share
                </label>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: '#0D4E43' }}>
                  {directShareCurrent}%
                </span>
              </div>
              <input
                type="range"
                min={10}
                max={70}
                step={5}
                value={directShareCurrent}
                onChange={(e) => setDirectShareCurrent(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#0D4E43', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94A3B8', marginTop: '0.2rem' }}>
                <span>10% (Heavy OTA dependence)</span>
                <span>70% (Direct brand)</span>
              </div>
            </div>
          </div>

          {/* Results Column */}
          <div
            style={{
              backgroundColor: '#0D4E43',
              borderRadius: '16px',
              padding: '2rem',
              color: '#FFFFFF',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 8px 24px rgba(13, 78, 67, 0.3)',
            }}
          >
            <div>
              <div style={{ fontSize: '0.8rem', color: '#6EE7B7', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Annual Value Realization
              </div>

              <div style={{ fontSize: 'clamp(2.2rem, 3.5vw, 3rem)', fontWeight: 800, color: '#FFFFFF', margin: '0.5rem 0' }}>
                €{Math.round(totalRecoveredAnnualYield).toLocaleString()}
              </div>

              <p style={{ fontSize: '0.86rem', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '1.75rem', lineHeight: 1.5 }}>
                Estimated bottom-line increase based on autonomous direct reservation conversion and zero double-booking write-offs.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.65rem', borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
                  <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.8)' }}>OTA Commissions Saved:</span>
                  <strong style={{ fontSize: '0.95rem', color: '#34D399' }}>
                    +€{Math.round(recoveredCommission).toLocaleString()}/yr
                  </strong>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.65rem', borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
                  <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.8)' }}>Double-Booking Loss Avoidance:</span>
                  <strong style={{ fontSize: '0.95rem', color: '#34D399' }}>
                    +€{Math.round(preventedOverbookingLosses).toLocaleString()}/yr
                  </strong>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.8)' }}>Manual Operator Time Saved:</span>
                  <strong style={{ fontSize: '0.95rem', color: '#FFFFFF' }}>
                    {manualHoursSaved} hours/yr
                  </strong>
                </div>
              </div>
            </div>

            <Button
              variant="emerald"
              size="md"
              fullWidth
              onClick={handleApply}
              iconRight={<ArrowRight size={16} />}
            >
              Test Live Dashboard with this Profile
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
