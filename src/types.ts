export interface Animal {
  id: number;
  name: string;
  type: 'Cow' | 'Goat';
  breed: string;
  price: number;
  weight: number;
  age: number;
  location: string;
  description: string;
  image: string;
  category: 'Large Animal' | 'Medium Animal' | 'Small Animal';
}

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  createdAt?: string;
}

export interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface BookingFormErrors {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export type SortOrder = 'none' | 'price-asc' | 'price-desc';
