import { createContext, useContext, useEffect, useReducer, type Dispatch, type ReactNode } from 'react';
import { reducer, type Action } from './reducer';
import { createSeed, STATE_VERSION } from './seed';
import type { DemoState } from './types';

const KEY = 'havenwell-demo-state';

function load(): DemoState {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as DemoState;
      if (parsed && parsed.v === STATE_VERSION && Array.isArray(parsed.tasks) && parsed.forms) return parsed;
    }
  } catch {
    /* fall through to a fresh seed */
  }
  return createSeed();
}

interface Ctx {
  state: DemoState;
  dispatch: Dispatch<Action>;
}

const DemoContext = createContext<Ctx | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* storage may be unavailable; demo continues in memory */
    }
  }, [state]);

  return <DemoContext.Provider value={{ state, dispatch }}>{children}</DemoContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDemo(): Ctx {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error('useDemo must be used within DemoProvider');
  return ctx;
}
