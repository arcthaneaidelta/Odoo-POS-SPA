import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Building,
  Sparkles,
  CreditCard,
  FileText,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Guest } from '../../types';

export const GuestsPage: React.FC = () => {
  const {
    guests,
    formatPrice,
    spaBookings,
    folioPostings,
    orders,
    payments,
    invoices,
    settings,
    t
  } = useApp();
  const isEs = settings.language === 'es';

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'in-house' | 'arriving' | 'departed'>('all');
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(guests[0] || null);

  const filteredGuests = guests.filter(g => {
    if (statusFilter !== 'all' && g.stayStatus !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        g.name.toLowerCase().includes(q) ||
        g.roomNumber.includes(q) ||
        g.reservationRef.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Related records for the selected guest
  const guestSpaBookings = selectedGuest
    ? spaBookings.filter(b => b.guestId === selectedGuest.id || b.guestName.toLowerCase().includes(selectedGuest.name.toLowerCase()))
    : [];

  const guestFolioPostings = selectedGuest
    ? folioPostings.filter(f => f.guestId === selectedGuest.id || f.roomNumber === selectedGuest.roomNumber)
    : [];

  const guestOrders = selectedGuest
    ? orders.filter(o => o.guestId === selectedGuest.id || o.roomNumber === selectedGuest.roomNumber)
    : [];

  const guestPayments = selectedGuest
    ? payments.filter(p => p.guestId === selectedGuest.id || p.guestName.toLowerCase().includes(selectedGuest.name.toLowerCase()))
    : [];

  const getStatusBadge = (status: Guest['stayStatus']) => {
    switch (status) {
      case 'in-house':
        return <span className="badge badge-success">In-House</span>;
      case 'arriving':
        return <span className="badge badge-warning">Arriving Today</span>;
      case 'departed':
        return <span className="badge badge-neutral">Departed</span>;
      case 'vip':
        return <span className="badge badge-terracotta">VIP Guest</span>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>{t('menuGuests')}</h2>
          <span className="badge badge-teal">Property Management Ledger</span>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginTop: 2 }}>
          Guest directory, in-house stay validation, and unified cross-outlet transaction profiles.
        </p>
      </div>

      {/* Search and Filters Ribbon */}
      <div
        className="card"
        style={{
          padding: '14px 18px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 12
        }}
      >
        <div style={{ position: 'relative', minWidth: '260px', flex: 1 }}>
          <Search size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: 10, top: 11 }} />
          <input
            type="text"
            placeholder="Search by guest name, room number, or reservation ref..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ width: '100%', paddingLeft: 34, fontSize: '0.8125rem' }}
          />
        </div>

        <div style={{ display: 'flex', gap: 6 }}>
          {[
            { id: 'all', label: 'All Guests' },
            { id: 'in-house', label: 'In House' },
            { id: 'arriving', label: 'Arriving' },
            { id: 'departed', label: 'Departed' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id as any)}
              className={`btn btn-sm ${statusFilter === f.id ? 'btn-primary' : 'btn-secondary'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content: Guest Table + Detail Drawer */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 'var(--space-6)',
          alignItems: 'start'
        }}
        className="guests-layout-grid"
      >
        {/* Guest Directory Table */}
        <div className="table-container">
          <table className="luxury-table">
            <thead>
              <tr>
                <th>Guest Name</th>
                <th>Room #</th>
                <th>Reservation Ref</th>
                <th>Stay Dates</th>
                <th>Status</th>
                <th>Folio Balance</th>
                <th>VIP Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredGuests.map(guest => {
                const isSelected = selectedGuest?.id === guest.id;
                return (
                  <tr
                    key={guest.id}
                    onClick={() => setSelectedGuest(guest)}
                    style={{
                      cursor: 'pointer',
                      backgroundColor: isSelected ? 'var(--accent-primary-light)' : 'transparent'
                    }}
                  >
                    <td>
                      <strong>{guest.name}</strong>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>
                        {guest.email}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-neutral" style={{ fontWeight: 700 }}>
                        Rm {guest.roomNumber}
                      </span>
                    </td>
                    <td>
                      <code style={{ fontSize: '0.75rem', color: 'var(--accent-primary)' }}>
                        {guest.reservationRef}
                      </code>
                    </td>
                    <td style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {guest.arrivalDate} → {guest.departureDate}
                    </td>
                    <td>{getStatusBadge(guest.stayStatus)}</td>
                    <td>
                      <strong style={{ color: guest.folioBalanceMxn > 0 ? 'var(--accent-primary)' : 'var(--text-secondary)' }}>
                        {formatPrice(guest.folioBalanceMxn)}
                      </strong>
                    </td>
                    <td>
                      <span className="badge badge-terracotta">
                        {guest.vipTier || 'Standard'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Guest Profile Panel */}
        {selectedGuest && (
          <div className="card" style={{ padding: 'var(--space-6)', position: 'sticky', top: 80 }}>
            {/* Header info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <span className="badge badge-terracotta" style={{ marginBottom: 6 }}>
                  {selectedGuest.vipTier}
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                  {selectedGuest.name}
                </h3>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                  {selectedGuest.email} · {selectedGuest.phone}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Room Assigned</div>
                <strong style={{ fontSize: '1.125rem', color: 'var(--accent-primary)' }}>
                  Room {selectedGuest.roomNumber}
                </strong>
              </div>
            </div>

            {/* Folio Balance Card */}
            <div
              style={{
                backgroundColor: 'var(--accent-primary-light)',
                border: '1px solid rgba(73, 108, 104, 0.2)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                marginBottom: 20
              }}
            >
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-primary)', fontWeight: 600 }}>
                Total Outstanding Folio Balance
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--accent-primary)', marginTop: 4 }}>
                {formatPrice(selectedGuest.folioBalanceMxn)}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                Synchronized with simulated PMS room charges
              </div>
            </div>

            {/* Related Tabs Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Linked Room Charges */}
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 6 }}>
                  Posted Room Charges ({guestFolioPostings.length})
                </div>
                {guestFolioPostings.length === 0 ? (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>No charges posted yet.</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {guestFolioPostings.map(f => (
                      <div
                        key={f.id}
                        style={{
                          padding: '8px 10px',
                          backgroundColor: 'var(--bg-main)',
                          borderRadius: 'var(--radius-sm)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: '0.75rem'
                        }}
                      >
                        <div>
                          <strong>{f.postingRef}</strong> · {f.sourceOutlet}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span className={`badge ${f.status === 'posted' ? 'badge-success' : 'badge-error'}`}>
                            {f.status}
                          </span>
                          <strong>{formatPrice(f.amountMxn)}</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Linked Spa Bookings */}
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 6 }}>
                  Spa Ritual Appointments ({guestSpaBookings.length})
                </div>
                {guestSpaBookings.length === 0 ? (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>No spa bookings recorded.</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {guestSpaBookings.map(b => (
                      <div
                        key={b.id}
                        style={{
                          padding: '8px 10px',
                          backgroundColor: 'var(--bg-main)',
                          borderRadius: 'var(--radius-sm)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: '0.75rem'
                        }}
                      >
                        <div>
                          <strong>{b.bookingRef}</strong> · {b.treatmentName}
                          <div style={{ color: 'var(--text-secondary)' }}>{b.date} at {b.startTime} ({b.therapistName})</div>
                        </div>
                        <span className="badge badge-teal">{b.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (min-width: 992px) {
          .guests-layout-grid {
            grid-template-columns: 1fr 340px !important;
          }
        }
      `}</style>
    </div>
  );
};
