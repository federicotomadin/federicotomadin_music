export interface MapLinks {
  google: string
  waze: string
  apple: string
}

export function mapLinks(place: string): MapLinks {
  const q = encodeURIComponent(place.trim())
  return {
    google: `https://www.google.com/maps/search/?api=1&query=${q}`,
    waze: `https://waze.com/ul?q=${q}&navigate=yes`,
    apple: `https://maps.apple.com/?q=${q}`,
  }
}

export function directionsPath(place: string): string {
  return `/como-llegar?lugar=${encodeURIComponent(place.trim())}`
}

export function directionsUrl(place: string): string {
  const origin = typeof window === "undefined" ? "https://federicotomadin.com" : window.location.origin
  const base = import.meta.env.BASE_URL.replace(/\/$/, "")
  return `${origin}${base}${directionsPath(place)}`
}
