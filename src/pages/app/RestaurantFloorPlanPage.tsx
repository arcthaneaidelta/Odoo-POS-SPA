import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UtensilsCrossed,
  LayoutGrid,
  List,
  Users,
  Clock,
  ArrowRight,
  CheckCircle2,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RestaurantTable, TableStatus } from '../../types';

export const RestaurantFloorPlanPage: React.FC = () => {
  const { tables, updateTableStatus, formatPrice, setSelectedTableId, t, settings, addToast } = useApp();
  const navigate = useNavigate();
  const isEs = settings.language === 'es';

  const [viewMode, setViewMode] = useState<'plan' | 'list'>('plan');
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [activeTable, setActiveTable] = useState<RestaurantTable | null>(tables[0]);

  const filteredTables = tables.filter(tbl => {
    if (selectedSection !== 'all' && tbl.section !== selectedSection) return false;
    return true;
  });

  const getStatusBadge = (status: TableStatus) => {
    switch (status) {
      case 'available':
        return <span className="badge badge-neutral">{t('tableStatusAvailable')}</span>;
      case 'seated':
        return <span className="badge badge-teal">{t('tableStatusSeated')}</span>;
      case 'ordering':
        return <span className="badge badge-warning">{t('tableStatusOrdering')}</span>;
      case 'served':
        return <span className="badge badge-success">{t('tableStatusServed')}</span>;
      case 'bill_requested':
        return <span className="badge badge-error">{t('tableStatusBillRequested')}</span>;
    }
  };

  const handleOpenOrder = (table: RestaurantTable) => {
    setSelectedTableId(table.id);
    navigate('/app/pos');
  };

  const handleStatusChange = (tableId: string, newStatus: TableStatus) => {
    updateTableStatus(tableId, newStatus);
    if (activeTable && activeTable.id === tableId) {
      setActiveTable({ ...activeTable, status: newStatus });
    }
    addToast('info', 'Table Status Updated', `Table marked as ${newStatus.replace('_', ' ')}.`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>{t('floorPlanTitle')}</h2>
            <span className="badge badge-teal">Marea Terraza</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginTop: 2 }}>
            Interactive table seating, status progression, and direct POS terminal routing.
          </p>
        </div>

        {/* View toggle & section filters */}
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ display: 'flex', backgroundColor: 'var(--bg-main)', padding: 3, borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <button
              onClick={() => setViewMode('plan')}
              className={`btn btn-sm ${viewMode === 'plan' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ padding: '4px 10px' }}
            >
              <LayoutGrid size={14} />
              <span>{t('viewFloorPlan')}</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ padding: '4px 10px' }}
            >
              <List size={14} />
              <span>{t('viewTableList')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Section Filter Pills */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
        {['all', 'Terrace Ocean View', 'Pergola Garden', 'Bar Lounge'].map(sec => (
          <button
            key={sec}
            onClick={() => setSelectedSection(sec)}
            className={`btn btn-sm ${selectedSection === sec ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: 'var(--radius-full)' }}
          >
            {sec === 'all' ? 'All Sections' : sec}
          </button>
        ))}
      </div>

      {/* Main Layout: Visual Floor Plan vs Details Sidebar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 'var(--space-6)',
          alignItems: 'start'
        }}
        className="floorplan-layout-grid"
      >
        {/* Left: Floor Plan visual or list */}
        {viewMode === 'plan' ? (
          <div
            className="card"
            style={{
              padding: '28px',
              backgroundColor: 'var(--bg-main)',
              minHeight: '440px'
            }}
          >
            {/* Visual Ocean View Horizon Marker */}
            <div
              style={{
                textAlign: 'center',
                padding: '8px',
                backgroundColor: 'rgba(73, 108, 104, 0.08)',
                border: '1px dashed var(--accent-primary)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--accent-primary)',
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: 24
              }}
            >
              🌊 PACIFIC OCEAN HORIZON & SEA OF CORTEZ VIEW 🌊
            </div>

            {/* Tables Grid Layout */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: 'var(--space-5)'
              }}
            >
              {filteredTables.map(tbl => {
                const isSelected = activeTable?.id === tbl.id;
                return (
                  <div
                    key={tbl.id}
                    onClick={() => setActiveTable(tbl)}
                    style={{
                      backgroundColor: isSelected ? 'var(--accent-primary-light)' : '#FFFFFF',
                      border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '16px',
                      boxShadow: isSelected ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      minHeight: '140px',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '1rem', color: isSelected ? 'var(--accent-primary)' : 'var(--text-primary)' }}>
                          {tbl.number}
                        </div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>
                          {tbl.section}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        <Users size={13} />
                        <span>{tbl.capacity}</span>
                      </div>
                    </div>

                    <div style={{ marginBottom: 12 }}>
                      {getStatusBadge(tbl.status)}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: 8, fontSize: '0.75rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>{tbl.serverName}</span>
                      <strong style={{ color: tbl.totalAmountMxn > 0 ? 'var(--accent-primary)' : 'var(--text-secondary)' }}>
                        {tbl.totalAmountMxn > 0 ? formatPrice(tbl.totalAmountMxn) : '—'}
                      </strong>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Table List View */
          <div className="table-container">
            <table className="luxury-table">
              <thead>
                <tr>
                  <th>Table</th>
                  <th>Section</th>
                  <th>Capacity</th>
                  <th>Status</th>
                  <th>Server</th>
                  <th>Check Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTables.map(tbl => (
                  <tr key={tbl.id} onClick={() => setActiveTable(tbl)} style={{ cursor: 'pointer' }}>
                    <td><strong>{tbl.number}</strong></td>
                    <td>{tbl.section}</td>
                    <td>{tbl.capacity} guests</td>
                    <td>{getStatusBadge(tbl.status)}</td>
                    <td>{tbl.serverName}</td>
                    <td><strong>{tbl.totalAmountMxn > 0 ? formatPrice(tbl.totalAmountMxn) : '—'}</strong></td>
                    <td>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenOrder(tbl);
                        }}
                        className="btn btn-secondary btn-sm"
                      >
                        Open POS
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Right: Selected Table Details & Service Controls */}
        {activeTable && (
          <div className="card" style={{ padding: 'var(--space-6)', position: 'sticky', top: 80 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <span className="badge badge-teal" style={{ marginBottom: 6 }}>
                  {activeTable.section}
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                  {activeTable.number}
                </h3>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Capacity</div>
                <strong>{activeTable.capacity} Guests</strong>
              </div>
            </div>

            {/* Quick Status Setter */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
                Update Table Service Stage:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                {(['available', 'seated', 'ordering', 'served', 'bill_requested'] as TableStatus[]).map(st => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(activeTable.id, st)}
                    className={`btn btn-sm ${activeTable.status === st ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '0.6875rem', padding: '6px' }}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Current Table Summary */}
            <div style={{ backgroundColor: 'var(--bg-main)', padding: '14px', borderRadius: 'var(--radius-md)', marginBottom: 20, fontSize: '0.8125rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: 'var(--text-secondary)' }}>Server Assigned:</span>
                <strong>{activeTable.serverName}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: 'var(--text-secondary)' }}>Current Check Total:</span>
                <strong style={{ color: 'var(--accent-primary)' }}>
                  {formatPrice(activeTable.totalAmountMxn)}
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Status:</span>
                <span>{getStatusBadge(activeTable.status)}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button
                onClick={() => handleOpenOrder(activeTable)}
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              >
                <UtensilsCrossed size={16} />
                <span>{t('openTableOrder')}</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={() => handleStatusChange(activeTable.id, 'bill_requested')}
                className="btn btn-outline btn-sm"
                style={{ width: '100%' }}
              >
                Mark Bill Requested
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (min-width: 992px) {
          .floorplan-layout-grid {
            grid-template-columns: 1fr 320px !important;
          }
        }
      `}</style>
    </div>
  );
};
