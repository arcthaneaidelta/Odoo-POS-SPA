import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  Store,
  Sparkles,
  Building,
  CreditCard,
  AlertTriangle,
  ArrowRight,
  Clock,
  CheckCircle2,
  Calendar,
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const OperationsOverviewPage: React.FC = () => {
  const {
    t,
    settings,
    formatPrice,
    outlets,
    folioPostings,
    payments,
    spaBookings,
    activityFeed
  } = useApp();
  const navigate = useNavigate();
  const isEs = settings.language === 'es';

  const [chartMetric, setChartMetric] = useState<'total' | 'pos' | 'spa' | 'digital'>('total');

  // Simulated 7-day trend data
  const SEVEN_DAY_DATA = [
    { day: isEs ? 'Jue 15' : 'Thu 15', total: 162000, pos: 94000, spa: 38000, digital: 30000 },
    { day: isEs ? 'Vie 16' : 'Fri 16', total: 188500, pos: 112000, spa: 44000, digital: 32500 },
    { day: isEs ? 'Sáb 17' : 'Sat 17', total: 224000, pos: 135000, spa: 52000, digital: 37000 },
    { day: isEs ? 'Dom 18' : 'Sun 18', total: 205000, pos: 122000, spa: 48000, digital: 35000 },
    { day: isEs ? 'Lun 19' : 'Mon 19', total: 145000, pos: 88000, spa: 31000, digital: 26000 },
    { day: isEs ? 'Mar 20' : 'Tue 20', total: 172000, pos: 104000, spa: 39000, digital: 29000 },
    { day: isEs ? 'Mié 21' : 'Wed 21', total: 184650, pos: 114250, spa: 42800, digital: 27600 }
  ];

  const maxVal = Math.max(...SEVEN_DAY_DATA.map(d => d[chartMetric]));

  // Live calculated stats
  const pendingFolios = folioPostings.filter(f => f.status === 'failed' || f.status === 'queued').length;
  const mismatchPayments = payments.filter(p => p.reconciliationStatus === 'mismatch').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Page Title & Context Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>{t('overviewTitle')}</h2>
            <span className="badge badge-teal">Odoo Enterprise Core</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginTop: 2 }}>
            {t('overviewSubtitle')}
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => navigate('/app/pos')} className="btn btn-primary btn-sm">
            <Store size={15} />
            <span>Launch POS Terminal</span>
          </button>
          <button onClick={() => navigate('/app/spa')} className="btn btn-secondary btn-sm">
            <Sparkles size={15} />
            <span>Spa Calendar</span>
          </button>
        </div>
      </div>

      {/* 6 KPI Cards (PRD Section 7.3) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 'var(--space-4)'
        }}
      >
        {/* KPI 1: POS Revenue */}
        <div className="card" onClick={() => navigate('/app/pos')} style={{ cursor: 'pointer', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              {t('kpiPosRevenue')}
            </span>
            <Store size={16} color="var(--accent-primary)" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
            {formatPrice(184650)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--state-success)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <TrendingUp size={13} />
            <span>4 active resort outlets</span>
          </div>
        </div>

        {/* KPI 2: Completed Orders */}
        <div className="card" onClick={() => navigate('/app/pos')} style={{ cursor: 'pointer', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              {t('kpiCompletedOrders')}
            </span>
            <CheckCircle2 size={16} color="var(--state-success)" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
            126
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Across restaurant, bar & beach
          </div>
        </div>

        {/* KPI 3: Spa Treatments Today */}
        <div className="card" onClick={() => navigate('/app/spa')} style={{ cursor: 'pointer', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              {t('kpiSpaTreatments')}
            </span>
            <Sparkles size={16} color="var(--accent-warm)" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
            24
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-warm)' }}>
            {spaBookings.length} tracked in live engine
          </div>
        </div>

        {/* KPI 4: Active Room Charges */}
        <div className="card" onClick={() => navigate('/app/folios')} style={{ cursor: 'pointer', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              {t('kpiRoomCharges')}
            </span>
            <Building size={16} color="var(--accent-primary)" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
            8
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--state-success)' }}>
            Synchronized to PMS folios
          </div>
        </div>

        {/* KPI 5: Digital Payments */}
        <div className="card" onClick={() => navigate('/app/payments')} style={{ cursor: 'pointer', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              {t('kpiDigitalPayments')}
            </span>
            <CreditCard size={16} color="var(--accent-primary)" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
            {formatPrice(42800)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Stripe authorized deposits
          </div>
        </div>

        {/* KPI 6: Pending Reconciliation Items */}
        <div className="card" onClick={() => navigate('/app/folios')} style={{ cursor: 'pointer', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              {t('kpiReconciliationDiff')}
            </span>
            <AlertTriangle size={16} color={pendingFolios > 0 ? 'var(--state-error)' : 'var(--state-success)'} />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: pendingFolios > 0 ? 'var(--state-error)' : 'var(--text-primary)', marginBottom: 4 }}>
            {pendingFolios + mismatchPayments}
          </div>
          <div style={{ fontSize: '0.75rem', color: pendingFolios > 0 ? 'var(--state-error)' : 'var(--text-secondary)' }}>
            {pendingFolios} PMS timeout · {mismatchPayments} bank flag
          </div>
        </div>
      </div>

      {/* Main Grid: Revenue Velocity Chart + Outlet Performance */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 'var(--space-6)' }}>
        {/* SVG Revenue Velocity Chart (PRD Section 7.4) */}
        <div className="card">
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, gap: 10 }}>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>{t('chartTitle')}</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                Trailing 7-day revenue velocity across resort cost centers
              </p>
            </div>

            {/* Metric Toggle Tabs */}
            <div style={{ display: 'flex', gap: 4, backgroundColor: 'var(--bg-main)', padding: 3, borderRadius: 'var(--radius-sm)' }}>
              {[
                { id: 'total', label: t('chartFilterTotal') },
                { id: 'pos', label: t('chartFilterPos') },
                { id: 'spa', label: t('chartFilterSpa') },
                { id: 'digital', label: t('chartFilterDigital') }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setChartMetric(tab.id as any)}
                  style={{
                    padding: '4px 8px',
                    fontSize: '0.6875rem',
                    fontWeight: chartMetric === tab.id ? 700 : 500,
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: chartMetric === tab.id ? '#FFFFFF' : 'transparent',
                    color: chartMetric === tab.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    boxShadow: chartMetric === tab.id ? 'var(--shadow-sm)' : 'none'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Bar Chart Visualization */}
          <div style={{ height: '220px', display: 'flex', alignItems: 'flex-end', gap: 12, paddingBottom: 24, paddingTop: 10 }}>
            {SEVEN_DAY_DATA.map((item, idx) => {
              const val = item[chartMetric];
              const heightPercent = Math.max(12, Math.round((val / maxVal) * 100));
              const isToday = idx === SEVEN_DAY_DATA.length - 1;

              return (
                <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
                    {formatPrice(val).split('.')[0]}
                  </div>
                  <div
                    style={{
                      width: '100%',
                      maxWidth: '36px',
                      height: `${heightPercent}%`,
                      backgroundColor: isToday ? 'var(--accent-primary)' : 'var(--surface-secondary)',
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 300ms ease-out',
                      border: isToday ? '1px solid var(--accent-primary-hover)' : '1px solid var(--border-subtle)'
                    }}
                    title={`${item.day}: ${formatPrice(val)}`}
                  />
                  <div style={{ fontSize: '0.75rem', color: isToday ? 'var(--accent-primary)' : 'var(--text-secondary)', fontWeight: isToday ? 700 : 400, marginTop: 6 }}>
                    {item.day}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Outlet Performance Summary (PRD Section 7.5) */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>{t('outletPerformanceTitle')}</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Live terminal check counts and service state</p>
            </div>
            <span className="badge badge-success">All Active</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {outlets.map(outlet => (
              <div
                key={outlet.id}
                onClick={() => navigate('/app/pos')}
                style={{
                  padding: '12px 14px',
                  backgroundColor: 'var(--bg-main)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                    {isEs ? outlet.nameEs : outlet.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Terminal: {outlet.terminalName}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                      {outlet.activeOrdersCount} {t('activeOrders')}
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--state-success)' }}>
                      60 FPS Sync
                    </div>
                  </div>
                  <ArrowRight size={14} color="var(--text-secondary)" />
                </div>
              </div>
            ))}

            {/* Spa Outlet Card */}
            <div
              onClick={() => navigate('/app/spa')}
              style={{
                padding: '12px 14px',
                backgroundColor: 'var(--accent-warm-light)',
                border: '1px solid rgba(180, 125, 104, 0.2)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer'
              }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--accent-warm)' }}>
                  Spa & Wellness Sanctuary
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  4 Cabins · 4 Therapists active
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--accent-warm)' }}>
                    {spaBookings.length} Bookings Today
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>
                    Auto Buffer Active
                  </div>
                </div>
                <ArrowRight size={14} color="var(--accent-warm)" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Operational Activity Feed + PMS Health */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 'var(--space-6)' }}>
        {/* Activity Feed (PRD Section 7.6) */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>{t('activityFeedTitle')}</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Stable Demo Log</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {activityFeed.slice(0, 5).map(item => (
              <div
                key={item.id}
                onClick={() => item.linkRoute && navigate(item.linkRoute)}
                style={{
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-main)',
                  border: '1px solid var(--border-subtle)',
                  cursor: item.linkRoute ? 'pointer' : 'default'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                  <strong style={{ fontSize: '0.8125rem', color: 'var(--text-primary)' }}>
                    {isEs ? item.titleEs : item.title}
                  </strong>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>{item.timestamp}</span>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
                  {isEs ? item.descriptionEs : item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* PMS Reconciliation Summary Panel (PRD Section 7.7) */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>{t('pmsReconciliationTitle')}</h3>
            <button onClick={() => navigate('/app/folios')} className="btn btn-outline btn-sm">
              Manage Folios
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ padding: '12px 14px', backgroundColor: 'var(--state-success-bg)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--state-success)' }}>
                  Posted Room Charges
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Synchronized with PMS Folio ledger
                </div>
              </div>
              <strong style={{ fontSize: '1.125rem', color: 'var(--state-success)' }}>
                {folioPostings.filter(f => f.status === 'posted').length}
              </strong>
            </div>

            <div style={{ padding: '12px 14px', backgroundColor: 'var(--state-error-bg)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--state-error)' }}>
                  Failed Postings Awaiting Retry
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Scenario C: Idempotent retry ready
                </div>
              </div>
              <strong style={{ fontSize: '1.125rem', color: 'var(--state-error)' }}>
                {folioPostings.filter(f => f.status === 'failed').length}
              </strong>
            </div>

            <div style={{ padding: '12px 14px', backgroundColor: 'var(--state-warning-bg)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--state-warning)' }}>
                  Queued Room Charges
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  In pipeline for background dispatch
                </div>
              </div>
              <strong style={{ fontSize: '1.125rem', color: 'var(--state-warning)' }}>
                {folioPostings.filter(f => f.status === 'queued').length}
              </strong>
            </div>

            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 4 }}>
              * All postings use stable idempotency keys to ensure zero risk of duplicate billing upon automated or manual retry.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
