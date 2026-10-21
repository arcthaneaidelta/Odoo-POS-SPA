import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Emblem } from './BrandLogo';
import { useDemo } from '../state/DemoProvider';
import type { Session } from '../state/types';

interface Ctx {
  enter: (role?: Session['role'], to?: string) => void;
}
const EntryContext = createContext<Ctx | null>(null);

const reduced = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/** Polished "entering your client space" transition. Always resolves via timers, so it can never get stuck. */
export function PortalEntryProvider({ children }: { children: ReactNode }) {
  const { dispatch } = useDemo();
  const navigate = useNavigate();
  const [role, setRole] = useState<Session['role'] | null>(null);
  const busy = useRef(false);

  const enter = useCallback<Ctx['enter']>(
    (r = 'client', to) => {
      if (busy.current) return;
      busy.current = true;
      setRole(r);
      const wait = reduced() ? 150 : 1050;
      window.setTimeout(() => {
        dispatch({ type: 'LOGIN', role: r });
        navigate(to ?? (r === 'admin' ? '/admin' : '/portal/dashboard'));
        window.setTimeout(() => {
          setRole(null);
          busy.current = false;
        }, 300);
      }, wait);
    },
    [dispatch, navigate],
  );

  const api = useMemo(() => ({ enter }), [enter]);

  return (
    <EntryContext.Provider value={api}>
      {children}
      {role && (
        <div className="entry" role="status" aria-live="polite">
          <Emblem size={56} draw />
          <p>{role === 'admin' ? 'Opening the operations view' : 'Preparing your client space'}</p>
          <small>Interactive demo · simulated data only</small>
        </div>
      )}
    </EntryContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useEnterPortal() {
  const ctx = useContext(EntryContext);
  if (!ctx) throw new Error('useEnterPortal must be used inside PortalEntryProvider');
  return ctx.enter;
}

/** One-time-per-session intro. Short, skippable, and driven purely by timers. */
export function IntroLoader() {
  const { pathname } = useLocation();
  const [phase, setPhase] = useState<'show' | 'leaving' | 'gone'>(() => {
    try {
      if (sessionStorage.getItem('hw-intro')) return 'gone';
      if (pathname.startsWith('/portal') || pathname.startsWith('/admin')) return 'gone';
    } catch {
      return 'gone';
    }
    return 'show';
  });

  useEffect(() => {
    try {
      sessionStorage.setItem('hw-intro', '1');
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (phase !== 'show') return;
    const t1 = window.setTimeout(() => setPhase('leaving'), reduced() ? 250 : 1350);
    return () => window.clearTimeout(t1);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'leaving') return;
    const t2 = window.setTimeout(() => setPhase('gone'), 500);
    return () => window.clearTimeout(t2);
  }, [phase]);

  if (phase === 'gone') return null;
  return (
    <div
      className={`intro ${phase === 'leaving' ? 'is-leaving' : ''}`}
      role="status"
      aria-label="Loading Havenwell Concierge"
      onClick={() => setPhase('leaving')}
    >
      <Emblem size={72} draw />
      <p className="intro__word">
        Havenwell<small>Concierge</small>
      </p>
      <p className="intro__line">Making space for a more supported recovery.</p>
      <div className="intro__bar" aria-hidden="true">
        <span />
      </div>
    </div>
  );
}

/** Scroll to hash targets or to the top on navigation. */
export function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.slice(1));
      const t = window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' }), 80);
      return () => window.clearTimeout(t);
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname, hash]);
  return null;
}
