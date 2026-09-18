import Link from "next/link";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Youtube } from "lucide-react";

import { Logo } from "@/components/ui/Logo";

const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/animals", label: "All Animals" },
  { href: "/my-profile", label: "My Profile" },
  { href: "/login", label: "Login" },
  { href: "/register", label: "Register" },
];

const SOCIAL_LINKS = [
  { href: "https://facebook.com", label: "Facebook", Icon: Facebook },
  { href: "https://instagram.com", label: "Instagram", Icon: Instagram },
  { href: "https://linkedin.com", label: "LinkedIn", Icon: Linkedin },
  { href: "https://youtube.com", label: "YouTube", Icon: Youtube },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-emerald-deep/10 bg-emerald-deep text-cream">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <div className="[&_span]:text-cream">
            <Logo />
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-cream/75">
            QurbaniHat is a modern livestock marketplace where families in Bangladesh find healthy,
            verified cows and goats for a confident and meaningful Qurbani.
          </p>
          <div className="flex flex-wrap gap-2">
            {SOCIAL_LINKS.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`QurbaniHat on ${label}`}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-cream/10 text-cream transition hover:-translate-y-0.5 hover:bg-gold hover:text-white"
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        <nav aria-label="Quick links">
          <h3 className="mb-4 font-display text-lg text-cream">Quick Links</h3>
          <ul className="space-y-2.5 text-sm">
            {QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-cream/75 transition hover:text-gold-soft hover:underline hover:underline-offset-4"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="mb-4 font-display text-lg text-cream">Contact</h3>
          <ul className="space-y-3 text-sm text-cream/75">
            <li className="flex items-start gap-2.5">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold-soft" aria-hidden="true" />
              <a href="mailto:support@qurbanihat.com" className="transition hover:text-gold-soft">
                support@qurbanihat.com
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold-soft" aria-hidden="true" />
              <a href="tel:+8801700000000" className="transition hover:text-gold-soft">
                +880 1700-000000
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-soft" aria-hidden="true" />
              <span>Kazi Nazrul Islam Avenue, Farmgate, Dhaka 1215, Bangladesh</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-display text-lg text-cream">Qurbani Promise</h3>
          <ul className="space-y-2.5 text-sm text-cream/75">
            <li>Verified breed and weight records</li>
            <li>Transparent, haggle-free pricing</li>
            <li>Veterinary health documents on request</li>
            <li>Support with transport and slaughter scheduling</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/12">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-5 text-xs text-cream/70 sm:flex-row">
          <p>© {year} QurbaniHat. All rights reserved.</p>
          <p>Built with Next.js, Better Auth &amp; MongoDB.</p>
        </div>
      </div>
    </footer>
  );
}