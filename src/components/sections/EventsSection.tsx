import { useData } from "@/contexts/DataContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, MapPin } from "lucide-react"

const BASE_URL = import.meta.env.BASE_URL

export function EventsSection() {
  const { events, loading } = useData()

  const activeEvents = events
    .filter((e) => e.isActive)
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return dateA - dateB
    })

  return (
    <section id="conciertos" className="py-24 bg-muted/20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-light mb-4">
            Conciertos
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Próximas fechas y presentaciones en vivo
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          </div>
        ) : activeEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-6">
              No hay conciertos programados en este momento.
            </p>
            <p className="text-sm text-muted-foreground">
              Bares Notables de Buenos Aires 2019 • Festival de Jazz de Buenos Aires Noviembre 2018
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {activeEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={event.image || `${BASE_URL}placeholder.svg`}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">{event.title}</h3>
                  <div className="space-y-2 text-muted-foreground text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 shrink-0" />
                      <span>{event.date}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 shrink-0" />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>
                  {event.description && (
                    <p className="mt-4 text-sm text-muted-foreground line-clamp-3">
                      {event.description}
                    </p>
                  )}
                  {event.ticketUrl && (
                    <Button className="mt-4 w-full" asChild>
                      <a href={event.ticketUrl} target="_blank" rel="noopener noreferrer">
                        Comprar Entradas
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
