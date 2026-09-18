import type { BookingFormErrors, BookingFormData } from "@/types";

export const MIN_PASSWORD_LENGTH = 6;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
const PHONE_PATTERN = /^(?:\+?880|0)1[3-9]\d{8}$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

export function validatePassword(password: string): string | undefined {
  if (!password) return "Password is required.";
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`;
  }
  return undefined;
}

export function validateName(name: string): string | undefined {
  const value = name.trim();
  if (!value) return "Full name is required.";
  if (value.length < 3) return "Please enter at least 3 characters.";
  return undefined;
}

export function validatePhone(phone: string): string | undefined {
  const value = phone.replace(/[\s-]/g, "");
  if (!value) return "Phone number is required.";
  if (!PHONE_PATTERN.test(value)) {
    return "Enter a valid Bangladeshi mobile number, e.g. 01712345678.";
  }
  return undefined;
}

export function validateImageUrl(url: string): string | undefined {
  const value = url.trim();
  if (!value) return "Image URL is required.";
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return "Image URL must start with http:// or https://";
    }
  } catch {
    return "Enter a valid image URL (https://...).";
  }
  return undefined;
}

export interface AuthFormErrors {
  name?: string;
  email?: string;
  password?: string;
  image?: string;
}

export function validateLoginForm(values: { email: string; password: string }): AuthFormErrors {
  const errors: AuthFormErrors = {};
  if (!values.email.trim()) errors.email = "Email is required.";
  else if (!isValidEmail(values.email)) errors.email = "Enter a valid email address.";
  if (!values.password) errors.password = "Password is required.";
  return errors;
}

export function validateRegisterForm(values: {
  name: string;
  email: string;
  image: string;
  password: string;
}): AuthFormErrors {
  const errors: AuthFormErrors = {};
  const nameError = validateName(values.name);
  if (nameError) errors.name = nameError;
  if (!values.email.trim()) errors.email = "Email is required.";
  else if (!isValidEmail(values.email)) errors.email = "Enter a valid email address.";
  const passwordError = validatePassword(values.password);
  if (passwordError) errors.password = passwordError;
  if (values.image.trim()) {
    const imageError = validateImageUrl(values.image);
    if (imageError) errors.image = imageError;
  }
  return errors;
}

export function validateBookingForm(values: BookingFormData): BookingFormErrors {
  const errors: BookingFormErrors = {};

  const nameError = validateName(values.name);
  if (nameError) errors.name = nameError;

  if (!values.email.trim()) errors.email = "Email is required.";
  else if (!isValidEmail(values.email)) errors.email = "Enter a valid email address.";

  const phoneError = validatePhone(values.phone);
  if (phoneError) errors.phone = phoneError;

  if (!values.address.trim()) errors.address = "Delivery address is required.";
  else if (values.address.trim().length < 10) {
    errors.address = "Please provide a fuller address (at least 10 characters).";
  }

  return errors;
}

/** True when at least one field of an error object is populated. */
export function hasErrors<T extends object>(errors: T): boolean {
  return Object.values(errors).some(Boolean);
}
