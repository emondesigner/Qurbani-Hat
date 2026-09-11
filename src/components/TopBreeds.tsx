import React from 'react';
import { topBreedsList } from '../lib/animals';
import { Link } from '../lib/router-context';
import { Compass, Sparkles, Award } from 'lucide-react';

export function TopBreeds() {
  return (
    <section className="py-16 sm:py-20 bg-[#faf8f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2">
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>Celebrated Lineages</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif tracking-tight">
            Top Qurbani Breeds
          </h2>
          <p className="text-sm sm:text-base text-slate-500 mt-2">
            Explore indigenous and acclimatized breeds most sought-after by families across Bangladesh.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {topBreedsList.map((breed, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:shadow-lg transition-all hover:border-emerald-300 group flex flex-col"
            >
              <div className="h-44 w-full overflow-hidden relative bg-slate-100">
                <img
                  src={breed.image}
                  alt={breed.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                
                <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-900 text-white shadow-xs">
                  {breed.type}
                </span>

                <span className="absolute bottom-3 left-3 text-xs text-white/90 font-medium">
                  {breed.origin}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                    {breed.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                    {breed.features}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={`/animals?type=${breed.type}`}
                    className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1.5"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>View {breed.name}s</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
