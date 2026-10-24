import emailjs from "@emailjs/browser"
import { directionsUrl } from "@/lib/maps"
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

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

function htmlLink(href: string, label: string): string {
  return `<a href="${escapeHtml(href)}" style="color:#c8a55a;text-decoration:none;">${escapeHtml(label)}</a>`
}

export function buildNotifyCopy(payload: NotifyPayload): {
  subject: string
  message: string
  messageHtml: string
} {
  const dateLabel = payload.date ? formatEventDate(payload.date) : ""
  const site = siteUrl()

  if (payload.kind === "custom") {
    const subject = payload.title.trim() || "Novedades de Federico Tomadin"
    const body = payload.description?.trim() || subject
    const lines = ["Hola,", "", body, "", `Más info: ${site}`]
    const htmlLines = [
      "Hola,",
      "",
      escapeHtml(body).replace(/\n/g, "<br>"),
      "",
      `Más info: ${htmlLink(site, site)}`,
    ]
    return { subject, message: lines.join("\n"), messageHtml: htmlLines.join("<br>") }
  }

  const subject = `Nuevo concierto: ${payload.title}`
  const place = payload.location?.trim() ?? ""
  const description = payload.description?.trim() ?? ""
  const directions = place ? directionsUrl(place) : ""

  const lines = [
    "Hola,",
    "",
    "Hay un concierto nuevo de Federico Tomadin:",
    "",
    payload.title,
    dateLabel ? `Fecha: ${dateLabel}` : null,
    place ? `Lugar: ${place}` : null,
    place ? `Cómo llegar: ${directions}` : null,
    description || null,
    payload.ticketUrl ? `Entradas: ${payload.ticketUrl}` : null,
    "",
    `Más info: ${site}`,
  ].filter((line): line is string => line !== null)

  const htmlLines = [
    "Hola,",
    "",
    "Hay un concierto nuevo de Federico Tomadin:",
    "",
    `<strong style="color:#f0ede8;">${escapeHtml(payload.title)}</strong>`,
    dateLabel ? `Fecha: ${escapeHtml(dateLabel)}` : null,
    place
      ? `Lugar: ${escapeHtml(place)}&nbsp;&nbsp;${htmlLink(directions, "📍 Cómo llegar")}`
      : null,
    description ? escapeHtml(description).replace(/\n/g, "<br>") : null,
    payload.ticketUrl ? `Entradas: ${htmlLink(payload.ticketUrl, payload.ticketUrl)}` : null,
    "",
    `Más info: ${htmlLink(site, site)}`,
  ].filter((line): line is string => line !== null)

  return { subject, message: lines.join("\n"), messageHtml: htmlLines.join("<br>") }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function notifySubscribers(
  payload: NotifyPayload,
  onProgress?: (sent: number, total: number) => void,
): Promise<NotifyResult> {
  const { subject, message, messageHtml } = buildNotifyCopy(payload)
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
            message_html: messageHtml,
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
