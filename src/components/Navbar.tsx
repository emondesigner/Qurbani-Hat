import React, { useState, useRef, useEffect } from 'react';
import { Link, useRouter } from '../lib/router-context';
import { useAuth } from '../lib/auth-context';
import { 
  Menu, 
  X, 
  User as UserIcon, 
  LogOut, 
  Compass, 
  Home, 
  ShieldCheck, 
  ChevronDown
} from 'lucide-react';

export function Navbar() {
  const { path, navigate } = useRouter();
  const { user, isAuthenticated, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    await signOut();
    navigate('/');
  };

  const isLinkActive = (targetPath: string) => {
    if (targetPath === '/' && path === '/') return true;
    if (targetPath !== '/' && path.startsWith(targetPath)) return true;
    return false;
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-emerald-900 flex items-center justify-center text-amber-400 shadow-sm shadow-emerald-900/10 group-hover:scale-105 transition-transform duration-200">
              {/* Livestock / Farm Hat Icon */}
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C7.5 2 3.8 5.4 3.1 9.7L2 10.5V13H3.2C3.7 17.5 7.4 21 12 21C16.6 21 20.3 17.5 20.8 13H22V10.5L20.9 9.7C20.2 5.4 16.5 2 12 2ZM6.3 8.8C7.5 6.5 9.6 5 12 5C14.4 5 16.5 6.5 17.7 8.8C16.1 9.6 14.1 10 12 10C9.9 10 7.9 9.6 6.3 8.8ZM12 19C8.7 19 6 16.3 6 13C6 12.3 6.1 11.6 6.3 11C7.9 11.7 9.9 12 12 12C14.1 12 16.1 11.7 17.7 11C17.9 11.6 18 12.3 18 13C18 16.3 15.3 19 12 19Z" />
              </svg>
            </div>
            <div>
              <span className="text-2xl font-extrabold tracking-tight text-emerald-950 font-serif flex items-center">
                Qurbani<span className="text-amber-600">Hat</span>
              </span>
              <span className="text-[10px] font-semibold text-emerald-700 block tracking-widest uppercase -mt-1">
                Livestock Marketplace
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link
              href="/"
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${
                isLinkActive('/')
                  ? 'text-emerald-800 bg-emerald-50'
                  : 'text-slate-600 hover:text-emerald-800 hover:bg-slate-50'
              }`}
            >
              <Home className="w-4 h-4" />
              Home
            </Link>

            <Link
              href="/animals"
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${
                isLinkActive('/animals')
                  ? 'text-emerald-800 bg-emerald-50'
                  : 'text-slate-600 hover:text-emerald-800 hover:bg-slate-50'
              }`}
            >
              <Compass className="w-4 h-4" />
              All Animals
            </Link>
          </div>

          {/* User Auth Controls */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  id="user-profile-menu-button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full border border-emerald-200 hover:border-emerald-300 bg-emerald-50/50 hover:bg-emerald-50 transition-all cursor-pointer text-left"
                  aria-expanded={dropdownOpen}
                >
                  <img
                    src={user.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'}
                    alt={user.name}
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-600/30"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-800 max-w-[110px] truncate leading-tight">
                      {user.name}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-medium">Verified User</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 animate__animated animate__fadeIn animate__faster z-50">
                    <div className="px-4 py-2 border-b border-slate-100 mb-1">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Signed in as</p>
                      <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>

                    <Link
                      href="/my-profile"
                      onClick={() => setDropdownOpen(false)}
                      className="w-full px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 flex items-center gap-2.5 transition-colors font-medium"
                    >
                      <UserIcon className="w-4 h-4 text-emerald-600" />
                      My Profile
                    </Link>

                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2.5 transition-colors font-medium mt-1 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-semibold text-emerald-800 hover:text-emerald-950 hover:bg-emerald-50 rounded-lg transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-sm shadow-emerald-900/10 transition-all hover:shadow"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            {isAuthenticated && user && (
              <Link href="/my-profile" className="flex items-center mr-1">
                <img
                  src={user.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-600/30"
                />
              </Link>
            )}
            <button
              type="button"
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-emerald-800 hover:bg-emerald-50 focus:outline-hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-emerald-100 px-4 pt-2 pb-6 space-y-2 animate__animated animate__fadeIn">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-lg text-base font-medium ${
              isLinkActive('/') ? 'text-emerald-800 bg-emerald-50 font-bold' : 'text-slate-700'
            }`}
          >
            Home
          </Link>

          <Link
            href="/animals"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-lg text-base font-medium ${
              isLinkActive('/animals') ? 'text-emerald-800 bg-emerald-50 font-bold' : 'text-slate-700'
            }`}
          >
            All Animals
          </Link>

          <div className="pt-3 border-t border-slate-100">
            {isAuthenticated && user ? (
              <div className="space-y-1">
                <div className="px-3 py-2 bg-emerald-50/70 rounded-lg mb-2">
                  <p className="text-xs text-slate-500">Signed in as</p>
                  <p className="text-sm font-bold text-slate-800">{user.name}</p>
                  <p className="text-xs text-slate-600 truncate">{user.email}</p>
                </div>
                <Link
                  href="/my-profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-emerald-50"
                >
                  My Profile
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center text-sm font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center text-sm font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
