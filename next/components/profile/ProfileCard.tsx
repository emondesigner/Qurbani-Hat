"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BadgeCheck, LogOut, Mail, Pencil, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { useSessionBundle } from "@/components/SessionProvider";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { authClient } from "@/lib/auth-client";
import type { SessionUser } from "@/types";

function formatMemberSince(value?: Date | string): string | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

/** Premium profile card showing the Better Auth user's photo, name and email. */
export function ProfileCard({ user }: { user: SessionUser }) {
  const router = useRouter();
  const { refresh } = useSessionBundle();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const memberSince = formatMemberSince(user.createdAt);

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await authClient.signOut();
      await refresh();
      toast.success("Logged out successfully.");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Could not log you out. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <div className="surface mx-auto w-full max-w-2xl overflow-hidden">
      <div className="pattern-emerald relative h-28">
        <span aria-hidden="true" className="absolute inset-0 bg-emerald-deep/40" />
      </div>

      <div className="px-6 pb-8 sm:px-8">
        <div className="-mt-14 flex flex-col items-center gap-4 text-center">
          <Avatar
            name={user.name}
            src={user.image}
            size={104}
            className="ring-4 ring-white shadow-lift"
          />
          <div className="space-y-2">
            <h1 className="text-2xl leading-snug sm:text-3xl">{user.name}</h1>
            <p className="flex items-center justify-center gap-2 text-sm text-ink-soft">
              <Mail className="h-4 w-4 text-brand" aria-hidden="true" />
              {user.email}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              <Badge tone="emerald">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                Verified account
              </Badge>
              <Badge tone="outline">
                <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
                Better Auth session
              </Badge>
            </div>
          </div>
        </div>

        <dl className="mt-8 grid gap-3 sm:grid-cols-2">
          <div className="surface-muted p-4">
            <dt className="text-xs font-bold uppercase tracking-wide text-ink-soft">
              Display name
            </dt>
            <dd className="mt-1 truncate font-semibold text-emerald-deep">{user.name}</dd>
          </div>
          <div className="surface-muted p-4">
            <dt className="text-xs font-bold uppercase tracking-wide text-ink-soft">Email address</dt>
            <dd className="mt-1 truncate font-semibold text-emerald-deep">{user.email}</dd>
          </div>
          <div className="surface-muted p-4 sm:col-span-2">
            <dt className="text-xs font-bold uppercase tracking-wide text-ink-soft">Member since</dt>
            <dd className="mt-1 font-semibold text-emerald-deep">
              {memberSince ?? "Available after your first booking"}
            </dd>
          </div>
        </dl>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button
            href="/my-profile/update"
            size="lg"
            fullWidth
            leftIcon={<Pencil className="h-4 w-4" aria-hidden="true" />}
          >
            Update Profile
          </Button>
          <Button
            variant="danger"
            size="lg"
            fullWidth
            loading={isLoggingOut}
            onClick={handleLogout}
            leftIcon={<LogOut className="h-4 w-4" aria-hidden="true" />}
          >
            {isLoggingOut ? "Logging out…" : "Logout"}
          </Button>
        </div>

        <p className="mt-6 text-center text-xs leading-relaxed text-ink-soft">
          Your name, email and photo are stored securely in MongoDB by Better Auth. Email cannot be
          changed from this page.
        </p>
      </div>
    </div>
  );
}