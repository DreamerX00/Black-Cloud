import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tiny wrapper — merges Tailwind classes intelligently so
 * `cn("p-2", condition && "p-4")` collapses to a single `p-*` class.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
