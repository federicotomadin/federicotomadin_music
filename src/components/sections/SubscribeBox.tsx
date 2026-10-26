import { useState } from "react"
import { Mail, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { COUNTRY_CODES, normalizeWhatsApp } from "@/lib/phone"
import { addSubscriber } from "@/lib/subscribers"
import { cn } from "@/lib/utils"

type SubscribeMethod = "email" | "whatsapp"

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.87 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

interface SubscribeBoxProps {
  variant?: "default" | "compact"
  className?: string
}

export function SubscribeBox({ variant = "default", className }: SubscribeBoxProps) {
  const compact = variant === "compact"
  const [method, setMethod] = useState<SubscribeMethod>("email")
  const [email, setEmail] = useState("")
  const [dial, setDial] = useState("54")
  const [phone, setPhone] = useState("")
  const [honeypot, setHoneypot] = useState("")
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "exists" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")

  const selectMethod = (next: SubscribeMethod) => {
    if (next === method) return
    setMethod(next)
    if (status !== "sending") {
      setStatus("idle")
      setErrorMsg("")
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (honeypot) {
      setStatus("success")
      return
    }

    if (method === "email" && !email.trim()) {
      setStatus("error")
      setErrorMsg("Completá tu email")
      return
    }
    if (method === "whatsapp" && !phone.trim()) {
      setStatus("error")
      setErrorMsg("Completá tu WhatsApp")
      return
    }

    setStatus("sending")
    setErrorMsg("")
    try {
      const result = await addSubscriber(
        method === "email"
          ? { email, whatsapp: "" }
          : { email: "", whatsapp: normalizeWhatsApp(dial, phone) },
      )
      setStatus(result === "exists" ? "exists" : "success")
      if (result === "created") {
        setEmail("")
        setPhone("")
      }
    } catch (err) {
      console.error(err)
      setStatus("error")
      setErrorMsg(err instanceof Error ? err.message : "No se pudo suscribir. Intentá de nuevo.")
    }
  }

  const done = status === "success" || status === "exists"
  const iconSize = compact ? "w-8 h-8" : "w-9 h-9"
  const glyphSize = compact ? "w-3.5 h-3.5" : "w-4 h-4"

  return (
    <div
      className={cn(
        "relative border border-border/60 bg-card/90 backdrop-blur-md shadow-[0_20px_60px_rgba(0,0,0,0.25)]",
        compact
          ? "rounded-2xl px-6 py-7 md:px-7 md:py-8"
          : "rounded-[2rem] px-5 py-10 md:px-12 md:py-12",
        className,
      )}
    >
      <form onSubmit={handleSubmit} className={cn(compact ? "space-y-5" : "space-y-6")}>
        <div className={cn("flex gap-3", compact ? "items-center justify-between" : "flex-col sm:flex-row sm:items-start sm:justify-between gap-4")}>
          <h2
            className={cn(
              "font-serif font-medium text-foreground leading-snug text-balance",
              compact ? "text-base md:text-lg" : "text-xl md:text-2xl",
            )}
          >
            Enterate de conciertos, discos y novedades
          </h2>
          <div className="flex items-center gap-2 shrink-0 self-start" role="tablist" aria-label="Cómo te avisamos">
            <button
              type="button"
              role="tab"
              aria-selected={method === "whatsapp"}
              aria-label="Suscribirme por WhatsApp"
              title="WhatsApp"
              disabled={status === "sending"}
              onClick={() => selectMethod("whatsapp")}
              className={cn(
                "rounded-full flex items-center justify-center transition-colors duration-200",
                iconSize,
                method === "whatsapp"
                  ? "bg-primary text-primary-foreground"
                  : "border border-border/70 text-foreground/70 hover:border-primary/50 hover:text-foreground",
              )}
            >
              <WhatsAppIcon className={glyphSize} />
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={method === "email"}
              aria-label="Suscribirme por email"
              title="Email"
              disabled={status === "sending"}
              onClick={() => selectMethod("email")}
              className={cn(
                "rounded-full flex items-center justify-center transition-colors duration-200",
                iconSize,
                method === "email"
                  ? "bg-primary text-primary-foreground"
                  : "border border-border/70 text-foreground/70 hover:border-primary/50 hover:text-foreground",
              )}
            >
              <Mail className={glyphSize} />
            </button>
          </div>
        </div>

        <div
          className={cn(
            "flex gap-2 border border-border/70 bg-background/80 focus-within:border-primary/50 transition-colors",
            compact ? "flex-col rounded-2xl p-2.5 gap-2.5" : "flex-col sm:flex-row sm:items-center rounded-3xl sm:rounded-full p-1.5",
          )}
        >
          {method === "email" ? (
            <input
              type="email"
              name="email"
              autoComplete="email"
              placeholder="Tu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "sending" || done}
              className="flex-1 min-w-0 bg-transparent border-0 rounded-full px-4 h-10 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none"
            />
          ) : (
            <div className="flex flex-1 min-w-0 items-center gap-1">
              <select
                value={dial}
                onChange={(e) => setDial(e.target.value)}
                disabled={status === "sending" || done}
                aria-label="Código de país"
                className="h-10 min-w-[6.5rem] shrink-0 rounded-full bg-transparent px-3 text-sm text-foreground/80 focus:outline-none"
              >
                {COUNTRY_CODES.map((c) => (
                  <option key={`${c.iso}-${c.dial}`} value={c.dial}>
                    {c.iso} +{c.dial}
                  </option>
                ))}
              </select>
              <input
                type="tel"
                name="whatsapp"
                autoComplete="tel"
                placeholder="Tu número"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={status === "sending" || done}
                className="flex-1 min-w-0 bg-transparent border-0 rounded-full px-3 h-10 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none"
              />
            </div>
          )}
          <Button
            type="submit"
            disabled={status === "sending" || done}
            className={cn(
              "rounded-full h-10 px-5 shrink-0 font-sans text-xs uppercase tracking-[0.18em]",
              compact ? "w-full" : "w-full sm:w-auto",
            )}
          >
            {status === "sending" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : done ? (
              "Listo"
            ) : (
              "Suscribirme"
            )}
          </Button>
        </div>

        <input
          type="text"
          name="company"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />

        {status === "success" && (
          <div className="flex items-center gap-2 text-green-400 text-xs font-sans">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Listo. Te avisamos con las novedades.</span>
          </div>
        )}
        {status === "exists" && (
          <div className="flex items-center gap-2 text-primary text-xs font-sans">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Ya estás en la lista.</span>
          </div>
        )}
        {status === "error" && (
          <div className="flex items-center gap-2 text-red-400 text-xs font-sans">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {!compact && (
          <p className="text-[11px] leading-relaxed text-foreground/30 font-sans">
            Al suscribirte aceptás recibir avisos de fechas y lanzamientos. Elegí email o
            WhatsApp; el email llega automático.
          </p>
        )}
      </form>
    </div>
  )
}
