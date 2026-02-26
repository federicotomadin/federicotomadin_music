import { createContext, useContext, useEffect, useState, ReactNode, Dispatch, SetStateAction } from "react"
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  getDocs,
  Timestamp,
} from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { db, storage } from "@/lib/firebase"
import { uploadToCloudinary, isCloudinaryConfigured } from "@/lib/cloudinary"
import {
  Event,
  MusicTrack,
  GalleryImage,
  SiteSettings,
  EventFormData,
  MusicTrackFormData,
  GalleryImageFormData,
} from "@/types"

const defaultEvents: Event[] = []
const defaultMusicTracks: MusicTrack[] = []
const defaultGalleryImages: GalleryImage[] = []
const defaultSettings: SiteSettings = {
  id: "settings",
  bio: "Músico - Baterista - Compositor. Jazz moderno con raíces folclóricas sutilmente evocadas.\n\nBaterista y compositor, nacido en Santa Fe, Argentina, en el año de 1986. Se formó en el instrumento con el baterista y percusionista Gonzalo Díaz en la ciudad de Santa Fe por el lapso de dos años. Tomó clases con Germán Boco, Pipi Piazzolla, Pablo Raposo, Carlos Lastra, Eloy Michelini y Jerónimo Carmona. Se desempeña artísticamente como baterista en diferentes formaciones de jazz local como de proyectos de música original. Lleva adelante actualmente el Federico Tomadin Grupo, en el que participan Joaquín Sombielle (piano), Pablo Giordano (contrabajo), Camila Nebbia (saxo tenor) y César Rizzardi (guitarra). En el año 2018 la formación ganó el concurso \"Primera Toma\" para presentar su primer disco en el Festival Internacional de Jazz de Buenos Aires.\n\nActualmente su nuevo grupo en formación, quinteto, está compuesto por Pablo Juárez (piano), Pablo Giordano (contrabajo), Martín Portella (saxo tenor) y Ramiro Barrios (guitarra).",
  spotifyUrl: "",
  spotifyUrl: "https://open.spotify.com/album/2NkIuRArBsXOwizsVAYyFZ",
  spotifyTornasoladoUrl: "https://open.spotify.com/album/2NkIuRArBsXOwizsVAYyFZ",
  spotifyAlbum2Url: "https://open.spotify.com/album/0kgbLosxkFlzjfz6SPZYkW",
  album2Title: "Straight Street",
  album2Cover: "",
  album2Description: "Standards de jazz. Federico Tomadin en batería.",
  album2Credits: "Yago Agüero - Guitarra y dirección, Benjamin Groisman - Contrabajo, Ramiro Sayas - Piano",
  youtubeUrl: "https://www.youtube.com/@federicotomadin5130",
  appleMusicUrl: "https://music.apple.com/us/artist/federico-tomadin/1425849281",
  instagramUrl: "https://www.instagram.com/federicotomadin2/",
  facebookUrl: "https://www.facebook.com/federico.tomadin",
  contactEmail: "",
  updatedAt: new Date(),
}

interface DataContextType {
  events: Event[]
  musicTracks: MusicTrack[]
  galleryImages: GalleryImage[]
  settings: SiteSettings
  loading: boolean
  useLocalStorage: boolean

  addEvent: (data: EventFormData) => Promise<void>
  updateEvent: (id: string, data: Partial<EventFormData>) => Promise<void>
  deleteEvent: (id: string) => Promise<void>
  addMusicTrack: (data: MusicTrackFormData) => Promise<void>
  updateMusicTrack: (id: string, data: Partial<MusicTrackFormData>) => Promise<void>
  deleteMusicTrack: (id: string) => Promise<void>
  addGalleryImage: (data: GalleryImageFormData) => Promise<void>
  updateGalleryImage: (id: string, data: Partial<GalleryImageFormData>) => Promise<void>
  deleteGalleryImage: (id: string) => Promise<void>
  updateSettings: (data: Partial<SiteSettings>) => Promise<void>
  uploadImage: (file: File, folder: string) => Promise<string>
  uploadAudio: (file: File, folder: string) => Promise<string>
}

const DataContext = createContext<DataContextType | undefined>(undefined)

const isFirebaseConfigured = () => {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY
  return apiKey && apiKey !== "your-api-key"
}

const STORAGE_KEYS = {
  events: "ft_music_events",
  musicTracks: "ft_music_tracks",
  galleryImages: "ft_music_gallery",
  settings: "ft_music_settings",
}

const loadFromLocalStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key)
    if (stored) return JSON.parse(stored) as T
  } catch {}
  return defaultValue
}

const saveToLocalStorage = <T,>(key: string, data: T) => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch {}
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>([])
  const [musicTracks, setMusicTracks] = useState<MusicTrack[]>([])
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [useLocalStorage, setUseLocalStorage] = useState(!isFirebaseConfigured())

  useEffect(() => {
    if (useLocalStorage) {
      setEvents(loadFromLocalStorage(STORAGE_KEYS.events, defaultEvents))
      setMusicTracks(loadFromLocalStorage(STORAGE_KEYS.musicTracks, defaultMusicTracks))
      setGalleryImages(loadFromLocalStorage(STORAGE_KEYS.galleryImages, defaultGalleryImages))
      setSettings(loadFromLocalStorage(STORAGE_KEYS.settings, defaultSettings))
      setLoading(false)
    } else {
      const unsubscribers: (() => void)[] = []

      unsubscribers.push(
        onSnapshot(collection(db, "events"), (snapshot) => {
          setEvents(
            snapshot.docs.map((d) => ({
              id: d.id,
              ...d.data(),
              createdAt: (d.data().createdAt as { toDate?: () => Date })?.toDate?.() || new Date(),
              updatedAt: (d.data().updatedAt as { toDate?: () => Date })?.toDate?.() || new Date(),
            })) as Event[]
          )
        }, (err) => {
          console.error("Error events:", err)
          setUseLocalStorage(true)
          setEvents(loadFromLocalStorage(STORAGE_KEYS.events, defaultEvents))
        })
      )
      unsubscribers.push(
        onSnapshot(collection(db, "musicTracks"), (snapshot) => {
          setMusicTracks(
            snapshot.docs.map((d) => ({
              id: d.id,
              ...d.data(),
              createdAt: (d.data().createdAt as { toDate?: () => Date })?.toDate?.() || new Date(),
              updatedAt: (d.data().updatedAt as { toDate?: () => Date })?.toDate?.() || new Date(),
            })) as MusicTrack[]
          )
        }, (err) => {
          console.error("Error musicTracks:", err)
          setUseLocalStorage(true)
          setMusicTracks(loadFromLocalStorage(STORAGE_KEYS.musicTracks, defaultMusicTracks))
        })
      )
      unsubscribers.push(
        onSnapshot(collection(db, "galleryImages"), (snapshot) => {
          setGalleryImages(
            snapshot.docs.map((d) => ({
              id: d.id,
              ...d.data(),
              createdAt: (d.data().createdAt as { toDate?: () => Date })?.toDate?.() || new Date(),
              updatedAt: (d.data().updatedAt as { toDate?: () => Date })?.toDate?.() || new Date(),
            })) as GalleryImage[]
          )
        }, (err) => {
          console.error("Error galleryImages:", err)
          setUseLocalStorage(true)
          setGalleryImages(loadFromLocalStorage(STORAGE_KEYS.galleryImages, defaultGalleryImages))
        })
      )
      unsubscribers.push(
        onSnapshot(collection(db, "settings"), (snapshot) => {
          const doc = snapshot.docs[0]
          if (doc) {
            const data = doc.data()
            setSettings({
              id: doc.id,
              ...data,
              updatedAt: data.updatedAt?.toDate?.() || new Date(),
            } as SiteSettings)
          }
        }, (err) => {
          console.error("Error settings:", err)
          setSettings(loadFromLocalStorage(STORAGE_KEYS.settings, defaultSettings))
        })
      )

      setTimeout(() => setLoading(false), 500)
      return () => unsubscribers.forEach((u) => u())
    }
  }, [useLocalStorage])

  const createItem = async <T extends { id?: string }>(
    col: string,
    key: string,
    data: Record<string, unknown>,
    items: T[],
    setItems: Dispatch<SetStateAction<T[]>>
  ) => {
    const item = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    if (useLocalStorage) {
      const id = Date.now().toString()
      const next = [...items, { ...item, id }] as T[]
      setItems(next)
      saveToLocalStorage(key, next)
    } else {
      await addDoc(collection(db, col), {
        ...item,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })
    }
  }

  const updateItem = async <T extends { id: string }>(
    col: string,
    key: string,
    id: string,
    data: Record<string, unknown>,
    items: T[],
    setItems: Dispatch<SetStateAction<T[]>>
  ) => {
    const updateData = { ...data, updatedAt: new Date() }
    if (useLocalStorage) {
      const next = items.map((i) =>
        i.id === id ? { ...i, ...updateData } : i
      ) as T[]
      setItems(next)
      saveToLocalStorage(key, next)
    } else {
      await updateDoc(doc(db, col, id), {
        ...updateData,
        updatedAt: Timestamp.now(),
      })
    }
  }

  const deleteItem = async <T extends { id: string }>(
    col: string,
    key: string,
    id: string,
    items: T[],
    setItems: Dispatch<SetStateAction<T[]>>
  ) => {
    if (useLocalStorage) {
      const next = items.filter((i) => i.id !== id) as T[]
      setItems(next)
      saveToLocalStorage(key, next)
    } else {
      await deleteDoc(doc(db, col, id))
    }
  }

  const addEvent = (d: EventFormData) =>
    createItem("events", STORAGE_KEYS.events, d as unknown as Record<string, unknown>, events, setEvents)
  const updateEvent = (id: string, d: Partial<EventFormData>) =>
    updateItem("events", STORAGE_KEYS.events, id, d as unknown as Record<string, unknown>, events, setEvents)
  const deleteEvent = (id: string) =>
    deleteItem("events", STORAGE_KEYS.events, id, events, setEvents)

  const addMusicTrack = (d: MusicTrackFormData) =>
    createItem("musicTracks", STORAGE_KEYS.musicTracks, d as unknown as Record<string, unknown>, musicTracks, setMusicTracks)
  const updateMusicTrack = (id: string, d: Partial<MusicTrackFormData>) =>
    updateItem("musicTracks", STORAGE_KEYS.musicTracks, id, d as unknown as Record<string, unknown>, musicTracks, setMusicTracks)
  const deleteMusicTrack = (id: string) =>
    deleteItem("musicTracks", STORAGE_KEYS.musicTracks, id, musicTracks, setMusicTracks)

  const addGalleryImage = (d: GalleryImageFormData) =>
    createItem("galleryImages", STORAGE_KEYS.galleryImages, d as unknown as Record<string, unknown>, galleryImages, setGalleryImages)
  const updateGalleryImage = (id: string, d: Partial<GalleryImageFormData>) =>
    updateItem("galleryImages", STORAGE_KEYS.galleryImages, id, d as unknown as Record<string, unknown>, galleryImages, setGalleryImages)
  const deleteGalleryImage = (id: string) =>
    deleteItem("galleryImages", STORAGE_KEYS.galleryImages, id, galleryImages, setGalleryImages)

  const updateSettings = async (data: Partial<SiteSettings>) => {
    const updateData = { ...data, updatedAt: new Date() }
    if (useLocalStorage) {
      setSettings((prev) => ({ ...prev, ...updateData }))
      saveToLocalStorage(STORAGE_KEYS.settings, { ...settings, ...updateData })
    } else {
      const settingsRef = collection(db, "settings")
      const snap = await getDocs(settingsRef)
      if (snap.empty) {
        await addDoc(settingsRef, { ...updateData, updatedAt: Timestamp.now() })
      } else {
        await updateDoc(snap.docs[0].ref, {
          ...updateData,
          updatedAt: Timestamp.now(),
        })
      }
    }
  }

  const uploadImage = async (file: File, folder: string): Promise<string> => {
    if (isCloudinaryConfigured()) {
      return uploadToCloudinary(file, folder)
    }
    const storageRef = ref(
      storage,
      `federicotomadin_music/${folder}/${Date.now()}-${file.name}`
    )
    await uploadBytes(storageRef, file)
    return getDownloadURL(storageRef)
  }

  const uploadAudio = async (file: File, folder: string): Promise<string> => {
    const storageRef = ref(
      storage,
      `federicotomadin_music/${folder}/${Date.now()}-${file.name}`
    )
    await uploadBytes(storageRef, file)
    return getDownloadURL(storageRef)
  }

  return (
    <DataContext.Provider
      value={{
        events,
        musicTracks,
        galleryImages,
        settings,
        loading,
        useLocalStorage,
        addEvent,
        updateEvent,
        deleteEvent,
        addMusicTrack,
        updateMusicTrack,
        deleteMusicTrack,
        addGalleryImage,
        updateGalleryImage,
        deleteGalleryImage,
        updateSettings,
        uploadImage,
        uploadAudio,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const ctx = useContext(DataContext)
  if (ctx === undefined) throw new Error("useData must be used within a DataProvider")
  return ctx
}
