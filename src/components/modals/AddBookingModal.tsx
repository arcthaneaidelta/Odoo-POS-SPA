import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useDemo } from '../../context/DemoContext';
import { PlatformChannel } from '../../types';
import { Plus } from 'lucide-react';

interface AddBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddBookingModal: React.FC<AddBookingModalProps> = ({ isOpen, onClose }) => {
  const { dispatch, addToast } = useDemo();

  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('+49 170 555 8821');
  const [unit, setUnit] = useState('Son Felipe · Luxury Suite');
  const [platform, setPlatform] = useState<PlatformChannel>('Direct');
  const [checkInDate, setCheckInDate] = useState('2026-11-20');
  const [checkOutDate, setCheckOutDate] = useState('2026-11-25');
  const [nights, setNights] = useState(5);
  const [totalAmount, setTotalAmount] = useState(2950);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName) {
      addToast('Validation Error', 'Guest name is required.', 'error');
      return;
    }

    dispatch({
      type: 'ADD_BOOKING',
      payload: {
        guestName,
        guestEmail: guestEmail || `${guestName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        guestPhone,
        unit,
        platform,
        status: 'confirmed',
        statusLabel: 'Bestätigt',
        bookedDate: new Date().toISOString().split('T')[0],
        checkInDate,
        checkOutDate,
        nights,
        guestsCount: 2,
        totalAmount,
        commissionAmount: platform === 'Direct' ? 0 : totalAmount * 0.15,
        cleaningFee: 150,
        notes: 'Manually entered booking reservation.',
      },
    });

    addToast('Booking Added', `Confirmed reservation for ${guestName} (€${totalAmount})`, 'success');
    setGuestName('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Reservation"
      subtitle="Manually register a direct or external channel reservation"
      maxWidth="560px"
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} iconLeft={<Plus size={15} />}>
            Create Reservation
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
            Guest Full Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Helena Von Berg"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            style={{
              width: '100%',
              padding: '0.55rem 0.85rem',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              outline: 'none',
            }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
              Guest Email
            </label>
            <input
              type="email"
              placeholder="guest@domain.com"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 0.85rem',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
              Unit / Room
            </label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 0.85rem',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                outline: 'none',
                backgroundColor: '#FFFFFF',
              }}
            >
              <option value="Son Felipe · Luxury Suite">Son Felipe · Luxury Suite</option>
              <option value="Brunnenstrasse · Room 140">Brunnenstrasse · Room 140</option>
              <option value="Brunnenstrasse · Room 142">Brunnenstrasse · Room 142</option>
              <option value="Stellar test · Villa Alpha">Stellar test · Villa Alpha</option>
              <option value="Emerald · Room 32">Emerald · Room 32</option>
              <option value="Sa Taulera · Room 287">Sa Taulera · Room 287</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
              Platform Source
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as PlatformChannel)}
              style={{
                width: '100%',
                padding: '0.55rem 0.85rem',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                outline: 'none',
                backgroundColor: '#FFFFFF',
              }}
            >
              <option value="Direct">Direct (0% commission)</option>
              <option value="Booking.com">Booking.com</option>
              <option value="Airbnb">Airbnb</option>
              <option value="Agoda">Agoda</option>
              <option value="Traveloka">Traveloka</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
              Total Amount (€)
            </label>
            <input
              type="number"
              value={totalAmount}
              onChange={(e) => setTotalAmount(Number(e.target.value))}
              style={{
                width: '100%',
                padding: '0.55rem 0.85rem',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                outline: 'none',
              }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
              Check-In (Anreise)
            </label>
            <input
              type="date"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 0.85rem',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
              Check-Out (Abreise)
            </label>
            <input
              type="date"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 0.85rem',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                outline: 'none',
              }}
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};
