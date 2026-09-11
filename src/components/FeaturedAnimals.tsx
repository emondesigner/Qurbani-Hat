import React from 'react';
import { getFeaturedAnimals } from '../lib/animals';
import { AnimalCard } from './AnimalCard';
import { Link } from '../lib/router-context';
import { ArrowRight, Sparkles } from 'lucide-react';

export function FeaturedAnimals() {
  const featured = getFeaturedAnimals();

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Handpicked Selection</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif tracking-tight">
              Featured Qurbani Animals
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mt-2 max-w-xl">
              Prime livestock verified for health, weight, teeth age requirements, and physical perfection.
            </p>
          </div>

          <Link
            href="/animals"
            className="inline-flex items-center gap-2 text-sm font-bold text-emerald-800 hover:text-emerald-950 transition-colors group self-start sm:self-auto"
          >
            <span>View All Animals ({featured.length}+ available)</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 4 Featured Animals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((animal, idx) => (
            <AnimalCard key={animal.id} animal={animal} index={idx} />
          ))}
        </div>

      </div>
    </section>
  );
}
