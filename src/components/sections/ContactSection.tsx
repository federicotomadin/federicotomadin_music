import { useState } from "react"
import { useData } from "@/contexts/DataContext"
import { assetUrl } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mail, Send } from "lucide-react"

export function ContactSection() {
  const { settings } = useData()
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section id="contacto" className="relative py-28 md:py-36 overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${assetUrl("background_contact.png")})` }}
      />
      <div className="absolute inset-0 z-0 bg-background/50" />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-background/70 via-background/50 to-background/70" />
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground/60 text-xs uppercase tracking-wider font-sans">
                  Nombre
                </Label>
                <Input
                  id="name"
                  placeholder="Tu nombre"
                  required
                  className="bg-card border-border/50 text-foreground placeholder:text-foreground/20 h-12 focus:border-primary/50 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground/60 text-xs uppercase tracking-wider font-sans">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  required
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
                placeholder="Escribi tu mensaje..."
                rows={5}
                required
                className="bg-card border-border/50 text-foreground placeholder:text-foreground/20 focus:border-primary/50 transition-colors resize-none"
              />
            </div>
            <Button
              type="submit"
              className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 font-sans font-medium tracking-wide text-sm"
              disabled={submitted}
            >
              {submitted ? (
                "Mensaje enviado"
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
