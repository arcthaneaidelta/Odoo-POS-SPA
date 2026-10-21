import React, { useState, useMemo } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { AddBookingModal } from '../components/modals/AddBookingModal';
import { useDemo } from '../context/DemoContext';
import { Booking, BookingStatus, PlatformChannel } from '../types';
import {
  Calendar,
  Filter,
  Search,
  Download,
  Plus,
  Eye,
  Trash2,
  Home,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

export const BookingsPage: React.FC = () => {
  const { state, dispatch, addToast } = useDemo();
  const [activeTab, setActiveTab] = useState<'Calendar' | 'Bookings' | 'Issues'>('Bookings');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Filters matching Reference Image 3
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedQuarter, setSelectedQuarter] = useState('All');
  const [selectedPortal, setSelectedPortal] = useState('All');
  const [selectedUnit, setSelectedUnit] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [arrivalToggle, setArrivalToggle] = useState<'Anreise' | 'Ab'>('Anreise');

  // Filter Bookings
  const filteredBookings = useMemo(() => {
    return state.bookings.filter((b) => {
      if (selectedPortal !== 'All' && b.platform !== selectedPortal) return false;
      if (selectedStatus !== 'All' && b.status !== selectedStatus) return false;
      if (selectedUnit !== 'All' && !b.unit.toLowerCase().includes(selectedUnit.toLowerCase())) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesGuest = b.guestName.toLowerCase().includes(q);
        const matchesUnit = b.unit.toLowerCase().includes(q);
        const matchesNum = b.bookingNumber.toLowerCase().includes(q);
        if (!matchesGuest && !matchesUnit && !matchesNum) return false;
      }
      return true;
    });
  }, [state.bookings, selectedPortal, selectedStatus, selectedUnit, searchQuery]);

  const handleExportCSV = () => {
    addToast('CSV Exported', `Exported ${filteredBookings.length} booking records.`, 'success');
  };

  const getPortalIcon = (platform: PlatformChannel) => {
    switch (platform) {
      case 'Direct':
        return <Home size={15} color="#0D4E43" />;
      case 'Booking.com':
        return (
          <span
            style={{
              backgroundColor: '#003580',
              color: '#FFFFFF',
              width: '18px',
              height: '18px',
              borderRadius: '4px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.68rem',
              fontWeight: 800,
            }}
          >
            B
          </span>
        );
      case 'Airbnb':
        return (
          <span
            style={{
              backgroundColor: '#FF5A5F',
              color: '#FFFFFF',
              width: '18px',
              height: '18px',
              borderRadius: '4px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.68rem',
              fontWeight: 800,
            }}
          >
            A
          </span>
        );
      default:
        return <Home size={15} color="#64748B" />;
    }
  };

  return (
    <DashboardLayout
      title="Bookings & Reservations Hub"
      subtitle="Multi-channel reservation management, cross-portal reconciliation, and guest folio audit"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Top Navigation Tabs matching Reference Image 3 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem' }}>
          <button
            onClick={() => setActiveTab('Calendar')}
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: '8px',
              fontSize: '0.88rem',
              fontWeight: activeTab === 'Calendar' ? 700 : 500,
              color: activeTab === 'Calendar' ? '#0F172A' : '#64748B',
              backgroundColor: activeTab === 'Calendar' ? '#E2E8F0' : 'transparent',
            }}
          >
            Calendar
          </button>

          <button
            onClick={() => setActiveTab('Bookings')}
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: '8px',
              fontSize: '0.88rem',
              fontWeight: activeTab === 'Bookings' ? 700 : 500,
              color: activeTab === 'Bookings' ? '#0F172A' : '#64748B',
              backgroundColor: activeTab === 'Bookings' ? '#E2E8F0' : 'transparent',
            }}
          >
            Bookings
          </button>

          <button
            onClick={() => setActiveTab('Issues')}
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: '8px',
              fontSize: '0.88rem',
              fontWeight: activeTab === 'Issues' ? 700 : 500,
              color: activeTab === 'Issues' ? '#0F172A' : '#64748B',
              backgroundColor: activeTab === 'Issues' ? '#E2E8F0' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
            }}
          >
            <span>Issues</span>
            <span
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: '#EF4444',
                color: '#FFFFFF',
                fontSize: '0.68rem',
                fontWeight: 800,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              1
            </span>
          </button>
        </div>

        {/* Top KPI Cards Row matching Reference Image 3 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
          }}
        >
          {/* Card 1: Bookings */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1rem' }}>
            <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>Bookings</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', marginTop: '0.2rem' }}>
              {state.metrics.totalBookingsCount}
            </div>
          </div>

          {/* Card 2: Nights */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1rem' }}>
            <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>Nights</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', marginTop: '0.2rem' }}>
              {state.metrics.totalNights.toLocaleString()}
            </div>
          </div>

          {/* Card 3: Revenue */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1rem' }}>
            <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>Revenue</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', marginTop: '0.2rem' }}>
              684.746,52 €
            </div>
          </div>

          {/* Card 4: Commissions */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1rem' }}>
            <div style={{ fontSize: '0.78rem', color: '#D97706', fontWeight: 600 }}>Commissions</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#B45309', marginTop: '0.2rem' }}>
              68.201,76 €
            </div>
          </div>

          {/* Card 5: Reinigung (Cleaning) */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1rem' }}>
            <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>Reinigung</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', marginTop: '0.2rem' }}>
              24.533,00 €
            </div>
          </div>
        </div>

        {/* Filter Bar Toolbar matching Reference Image 3 */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            padding: '0.85rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#64748B', fontSize: '0.82rem', fontWeight: 600 }}>
            <Filter size={16} /> Filters:
          </div>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            style={{ fontSize: '0.8rem', padding: '0.35rem 0.65rem', borderRadius: '6px', border: '1px solid #CBD5E1', backgroundColor: '#F8FAFC' }}
          >
            <option value="All">Year: All</option>
            <option value="2026">2026</option>
            <option value="2025">2025</option>
          </select>

          <select
            value={selectedQuarter}
            onChange={(e) => setSelectedQuarter(e.target.value)}
            style={{ fontSize: '0.8rem', padding: '0.35rem 0.65rem', borderRadius: '6px', border: '1px solid #CBD5E1', backgroundColor: '#F8FAFC' }}
          >
            <option value="All">Quarter: All</option>
            <option value="Q1">Q1</option>
            <option value="Q2">Q2</option>
            <option value="Q3">Q3</option>
            <option value="Q4">Q4</option>
          </select>

          <select
            value={selectedPortal}
            onChange={(e) => setSelectedPortal(e.target.value)}
            style={{ fontSize: '0.8rem', padding: '0.35rem 0.65rem', borderRadius: '6px', border: '1px solid #CBD5E1', backgroundColor: '#F8FAFC' }}
          >
            <option value="All">Portal: All</option>
            <option value="Direct">Direct</option>
            <option value="Booking.com">Booking.com</option>
            <option value="Airbnb">Airbnb</option>
            <option value="Agoda">Agoda</option>
            <option value="Traveloka">Traveloka</option>
          </select>

          <select
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value)}
            style={{ fontSize: '0.8rem', padding: '0.35rem 0.65rem', borderRadius: '6px', border: '1px solid #CBD5E1', backgroundColor: '#F8FAFC' }}
          >
            <option value="All">Unit: All</option>
            <option value="Son Felipe">Son Felipe</option>
            <option value="Brunnenstrasse">Brunnenstrasse</option>
            <option value="Stellar test">Stellar test</option>
            <option value="Emerald">Emerald</option>
            <option value="Sa Taulera">Sa Taulera</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{ fontSize: '0.8rem', padding: '0.35rem 0.65rem', borderRadius: '6px', border: '1px solid #CBD5E1', backgroundColor: '#F8FAFC' }}
          >
            <option value="All">Status: All</option>
            <option value="confirmed">Bestätigt (Confirmed)</option>
            <option value="cancelled">Storniert (Cancelled)</option>
            <option value="in_progress">In Progress</option>
          </select>

          <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
            <Button variant="secondary" size="sm" onClick={handleExportCSV} iconLeft={<Download size={14} />}>
              Export
            </Button>
            <Button variant="emerald" size="sm" onClick={() => setIsAddModalOpen(true)} iconLeft={<Plus size={14} />}>
              Add Booking
            </Button>
          </div>
        </div>

        {/* Subheader Counter & Search matching Reference Image 3 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', fontSize: '0.82rem', color: '#64748B' }}>
            <span>
              <strong>{filteredBookings.length}/{state.metrics.totalBookingsCount}</strong> ({state.metrics.cancelledCount} storn.)
            </span>
            <span>Quartal:</span>
            <div style={{ display: 'inline-flex', borderRadius: '6px', overflow: 'hidden', border: '1px solid #CBD5E1' }}>
              <button
                onClick={() => setArrivalToggle('Anreise')}
                style={{
                  padding: '0.2rem 0.55rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  backgroundColor: arrivalToggle === 'Anreise' ? '#EAB308' : '#FFFFFF',
                  color: arrivalToggle === 'Anreise' ? '#FFFFFF' : '#475569',
                }}
              >
                Anreise
              </button>
              <button
                onClick={() => setArrivalToggle('Ab')}
                style={{
                  padding: '0.2rem 0.55rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  backgroundColor: arrivalToggle === 'Ab' ? '#EAB308' : '#FFFFFF',
                  color: arrivalToggle === 'Ab' ? '#FFFFFF' : '#475569',
                }}
              >
                Ab
              </button>
            </div>
          </div>

          {/* Quick Search matching Image 3 */}
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input
              type="text"
              placeholder="Q Suchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '0.35rem 0.75rem 0.35rem 2rem',
                fontSize: '0.8rem',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                width: '180px',
                backgroundColor: '#FFFFFF',
              }}
            />
          </div>
        </div>

        {/* Data Table matching Reference Image 3 */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            overflowX: 'auto',
            boxShadow: '0 1px 3px rgba(15, 23, 42, 0.05)',
          }}
        >
          <table className="rf-table" style={{ minWidth: '950px' }}>
            <thead>
              <tr>
                <th style={{ width: '40px', textAlign: 'center' }}>
                  <input type="checkbox" aria-label="Select all bookings" />
                </th>
                <th style={{ width: '60px' }}>Aktion</th>
                <th>Status</th>
                <th>Portal</th>
                <th>Gebucht</th>
                <th>Anreise</th>
                <th>Abreise</th>
                <th style={{ textAlign: 'center' }}>Nächte</th>
                <th>Einheit</th>
                <th>Gast</th>
                <th style={{ textAlign: 'right' }}>Betrag</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((b) => (
                <tr
                  key={b.id}
                  onClick={() => dispatch({ type: 'SELECT_BOOKING', payload: b.id })}
                  style={{ cursor: 'pointer' }}
                >
                  <td style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" aria-label={`Select ${b.bookingNumber}`} />
                  </td>

                  <td onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <button
                        onClick={() => dispatch({ type: 'SELECT_BOOKING', payload: b.id })}
                        style={{ padding: '2px', color: '#64748B' }}
                        title="Inspect details"
                        aria-label={`Inspect details for ${b.bookingNumber}`}
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        onClick={() => {
                          dispatch({ type: 'DELETE_BOOKING', payload: b.id });
                          addToast('Deleted', `Removed ${b.bookingNumber}`, 'info');
                        }}
                        style={{ padding: '2px', color: '#EF4444' }}
                        title="Delete booking"
                        aria-label={`Delete ${b.bookingNumber}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>

                  <td>
                    <Badge status={b.status} label={b.statusLabel} size="sm" />
                  </td>

                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      {getPortalIcon(b.platform)}
                      <span style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 600 }}>
                        {b.platform}
                      </span>
                    </div>
                  </td>

                  <td style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>
                    {b.bookedDate}
                  </td>

                  <td style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>
                    {b.checkInDate}
                  </td>

                  <td style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>
                    {b.checkOutDate}
                  </td>

                  <td style={{ textAlign: 'center', fontWeight: 700, fontSize: '0.85rem' }}>
                    {b.nights}
                  </td>

                  <td style={{ fontWeight: 600, color: '#0F172A', fontSize: '0.85rem' }}>
                    {b.unit}
                  </td>

                  <td style={{ color: '#334155', fontSize: '0.85rem' }}>
                    {b.guestName}
                  </td>

                  <td style={{ textAlign: 'right', fontWeight: 700, color: '#0F172A', fontSize: '0.85rem' }}>
                    €{b.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddBookingModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </DashboardLayout>
  );
};
