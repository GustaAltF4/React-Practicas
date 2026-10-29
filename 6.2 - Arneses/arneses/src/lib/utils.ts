import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Asegura que las imágenes locales siempre tengan la barra inicial '/'
 * para que no fallen con 404 al navegar en subrutas de React Router (ej: /categoria/pecho).
 */
export function normalizarImagenUrl(url: string | undefined | null): string {
  if (!url) return ""
  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("data:") ||
    url.startsWith("/")
  ) {
    return url
  }
  return `/${url}`
}
