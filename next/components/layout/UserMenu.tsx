"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, UserRound } from "lucide-react";
import { toast } from "sonner";

import { useSessionBundle } from "@/components/SessionProvider";
import { Avatar } from "@/components/ui/Avatar";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

/**
 * Desktop avatar dropdown: shows the signed-in user, links to the profile and
 * performs the Better Auth sign-out (session destroyed in MongoDB, cookies
 * cleared server-side).
 */
export function UserMenu() {
  const router = useRouter();
  const { user, refresh } = useSessionBundle();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  if (!user) return null;

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await authClient.signOut();
      await refresh();
      toast.success("Logged out successfully.");
      setIsOpen(false);
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Could not log you out. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={`Account menu for ${user.name}`}
        className="flex items-center gap-2 rounded-full border border-emerald-deep/12 bg-white px-2 py-1.5 pr-3 text-sm font-semibold text-emerald-deep transition hover:border-brand/40 hover:bg-brand/5"
      >
        <Avatar name={user.name} src={user.image} size={30} />
        <span className="max-w-[8rem] truncate">{user.name.split(" ")[0]}</span>
        <ChevronDown
          className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")}
          aria-hidden="true"
        />
      </button>

      {isOpen ? (
        <div role="menu" className="surface absolute right-0 mt-2 w-64 p-2 shadow-lift">
          <div className="flex items-center gap-3 rounded-2xl bg-cream-200/70 p-3">
            <Avatar name={user.name} src={user.image} size={40} />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-emerald-deep">{user.name}</p>
              <p className="truncate text-xs text-ink-soft">{user.email}</p>
            </div>
          </div>
          <Link
            href="/my-profile"
            role="menuitem"
            className="mt-1 flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-ink transition hover:bg-brand/8 hover:text-brand"
          >
            <UserRound className="h-4 w-4" aria-hidden="true" />
            My Profile
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            {isLoggingOut ? "Logging out…" : "Logout"}
          </button>
        </div>
      ) : null}
    </div>
  );
}