import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount)
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + "..."
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

export function getDiscountPercentage(originalPrice: number, currentPrice: number): number {
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
}
const baseColors: Record<string, string[]> = {
  red: ['#f87171', '#ef4444', '#dc2626'],
  blue: ['#60a5fa', '#3b82f6', '#2563eb'],
  green: ['#4ade80', '#22c55e', '#16a34a'],
  yellow: ['#fde047', '#facc15', '#eab308'],
  purple: ['#c084fc', '#a855f7', '#9333ea'],
};
export const getRandomHexColor = () => {
  const colorFamilies = Object.keys(baseColors);
  const randomFamily = colorFamilies[Math.floor(Math.random() * colorFamilies.length)];
  const shades = baseColors[randomFamily];
  const randomHex = shades[Math.floor(Math.random() * shades.length)];
  return randomHex;
};

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

