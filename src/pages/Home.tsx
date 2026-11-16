import { Backing } from '../components/home/Backing';
import { ClosingCta } from '../components/home/ClosingCta';
import { FeaturedReferences } from '../components/home/FeaturedReferences';
import { Hero } from '../components/home/Hero';
import { Intro } from '../components/home/Intro';
import { Process } from '../components/home/Process';
import { ServicesIndex } from '../components/home/ServicesIndex';

export function Home() {
  return (
    <>
      <Hero />
      <Intro />
      <ServicesIndex />
      <FeaturedReferences />
      <Backing />
      <Process />
      <ClosingCta />
    </>
  );
}
