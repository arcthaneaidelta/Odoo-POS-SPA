import React from 'react';
import { BookingStatus, StepStatus } from '../../types';

interface BadgeProps {
  status: BookingStatus | StepStatus | string;
  label?: string;
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  showDot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  status,
  label,
  size = 'md',
  icon,
  showDot = false,
}) => {
  const normalized = status.toLowerCase();

  const getStyleConfig = () => {
    switch (normalized) {
      case 'confirmed':
      case 'bestätigt':
      case 'bestatigt':
      case 'booked':
      case 'completed':
        return {
          bg: '#DCFCE7',
          color: '#15803D',
          dot: '#16A34A',
          defaultText: label || (normalized === 'bestätigt' || normalized === 'bestatigt' ? 'Bestätigt' : normalized === 'booked' ? 'Booked' : 'Confirmed'),
        };
      case 'cancelled':
      case 'storniert':
        return {
          bg: '#FEE2E2',
          color: '#B91C1C',
          dot: '#DC2626',
          defaultText: label || 'Storniert',
        };
      case 'in_progress':
      case 'running':
      case 'active':
        return {
          bg: '#E0F2FE',
          color: '#0369A1',
          dot: '#0284C7',
          defaultText: label || 'In Progress',
        };
      case 'awaiting_review':
      case 'pending':
      case 'review':
        return {
          bg: '#FEF3C7',
          color: '#B45309',
          dot: '#D97706',
          defaultText: label || 'Awaiting review',
        };
      case 'blocked':
      case 'error':
        return {
          bg: '#F1F5F9',
          color: '#475569',
          dot: '#64748B',
          defaultText: label || 'Blocked',
        };
      default:
        return {
          bg: '#F1F5F9',
          color: '#334155',
          dot: '#64748B',
          defaultText: label || status,
        };
    }
  };

  const config = getStyleConfig();

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        padding: size === 'sm' ? '0.15rem 0.5rem' : '0.25rem 0.65rem',
        borderRadius: '9999px',
        backgroundColor: config.bg,
        color: config.color,
        fontSize: size === 'sm' ? '0.72rem' : '0.8rem',
        fontWeight: 600,
        letterSpacing: '-0.01em',
        userSelect: 'none',
      }}
    >
      {showDot && (
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: config.dot,
            flexShrink: 0,
          }}
        />
      )}
      {icon}
      <span>{config.defaultText}</span>
    </span>
  );
};
