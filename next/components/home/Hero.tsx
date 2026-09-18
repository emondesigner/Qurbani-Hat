"use client";

import { animated, useSpring } from "@react-spring/web";
import { BadgeCheck, HeartHandshake, ShieldCheck, Truck } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { AnimalImage } from "@/components/ui/AnimalImage";
import { FloatBadge, Stat } from "@/components/home/HeroDecor";
import { usePrefersReducedMotion } from "@/lib/hooks";

const TRUST_INDICATORS = [
  { icon: BadgeCheck, label: "Vet verified listings" },
  { icon: ShieldCheck, label: "Transparent pricing" },
  { icon: Truck, label: "Transport support" },
  { icon: HeartHandshake, label: "Trusted by 2,400+ families" },
] as const;

/**
 * Hero section with a React Spring entrance animation: the copy rises in and the
 * hero photo eases forward on mount. Falls back to a static layout for visitors
 * who prefer reduced motion.
 */
export function Hero() {
  const prefersReducedMotion = usePrefersReducedMotion();

  const copySpring = useSpring({
    from: { opacity: 0, transform: "translate3d(0, 26px, 0)" },
    to: { opacity: 1, transform: "translate3d(0, 0, 0)" },
    immediate: prefersReducedMotion,
    delay: prefersReducedMotion ? 0 : 80,
    config: { tension: 190, friction: 26 },
  });

  const mediaSpring = useSpring({
    from: { opacity: 0, transform: "translate3d(0, 34px, 0) scale(0.97)" },
    to: { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)" },
    immediate: prefersReducedMotion,
    delay: prefersReducedMotion ? 0 : 220,
    config: { tension: 170, friction: 28 },
  });

  return (
    <section className="relative overflow-hidden bg-cream">
      {/* Decorative background: soft emerald glow + subtle Islamic pattern. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-brand/12 blur-3xl" />
        <div className="absolute top-1/3 -right-20 h-80 w-80 rounded-full bg-gold/12 blur-3xl" />
        <div className="pattern-islamic absolute inset-0 opacity-[0.35]" />
      </div>

      <div className="container-page relative grid items-center gap-12 py-14 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:py-20">
        <animated.div style={copySpring} className="flex flex-col items-start gap-6">
          <span className="eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />
            Eid-ul-Adha 2026 Bookings Open
          </span>

          <h1 className="text-4xl leading-[1.08] sm:text-5xl lg:text-[3.4rem]">
            Find Healthy &amp; Trusted Livestock for Your{" "}
            <span className="relative inline-block text-brand">
              Qurbani
              <span
                aria-hidden="true"
                className="absolute inset-x-0 -bottom-1 h-1.5 rounded-full bg-gold/60"
              />
            </span>
          </h1>

          <p className="max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
            Browse vet-checked cows and goats from trusted farms across Bangladesh. Compare breeds,
            live weight and fair prices — then confirm your booking request in minutes.
          </p>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button href="/animals" size="lg" rightIcon={<span aria-hidden="true">→</span>}>
              Browse Animals
            </Button>
            <Button href="/#qurbani-guide" variant="outline" size="lg">
              Explore Qurbani Guide
            </Button>
          </div>

          <dl className="grid w-full grid-cols-2 gap-x-6 gap-y-3 pt-2 sm:grid-cols-4">
            {TRUST_INDICATORS.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon className="h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
                <dt className="sr-only">{label}</dt>
                <dd className="text-xs font-semibold leading-snug text-ink-soft">{label}</dd>
              </div>
            ))}
          </dl>
        </animated.div>

        <animated.div style={mediaSpring} className="relative">
          <div className="surface overflow-hidden p-2 shadow-lift">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.15rem]">
              <AnimalImage
                priority
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Eid_al-Adha_cattle_market_in_Bangladesh_109.jpg/1280px-Eid_al-Adha_cattle_market_in_Bangladesh_109.jpg"
                alt="Cattle lined up at a Qurbani livestock market in Bangladesh"
              />
            </div>
          </div>

          <FloatBadge className="-left-3 top-8 sm:-left-6" icon={<ShieldCheck className="h-4 w-4" />}>
            Verified farms
          </FloatBadge>
          <FloatBadge
            className="-right-2 bottom-10 sm:-right-6"
            icon={<BadgeCheck className="h-4 w-4" />}
            tone="gold"
          >
            Prices in BDT
          </FloatBadge>

          <div className="surface absolute -bottom-5 left-1/2 hidden -translate-x-1/2 items-center gap-4 px-5 py-3 sm:flex">
            <Stat value="8+" label="Premium breeds" />
            <span className="h-8 w-px bg-emerald-deep/12" aria-hidden="true" />
            <Stat value="100%" label="Health documented" />
            <span className="h-8 w-px bg-emerald-deep/12" aria-hidden="true" />
            <Stat value="24/7" label="Booking support" />
          </div>
        </animated.div>
      </div>
    </section>
  );
}