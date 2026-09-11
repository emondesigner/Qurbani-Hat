import animalsData from '../../data/animals.json';
import { Animal } from '../types';

export const animals: Animal[] = animalsData as Animal[];

export function getAllAnimals(): Animal[] {
  return [...animals];
}

export function getFeaturedAnimals(): Animal[] {
  // Requirement: exactly 4 featured animals from the JSON data
  return animals.slice(0, 4);
}

export function getAnimalById(id: number | string): Animal | undefined {
  const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
  if (isNaN(numericId)) return undefined;
  return animals.find(a => a.id === numericId);
}

export function formatBDT(amount: number): string {
  return `৳${amount.toLocaleString('en-US')}`;
}

export interface BreedInfo {
  name: string;
  type: 'Cow' | 'Goat';
  origin: string;
  features: string;
  image: string;
}

export const topBreedsList: BreedInfo[] = [
  {
    name: 'Deshi Shahi',
    type: 'Cow',
    origin: 'Northern Bangladesh',
    features: 'Naturally pastured, lean organic meat, calm disposition',
    image: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Red Chittagong',
    type: 'Cow',
    origin: 'Chittagong Region',
    features: 'Rich reddish coat, dense muscle marbling, sturdy build',
    image: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Black Bengal',
    type: 'Goat',
    origin: 'Western Bengal / Kushtia',
    features: 'Celebrated worldwide for exceptionally sweet, tender meat',
    image: 'https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Sahiwal',
    type: 'Cow',
    origin: 'Indo-Pak Subcontinent',
    features: 'Pronounced hump, high yield, disease-resistant lineage',
    image: 'https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Jamunapari',
    type: 'Goat',
    origin: 'Yamuna River Valleys',
    features: 'Long drooping ears, regal stature, prized sacrificial choice',
    image: 'https://images.unsplash.com/photo-1535083783855-76ae62b2914e?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Brahman Cross',
    type: 'Cow',
    origin: 'Subcontinental Adaptations',
    features: 'Colossal frame (500kg+), prime choice for 7-share Qurbani',
    image: 'https://images.unsplash.com/photo-1596733430284-f7437764b1a9?auto=format&fit=crop&w=600&q=80'
  }
];
