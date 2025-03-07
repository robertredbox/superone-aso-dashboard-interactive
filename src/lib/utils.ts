import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat().format(value);
}

export function formatPercentage(value: number): string {
  return new Intl.NumberFormat(undefined, {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
}

export function getYTDDateRange() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  return { start: startOfYear, end: now };
}

export function getRandomDateData(days: number, min: number, max: number) {
  const data = [];
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    data.push({
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      value: Math.floor(Math.random() * (max - min + 1)) + min,
    });
  }
  
  return data;
}
