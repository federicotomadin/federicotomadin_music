import { Link, useSearchParams } from "react-router-dom"
import { MapPin, Navigation, ArrowLeft } from "lucide-react"
import { mapLinks } from "@/lib/maps"

export function Directions() {
  const [params] = useSearchParams()
  const place = params.get("lugar")?.trim() ?? ""
  const links = place ? mapLinks(place) : null

  const options = links
    ? [
        { label: "Google Maps", href: links.google },
        { label: "Waze", href: links.waze },
        { label: "Apple Maps", href: links.apple },
      ]
    : []

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md rounded-2xl border border-border/60 bg-card/90 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
        <div className="mb-8 flex items-center gap-4">
          <div className="section-line" />
          <span className="font-sans text-xs font-medium uppercase tracking-[0.25em] text-primary">
            Cómo llegar
          </span>
        </div>

        {place ? (
          <>
            <div className="mb-8 flex items-start gap-3">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-primary" />
              <h1 className="font-serif text-2xl font-light leading-snug text-foreground md:text-3xl">
                {place}
              </h1>
            </div>
            <p className="mb-5 font-sans text-sm font-light text-foreground/50">
              Elegí con qué app querés abrir el recorrido
            </p>
            <div className="space-y-3">
              {options.map((opt) => (
                <a
                  key={opt.label}
                  href={opt.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-full border border-border/70 bg-background/80 px-5 py-3.5 font-sans text-sm text-foreground transition-colors duration-300 hover:border-primary/60 hover:text-primary"
                >
                  <span>{opt.label}</span>
                  <Navigation className="h-4 w-4" />
                </a>
              ))}
            </div>
          </>
        ) : (
          <p className="font-sans text-sm font-light text-foreground/60">
            No encontramos la dirección del concierto.
          </p>
        )}

        <Link
          to="/#conciertos"
          className="mt-8 inline-flex items-center gap-2 font-sans text-sm text-foreground/50 transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Ver conciertos
        </Link>
      </div>
    </div>
  )
}
