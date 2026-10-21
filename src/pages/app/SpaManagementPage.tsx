import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Calendar,
  Clock,
  User,
  Plus,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Filter,
  DollarSign,
  Play,
  CheckSquare,
  Building,
  CreditCard
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SpaBooking, SpaBookingStatus } from '../../types';

export const SpaManagementPage: React.FC = () => {
  const {
    spaBookings,
    treatments,
    therapists,
    rooms,
    formatPrice,
    updateSpaBookingStatus,
    sendSpaBalanceToPos,
    settings,
    t,
    addToast
  } = useApp();
  const navigate = useNavigate();
  const isEs = settings.language === 'es';

  const [viewMode, setViewMode] = useState<'calendar' | 'agenda' | 'catalog'>('calendar');
  const [selectedBooking, setSelectedBooking] = useState<SpaBooking | null>(spaBookings[0] || null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Stats calculation
  const totalTreatments = spaBookings.length;
  const checkedInCount = spaBookings.filter(b => b.status === 'checked_in').length;
  const inTreatmentCount = spaBookings.filter(b => b.status === 'in_treatment').length;
  const completedCount = spaBookings.filter(b => b.status === 'completed').length;
  const pendingDeposits = spaBookings.filter(b => b.status === 'pending_deposit').length;

  const filteredBookings = spaBookings.filter(b => {
    if (statusFilter !== 'all' && b.status !== statusFilter) return false;
    return true;
  });

  const getStatusBadge = (status: SpaBookingStatus) => {
    switch (status) {
      case 'pending_deposit':
        return <span className="badge badge-warning">{t('statusPendingDeposit')}</span>;
      case 'confirmed':
        return <span className="badge badge-teal">{t('statusConfirmed')}</span>;
      case 'checked_in':
        return <span className="badge badge-success">{t('statusCheckedIn')}</span>;
      case 'in_treatment':
        return <span className="badge badge-terracotta">{t('statusInTreatment')}</span>;
      case 'completed':
        return <span className="badge badge-neutral">{t('statusCompleted')}</span>;
      case 'cancelled':
        return <span className="badge badge-error">{t('statusCancelled')}</span>;
    }
  };

  // Scenario B: Booking-to-Treatment-to-POS Action Handler
  const handleNextStatus = (booking: SpaBooking) => {
    if (booking.status === 'confirmed') {
      updateSpaBookingStatus(booking.id, 'checked_in');
      setSelectedBooking({ ...booking, status: 'checked_in' });
    } else if (booking.status === 'checked_in') {
      updateSpaBookingStatus(booking.id, 'in_treatment');
      setSelectedBooking({ ...booking, status: 'in_treatment' });
    } else if (booking.status === 'in_treatment') {
      updateSpaBookingStatus(booking.id, 'completed');
      setSelectedBooking({ ...booking, status: 'completed' });
    }
  };

  const handleChargeRemainingBalance = (booking: SpaBooking) => {
    sendSpaBalanceToPos(booking.id);
    navigate('/app/pos');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>{t('spaTitle')}</h2>
            <span className="badge badge-terracotta">Sanctuary Calendar</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginTop: 2 }}>
            Therapist scheduling, mandatory 15-minute sanitation buffers, and seamless POS balance routing.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => navigate('/book-spa')} className="btn btn-warm btn-sm">
            <Plus size={15} />
            <span>Public Booking Wizard</span>
          </button>
        </div>
      </div>

      {/* Spa KPI ribbon (PRD Section 9.1) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)' }}>
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600, marginBottom: 4 }}>
            Today's Bookings
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {totalTreatments}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Across all 4 cabins</div>
        </div>

        <div className="card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600, marginBottom: 4 }}>
            Checked In / In Treatment
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
            {checkedInCount + inTreatmentCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--state-success)' }}>Active in sanctuary</div>
        </div>

        <div className="card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600, marginBottom: 4 }}>
            Completed Today
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--state-success)' }}>
            {completedCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Ready for folio checkout</div>
        </div>

        <div className="card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600, marginBottom: 4 }}>
            Pending Deposits
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: pendingDeposits > 0 ? 'var(--state-warning)' : 'var(--text-primary)' }}>
            {pendingDeposits}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--state-warning)' }}>50% required deposit</div>
        </div>
      </div>

      {/* View Switcher Tabs & Filter */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {[
            { id: 'calendar', label: t('calendarDay') },
            { id: 'agenda', label: t('calendarAgenda') },
            { id: 'catalog', label: t('treatmentCatalog') }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setViewMode(tab.id as any)}
              className={`btn btn-sm ${viewMode === tab.id ? 'btn-primary' : 'btn-secondary'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Status filter */}
        <div style={{ display: 'flex', gap: 6 }}>
          {['all', 'confirmed', 'checked_in', 'in_treatment', 'completed'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`btn btn-sm ${statusFilter === st ? 'btn-primary' : 'btn-ghost'}`}
              style={{ fontSize: '0.75rem', textTransform: 'capitalize' }}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Main Spa Workspace Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 'var(--space-6)',
          alignItems: 'start'
        }}
        className="spa-workspace-grid"
      >
        {/* Left: Calendar Day View or Agenda Table */}
        {viewMode === 'calendar' ? (
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Calendar size={18} color="var(--accent-primary)" />
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>
                  Sanctuary Cabins · October 21, 2026
                </h3>
              </div>
              <span className="badge badge-teal">Buffer: 15m Sanitation</span>
            </div>

            {/* Room columns grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 12
              }}
            >
              {rooms.map(room => {
                const roomBookings = filteredBookings.filter(b => b.roomId === room.id);
                return (
                  <div
                    key={room.id}
                    style={{
                      backgroundColor: 'var(--bg-main)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '14px',
                      display: 'flex',
                      flexDirection: 'column',
                      minHeight: '360px'
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: 2 }}>
                      {room.name.split(' (')[0]}
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
                      {room.type} cabin
                    </div>

                    {/* Bookings inside this room */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                      {roomBookings.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '32px 8px', fontSize: '0.75rem', color: 'var(--text-secondary)', border: '1px dashed var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}>
                          Available all day
                        </div>
                      ) : (
                        roomBookings.map(bk => {
                          const isSelected = selectedBooking?.id === bk.id;
                          return (
                            <div
                              key={bk.id}
                              onClick={() => setSelectedBooking(bk)}
                              style={{
                                padding: '12px',
                                backgroundColor: isSelected ? 'var(--accent-primary-light)' : '#FFFFFF',
                                border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                                borderRadius: 'var(--radius-sm)',
                                cursor: 'pointer',
                                boxShadow: 'var(--shadow-sm)',
                                transition: 'all var(--transition-fast)'
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                                <strong style={{ fontSize: '0.8125rem' }}>{bk.startTime} - {bk.endTime}</strong>
                                {getStatusBadge(bk.status)}
                              </div>
                              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--accent-primary)', marginBottom: 2 }}>
                                {bk.treatmentName}
                              </div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-primary)' }}>
                                {bk.guestName}
                              </div>
                              <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                                Therapist: {bk.therapistName}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : viewMode === 'agenda' ? (
          /* Agenda Table */
          <div className="table-container">
            <table className="luxury-table">
              <thead>
                <tr>
                  <th>Booking Ref</th>
                  <th>Guest</th>
                  <th>Treatment</th>
                  <th>Time Slot</th>
                  <th>Therapist</th>
                  <th>Cabin</th>
                  <th>Status</th>
                  <th>Total / Due</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map(bk => (
                  <tr key={bk.id} onClick={() => setSelectedBooking(bk)} style={{ cursor: 'pointer' }}>
                    <td><strong>{bk.bookingRef}</strong></td>
                    <td>{bk.guestName}</td>
                    <td>{bk.treatmentName}</td>
                    <td>{bk.startTime} - {bk.endTime}</td>
                    <td>{bk.therapistName}</td>
                    <td>{bk.roomName.split(' (')[0]}</td>
                    <td>{getStatusBadge(bk.status)}</td>
                    <td>
                      <div>{formatPrice(bk.totalPriceMxn)}</div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--accent-primary)' }}>
                        Due: {formatPrice(bk.remainingBalanceMxn)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Treatment Catalog */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {treatments.map(trt => (
              <div key={trt.id} className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <span className="badge badge-neutral">{trt.category}</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{trt.durationMinutes} min</span>
                </div>
                <h4 style={{ fontSize: '1.125rem', marginBottom: 6 }}>{trt.name}</h4>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 16 }}>
                  {trt.description}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: 12 }}>
                  <strong style={{ fontSize: '1.125rem', color: 'var(--accent-primary)' }}>{formatPrice(trt.priceMxn)}</strong>
                  <button onClick={() => navigate('/book-spa')} className="btn btn-secondary btn-sm">
                    Book Treatment
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Right: Selected Booking Detail & Workflow Actions (Scenario B) */}
        {selectedBooking && (
          <div className="card" style={{ padding: 'var(--space-6)', position: 'sticky', top: 80 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Selected Appointment</span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                  {selectedBooking.bookingRef}
                </h3>
              </div>
              {getStatusBadge(selectedBooking.status)}
            </div>

            {/* Appointment detail list */}
            <div style={{ backgroundColor: 'var(--bg-main)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: 20, fontSize: '0.8125rem' }}>
              <div style={{ marginBottom: 10 }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Guest Name</span>
                <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{selectedBooking.guestName}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{selectedBooking.guestEmail} · {selectedBooking.guestPhone}</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, borderTop: '1px solid var(--border-subtle)', paddingTop: 10, marginBottom: 10 }}>
                <div>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Treatment</span>
                  <div style={{ fontWeight: 600 }}>{selectedBooking.treatmentName}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Duration</span>
                  <div>{selectedBooking.durationMinutes} min</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Therapist</span>
                  <div style={{ fontWeight: 600 }}>{selectedBooking.therapistName}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Cabin</span>
                  <div>{selectedBooking.roomName}</div>
                </div>
              </div>

              {selectedBooking.notes && (
                <div style={{ borderTop: '1px dashed var(--border-subtle)', paddingTop: 8, marginBottom: 10, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  <strong>Notes:</strong> {selectedBooking.notes}
                </div>
              )}

              {/* Financial Balance Breakdown */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Total Fee:</span>
                  <span>{formatPrice(selectedBooking.totalPriceMxn)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Deposit Paid (50%):</span>
                  <span style={{ color: 'var(--state-success)', fontWeight: 600 }}>{formatPrice(selectedBooking.depositPaidMxn)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: 'var(--accent-primary)', fontSize: '0.9375rem', marginTop: 4, paddingTop: 4, borderTop: '1px dashed var(--border-subtle)' }}>
                  <span>Remaining Balance:</span>
                  <span>{formatPrice(selectedBooking.remainingBalanceMxn)}</span>
                </div>
              </div>
            </div>

            {/* Workflow Action Steps (Scenario B: Booking -> Check-in -> Treatment -> POS) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {selectedBooking.status === 'confirmed' && (
                <button
                  onClick={() => handleNextStatus(selectedBooking)}
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                >
                  <CheckSquare size={16} />
                  <span>{t('checkInGuest')}</span>
                </button>
              )}

              {selectedBooking.status === 'checked_in' && (
                <button
                  onClick={() => handleNextStatus(selectedBooking)}
                  className="btn btn-warm"
                  style={{ width: '100%' }}
                >
                  <Play size={16} />
                  <span>{t('startTreatment')}</span>
                </button>
              )}

              {selectedBooking.status === 'in_treatment' && (
                <button
                  onClick={() => handleNextStatus(selectedBooking)}
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                >
                  <CheckCircle2 size={16} />
                  <span>{t('completeTreatment')}</span>
                </button>
              )}

              {/* Once completed or checked in, allow charging remaining balance to POS checkout */}
              {(selectedBooking.status === 'completed' || selectedBooking.status === 'checked_in') && (
                <button
                  onClick={() => handleChargeRemainingBalance(selectedBooking)}
                  className="btn btn-primary"
                  style={{ width: '100%', backgroundColor: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                >
                  <DollarSign size={16} />
                  <span>{t('sendBalanceToPos')} ({formatPrice(selectedBooking.remainingBalanceMxn)})</span>
                  <ArrowRight size={14} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (min-width: 992px) {
          .spa-workspace-grid {
            grid-template-columns: 1fr 340px !important;
          }
        }
      `}</style>
    </div>
  );
};
