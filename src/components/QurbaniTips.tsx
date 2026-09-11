import React from 'react';
import { 
  HeartHandshake, 
  Activity, 
  Clock, 
  Truck, 
  BookOpen, 
  ShieldAlert 
} from 'lucide-react';

export function QurbaniTips() {
  const tips = [
    {
      icon: Activity,
      title: "Choose a Healthy Animal",
      desc: "Ensure the animal is energetic, with bright clear eyes, a moist muzzle, and a smooth coat without wounds, blindness, or limping."
    },
    {
      icon: Clock,
      title: "Check Age & Teeth Condition",
      desc: "Sacrificial cows must be at least 2 years old (with two prominent front teeth replaced), while goats must be at least 1 full year old."
    },
    {
      icon: HeartHandshake,
      title: "Confirm Availability Before Booking",
      desc: "Review farm location, pickup or delivery logistics, and ensure the pastoral keeper has reserved your chosen tag number."
    },
    {
      icon: Truck,
      title: "Prepare Safe Transportation",
      desc: "Arrange well-ventilated, padded transport with ample straw bedding to prevent transit fatigue or injury before the blessed day."
    },
    {
      icon: BookOpen,
      title: "Consult Religious Authority",
      desc: "Always consult a trusted scholar or local imam regarding personal niyyah, sharing shares (1 to 7 shares per cow), and timing."
    }
  ];

  return (
    <section id="qurbani-tips" className="py-16 sm:py-20 bg-emerald-950 text-white relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-emerald-900/60 px-3 py-1 rounded-full border border-emerald-800">
            Sacred Guidelines
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-serif mt-3 tracking-tight">
            Essential Qurbani Tips
          </h2>
          <p className="text-sm sm:text-base text-emerald-200/80 mt-2">
            Important guidelines and Sunnah recommendations to ensure your sacrificial animal meets all requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tips.map((tip, index) => {
            const IconComponent = tip.icon;
            return (
              <div 
                key={index}
                className="bg-emerald-900/40 border border-emerald-800/60 rounded-2xl p-6 hover:bg-emerald-900/70 transition-all hover:border-emerald-600/50 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-bold mb-4 shadow-md shadow-amber-500/10">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    {tip.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-100/75 leading-relaxed">
                    {tip.desc}
                  </p>
                </div>
                
                <div className="mt-4 pt-3 border-t border-emerald-800/40 flex items-center gap-1.5 text-[11px] font-semibold text-amber-300">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Important Verification Rule</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
