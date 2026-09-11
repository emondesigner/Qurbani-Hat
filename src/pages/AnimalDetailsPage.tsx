import React, { useState, useEffect } from 'react';
import { useRouter, Link } from '../lib/router-context';
import { getAnimalById, formatBDT } from '../lib/animals';
import { BookingForm } from '../components/BookingForm';
import { 
  Scale, 
  Calendar, 
  MapPin, 
  Tag, 
  ShieldCheck, 
  ArrowLeft, 
  CheckCircle, 
  HelpCircle,
  AlertTriangle
} from 'lucide-react';

export function AnimalDetailsPage() {
  const { params } = useRouter();
  const animalId = params.id;
  const animal = animalId ? getAnimalById(animalId) : undefined;

  // If animal does not exist, show invalid ID state
  if (!animal) {
    return (
      <div className="min-h-[70vh] bg-[#faf8f5] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-md max-w-md w-full text-center space-y-4 animate__animated animate__fadeIn">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold font-serif text-slate-900">
            Animal Not Found
          </h2>
          <p className="text-sm text-slate-600">
            The livestock record with ID <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800">#{animalId || 'unknown'}</code> could not be found or has been reserved.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/animals"
              className="flex-1 py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm text-center shadow-sm"
            >
              Browse All Animals
            </Link>
            <Link
              href="/"
              className="flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm text-center"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#faf8f5] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb / Back Link */}
        <div className="mb-6">
          <Link
            href="/animals"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-800 hover:text-emerald-950 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Animals</span>
          </Link>
        </div>

        {/* Clean Two-Column Layout on Desktop, Stacked on Mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Large Image & Gallery & Badges */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="relative rounded-3xl overflow-hidden bg-white border border-emerald-950/10 shadow-lg">
              <img
                src={animal.image}
                alt={animal.name}
                className="w-full h-[360px] sm:h-[480px] object-cover"
              />
              
              {/* Type and Category Overlays */}
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-900/90 text-white shadow-md backdrop-blur-xs">
                  {animal.type}
                </span>
                <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/95 text-slate-900 shadow-md backdrop-blur-xs">
                  {animal.category}
                </span>
              </div>

              {/* Tag ID */}
              <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-xs text-amber-300 text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                Official Tag #{animal.id}
              </div>
            </div>

            {/* Verification Guarantee Banner */}
            <div className="bg-emerald-900 text-white rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-emerald-800 text-amber-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-white">
                    Verified Qurbani Ready
                  </h4>
                  <p className="text-xs text-emerald-200">
                    Physical inspection passed: intact horns, flawless teeth age test, and certified health.
                  </p>
                </div>
              </div>
              <div className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-800/80 text-emerald-100 shrink-0">
                100% Shariah Compliant
              </div>
            </div>

            {/* Comprehensive Description Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-slate-900 font-serif border-b border-slate-100 pb-3">
                Animal Profile & Background
              </h3>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                {animal.description}
              </p>

              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Key Specifications
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block mb-1">Breed</span>
                    <strong className="text-slate-900 text-sm">{animal.breed}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block mb-1">Weight</span>
                    <strong className="text-slate-900 text-sm">{animal.weight} kg</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block mb-1">Age</span>
                    <strong className="text-slate-900 text-sm">{animal.age} Years</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block mb-1">Location</span>
                    <strong className="text-slate-900 text-sm">{animal.location}</strong>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Animal Name, Pricing & Mandatory Booking Form */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Primary Details Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-950/10 shadow-sm space-y-5">
              
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
                  <Tag className="w-3.5 h-3.5 text-amber-600" />
                  <span>{animal.breed}</span>
                  <span>•</span>
                  <span>{animal.location} Regional Hat</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif tracking-tight">
                  {animal.name}
                </h1>
              </div>

              {/* Price Display */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-baseline justify-between">
                <div>
                  <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block">
                    Fixed Hat Price
                  </span>
                  <div className="text-3xl sm:text-4xl font-extrabold text-emerald-950 font-serif">
                    {formatBDT(animal.price)}
                  </div>
                </div>
                <span className="text-xs text-slate-500 font-medium">All Taxes Incl.</span>
              </div>

              {/* Quick Specs Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <Scale className="w-5 h-5 text-emerald-700 shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Live Weight</span>
                    <span className="text-sm font-extrabold text-slate-800">{animal.weight} kg</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <Calendar className="w-5 h-5 text-amber-600 shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Teeth & Age</span>
                    <span className="text-sm font-extrabold text-slate-800">{animal.age} Years (Verified)</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-xl">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Stationed at pastoral pasture in <strong>{animal.location}</strong>. Transportation arranged upon request.</span>
              </div>

            </div>

            {/* MANDATORY BOOKING FORM COMPONENT */}
            <div id="booking-section">
              <BookingForm animal={animal} />
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
