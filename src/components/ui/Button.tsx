import { Link, type LinkProps } from 'react-router-dom';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'light';
type Size = 'sm' | 'md' | 'lg';

interface Shared {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  iconAfter?: ReactNode;
  block?: boolean;
}

const cls = (v: Variant, s: Size, block?: boolean, extra?: string) =>
  ['btn', `btn--${v}`, `btn--${s}`, block ? 'btn--block' : '', extra ?? ''].filter(Boolean).join(' ');

export function Spinner({ size = 16 }: { size?: number }) {
  return (
    <svg className="spinner" width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.5" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, Shared {
  loading?: boolean;
}

export function Button({ variant = 'primary', size = 'md', icon, iconAfter, block, loading, className, children, disabled, type = 'button', ...rest }: ButtonProps) {
  return (
    <button
      type={type}
      className={cls(variant, size, block, className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? <Spinner /> : icon}
      <span>{children}</span>
      {!loading && iconAfter}
    </button>
  );
}

interface ButtonLinkProps extends LinkProps, Shared {}

export function ButtonLink({ variant = 'primary', size = 'md', icon, iconAfter, block, className, children, ...rest }: ButtonLinkProps) {
  return (
    <Link className={cls(variant, size, block, className)} {...rest}>
      {icon}
      <span>{children}</span>
      {iconAfter}
    </Link>
  );
}
