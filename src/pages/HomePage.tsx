import React from 'react';
import { Hero } from '../components/Hero';
import { FeaturedAnimals } from '../components/FeaturedAnimals';
import { QurbaniTips } from '../components/QurbaniTips';
import { TopBreeds } from '../components/TopBreeds';
import { WhyChooseUs } from '../components/WhyChooseUs';
import { CtaSection } from '../components/CtaSection';

export function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Section 1: Hero Banner */}
      <Hero />

      {/* Section 2: Featured Animals (Exactly 4 items) */}
      <FeaturedAnimals />

      {/* Section 3: Qurbani Tips */}
      <QurbaniTips />

      {/* Section 4: Top Breeds */}
      <TopBreeds />

      {/* Section 5: Why Choose QurbaniHat? (Extra Section) */}
      <WhyChooseUs />

      {/* Section 6: Final Call to Action */}
      <CtaSection />
    </div>
  );
}
