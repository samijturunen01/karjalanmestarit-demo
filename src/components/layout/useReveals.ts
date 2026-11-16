import type { RefObject } from 'react';
import { gsap, motionOK, ScrollTrigger, SplitText, useIsoLayoutEffect } from '../../lib/motion';

/**
 * Scroll reveals for everything marked with `data-reveal` inside `root`.
 * Motion language "limitys" (overlap): elements are laid like roofing courses –
 * they rise a short distance and settle, groups overlap in a tight stagger.
 *
 *   data-reveal            fade + rise (batched)
 *   data-reveal="split"    headline lines rise out of a mask (SplitText)
 *   data-reveal="rule"     hairline draws from left
 *   data-reveal="mask"     image uncovers from the eave upwards
 *   data-reveal="draw"     SVG strokes marked [data-draw] draw in; [data-fill] fade after
 *   data-reveal="fade"     opacity only
 *   data-reveal="wipe"     uncovers left → right (clip-path), for stretched SVG lines
 */
export function useReveals(root: RefObject<HTMLElement | null>, key: string) {
  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el || !motionOK()) return;

    const ctx = gsap.context(() => {
      const all = gsap.utils.toArray<HTMLElement>('[data-reveal]', el);
      // A bare `data-reveal` renders as data-reveal="true" in React → default type
      const typeOf = (n: HTMLElement) => (!n.dataset.reveal || n.dataset.reveal === 'true' ? 'up' : n.dataset.reveal);
      const of = (type: string) => all.filter((n) => typeOf(n) === type);

      ScrollTrigger.batch(of('up'), {
        start: 'top 90%',
        once: true,
        onEnter: (batch) =>
          gsap.fromTo(batch, { opacity: 0, y: 34 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.08, overwrite: true }),
      });

      ScrollTrigger.batch(of('fade'), {
        start: 'top 92%',
        once: true,
        onEnter: (batch) => gsap.to(batch, { opacity: 1, duration: 1.1, ease: 'power2.out', stagger: 0.06 }),
      });

      ScrollTrigger.batch(of('wipe'), {
        start: 'top 95%',
        once: true,
        onEnter: (batch) => gsap.fromTo(batch, { clipPath: 'inset(0% 100% 0% 0%)' }, { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)', duration: 1.8, ease: 'expo.inOut' }),
      });

      ScrollTrigger.batch(of('rule'), {
        start: 'top 94%',
        once: true,
        onEnter: (batch) => gsap.to(batch, { scaleX: 1, duration: 1.4, ease: 'expo.inOut', stagger: 0.1 }),
      });

      for (const node of of('split')) {
        // SplitText breaks lines itself and would drop the visible hyphen at a soft
        // hyphen (U+00AD) – "vesikatto / urakointia" instead of "vesikatto- / urakointia".
        // Such headings rise as one block so the browser's own hyphenation is kept.
        if (node.textContent?.includes('­')) {
          gsap.fromTo(
            node,
            { opacity: 0, y: 48 },
            { opacity: 1, y: 0, duration: 1.2, ease: 'power4.out', scrollTrigger: { trigger: node, start: 'top 92%', once: true } },
          );
          continue;
        }
        SplitText.create(node, {
          type: 'lines',
          mask: 'lines',
          linesClass: 'split-line',
          autoSplit: true,
          // keep words glued to inline elements (e.g. a coloured full stop)
          smartWrap: true,
          onSplit(self) {
            gsap.set(node, { opacity: 1 });
            return gsap.from(self.lines, {
              yPercent: 112,
              duration: 1.15,
              ease: 'power4.out',
              stagger: 0.085,
              scrollTrigger: { trigger: node, start: 'top 90%', once: true },
            });
          },
        });
      }

      for (const node of of('mask')) {
        const media = node.querySelector('img, picture, [data-mask-inner]');
        gsap.set(node, { opacity: 1 });
        const tl = gsap.timeline({ scrollTrigger: { trigger: node, start: 'top 88%', once: true } });
        tl.fromTo(node, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.35, ease: 'expo.inOut' });
        if (media) tl.fromTo(media, { scale: 1.18 }, { scale: 1, duration: 2, ease: 'power3.out' }, 0);
      }

      for (const node of of('draw')) {
        const strokes = node.querySelectorAll('[data-draw]');
        const fills = node.querySelectorAll('[data-fill]');
        const tl = gsap.timeline({ scrollTrigger: { trigger: node, start: 'top 85%', once: true } });
        if (strokes.length) tl.to(strokes, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut', stagger: 0.05 });
        if (fills.length) tl.to(fills, { opacity: 1, duration: 0.8, ease: 'power2.out', stagger: 0.05 }, strokes.length ? '-=0.7' : 0);
      }
    }, el);

    // Images and fonts change layout after first paint
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener('load', refresh, { once: true });

    return () => {
      window.removeEventListener('load', refresh);
      ctx.revert();
    };
  }, [key]);
}
