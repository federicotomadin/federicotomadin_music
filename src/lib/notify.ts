import emailjs from "@emailjs/browser"
import {
  listSubscribers,
  uniqueEmailSubscribers,
  uniqueWhatsAppSubscribers,
} from "@/lib/subscribers"

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || ""
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_NEWSLETTER_TEMPLATE_ID || ""
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || ""

export interface NotifyPayload {
  title: string
  date?: string
  location?: string
  description?: string
  ticketUrl?: string
  kind: "event" | "custom"
}

export interface NotifyResult {
  emailsSent: number
  emailsFailed: number
  emailConfigured: boolean
  whatsappNumbers: string[]
  message: string
  subject: string
}

function siteUrl(): string {
  if (typeof window === "undefined") return "https://federicotomadin.com"
  return window.location.origin
}

export function formatEventDate(isoDate: string): string {
  if (!isoDate) return ""
  const parsed = new Date(`${isoDate}T12:00:00`)
  if (Number.isNaN(parsed.getTime())) return isoDate
  return parsed.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export function isNewsletterConfigured(): boolean {
  return Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY)
}

export function buildNotifyCopy(payload: NotifyPayload): { subject: string; message: string } {
  const dateLabel = payload.date ? formatEventDate(payload.date) : ""

  if (payload.kind === "custom") {
    const subject = payload.title.trim() || "Novedades de Federico Tomadin"
    const lines = [
      "Hola,",
      "",
      payload.description?.trim() || subject,
      "",
      `Más info: ${siteUrl()}`,
    ]
    return { subject, message: lines.join("\n") }
  }

  const subject = `Nuevo concierto: ${payload.title}`
  const lines = [
    "Hola,",
    "",
    "Hay un concierto nuevo de Federico Tomadin:",
    "",
    payload.title,
    dateLabel ? `Fecha: ${dateLabel}` : null,
    payload.location ? `Lugar: ${payload.location}` : null,
    payload.description?.trim() ? payload.description.trim() : null,
    payload.ticketUrl ? `Entradas: ${payload.ticketUrl}` : null,
    "",
    `Más info: ${siteUrl()}`,
  ].filter((line): line is string => line !== null)

  return { subject, message: lines.join("\n") }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function notifySubscribers(
  payload: NotifyPayload,
  onProgress?: (sent: number, total: number) => void,
): Promise<NotifyResult> {
  const { subject, message } = buildNotifyCopy(payload)
  const subscribers = await listSubscribers()
  const emailSubs = uniqueEmailSubscribers(subscribers)
  const whatsappNumbers = uniqueWhatsAppSubscribers(subscribers).map((s) => s.whatsapp)
  const emailConfigured = isNewsletterConfigured()

  let emailsSent = 0
  let emailsFailed = 0

  if (emailConfigured) {
    for (const [index, sub] of emailSubs.entries()) {
      try {
        await emailjs.send(
          SERVICE_ID,
          TEMPLATE_ID,
          {
            to_email: sub.email,
            subject,
            message,
            site_url: siteUrl(),
          },
          PUBLIC_KEY,
        )
        emailsSent += 1
      } catch (err) {
        console.error("Newsletter email failed:", sub.email, err)
        emailsFailed += 1
      }
      onProgress?.(index + 1, emailSubs.length)
      if (index < emailSubs.length - 1) await sleep(400)
    }
  }

  return {
    emailsSent,
    emailsFailed,
    emailConfigured,
    whatsappNumbers,
    message,
    subject,
  }
}
