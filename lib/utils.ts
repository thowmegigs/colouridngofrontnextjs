import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function capitalize(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .split('_').join(' ') // Optional: remove underscores
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
export const  currency='₹'
export function formatDate(dateInput) {
  const date = new Date(dateInput); // Accepts ISO string or Date object
  const day = String(date.getDate()).padStart(2, '0');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}
export function addDays(date, days) {
  const result = new Date(date); // Create a new Date object
  result.setDate(result.getDate() + days);
  return result;
}
export function formatString(status) {
  return status
    .toLowerCase()
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
export function  isReturnWindowActive(deliveredAt,return_days) {
  if(!deliveredAt) return true
 const deliveryDate = new Date(deliveredAt);
  const now = new Date();

  const diffInTime = now.getTime() - deliveryDate.getTime();
  const diffInDays = diffInTime / (1000 * 60 * 60 * 24); // Convert ms to days

  return diffInDays <= return_days;
};
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
