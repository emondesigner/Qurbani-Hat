import { AlertCircle } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}

/** Label + control + inline validation message, wired up for screen readers. */
export function FormField({
  id,
  label,
  error,
  hint,
  required,
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={cn("w-full", className)}>
      <label htmlFor={id} className="field-label">
        {label}
        {required && (
          <span className="ml-0.5 text-red-500" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      {error ? (
        <p className="field-error" id={`${id}-error`} role="alert">
          <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-ink-soft" id={`${id}-hint`}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export type InputProps = ComponentProps<"input"> & { invalid?: boolean };

export function Input({ invalid = false, className, ...props }: InputProps) {
  return (
    <input
      {...props}
      aria-invalid={invalid || undefined}
      aria-describedby={invalid ? `${props.id}-error` : props["aria-describedby"]}
      className={cn("field-input", invalid && "border-red-400 focus:border-red-500 focus:ring-red-100", className)}
    />
  );
}

export type TextareaProps = ComponentProps<"textarea"> & { invalid?: boolean };

export function Textarea({ invalid = false, className, ...props }: TextareaProps) {
  return (
    <textarea
      {...props}
      aria-invalid={invalid || undefined}
      aria-describedby={invalid ? `${props.id}-error` : props["aria-describedby"]}
      className={cn(
        "field-input min-h-[104px] resize-y",
        invalid && "border-red-400 focus:border-red-500 focus:ring-red-100",
        className,
      )}
    />
  );
}

export type SelectProps = ComponentProps<"select">;

export function Select({ className, children, ...props }: SelectProps) {
  return (
    <select {...props} className={cn("field-input cursor-pointer pr-9", className)}>
      {children}
    </select>
  );
}