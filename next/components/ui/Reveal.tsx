"use client";

import { animated, useSpring } from "@react-spring/web";
import type { ReactNode } from "react";

import { useOnScreen, usePrefersReducedMotion } from "@/lib/hooks";

/**
 * React Spring scroll-reveal wrapper (Assignment requirement: use React Spring
 * meaningfully for hero, section and card entrance animations).
 *
 * - The element renders at opacity 0 on the server and on the first client
 *   paint, so there is never a hydration mismatch.
 * - Users with "reduce motion" enabled get the final state immediately.
 */
export function Reveal({
  children,
  delay = 0,
  offset = 24,
  className,
}: {
  children: ReactNode;
  delay?: number;
  offset?: number;
  className?: string;
}) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const { ref, isOnScreen } = useOnScreen<HTMLDivElement>();

  const visible = isOnScreen || prefersReducedMotion;

  const styles = useSpring({
    opacity: visible ? 1 : 0,
    transform: visible ? "translate3d(0, 0, 0)" : `translate3d(0, ${offset}px, 0)`,
    delay: prefersReducedMotion ? 0 : delay,
    immediate: prefersReducedMotion,
    config: { tension: 210, friction: 26 },
  });

  return (
    <animated.div ref={ref} style={styles} className={className}>
      {children}
    </animated.div>
  );
}