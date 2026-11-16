import { AlertCircle, CheckCircle2, Info, Loader2 } from 'lucide-react';
import { useEffect, useId, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import { company } from '../../content/company';
import { gsap, motionOK } from '../../lib/motion';
import {
  emptyQuote,
  FIELD_ORDER,
  LIMITS,
  serviceOptions,
  validateField,
  validateQuote,
  type QuoteErrors,
  type QuoteField,
  type QuoteForm as QuoteFormData,
} from '../../lib/validation';
import { isLive, submitQuote, type SubmitResult } from '../../services/quoteRequest';
import { ArrowRight } from '../ui/Icons';

const LABELS: Record<QuoteField, string> = {
  name: 'Nimi',
  organisation: 'Yritys / taloyhtiö',
  email: 'Sähköposti',
  phone: 'Puhelinnumero',
  location: 'Kohteen sijainti',
  service: 'Palvelun tyyppi',
  message: 'Viesti',
};

export function QuoteForm() {
  const uid = useId();
  const fid = (f: string) => `${uid}-${f}`;
  const [form, setForm] = useState<QuoteFormData>(emptyQuote);
  const [errors, setErrors] = useState<QuoteErrors>({});
  const [touched, setTouched] = useState<Partial<Record<QuoteField, boolean>>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | SubmitResult['status']>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [showSummary, setShowSummary] = useState(false);
  const openedAt = useRef(0);
  const summary = useRef<HTMLDivElement>(null);
  const result = useRef<HTMLDivElement>(null);

  useEffect(() => {
    openedAt.current = Date.now();
  }, []);

  const set = (field: keyof QuoteFormData) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const next = { ...form, [field]: e.target.value };
    setForm(next);
    // Once a field has been visited, re-validate it live so errors clear as soon as they are fixed
    if (field !== 'website' && touched[field]) setErrors((er) => ({ ...er, [field]: validateField(field, next) }));
  };

  const blur = (field: QuoteField) => () => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors((er) => ({ ...er, [field]: validateField(field, form) }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === 'sending') return;
    const found = validateQuote(form);
    setErrors(found);
    setTouched(Object.fromEntries(FIELD_ORDER.map((f) => [f, true])));
    const first = FIELD_ORDER.find((f) => found[f]);
    if (first) {
      setShowSummary(true);
      requestAnimationFrame(() => summary.current?.focus());
      return;
    }
    setShowSummary(false);
    setStatus('sending');
    const res = await submitQuote(form, openedAt.current);
    setStatus(res.status);
    if (res.status === 'error') setErrorMsg(res.message);
    if (res.status !== 'error') setForm(emptyQuote);
    requestAnimationFrame(() => {
      result.current?.focus();
      if (motionOK() && result.current) gsap.fromTo(result.current, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.8, ease: 'expo.inOut' });
    });
  };

  const errorList = FIELD_ORDER.filter((f) => errors[f]);
  const describedBy = (f: QuoteField, hint?: boolean) => [hint ? fid(`${f}-hint`) : '', errors[f] ? fid(`${f}-err`) : ''].filter(Boolean).join(' ') || undefined;

  if (status === 'demo' || status === 'sent' || status === 'spam') {
    const demo = status !== 'sent';
    return (
      <div ref={result} tabIndex={-1} role="status" className="border border-ink bg-paper p-6 outline-none sm:p-10">
        <div className="flex items-start gap-4">
          {demo ? <Info aria-hidden="true" className="mt-1 size-6 shrink-0 text-signal-ink" /> : <CheckCircle2 aria-hidden="true" className="mt-1 size-6 shrink-0 text-signal-ink" />}
          <div>
            <p className="t-label text-signal-ink">{demo ? 'Demotila – viestiä ei lähetetty' : 'Kiitos!'}</p>
            <h3 className="t-h3 mt-3 text-[clamp(1.6rem,3vw,2.25rem)]">{demo ? 'Lomake toimi, mutta mitään ei lähetetty.' : 'Tarjouspyyntösi on lähetetty.'}</h3>
            <p className="mt-4 max-w-[56ch] text-ink-2">
              {demo
                ? 'Tämä on sivuston konseptiversio, jonka lomake ei ole yhteydessä mihinkään palveluun: antamiasi tietoja ei lähetetty eikä tallennettu. Ota yhteyttä Karjalan Mestareihin suoraan puhelimitse tai sähköpostitse.'
                : 'Palaamme asiaan mahdollisimman pian.'}
            </p>
            {demo && (
              <p className="mt-6">
                <a href={`tel:${company.phoneHref}`} className="t-mono tabular link-line text-lg">
                  {company.phone}
                </a>
              </p>
            )}
            <button type="button" className="t-label link-line mt-8" onClick={() => setStatus('idle')}>
              Täytä uusi lomake
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} aria-describedby={fid('privacy')} className="relative">
      {showSummary && errorList.length > 0 && (
        <div ref={summary} tabIndex={-1} role="alert" className="mb-8 border-l-4 border-signal-ink bg-signal/8 p-5 outline-none">
          <p className="flex items-center gap-2 font-[650]">
            <AlertCircle aria-hidden="true" className="size-5 text-signal-ink" />
            Tarkista {errorList.length === 1 ? 'yksi kenttä' : `${errorList.length} kenttää`}:
          </p>
          <ul className="mt-3 space-y-1">
            {errorList.map((f) => (
              <li key={f}>
                <a
                  href={`#${fid(f)}`}
                  className="link-line text-signal-ink"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(fid(f))?.focus();
                  }}
                >
                  {LABELS[f]}: {errors[f]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-x-6 gap-y-7 sm:grid-cols-2">
        <Field id={fid('name')} label={LABELS.name} required error={errors.name} errId={fid('name-err')}>
          <input
            id={fid('name')}
            className="field-input"
            name="name"
            autoComplete="name"
            maxLength={LIMITS.name}
            value={form.name}
            onChange={set('name')}
            onBlur={blur('name')}
            aria-invalid={!!errors.name}
            aria-describedby={describedBy('name')}
            required
          />
        </Field>
        <Field id={fid('organisation')} label={LABELS.organisation} optional error={errors.organisation} errId={fid('organisation-err')}>
          <input
            id={fid('organisation')}
            className="field-input"
            name="organisation"
            autoComplete="organization"
            maxLength={LIMITS.organisation}
            value={form.organisation}
            onChange={set('organisation')}
            onBlur={blur('organisation')}
            aria-invalid={!!errors.organisation}
            aria-describedby={describedBy('organisation')}
          />
        </Field>
        <Field id={fid('email')} label={LABELS.email} required error={errors.email} errId={fid('email-err')}>
          <input
            id={fid('email')}
            className="field-input"
            type="email"
            name="email"
            inputMode="email"
            autoComplete="email"
            maxLength={LIMITS.email}
            value={form.email}
            onChange={set('email')}
            onBlur={blur('email')}
            aria-invalid={!!errors.email}
            aria-describedby={describedBy('email')}
            required
          />
        </Field>
        <Field id={fid('phone')} label={LABELS.phone} optional error={errors.phone} errId={fid('phone-err')} hint="Soitamme mielellämme, jos se sopii sinulle." hintId={fid('phone-hint')}>
          <input
            id={fid('phone')}
            className="field-input t-mono"
            type="tel"
            name="phone"
            inputMode="tel"
            autoComplete="tel"
            maxLength={LIMITS.phone}
            value={form.phone}
            onChange={set('phone')}
            onBlur={blur('phone')}
            aria-invalid={!!errors.phone}
            aria-describedby={describedBy('phone', true)}
          />
        </Field>
        <Field id={fid('location')} label={LABELS.location} required error={errors.location} errId={fid('location-err')} hint="Paikkakunta tai osoite." hintId={fid('location-hint')}>
          <input
            id={fid('location')}
            className="field-input"
            name="location"
            autoComplete="address-level2"
            maxLength={LIMITS.location}
            value={form.location}
            onChange={set('location')}
            onBlur={blur('location')}
            aria-invalid={!!errors.location}
            aria-describedby={describedBy('location', true)}
            required
          />
        </Field>
        <Field id={fid('service')} label={LABELS.service} optional error={errors.service} errId={fid('service-err')} hint="Valitse lähin – tarkennetaan yhdessä." hintId={fid('service-hint')}>
          <select
            id={fid('service')}
            className="field-input"
            name="service"
            value={form.service}
            onChange={set('service')}
            onBlur={blur('service')}
            aria-invalid={!!errors.service}
            aria-describedby={describedBy('service', true)}
          >
            <option value="">Valitse palvelu</option>
            {serviceOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
        <div className="sm:col-span-2">
          <Field
            id={fid('message')}
            label={LABELS.message}
            required
            error={errors.message}
            errId={fid('message-err')}
            hint={`Mitä katolle pitäisi tehdä? Esim. katon tyyppi, koko ja toivottu aikataulu. ${form.message.length} / ${LIMITS.message}`}
            hintId={fid('message-hint')}
          >
            <textarea
              id={fid('message')}
              className="field-input min-h-44 resize-y"
              name="message"
              rows={6}
              maxLength={LIMITS.message}
              value={form.message}
              onChange={set('message')}
              onBlur={blur('message')}
              aria-invalid={!!errors.message}
              aria-describedby={describedBy('message', true)}
              required
            />
          </Field>
        </div>
      </div>

      {/* Honeypot – hidden from people and assistive tech; bots tend to fill it */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={fid('website')}>Jätä tämä kenttä tyhjäksi</label>
        <input id={fid('website')} name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} />
      </div>

      <div className="mt-10 flex flex-col gap-6 border-t border-ink/20 pt-8 lg:flex-row lg:items-start lg:justify-between">
        <div id={fid('privacy')} className="max-w-[52ch] text-[0.88rem] text-ink-2">
          <p>
            <span className="text-signal-ink">*</span> pakollinen kenttä. Tietoja käytetään vain tarjouspyyntöön vastaamiseen.
          </p>
          {!isLive && (
            <p className="mt-2 flex gap-2 font-[560] text-ink">
              <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-signal-ink" />
              Konseptidemo: lomake ei lähetä eikä tallenna tietoja.
            </p>
          )}
        </div>
        <button type="submit" className="btn shrink-0 self-start disabled:cursor-wait" disabled={status === 'sending'} aria-busy={status === 'sending'}>
          <span className="btn-label">{status === 'sending' ? 'Lähetetään…' : 'Lähetä tarjouspyyntö'}</span>
          <span className="btn-icon">{status === 'sending' ? <Loader2 aria-hidden="true" className="size-4 animate-spin" /> : <ArrowRight className="size-4" />}</span>
        </button>
      </div>

      {status === 'error' && (
        <div ref={result} tabIndex={-1} role="alert" className="mt-6 flex gap-3 border-l-4 border-signal-ink bg-signal/8 p-5 outline-none">
          <AlertCircle aria-hidden="true" className="size-5 shrink-0 text-signal-ink" />
          <p>
            {errorMsg} Yritä uudelleen tai soita{' '}
            <a href={`tel:${company.phoneHref}`} className="t-mono link-line">
              {company.phone}
            </a>
            .
          </p>
        </div>
      )}
    </form>
  );
}

function Field({
  id,
  label,
  required,
  optional,
  error,
  errId,
  hint,
  hintId,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
  errId: string;
  hint?: string;
  hintId?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 flex items-baseline justify-between gap-3 text-[0.92rem] font-[620]">
        <span>
          {label}
          {required && (
            <span aria-hidden="true" className="ml-1 text-signal-ink">
              *
            </span>
          )}
        </span>
        {optional && <span className="t-label text-ink-3">Valinnainen</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={hintId} className="mt-2 text-[0.82rem] text-ink-3">
          {hint}
        </p>
      )}
      {hint && error && (
        <p id={hintId} className="sr-only">
          {hint}
        </p>
      )}
      {error && (
        <p id={errId} className="mt-2 flex items-start gap-1.5 text-[0.85rem] font-[560] text-signal-ink">
          <AlertCircle aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
