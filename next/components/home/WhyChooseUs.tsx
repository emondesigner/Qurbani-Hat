import {
  BadgeCheck,
  Smartphone,
  Sparkles,
  Tags,
  UserCheck,
  Workflow,
  type LucideIcon,
} from "lucide-react";

import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading, SectionShell } from "@/components/ui/SectionHeading";

const REASONS: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: BadgeCheck,
    title: "Verified Livestock Information",
    description:
      "Breed, age, live weight and health notes are recorded and re-checked before a listing goes live.",
  },
  {
    icon: Tags,
    title: "Transparent Pricing",
    description:
      "The price you see is the price you pay. No last-minute adjustments and no hidden middlemen.",
  },
  {
    icon: Workflow,
    title: "Easy Booking",
    description:
      "Send a booking request from any animal page in under a minute — we confirm by phone the same day.",
  },
  {
    icon: Sparkles,
    title: "Trusted Marketplace",
    description:
      "We work only with registered farms that allow unannounced visits and independent inspection.",
  },
  {
    icon: Smartphone,
    title: "Mobile-Friendly Experience",
    description:
      "Compare animals comfortably on a phone at the market, then finish the booking from home.",
  },
  {
    icon: UserCheck,
    title: "Simple Authentication",
    description:
      "Sign in with email or Google in seconds. Your details are securely handled by Better Auth.",
  },
];

/** "Why Choose QurbaniHat?" — six benefits with React Spring reveal animation. */
export function WhyChooseUs() {
  return (
    <SectionShell className="bg-cream">
      <SectionHeading
        eyebrow="Why QurbaniHat"
        title="Why Families Choose QurbaniHat"
        description="We built QurbaniHat to remove the uncertainty of buying livestock — so you can focus on the ibadah, not the haggling."
      />

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {REASONS.map(({ icon: Icon, title, description }, index) => (
          <Reveal key={title} delay={index * 60} className="h-full">
            <article className="surface group relative h-full overflow-hidden p-6">
              <span
                aria-hidden="true"
                className="absolute -top-10 -right-10 h-28 w-28 rounded-full bg-brand/6 transition-transform duration-500 group-hover:scale-125"
              />
              <span className="relative mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-deep to-brand text-cream">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="relative text-lg leading-snug text-emerald-deep">{title}</h3>
              <p className="relative mt-2 text-sm leading-relaxed text-ink-soft">{description}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}