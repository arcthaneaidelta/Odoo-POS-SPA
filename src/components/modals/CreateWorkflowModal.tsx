import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useDemo } from '../../context/DemoContext';
import { Workflow, PlatformChannel } from '../../types';
import { Check, ChevronRight, ChevronLeft, Zap, Shield, Globe, Cpu, ArrowRight } from 'lucide-react';

interface CreateWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateWorkflowModal: React.FC<CreateWorkflowModalProps> = ({ isOpen, onClose }) => {
  const { dispatch, addToast } = useDemo();
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [workflowName, setWorkflowName] = useState('High-Yield Weekend Sniper');
  const [description, setDescription] = useState('Monitors prime Saturday suite inventory and locks instant direct reservations upon availability drop.');
  const [channel, setChannel] = useState<PlatformChannel>('Direct');
  const [triggerType, setTriggerType] = useState<Workflow['triggerType']>('schedule');
  const [executionStrategy, setExecutionStrategy] = useState<Workflow['executionStrategy']>('headless_browser');
  const [proxyLocation, setProxyLocation] = useState('Frankfurt, DE (Residential ISP)');
  const [maxRetries, setMaxRetries] = useState(3);
  const [autoTurnstile, setAutoTurnstile] = useState(true);
  const [preAuthAmount, setPreAuthAmount] = useState(2500);

  const resetForm = () => {
    setCurrentStep(1);
    setWorkflowName('High-Yield Weekend Sniper');
  };

  const handleNext = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleDeploy = () => {
    const newWf: Workflow = {
      id: 'wf-' + Date.now(),
      name: workflowName,
      description,
      channel,
      triggerType,
      executionStrategy,
      isActive: true,
      priority: 'high',
      successRate: 99.2,
      totalExecutions: 1,
      avgDurationSec: 1.15,
      createdAt: '2026-10-21',
      steps: [
        {
          id: 'st-1',
          title: 'Inventory Trigger & Window Monitor',
          agentName: 'Cron Ingestion Agent',
          status: 'completed',
          statusLabel: 'Completed',
          detail: `Triggered via ${triggerType} across ${channel} channel.`,
        },
        {
          id: 'st-2',
          title: 'Stealth Residential Worker Allocation',
          agentName: `Worker (${proxyLocation})`,
          status: 'completed',
          statusLabel: 'Completed',
          detail: `Fingerprint rotated with 0 risk score via residential IP.`,
        },
        {
          id: 'st-3',
          title: 'Anti-Bot & Biometric Challenge Clearance',
          agentName: 'Turnstile Solver Bot',
          status: 'completed',
          statusLabel: 'Completed',
          detail: autoTurnstile ? 'Automated turnstile bypass enabled.' : 'Manual challenge verification.',
        },
        {
          id: 'st-4',
          title: 'PMS Finalization & Payment Pre-Auth',
          agentName: 'Opera Cloud PMS Sync',
          status: 'completed',
          statusLabel: 'Completed',
          detail: `Deposit locked: €${preAuthAmount}. Direct reservation finalized.`,
        },
      ],
    };

    dispatch({ type: 'ADD_WORKFLOW', payload: newWf });
    addToast('Workflow Deployed', `"${workflowName}" is now active in your pipeline.`, 'success');
    resetForm();
    onClose();
  };

