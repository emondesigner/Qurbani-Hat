import { MapPin, Scale } from "lucide-react";

import { AnimalImage } from "@/components/ui/AnimalImage";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading, SectionShell } from "@/components/ui/SectionHeading";
import { topBreeds } from "@/lib/animals";
import { cn } from "@/lib/utils";

/** Popular livestock breeds with a short buyer's description. */
export function TopBreeds() {
  return (
    <SectionShell className="bg-white">
      <SectionHeading
        eyebrow="Popular breeds"
        title="Top Livestock Breeds Trusted for Qurbani"
        description="Bangladesh is home to remarkable indigenous breeds. Here are the six most requested by our customers this season."
      />

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {topBreeds.map((breed, index) => (
          <Reveal key={breed.name} delay={index * 55} className="h-full">
            <article className="surface group relative h-full overflow-hidden">
              <div className="relative aspect-[16/10] overflow-hidden">
                <AnimalImage
                  src={breed.image}
                  alt={`${breed.name} breed`}
                  className="transition-transform duration-500 group-hover:scale-[1.07]"
                />
                <span className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-emerald-deep/75 to-transparent" />
                <span className="absolute bottom-3 left-4 font-display text-xl text-cream">
                  {breed.name}
                </span>
              </div>

              <div className="space-y-3 p-5">
                <div className="flex flex-wrap gap-2">
                  <span
                    className={cn(
                      "chip",
                      breed.type === "Cow"
                        ? "bg-emerald-deep/10 text-emerald-deep"
                        : "bg-gold/12 text-gold",
                    )}
                  >
                    {breed.type}
                  </span>
                  <span className="chip bg-brand/10 text-brand">{breed.category}</span>
                </div>

                <p className="text-sm leading-relaxed text-ink-soft">{breed.highlights}</p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-emerald-deep/10 pt-3 text-xs font-semibold text-ink-soft">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
                    {breed.origin}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Scale className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
                    Qurbani ready
                  </span>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}