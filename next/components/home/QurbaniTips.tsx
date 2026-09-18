import {
  CalendarCheck,
  ClipboardList,
  Eye,
  HeartPulse,
  Truck,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading, SectionShell } from "@/components/ui/SectionHeading";
import { qurbaniTips } from "@/lib/animals";
import type { QurbaniTip } from "@/types";

const ICONS: Record<QurbaniTip["icon"], LucideIcon> = {
  heart: HeartPulse,
  calendar: CalendarCheck,
  eye: Eye,
  wallet: Wallet,
  clipboard: ClipboardList,
  truck: Truck,
};

/** Qurbani preparation guide — six concise, practical tips. */
export function QurbaniTips() {
  return (
    <SectionShell id="qurbani-guide" className="bg-cream">
      <SectionHeading
        eyebrow="Qurbani guide"
        title="Prepare for a Meaningful Qurbani"
        description="A short checklist from our livestock specialists so that your sacrifice is healthy, valid and stress free for the whole family."
      />

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {qurbaniTips.map((tip, index) => {
          const Icon = ICONS[tip.icon];
          return (
            <Reveal key={tip.title} delay={index * 60} className="h-full">
              <article className="surface group h-full p-6 transition-transform duration-300 hover:-translate-y-1">
                <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand transition-colors duration-300 group-hover:bg-brand group-hover:text-white">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="text-lg leading-snug text-emerald-deep">{tip.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{tip.description}</p>
              </article>
            </Reveal>
          );
        })}
      </div>
    </SectionShell>
  );
}