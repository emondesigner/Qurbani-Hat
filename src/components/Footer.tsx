import React from 'react';
import { Link } from '../lib/router-context';
import { 
  Facebook, 
  Instagram, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  HeartHandshake, 
  CheckCircle2 
} from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand & Mission */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-800 flex items-center justify-center text-amber-400">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C7.5 2 3.8 5.4 3.1 9.7L2 10.5V13H3.2C3.7 17.5 7.4 21 12 21C16.6 21 20.3 17.5 20.8 13H22V10.5L20.9 9.7C20.2 5.4 16.5 2 12 2Z" />
                </svg>
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white font-serif">
                Qurbani<span className="text-amber-500">Hat</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              QurbaniHat is a livestock marketplace designed to help users explore and book animals for Qurbani. Connecting ethical pastoral farmers with families seeking pure, healthy sacrificial livestock.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-emerald-800 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-emerald-800 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-emerald-800 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-emerald-500 pl-2.5">
              Quick Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span className="text-xs text-emerald-500">›</span> Home
                </Link>
              </li>
              <li>
                <Link href="/animals" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span className="text-xs text-emerald-500">›</span> All Animals
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span className="text-xs text-emerald-500">›</span> Login
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span className="text-xs text-emerald-500">›</span> Register
                </Link>
              </li>
              <li>
                <Link href="/my-profile" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span className="text-xs text-emerald-500">›</span> My Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Standards & Qurbani Guidelines */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-amber-500 pl-2.5">
              Qurbani Standards
            </h3>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Verified physical inspection and age teeth validation</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Naturally pastured livestock without artificial steroid feeds</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Transparent weighing and fair pricing direct from regional hat</span>
              </li>
              <li className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Assignment Category: <strong>category-A8-Pineapple</strong></span>
              </li>
            </ul>
          </div>

          {/* Contact (Demo Information) */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-emerald-500 pl-2.5">
              Contact & Support
            </h3>
            <div className="bg-slate-800/60 rounded-xl p-3 mb-3 border border-slate-700/50">
              <span className="text-[11px] font-semibold text-amber-400 block uppercase tracking-wider mb-1">
                Demo Contact Notice
              </span>
              <p className="text-xs text-slate-400">
                This livestock platform is built for portfolio and assignment evaluation.
              </p>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Farm Gate, Tejgaon, Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+880 1712-000000 (Demo Hotline)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>support@qurbanihat.demo</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {currentYear} QurbaniHat. All rights reserved. Made for assignment category-A8-Pineapple.</p>
          <div className="flex items-center space-x-6">
            <span className="hover:text-slate-400 transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 transition-colors cursor-pointer">Shariah Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
