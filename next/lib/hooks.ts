"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

/**
 * Honours the operating system "reduce motion" accessibility setting.
 *
 * Implemented with `useSyncExternalStore` so the value is read from the real
 * matchMedia object (no setState inside an effect) while staying SSR safe: the
 * server snapshot is `false`, and React re-renders with the real value once the
 * component hydrates.
 */
function subscribeToReducedMotion(onChange: () => void) {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};

  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getReducedMotionSnapshot() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    () => false,
  );
}

/**
 * Fires once when the element scrolls into view — the trigger for the
 * React Spring reveal animations.
 *
 * The initial value is `false` on both the server and the first client render
 * (so there is never a hydration mismatch). Browsers without
 * IntersectionObserver are handled by revealing on the next animation frame,
 * which keeps setState out of the effect body itself.
 */
export function useOnScreen<T extends HTMLElement>(rootMargin = "0px 0px -10% 0px") {
  const ref = useRef<T | null>(null);
  const [isOnScreen, setIsOnScreen] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      const frame = requestAnimationFrame(() => setIsOnScreen(true));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsOnScreen(true);
            observer.disconnect();
            return;
          }
        }
      },
      { rootMargin, threshold: 0.12 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin]);

  return { ref, isOnScreen };
}