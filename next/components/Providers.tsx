"use client";

import { Toaster } from "sonner";

import { SessionProvider } from "@/components/SessionProvider";
import type { SessionBundle } from "@/types";

/**
 * Client-side providers mounted once in the root layout:
 * the Better Auth session context and the Sonner toast portal.
 */
export function Providers({
  children,
  initialSession,
}: {
  children: React.ReactNode;
  initialSession: SessionBundle | null;
}) {
  return (
    <SessionProvider initialSession={initialSession}>
      {children}
      <Toaster
        position="top-center"
        richColors
        closeButton
        duration={3500}
        toastOptions={{
          classNames: {
            toast: "font-sans rounded-xl",
          },
        }}
      />
    </SessionProvider>
  );
}
