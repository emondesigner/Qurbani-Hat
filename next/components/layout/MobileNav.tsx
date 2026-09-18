"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { useSessionBundle } from "@/components/SessionProvider";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

export interface NavLink {
  href: string;
  label: string;
}

/** Responsive mobile drawer: identity card, links and auth actions. */
export function MobileNav({ links, isOpen }: { links: NavLink[]; isOpen: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, refresh } = useSessionBundle();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

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
    <div
      id="mobile-navigation"
      hidden={!isOpen}
      className="border-t border-emerald-deep/10 bg-cream md:hidden"
    >
      <div className="container-page flex flex-col gap-1 py-4">
        {isAuthenticated && user ? (
          <div className="mb-2 flex items-center gap-3 rounded-2xl bg-white p-3 shadow-soft">
            <Avatar name={user.name} src={user.image} size={44} />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-emerald-deep">{user.name}</p>
              <p className="truncate text-xs text-ink-soft">{user.email}</p>
            </div>
          </div>
        ) : null}

        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive(link.href) ? "page" : undefined}
            className={cn(
              "rounded-xl px-4 py-3 text-sm font-semibold transition",
              isActive(link.href) ? "bg-brand/10 text-brand" : "text-ink hover:bg-brand/8",
            )}
          >
            {link.label}
          </Link>
        ))}

        <div className="mt-3 flex flex-col gap-2">
          {isAuthenticated ? (
            <>
              <Button href="/my-profile/update" variant="outline" fullWidth>
                Update Profile
              </Button>
              <Button variant="danger" fullWidth loading={isLoggingOut} onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button href="/login" variant="outline" fullWidth>
                Login
              </Button>
              <Button href="/register" fullWidth>
                Register
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}