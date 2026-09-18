"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

import { MobileNav, type NavLink } from "@/components/layout/MobileNav";
import { UserMenu } from "@/components/layout/UserMenu";
import { useSessionBundle } from "@/components/SessionProvider";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

const PUBLIC_LINKS: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/animals", label: "All Animals" },
];

/**
 * Application-wide navbar. Rendered once in app/layout.tsx so it stays
 * consistent on every route. The initial auth state comes from a server-side
 * session lookup (passed through SessionProvider), so the logged-in and
 * logged-out states never flash on first paint.
 */
export function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated } = useSessionBundle();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const links: NavLink[] = isAuthenticated
    ? [...PUBLIC_LINKS, { href: "/my-profile", label: "My Profile" }]
    : PUBLIC_LINKS;

  // Never leave the drawer open after navigation. Adjusting state during render
  // (the React-documented "reset state when a value changes" pattern) is used
  // instead of an effect so there is no extra render pass after routing.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setIsMobileOpen(false);
  }

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-deep/10 bg-cream/85 backdrop-blur-md">
      <nav className="container-page flex h-16 items-center justify-between gap-4" aria-label="Main">
        <Logo />

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                  isActive(link.href)
                    ? "bg-brand/10 text-brand"
                    : "text-ink hover:bg-brand/8 hover:text-brand",
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 md:flex">
          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <>
              <Button href="/login" variant="ghost">
                Login
              </Button>
              <Button href="/register">Register</Button>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsMobileOpen((open) => !open)}
          aria-expanded={isMobileOpen}
          aria-controls="mobile-navigation"
          aria-label={isMobileOpen ? "Close navigation menu" : "Open navigation menu"}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-deep/15 bg-white text-emerald-deep transition hover:bg-brand/8 md:hidden"
        >
          {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <MobileNav links={links} isOpen={isMobileOpen} />
    </header>
  );
}