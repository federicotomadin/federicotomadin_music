import { useState } from "react"
import { useData } from "@/contexts/DataContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mail } from "lucide-react"

export function ContactSection() {
  const { settings } = useData()
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section id="contacto" className="py-24 bg-muted/20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-light mb-4">
              Contacto
            </h2>
            <p className="text-muted-foreground">
              Para contrataciones, colaboraciones o consultas
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
            {settings.contactEmail && (
              <a
                href={`mailto:${settings.contactEmail}`}
                className="flex items-center gap-3 text-primary hover:underline"
              >
                <Mail className="h-6 w-6" />
                <span className="text-lg">{settings.contactEmail}</span>
              </a>
            )}
          </div>

          <form onSubmit={handleSubmit} className="mt-12 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" placeholder="Tu nombre" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="tu@email.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Mensaje</Label>
              <Textarea
                id="message"
                placeholder="Escribí tu mensaje..."
                rows={4}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={submitted}>
              {submitted ? "Enviado" : "Enviar"}
            </Button>
          </form>

          {!settings.contactEmail && (
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Configurá tu email de contacto desde el panel de administración.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
