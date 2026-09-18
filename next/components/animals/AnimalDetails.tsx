import Link from "next/link";
import {
  ArrowLeft,
  Award,
  CalendarDays,
  MapPin,
  Scale,
  ShieldCheck,
  Stethoscope,
  Weight,
} from "lucide-react";

import { AnimalImage } from "@/components/ui/AnimalImage";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { HEALTH_INDICATORS, QURBANI_SUITABILITY } from "@/lib/animals";
import { formatBDT } from "@/lib/utils";
import type { Animal } from "@/types";

const TRUST_POINTS = [
  "Farm-verified listing with owner contact confirmation",
  "Live weight re-checked on the day of handover",
  "Transparent price — no hidden commission at delivery",
];

function FactTile({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Weight;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-emerald-deep/10 bg-white p-4">
      <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-ink-soft">
        <Icon className="h-4 w-4 text-brand" aria-hidden="true" />
        {label}
      </dt>
      <dd className="mt-1.5 font-display text-xl text-emerald-deep">{value}</dd>
    </div>
  );
}

/** Full livestock profile: photo, spec grid, health + Qurbani suitability. */
export function AnimalDetails({ animal }: { animal: Animal }) {
  return (
    <div className="space-y-10">
      <Link
        href="/animals"
        className="inline-flex items-center gap-2 text-sm font-semibold text-brand transition hover:text-emerald-deep"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to all animals
      </Link>

      <div className="grid gap-10 lg:grid-cols-2">
        <Reveal>
          <div className="relative overflow-hidden rounded-card border border-emerald-deep/10 bg-white shadow-lift">
            <div className="h-72 sm:h-[26rem] lg:h-[30rem]">
              <AnimalImage
                src={animal.image}
                alt={`${animal.name} — ${animal.breed} ${animal.type.toLowerCase()} available in ${animal.location}`}
                priority
              />
            </div>
            <div className="absolute left-4 top-4 flex flex-wrap gap-2">
              <Badge tone="emerald">{animal.type}</Badge>
              <Badge tone="cream">{animal.category}</Badge>
            </div>
            <p className="absolute bottom-4 right-4 rounded-full bg-emerald-deep/90 px-4 py-2 font-display text-lg text-cream">
              {formatBDT(animal.price)}
            </p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="space-y-5">
            <div>
              <p className="eyebrow">{animal.breed}</p>
              <h1 className="mt-3 text-3xl leading-tight sm:text-4xl">{animal.name}</h1>
              <p className="mt-2 flex items-center gap-2 text-sm text-ink-soft">
                <MapPin className="h-4 w-4 text-gold" aria-hidden="true" />
                {animal.location}, Bangladesh
              </p>
            </div>

            <p className="text-sm leading-relaxed text-ink-soft sm:text-base">
              {animal.description}
            </p>

            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <FactTile icon={Weight} label="Weight" value={`${animal.weight} kg`} />
              <FactTile icon={CalendarDays} label="Age" value={`${animal.age} yrs`} />
              <FactTile icon={Scale} label="Price" value={formatBDT(animal.price)} />
            </dl>

            <div className="rounded-2xl border border-gold/30 bg-gold-soft/25 p-5">
              <h2 className="flex items-center gap-2 text-lg leading-snug text-emerald-deep">
                <ShieldCheck className="h-5 w-5 text-gold" aria-hidden="true" />
                Verification &amp; Trust
              </h2>
              <ul className="mt-3 space-y-2 text-sm text-ink">
                {TRUST_POINTS.map((point) => (
                  <li key={point} className="flex items-start gap-2">
                    <Award className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button href="#booking-form" size="lg" fullWidth>
                Book This Animal
              </Button>
              <Button href="/animals" variant="outline" size="lg" fullWidth>
                Compare More Animals
              </Button>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Reveal>
          <section className="surface h-full p-6">
            <h2 className="flex items-center gap-2 text-xl leading-snug text-emerald-deep">
              <Stethoscope className="h-5 w-5 text-brand" aria-hidden="true" />
              Health Information
            </h2>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink-soft">
              {HEALTH_INDICATORS.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </Reveal>

        <Reveal delay={80}>
          <section className="surface h-full p-6">
            <h2 className="flex items-center gap-2 text-xl leading-snug text-emerald-deep">
              <Award className="h-5 w-5 text-gold" aria-hidden="true" />
              Qurbani Suitability
            </h2>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink-soft">
              {QURBANI_SUITABILITY.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </Reveal>
      </div>
    </div>
  );
}
