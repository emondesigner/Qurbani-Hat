import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth-context';
import { useRouter, Link } from '../lib/router-context';
import { 
  User, 
  Image as ImageIcon, 
  Mail, 
  ArrowLeft, 
  Save, 
  Loader2, 
  AlertCircle,
  Lock
} from 'lucide-react';

export function UpdateProfilePage() {
  const { user, isAuthenticated, isLoading, updateProfile } = useAuth();
  const { navigate } = useRouter();

  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Route protection
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login?redirect=/my-profile/update');
    }
  }, [isLoading, isAuthenticated, navigate]);

  // Pre-fill user data when loaded
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setImage(user.image || '');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please provide your name.');
      return;
    }

    setIsSubmitting(true);
    // Call Better Auth user update API
    const success = await updateProfile({
      name: name.trim(),
      image: image.trim() || (user?.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80')
    });
    setIsSubmitting(false);

    if (success) {
      // Redirect to /my-profile after success as mandated
      navigate('/my-profile');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] bg-[#faf8f5] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-800 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="bg-[#faf8f5] min-h-[85vh] py-12 sm:py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/my-profile"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-800 hover:text-emerald-950 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to My Profile</span>
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-emerald-100 shadow-xl p-8 sm:p-10 space-y-6 animate__animated animate__fadeIn">
          
          <div className="border-b border-slate-100 pb-5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
              Update Profile Information
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Modify your account name and avatar photo using Better Auth user updates.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Current Avatar Preview */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <img
              src={image.trim() || user.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'}
              alt="Avatar Preview"
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-600/30 bg-white"
            />
            <div>
              <span className="text-xs font-bold text-slate-700 block">Avatar Preview</span>
              <p className="text-[11px] text-slate-500">Live preview of your profile image</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Field 1: Name (Editable) */}
            <div>
              <label htmlFor="update-name" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  id="update-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  required
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:bg-white outline-hidden transition-all"
                />
              </div>
            </div>

            {/* Field 2: Image URL (Editable) */}
            <div>
              <label htmlFor="update-image-url" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Profile Image URL *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <input
                  type="url"
                  id="update-image-url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:bg-white outline-hidden transition-all"
                />
              </div>
            </div>

            {/* Read-Only Email Display (Strict Requirement: Email must be read-only!) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Email Address
                </label>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md flex items-center gap-1 border border-amber-200">
                  <Lock className="w-3 h-3" />
                  <span>Read Only</span>
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  id="update-email-readonly"
                  value={user.email}
                  disabled
                  readOnly
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-100/80 border border-slate-200 text-slate-500 rounded-xl cursor-not-allowed outline-hidden"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                For security, email addresses cannot be modified directly.
              </p>
            </div>

            {/* Action Buttons: Button text MUST be "Update Information" */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                id="update-information-submit-btn"
                disabled={isSubmitting}
                className="flex-1 py-3.5 px-6 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Update Information</span>
                  </>
                )}
              </button>

              <Link
                href="/my-profile"
                className="py-3.5 px-6 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-sm text-center transition-colors"
              >
                Cancel
              </Link>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
}
