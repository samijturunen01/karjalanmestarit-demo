import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { photos } from '../../content/photos';
import { photographedProjects } from '../../content/references';
import { gsap, motionOK } from '../../lib/motion';
import { Picture } from '../ui/Picture';

const BASE = import.meta.env.BASE_URL;

/** The three photographed reference projects, with an accessible <dialog> lightbox. */
export function Gallery() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState<number | null>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const items = photographedProjects;

  const open = (i: number, btn: HTMLButtonElement) => {
    opener.current = btn;
    setIndex(i);
  };
  const close = () => dialog.current?.close();
  const step = (d: number) => setIndex((i) => (i === null ? i : (i + d + items.length) % items.length));

  useEffect(() => {
    const el = dialog.current;
    if (!el || index === null) return;
    if (!el.open) {
      el.showModal();
      if (motionOK()) gsap.fromTo(el.querySelector('[data-lb-inner]'), { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 0.7, ease: 'expo.inOut' });
    } else if (motionOK()) {
      gsap.fromTo(el.querySelector('[data-lb-img]'), { opacity: 0, x: 24 }, { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out' });
    }
  }, [index]);

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    const onClose = () => {
      setIndex(null);
      opener.current?.focus();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    el.addEventListener('close', onClose);
    el.addEventListener('keydown', onKey);
    return () => {
      el.removeEventListener('close', onClose);
      el.removeEventListener('keydown', onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const current = index === null ? null : items[index];
  const photo = current ? photos[current.photo] : null;

  return (
    <>
      <ul className="grid gap-6 md:grid-cols-3">
        {items.map((p, i) => (
          <li key={p.name}>
            <figure className="group">
              <button
                type="button"
                onClick={(e) => open(i, e.currentTarget)}
                className="relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden bg-paper-3"
                aria-label={`Suurenna kuva: ${p.name}${p.place ? `, ${p.place}` : ''}`}
              >
                <span data-reveal="mask" className="absolute inset-0 block">
                  <Picture
                    photo={p.photo}
                    sizes="(min-width: 768px) 31vw, 92vw"
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-[1.05]"
                  />
                </span>
                <span className="t-label absolute right-3 bottom-3 bg-paper px-2 py-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                  Suurenna
                </span>
              </button>
              <figcaption className="mt-4 flex items-baseline justify-between gap-4 border-t border-ink/25 pt-3">
                <span className="font-[620]">{p.name}</span>
                {p.place && <span className="t-label text-ink-3">{p.place}</span>}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        aria-label={current ? `${current.name} – kuva` : 'Kuva'}
        className="m-auto max-h-[100dvh] max-w-[100vw] bg-transparent p-0 backdrop:bg-bitumen/92"
        onClick={(e) => {
          if (e.target === dialog.current) close();
        }}
      >
        {current && photo && (
          <div data-lb-inner className="on-dark flex w-[min(92vw,72rem)] flex-col">
            <div className="flex items-center justify-between gap-4 px-4 py-3">
              <p className="t-label">
                <span className="text-signal-bright tabular">
                  {(index ?? 0) + 1} / {items.length}
                </span>
                <span className="ml-4">{current.name}</span>
                {current.place && <span className="ml-2 text-on-dark-2">· {current.place}</span>}
              </p>
              <button type="button" onClick={close} className="grid size-10 place-items-center hover:text-signal-bright" aria-label="Sulje">
                <X aria-hidden="true" className="size-5" />
              </button>
            </div>
            <div className="relative bg-bitumen-2">
              <img
                data-lb-img
                src={`${BASE}images/${photo.slug}-${photo.widths[photo.widths.length - 1]}.jpg`}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                className="mx-auto max-h-[78dvh] w-auto"
              />
              <button type="button" onClick={() => step(-1)} aria-label="Edellinen kuva" className="absolute top-1/2 left-2 grid size-11 -translate-y-1/2 place-items-center bg-bitumen/80 hover:text-signal-bright">
                <ChevronLeft aria-hidden="true" className="size-5" />
              </button>
              <button type="button" onClick={() => step(1)} aria-label="Seuraava kuva" className="absolute top-1/2 right-2 grid size-11 -translate-y-1/2 place-items-center bg-bitumen/80 hover:text-signal-bright">
                <ChevronRight aria-hidden="true" className="size-5" />
              </button>
            </div>
            <p className="px-4 py-3 text-sm text-on-dark-2">{photo.alt}</p>
          </div>
        )}
      </dialog>
    </>
  );
}
