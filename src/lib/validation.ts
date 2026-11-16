import { services } from '../content/services';

export interface QuoteForm {
  name: string;
  organisation: string;
  email: string;
  phone: string;
  location: string;
  service: string;
  message: string;
  /** Honeypot – must stay empty */
  website: string;
}

export type QuoteField = Exclude<keyof QuoteForm, 'website'>;
export type QuoteErrors = Partial<Record<QuoteField, string>>;

export const emptyQuote: QuoteForm = {
  name: '',
  organisation: '',
  email: '',
  phone: '',
  location: '',
  service: '',
  message: '',
  website: '',
};

export const serviceOptions = [
  ...services.map((s) => ({ value: s.slug, label: s.title })),
  { value: 'kattoremontti', label: 'Kattoremontti / useampi työ' },
  { value: 'en-tieda', label: 'En ole varma – neuvotaan' },
];

export const LIMITS = { name: 100, organisation: 120, email: 160, phone: 30, location: 160, message: 3000 } as const;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Finnish and international numbers: digits, spaces, +, -, ( )
const PHONE = /^\+?[\d\s\-()]{6,20}$/;

export function normalise(form: QuoteForm): QuoteForm {
  const trim = (s: string) => s.replace(/\s+/g, ' ').trim();
  return {
    name: trim(form.name),
    organisation: trim(form.organisation),
    email: form.email.trim().toLowerCase(),
    phone: trim(form.phone),
    location: trim(form.location),
    service: form.service,
    message: form.message.trim(),
    website: form.website,
  };
}

/** Validate a single field; returns a Finnish error message or undefined. */
export function validateField(field: QuoteField, raw: QuoteForm): string | undefined {
  const f = normalise(raw);
  switch (field) {
    case 'name':
      if (!f.name) return 'Kirjoita nimesi.';
      if (f.name.length < 2) return 'Nimi on liian lyhyt.';
      if (f.name.length > LIMITS.name) return `Enintään ${LIMITS.name} merkkiä.`;
      return;
    case 'organisation':
      if (f.organisation.length > LIMITS.organisation) return `Enintään ${LIMITS.organisation} merkkiä.`;
      return;
    case 'email':
      if (!f.email) return 'Kirjoita sähköpostiosoite, jotta voimme vastata.';
      if (!EMAIL.test(f.email) || f.email.length > LIMITS.email) return 'Tarkista sähköpostiosoite (esim. nimi@esimerkki.fi).';
      return;
    case 'phone':
      if (!f.phone) return;
      if (!PHONE.test(f.phone) || f.phone.replace(/\D/g, '').length < 6) return 'Tarkista puhelinnumero (esim. 040 123 4567).';
      return;
    case 'location':
      if (!f.location) return 'Kerro kohteen sijainti (paikkakunta riittää).';
      if (f.location.length > LIMITS.location) return `Enintään ${LIMITS.location} merkkiä.`;
      return;
    case 'service':
      if (f.service && !serviceOptions.some((o) => o.value === f.service)) return 'Valitse palvelu listasta.';
      return;
    case 'message':
      if (!f.message) return 'Kerro lyhyesti, mitä kohteessa pitäisi tehdä.';
      if (f.message.length < 10) return 'Kirjoita vähintään muutama sana.';
      if (f.message.length > LIMITS.message) return `Viesti on liian pitkä (enintään ${LIMITS.message} merkkiä).`;
      return;
  }
}

export const FIELD_ORDER: QuoteField[] = ['name', 'organisation', 'email', 'phone', 'location', 'service', 'message'];

export function validateQuote(form: QuoteForm): QuoteErrors {
  const errors: QuoteErrors = {};
  for (const field of FIELD_ORDER) {
    const e = validateField(field, form);
    if (e) errors[field] = e;
  }
  return errors;
}
