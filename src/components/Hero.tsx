import React from 'react';
import { Link } from '../lib/router-context';
import { ArrowRight, ShieldCheck, CheckCircle, Sparkles, Heart } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 text-white pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Decorative ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Background geometric pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left animate__animated animate__fadeInLeft">
            
            {/* Tag / Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-600/30 text-amber-300 text-xs font-semibold backdrop-blur-xs shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Eid-ul-Adha Livestock Marketplace</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span className="text-emerald-200">category-A8-Pineapple</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-serif leading-tight sm:leading-tight lg:leading-[1.15]">
              Find Your Perfect <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-emerald-300">
                Qurbani Animal
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-emerald-100/90 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Explore healthy livestock from trusted locations and make your Qurbani preparation easier with QurbaniHat. Browse verified deshi cattle, prize bulls, and healthy goats with transparent pricing and direct booking.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/animals"
                id="hero-browse-animals-btn"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold text-base shadow-lg shadow-amber-500/25 hover:shadow-xl transition-all flex items-center justify-center gap-2.5 cursor-pointer transform hover:-translate-y-0.5"
              >
                <span>Browse Animals</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <a
                href="#qurbani-tips"
                className="w-full sm:w-auto px-6 py-4 rounded-xl bg-emerald-800/60 hover:bg-emerald-800 border border-emerald-600/40 text-emerald-100 hover:text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 backdrop-blur-xs"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>Qurbani Tips & Rules</span>
              </a>
            </div>

            {/* Quality Feature Pills */}
            <div className="pt-6 border-t border-emerald-800/60 grid grid-cols-3 gap-3 text-left">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Age Verified</span>
                </div>
                <p className="text-[11px] text-emerald-200/70">Meets 2-teeth age requirement</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>100% Organic</span>
                </div>
                <p className="text-[11px] text-emerald-200/70">Pasture grass fed without steroids</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Instant Booking</span>
                </div>
                <p className="text-[11px] text-emerald-200/70">Reserve with contact details</p>
              </div>
            </div>

          </div>

          {/* Right Hero Image Card */}
          <div className="lg:col-span-5 animate__animated animate__fadeInRight">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Glow backdrop */}
              <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-amber-500 to-emerald-500 opacity-30 blur-lg" />
              
              {/* Main Image Frame */}
              <div className="relative rounded-3xl overflow-hidden border border-emerald-700/50 bg-emerald-900/40 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=1200&q=85"
                  alt="Prime Deshi Qurbani Cow"
                  className="w-full h-[380px] sm:h-[420px] object-cover hover:scale-105 transition-transform duration-700"
                />

                {/* Overlaid Float Card */}
                <div className="absolute bottom-4 left-4 right-4 bg-slate-950/85 backdrop-blur-md rounded-2xl p-4 border border-emerald-500/30 text-white flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Featured Cattle</span>
                    <h3 className="text-base font-bold text-white">Deshi Shahi Champion</h3>
                    <p className="text-xs text-slate-300">280 kg • Bogura Pasture</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Offer Price</span>
                    <span className="text-lg font-serif font-black text-amber-400">৳120,000</span>
                  </div>
                </div>

                {/* Top Badge on image */}
                <div className="absolute top-4 left-4 bg-emerald-950/90 backdrop-blur-md border border-emerald-500/40 px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs text-emerald-100 font-medium">
                  <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                  <span>Verified Qurbani Ready</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
