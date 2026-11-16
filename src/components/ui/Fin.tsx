import type { ReactNode } from 'react';

/**
 * Last word of a headline + a coloured full stop, glued together so the
 * stop can never wrap onto a line of its own (SplitText treats the nested
 * element as a separate word otherwise).
 */
export function Fin({ children, tone = 'signal' }: { children: ReactNode; tone?: 'signal' | 'bright' }) {
  return (
    <span className="whitespace-nowrap">
      {children}
      <span className={tone === 'bright' ? 'text-signal-bright' : 'text-signal'}>.</span>
    </span>
  );
}
