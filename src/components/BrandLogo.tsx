import { BRAND } from '../content/brand';

interface Props {
  size?: number;
  /** Animate the strokes drawing themselves (used by the intro loader). */
  draw?: boolean;
  className?: string;
}

/** The Havenwell emblem: a refined three-leaf sprig inside a soft arch. */
export function Emblem({ size = 32, draw = false, className = '' }: Props) {
  return (
    <svg
      className={`emblem ${draw ? 'emblem--draw' : ''} ${className}`}
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path className="emblem__arch" pathLength={1} d="M9 40V23C9 14.7 15.7 8 24 8s15 6.7 15 15v17" stroke="#D5C3A8" strokeWidth="1.3" strokeLinecap="round" />
      <g stroke="#525F53" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path className="emblem__stem" pathLength={1} d="M24 40V19" />
        <path className="emblem__leaf" pathLength={1} d="M24 31c-5 0-8-3-8-8 5 0 8 3 8 8Z" />
        <path className="emblem__leaf" pathLength={1} d="M24 26c0-5 3-8 8-8 0 5-3 8-8 8Z" />
        <path className="emblem__leaf" pathLength={1} d="M24 19c-2-3-2-6 0-9 2 3 2 6 0 9Z" />
      </g>
    </svg>
  );
}

export function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="brand">
      <Emblem size={compact ? 28 : 34} />
      <span className="brand__word">
        {BRAND.short}
        <span className="brand__sub">Concierge</span>
      </span>
    </span>
  );
}

/** Soft botanical line art used in decorative areas. */
export function Botanical({ className = '', stroke = '#879B88' }: { className?: string; stroke?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 320" fill="none" aria-hidden="true" focusable="false">
      <g stroke={stroke} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M100 316C100 220 108 120 150 12" />
        <path d="M101 262c-30-2-52-20-60-48 30 0 52 18 60 48Z" />
        <path d="M103 222c26-6 44-24 48-52-28 4-46 24-48 52Z" />
        <path d="M105 178c-26-4-44-20-50-46 26 0 44 18 50 46Z" />
        <path d="M112 138c24-8 40-26 42-52-26 6-40 26-42 52Z" />
        <path d="M122 98c-20-6-34-20-38-40 22 2 36 16 38 40Z" />
        <path d="M134 60c16-8 26-22 28-40-18 6-26 20-28 40Z" />
      </g>
    </svg>
  );
}
