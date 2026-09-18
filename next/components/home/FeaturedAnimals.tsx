import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { AnimalGrid } from "@/components/animals/AnimalGrid";
import { SectionHeading, SectionShell } from "@/components/ui/SectionHeading";
import { getFeaturedAnimals } from "@/lib/animals";

/** Exactly four hand-picked featured animals, pulled from data/animals.json. */
export function FeaturedAnimals() {
  const featured = getFeaturedAnimals(4);

  return (
    <SectionShell className="bg-white">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            align="left"
            eyebrow="Featured this week"
            title="Handpicked Livestock for a Peaceful Qurbani"
            description="Every animal below is vet checked, weighed on site and priced transparently — no hidden commissions, no haggling."
          />
          <Link href="/animals" className="btn btn-md btn-outline shrink-0">
            View all animals
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <AnimalGrid animals={featured} />
      </div>
    </SectionShell>
  );
}