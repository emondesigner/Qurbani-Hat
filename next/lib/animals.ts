import animalsData from "@/data/animals.json";
import type { Animal, BreedInfo, QurbaniTip } from "@/types";

/**
 * The livestock catalogue is a static JSON dataset for Assignment 8.
 * Booking submissions are never written to MongoDB or localStorage.
 */
export const animals: Animal[] = animalsData as Animal[];

export function getAllAnimals(): Animal[] {
  return [...animals];
}

export function getFeaturedAnimals(limit = 4): Animal[] {
  return animals.slice(0, limit);
}

export function getAnimalById(id: number | string): Animal | undefined {
  const numericId = typeof id === "number" ? id : Number.parseInt(id, 10);
  if (!Number.isFinite(numericId)) return undefined;
  return animals.find((animal) => animal.id === numericId);
}

export function getAllAnimalIds(): number[] {
  return animals.map((animal) => animal.id);
}

export function getAnimalsByType(animalsList: Animal[], type: "Cow" | "Goat" | "All") {
  if (type === "All") return animalsList;
  return animalsList.filter((animal) => animal.type === type);
}

export function sortAnimalsByPrice(animalsList: Animal[], order: "default" | "price-asc" | "price-desc") {
  if (order === "price-asc") return [...animalsList].sort((a, b) => a.price - b.price);
  if (order === "price-desc") return [...animalsList].sort((a, b) => b.price - a.price);
  return animalsList;
}

export const HEALTH_INDICATORS = [
  "Veterinary fitness certificate issued within the last 14 days",
  "Bright eyes, moist muzzle and alert, responsive behaviour",
  "Smooth shiny coat with no wounds, swelling or parasites",
  "Up to date on deworming and FMD / BQ vaccination",
];

export const QURBANI_SUITABILITY = [
  "Meets the Shariah age requirement (two teeth for goats, two years for cattle)",
  "Free from any physical defect that would invalidate the sacrifice",
  "Naturally fattened with organic fodder — no growth hormones used",
  "Ready for a shared seven share cattle sacrifice where the weight allows",
];

export const qurbaniTips: QurbaniTip[] = [
  {
    title: "Choose a Healthy Animal",
    description:
      "Pick livestock with bright eyes, an alert posture, a moist muzzle and a smooth coat. Healthy animals are calm, eat well and respond to their surroundings.",
    icon: "heart",
  },
  {
    title: "Verify the Age",
    description:
      "Goats must be at least one year old and cattle at least two years old. Check the front teeth — a two-tooth animal satisfies the Shariah requirement for cattle.",
    icon: "calendar",
  },
  {
    title: "Inspect Physical Condition",
    description:
      "Walk the animal briefly. Reject any animal that is lame, visibly injured, extremely thin, or missing an ear, tail or horn beyond the permitted limits.",
    icon: "eye",
  },
  {
    title: "Understand the Pricing",
    description:
      "Price follows live weight, breed, age and location. Compare price per kilogram before booking so you can recognise a fair, transparent offer.",
    icon: "wallet",
  },
  {
    title: "Prepare Before Eid Day",
    description:
      "Arrange the slaughter area, sharp knives, clean water, rope and a covering sheet ahead of time. Confirm the butcher and share distribution plan early.",
    icon: "clipboard",
  },
  {
    title: "Transport Safely",
    description:
      "Use a padded, well ventilated vehicle with a ramp and enough headroom. Avoid long journeys in peak heat and never leave animals tied without shade or water.",
    icon: "truck",
  },
];

export const topBreeds: BreedInfo[] = [
  {
    name: "Deshi Cow",
    type: "Cow",
    category: "Large Animal",
    origin: "Bogura, Munshiganj",
    highlights: "Grass fed native cattle with lean, aromatic meat and a very calm nature.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Eid_al-Adha_cattle_market_in_Bangladesh_109.jpg/1280px-Eid_al-Adha_cattle_market_in_Bangladesh_109.jpg",
  },
  {
    name: "Red Chittagong",
    type: "Cow",
    category: "Large Animal",
    origin: "Chattogram Hill Tracts",
    highlights: "Dense muscle, deep red coat and outstanding meat quality in a compact frame.",
    image: "https://upload.wikimedia.org/wikipedia/commons/d/d8/Red_Chittagong_cattle%2C_Bangladesh_%281%29.jpg",
  },
  {
    name: "Sahiwal",
    type: "Cow",
    category: "Large Animal",
    origin: "Sirajganj, Pabna",
    highlights: "Prominent hump, disease resistance and a superb meat to bone ratio.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Sahiwala_01.JPG/1280px-Sahiwala_01.JPG",
  },
  {
    name: "Black Bengal Goat",
    type: "Goat",
    category: "Small Animal",
    origin: "Kushtia, Rajshahi",
    highlights: "The finest goat meat in Bangladesh — compact, tender and full of flavour.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Black_Bengal_goat_image.jpg/1280px-Black_Bengal_goat_image.jpg",
  },
  {
    name: "Jamunapari",
    type: "Goat",
    category: "Medium Animal",
    origin: "Rajshahi, Chapainawabganj",
    highlights: "Tall and regal with long drooping ears, a favourite for large Eid gatherings.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Goat_Jamnapari.jpg/1280px-Goat_Jamnapari.jpg",
  },
  {
    name: "Brahman",
    type: "Cow",
    category: "Large Animal",
    origin: "Savar, Gazipur farms",
    highlights: "Heavyweight silver coated bull suited to a seven share family sacrifice.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Brahman_cattle_SB013.jpg/1280px-Brahman_cattle_SB013.jpg",
  },
];