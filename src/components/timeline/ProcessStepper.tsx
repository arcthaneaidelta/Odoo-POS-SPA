import React from 'react';
import { Check } from 'lucide-react';
import { Badge } from '../common/Badge';
import { StepStatus } from '../../types';

export interface ProcessStepItem {
  id: string;
  title: string;
  status: StepStatus;
  statusLabel?: string;
  agentName: string;
  agentRole?: string;
  avatarText?: string;
  timestamp?: string;
  detail?: string;
}

interface ProcessStepperProps {
  steps: ProcessStepItem[];
  currentStepIndex?: number;
  className?: string;
  onStepClick?: (step: ProcessStepItem) => void;
}

export const ProcessStepper: React.FC<ProcessStepperProps> = ({
  steps,
  currentStepIndex,
  className = '',
  onStepClick,
}) => {
  return (
    <div className={`process-stepper-container ${className}`} style={{ position: 'relative' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative' }}>
        {steps.map((step, idx) => {
          const isCompleted = step.status === 'completed';
          const isAwaitingReview = step.status === 'awaiting_review';
          const isBlocked = step.status === 'blocked';
          const isInProgress = step.status === 'in_progress';

          const avatarInitials =
            step.avatarText ||
            (step.agentName.includes('Sarah') ? 'SL' : 'A');

          return (
            <div
              key={step.id || idx}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1.25rem',
                position: 'relative',
              }}
            >
              {/* Vertical Connector Line */}
              {idx < steps.length - 1 && (
                <div
                  style={{
                    position: 'absolute',
                    left: '18px',
                    top: '36px',
                    bottom: '-24px',
                    width: '2px',
                    backgroundColor: isCompleted ? '#10B981' : '#E2E8F0',
                    zIndex: 1,
                    transition: 'background-color 250ms ease',
                  }}
                />
              )}

              {/* Step Circle Indicator matching Reference Image 4 */}
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  zIndex: 2,
                  backgroundColor: isCompleted
                    ? '#14B8A6'
                    : isAwaitingReview || isInProgress
                    ? '#FFFFFF'
                    : '#FFFFFF',
                  border: isCompleted
                    ? '2px solid #14B8A6'
                    : isAwaitingReview || isInProgress
                    ? '3px solid #14B8A6'
                    : '2px solid #CBD5E1',
                  boxShadow:
                    isCompleted || isAwaitingReview
                      ? '0 2px 6px rgba(20, 184, 166, 0.25)'
                      : 'none',
                  transition: 'all 200ms ease',
                }}
              >
                {isCompleted && <Check size={18} color="#FFFFFF" strokeWidth={3} />}
                {(isAwaitingReview || isInProgress) && (
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: '#14B8A6',
                    }}
                  />
                )}
                {isBlocked && (
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#94A3B8',
                    }}
                  />
                )}
              </div>

              {/* Step Content Card matching Reference Image 4 */}
              <div
                onClick={() => onStepClick && onStepClick(step)}
                style={{
                  flex: 1,
                  backgroundColor: '#FFFFFF',
                  borderRadius: '14px',
                  padding: '1.15rem 1.4rem',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 2px 6px rgba(15, 23, 42, 0.04)',
                  cursor: onStepClick ? 'pointer' : 'default',
                  transition: 'all 150ms ease',
                }}
                onMouseEnter={(e) => {
                  if (onStepClick) {
                    e.currentTarget.style.borderColor = '#CBD5E1';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (onStepClick) {
                    e.currentTarget.style.borderColor = '#E2E8F0';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                {/* Header row: Title + Status Badge */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                  }}
                >
                  <h4
                    style={{
                      fontSize: '1.05rem',
                      fontWeight: 700,
                      color: '#0F172A',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {step.title}
                  </h4>

                  <Badge
                    status={step.status}
                    label={step.statusLabel}
                    showDot
                    size="sm"
                  />
                </div>

                {/* Optional description detail */}
                {step.detail && (
                  <p
                    style={{
                      fontSize: '0.84rem',
                      color: '#475569',
                      marginTop: '0.35rem',
                      lineHeight: 1.45,
                    }}
                  >
                    {step.detail}
                  </p>
                )}

                {/* Footer row: Assignee Avatar + Role/Time */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                    marginTop: '0.85rem',
                  }}
                >
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: avatarInitials === 'SL' ? '#BAE6FD' : '#E2E8F0',
                      color: avatarInitials === 'SL' ? '#0369A1' : '#475569',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {avatarInitials}
                  </div>

                  <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 500 }}>
                    {step.agentName}
                    {step.timestamp && ` · ${step.timestamp}`}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
