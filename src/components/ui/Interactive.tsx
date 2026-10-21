import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

export function Accordion({ items }: { items: { q: string; a: ReactNode }[] }) {
  const [open, setOpen] = useState<number[]>([0]);
  const base = useId();
  const toggle = (i: number) =>
    setOpen((cur) => {
      if (cur.includes(i)) return cur.filter((x) => x !== i);
      return [...cur.slice(-1), i]; // at most two open at a time
    });
  return (
    <div className="accordion">
      {items.map((it, i) => {
        const isOpen = open.includes(i);
        return (
          <div key={it.q} className={`accordion__item ${isOpen ? 'is-open' : ''}`}>
            <h3>
              <button type="button" className="accordion__btn" aria-expanded={isOpen} aria-controls={`${base}-p${i}`} id={`${base}-b${i}`} onClick={() => toggle(i)}>
                <span>{it.q}</span>
                <ChevronDown size={20} aria-hidden="true" />
              </button>
            </h3>
            <div className="accordion__panel" id={`${base}-p${i}`} role="region" aria-labelledby={`${base}-b${i}`}>
              <div>
                <p>{it.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${shown ? 'is-in' : ''} ${className}`} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </div>
  );
}

interface PopoverProps {
  triggerClassName?: string;
  triggerLabel: string;
  trigger: ReactNode;
  align?: 'left' | 'right';
  panelClassName?: string;
  children: (close: () => void) => ReactNode;
}

export function Popover({ triggerClassName = 'icon-btn', triggerLabel, trigger, align = 'right', panelClassName = '', children }: PopoverProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="popover" ref={ref}>
      <button ref={btnRef} type="button" className={triggerClassName} aria-label={triggerLabel} aria-haspopup="true" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        {trigger}
      </button>
      {open && <div className={`popover__panel popover__panel--${align} ${panelClassName}`}>{children(() => setOpen(false))}</div>}
    </div>
  );
}
