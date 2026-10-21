import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { Button } from '../common/Button';
import {
  Search,
  Download,
  Bell,
  Play,
  Menu,
  ChevronDown,
  Sparkles,
  Zap,
} from 'lucide-react';
import { SimulationScenarioId } from '../../types';

interface TopHeaderProps {
  title?: string;
  subtitle?: string;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  title = 'Dashboard',
  subtitle = 'Monitor your key performance indicators',
}) => {
  const { state, dispatch, navigate, runScenario, addToast } = useDemo();
  const [showScenarioMenu, setShowScenarioMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const unreadCount = state.notifications.filter((n) => !n.isRead).length;

  const handleExportPDF = () => {
    addToast('Report Export Initiated', 'Compiling PDF summary for Q1 2026...', 'info');
    setTimeout(() => {
      addToast('Export Complete', 'Downloaded RESERVA_FLOW_Executive_Report.pdf', 'success');
    }, 1200);
  };

  const handleQuickRun = (scenarioId: SimulationScenarioId) => {
    setShowScenarioMenu(false);
    navigate('/simulator');
    setTimeout(() => {
      runScenario(scenarioId);
    }, 300);
  };

  return (
    <header
      style={{
        height: '70px',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        padding: '0 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 30,
      }}
    >
      {/* Left: Mobile Toggle & Page Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.4rem',
            color: '#64748B',
            borderRadius: '6px',
          }}
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>

        <div>
          <h1
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#0F172A',
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <p style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '0.1rem' }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right Controls matching CheckinOs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        {/* Global Search Bar */}
        <div
          style={{
            position: 'relative',
            display: 'none',
            alignItems: 'center',
          }}
          className="header-search-container"
        >
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '12px',
              color: '#94A3B8',
              pointerEvents: 'none',
            }}
          />
          <input
            type="text"
            placeholder="Search rooms, guests, or tasks... (⌘K)"
            value={state.globalSearchQuery}
            onChange={(e) => dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value })}
            style={{
              width: '280px',
              padding: '0.45rem 0.85rem 0.45rem 2.25rem',
              fontSize: '0.82rem',
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              outline: 'none',
              transition: 'all 150ms ease',
            }}
            onFocus={(e) => {
              e.target.style.backgroundColor = '#FFFFFF';
              e.target.style.borderColor = '#0D4E43';
              e.target.style.width = '320px';
            }}
            onBlur={(e) => {
              e.target.style.backgroundColor = '#F8FAFC';
              e.target.style.borderColor = '#E2E8F0';
              e.target.style.width = '280px';
            }}
          />
        </div>

        {/* Quick Scenario Run Dropdown */}
        <div style={{ position: 'relative' }}>
          <Button
            variant="emerald"
            size="sm"
            onClick={() => setShowScenarioMenu(!showScenarioMenu)}
            iconLeft={<Zap size={14} />}
            iconRight={<ChevronDown size={14} />}
          >
            Simulate
          </Button>

          {showScenarioMenu && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '320px',
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                padding: '0.65rem',
                zIndex: 50,
                animation: 'fadeIn 150ms ease-out',
              }}
            >
              <div
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: '#64748B',
                  textTransform: 'uppercase',
                  padding: '0.35rem 0.5rem',
                }}
              >
                Trigger Deterministic Scenario
              </div>

              {[
                { id: 'flash_booking' as const, name: 'Scenario 1: High-Demand Flash Snipe', tag: 'Fast' },
                { id: 'channel_conflict' as const, name: 'Scenario 2: Cross-Channel Conflict', tag: 'Arbitration' },
                { id: 'antibot_challenge' as const, name: 'Scenario 3: Anti-Bot & Proxy Failover', tag: 'Security' },
                { id: 'cancellation_recovery' as const, name: 'Scenario 4: Instant Waitlist Backfill', tag: '100% Occupancy' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleQuickRun(s.id)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.6rem 0.75rem',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    color: '#0F172A',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'background-color 150ms ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F0FAF7')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <span>{s.name}</span>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      padding: '0.1rem 0.4rem',
                      borderRadius: '4px',
                      backgroundColor: '#DCFCE7',
                      color: '#15803D',
                    }}
                  >
                    {s.tag}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => {
              setShowNotifMenu(!showNotifMenu);
              if (!showNotifMenu) {
                dispatch({ type: 'MARK_NOTIFICATIONS_READ' });
              }
            }}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#475569',
              backgroundColor: '#FFFFFF',
              position: 'relative',
            }}
            aria-label="View notifications"
          >
            <Bell size={17} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-3px',
                  right: '-3px',
                  backgroundColor: '#EF4444',
                  color: '#FFFFFF',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifMenu && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '320px',
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                padding: '0.85rem',
                zIndex: 50,
              }}
            >
              <div
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#0F172A',
                  marginBottom: '0.65rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span>Live Event Stream</span>
                <span style={{ fontSize: '0.72rem', color: '#10B981' }}>● Real-time</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '260px', overflowY: 'auto' }}>
                {state.notifications.map((notif) => (
                  <div
                    key={notif.id}
                    style={{
                      padding: '0.55rem',
                      borderRadius: '8px',
                      backgroundColor: '#F8FAFC',
                      fontSize: '0.78rem',
                    }}
                  >
                    <div style={{ fontWeight: 700, color: '#0F172A' }}>{notif.title}</div>
                    <div style={{ color: '#475569', marginTop: '0.15rem' }}>{notif.message}</div>
                    <div style={{ fontSize: '0.68rem', color: '#94A3B8', marginTop: '0.3rem' }}>
                      {notif.timestamp}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Export PDF Button matching CheckinOs */}
        <Button
          variant="primary"
          size="sm"
          onClick={handleExportPDF}
          iconLeft={<Download size={14} />}
        >
          Export PDF
        </Button>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .header-search-container { display: flex !important; }
        }
      `}</style>
    </header>
  );
};
