"use client";

import { useState } from "react";
import { CheckCircle2, Info } from "lucide-react";
import { toast } from "sonner";

import { BookingFields } from "@/components/booking/BookingFields";
import { Button } from "@/components/ui/Button";
import { validateBookingForm } from "@/lib/validation";
import { formatBDT } from "@/lib/utils";
import type { Animal, BookingFormData, BookingFormErrors } from "@/types";

const EMPTY_FORM: BookingFormData = { name: "", email: "", phone: "", address: "" };

/**
 * Booking request form.
 *
 * Assignment rules honoured here:
 *  - available only to authenticated users (gated by proxy.ts and re-verified
 *    server side before this component receives any session data)
 *  - Name + Email are pre-filled from the session but remain editable
 *  - validate -> loading state -> success toast -> reset
 *  - the submission is deliberately NOT persisted: no MongoDB write, no
 *    localStorage write. Nothing about the booking leaves this component.
 */
export function BookingForm({
  animal,
  defaultName,
  defaultEmail,
}: {
  animal: Animal;
  defaultName: string;
  defaultEmail: string;
}) {
  const [formData, setFormData] = useState<BookingFormData>({
    ...EMPTY_FORM,
    name: defaultName,
    email: defaultEmail,
  });
  const [errors, setErrors] = useState<BookingFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Keep the pre-filled identity in sync when the session resolves or updates.
  // State is adjusted during render (the React-recommended pattern) rather than
  // in an effect, so there is no cascading render.
  const [syncedIdentity, setSyncedIdentity] = useState({
    name: defaultName,
    email: defaultEmail,
  });

  if (syncedIdentity.name !== defaultName || syncedIdentity.email !== defaultEmail) {
    setSyncedIdentity({ name: defaultName, email: defaultEmail });
    setFormData((current) => ({
      ...current,
      name: current.name || defaultName,
      email: current.email || defaultEmail,
    }));
  }

  function updateField<K extends keyof BookingFormData>(field: K, value: BookingFormData[K]) {
    setFormData((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateBookingForm(formData);
    if (Object.values(validationErrors).some(Boolean)) {
      setErrors(validationErrors);
      toast.error("Please fix the highlighted fields before submitting.");
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      // Front-end only submission: simulate the request lifecycle so the
      // loading state is real, then resolve. No data is stored anywhere.
      await new Promise((resolve) => setTimeout(resolve, 1200));

      toast.success("Booking request submitted successfully!", {
        description: `${animal.name} — we will call you on ${formData.phone} to confirm the details.`,
      });
      setIsSubmitted(true);
      setFormData({ ...EMPTY_FORM, name: defaultName, email: defaultEmail });
    } catch (error) {
      console.error("[QurbaniHat] Booking submission failed", error);
      toast.error("We could not submit your booking request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="booking-form" className="scroll-mt-24">
      <div className="surface overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-emerald-deep/10 bg-cream-200/60 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="eyebrow">Booking Request</p>
            <h2 className="mt-2 text-2xl leading-snug sm:text-3xl">Reserve This Animal</h2>
            <p className="mt-1 text-sm text-ink-soft">
              Submitting a request for <strong className="text-emerald-deep">{animal.name}</strong>{" "}
              at <strong className="text-emerald-deep">{formatBDT(animal.price)}</strong>.
            </p>
          </div>
          <p className="flex items-start gap-2 rounded-2xl bg-white p-3 text-xs leading-relaxed text-ink-soft sm:max-w-xs">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
            This is a booking request, not a payment. Our team confirms availability by phone before
            Eid.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8" noValidate>
          <BookingFields
            formData={formData}
            errors={errors}
            updateField={updateField}
            disabled={isSubmitting}
          />

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-relaxed text-ink-soft sm:max-w-md">
              Name and email came from your QurbaniHat account and stay editable. Nothing is saved
              to a database or to localStorage — this form only simulates the submission flow.
            </p>
            <Button
              type="submit"
              size="lg"
              loading={isSubmitting}
              className="shrink-0 sm:min-w-52"
              leftIcon={<CheckCircle2 className="h-4 w-4" aria-hidden="true" />}
            >
              {isSubmitting ? "Submitting…" : "Confirm Booking"}
            </Button>
          </div>

          {isSubmitted ? (
            <p
              role="status"
              className="mt-6 flex items-start gap-2 rounded-2xl border border-brand/25 bg-brand/8 p-4 text-sm font-semibold text-emerald-deep"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
              Booking request submitted successfully! Our team will contact you shortly to confirm.
            </p>
          ) : null}
        </form>
      </div>
    </section>
  );
}

