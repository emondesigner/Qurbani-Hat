import Link from "next/link";
import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "gold" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "btn-primary",
  gold: "btn-gold",
  outline: "btn-outline",
  ghost: "btn-ghost",
  danger: "btn-danger",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "px-3.5 py-2 text-xs",
  md: "btn-md",
  lg: "btn-lg",
};

export interface ButtonProps {
  children: ReactNode;
  href?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
  title?: string;
}

/**
 * Single reusable button used across QurbaniHat.
 * Renders a <Link> when `href` is supplied, otherwise a native <button> with
 * accessible disabled + loading states.
 */
export function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  className,
  leftIcon,
  rightIcon,
  type = "button",
  disabled = false,
  onClick,
  ariaLabel,
  title,
}: ButtonProps) {
  const classes = cn(
    "btn",
    SIZE_CLASSES[size],
    VARIANT_CLASSES[variant],
    fullWidth && "w-full",
    className,
  );

  const content = (
    <>
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!loading && rightIcon}
    </>
  );

  if (href && !disabled && !loading) {
    return (
      <Link href={href} className={classes} aria-label={ariaLabel} title={title}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-busy={loading || undefined}
      title={title}
    >
      {content}
    </button>
  );
}