import React, { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { ProcessStepper } from '../components/timeline/ProcessStepper';
import { useDemo } from '../context/DemoContext';
import { SIMULATION_SCENARIOS } from '../constants/scenarios';
import { SimulationScenarioId } from '../types';
import {
  Play,
  Pause,
  RotateCcw,
  Zap,
  FastForward,
  Terminal,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Shield,
  Layers,
} from 'lucide-react';

export const SimulatorPage: React.FC = () => {
  const { state, dispatch, runScenario, navigate, addToast } = useDemo();
  const [selectedScenarioId, setSelectedScenarioId] = useState<SimulationScenarioId>('flash_booking');

  const { simulationState } = state;
  const currentScenario = SIMULATION_SCENARIOS.find((s) => s.id === selectedScenarioId) || SIMULATION_SCENARIOS[0];

  const handleStartSimulation = () => {
    runScenario(selectedScenarioId);
  };

  const handlePauseResume = () => {
    dispatch({ type: 'PAUSE_RESUME_SIMULATION' });
  };

  const handleResetSimulation = () => {
    dispatch({ type: 'RESET_SIMULATION' });
    addToast('Simulation Reset', 'Sandbox state cleared. Ready for replay.', 'info');
  };

  const handleSpeedChange = (multiplier: number) => {
    dispatch({ type: 'SET_SIMULATION_SPEED', payload: multiplier });
  };

  // Build steps array reflecting current execution progress
  const activeSteps = currentScenario.steps.map((st) => {
    let status = st.status;
    let label = st.statusLabel;

    if (simulationState.isRunning && simulationState.activeScenarioId === selectedScenarioId) {
      if (st.stepIndex < simulationState.currentStepIndex) {
        status = 'completed';
        label = 'Completed';
      } else if (st.stepIndex === simulationState.currentStepIndex) {
        status = 'in_progress';
        label = 'Executing';
      } else {
        status = 'pending';
        label = 'Queued';
      }
    }

    return {
      id: `step-${st.stepIndex}`,
      title: st.title,
      status,
      statusLabel: label,
      agentName: st.agentName,
      avatarText: st.agentName.includes('Sarah') ? 'SL' : 'A',
      timestamp: `T+${(st.delayMs / 1000).toFixed(1)}s`,
      detail: st.impactSummary,
    };
  });

  return (
    <DashboardLayout
      title="Deterministic Execution Simulator"
      subtitle="Verify autonomous reservation workflows, multi-channel conflict resolution, and anti-bot resilience"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Scenario Selection Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1rem',
          }}
        >
          {SIMULATION_SCENARIOS.map((s) => {
            const isSelected = selectedScenarioId === s.id;
            const isCurrentlyRunning = simulationState.isRunning && simulationState.activeScenarioId === s.id;

            return (
              <div
                key={s.id}
                onClick={() => {
                  setSelectedScenarioId(s.id);
                  if (!simulationState.isRunning) {
                    dispatch({ type: 'RESET_SIMULATION' });
                  }
                }}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  border: isSelected ? '2px solid #0D4E43' : '1px solid #E2E8F0',
                  boxShadow: isSelected
                    ? '0 6px 16px rgba(13, 78, 67, 0.14)'
                    : '0 1px 3px rgba(15, 23, 42, 0.04)',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 150ms ease',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.65rem',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      backgroundColor: '#F0FAF7',
                      color: '#065F46',
                      padding: '0.2rem 0.55rem',
                      borderRadius: '9999px',
                    }}
                  >
                    {s.category}
                  </span>

                  {isCurrentlyRunning && (
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        color: '#10B981',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                      }}
                    >
                      <span
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: '#10B981',
                          animation: 'pulseGlow 1s infinite',
                        }}
                      />
                      RUNNING
                    </span>
                  )}
                </div>

                <h3
                  style={{
                    fontSize: '0.98rem',
                    fontWeight: 700,
                    color: '#0F172A',
                    marginBottom: '0.4rem',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {s.title}
                </h3>

                <p style={{ fontSize: '0.78rem', color: '#64748B', lineHeight: 1.45 }}>
                  {s.shortDescription}
                </p>
              </div>
            );
          })}
        </div>

        {/* Master Control Bar */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            padding: '1rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            boxShadow: '0 1px 3px rgba(15, 23, 42, 0.05)',
          }}
        >
          {/* Left: Playback Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Button
              variant="emerald"
              size="md"
              onClick={handleStartSimulation}
              isLoading={simulationState.isRunning}
              iconLeft={<Play size={16} />}
            >
              {simulationState.isRunning ? 'Executing Scenario...' : 'Run Simulation'}
            </Button>

            <Button
              variant="secondary"
              size="md"
              onClick={handleResetSimulation}
              iconLeft={<RotateCcw size={15} />}
            >
              Reset
            </Button>
          </div>

          {/* Middle: Execution Status Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 600 }}>
              Speed:
            </span>
            {[1, 2, 5].map((multiplier) => (
              <button
                key={multiplier}
                onClick={() => handleSpeedChange(multiplier)}
                style={{
                  padding: '0.25rem 0.65rem',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  backgroundColor: simulationState.speedMultiplier === multiplier ? '#0D4E43' : '#F1F5F9',
                  color: simulationState.speedMultiplier === multiplier ? '#FFFFFF' : '#475569',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                }}
              >
                {multiplier}x
              </button>
            ))}
          </div>

          {/* Right: Cross-Module Sync Notice */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#16A34A', fontWeight: 600 }}>
            <CheckCircle2 size={16} />
            Synchronized with Bookings & Dashboard
          </div>
        </div>

        {/* Simulator Split View (Execution Stepper + Live Terminal) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
            gap: '1.5rem',
            alignItems: 'start',
          }}
        >
          {/* Left: Execution Stepper Graph matching Reference Image 4 */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              padding: '1.75rem',
              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.5rem',
                paddingBottom: '0.85rem',
                borderBottom: '1px solid #E2E8F0',
              }}
            >
              <div>
                <span style={{ fontSize: '0.72rem', color: '#0D4E43', fontWeight: 700, textTransform: 'uppercase' }}>
                  Execution Pipeline Graph
                </span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginTop: '0.15rem' }}>
                  {currentScenario.title}
                </h3>
              </div>

              <span
                style={{
                  fontSize: '0.75rem',
                  padding: '0.2rem 0.55rem',
                  borderRadius: '9999px',
                  backgroundColor: '#DCFCE7',
                  color: '#15803D',
                  fontWeight: 700,
                }}
              >
                {simulationState.currentStepIndex}/{currentScenario.steps.length} Steps
              </span>
            </div>

            <ProcessStepper steps={activeSteps} />

            {/* Impact Banner */}
            <div
              style={{
                marginTop: '1.5rem',
                padding: '1rem',
                backgroundColor: '#F0FAF7',
                borderRadius: '10px',
                border: '1px solid #D1FAE5',
              }}
            >
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#065F46', marginBottom: '0.3rem' }}>
                Guaranteed Deterministic Impact
              </div>
              <div style={{ fontSize: '0.82rem', color: '#0D4E43', lineHeight: 1.45 }}>
                {currentScenario.expectedOutcome.alertGenerated}
              </div>
            </div>
          </div>

          {/* Right: Real-time Terminal Log Stream & Cross-Module Inspector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Terminal Window */}
            <div
              style={{
                backgroundColor: '#0F172A',
                borderRadius: '16px',
                border: '1px solid #1E293B',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.25)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  backgroundColor: '#1E293B',
                  padding: '0.65rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid #334155',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Terminal size={15} color="#34D399" />
                  <span style={{ fontSize: '0.75rem', color: '#F8FAFC', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                    SIMULATOR ENGINE STREAM · EVENT BUS
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                </div>
              </div>

              {/* Log Messages */}
              <div
                style={{
                  padding: '1.25rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  lineHeight: 1.6,
                  maxHeight: '340px',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.45rem',
                }}
              >
                {simulationState.logs.map((log, index) => {
                  let color = '#94A3B8';
                  if (log.includes('Initiating') || log.includes('Executing')) color = '#38BDF8';
                  else if (log.includes('Done') || log.includes('validated') || log.includes('Commit') || log.includes('Success')) color = '#34D399';
                  else if (log.includes('WARNING') || log.includes('CONFLICT')) color = '#FBBF24';

                  return (
                    <div key={index} style={{ color }}>
                      {log}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Live State Mutation Card */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                border: '1px solid #E2E8F0',
                padding: '1.25rem',
                boxShadow: '0 2px 6px rgba(15, 23, 42, 0.04)',
              }}
            >
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.65rem' }}>
                Synchronized Target Surfaces
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.82rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.55rem', backgroundColor: '#F8FAFC', borderRadius: '8px' }}>
                  <span style={{ color: '#64748B' }}>Bookings Database:</span>
                  <button
                    onClick={() => navigate('/bookings')}
                    style={{ color: '#0D4E43', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    View in Bookings Hub <ArrowRight size={13} />
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.55rem', backgroundColor: '#F8FAFC', borderRadius: '8px' }}>
                  <span style={{ color: '#64748B' }}>Dashboard Metrics:</span>
                  <button
                    onClick={() => navigate('/dashboard')}
                    style={{ color: '#0D4E43', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    View Occupancy & Revenue <ArrowRight size={13} />
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.55rem', backgroundColor: '#F8FAFC', borderRadius: '8px' }}>
                  <span style={{ color: '#64748B' }}>Activity Audit Stream:</span>
                  <button
                    onClick={() => navigate('/activity')}
                    style={{ color: '#0D4E43', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    Inspect Full Audit Trail <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
