import React from 'react';
import { Link } from '../lib/router-context';
import { ArrowRight, Sparkles } from 'lucide-react';

export function CtaSection() {
  return (
    <section className="py-16 sm:py-20 bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 text-white relative overflow-hidden">
      {/* Decorative pulse element from Animate.css */}
      <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-10 -top-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 animate__animated animate__fadeIn">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-800/80 border border-emerald-600/30 text-amber-300 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Sacred Preparation Made Effortless</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif tracking-tight text-white mb-6">
          Ready to Find Your <span className="text-amber-400">Qurbani Animal?</span>
        </h2>

        <p className="text-base sm:text-lg text-emerald-100/85 max-w-2xl mx-auto mb-8 leading-relaxed font-normal">
          Browse our full collection of healthy bulls, heifers, and prize goats. Filter by breed, weight, and price to find the perfect sacrificial animal for your family.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/animals"
            id="cta-explore-all-animals-btn"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold text-base shadow-xl shadow-amber-500/20 hover:shadow-2xl transition-all flex items-center justify-center gap-2.5 cursor-pointer transform hover:-translate-y-0.5"
          >
            <span>Explore All Animals</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
