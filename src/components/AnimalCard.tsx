import React from 'react';
import { Animal } from '../types';
import { Link } from '../lib/router-context';
import { formatBDT } from '../lib/animals';
import { MapPin, Scale, Calendar, Tag, ArrowRight } from 'lucide-react';

interface AnimalCardProps {
  animal: Animal;
  index?: number;
  key?: React.Key;
}

export function AnimalCard({ animal, index = 0 }: AnimalCardProps) {
  // Use animate.css with staggered classes if desired
  return (
    <div
      id={`animal-card-${animal.id}`}
      className="animate__animated animate__fadeInUp group bg-white rounded-2xl border border-emerald-950/10 hover:border-emerald-500/40 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
      style={{ animationDelay: `${(index % 4) * 0.1}s` }}
    >
      {/* Image Container with Badge */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100">
        <img
          src={animal.image}
          alt={animal.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-60" />
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-900/90 text-emerald-100 backdrop-blur-xs shadow-xs">
            {animal.type}
          </span>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 text-slate-800 backdrop-blur-xs shadow-xs">
            {animal.category}
          </span>
        </div>

        {/* Location pill on image bottom */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white text-xs font-medium bg-slate-900/70 px-2.5 py-1 rounded-md backdrop-blur-xs">
          <MapPin className="w-3.5 h-3.5 text-amber-400" />
          <span>{animal.location}</span>
        </div>
      </div>

      {/* Body Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold mb-1">
            <Tag className="w-3.5 h-3.5 text-amber-600" />
            <span>{animal.breed}</span>
          </div>

          <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-800 transition-colors line-clamp-1">
            {animal.name}
          </h3>

          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {animal.description}
          </p>

          {/* Metric tags (Weight & Age) */}
          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-2">
              <Scale className="w-4 h-4 text-emerald-700 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Weight</span>
                <span className="text-xs font-bold text-slate-800">{animal.weight} kg</span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-2">
              <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Age</span>
                <span className="text-xs font-bold text-slate-800">{animal.age} Years</span>
              </div>
            </div>
          </div>
        </div>

        {/* Price and Details Action */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Price</span>
            <span className="text-xl font-extrabold text-emerald-900 font-serif">
              {formatBDT(animal.price)}
            </span>
          </div>

          <Link
            href={`/details-page/${animal.id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all group-hover:translate-x-0.5"
            id={`details-btn-${animal.id}`}
          >
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
