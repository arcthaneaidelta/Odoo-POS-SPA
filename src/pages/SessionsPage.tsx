import React, { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Button } from '../components/common/Button';
import { useDemo } from '../context/DemoContext';
import { BrowserWorker } from '../types';
import {
  Cpu,
  Globe,
  RotateCw,
  ShieldCheck,
  Zap,
  Terminal,
  Activity,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

export const SessionsPage: React.FC = () => {
  const { state, dispatch, addToast } = useDemo();
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>(state.workers[0]?.id || '');
  const [isRotating, setIsRotating] = useState(false);

  const selectedWorker = state.workers.find((w) => w.id === selectedWorkerId) || state.workers[0];

  const handleRotateProxy = (workerId: string) => {
    setIsRotating(true);
    addToast('Rotating Proxy', 'Negotiating fresh Residential ISP lease...', 'info');

    setTimeout(() => {
      setIsRotating(false);
      dispatch({
        type: 'UPDATE_WORKER_STATUS',
        payload: { id: workerId, status: 'idle' },
      });
      addToast('Proxy Leased', 'Allocated clean Deutsche Telekom AS3320 node (34ms).', 'success');
      dispatch({
        type: 'ADD_ACTIVITY_EVENT',
        payload: {
          title: 'Manual Proxy Rotation Completed',
          category: 'security',
          actor: 'Proxy Fleet Sentinel',
          actorType: 'security_guard',
          status: 'success',
          details: `Replaced IP for ${selectedWorker.workerName} with zero connection drop.`,
        },
      });
    }, 1200);
  };

  const handleRotateAll = () => {
    setIsRotating(true);
    addToast('Global Rotation', 'Refreshing all 6 residential proxy nodes...', 'info');
    setTimeout(() => {
      setIsRotating(false);
      addToast('Fleet Healthy', 'All workers bound to fresh IPs. Latency optimized to 38ms.', 'success');
    }, 1500);
  };

  return (
    <DashboardLayout
      title="Browser Session Pool & Proxy Fleet"
      subtitle="Headless Chromium orchestration, residential ISP lease health, and biometric solver telemetry"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Top Metric Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
          }}
        >
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.25rem' }}>
            <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>Active Headless Workers</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', marginTop: '0.2rem' }}>
              {state.workers.length} Nodes
            </div>
            <div style={{ fontSize: '0.75rem', color: '#16A34A', marginTop: '0.2rem', fontWeight: 600 }}>
              ● 100% Cluster Availability
            </div>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.25rem' }}>
            <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>Captcha Bypass Success</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0D4E43', marginTop: '0.2rem' }}>
              99.4%
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.2rem' }}>
              Cloudflare & DataDome automated
            </div>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.25rem' }}>
            <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>Average TLS Latency</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', marginTop: '0.2rem' }}>
              38ms
            </div>
            <div style={{ fontSize: '0.75rem', color: '#16A34A', marginTop: '0.2rem', fontWeight: 600 }}>
              Direct ISP peering route
            </div>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.25rem' }}>
            <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>Solves Completed Today</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', marginTop: '0.2rem' }}>
              1,382
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.2rem' }}>
              Zero account lockouts recorded
            </div>
          </div>
        </div>

        {/* Action Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A' }}>
            Worker Nodes Fleet Overview
          </h3>

          <div style={{ display: 'flex', gap: '0.65rem' }}>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleRotateAll}
              isLoading={isRotating}
              iconLeft={<RefreshCw size={14} />}
            >
              Rotate All Residential Proxies
            </Button>
          </div>
        </div>

        {/* Workers Table */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            overflowX: 'auto',
            boxShadow: '0 1px 3px rgba(15, 23, 42, 0.05)',
          }}
        >
          <table className="rf-table" style={{ minWidth: '850px' }}>
            <thead>
              <tr>
                <th>Worker ID & Name</th>
                <th>Status</th>
                <th>Proxy IP & Location</th>
                <th>Network Type</th>
                <th>Latency</th>
                <th>Target Portal</th>
                <th>Captchas</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {state.workers.map((w) => {
                const isSelected = w.id === selectedWorkerId;

                const getStatusPill = () => {
                  switch (w.status) {
                    case 'booking':
                      return { bg: '#DCFCE7', text: '#15803D', label: 'Booking' };
                    case 'solving_captcha':
                      return { bg: '#FEF3C7', text: '#B45309', label: 'Solving Captcha' };
                    case 'reconnecting':
                      return { bg: '#E0F2FE', text: '#0369A1', label: 'Reconnecting' };
                    case 'idle':
                    default:
                      return { bg: '#F1F5F9', text: '#475569', label: 'Idle / Ready' };
                  }
                };

                const pill = getStatusPill();

                return (
                  <tr
                    key={w.id}
                    onClick={() => setSelectedWorkerId(w.id)}
                    style={{
                      cursor: 'pointer',
                      backgroundColor: isSelected ? '#F0FAF7' : undefined,
                    }}
                  >
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <div
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            backgroundColor: '#0D4E43',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Cpu size={15} />
                        </div>
                        <div>
                          <strong style={{ color: '#0F172A', fontSize: '0.86rem' }}>
                            {w.workerName}
                          </strong>
                          <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{w.id}</div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          backgroundColor: pill.bg,
                          color: pill.text,
                          padding: '0.2rem 0.55rem',
                          borderRadius: '9999px',
                        }}
                      >
                        {pill.label}
                      </span>
                    </td>

                    <td>
                      <div style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>
                        {w.ipAddress}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                        {w.proxyLocation}
                      </div>
                    </td>

                    <td>
                      <span style={{ fontSize: '0.82rem', color: '#334155', fontWeight: 500 }}>
                        {w.proxyType}
                      </span>
                    </td>

                    <td>
                      <span
                        style={{
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          color: w.latencyMs < 50 ? '#16A34A' : '#D97706',
                        }}
                      >
                        {w.latencyMs}ms
                      </span>
                    </td>

                    <td>
                      <span style={{ fontSize: '0.82rem', color: '#0F172A', fontWeight: 600 }}>
                        {w.targetPlatform}
                      </span>
                    </td>

                    <td>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                        {w.captchaBypassedToday}
                      </span>
                    </td>

                    <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleRotateProxy(w.id)}
                        iconLeft={<RotateCw size={13} />}
                      >
                        Rotate IP
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Live Terminal & Devtools Inspection Stream */}
        {selectedWorker && (
          <div
            style={{
              backgroundColor: '#0F172A',
              borderRadius: '12px',
              padding: '1.25rem',
              color: '#F8FAFC',
              fontFamily: 'var(--font-mono)',
              border: '1px solid #1E293B',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '0.75rem',
                borderBottom: '1px solid #1E293B',
                marginBottom: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem' }}>
                <Terminal size={15} color="#34D399" />
                <span style={{ color: '#34D399', fontWeight: 700 }}>
                  SESSION LIVE DEVTOOLS CONSOLE · {selectedWorker.workerName}
                </span>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                CPU: {selectedWorker.cpuUsage}% · RAM: {selectedWorker.memoryUsage}%
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.78rem' }}>
              <div style={{ color: '#94A3B8' }}>
                [2026-10-21T15:28:01.042Z] [Worker] Chromium 130.0.6723.92 instance booted with WebGL vendor: Apple M3 Pro.
              </div>
              <div style={{ color: '#38BDF8' }}>
                [2026-10-21T15:28:01.120Z] [Proxy] TLS socket negotiated through residential IP {selectedWorker.ipAddress} ({selectedWorker.proxyLocation}).
              </div>
              <div style={{ color: '#34D399' }}>
                [2026-10-21T15:28:01.350Z] [AntiBot] Handshake verified. Turnstile clearance token injected into localStorage.
              </div>
              <div style={{ color: '#E2E8F0' }}>
                [2026-10-21T15:28:01.590Z] [Target] Monitoring {selectedWorker.targetPlatform} DOM mutation observer for slot availability...
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
