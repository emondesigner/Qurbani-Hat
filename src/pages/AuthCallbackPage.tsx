import React, { useEffect, useState } from 'react';
import { useRouter } from '../lib/router-context';
import { useAuth } from '../lib/auth-context';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export function AuthCallbackPage() {
  const { navigate, searchParams } = useRouter();
  const { signInWithGoogle } = useAuth();
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  useEffect(() => {
    // 1. Check for query error parameters (e.g. ?error=redirect_uri_mismatch)
    const queryError = searchParams.get('error');
    const queryDesc = searchParams.get('error_description');

    // 2. Check for hash parameters (#access_token=... or #error=...)
    const hash = window.location.hash.startsWith('#') ? window.location.hash.substring(1) : window.location.hash;
    const hashParams = new URLSearchParams(hash);
    const hashError = hashParams.get('error');
    const hashDesc = hashParams.get('error_description');

    const errorParam = queryError || hashError;
    const errorDescription = queryDesc || hashDesc;

    if (errorParam) {
      const msg = errorDescription ? `${errorParam}: ${decodeURIComponent(errorDescription)}` : errorParam;
      setErrorDetails(msg);
      toast.error(`Google Authentication Error: ${errorParam}`);
      return;
    }

    const accessToken = hashParams.get('access_token');

    const finalizeAuth = async () => {
      if (!accessToken) {
        setErrorDetails(
          'No OAuth access token was returned by Google. Please check your Google Cloud Console Authorized redirect URI settings.'
        );
        return;
      }

      try {
        // Fetch real authenticated user details from Google UserInfo endpoint
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!res.ok) {
          const errText = await res.text();
          setErrorDetails(`Google UserInfo API error: ${res.status} ${res.statusText}`);
          return;
        }

        const profile = await res.json();
        if (!profile || !profile.email) {
          setErrorDetails('Google account did not return a valid email address.');
          return;
        }

        const success = await signInWithGoogle({
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          picture: profile.picture,
        });

        if (success) {
          navigate('/');
        } else {
          setErrorDetails('Failed to establish user session.');
        }
      } catch (err: unknown) {
        console.error('Callback error:', err);
        const message = err instanceof Error ? err.message : 'Unknown error';
        setErrorDetails(`Failed to finalize authentication with Google: ${message}`);
        toast.error('Failed to complete Google authentication.');
      }
    };

    finalizeAuth();
  }, [navigate, searchParams, signInWithGoogle]);

  if (errorDetails) {
    return (
      <div className="min-h-[70vh] bg-[#faf8f5] flex items-center justify-center py-12 px-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center space-y-5 border border-red-200 shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-serif text-slate-900">Authentication Failed</h2>
            <p className="text-xs text-red-600 mt-2 font-mono bg-red-50 p-2.5 rounded-xl border border-red-100 break-all">
              {errorDetails}
            </p>
          </div>
          <p className="text-xs text-slate-500">
            Ensure your Authorized redirect URI in Google Cloud Console is exactly:<br />
            <code className="text-emerald-900 font-bold bg-emerald-50 px-2 py-0.5 rounded">
              http://localhost:3000/api/auth/callback/google
            </code>
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="px-5 py-2.5 rounded-xl bg-emerald-900 text-white font-medium text-xs hover:bg-emerald-950 transition-colors shadow-md"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] bg-[#faf8f5] flex items-center justify-center py-12 px-4">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center space-y-4 border border-emerald-100 shadow-xl">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-800" />
        </div>
        <h2 className="text-xl font-bold font-serif text-slate-900">Verifying with Google</h2>
        <p className="text-xs text-slate-500">
          Connecting your Google Account to QurbaniHat. Please wait a moment...
        </p>
      </div>
    </div>
  );
}
