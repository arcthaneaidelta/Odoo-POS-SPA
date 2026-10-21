import React, { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { CreateWorkflowModal } from '../components/modals/CreateWorkflowModal';
import { ProcessStepper } from '../components/timeline/ProcessStepper';
import { useDemo } from '../context/DemoContext';
import { Workflow } from '../types';
import {
  Plus,
  Zap,
  Play,
  CheckCircle2,
  Cpu,
  Globe,
  Settings2,
  Trash2,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export const WorkflowsPage: React.FC = () => {
  const { state, dispatch, navigate, runScenario, addToast } = useDemo();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedWfId, setSelectedWfId] = useState<string>(state.workflows[0]?.id || '');

  const activeWorkflow = state.workflows.find((w) => w.id === selectedWfId) || state.workflows[0];

  const handleToggleActive = (id: string, name: string) => {
    dispatch({ type: 'TOGGLE_WORKFLOW_ACTIVE', payload: id });
    const target = state.workflows.find((w) => w.id === id);
    addToast(
      'Workflow State Changed',
      `"${name}" is now ${target?.isActive ? 'Paused' : 'Active'}`,
      'info'
    );
  };

  const handleRunWorkflow = (wf: Workflow) => {
    // Map workflow to corresponding simulation scenario
    let scenarioId: any = 'flash_booking';
    if (wf.id.includes('conflict')) scenarioId = 'channel_conflict';
    else if (wf.id.includes('antibot')) scenarioId = 'antibot_challenge';
    else if (wf.id.includes('waitlist')) scenarioId = 'cancellation_recovery';

    navigate('/simulator');
    setTimeout(() => {
      runScenario(scenarioId);
    }, 300);
  };

  return (
    <DashboardLayout
      title="Workflow Studio & Automation Engine"
      subtitle="Configure multi-agent reservation workflows, headless drop snipers, and overbooking shields"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Top Header Actions & Metric Pills */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Total Workflows:</span>
              <strong style={{ fontSize: '1.1rem', color: '#0F172A' }}>{state.workflows.length}</strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Success Rate:</span>
              <strong style={{ fontSize: '1.1rem', color: '#16A34A' }}>99.4%</strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Active Workers:</span>
              <strong style={{ fontSize: '1.1rem', color: '#0D4E43' }}>6 Dedicated Nodes</strong>
            </div>
          </div>

          <Button
            variant="emerald"
            size="md"
            onClick={() => setIsCreateModalOpen(true)}
            iconLeft={<Plus size={16} />}
          >
            Create Autonomous Workflow
          </Button>
        </div>

        {/* Master / Detail Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '1.5rem',
            alignItems: 'start',
          }}
        >
          {/* Left Column: Workflows List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {state.workflows.map((wf) => {
              const isSelected = wf.id === selectedWfId;

              return (
                <div
                  key={wf.id}
                  onClick={() => setSelectedWfId(wf.id)}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '14px',
                    padding: '1.25rem',
                    border: isSelected ? '2px solid #0D4E43' : '1px solid #E2E8F0',
                    boxShadow: isSelected
                      ? '0 6px 16px rgba(13, 78, 67, 0.12)'
                      : '0 1px 3px rgba(15, 23, 42, 0.04)',
                    cursor: 'pointer',
                    transition: 'all 150ms ease',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: '0.5rem',
                      marginBottom: '0.65rem',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <span
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: wf.isActive ? '#10B981' : '#94A3B8',
                          }}
                        />
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A' }}>
                          {wf.name}
                        </h3>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: '#64748B', lineHeight: 1.4 }}>
                        {wf.description}
                      </p>
                    </div>

                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        backgroundColor: '#F1F5F9',
                        color: '#334155',
                        padding: '0.2rem 0.55rem',
                        borderRadius: '6px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {wf.channel}
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '0.85rem',
                      borderTop: '1px solid #F1F5F9',
                      marginTop: '0.85rem',
                      fontSize: '0.78rem',
                      color: '#64748B',
                    }}
                  >
                    <span>
                      Strategy: <strong>{wf.executionStrategy}</strong>
                    </span>
                    <span>
                      Success: <strong style={{ color: '#16A34A' }}>{wf.successRate}%</strong>
                    </span>
                    <span>
                      Avg: <strong>{wf.avgDurationSec}s</strong>
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      gap: '0.5rem',
                      marginTop: '0.85rem',
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleRunWorkflow(wf)}
                      iconLeft={<Play size={13} />}
                      style={{ flex: 1 }}
                    >
                      Simulate Run
                    </Button>

                    <Button
                      variant={wf.isActive ? 'secondary' : 'emerald'}
                      size="sm"
                      onClick={() => handleToggleActive(wf.id, wf.name)}
                    >
                      {wf.isActive ? 'Pause' : 'Activate'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Interactive Step Inspector matching Reference Image 4 */}
          {activeWorkflow && (
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                padding: '1.75rem',
                boxShadow: '0 2px 8px rgba(15, 23, 42, 0.05)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1.5rem',
                  paddingBottom: '1rem',
                  borderBottom: '1px solid #E2E8F0',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 700, textTransform: 'uppercase' }}>
                    Active Workflow Pipeline Graph
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginTop: '0.2rem' }}>
                    {activeWorkflow.name}
                  </h3>
                </div>

                <Button
                  variant="emerald"
                  size="sm"
                  onClick={() => handleRunWorkflow(activeWorkflow)}
                  iconLeft={<Play size={14} />}
                >
                  Test In Simulator
                </Button>
              </div>

              {/* Vertical Process Stepper matching Image 4 */}
              <ProcessStepper
                steps={activeWorkflow.steps.map((s, idx) => ({
                  id: s.id,
                  title: s.title,
                  status: s.status,
                  statusLabel: s.statusLabel,
                  agentName: s.agentName,
                  avatarText: s.agentName.includes('Sarah') ? 'SL' : 'A',
                  timestamp: s.timestamp,
                  detail: s.detail,
                }))}
              />
            </div>
          )}
        </div>
      </div>

      <CreateWorkflowModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </DashboardLayout>
  );
};
