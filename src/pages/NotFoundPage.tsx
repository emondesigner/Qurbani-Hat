import React from 'react';
import { Link } from '../lib/router-context';
import { Home, Compass, AlertCircle, Sparkles } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-[75vh] bg-[#faf8f5] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xl text-center space-y-6 animate__animated animate__fadeIn">
        
        {/* Livestock Not Found Illustration */}
        <div className="relative w-24 h-24 mx-auto">
          <div className="w-24 h-24 rounded-3xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600 shadow-inner">
            <svg className="w-12 h-12 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C7.5 2 3.8 5.4 3.1 9.7L2 10.5V13H3.2C3.7 17.5 7.4 21 12 21C16.6 21 20.3 17.5 20.8 13H22V10.5L20.9 9.7C20.2 5.4 16.5 2 12 2Z" />
            </svg>
          </div>
          <div className="absolute -bottom-1 -right-1 bg-emerald-800 text-white p-2 rounded-xl shadow-md">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

        <div>
          <span className="text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Error 404
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif mt-3 tracking-tight">
            Page Not Found
          </h1>
          <p className="text-sm sm:text-base text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
            The livestock pasture or page you are looking for has been relocated, reserved, or does not exist on QurbaniHat.
          </p>
        </div>

        {/* Buttons: Back to Home & Browse Animals as mandated by Requirement 21 */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href="/"
            id="not-found-back-home-btn"
            className="flex-1 py-3 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <Link
            href="/animals"
            id="not-found-browse-animals-btn"
            className="flex-1 py-3 px-5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            <span>Browse Animals</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
