"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ImageIcon, Save } from "lucide-react";
import { toast } from "sonner";

import { useSessionBundle } from "@/components/SessionProvider";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { FormField, Input } from "@/components/ui/Field";
import { authClient } from "@/lib/auth-client";
import { friendlyAuthError } from "@/lib/auth-errors";
import { hasErrors, validateImageUrl, validateName } from "@/lib/validation";
import type { SessionUser } from "@/types";

/**
 * Profile update form.
 *
 * Uses Better Auth's documented client method `authClient.updateUser({ name, image })`,
 * which calls POST /api/auth/update-user and persists the change to the user
 * record in MongoDB. Email is rendered read-only by design — changing it would
 * require Better Auth's email-verification flow, which this assignment excludes.
 */
export function UpdateProfileForm({ user }: { user: SessionUser }) {
  const router = useRouter();
  const { refresh } = useSessionBundle();

  const [values, setValues] = useState({
    name: user.name ?? "",
    image: user.image ?? "",
  });
  const [errors, setErrors] = useState<{ name?: string; image?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDirty =
    values.name.trim() !== (user.name ?? "") || values.image.trim() !== (user.image ?? "");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    // Email is intentionally absent from validation — it cannot be edited here.
    const validationErrors = {
      name: validateName(values.name),
      image: validateImageUrl(values.image),
    };
    setErrors(validationErrors);
    if (hasErrors(validationErrors)) return;

    setIsSubmitting(true);
    try {
      const { error } = await authClient.updateUser({
        name: values.name.trim(),
        image: values.image.trim(),
      });

      if (error) {
        const message = friendlyAuthError(
          error,
          "We could not update your profile. Please try again.",
        );
        setFormError(message);
        toast.error("Profile update failed", { description: message });
        return;
      }

      // Pull the fresh user into the client session so the navbar avatar and
      // the profile card reflect the change immediately.
      await refresh();
      toast.success("Profile updated successfully!", {
        description: "Your new details are live across QurbaniHat.",
      });
      router.push("/my-profile");
      router.refresh();
    } catch (error) {
      const message = friendlyAuthError(
        error,
        "We could not update your profile. Please try again.",
      );
      setFormError(message);
      toast.error("Profile update failed", { description: message });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="surface mx-auto w-full max-w-2xl p-6 sm:p-8">
      <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
        <Avatar
          name={values.name || user.name}
          src={values.image || user.image}
          size={80}
          className="ring-4 ring-white shadow-soft"
        />
        <div>
          <h2 className="text-xl leading-snug text-emerald-deep sm:text-2xl">Update Information</h2>
          <p className="mt-1 text-sm leading-relaxed text-ink-soft">
            Change your display name and profile photo. The preview above updates as you type.
          </p>
        </div>
      </div>

      {formError ? (
        <p
          role="alert"
          className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          {formError}
        </p>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
        <FormField id="update-name" label="Full name" error={errors.name} required>
          <Input
            id="update-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Md. Rahman"
            value={values.name}
            invalid={Boolean(errors.name)}
            disabled={isSubmitting}
            onChange={(event) => {
              setValues((previous) => ({ ...previous, name: event.target.value }));
              setErrors((previous) => ({ ...previous, name: undefined }));
            }}
          />
        </FormField>

        <FormField
          id="update-email"
          label="Email address"
          hint="Your email is linked to your sign-in method and cannot be changed here."
        >
          <Input
            id="update-email"
            name="email"
            type="email"
            value={user.email}
            readOnly
            aria-readonly="true"
            disabled
            className="cursor-not-allowed bg-cream-200/70 text-ink-soft"
          />
        </FormField>

        <FormField
          id="update-image"
          label="Photo URL"
          error={errors.image}
          hint="Paste a direct link to a square image (jpg, png or webp)."
          required
        >
          <div className="relative">
            <ImageIcon
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft"
              aria-hidden="true"
            />
            <Input
              id="update-image"
              name="image"
              type="url"
              inputMode="url"
              autoComplete="photo"
              placeholder="https://example.com/my-photo.jpg"
              value={values.image}
              invalid={Boolean(errors.image)}
              disabled={isSubmitting}
              className="pl-9"
              onChange={(event) => {
                setValues((previous) => ({ ...previous, image: event.target.value }));
                setErrors((previous) => ({ ...previous, image: undefined }));
              }}
            />
          </div>
        </FormField>

        <div className="flex flex-col-reverse gap-3 border-t border-emerald-deep/10 pt-6 sm:flex-row sm:items-center sm:justify-end">
          <Button
            type="button"
            variant="ghost"
            size="lg"
            disabled={isSubmitting}
            onClick={() => router.push("/my-profile")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="lg"
            loading={isSubmitting}
            disabled={!isDirty && !isSubmitting}
            className="sm:min-w-56"
            leftIcon={<Save className="h-4 w-4" aria-hidden="true" />}
          >
            {isSubmitting ? "Updating…" : "Update Information"}
          </Button>
        </div>

        {!isDirty ? (
          <p className="text-center text-xs text-ink-soft sm:text-right">
            Change your name or photo to enable the update button.
          </p>
        ) : null}
      </form>
    </div>
  );
}