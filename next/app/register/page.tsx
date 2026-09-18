import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { AuthShell } from "@/components/auth/AuthShell";
import { OAuthErrorNotice } from "@/components/auth/OAuthErrorNotice";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { isGoogleProviderConfigured } from "@/lib/auth-flags";
import { getServerSession } from "@/lib/session";
import type { SessionBundle } from "@/types";

export const metadata: Metadata = {
  title: "Register",
  description:
    "Create your free QurbaniHat account with email and password or Google to start booking verified cows and goats.",
  alternates: { canonical: "/register" },
  robots: { index: false, follow: true },
};

export default async function RegisterPage() {
  // Requirement: authenticated users never see /register — they are sent home.
  const session = (await getServerSession()) as SessionBundle | null;
  if (session?.user) {
    redirect("/");
  }

  return (
    <AuthShell
      eyebrow="Create your account"
      title="Join QurbaniHat"
      subtitle="Create a free account to send booking requests, save your profile details and get priority updates before Eid."
      footer={
        <p>
          Already have an account?{" "}
          <Link href="/login" className="link">
            Login
          </Link>
        </p>
      }
    >
      {/* The Google flag is resolved on the server (GOOGLE_CLIENT_ID is not a
          NEXT_PUBLIC_ variable) and passed down as a prop. */}
      <Suspense fallback={null}>
        <OAuthErrorNotice />
      </Suspense>
      <RegisterForm googleEnabled={isGoogleProviderConfigured} />
    </AuthShell>
  );
}