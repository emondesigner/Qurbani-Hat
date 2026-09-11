import React from 'react';
import { 
  BadgeCheck, 
  Search, 
  CalendarCheck, 
  Coins, 
  Smartphone, 
  Info 
} from 'lucide-react';

export function WhyChooseUs() {
  const reasons = [
    {
      icon: BadgeCheck,
      title: "Trusted Animal Information",
      desc: "Comprehensive animal profiles including exact weight, verified age, breed origin, and high-resolution photography."
    },
    {
      icon: Search,
      title: "Easy Browsing & Sorting",
      desc: "Fast, dynamic filters to effortlessly sort by price, category, livestock type, and regional market origins."
    },
    {
      icon: CalendarCheck,
      title: "Simple Booking Experience",
      desc: "Convenient reservation flow with zero hassle, instant confirmation, and dedicated direct pastoral contact."
    },
    {
      icon: Coins,
      title: "Transparent Pricing",
      desc: "Direct regional hat rates with no hidden middleman commissions or inflated holiday markups."
    },
    {
      icon: Smartphone,
      title: "Responsive On All Devices",
      desc: "Optimized mobile-first interface designed to browse livestock comfortably on any phone, tablet, or desktop."
    }
  ];

  return (
    <section className="py-16 sm:py-20 bg-white border-y border-emerald-900/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            Our Commitment
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif mt-3 tracking-tight">
            Why Choose QurbaniHat?
          </h2>
          <p className="text-sm sm:text-base text-slate-500 mt-2">
            A specialized digital livestock portal dedicated to simplicity, transparency, and reverence for Eid-ul-Adha.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((r, i) => {
            const Icon = r.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-2xl bg-[#faf8f5] border border-slate-200/70 hover:border-emerald-300 hover:shadow-md transition-all flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-800 text-amber-300 flex items-center justify-center shrink-0 shadow-sm">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">
                    {r.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {r.desc}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Demo Project Clarification Card */}
          <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200/70 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Info className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-amber-950 mb-1">
                Demonstration Notice
              </h3>
              <p className="text-xs sm:text-sm text-amber-900/80 leading-relaxed">
                Created for assignment <strong>category-A8-Pineapple</strong>. Bookings are frontend-only demonstrations and are not saved to any database.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
