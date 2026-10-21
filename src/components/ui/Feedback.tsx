import { Check, CircleAlert, Clock, FileText, Circle, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export type Tone = 'sage' | 'sand' | 'blue' | 'neutral' | 'alert';

const TONE_ICON: Record<Tone, LucideIcon> = {
  sage: Check,
  sand: Clock,
  blue: FileText,
  neutral: Circle,
  alert: CircleAlert,
};

export function StatusBadge({ tone = 'neutral', children, icon = true }: { tone?: Tone; children: ReactNode; icon?: boolean }) {
  const Icon = TONE_ICON[tone];
  return (
    <span className={`badge badge--${tone}`}>
      {icon && <Icon size={12} strokeWidth={2.2} aria-hidden="true" />}
      {children}
    </span>
  );
}

export function ProgressBar({ value, label, size = 'md' }: { value: number; label: string; size?: 'sm' | 'md' }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className={`pbar pbar--${size}`} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={v} aria-label={label}>
      <div className="pbar__fill" style={{ transform: `scaleX(${v / 100})` }} />
    </div>
  );
}

export function ProgressRing({ value, size = 120, stroke = 9, label }: { value: number; size?: number; stroke?: number; label: string }) {
  const v = Math.max(0, Math.min(100, value));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="ring" style={{ width: size, height: size }} role="img" aria-label={`${label}: ${v}%`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E7EDE5" strokeWidth={stroke} />
        <circle
          className="ring__arc"
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#525F53"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - v / 100)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="ring__label">
        <strong>{v}%</strong>
        <span>complete</span>
      </div>
    </div>
  );
}

export function EmptyState({ icon, title, children, action }: { icon?: ReactNode; title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="empty">
      <div className="empty__icon" aria-hidden="true">
        {icon}
      </div>
      <h3>{title}</h3>
      {children && <p>{children}</p>}
      {action}
    </div>
  );
}

export function PageHeader({ eyebrow, title, description, actions }: { eyebrow?: string; title: string; description?: ReactNode; actions?: ReactNode }) {
  return (
    <header className="page-header">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="page-title">{title}</h1>
        {description && <p className="page-desc">{description}</p>}
      </div>
      {actions && <div className="page-header__actions">{actions}</div>}
    </header>
  );
}

export function Skeleton({ height = 16, width = '100%' }: { height?: number; width?: number | string }) {
  return <div className="skeleton" style={{ height, width }} aria-hidden="true" />;
}
