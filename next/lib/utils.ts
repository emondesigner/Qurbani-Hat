import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Tailwind-aware className merge helper used by every UI component. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formats a price in Bangladeshi Taka, e.g. 120000 -> "৳1,20,000". */
export function formatBDT(amount: number): string {
  return `৳${new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(amount)}`;
}

/** Safe-ish redirect target: only same-origin paths are ever honoured. */
export function safeRedirectPath(value: string | null | undefined, fallback = "/"): string {
  if (!value) return fallback;
  const trimmed = value.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) return fallback;
  return trimmed;
}

/** Turns a price into a human readable range bucket used by the filters. */
export function priceRangeLabel(amount: number): string {
  if (amount < 50000) return "Under ৳50,000";
  if (amount < 150000) return "৳50,000 – ৳1,50,000";
  return "Above ৳1,50,000";
}

export function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part.charAt(0).toUpperCase()).join("") || "Q";
}
