import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Store,
  UtensilsCrossed,
  Sparkles,
  Users,
  FileSpreadsheet,
  CreditCard,
  FileText,
  BarChart3,
  Settings,
  ArrowLeft,
  X,
  Compass
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface OperationsSidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const OperationsSidebar: React.FC<OperationsSidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const { t, settings, folioPostings, payments, spaBookings } = useApp();
  const navigate = useNavigate();

  // Badges calculation
  const pendingFolios = folioPostings.filter(f => f.status === 'failed' || f.status === 'queued').length;
  const pendingPayments = payments.filter(p => p.reconciliationStatus === 'mismatch').length;
  const pendingSpa = spaBookings.filter(s => s.status === 'pending_deposit').length;

  const navItems = [
    { to: '/app', label: t('menuOverview'), icon: <LayoutDashboard size={18} /> },
    { to: '/app/pos', label: t('menuPos'), icon: <Store size={18} /> },
    { to: '/app/restaurant', label: t('menuRestaurant'), icon: <UtensilsCrossed size={18} /> },
    {
      to: '/app/spa',
      label: t('menuSpa'),
      icon: <Sparkles size={18} />,
      badge: pendingSpa > 0 ? pendingSpa : undefined
    },
    { to: '/app/guests', label: t('menuGuests'), icon: <Users size={18} /> },
    {
      to: '/app/folios',
      label: t('menuFolios'),
      icon: <FileSpreadsheet size={18} />,
      badge: pendingFolios > 0 ? pendingFolios : undefined,
      badgeColor: 'var(--state-error)'
    },
    {
      to: '/app/payments',
      label: t('menuPayments'),
      icon: <CreditCard size={18} />,
      badge: pendingPayments > 0 ? pendingPayments : undefined,
      badgeColor: 'var(--state-warning)'
    },
    { to: '/app/invoicing', label: t('menuInvoicing'), icon: <FileText size={18} /> },
    { to: '/app/reports', label: t('menuReports'), icon: <BarChart3 size={18} /> },
    { to: '/app/settings', label: t('menuSettings'), icon: <Settings size={18} /> }
  ];

  const sidebarContent = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#FFFFFF',
        borderRight: '1px solid var(--border-subtle)'
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: '20px 20px 16px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.125rem',
              letterSpacing: '0.12em',
              fontWeight: 700,
              color: 'var(--text-primary)',
              textTransform: 'uppercase',
              lineHeight: 1.2
            }}
          >
            CASA MAREA
          </h2>
          <div
            style={{
              fontSize: '0.6875rem',
              color: 'var(--accent-primary)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontWeight: 600
            }}
          >
            Resort Operations
          </div>
        </div>

        {mobileOpen && (
          <button onClick={onCloseMobile} className="btn-icon">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <nav
        style={{
          flex: 1,
          padding: '16px 12px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}
      >
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/app'}
            onClick={onCloseMobile}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '9px 12px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
              fontWeight: isActive ? 600 : 500,
              color: isActive ? 'var(--accent-primary)' : 'var(--text-primary)',
              backgroundColor: isActive ? 'var(--accent-primary-light)' : 'transparent',
              borderLeft: isActive ? '3px solid var(--accent-primary)' : '3px solid transparent',
              transition: 'all var(--transition-fast)'
            })}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: 'inherit' }}>{item.icon}</span>
              <span>{item.label}</span>
            </div>

            {item.badge !== undefined && (
              <span
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  padding: '2px 7px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: item.badgeColor || 'var(--accent-primary)',
                  color: '#FFFFFF'
                }}
              >
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Guided Scenarios Drawer Shortcut */}
      <div
        style={{
          padding: '12px 16px',
          borderTop: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-main)'
        }}
      >
        <div style={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)', marginBottom: 8, fontWeight: 600 }}>
          {settings.language === 'es' ? 'Escenarios de Prueba' : 'Client Demo Scenarios'}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <button
            onClick={() => {
              navigate('/app/restaurant');
              onCloseMobile();
            }}
            className="btn btn-secondary btn-sm"
            style={{ width: '100%', justifyContent: 'flex-start', fontSize: '0.75rem', padding: '6px 8px' }}
          >
            <Compass size={14} color="var(--accent-primary)" />
            <span>A: {settings.language === 'es' ? 'Cobro en Restaurante' : 'Restaurant Checkout'}</span>
          </button>

          <button
            onClick={() => {
              navigate('/app/spa');
              onCloseMobile();
            }}
            className="btn btn-secondary btn-sm"
            style={{ width: '100%', justifyContent: 'flex-start', fontSize: '0.75rem', padding: '6px 8px' }}
          >
            <Compass size={14} color="var(--accent-primary)" />
            <span>B: {settings.language === 'es' ? 'Flujo Completo de Spa' : 'Spa to POS Journey'}</span>
          </button>

          <button
            onClick={() => {
              navigate('/app/folios');
              onCloseMobile();
            }}
            className="btn btn-secondary btn-sm"
            style={{ width: '100%', justifyContent: 'flex-start', fontSize: '0.75rem', padding: '6px 8px' }}
          >
            <Compass size={14} color="var(--state-error)" />
            <span>C: {settings.language === 'es' ? 'Falla y Reintento PMS' : 'PMS Failure & Retry'}</span>
          </button>
        </div>
      </div>

      {/* Return to Public Site Footer */}
      <div
        style={{
          padding: '14px 16px',
          borderTop: '1px solid var(--border-subtle)',
          backgroundColor: '#FFFFFF'
        }}
      >
        <button
          onClick={() => {
            navigate('/');
            onCloseMobile();
          }}
          className="btn btn-outline btn-sm"
          style={{ width: '100%', justifyContent: 'center', gap: 8 }}
        >
          <ArrowLeft size={14} />
          <span>{t('returnToResort')}</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        style={{
          width: 'var(--sidebar-width)',
          height: '100vh',
          position: 'sticky',
          top: 0,
          flexShrink: 0,
          display: 'none'
        }}
        className="desktop-sidebar-visible"
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(41, 45, 44, 0.4)',
            zIndex: 1050
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: '280px',
              height: '100%',
              backgroundColor: '#FFFFFF',
              boxShadow: 'var(--shadow-lg)',
              animation: 'slideInRight 180ms ease'
            }}
          >
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Inline style for desktop visibility */}
      <style>{`
        @media (min-width: 992px) {
          .desktop-sidebar-visible {
            display: block !important;
          }
        }
      `}</style>
    </>
  );
};
