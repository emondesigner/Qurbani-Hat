"use client";

import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";

import { authClient } from "@/lib/auth-client";
import type { SessionBundle, SessionUser } from "@/types";

interface SessionContextValue {
  user: SessionUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  refresh: () => Promise<void>;
}

const SessionContext = createContext<SessionContextValue | null>(null);

/**
 * Single source of truth for the session on the client.
 *
 * The server (app/layout.tsx -> getServerSession) supplies `initialSession` so
 * the very first render already knows whether a user is signed in — no navbar
 * "flash" of the logged-out state. Better Auth's reactive `useSession` hook then
 * keeps it in sync after login, logout and profile updates.
 */
export function SessionProvider({
  children,
  initialSession,
}: {
  children: ReactNode;
  initialSession: SessionBundle | null;
}) {
  const { data, isPending, refetch } = authClient.useSession();

  const session = (isPending && data === undefined ? initialSession : data) as
    | SessionBundle
    | null
    | undefined;

  const refresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const value = useMemo<SessionContextValue>(
    () => ({
      user: (session?.user as SessionUser | undefined) ?? null,
      isAuthenticated: Boolean(session?.user),
      isLoading: isPending && data === undefined,
      refresh,
    }),
    [session, isPending, data, refresh],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSessionBundle(): SessionContextValue {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSessionBundle must be used inside <SessionProvider>.");
  }
  return context;
}

/** Convenience hook for components that only need the signed-in user. */
export function useCurrentUser(): SessionUser | null {
  return useSessionBundle().user;
}
