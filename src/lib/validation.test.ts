import { describe, expect, it } from 'vitest';
import { emptyQuote, normalise, validateField, validateQuote } from './validation';

const valid = {
  ...emptyQuote,
  name: 'Maija Meikäläinen',
  email: 'maija@esimerkki.fi',
  location: 'Joensuu',
  message: 'Kerrostalon katon kuntokartoitus ja mahdollinen uusiminen ensi kesänä.',
};

describe('quote form validation', () => {
  it('accepts a complete request', () => {
    expect(validateQuote(valid)).toEqual({});
  });

  it('requires name, email, location and message – in Finnish', () => {
    const errors = validateQuote(emptyQuote);
    expect(Object.keys(errors).sort()).toEqual(['email', 'location', 'message', 'name']);
    expect(errors.email).toMatch(/sähköposti/i);
  });

  it('keeps organisation, phone and service optional but checks them when given', () => {
    expect(validateField('phone', { ...valid, phone: '' })).toBeUndefined();
    expect(validateField('phone', { ...valid, phone: '040 123 4567' })).toBeUndefined();
    expect(validateField('phone', { ...valid, phone: '+358 40 123 4567' })).toBeUndefined();
    expect(validateField('phone', { ...valid, phone: 'soita illalla' })).toMatch(/puhelinnumero/i);
    expect(validateField('service', { ...valid, service: 'not-a-service' })).toBeDefined();
    expect(validateField('service', { ...valid, service: 'rakennuspellitykset' })).toBeUndefined();
  });

  it('rejects malformed e-mail addresses', () => {
    for (const email of ['maija', 'maija@', 'maija@esimerkki', 'a b@c.fi']) {
      expect(validateField('email', { ...valid, email }), email).toBeDefined();
    }
  });

  it('enforces length limits', () => {
    expect(validateField('message', { ...valid, message: 'lyhyt' })).toBeDefined();
    expect(validateField('message', { ...valid, message: 'x'.repeat(3001) })).toMatch(/liian pitkä/);
    expect(validateField('name', { ...valid, name: 'x'.repeat(101) })).toBeDefined();
  });

  it('normalises whitespace and e-mail case before validating', () => {
    const n = normalise({ ...valid, name: '  Maija   Meikäläinen ', email: ' Maija@Esimerkki.FI ' });
    expect(n.name).toBe('Maija Meikäläinen');
    expect(n.email).toBe('maija@esimerkki.fi');
  });
});
