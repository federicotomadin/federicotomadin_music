import { useRef, useState } from "react"
import emailjs from "@emailjs/browser"
import { useData } from "@/contexts/DataContext"
import { assetUrl } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mail, Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react"

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || ""
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || ""
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || ""

export function ContactSection() {
  const { settings } = useData()
  const formRef = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      setStatus("error")
      setErrorMsg("El servicio de contacto no está configurado.")
      return
    }

    setStatus("sending")
    try {
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current!, PUBLIC_KEY)
      setStatus("success")
      formRef.current?.reset()
      setTimeout(() => setStatus("idle"), 8000)
    } catch (err) {
      console.error("EmailJS error:", err)
      setStatus("error")
      setErrorMsg("No se pudo enviar el mensaje. Intentá de nuevo.")
      setTimeout(() => setStatus("idle"), 5000)
    }
  }

  return (
    <section id="contacto" className="relative py-28 md:py-36 overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${assetUrl("background_contact.png")})` }}
      />
      <div className="absolute inset-0 z-0 bg-background/35 md:bg-background/50" />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-background/60 md:from-background/70 via-background/35 md:via-background/50 to-background/60 md:to-background/70" />
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-10">
              <div className="section-line" />
              <span className="text-primary text-xs font-sans font-medium uppercase tracking-[0.25em]">
                Escribime
              </span>
              <div className="section-line" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-light mb-6 text-foreground leading-tight text-balance">
              Contacto
            </h2>
            <p className="text-foreground/50 font-sans font-light text-base">
              Para contrataciones, colaboraciones o consultas
            </p>
          </div>

          {settings.contactEmail && (
            <div className="flex justify-center mb-12">
              <a
                href={`mailto:${settings.contactEmail}`}
                className="group inline-flex items-center gap-3 text-foreground/60 hover:text-primary transition-colors duration-300 border border-border/50 rounded-full px-6 py-3"
              >
                <Mail className="h-4 w-4" />
                <span className="text-sm font-sans">{settings.contactEmail}</span>
              </a>
            </div>
          )}

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="from_name" className="text-foreground/60 text-xs uppercase tracking-wider font-sans">
                  Nombre
                </Label>
                <Input
                  id="from_name"
                  name="from_name"
                  placeholder="Tu nombre"
                  required
                  disabled={status === "sending"}
                  className="bg-card border-border/50 text-foreground placeholder:text-foreground/20 h-12 focus:border-primary/50 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="from_email" className="text-foreground/60 text-xs uppercase tracking-wider font-sans">
                  Email
                </Label>
                <Input
                  id="from_email"
                  name="from_email"
                  type="email"
                  placeholder="tu@email.com"
                  required
                  disabled={status === "sending"}
                  className="bg-card border-border/50 text-foreground placeholder:text-foreground/20 h-12 focus:border-primary/50 transition-colors"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message" className="text-foreground/60 text-xs uppercase tracking-wider font-sans">
                Mensaje
              </Label>
              <Textarea
                id="message"
                name="message"
                placeholder="Escribi tu mensaje..."
                rows={5}
                required
                disabled={status === "sending"}
                className="bg-card border-border/50 text-foreground placeholder:text-foreground/20 focus:border-primary/50 transition-colors resize-none"
              />
            </div>

            {status === "success" && (
              <div className="flex items-center gap-3 text-green-400 text-sm font-sans">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>Mensaje enviado correctamente. Te responderé pronto.</span>
              </div>
            )}
            {status === "error" && (
              <div className="flex items-center gap-3 text-red-400 text-sm font-sans">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 font-sans font-medium tracking-wide text-sm"
              disabled={status === "sending" || status === "success"}
            >
              {status === "sending" ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Enviando...
                </span>
              ) : status === "success" ? (
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Mensaje enviado
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Enviar mensaje
                  <Send className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}
