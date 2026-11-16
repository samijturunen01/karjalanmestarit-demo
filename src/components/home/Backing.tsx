import { copy } from '../../content/company';
import { SectionHead } from '../ui/Section';

/** "Valtakunnallista taustatukea" – verified differentiators from the company's own site. */
export function Backing() {
  const plates = [
    { k: 'Omistaja ja tavarantoimittaja', v: 'Katepal Oy', note: 'Suomen johtava bitumisten kateaineiden valmistaja' },
    { k: 'Kotimaisuus', v: 'Avainlippu', note: 'Katepalin tuotteet ovat Avainlippu-tuotteita' },
    { k: 'Harmaata taloutta vastaan', v: 'Tilaajavastuu', note: 'Mukana Tilaajavastuu-palvelussa' },
  ];
  return (
    <section aria-labelledby="backing-title" className="relative py-[clamp(5rem,12vw,10rem)]">
      <div className="wrap">
        <SectionHead
          index="04"
          label="Taustatuki"
          id="backing-title"
          title={
            <>
              Valtakunnallista taustatukea, <span className="text-ink-3">paikallista tekemistä.</span>
            </>
          }
        />

        <div className="mt-[clamp(3rem,7vw,6rem)] grid gap-12 lg:grid-cols-12 lg:gap-x-10">
          <div className="lg:col-span-6 lg:col-start-4">
            <p data-reveal className="t-lead">
              {copy.katepal}
            </p>
            <p data-reveal className="mt-6 text-ink-2">
              {copy.katepalFinnish}
            </p>
          </div>
        </div>

        <ul className="mt-[clamp(3rem,6vw,5rem)] grid gap-px border border-ink/80 bg-ink/80 md:grid-cols-3">
          {plates.map((p, i) => (
            <li key={p.k} data-reveal className="flex flex-col bg-paper p-6 lg:p-8">
              <span className="t-label flex justify-between text-ink-3">
                <span>{p.k}</span>
                <span className="tabular">0{i + 1}</span>
              </span>
              <span className="t-display mt-10 text-[clamp(2.2rem,4vw,3.4rem)]">{p.v}</span>
              <span className="mt-3 text-[0.95rem] text-ink-2">{p.note}</span>
            </li>
          ))}
        </ul>

        <div className="mt-[clamp(4rem,8vw,7rem)] grid gap-10 lg:grid-cols-12 lg:gap-x-10">
          <h3 data-reveal className="t-h3 text-[clamp(1.8rem,3.2vw,2.75rem)] lg:col-span-5">
            Ammattitaitoinen henkilökunta
          </h3>
          <div className="lg:col-span-6 lg:col-start-7">
            <p data-reveal className="text-[1.08rem] text-ink-2">
              {copy.staff}
            </p>
            <p data-reveal className="mt-5 text-[1.08rem] text-ink-2">
              {copy.greyEconomy}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
