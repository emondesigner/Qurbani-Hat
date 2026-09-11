import React from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingSpinner({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-3 min-h-[260px]">
      <div className="w-12 h-12 rounded-full border-4 border-emerald-100 border-t-emerald-800 animate-spin flex items-center justify-center">
        <div className="w-4 h-4 rounded-full bg-amber-500 animate-ping" />
      </div>
      <p className="text-sm font-semibold text-emerald-950 animate-pulse font-serif">{text}</p>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden animate-pulse flex flex-col">
      <div className="aspect-4/3 bg-slate-200" />
      <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="h-3 w-20 bg-slate-200 rounded-full" />
          <div className="h-5 w-3/4 bg-slate-200 rounded-md" />
          <div className="h-3 w-full bg-slate-200 rounded-md" />
          <div className="h-3 w-2/3 bg-slate-200 rounded-md" />
          <div className="grid grid-cols-2 gap-2 pt-2">
            <div className="h-10 bg-slate-100 rounded-lg" />
            <div className="h-10 bg-slate-100 rounded-lg" />
          </div>
        </div>
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="h-6 w-24 bg-slate-200 rounded-md" />
          <div className="h-8 w-20 bg-slate-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function PageLoadingScreen() {
  return (
    <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 border border-emerald-100 shadow-xl max-w-sm w-full text-center space-y-4 animate__animated animate__fadeIn">
        <div className="w-16 h-16 rounded-2xl bg-emerald-800 flex items-center justify-center mx-auto text-amber-400 shadow-lg shadow-emerald-900/20">
          <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
            <path d="M12 2C7.5 2 3.8 5.4 3.1 9.7L2 10.5V13H3.2C3.7 17.5 7.4 21 12 21C16.6 21 20.3 17.5 20.8 13H22V10.5L20.9 9.7C20.2 5.4 16.5 2 12 2Z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold font-serif text-slate-900">
            Qurbani<span className="text-amber-600">Hat</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">Preparing livestock marketplace...</p>
        </div>
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-800 rounded-full animate-[pulse_1s_ease-in-out_infinite] w-2/3 mx-auto" />
        </div>
      </div>
    </div>
  );
}