  const stepsMeta = [
    { num: 1, label: 'Trigger & Target' },
    { num: 2, label: 'Strategy & Proxies' },
    { num: 3, label: 'Guest & Payment' },
    { num: 4, label: 'Anti-Bot Resilience' },
    { num: 5, label: 'Review & Deploy' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        resetForm();
        onClose();
      }}
      title="Create Autonomous Reservation Workflow"
      subtitle="Configure deterministic headless automation rules, proxies, and failover handlers"
      maxWidth="680px"
      footer={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
            Step {currentStep} of 5
          </div>
          <div style={{ display: 'flex', gap: '0.65rem' }}>
            {currentStep > 1 && (
              <Button variant="secondary" size="sm" onClick={handlePrev} iconLeft={<ChevronLeft size={15} />}>
                Previous
              </Button>
            )}
            {currentStep < 5 ? (
              <Button variant="primary" size="sm" onClick={handleNext} iconRight={<ChevronRight size={15} />}>
                Continue
              </Button>
            ) : (
              <Button variant="emerald" size="sm" onClick={handleDeploy} iconLeft={<Zap size={15} />}>
                Activate & Deploy Workflow
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div>
        {/* Wizard Stepper Progress Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.75rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid #E2E8F0',
          }}
        >
          {stepsMeta.map((s, idx) => {
            const isDone = currentStep > s.num;
            const isCurrent = currentStep === s.num;
            return (
              <div
                key={s.num}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  opacity: isCurrent || isDone ? 1 : 0.45,
                }}
              >
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: isDone ? '#10B981' : isCurrent ? '#0D4E43' : '#E2E8F0',
                    color: isDone || isCurrent ? '#FFFFFF' : '#475569',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {isDone ? <Check size={14} strokeWidth={3} /> : s.num}
                </div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: isCurrent ? 700 : 500,
                    color: isCurrent ? '#0D4E43' : '#475569',
                    display: 'none',
                  }}
                  className="step-label"
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Step 1: Trigger & Channel */}
        {currentStep === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                Workflow Name
              </label>
              <input
                type="text"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                Description
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  outline: 'none',
                  resize: 'vertical',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                  Target Platform Channel
                </label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value as PlatformChannel)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    outline: 'none',
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  <option value="Direct">Direct Engine (0% Commission)</option>
                  <option value="Booking.com">Booking.com</option>
                  <option value="Airbnb">Airbnb</option>
                  <option value="OpenTable">OpenTable</option>
                  <option value="Resy">Resy</option>
                  <option value="Agoda">Agoda</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                  Trigger Condition
                </label>
                <select
                  value={triggerType}
                  onChange={(e) => setTriggerType(e.target.value as any)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    outline: 'none',
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  <option value="schedule">Scheduled Drop Monitor (Cron)</option>
                  <option value="overbooking_alert">Overbooking & Channel Conflict Alert</option>
                  <option value="waitlist_event">Cancellation & Waitlist Ingestion</option>
                  <option value="webhook">Real-time Webhook Payload</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Automation Strategy */}
        {currentStep === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>
                Execution Engine Mode
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {[
                  {
                    id: 'headless_browser' as const,
                    title: 'Headless Browser Cluster',
                    desc: 'Spawns stealth Chromium with humanized mouse curves and WebGL canvas emulation.',
                  },
                  {
                    id: 'direct_api' as const,
                    title: 'Direct REST / Webhook API',
                    desc: 'Low-latency encrypted API calls directly into PMS and channel gateways.',
                  },
                ].map((mode) => (
                  <div
                    key={mode.id}
                    onClick={() => setExecutionStrategy(mode.id)}
                    style={{
                      border: executionStrategy === mode.id ? '2px solid #0D4E43' : '1px solid #E2E8F0',
                      backgroundColor: executionStrategy === mode.id ? '#F0FAF7' : '#FFFFFF',
                      borderRadius: '10px',
                      padding: '0.85rem',
                      cursor: 'pointer',
                      transition: 'all 150ms ease',
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Cpu size={16} color="#0D4E43" />
                      {mode.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.35rem', lineHeight: 1.4 }}>
                      {mode.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                Dedicated Residential Proxy Fleet
              </label>
              <select
                value={proxyLocation}
                onChange={(e) => setProxyLocation(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  outline: 'none',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <option value="Frankfurt, DE (Residential ISP)">Frankfurt, DE · Deutsche Telekom (38ms)</option>
                <option value="Zurich, CH (Residential ISP)">Zurich, CH · Swisscom (42ms)</option>
                <option value="London, UK (Mobile 5G)">London, UK · EE Mobile 5G (65ms)</option>
                <option value="New York, US (Residential ISP)">New York, US · Verizon Fios (89ms)</option>
                <option value="Tokyo, JP (Residential ISP)">Tokyo, JP · NTT DoCoMo (94ms)</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 3: Guest & Payment Rules */}
        {currentStep === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0F172A', marginBottom: '0.35rem' }}>
                Automated Guest Profile Vault
              </div>
              <p style={{ fontSize: '0.78rem', color: '#64748B', lineHeight: 1.4 }}>
                When the automated workflow acquires inventory, guest credentials and tokenized credit authorization are injected into the checkout form in under 200ms.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                  Maximum Pre-Auth Hold (€)
                </label>
                <input
                  type="number"
                  value={preAuthAmount}
                  onChange={(e) => setPreAuthAmount(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                  Auto-Apply Loyalty Tier
                </label>
                <select
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    outline: 'none',
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  <option>VIP Black Card (Automatic Room Upgrade)</option>
                  <option>Preferred Hospitality Member</option>
                  <option>Standard Tier</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Anti-Bot & Resilience */}
        {currentStep === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.85rem 1rem',
                backgroundColor: '#F8FAFC',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0F172A' }}>
                  Auto-Solve Cloudflare Turnstile & DataDome
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                  Biometric mouse trajectory and token handshake without stopping execution.
                </div>
              </div>
              <input
                type="checkbox"
                checked={autoTurnstile}
                onChange={(e) => setAutoTurnstile(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                Maximum Automated Retry Attempts on Failover
              </label>
              <select
                value={maxRetries}
                onChange={(e) => setMaxRetries(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  outline: 'none',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <option value={1}>1 Retry (Conservative)</option>
                <option value={3}>3 Retries with IP Rotation (Recommended)</option>
                <option value={5}>5 Retries (Aggressive Drop Mode)</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 5: Review & Deploy */}
        {currentStep === 5 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ backgroundColor: '#F0FAF7', borderRadius: '10px', padding: '1.25rem', border: '1px solid #D1FAE5' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Zap size={18} color="#0D4E43" />
                <strong style={{ fontSize: '1rem', color: '#0D4E43' }}>
                  Ready to Deploy to Production Cluster
                </strong>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#065F46', lineHeight: 1.45 }}>
                Your autonomous workflow will bind to the local simulation bus. It is configured to execute deterministically and will appear across the Workflows Studio, Simulator, and Activity Log.
              </p>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '1rem', fontSize: '0.84rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <span style={{ color: '#64748B' }}>Workflow:</span> <strong>{workflowName}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748B' }}>Channel:</span> <strong>{channel}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748B' }}>Engine:</span> <strong>{executionStrategy}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748B' }}>Proxy:</span> <strong>{proxyLocation.split('·')[0]}</strong>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (min-width: 600px) {
          .step-label { display: inline !important; }
        }
      `}</style>
    </Modal>
  );
};
