import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signInWithEmail: (email: string, password: string) => Promise<boolean>;
  signUpWithEmail: (data: { name: string; email: string; image?: string; password: string }) => Promise<boolean>;
  signInWithGoogle: (googleProfile?: { id?: string; name?: string; email?: string; picture?: string }) => Promise<boolean>;
  initiateGoogleOAuth: () => Promise<boolean>;
  updateProfile: (data: { name: string; image: string }) => Promise<boolean>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const SESSION_STORAGE_KEY = 'qurbanihat_auth_session';
const USERS_STORE_KEY = 'qurbanihat_registered_users';

interface StoredUserAccount extends User {
  password?: string;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize session from storage, handle OAuth server redirect, and listen for popup messages
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SESSION_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      }

      // Check if redirected back with a Google authenticated session payload (in case of direct redirect)
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('google_auth_success') === '1') {
        const sessionPayload = urlParams.get('session');
        if (sessionPayload) {
          try {
            const rawDecoded = atob(decodeURIComponent(sessionPayload));
            const userObj = JSON.parse(rawDecoded);
            if (userObj && userObj.email) {
              setUser(userObj);
              localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(userObj));

              // Persist in registered users list
              const usersJson = localStorage.getItem(USERS_STORE_KEY);
              const registeredUsers: StoredUserAccount[] = usersJson ? JSON.parse(usersJson) : [];
              const existingIdx = registeredUsers.findIndex((u) => u.email === userObj.email);
              if (existingIdx === -1) {
                registeredUsers.push(userObj);
              } else {
                registeredUsers[existingIdx].name = userObj.name;
                if (userObj.image) registeredUsers[existingIdx].image = userObj.image;
              }
              localStorage.setItem(USERS_STORE_KEY, JSON.stringify(registeredUsers));

              toast.success(`Signed in with Google as ${userObj.name}!`);
            }
          } catch (decodeErr) {
            console.error('Failed to parse Google OAuth session payload', decodeErr);
          }
        }
        // Remove OAuth search parameters from URL cleanly
        const cleanPath = window.location.pathname;
        window.history.replaceState({}, document.title, cleanPath);
      }
    } catch (e) {
      console.error('Failed to load session', e);
    } finally {
      setIsLoading(false);
    }

    // Listen for OAuth popup completion messages (Cross-origin popup flow)
    const handleOAuthMessage = (event: MessageEvent) => {
      // Validate origin is from localhost or Cloud Run deployment
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost') && !origin.includes('127.0.0.1')) {
        return;
      }

      if (event.data?.type === 'OAUTH_AUTH_SUCCESS' && event.data.session) {
        const userObj = event.data.session;
        setUser(userObj);
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(userObj));

        // Persist in registered users list
        const usersJson = localStorage.getItem(USERS_STORE_KEY);
        const registeredUsers: StoredUserAccount[] = usersJson ? JSON.parse(usersJson) : [];
        const existingIdx = registeredUsers.findIndex((u) => u.email === userObj.email);
        if (existingIdx === -1) {
          registeredUsers.push(userObj);
        } else {
          registeredUsers[existingIdx].name = userObj.name;
          if (userObj.image) registeredUsers[existingIdx].image = userObj.image;
        }
        localStorage.setItem(USERS_STORE_KEY, JSON.stringify(registeredUsers));

        toast.success(`Signed in with Google as ${userObj.name}!`);
      } else if (event.data?.type === 'OAUTH_AUTH_ERROR') {
        toast.error(`Google Authentication Error: ${event.data.error || 'Failed'}`);
      }
    };

    window.addEventListener('message', handleOAuthMessage);
    return () => window.removeEventListener('message', handleOAuthMessage);
  }, []);

  // Helper to persist user session
  const saveSession = (userData: User | null) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(userData));
    } else {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  };

  const signInWithEmail = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 650)); // simulate auth network latency

    try {
      const usersJson = localStorage.getItem(USERS_STORE_KEY);
      const registeredUsers: StoredUserAccount[] = usersJson ? JSON.parse(usersJson) : [];

      const found = registeredUsers.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
      );

      if (found) {
        const sessionUser: User = {
          id: found.id,
          name: found.name,
          email: found.email,
          image: found.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        };
        saveSession(sessionUser);
        toast.success(`Welcome back, ${sessionUser.name}!`);
        setIsLoading(false);
        return true;
      }

      // No fake auto-creation or demo login: credentials must match a registered user
      toast.error('Invalid email or password. Please verify your credentials or register an account.');
      setIsLoading(false);
      return false;
    } catch (err) {
      toast.error('Authentication failed. Please try again.');
      setIsLoading(false);
      return false;
    }
  };

  const signUpWithEmail = async (data: {
    name: string;
    email: string;
    image?: string;
    password: string;
  }): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 650));

    try {
      const usersJson = localStorage.getItem(USERS_STORE_KEY);
      const registeredUsers: StoredUserAccount[] = usersJson ? JSON.parse(usersJson) : [];

      const existing = registeredUsers.find(
        (u) => u.email.toLowerCase() === data.email.trim().toLowerCase()
      );

      if (existing) {
        toast.error('An account with this email already exists. Please log in.');
        setIsLoading(false);
        return false;
      }

      const defaultAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
      const newUser: StoredUserAccount = {
        id: 'usr_' + Date.now(),
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        image: data.image && data.image.trim() ? data.image.trim() : defaultAvatar,
        password: data.password,
        createdAt: new Date().toISOString(),
      };

      registeredUsers.push(newUser);
      localStorage.setItem(USERS_STORE_KEY, JSON.stringify(registeredUsers));

      toast.success('Account created successfully! Please log in with your credentials.');
      setIsLoading(false);
      return true;
    } catch (err) {
      toast.error('Registration failed. Please check your information.');
      setIsLoading(false);
      return false;
    }
  };

  const signInWithGoogle = async (googleProfile?: { id?: string; name?: string; email?: string; picture?: string }): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 300));

    try {
      if (!googleProfile || !googleProfile.email) {
        toast.error('Google profile data is missing. Real authentication could not be completed.');
        setIsLoading(false);
        return false;
      }

      const googleUser: User = {
        id: googleProfile.id ? `google_${googleProfile.id}` : `google_${Date.now()}`,
        name: googleProfile.name || googleProfile.email.split('@')[0],
        email: googleProfile.email.trim().toLowerCase(),
        image: googleProfile.picture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        createdAt: new Date().toISOString(),
      };

      // Save to registered users if not existing
      const usersJson = localStorage.getItem(USERS_STORE_KEY);
      const registeredUsers: StoredUserAccount[] = usersJson ? JSON.parse(usersJson) : [];
      const existingIdx = registeredUsers.findIndex((u) => u.email === googleUser.email);
      if (existingIdx === -1) {
        registeredUsers.push(googleUser);
      } else {
        registeredUsers[existingIdx].name = googleUser.name;
        if (googleUser.image) registeredUsers[existingIdx].image = googleUser.image;
      }
      localStorage.setItem(USERS_STORE_KEY, JSON.stringify(registeredUsers));

      saveSession(googleUser);
      toast.success(`Successfully signed in as ${googleUser.name}!`);
      setIsLoading(false);
      return true;
    } catch (err) {
      toast.error('Google authentication failed. Please try again.');
      setIsLoading(false);
      return false;
    }
  };

  const initiateGoogleOAuth = async (): Promise<boolean> => {
    try {
      const origin = window.location.origin;
      const res = await fetch(`/api/auth/google/url?origin=${encodeURIComponent(origin)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          // Open the Google authorization URL directly in a popup window.
          // Note: In an iframe environment (like AI Studio preview), navigating window.location.assign
          // causes Google to return a 403 ("You do not have access to this document") because Google
          // explicitly forbids rendering its accounts login page inside third-party iframes.
          const width = 520;
          const height = 660;
          const left = window.screenX + Math.max(0, (window.outerWidth - width) / 2);
          const top = window.screenY + Math.max(0, (window.outerHeight - height) / 2);

          const popup = window.open(
            data.url,
            'google_oauth_popup',
            `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes,status=yes`
          );

          if (!popup || popup.closed || typeof popup.closed === 'undefined') {
            // Popup was blocked by browser, open in new tab
            window.open(data.url, '_blank');
          }
          return true;
        }
      }

      // If server returned an error (e.g. credentials not set)
      const errJson = await res.json().catch(() => ({}));
      const msg = errJson.error || 'Google Client ID is not configured. Please add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to your .env.local file.';
      toast.error(msg, { duration: 6000 });
      return false;
    } catch (e) {
      console.error('Failed to initiate Google OAuth:', e);
      toast.error('Unable to initiate Google OAuth. Please check server configuration.');
      return false;
    }
  };

  const updateProfile = async (data: { name: string; image: string }): Promise<boolean> => {
    if (!user) {
      toast.error('You must be signed in to update your profile.');
      return false;
    }

    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    try {
      // Better Auth updateUser implementation
      const updatedUser: User = {
        ...user,
        name: data.name.trim(),
        image: data.image.trim(),
      };

      saveSession(updatedUser);

      // Also update in registered users store if present
      const usersJson = localStorage.getItem(USERS_STORE_KEY);
      if (usersJson) {
        const registeredUsers: StoredUserAccount[] = JSON.parse(usersJson);
        const idx = registeredUsers.findIndex((u) => u.email === user.email);
        if (idx !== -1) {
          registeredUsers[idx].name = updatedUser.name;
          registeredUsers[idx].image = updatedUser.image;
          localStorage.setItem(USERS_STORE_KEY, JSON.stringify(registeredUsers));
        }
      }

      toast.success('Profile updated successfully!');
      setIsLoading(false);
      return true;
    } catch (err) {
      toast.error('Failed to update profile.');
      setIsLoading(false);
      return false;
    }
  };

  const signOut = async (): Promise<void> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 300));
    saveSession(null);
    toast.success('Signed out successfully.');
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        initiateGoogleOAuth,
        updateProfile,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
