import React, { useEffect } from 'react';
import { useAuth } from '../lib/auth-context';
import { useRouter, Link } from '../lib/router-context';
import { 
  User as UserIcon, 
  Mail, 
  Edit3, 
  Calendar, 
  ShieldCheck, 
  Lock, 
  ArrowRight,
  LogOut
} from 'lucide-react';

export function MyProfilePage() {
  const { user, isAuthenticated, isLoading, signOut } = useAuth();
  const { navigate } = useRouter();

  // Route protection
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login?redirect=/my-profile');
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] bg-[#faf8f5] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-800 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[70vh] bg-[#faf8f5] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center space-y-4 border border-slate-200">
          <Lock className="w-10 h-10 text-amber-500 mx-auto" />
          <h2 className="text-xl font-bold font-serif text-slate-900">Sign In Required</h2>
          <p className="text-xs text-slate-500">Please log in to view your account details.</p>
          <Link
            href="/login?redirect=/my-profile"
            className="inline-block py-2.5 px-6 rounded-xl bg-emerald-800 text-white font-bold text-xs"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#faf8f5] min-h-[85vh] py-12 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Profile Card animated with Animate.css (Requirement 18) */}
        <div 
          id="profile-card"
          className="animate__animated animate__fadeIn bg-white rounded-3xl border border-emerald-100 shadow-xl overflow-hidden"
        >
          
          {/* Header Banner with Emerald / Amber tones */}
          <div className="h-40 bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-950 relative">
            <div className="absolute top-4 right-4 bg-emerald-950/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-emerald-200 border border-emerald-700/50 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Verified Account</span>
            </div>
          </div>

          <div className="px-6 sm:px-10 pb-10 relative">
            
            {/* User Avatar */}
            <div className="-mt-16 mb-6 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4">
              <div className="relative">
                <img
                  src={user.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=240&q=80'}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="w-32 h-32 rounded-3xl object-cover ring-4 ring-white shadow-xl bg-slate-100"
                />
                <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>

              {/* Update Information Button (Requirement 14 & 16) */}
              <div className="flex items-center gap-3">
                <Link
                  href="/my-profile/update"
                  id="update-profile-btn"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Update Information</span>
                </Link>

                <button
                  type="button"
                  onClick={async () => {
                    await signOut();
                    navigate('/');
                  }}
                  className="p-2.5 rounded-xl border border-slate-200 hover:bg-red-50 hover:border-red-200 text-slate-600 hover:text-red-600 transition-colors cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Profile Information (Mandatory: Name, Photo, Email) */}
            <div className="space-y-6">
              
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
                  {user.name}
                </h1>
                <p className="text-xs sm:text-sm text-emerald-800 font-medium mt-0.5">
                  QurbaniHat Member
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    <Mail className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Email Address</span>
                  </div>
                  <p className="text-sm font-bold text-slate-800 truncate">
                    {user.email}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    <UserIcon className="w-3.5 h-3.5 text-amber-600" />
                    <span>Account ID</span>
                  </div>
                  <p className="text-sm font-bold text-slate-800 truncate">
                    {user.id}
                  </p>
                </div>

              </div>

              {/* Additional Profile Context */}
              <div className="bg-emerald-50/60 rounded-2xl p-5 border border-emerald-100 flex items-start gap-3.5">
                <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-600 space-y-1">
                  <p className="font-bold text-slate-900">Better Auth Security Status: Active</p>
                  <p>
                    Your session is managed by Better Auth client integration. You can modify your display name and avatar URL using the Update Information button.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
