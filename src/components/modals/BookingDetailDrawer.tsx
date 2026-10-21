import React from 'react';
import { useDemo } from '../../context/DemoContext';
import { Drawer } from '../common/Drawer';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import {
  Calendar,
  User,
  CreditCard,
  Building,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  Zap,
  Download,
  Trash2,
} from 'lucide-react';

export const BookingDetailDrawer: React.FC = () => {
  const { state, dispatch, addToast, runScenario } = useDemo();

  const booking = state.bookings.find((b) => b.id === state.selectedBookingId);

  const handleClose = () => {
    dispatch({ type: 'SELECT_BOOKING', payload: null });
  };

  if (!booking) return null;

  const handleSetStatus = (status: 'confirmed' | 'cancelled') => {
    dispatch({
      type: 'UPDATE_BOOKING_STATUS',
      payload: {
        id: booking.id,
        status,
        label: status === 'confirmed' ? 'Bestätigt' : 'Storniert',
      },
    });
    addToast(
      'Booking Updated',
      `${booking.bookingNumber} marked as ${status === 'confirmed' ? 'Bestätigt' : 'Storniert'}`,
      'success'
    );
  };

  const handleDelete = () => {
    dispatch({ type: 'DELETE_BOOKING', payload: booking.id });
    addToast('Booking Deleted', `Removed ${booking.bookingNumber}`, 'info');
    handleClose();
  };

  const handleSimulateWaitlist = () => {
    handleClose();
    runScenario('cancellation_recovery');
  };

  return (
    <Drawer
      isOpen={Boolean(booking)}
      onClose={handleClose}
      title={booking.bookingNumber}
      subtitle={`Created on ${booking.bookedDate} via ${booking.platform}`}
      footer={
        <div style={{ display: 'flex', gap: '0.65rem', width: '100%', justifyContent: 'space-between' }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            iconLeft={<Trash2 size={15} color="#EF4444" />}
            style={{ color: '#EF4444' }}
          >
            Delete
          </Button>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {booking.status === 'confirmed' ? (
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleSetStatus('cancelled')}
                iconLeft={<XCircle size={15} />}
              >
                Mark Storniert
              </Button>
            ) : (
              <Button
                variant="emerald"
                size="sm"
                onClick={() => handleSetStatus('confirmed')}
                iconLeft={<CheckCircle size={15} />}
              >
                Mark Bestätigt
              </Button>
            )}

            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                addToast('Folio Downloaded', `Generated guest folio for ${booking.guestName}`, 'success');
              }}
              iconLeft={<Download size={14} />}
            >
              Export Folio
            </Button>
          </div>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Top Status & Summary Card */}
        <div
          style={{
            backgroundColor: '#F8FAFC',
            borderRadius: '12px',
            padding: '1.25rem',
            border: '1px solid #E2E8F0',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.75rem',
            }}
          >
            <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>
              Current Status
            </span>
            <Badge status={booking.status} label={booking.statusLabel} showDot />
          </div>

          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A' }}>
            €{booking.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '0.2rem' }}>
            {booking.nights} Nights · €{(booking.totalAmount / booking.nights).toFixed(2)}/night average
          </div>
        </div>

        {/* Guest Information */}
        <div>
          <h4
            style={{
              fontSize: '0.82rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: '#64748B',
              letterSpacing: '0.04em',
              marginBottom: '0.75rem',
            }}
          >
            Guest Profile
          </h4>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '10px',
              border: '1px solid #E2E8F0',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.88rem' }}>
              <User size={16} color="#0D4E43" />
              <strong style={{ color: '#0F172A' }}>{booking.guestName}</strong>
              <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>({booking.guestsCount} Guests)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.82rem', color: '#475569' }}>
              <Mail size={15} color="#64748B" />
              <span>{booking.guestEmail}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.82rem', color: '#475569' }}>
              <Phone size={15} color="#64748B" />
              <span>{booking.guestPhone}</span>
            </div>
          </div>
        </div>

        {/* Stay & Room Details */}
        <div>
          <h4
            style={{
              fontSize: '0.82rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: '#64748B',
              letterSpacing: '0.04em',
              marginBottom: '0.75rem',
            }}
          >
            Reservation Details
          </h4>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '10px',
              border: '1px solid #E2E8F0',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.88rem' }}>
              <Building size={16} color="#0D4E43" />
              <strong style={{ color: '#0F172A' }}>{booking.unit}</strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.82rem', color: '#475569' }}>
              <Calendar size={15} color="#64748B" />
              <span>
                <strong>Check-in (Anreise):</strong> {booking.checkInDate}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.82rem', color: '#475569' }}>
              <Calendar size={15} color="#64748B" />
              <span>
                <strong>Check-out (Abreise):</strong> {booking.checkOutDate}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.82rem', color: '#475569' }}>
              <CreditCard size={15} color="#64748B" />
              <span>
                Platform: <strong>{booking.platform}</strong> · Commission Saved: €{booking.commissionAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Special Instructions & Notes */}
        {booking.notes && (
          <div>
            <h4
              style={{
                fontSize: '0.82rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: '#64748B',
                letterSpacing: '0.04em',
                marginBottom: '0.5rem',
              }}
            >
              Operations & Concierge Notes
            </h4>
            <div
              style={{
                backgroundColor: '#F0FAF7',
                border: '1px solid #D1FAE5',
                borderRadius: '8px',
                padding: '0.85rem',
                fontSize: '0.82rem',
                color: '#065F46',
                lineHeight: 1.45,
              }}
            >
              {booking.notes}
            </div>
          </div>
        )}

        {/* Waitlist Recovery Trigger */}
        {booking.status === 'cancelled' && (
          <div
            style={{
              backgroundColor: '#FEF3C7',
              borderRadius: '10px',
              padding: '1rem',
              border: '1px solid #FDE68A',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <Zap size={16} color="#B45309" />
              <strong style={{ fontSize: '0.85rem', color: '#92400E' }}>
                Recover Cancelled Slot
              </strong>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#78350F', marginBottom: '0.75rem', lineHeight: 1.4 }}>
              Execute Scenario 4: Dynamic waitlist auto-fill will backfill this opened unit with a pre-authorized VIP guest in 1.2s.
            </p>
            <Button
              variant="emerald"
              size="sm"
              onClick={handleSimulateWaitlist}
              iconLeft={<Zap size={14} />}
            >
              Run Waitlist Recovery
            </Button>
          </div>
        )}
      </div>
    </Drawer>
  );
};
