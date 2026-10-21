import React, { useState } from 'react';
import {
  CreditCard,
  Banknote,
  Building,
  CheckCircle2,
  AlertCircle,
  X,
  Search,
  UserCheck,
  ShieldCheck
} from 'lucide-react';
import { PaymentMethodType, Guest } from '../../types';
import { useApp } from '../../context/AppContext';

interface CheckoutModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ onClose, onSuccess }) => {
  const {
    currentOrderLines,
    tipPercent,
    customTipAmount,
    settings,
    formatPrice,
    guests,
    checkoutOrder,
    t
  } = useApp();

  const [method, setMethod] = useState<PaymentMethodType>('room_charge');
  const [cashGiven, setCashGiven] = useState<number>(0);
  const [guestSearch, setGuestSearch] = useState<string>('');
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(
    guests.find(g => g.stayStatus === 'in-house') || null
  );
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Calculations
  const subtotal = currentOrderLines.reduce((acc, l) => acc + l.subtotalMxn, 0);
  const tax = Number((subtotal * (settings.taxRatePercent / 100)).toFixed(2));
  const serviceCharge = Number((subtotal * (settings.serviceChargePercent / 100)).toFixed(2));
  const tip = customTipAmount > 0 ? customTipAmount : Number((subtotal * (tipPercent / 100)).toFixed(2));
  const total = Number((subtotal + tax + serviceCharge + tip).toFixed(2));

  // Filter in-house guests for room charge
  const matchingGuests = guests.filter(
    g =>
      g.name.toLowerCase().includes(guestSearch.toLowerCase()) ||
      g.roomNumber.includes(guestSearch) ||
      g.reservationRef.toLowerCase().includes(guestSearch.toLowerCase())
  );

  const changeDue = Math.max(0, cashGiven - total);

