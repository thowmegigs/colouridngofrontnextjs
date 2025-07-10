import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
export   function  getStatusColor(status: string)  {
    if (status.includes("Requested")) return "bg-red-700 text-white"
    if (status.includes("Approved")) return "bg-green-500 text-white"
    if (status.includes("Processing")) return "bg-purple-100 text-purple-800"
    if (status.includes("Completed")) return "bg-green-100 text-green-800"
    if (status.includes("Cancelled")) return "bg-red-100 text-red-800"
    if (status.includes("Rejected")) return "bg-red-100 text-red-800"
    return "bg-gray-100 text-gray-800"
  }
  export function  getRefundStatusColor(status: string){
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Paid":
        return "bg-green-100 text-green-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }
 
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

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
export function getImageName (url) {
  if (!url) return "";
  return url.substring(url.lastIndexOf("/") + 1);
};