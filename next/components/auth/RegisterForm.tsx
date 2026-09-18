"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Eye, EyeOff, ShieldCheck, UserPlus, X } from "lucide-react";
import { toast } from "sonner";

import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import { Button } from "@/components/ui/Button";
import { FormField, Input } from "@/components/ui/Field";
import { authClient } from "@/lib/auth-client";
import { friendlyAuthError } from "@/lib/auth-errors";
import {
  hasErrors,
  MIN_PASSWORD_LENGTH,
  validateRegisterForm,
  type AuthFormErrors,
} from "@/lib/validation";

/**
 * Registration form (Better Auth `signUp.email`).
 * Email verification and forgot-password are intentionally NOT implemented for
 * this assignment, so a successful sign-up redirects straight to /login.
 */
export function RegisterForm({ googleEnabled = true }: { googleEnabled?: boolean }) {
  const router = useRouter();

  const [values, setValues] = useState({ name: "", email: "", image: "", password: "" });
  const [errors, setErrors] = useState<AuthFormErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function update<K extends keyof typeof values>(key: K, value: string) {
    setValues((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => ({ ...previous, [key]: undefined }));
  }

  const passwordChecks = [
    {
      label: `At least ${MIN_PASSWORD_LENGTH} characters`,
      met: values.password.length >= MIN_PASSWORD_LENGTH,
    },
    { label: "Includes a letter", met: /[a-zA-Z]/.test(values.password) },
    { label: "Includes a number", met: /\d/.test(values.password) },
  ];

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const validationErrors = validateRegisterForm(values);
    setErrors(validationErrors);
    if (hasErrors(validationErrors)) return;

    setIsSubmitting(true);
    try {
      const { error } = await authClient.signUp.email({
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
        ...(values.image.trim() ? { image: values.image.trim() } : {}),
      });

      if (error) {
        const message = friendlyAuthError(
          error,
          "We could not create your account. Please try again.",
        );
        setFormError(message);
        toast.error("Registration failed", { description: message });
        return;
      }

      toast.success("Account created successfully!", {
        description: "Please log in with your new credentials.",
      });
      router.push("/login");
    } catch (error) {
      const message = friendlyAuthError(
        error,
        "We could not create your account. Please try again.",
      );
      setFormError(message);
      toast.error("Registration failed", { description: message });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-5">
      {formError ? (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          {formError}
        </p>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <FormField id="register-name" label="Full name" error={errors.name} required>
          <Input
            id="register-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Md. Rahman"
            value={values.name}
            invalid={Boolean(errors.name)}
            disabled={isSubmitting}
            onChange={(event) => update("name", event.target.value)}
          />
        </FormField>

        <FormField id="register-email" label="Email" error={errors.email} required>
          <Input
            id="register-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={values.email}
            invalid={Boolean(errors.email)}
            disabled={isSubmitting}
            onChange={(event) => update("email", event.target.value)}
          />
        </FormField>

        <FormField
          id="register-image"
          label="Photo URL"
          error={errors.image}
          hint="Optional. Paste a link to your profile picture (https://…)."
        >
          <Input
            id="register-image"
            name="image"
            type="url"
            inputMode="url"
            autoComplete="photo"
            placeholder="https://example.com/my-photo.jpg"
            value={values.image}
            invalid={Boolean(errors.image)}
            disabled={isSubmitting}
            onChange={(event) => update("image", event.target.value)}
          />
        </FormField>

        <FormField id="register-password" label="Password" error={errors.password} required>
          <div className="relative">
            <Input
              id="register-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Create a password"
              value={values.password}
              invalid={Boolean(errors.password)}
              disabled={isSubmitting}
              onChange={(event) => update("password", event.target.value)}
              className="pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-ink-soft transition hover:bg-brand/10 hover:text-brand"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Eye className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </FormField>

        <ul className="grid gap-1.5 sm:grid-cols-3" aria-label="Password requirements">
          {passwordChecks.map((check) => (
            <li
              key={check.label}
              className={check.met ? "text-xs font-semibold text-brand" : "text-xs text-ink-soft"}
            >
              <span className="flex items-center gap-1.5">
                {check.met ? (
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                {check.label}
              </span>
            </li>
          ))}
        </ul>

        <Button
          type="submit"
          fullWidth
          size="lg"
          loading={isSubmitting}
          leftIcon={<UserPlus className="h-4 w-4" aria-hidden="true" />}
        >
          {isSubmitting ? "Creating your account…" : "Create Account"}
        </Button>
      </form>

      <div className="flex items-center gap-3" aria-hidden="true">
        <span className="h-px flex-1 bg-emerald-deep/12" />
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft">or</span>
        <span className="h-px flex-1 bg-emerald-deep/12" />
      </div>

      <GoogleAuthButton googleEnabled={googleEnabled} />

      <p className="flex items-center gap-2 text-xs text-ink-soft">
        <ShieldCheck className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
        Passwords are hashed and stored securely by Better Auth in MongoDB.
      </p>
    </div>
  );
}