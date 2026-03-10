import { useState } from "react"
import { useData } from "@/contexts/DataContext"
import { Calendar, MapPin, ArrowRight, X } from "lucide-react"

export function EventsSection() {
  const { events, loading } = useData()
  const [expandedImage, setExpandedImage] = useState<{ src: string; alt: string } | null>(null)

  const activeEvents = events
    .filter((e) => e.isActive)
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return dateA - dateB
    })

  return (
    <section id="conciertos" className="py-28 md:py-36 bg-background">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex items-center gap-4 mb-10">
          <div className="section-line" />
          <span className="text-primary text-xs font-sans font-medium uppercase tracking-[0.25em]">
            En Vivo
          </span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-20">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-light text-foreground leading-tight">
            Conciertos
          </h2>
          <p className="text-foreground/50 max-w-md font-sans font-light text-base leading-relaxed">
            Proximas fechas y presentaciones en vivo
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        ) : activeEvents.length === 0 ? (
          <div className="text-center py-16 border border-border/50 rounded-lg bg-card/50">
            <p className="text-foreground/50 font-sans font-light text-base mb-4">
              No hay conciertos programados en este momento.
            </p>
            <p className="text-sm text-foreground/30 font-sans">
              Bares Notables de Buenos Aires 2019 / Festival de Jazz de Buenos Aires Noviembre 2018
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {activeEvents.map((event) => (
              <div
                key={event.id}
                className="group grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-6 md:gap-10 items-center py-8 border-b border-border/50 hover:bg-card/50 transition-colors duration-300 px-4 -mx-4 rounded-lg"
              >
                {event.image && (
                  <button
                    type="button"
                    onClick={() => setExpandedImage({ src: event.image, alt: event.title })}
                    className="cursor-zoom-in overflow-hidden rounded-lg"
                  >
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full md:w-40 h-48 md:h-28 object-cover rounded-lg transition-transform duration-300 hover:scale-105"
                    />
                  </button>
                )}

                <div className="space-y-3">
                  <h3 className="text-lg md:text-xl font-serif font-medium text-foreground group-hover:text-primary transition-colors duration-300">
                    {event.title}
                  </h3>
                  {event.date && (
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-foreground text-sm font-sans font-medium">
                        {event.date}
                      </span>
                    </div>
                  )}
                  {event.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-foreground/30 shrink-0" />
                      <span className="text-foreground/40 text-sm font-sans">{event.location}</span>
                    </div>
                  )}
                  {event.description && (
                    <p className="text-sm text-foreground/40 font-sans font-light line-clamp-2 leading-relaxed">
                      {event.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center">
                  {event.ticketUrl && (
                    <a
                      href={event.ticketUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium transition-colors duration-300"
                    >
                      <span className="hidden md:inline">Entradas</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {expandedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setExpandedImage(null)}
        >
          <button
            type="button"
            onClick={() => setExpandedImage(null)}
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={expandedImage.src}
            alt={expandedImage.alt}
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  )
}
