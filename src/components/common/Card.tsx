import React from 'react';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'forest' | 'muted';
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  title,
  subtitle,
  action,
  className = '',
  style,
  padding = 'md',
}) => {
  const getPaddingStyle = () => {
    switch (padding) {
      case 'none':
        return '0';
      case 'sm':
        return '0.85rem';
      case 'lg':
        return '1.75rem';
      case 'md':
      default:
        return '1.25rem';
    }
  };

  const isForest = variant === 'forest';

  return (
    <div
      className={`rf-card ${isForest ? 'rf-card-forest' : ''} ${className}`}
      style={{
        backgroundColor: isForest ? '#0D4E43' : variant === 'muted' ? '#F8FAFC' : '#FFFFFF',
        color: isForest ? '#FFFFFF' : '#0F172A',
        border: isForest ? '1px solid #0B3F36' : '1px solid #E2E8F0',
        borderRadius: '12px',
        padding: getPaddingStyle(),
        boxShadow: isForest ? '0 4px 16px rgba(13, 78, 67, 0.25)' : '0 1px 3px rgba(15, 23, 42, 0.05)',
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      {(title || action) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
            gap: '1rem',
          }}
        >
          <div>
            {title && (
              <h3
                style={{
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: isForest ? '#FFFFFF' : '#0F172A',
                  letterSpacing: '-0.01em',
                }}
              >
                {title}
              </h3>
            )}
            {subtitle && (
              <p
                style={{
                  fontSize: '0.8rem',
                  color: isForest ? 'rgba(255, 255, 255, 0.75)' : '#64748B',
                  marginTop: '0.15rem',
                }}
              >
                {subtitle}
              </p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
