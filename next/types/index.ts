/**
 * Shared application types for QurbaniHat.
 */

export type AnimalType = "Cow" | "Goat";

export type AnimalCategory = "Large Animal" | "Medium Animal" | "Small Animal";

export interface Animal {
  id: number;
  name: string;
  type: AnimalType;
  breed: string;
  price: number;
  weight: number;
  age: number;
  location: string;
  description: string;
  image: string;
  category: AnimalCategory;
}

export interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export type BookingFormErrors = Partial<Record<keyof BookingFormData, string>>;

export type SortOrder = "default" | "price-asc" | "price-desc";

export interface BreedInfo {
  name: string;
  type: AnimalType;
  category: AnimalCategory;
  origin: string;
  highlights: string;
  image: string;
}

export interface QurbaniTip {
  title: string;
  description: string;
  icon: "heart" | "calendar" | "eye" | "wallet" | "clipboard" | "truck";
}

/** Type filter used on the All Animals page. */
export type TypeFilter = "All" | AnimalType;

/** Shape returned by the public `/api/animals` route handler. */
export interface AnimalsApiResponse {
  animals: Animal[];
  total: number;
}

/** Minimal, serialisable view of the Better Auth user used across the UI. */
export interface SessionUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  emailVerified?: boolean;
  createdAt?: Date | string;
}

export interface SessionBundle {
  user: SessionUser;
  session: {
    id: string;
    expiresAt: Date | string;
  };
}