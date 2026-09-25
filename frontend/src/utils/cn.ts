import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility helper to safely join tailwind classes together, merging modifiers.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
