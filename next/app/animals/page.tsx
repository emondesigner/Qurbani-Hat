import type { Metadata } from "next";

import { AnimalsExplorer } from "@/components/animals/AnimalsExplorer";
import { GoldDivider } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "All Animals",
  description:
    "Browse every cow and goat available on QurbaniHat. Filter by type, category, location and price, and sort by price to find the right animal for your Qurbani.",
  alternates: { canonical: "/animals" },
};

export default function AnimalsPage() {
  return (
    <section className="section">
      <div className="container-page">
        <header className="mb-8 flex flex-col items-center gap-4 text-center">
          <span className="eyebrow">All Animals</span>
          <h1 className="text-3xl leading-tight sm:text-4xl lg:text-[2.75rem]">
            Explore Our Full Livestock Catalogue
          </h1>
          <GoldDivider />
          <p className="max-w-2xl text-sm leading-relaxed text-ink-soft sm:text-base">
            Verified cows and goats from trusted farms across Bangladesh. Filter by type, category,
            location and budget, then sort by price to compare options quickly.
          </p>
        </header>

        <AnimalsExplorer />
      </div>
    </section>
  );
}