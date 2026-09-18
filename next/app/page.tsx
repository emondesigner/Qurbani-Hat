import type { Metadata } from "next";

import { FeaturedAnimals } from "@/components/home/FeaturedAnimals";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { QurbaniTips } from "@/components/home/QurbaniTips";
import { TopBreeds } from "@/components/home/TopBreeds";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";

export const metadata: Metadata = {
  title: "QurbaniHat — Trusted Livestock Marketplace",
  description:
    "Find healthy cows and goats for Qurbani from a modern and trusted livestock marketplace.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedAnimals />
      <QurbaniTips />
      <TopBreeds />
      <WhyChooseUs />
      <HowItWorks />
    </>
  );
}