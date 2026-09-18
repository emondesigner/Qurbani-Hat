"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, LogIn } from "lucide-react";
import { toast } from "sonner";

import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import { Button } from "@/components/ui/Button";
import { FormField, Input } from "@/components/ui/Field";
import { authClient } from "@/lib/auth-client";
import { friendlyAuthError } from "@/lib/auth-errors";
import { cn, safeRedirectPath } from "@/lib/utils";
import { hasErrors, validateLoginForm, type AuthFormErrors } from "@/lib/validation";

/**
 * Email + password login form (Better Auth `signIn.email`).
 * Sessions are created server-side and stored in an httpOnly cookie — no token
 * is ever written to localStorage.
 */
export function LoginForm({
  redirectTo,
  googleEnabled = true,
}: {
  redirectTo?: string;
  googleEnabled?: boolean;
}) {
  const router = useRouter();

  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<AuthFormErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const target = safeRedirectPath(redirectTo, "/");

  function update<K extends keyof typeof values>(key: K, value: string) {
    setValues((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => ({ ...previous, [key]: undefined }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const validationErrors = validateLoginForm(values);
    setErrors(validationErrors);
    if (hasErrors(validationErrors)) return;

    setIsSubmitting(true);
    try {
      const { error } = await authClient.signIn.email({
        email: values.email.trim(),
        password: values.password,
        rememberMe: true,
      });

      if (error) {
        const message = friendlyAuthError(error, "We could not sign you in. Please try again.");
        setFormError(message);
        toast.error("Login failed", { description: message });
        return;
      }

      toast.success("Logged in successfully!", { description: "Welcome back to QurbaniHat." });
      router.push(target);
      router.refresh();
    } catch (error) {
      const message = friendlyAuthError(error, "We could not sign you in. Please try again.");
      setFormError(message);
      toast.error("Login failed", { description: message });
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
        <FormField id="login-email" label="Email" error={errors.email} required>
          <Input
            id="login-email"
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

        <FormField id="login-password" label="Password" error={errors.password} required>
          <div className="relative">
            <Input
              id="login-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={values.password}
              invalid={Boolean(errors.password)}
              disabled={isSubmitting}
              onChange={(event) => update("password", event.target.value)}
              className={cn("pr-11")}
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

        <Button
          type="submit"
          fullWidth
          size="lg"
          loading={isSubmitting}
          leftIcon={<LogIn className="h-4 w-4" aria-hidden="true" />}
        >
          {isSubmitting ? "Signing you in…" : "Login"}
        </Button>
      </form>

      <div className="flex items-center gap-3" aria-hidden="true">
        <span className="h-px flex-1 bg-emerald-deep/12" />
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft">or</span>
        <span className="h-px flex-1 bg-emerald-deep/12" />
      </div>

      <GoogleAuthButton
        callbackPath={target}
        errorCallbackPath="/login"
        googleEnabled={googleEnabled}
      />

      <p className="flex items-center gap-2 text-xs text-ink-soft">
        <Lock className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
        Your session is secured by Better Auth with an httpOnly cookie.
      </p>
    </div>
  );
}