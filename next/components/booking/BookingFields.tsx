"use client";

import { Mail, MapPinned, Phone, UserRound } from "lucide-react";

import { FormField, Input, Textarea } from "@/components/ui/Field";
import type { BookingFormData, BookingFormErrors } from "@/types";

/**
 * The four booking inputs (name, email, phone, address) with inline validation
 * messages. Extracted so BookingForm stays focused on submit/loading logic.
 */
export function BookingFields({
  formData,
  errors,
  updateField,
  disabled = false,
}: {
  formData: BookingFormData;
  errors: BookingFormErrors;
  updateField: <K extends keyof BookingFormData>(field: K, value: BookingFormData[K]) => void;
  disabled?: boolean;
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <FormField id="booking-name" label="Full name" required error={errors.name}>
        <div className="relative">
          <UserRound
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft"
            aria-hidden="true"
          />
          <Input
            id="booking-name"
            name="name"
            autoComplete="name"
            value={formData.name}
            disabled={disabled}
            invalid={Boolean(errors.name)}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="Your full name"
            className="pl-9"
            required
          />
        </div>
      </FormField>

      <FormField id="booking-email" label="Email address" required error={errors.email}>
        <div className="relative">
          <Mail
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft"
            aria-hidden="true"
          />
          <Input
            id="booking-email"
            name="email"
            type="email"
            autoComplete="email"
            value={formData.email}
            disabled={disabled}
            invalid={Boolean(errors.email)}
            onChange={(event) => updateField("email", event.target.value)}
            placeholder="you@example.com"
            className="pl-9"
            required
          />
        </div>
      </FormField>

      <FormField
        id="booking-phone"
        label="Phone number"
        required
        error={errors.phone}
        hint="Bangladeshi mobile, e.g. 01712345678"
      >
        <div className="relative">
          <Phone
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft"
            aria-hidden="true"
          />
          <Input
            id="booking-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={formData.phone}
            disabled={disabled}
            invalid={Boolean(errors.phone)}
            onChange={(event) => updateField("phone", event.target.value)}
            placeholder="01712345678"
            className="pl-9"
            required
          />
        </div>
      </FormField>

      <FormField
        id="booking-address"
        label="Delivery / farm pickup address"
        required
        error={errors.address}
        className="sm:col-span-2"
      >
        <div className="relative">
          <MapPinned
            className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-ink-soft"
            aria-hidden="true"
          />
          <Textarea
            id="booking-address"
            name="address"
            autoComplete="street-address"
            value={formData.address}
            disabled={disabled}
            invalid={Boolean(errors.address)}
            onChange={(event) => updateField("address", event.target.value)}
            placeholder="House, road, area, district — where should we deliver or meet you?"
            className="pl-9"
            required
          />
        </div>
      </FormField>
    </div>
  );
}