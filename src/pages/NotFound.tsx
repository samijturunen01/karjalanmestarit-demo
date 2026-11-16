import { TLink } from '../components/layout/PageTransition';
import { ArrowRight } from '../components/ui/Icons';

export function NotFound() {
  return (
    <section aria-labelledby="nf-title" className="relative isolate overflow-hidden pt-[calc(var(--header-h)+clamp(3rem,10vw,8rem))] pb-[clamp(5rem,12vw,10rem)]">
      <div aria-hidden="true" className="drafting-grid absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,#000,transparent_90%)]" />
      <svg aria-hidden="true" viewBox="0 0 400 220" className="absolute right-[-6%] bottom-[8%] -z-10 w-[min(70vw,40rem)] text-ink/15">
        <path d="M10 210V100L200 10L390 100V210" fill="none" stroke="currentColor" vectorEffect="non-scaling-stroke" />
        <path d="M150 210V140H250V210" fill="none" stroke="var(--color-signal)" strokeOpacity={0.7} vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="wrap">
        <p className="t-label text-signal-ink">Virhe 404</p>
        <h1 id="nf-title" className="t-display mt-6 max-w-[12ch] text-[clamp(3rem,9vw,8rem)]">
          Tällä katolla ei ole ketään.
        </h1>
        <p className="t-lead mt-8 max-w-[44ch] text-ink-2">Hakemaasi sivua ei löytynyt. Se on voinut siirtyä, tai osoitteessa on kirjoitusvirhe.</p>
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <TLink to="/" className="btn">
            <span className="btn-label">Etusivulle</span>
            <span className="btn-icon">
              <ArrowRight className="size-4" />
            </span>
          </TLink>
          <TLink to="/palvelut" className="link-line font-[620]">
            Palvelut
          </TLink>
          <TLink to="/referenssit" className="link-line font-[620]">
            Referenssit
          </TLink>
        </div>
      </div>
    </section>
  );
}
