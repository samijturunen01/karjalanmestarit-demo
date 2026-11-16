import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

const DEMO = import.meta.env.VITE_DEMO_MODE !== 'false';
const KEY = 'km-demo-notice';

/**
 * Honest, dismissible label for the speculative redesign. Rendered after
 * hydration only (keeps prerendered HTML identical). Shows the full sentence
 * for a few seconds, then folds into a small "Demo" chip so it never covers
 * content for long; hover / focus unfolds it again.
 */
export function DemoNotice() {
  const [state, setState] = useState<'hidden' | 'full' | 'chip'>('hidden');

  useEffect(() => {
    if (!DEMO) return;
    let dismissed = false;
    try {
      dismissed = sessionStorage.getItem(KEY) === '1';
    } catch {
      /* storage unavailable – show the notice */
    }
    if (dismissed) return;
    const t1 = setTimeout(() => setState('full'), 3600);
    const t2 = setTimeout(() => setState((s) => (s === 'full' ? 'chip' : s)), 11000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (state === 'hidden') return null;
  const full = state === 'full';
  return (
    <aside
      data-demo-notice
      aria-label="Huomautus"
      onMouseEnter={() => setState('full')}
      onMouseLeave={() => setState('chip')}
      onFocus={() => setState('full')}
      className="t-mono group fixed bottom-3 left-3 z-30 flex max-w-[calc(100vw-1.5rem)] items-center gap-2.5 border border-on-dark/10 bg-bitumen py-1.5 pr-1.5 pl-3 text-[0.7rem] text-on-dark shadow-[0_12px_32px_-12px_rgb(0_0_0/0.5)]"
    >
      <span aria-hidden="true" className="size-1.5 shrink-0 bg-signal-bright" />
      {full ? (
        <span>
          Konseptidemo <span className="text-on-dark-2">· ei virallinen sivusto</span>
        </span>
      ) : (
        <span>
          Demo<span className="sr-only"> – konseptiversio, ei yrityksen virallinen sivusto</span>
        </span>
      )}
      <button
        type="button"
        aria-label="Sulje huomautus"
        className="grid size-7 place-items-center text-on-dark-2 transition-colors hover:text-on-dark"
        onClick={() => {
          setState('hidden');
          try {
            sessionStorage.setItem(KEY, '1');
          } catch {
            /* ignore */
          }
        }}
      >
        <X aria-hidden="true" className="size-3.5" />
      </button>
    </aside>
  );
}
