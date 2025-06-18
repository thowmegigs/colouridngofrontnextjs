import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function slugToNiceName(slug) {
  return slug
    .replace(/-/g, ' ')                 // Replace dashes with spaces
    .replace(/\b\w/g, char => char.toUpperCase()); // Capitalize each word
}
export function capitalizeWords(sentence:string) {
  return sentence
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
export function generateSlug(name:string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')     // remove invalid characters
    .replace(/\s+/g, '-')             // replace whitespace with hyphens
    .replace(/-+/g, '-');             // collapse multiple hyphens
}
export const  colorNameToHex=(colorName: string): string | null =>{
  const ctx = document.createElement('canvas').getContext('2d');
  if (!ctx) return null;

  ctx.fillStyle = colorName;
  const computed = ctx.fillStyle;

  // Ensure it's a string
  if (typeof computed !== 'string') return null;

  // Check if it's invalid
  if (computed === '' || computed === colorName) return null;

  if (computed.startsWith('rgb')) {
    const rgb = computed.match(/\d+/g)?.map(Number);
    if (!rgb || rgb.length < 3) return null;

    return (
      '#' +
      rgb
        .slice(0, 3)
        .map((val) => val.toString(16).padStart(2, '0'))
        .join('')
        .toLowerCase()
    );
  }

  // Already hex
  return computed.toLowerCase();
}