  const handleConfirm = async () => {
    setValidationError(null);

    if (method === 'room_charge') {
      if (!selectedGuest) {
        setValidationError('Please select an in-house guest to post this charge.');
        return;
      }
      if (selectedGuest.stayStatus !== 'in-house') {
        setValidationError(`Guest ${selectedGuest.name} is marked as '${selectedGuest.stayStatus}'. Room charges are restricted to active in-house guests.`);
        return;
      }
    } else if (method === 'cash') {
      if (cashGiven < total) {
        setValidationError(`Cash provided (${formatPrice(cashGiven)}) is less than total due (${formatPrice(total)}).`);
        return;
      }
    }

    setIsProcessing(true);
    try {
      await checkoutOrder(method, selectedGuest?.id, cashGiven);
      setIsProcessing(false);
      onSuccess();
    } catch (err) {
      setIsProcessing(false);
      setValidationError('Failed to process checkout.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '540px' }}>
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>{t('checkoutTitle')}</h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              Total Due: <strong style={{ color: 'var(--accent-primary)', fontSize: '1rem' }}>{formatPrice(total)}</strong>
            </p>
          </div>
          <button onClick={onClose} className="btn-icon">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          {/* Payment Method Selector Tabs */}
          <div>
            <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>
              {t('paymentMethod')}
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              <button
                type="button"
                onClick={() => setMethod('room_charge')}
                style={{
                  padding: '12px 8px',
                  borderRadius: 'var(--radius-md)',
                  border: method === 'room_charge' ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                  backgroundColor: method === 'room_charge' ? 'var(--accent-primary-light)' : '#FFFFFF',
                  color: method === 'room_charge' ? 'var(--accent-primary)' : 'var(--text-primary)',
                  fontWeight: 600,
                  fontSize: '0.8125rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <Building size={20} />
                <span>{t('methodRoomCharge')}</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('digital')}
                style={{
                  padding: '12px 8px',
                  borderRadius: 'var(--radius-md)',
                  border: method === 'digital' ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                  backgroundColor: method === 'digital' ? 'var(--accent-primary-light)' : '#FFFFFF',
                  color: method === 'digital' ? 'var(--accent-primary)' : 'var(--text-primary)',
                  fontWeight: 600,
                  fontSize: '0.8125rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <CreditCard size={20} />
                <span>{t('methodDigital')}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMethod('cash');
                  if (cashGiven === 0) setCashGiven(Math.ceil(total / 100) * 100);
                }}
                style={{
                  padding: '12px 8px',
                  borderRadius: 'var(--radius-md)',
                  border: method === 'cash' ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                  backgroundColor: method === 'cash' ? 'var(--accent-primary-light)' : '#FFFFFF',
                  color: method === 'cash' ? 'var(--accent-primary)' : 'var(--text-primary)',
                  fontWeight: 600,
                  fontSize: '0.8125rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <Banknote size={20} />
                <span>{t('methodCash')}</span>
              </button>
            </div>
          </div>

          {/* Method 1: Guest Room Charge (PMS Folio Sync) */}
          {method === 'room_charge' && (
            <div style={{ backgroundColor: 'var(--bg-main)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{t('guestLookup')}</span>
                <span className="badge badge-teal">Scenario A Flow</span>
              </div>

              {/* Guest Search Input */}
              <div style={{ position: 'relative', marginBottom: 12 }}>
                <Search size={15} color="var(--text-secondary)" style={{ position: 'absolute', left: 10, top: 11 }} />
                <input
                  type="text"
                  placeholder={t('guestSearchPlaceholder')}
                  value={guestSearch}
                  onChange={e => setGuestSearch(e.target.value)}
                  style={{ width: '100%', paddingLeft: 34, fontSize: '0.8125rem' }}
                />
              </div>

              {/* In-House Guest Selectable Radio List */}
              <div style={{ maxHeight: '160px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {matchingGuests.map(guest => {
                  const isSelected = selectedGuest?.id === guest.id;
                  const isInHouse = guest.stayStatus === 'in-house';
                  return (
                    <div
                      key={guest.id}
                      onClick={() => setSelectedGuest(guest)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-sm)',
                        border: isSelected ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                        backgroundColor: isSelected ? '#FFFFFF' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {guest.name} · Rm {guest.roomNumber}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          {guest.reservationRef} · {guest.vipTier || 'Guest'}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className={`badge ${isInHouse ? 'badge-success' : 'badge-neutral'}`}>
                          {guest.stayStatus}
                        </span>
                        {isSelected && <CheckCircle2 size={16} color="var(--accent-primary)" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {selectedGuest && (
                <div style={{ marginTop: 12, padding: '10px 12px', backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Folio Destination:</span>
                    <strong>Room {selectedGuest.roomNumber} ({selectedGuest.name})</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Current Folio Balance:</span>
                    <span>{formatPrice(selectedGuest.folioBalanceMxn)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, paddingTop: 4, borderTop: '1px dashed var(--border-subtle)' }}>
                    <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>New Folio Balance:</span>
                    <strong style={{ color: 'var(--accent-primary)' }}>{formatPrice(selectedGuest.folioBalanceMxn + total)}</strong>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Method 2: Stripe Digital Payment */}
          {method === 'digital' && (
            <div style={{ backgroundColor: 'var(--bg-main)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <ShieldCheck size={18} color="var(--accent-primary)" />
                <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Stripe Digital Terminal Simulation</span>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
                Simulated contactless Apple Pay / Visa contactless transaction. No real payment credentials required.
              </p>
              <div style={{ padding: '12px', backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 4 }}>Simulated Processor Reference:</div>
                <div style={{ fontFamily: 'monospace', fontSize: '0.8125rem', color: 'var(--accent-primary)' }}>
                  pi_3Nx890_CasaMarea_Terminal01
                </div>
              </div>
            </div>
          )}

          {/* Method 3: Cash */}
          {method === 'cash' && (
            <div style={{ backgroundColor: 'var(--bg-main)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                  {t('cashReceived')}
                </label>
                <input
                  type="number"
                  step="50"
                  value={cashGiven || ''}
                  onChange={e => setCashGiven(Number(e.target.value))}
                  style={{ width: '100%', fontSize: '1.125rem', fontWeight: 600 }}
                />
              </div>

              {/* Quick Cash Buttons */}
              <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                {[total, Math.ceil(total / 100) * 100, Math.ceil(total / 500) * 500, Math.ceil(total / 1000) * 1000].map((amt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCashGiven(amt)}
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1, fontSize: '0.75rem' }}
                  >
                    ${amt}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{t('changeDue')}:</span>
                <strong style={{ fontSize: '1rem', color: changeDue >= 0 ? 'var(--state-success)' : 'var(--state-error)' }}>
                  {formatPrice(changeDue)}
                </strong>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {validationError && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', backgroundColor: 'var(--state-error-bg)', color: 'var(--state-error)', borderRadius: 'var(--radius-md)', fontSize: '0.8125rem' }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{validationError}</span>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" onClick={onClose} className="btn btn-ghost" disabled={isProcessing}>
            {t('cancel')}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="btn btn-primary"
            disabled={isProcessing}
            style={{ minWidth: '180px' }}
          >
            {isProcessing ? t('processingPayment') : t('confirmPayment')}
          </button>
        </div>
      </div>
    </div>
  );
};
