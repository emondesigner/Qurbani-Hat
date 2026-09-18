import { CalendarCheck, MousePointerClick, UserRoundCheck } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading, SectionShell } from "@/components/ui/SectionHeading";

const STEPS = [
  {
    icon: MousePointerClick,
    title: "Browse & Compare",
    description:
      "Filter by cow or goat, sort by price and open any listing to review weight, age, health and location.",
  },
  {
    icon: UserRoundCheck,
    title: "Sign In Securely",
    description:
      "Create an account with email or continue with Google. Booking requests are only available to signed-in buyers.",
  },
  {
    icon: CalendarCheck,
    title: "Confirm Your Booking",
    description:
      "Send your booking request with your phone and delivery address. Our team confirms availability within hours.",
  },
] as const;

/** Extra "how it works" section plus the closing call to action. */
export function HowItWorks() {
  return (
    <SectionShell className="bg-white">
      <SectionHeading
        eyebrow="How it works"
        title="From Browsing to Booking in Three Steps"
        description="A simple, transparent flow designed for busy families preparing for Eid-ul-Adha."
      />

      <ol className="mt-12 grid gap-6 md:grid-cols-3">
        {STEPS.map(({ icon: Icon, title, description }, index) => (
          <Reveal key={title} delay={index * 80} className="h-full">
            <li className="surface-muted relative h-full p-6">
              <span
                className="absolute right-5 top-4 font-display text-4xl text-emerald-deep/12"
                aria-hidden="true"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-brand shadow-soft">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="text-lg leading-snug text-emerald-deep">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{description}</p>
            </li>
          </Reveal>
        ))}
      </ol>

      <Reveal delay={120}>
        <div className="pattern-emerald relative mt-14 overflow-hidden rounded-card px-6 py-12 text-center shadow-lift sm:px-12">
          <span aria-hidden="true" className="absolute inset-0 bg-emerald-deep/55" />
          <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-5">
            <span className="eyebrow border-cream/25 bg-cream/15 text-cream">
              Booking open for Eid-ul-Adha
            </span>
            <h2 className="text-3xl leading-tight text-cream sm:text-4xl">
              Reserve Your Animal Before the Market Rush
            </h2>
            <p className="text-sm leading-relaxed text-cream/85 sm:text-base">
              Popular breeds sell out early. Create your free account, open any listing and send a
              booking request — it takes less than a minute.
            </p>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Button href="/animals" variant="gold" size="lg">
                Browse Animals
              </Button>
              <Button href="/register" variant="outline" size="lg">
                Create Free Account
              </Button>
            </div>
          </div>
        </div>
      </Reveal>
    </SectionShell>
  );
}