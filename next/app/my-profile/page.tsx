import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ProfileCard } from "@/components/profile/ProfileCard";
import { getServerSession } from "@/lib/session";
import type { SessionBundle } from "@/types";

export const metadata: Metadata = {
  title: "My Profile",
  description: "View your QurbaniHat account details and manage your profile information.",
  robots: { index: false, follow: false },
};

/**
 * /my-profile — private route.
 *
 * proxy.ts bounces signed-out visitors early, but this page re-validates the
 * session on the server with Better Auth, so it is impossible to render profile
 * data for anyone who is not authenticated (never trust the cookie alone).
 */
export default async function MyProfilePage() {
  const session = (await getServerSession()) as SessionBundle | null;

  if (!session?.user) {
    // Defence in depth: proxy.ts normally handles this redirect first.
    // `redirect()` returns never, so TS narrows `session` after this block.
    redirect("/login?redirect=%2Fmy-profile");
  }

  return (
    <section className="section">
      <div className="container-page">
        <div className="mb-8 text-center">
          <span className="eyebrow">Your account</span>
          <h1 className="mt-4 text-3xl leading-tight sm:text-4xl">My Profile</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-ink-soft">
            These details come straight from your Better Auth session stored in MongoDB. Update your
            name or photo at any time.
          </p>
        </div>

        <ProfileCard user={session.user} />
      </div>
    </section>
  );
}