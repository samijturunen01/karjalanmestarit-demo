import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useEffect, useLayoutEffect, useRef, type DependencyList, type RefObject } from 'react';

export const isBrowser = typeof window !== 'undefined';

if (isBrowser) {
  gsap.registerPlugin(ScrollTrigger, SplitText);
  gsap.defaults({ ease: 'power3.out', duration: 0.9 });
}

export { gsap, ScrollTrigger, SplitText };

export const useIsoLayoutEffect = isBrowser ? useLayoutEffect : useEffect;

/** True when motion is allowed (the inline head script adds `html.motion`). */
export function motionOK(): boolean {
  if (!isBrowser) return false;
  return document.documentElement.classList.contains('motion') && !matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Run GSAP code scoped to a container; everything created inside is reverted
 * on unmount / dependency change (ScrollTriggers, SplitText, tweens).
 */
export function useGsap<T extends HTMLElement>(
  setup: (ctx: { root: T; reduced: boolean }) => void | (() => void),
  deps: DependencyList = [],
): RefObject<T | null> {
  const ref = useRef<T>(null);
  useIsoLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const reduced = !motionOK();
    let cleanup: void | (() => void);
    const ctx = gsap.context(() => {
      cleanup = setup({ root, reduced });
    }, root);
    return () => {
      if (typeof cleanup === 'function') cleanup();
      ctx.revert();
    };
  }, deps);
  return ref;
}
