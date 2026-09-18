import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";
import { OAuthErrorNotice } from "@/components/auth/OAuthErrorNotice";
import { isGoogleProviderConfigured } from "@/lib/auth-flags";
import { getServerSession } from "@/lib/session";
import { safeRedirectPath } from "@/lib/utils";
import type { SessionBundle } from "@/types";

export const metadata: Metadata = {
  title: "Login",
  description:
    "Sign in to QurbaniHat with your email and password or continue with Google to book livestock for Qurbani.",
  alternates: { canonical: "/login" },
  robots: { index: false, follow: true },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  // Requirement: authenticated users never see /login — they are sent home.
  // Checked with the authoritative server session, not just the cookie.
  const session = (await getServerSession()) as SessionBundle | null;
  if (session?.user) {
    redirect("/");
  }

  const params = await searchParams;
  const redirectTo = safeRedirectPath(params?.redirect, "/");

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Login to QurbaniHat"
      subtitle="Sign in to book verified livestock, manage your profile and keep your Qurbani plans in one place."
      footer={
        <p>
          Don&apos;t have an account?{" "}
          <Link href="/register" className="link">
            Register
          </Link>
        </p>
      }
    >
      {/* The Google flag is resolved on the server (GOOGLE_CLIENT_ID is not a
          NEXT_PUBLIC_ variable) and passed down as a prop. */}
      <Suspense fallback={null}>
        <OAuthErrorNotice />
      </Suspense>
      <LoginForm redirectTo={redirectTo} googleEnabled={isGoogleProviderConfigured} />
    </AuthShell>
  );
}