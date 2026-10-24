import { FirebaseError } from "firebase/app"
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  Timestamp,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Subscriber } from "@/types"

const COLLECTION = "subscribers"
const STORAGE_KEY = "ft_music_subscribers"
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function firebaseReady(): boolean {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY
  return Boolean(apiKey && apiKey !== "your-api-key")
}

function subscriberId(email: string, whatsapp: string): string {
  if (email) return email.replace(/\//g, "_")
  return `wa_${whatsapp}`
}

function loadLocal(): Subscriber[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    const parsed = JSON.parse(stored) as Subscriber[]
    return parsed.map((s) => ({
      ...s,
      createdAt: s.createdAt ? new Date(s.createdAt) : new Date(),
    }))
  } catch {
    return []
  }
}

function saveLocal(items: Subscriber[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email.trim())
}

export async function addSubscriber(input: {
  email: string
  whatsapp: string
}): Promise<"created" | "exists"> {
  const email = input.email.trim().toLowerCase()
  const whatsapp = input.whatsapp.trim()

  if (!email && !whatsapp) {
    throw new Error("Completá tu email o WhatsApp")
  }
  if (email && !isValidEmail(email)) {
    throw new Error("El email no es válido")
  }
  if (whatsapp && (whatsapp.length < 8 || whatsapp.length > 18)) {
    throw new Error("El número de WhatsApp no es válido")
  }

  const id = subscriberId(email, whatsapp)
  const createdAt = new Date()

  if (!firebaseReady()) {
    const items = loadLocal()
    if (items.some((s) => s.id === id || (email && s.email === email))) {
      return "exists"
    }
    saveLocal([
      ...items,
      { id, email, whatsapp, source: "site", isActive: true, createdAt },
    ])
    return "created"
  }

  try {
    await setDoc(
      doc(db, COLLECTION, id),
      {
        email,
        whatsapp,
        source: "site",
        isActive: true,
        createdAt: Timestamp.fromDate(createdAt),
      },
      { merge: true },
    )
    return "created"
  } catch (err) {
    if (err instanceof FirebaseError && err.code === "permission-denied") {
      throw new Error(
        "No se pudo guardar. Si ya te suscribiste, ya estás en la lista. Si no, intentá de nuevo en unos minutos.",
      )
    }
    throw err
  }
}

export async function listSubscribers(): Promise<Subscriber[]> {
  if (!firebaseReady()) {
    return loadLocal().sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  const snapshot = await getDocs(collection(db, COLLECTION))
  return snapshot.docs
    .map((d) => {
      const data = d.data()
      const createdAtRaw = data.createdAt as { toDate?: () => Date } | Date | undefined
      const createdAt =
        createdAtRaw instanceof Date
          ? createdAtRaw
          : createdAtRaw?.toDate?.() ?? new Date()
      return {
        id: d.id,
        email: String(data.email ?? ""),
        whatsapp: String(data.whatsapp ?? ""),
        source: String(data.source ?? "site"),
        isActive: data.isActive !== false,
        createdAt,
      } satisfies Subscriber
    })
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

export async function deleteSubscriber(id: string): Promise<void> {
  if (!firebaseReady()) {
    saveLocal(loadLocal().filter((s) => s.id !== id))
    return
  }
  await deleteDoc(doc(db, COLLECTION, id))
}

export function uniqueEmailSubscribers(items: Subscriber[]): Subscriber[] {
  const seen = new Set<string>()
  return items.filter((s) => {
    if (!s.isActive || !s.email) return false
    const key = s.email.toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export function uniqueWhatsAppSubscribers(items: Subscriber[]): Subscriber[] {
  const seen = new Set<string>()
  return items.filter((s) => {
    if (!s.isActive || !s.whatsapp) return false
    if (seen.has(s.whatsapp)) return false
    seen.add(s.whatsapp)
    return true
  })
}
