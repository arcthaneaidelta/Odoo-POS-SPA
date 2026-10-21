import React, { ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'emerald' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  isLoading = false,
  fullWidth = false,
  disabled,
  className = '',
  style,
  ...props
}) => {
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: '#0D4E43',
          color: '#FFFFFF',
          border: '1px solid transparent',
        };
      case 'emerald':
        return {
          backgroundColor: '#10B981',
          color: '#FFFFFF',
          border: '1px solid transparent',
        };
      case 'secondary':
        return {
          backgroundColor: '#FFFFFF',
          color: '#0F172A',
          border: '1px solid #E2E8F0',
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: '#475569',
          border: '1px solid transparent',
        };
      case 'danger':
        return {
          backgroundColor: '#FEE2E2',
          color: '#991B1B',
          border: '1px solid #FECACA',
        };
      default:
        return {};
    }
  };

  const getSizeStyles = (): React.CSSProperties => {
    switch (size) {
      case 'sm':
        return {
          padding: '0.35rem 0.75rem',
          fontSize: '0.8rem',
          borderRadius: '6px',
        };
      case 'lg':
        return {
          padding: '0.75rem 1.5rem',
          fontSize: '0.98rem',
          borderRadius: '12px',
        };
      case 'md':
      default:
        return {
          padding: '0.55rem 1.15rem',
          fontSize: '0.88rem',
          borderRadius: '8px',
        };
    }
  };

  const isDisabled = disabled || isLoading;

  return (
    <button
      disabled={isDisabled}
      className={`btn ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.45rem',
        fontWeight: 600,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.65 : 1,
        transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
        width: fullWidth ? '100%' : 'auto',
        ...getVariantStyles(),
        ...getSizeStyles(),
        ...style,
      }}
      {...props}
    >
      {isLoading ? (
        <svg
          style={{
            animation: 'spinSlow 1s linear infinite',
            width: '16px',
            height: '16px',
          }}
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray="30 60"
          />
        </svg>
      ) : (
        iconLeft
      )}
      {children}
      {!isLoading && iconRight}
    </button>
  );
};
