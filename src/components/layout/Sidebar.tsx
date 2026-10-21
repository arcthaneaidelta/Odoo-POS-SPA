import React from 'react';
import { useDemo } from '../../context/DemoContext';
import { BrandLogo } from '../common/BrandLogo';
import {
  LayoutDashboard,
  GitBranch,
  CalendarCheck,
  Cpu,
  Zap,
  Activity,
  Settings,
  HelpCircle,
  RotateCcw,
  ExternalLink,
  ChevronRight,
  Shield,
} from 'lucide-react';

interface SidebarProps {
  onOpenResetModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenResetModal }) => {
  const { state, navigate } = useDemo();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      route: '/dashboard',
      icon: <LayoutDashboard size={19} />,
      badge: undefined,
    },
    {
      id: 'workflows',
      label: 'Workflows',
      route: '/workflows',
      icon: <GitBranch size={19} />,
      badge: '4 Active',
    },
    {
      id: 'bookings',
      label: 'Bookings',
      route: '/bookings',
      icon: <CalendarCheck size={19} />,
      badge: state.bookings.length.toString(),
    },
    {
      id: 'sessions',
      label: 'Browser Sessions',
      route: '/sessions',
      icon: <Cpu size={19} />,
      badge: '6 Nodes',
    },
    {
      id: 'simulator',
      label: 'Simulator',
      route: '/simulator',
      icon: <Zap size={19} />,
      badge: '4 Scenarios',
      highlight: true,
    },
    {
      id: 'activity',
      label: 'Activity',
      route: '/activity',
      icon: <Activity size={19} />,
      badge: undefined,
    },
    {
      id: 'settings',
      label: 'Settings',
      route: '/settings',
      icon: <Settings size={19} />,
      badge: undefined,
    },
  ];

  return (
    <aside
      style={{
        width: state.isSidebarOpen ? '250px' : '72px',
        minHeight: '100vh',
        backgroundColor: '#FFFFFF',
        borderRight: '1px solid #E2E8F0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'width 200ms cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'sticky',
        top: 0,
        height: '100vh',
        zIndex: 40,
        flexShrink: 0,
      }}
    >
      {/* Top Header & Brand */}
      <div>
        <div
          style={{
            height: '70px',
            padding: state.isSidebarOpen ? '0 1.25rem' : '0 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: state.isSidebarOpen ? 'space-between' : 'center',
            borderBottom: '1px solid #F1F5F9',
          }}
        >
          {state.isSidebarOpen ? (
            <div style={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
              <BrandLogo size="sm" showBadge />
            </div>
          ) : (
            <div style={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
              <BrandLogo size="sm" />
            </div>
          )}
        </div>

        {/* Navigation List */}
        <nav style={{ padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {navItems.map((item) => {
            const isActive = state.currentRoute === item.route;

            return (
              <button
                key={item.id}
                onClick={() => navigate(item.route)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  width: '100%',
                  padding: state.isSidebarOpen ? '0.65rem 0.9rem' : '0.65rem',
                  justifyContent: state.isSidebarOpen ? 'flex-start' : 'center',
                  borderRadius: '10px',
                  backgroundColor: isActive ? '#0D4E43' : 'transparent',
                  color: isActive ? '#FFFFFF' : '#475569',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.88rem',
                  transition: 'all 150ms ease',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = '#F8FAFC';
                    e.currentTarget.style.color = '#0F172A';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#475569';
                  }
                }}
                title={item.label}
              >
                <span
                  style={{
                    color: isActive ? '#FFFFFF' : item.highlight ? '#10B981' : '#64748B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </span>

                {state.isSidebarOpen && (
                  <>
                    <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
                    {item.badge && (
                      <span
                        style={{
                          fontSize: '0.68rem',
                          padding: '0.15rem 0.45rem',
                          borderRadius: '9999px',
                          backgroundColor: isActive
                            ? 'rgba(255, 255, 255, 0.2)'
                            : item.highlight
                            ? '#DCFCE7'
                            : '#F1F5F9',
                          color: isActive
                            ? '#FFFFFF'
                            : item.highlight
                            ? '#15803D'
                            : '#64748B',
                          fontWeight: 700,
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Actions & Profile */}
      <div style={{ padding: '0.85rem', borderTop: '1px solid #F1F5F9' }}>
        {state.isSidebarOpen && (
          <div
            style={{
              backgroundColor: '#F0FAF7',
              borderRadius: '8px',
              padding: '0.65rem 0.85rem',
              marginBottom: '0.75rem',
              border: '1px solid #D1FAE5',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#10B981',
                boxShadow: '0 0 6px #34D399',
                flexShrink: 0,
              }}
            />
            <div style={{ fontSize: '0.75rem', color: '#065F46', fontWeight: 600 }}>
              All 6 Workers Operational
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {/* Quick link back to landing page */}
          <button
            onClick={() => navigate('/')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              width: '100%',
              padding: '0.5rem 0.65rem',
              borderRadius: '8px',
              color: '#64748B',
              fontSize: '0.8rem',
              fontWeight: 500,
              justifyContent: state.isSidebarOpen ? 'flex-start' : 'center',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F8FAFC';
              e.currentTarget.style.color = '#0F172A';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#64748B';
            }}
            title="Public Landing Page"
          >
            <ExternalLink size={16} />
            {state.isSidebarOpen && <span>Marketing Site</span>}
          </button>

          {/* Reset Demo Data Button */}
          <button
            onClick={onOpenResetModal}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              width: '100%',
              padding: '0.5rem 0.65rem',
              borderRadius: '8px',
              color: '#94A3B8',
              fontSize: '0.8rem',
              fontWeight: 500,
              justifyContent: state.isSidebarOpen ? 'flex-start' : 'center',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#FEE2E2';
              e.currentTarget.style.color = '#991B1B';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#94A3B8';
            }}
            title="Reset Demo Data"
          >
            <RotateCcw size={16} />
            {state.isSidebarOpen && <span>Reset Demo Data</span>}
          </button>
        </div>

        {/* User Card */}
        {state.isSidebarOpen && (
          <div
            style={{
              marginTop: '0.85rem',
              paddingTop: '0.85rem',
              borderTop: '1px solid #F1F5F9',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#0D4E43',
                color: '#FFFFFF',
                fontSize: '0.8rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              MV
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: '#0F172A',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                }}
              >
                Marcus Vance
              </div>
              <div
                style={{
                  fontSize: '0.72rem',
                  color: '#64748B',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                }}
              >
                Lead Operations
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
