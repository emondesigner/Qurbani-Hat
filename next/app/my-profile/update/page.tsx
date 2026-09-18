import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { UpdateProfileForm } from "@/components/profile/UpdateProfileForm";
import { getServerSession } from "@/lib/session";
import type { SessionBundle } from "@/types";

export const metadata: Metadata = {
  title: "Update Profile",
  description: "Update your QurbaniHat display name and profile photo.",
  robots: { index: false, follow: false },
};

/**
 * /my-profile/update — private route.
 * The current user is read from the server session so the form is pre-filled
 * with authoritative data rather than anything supplied by the browser.
 */
export default async function UpdateProfilePage() {
  const session = (await getServerSession()) as SessionBundle | null;

  if (!session?.user) {
    redirect("/login?redirect=%2Fmy-profile%2Fupdate");
  }

  return (
    <section className="section">
      <div className="container-page">
        <div className="mb-8 text-center">
          <span className="eyebrow">Account settings</span>
          <h1 className="mt-4 text-3xl leading-tight sm:text-4xl">Update Your Profile</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-ink-soft">
            Keep your details accurate so booking confirmations reach the right person before Eid.
          </p>
        </div>

        <UpdateProfileForm user={session.user} />
      </div>
    </section>
  );
}