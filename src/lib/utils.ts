import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalizeFirstLetter(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function formatIFSCCode(value: string): string {
  if (!value) return value;
  // Limit to 11 characters and format first 4 as uppercase, rest as uppercase too (standard IFSC format)
  const trimmed = value.slice(0, 11);
  return trimmed.toUpperCase();
}
