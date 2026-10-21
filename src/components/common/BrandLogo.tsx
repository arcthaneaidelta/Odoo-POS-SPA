import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showBadge?: boolean;
  light?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  showBadge = false,
  light = false,
}) => {
  const iconSizes = {
    sm: 22,
    md: 28,
    lg: 36,
  };

  const textClasses = {
    sm: 'text-sm font-bold',
    md: 'text-lg font-bold',
    lg: 'text-2xl font-extrabold',
  };

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: size === 'sm' ? '0.5rem' : '0.65rem',
        textDecoration: 'none',
        userSelect: 'none',
      }}
      className={className}
    >
      {/* Precision Geometric SVG Logo */}
      <svg
        width={iconSizes[size]}
        height={iconSizes[size]}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        <rect
          width="32"
          height="32"
          rx="8"
          fill={light ? '#FFFFFF' : '#0D4E43'}
        />
        {/* Flow loops */}
        <path
          d="M8 12C8 9.79086 9.79086 8 12 8H20C22.2091 8 24 9.79086 24 12V14C24 15.6569 22.6569 17 21 17H11C9.34315 17 8 18.3431 8 20V20C8 22.2091 9.79086 24 12 24H20C22.2091 24 24 22.2091 24 20"
          stroke={light ? '#0D4E43' : '#34D399'}
          strokeWidth="2.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Reservation Sync Dot */}
        <circle
          cx="21"
          cy="11"
          r="2.5"
          fill={light ? '#10B981' : '#FFFFFF'}
        />
        <circle
          cx="11"
          cy="21"
          r="2.5"
          fill={light ? '#10B981' : '#FFFFFF'}
        />
      </svg>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <span
          className={textClasses[size]}
          style={{
            letterSpacing: '-0.03em',
            color: light ? '#FFFFFF' : '#0F172A',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'baseline',
          }}
        >
          RESERVA
          <span
            style={{
              color: light ? '#34D399' : '#0D4E43',
              marginLeft: '0.2rem',
              fontWeight: 600,
            }}
          >
            FLOW
          </span>
        </span>

        {showBadge && (
          <span
            style={{
              fontSize: '0.65rem',
              fontWeight: 700,
              padding: '0.15rem 0.45rem',
              borderRadius: '9999px',
              backgroundColor: light ? 'rgba(255,255,255,0.2)' : 'var(--color-forest-100)',
              color: light ? '#FFFFFF' : 'var(--color-forest-700)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            v2.4
          </span>
        )}
      </div>
    </div>
  );
};
