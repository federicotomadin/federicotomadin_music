import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Returns the full URL for a public asset (from /public folder).
 * Use this for images on GitHub Pages where base path is /repo-name/
 */
export function assetUrl(path: string): string {
  const base = import.meta.env.BASE_URL
  return `${base}${path.startsWith("/") ? path.slice(1) : path}`
}
