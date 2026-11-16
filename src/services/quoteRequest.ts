import { normalise, type QuoteForm } from '../lib/validation';

/**
 * Quote-request submission.
 *
 * DEMO DEFAULT: `mockTransport` – nothing is sent or stored anywhere. The UI
 * tells the visitor so explicitly.
 *
 * PRODUCTION (later, once approved): set VITE_QUOTE_ENDPOINT at build time to
 * a server endpoint – for example a Google Apps Script web app that performs
 * server-side spam checks and e-mails the request to the right person (see
 * docs/apps-script/Code.gs). No secrets belong in the frontend: anything in
 * VITE_* ends up in the public bundle.
 */

export type SubmitResult =
  | { status: 'sent' }
  | { status: 'demo' }
  | { status: 'spam' }
  | { status: 'error'; message: string };

export interface QuoteTransport {
  send(payload: QuotePayload): Promise<SubmitResult>;
}

export interface QuotePayload extends Omit<QuoteForm, 'website'> {
  /** Honeypot value – forwarded so the server can reject bots too */
  hp: string;
  /** ms the form was open before submit (simple bot heuristic, checked server-side) */
  elapsedMs: number;
  page: string;
}

/** Demo handler: simulates latency, sends nothing, stores nothing. */
export const mockTransport: QuoteTransport = {
  async send() {
    await new Promise((r) => setTimeout(r, 900));
    return { status: 'demo' };
  },
};

/**
 * Google Apps Script style endpoint. Uses a "simple" CORS request
 * (text/plain body) so no preflight is needed; the script parses JSON.
 */
export function endpointTransport(endpoint: string): QuoteTransport {
  return {
    async send(payload) {
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload),
          credentials: 'omit',
          redirect: 'follow',
        });
        if (!res.ok) return { status: 'error', message: `Palvelin vastasi virheellä (${res.status}).` };
        const data = (await res.json().catch(() => ({}))) as { ok?: boolean };
        return data.ok ? { status: 'sent' } : { status: 'error', message: 'Lähetys ei onnistunut.' };
      } catch {
        return { status: 'error', message: 'Yhteys palvelimeen epäonnistui.' };
      }
    },
  };
}

const endpoint = (import.meta.env.VITE_QUOTE_ENDPOINT as string | undefined)?.trim();
/** Only https endpoints are accepted. */
export const isLive = Boolean(endpoint && endpoint.startsWith('https://'));
const transport: QuoteTransport = isLive ? endpointTransport(endpoint as string) : mockTransport;

export async function submitQuote(form: QuoteForm, openedAt: number): Promise<SubmitResult> {
  const clean = normalise(form);
  const elapsedMs = Date.now() - openedAt;
  // Silently accept obvious bots without sending anything
  if (clean.website) return { status: 'spam' };
  const { website, ...fields } = clean;
  return transport.send({ ...fields, hp: website, elapsedMs, page: typeof location === 'undefined' ? '' : location.pathname });
}
