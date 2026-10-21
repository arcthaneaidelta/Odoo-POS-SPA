import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import { PublicNavbar } from '../../components/layout/PublicNavbar';
import { PublicFooter } from '../../components/layout/PublicFooter';
import { useApp } from '../../context/AppContext';
import { SpaTreatment } from '../../types';

export const PublicSpaBookingPage: React.FC = () => {
  const {
    treatments,
    therapists,
    rooms,
    formatPrice,
    checkResourceAvailability,
    createSpaBooking,
    guests,
    settings,
    t
  } = useApp();
  const navigate = useNavigate();
  const isEs = settings.language === 'es';

  // Step state
  const [step, setStep] = useState<number>(1); // 1: Treatment, 2: Date & Time, 3: Add-ons & Guest, 4: Review & Deposit

  // Form selections
  const [selectedTreatment, setSelectedTreatment] = useState<SpaTreatment>(treatments[1] || treatments[0]); // Signature Relaxation
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-21');
  const [selectedTime, setSelectedTime] = useState<string>('12:00');
  const [selectedTherapistId, setSelectedTherapistId] = useState<string>(therapists[0]?.id || '');
  const [selectedRoomId, setSelectedRoomId] = useState<string>(rooms[0]?.id || '');
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);

  // Guest details
  const [guestName, setGuestName] = useState<string>('Camila Wright');
  const [guestEmail, setGuestEmail] = useState<string>('c.wright@wrightarch.design');
  const [guestPhone, setGuestPhone] = useState<string>('+1 310 740 9923');
  const [roomNumber, setRoomNumber] = useState<string>('321');
  const [notes, setNotes] = useState<string>('Medium pressure with focus on shoulders.');

  // Validation / Error state
  const [conflictError, setConflictError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Time slots available (between 09:00 and 19:00)
  const TIME_SLOTS = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  // Price calculations
  const treatmentPrice = selectedTreatment.priceMxn;
  const addOnsTotal = selectedTreatment.addOns
    .filter(a => selectedAddOnIds.includes(a.id))
    .reduce((acc, a) => acc + a.priceMxn, 0);
  const totalPrice = treatmentPrice + addOnsTotal;
  const depositRequired = Math.round(totalPrice * 0.5);
  const remainingBalance = totalPrice - depositRequired;

  const handleNextToStep3 = () => {
    setConflictError(null);
    // Check resource conflict
    const check = checkResourceAvailability(
      selectedDate,
      selectedTime,
      selectedTreatment.durationMinutes,
      selectedTherapistId,
      selectedRoomId
    );

    if (!check.available) {
      setConflictError(check.reason || 'Selected resource is unavailable for this time window.');
      return;
    }

    setStep(3);
  };

  const handleNextToStep4 = () => {
    if (!guestName.trim() || !guestEmail.trim()) {
      setConflictError('Please provide your full name and email address.');
      return;
    }
    setConflictError(null);
    setStep(4);
  };

  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    setConflictError(null);

    try {
      const therapist = therapists.find(t => t.id === selectedTherapistId);
      const room = rooms.find(r => r.id === selectedRoomId);

      // Calculate end time
      const [h, m] = selectedTime.split(':').map(Number);
      const startMin = h * 60 + m;
      const endMin = startMin + selectedTreatment.durationMinutes;
      const endH = Math.floor(endMin / 60).toString().padStart(2, '0');
      const endM = (endMin % 60).toString().padStart(2, '0');
      const endTime = `${endH}:${endM}`;

      // Check if guest exists or map to new
      const matchedGuest = guests.find(g => g.roomNumber === roomNumber) || guests[0];

      const newBooking = await createSpaBooking({
        guestId: matchedGuest?.id || 'gst_walkin',
        guestName,
        guestEmail,
        guestPhone,
        treatmentId: selectedTreatment.id,
        treatmentName: selectedTreatment.name,
        durationMinutes: selectedTreatment.durationMinutes,
        date: selectedDate,
        startTime: selectedTime,
        endTime,
        therapistId: selectedTherapistId,
        therapistName: therapist?.name || 'Assigned Therapist',
        roomId: selectedRoomId,
        roomName: room?.name || 'Standard Treatment Room',
        addOnIds: selectedAddOnIds,
        totalPriceMxn: totalPrice,
        depositPaidMxn: depositRequired,
        remainingBalanceMxn: remainingBalance,
        status: 'confirmed',
        notes
      });

      setIsSubmitting(false);
      navigate(`/booking-confirmation?ref=${newBooking.bookingRef}&id=${newBooking.id}`);
    } catch (e) {
      setIsSubmitting(false);
      setConflictError('Failed to confirm reservation. Please try again.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)' }}>
      <PublicNavbar />

      <main style={{ paddingTop: '100px', paddingBottom: 'var(--space-16)' }}>
        <div className="container-max" style={{ maxWidth: '840px' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
            <span
              style={{
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                color: 'var(--accent-primary)',
                fontWeight: 600,
                display: 'block',
                marginBottom: 6
              }}
            >
              CASA MAREA SANCTUARY
            </span>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.25rem', marginBottom: 8 }}>
              {isEs ? 'Reserve su Experiencia de Spa' : 'Reserve Your Spa Sanctuary Experience'}
            </h1>
            <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>
              {isEs
                ? 'Un viaje restaurativo frente al mar. Seleccione su tratamiento y confirme su anticipo digital.'
                : 'A restorative coastal ritual overlooking the Sea of Cortez. Choose your ritual and secure your deposit.'}
            </p>
          </div>

          {/* Stepper Indicator */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              marginBottom: 'var(--space-8)'
            }}
          >
            {[
              { num: 1, label: isEs ? 'Tratamiento' : 'Treatment' },
              { num: 2, label: isEs ? 'Fecha y Horario' : 'Schedule' },
              { num: 3, label: isEs ? 'Huésped y Extras' : 'Guest & Add-ons' },
              { num: 4, label: isEs ? 'Confirmación' : 'Payment & Review' }
            ].map((s, idx) => (
              <React.Fragment key={s.num}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: '0.8125rem',
                    fontWeight: step === s.num ? 700 : 500,
                    color: step >= s.num ? 'var(--accent-primary)' : 'var(--text-secondary)'
                  }}
                >
                  <span
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      backgroundColor: step >= s.num ? 'var(--accent-primary)' : 'var(--surface-secondary)',
                      color: step >= s.num ? '#FFFFFF' : 'var(--text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem'
                    }}
                  >
                    {s.num}
                  </span>
                  <span className="stepper-label">{s.label}</span>
                </div>
                {idx < 3 && <div style={{ width: 24, height: 1, backgroundColor: 'var(--border-subtle)' }} />}
              </React.Fragment>
            ))}
          </div>

          {/* Booking Card Canvas */}
          <div className="card" style={{ padding: 'var(--space-8)' }}>
            {/* Step 1: Treatment Selection */}
            {step === 1 && (
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: 16 }}>{isEs ? '1. Seleccione su Tratamiento' : '1. Select Your Spa Treatment'}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                  {treatments.map(tItem => {
                    const isSelected = selectedTreatment.id === tItem.id;
                    return (
                      <div
                        key={tItem.id}
                        onClick={() => setSelectedTreatment(tItem)}
                        style={{
                          padding: '16px',
                          borderRadius: 'var(--radius-md)',
                          border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                          backgroundColor: isSelected ? 'var(--accent-primary-light)' : '#FFFFFF',
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          transition: 'all var(--transition-fast)'
                        }}
                      >
                        <div style={{ flex: 1, paddingRight: 16 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <span style={{ fontWeight: 600, fontSize: '1rem', color: isSelected ? 'var(--accent-primary)' : 'var(--text-primary)' }}>
                              {tItem.name}
                            </span>
                            <span className="badge badge-neutral">{tItem.durationMinutes} min</span>
                          </div>
                          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0 }}>
                            {tItem.description}
                          </p>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                            {formatPrice(tItem.priceMxn)}
                          </div>
                          <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>
                            Deposit: {formatPrice(Math.round(tItem.priceMxn * 0.5))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button onClick={() => setStep(2)} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <span>{isEs ? 'Continuar a Fecha y Horario' : 'Continue to Schedule'}</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Date, Time Slot & Resource Assignment */}
            {step === 2 && (
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: 16 }}>{isEs ? '2. Elija Fecha, Horario y Recursos' : '2. Choose Date, Time & Resource'}</h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 20 }}>
                  <div>
                    <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                      {t('selectDate')}
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={e => setSelectedDate(e.target.value)}
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                      {t('selectTherapist')}
                    </label>
                    <select
                      value={selectedTherapistId}
                      onChange={e => setSelectedTherapistId(e.target.value)}
                      style={{ width: '100%' }}
                    >
                      {therapists.map(th => (
                        <option key={th.id} value={th.id}>
                          {th.name} ({th.specialties[0]})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                      {t('selectRoom')}
                    </label>
                    <select
                      value={selectedRoomId}
                      onChange={e => setSelectedRoomId(e.target.value)}
                      style={{ width: '100%' }}
                    >
                      {rooms.map(rm => (
                        <option key={rm.id} value={rm.id}>
                          {rm.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Time Slots Grid */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: 8 }}>
                    {t('selectTime')} ({selectedTreatment.durationMinutes} min appointment)
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: 8 }}>
                    {TIME_SLOTS.map(timeStr => {
                      const isSelected = selectedTime === timeStr;
                      return (
                        <button
                          key={timeStr}
                          type="button"
                          onClick={() => setSelectedTime(timeStr)}
                          className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                          style={{ padding: '10px 0', fontSize: '0.875rem' }}
                        >
                          {timeStr}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Conflict warning banner */}
                {conflictError && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', backgroundColor: 'var(--state-error-bg)', color: 'var(--state-error)', borderRadius: 'var(--radius-md)', fontSize: '0.8125rem', marginBottom: 20 }}>
                    <AlertCircle size={18} style={{ flexShrink: 0 }} />
                    <span>{conflictError}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <button onClick={() => setStep(1)} className="btn btn-ghost">
                    <ArrowLeft size={16} />
                    <span>{isEs ? 'Volver' : 'Back'}</span>
                  </button>
                  <button onClick={handleNextToStep3} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <span>{isEs ? 'Continuar a Huésped y Extras' : 'Continue to Guest Details'}</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Add-ons & Guest Details */}
            {step === 3 && (
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: 16 }}>{isEs ? '3. Datos del Huésped y Complementos' : '3. Guest Details & Complementary Rituals'}</h3>

                {/* Add-ons */}
                {selectedTreatment.addOns.length > 0 && (
                  <div style={{ marginBottom: 24 }}>
                    <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: 8 }}>
                      Enhance Your Ritual (Optional Add-ons):
                    </label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {selectedTreatment.addOns.map(add => {
                        const isChecked = selectedAddOnIds.includes(add.id);
                        return (
                          <div
                            key={add.id}
                            onClick={() => {
                              if (isChecked) {
                                setSelectedAddOnIds(prev => prev.filter(id => id !== add.id));
                              } else {
                                setSelectedAddOnIds(prev => [...prev, add.id]);
                              }
                            }}
                            style={{
                              padding: '10px 14px',
                              borderRadius: 'var(--radius-sm)',
                              border: isChecked ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                              backgroundColor: isChecked ? 'var(--accent-primary-light)' : '#FFFFFF',
                              cursor: 'pointer',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              fontSize: '0.8125rem'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <input type="checkbox" checked={isChecked} readOnly />
                              <span style={{ fontWeight: 600 }}>{add.name}</span>
                              {add.durationMinutes > 0 && <span className="badge badge-neutral">+{add.durationMinutes}m</span>}
                            </div>
                            <strong>+{formatPrice(add.priceMxn)}</strong>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Guest Inputs */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={guestName}
                      onChange={e => setGuestName(e.target.value)}
                      style={{ width: '100%' }}
                      placeholder="e.g. Camila Wright"
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={guestEmail}
                      onChange={e => setGuestEmail(e.target.value)}
                      style={{ width: '100%' }}
                      placeholder="e.g. c.wright@example.com"
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      value={guestPhone}
                      onChange={e => setGuestPhone(e.target.value)}
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                      Room Number (If currently in-house)
                    </label>
                    <input
                      type="text"
                      value={roomNumber}
                      onChange={e => setRoomNumber(e.target.value)}
                      style={{ width: '100%' }}
                      placeholder="e.g. 321"
                    />
                  </div>
                </div>

                <div style={{ marginBottom: 24 }}>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                    Special Requests or Therapist Preferences
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <button onClick={() => setStep(2)} className="btn btn-ghost">
                    <ArrowLeft size={16} />
                    <span>{isEs ? 'Volver' : 'Back'}</span>
                  </button>
                  <button onClick={handleNextToStep4} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <span>{isEs ? 'Revisar y Confirmar Anticipo' : 'Review & Pay Deposit'}</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Review & Payment Simulation */}
            {step === 4 && (
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: 16 }}>{isEs ? '4. Resumen y Anticipo Digital' : '4. Booking Summary & Digital Deposit'}</h3>

                <div style={{ backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)', padding: '20px', marginBottom: 24, border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 16 }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Treatment</div>
                      <strong style={{ fontSize: '0.9375rem' }}>{selectedTreatment.name}</strong>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Date & Time</div>
                      <strong style={{ fontSize: '0.9375rem' }}>{selectedDate} at {selectedTime}</strong>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Therapist & Cabin</div>
                      <strong style={{ fontSize: '0.9375rem' }}>
                        {therapists.find(t => t.id === selectedTherapistId)?.name} · {rooms.find(r => r.id === selectedRoomId)?.name}
                      </strong>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Guest Details</div>
                      <strong style={{ fontSize: '0.9375rem' }}>{guestName} (Rm {roomNumber})</strong>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px dashed var(--border-subtle)', paddingTop: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: 4 }}>
                      <span>Treatment Price:</span>
                      <span>{formatPrice(treatmentPrice)}</span>
                    </div>
                    {addOnsTotal > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: 4 }}>
                        <span>Enhancement Add-ons:</span>
                        <span>{formatPrice(addOnsTotal)}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9375rem', fontWeight: 600, marginTop: 6 }}>
                      <span>Total Ritual Fee:</span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.0625rem', fontWeight: 700, color: 'var(--accent-primary)', marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--border-subtle)' }}>
                      <span>50% Deposit Due Now (Stripe Simulation):</span>
                      <span>{formatPrice(depositRequired)}</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'right', marginTop: 2 }}>
                      Remaining balance of {formatPrice(remainingBalance)} payable at resort checkout.
                    </div>
                  </div>
                </div>

                {/* Simulated Payment Box */}
                <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '16px', marginBottom: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <CreditCard size={18} color="var(--accent-primary)" />
                    <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Stripe Digital Booking Simulation</span>
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: 8 }}>
                    Deposit will be authorized and recorded in local demo state. Booking will automatically populate the Operations Spa Calendar (`/app/spa`).
                  </p>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--state-success)' }}>
                    <ShieldCheck size={14} />
                    <span>Demo mode: No actual credit card charge is incurred.</span>
                  </div>
                </div>

                {conflictError && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', backgroundColor: 'var(--state-error-bg)', color: 'var(--state-error)', borderRadius: 'var(--radius-md)', fontSize: '0.8125rem', marginBottom: 20 }}>
                    <AlertCircle size={16} />
                    <span>{conflictError}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <button onClick={() => setStep(3)} className="btn btn-ghost" disabled={isSubmitting}>
                    <ArrowLeft size={16} />
                    <span>{isEs ? 'Volver' : 'Back'}</span>
                  </button>
                  <button
                    onClick={handleConfirmBooking}
                    className="btn btn-warm btn-lg"
                    disabled={isSubmitting}
                    style={{ minWidth: '220px' }}
                  >
                    {isSubmitting ? 'Confirming Reservation...' : `Confirm & Pay Deposit (${formatPrice(depositRequired)})`}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};
