export interface Event {
  id: string
  title: string
  date: string
  location: string
  description?: string
  image: string
  ticketUrl?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  order?: number
}

export interface MusicTrack {
  id: string
  title: string
  artist: string
  album?: string
  url: string
  coverImage?: string
  duration?: string
  isActive: boolean
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface GalleryImage {
  id: string
  url: string
  alt?: string
  caption?: string
  order: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface SiteSettings {
  id: string
  bio?: string
  spotifyUrl?: string
  spotifyTornasoladoUrl?: string
  spotifyAlbum2Url?: string
  album2Title?: string
  album2Cover?: string
  album2Description?: string
  album2Credits?: string
  youtubeUrl?: string
  appleMusicUrl?: string
  instagramUrl?: string
  facebookUrl?: string
  contactEmail?: string
  updatedAt: Date
}

export type EventFormData = Omit<Event, "id" | "createdAt" | "updatedAt">
export type MusicTrackFormData = Omit<MusicTrack, "id" | "createdAt" | "updatedAt">
export type GalleryImageFormData = Omit<GalleryImage, "id" | "createdAt" | "updatedAt">
