import { Link } from "react-router-dom"
import { useData } from "@/contexts/DataContext"
import { Calendar, Music, Image, Settings } from "lucide-react"

export function AdminDashboard() {
  const { events, musicTracks, galleryImages } = useData()

  const stats = [
    { label: "Eventos", count: events.filter((e) => e.isActive).length, href: "/panel/eventos", icon: Calendar },
    { label: "Tracks", count: musicTracks.filter((t) => t.isActive).length, href: "/panel/musica", icon: Music },
    { label: "Imágenes Galería", count: galleryImages.filter((i) => i.isActive).length, href: "/panel/galeria", icon: Image },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <p className="text-muted-foreground">Resumen del contenido del sitio</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Link key={stat.href} to={stat.href} className="block p-6 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors">
            <stat.icon className="h-8 w-8 text-primary mb-4" />
            <p className="text-2xl font-semibold">{stat.count}</p>
            <p className="text-muted-foreground">{stat.label}</p>
          </Link>
        ))}
      </div>

      <Link to="/panel/configuracion" className="inline-flex items-center gap-2 text-primary hover:underline">
        <Settings className="h-4 w-4" />
        Configurar enlaces de redes sociales y bio
      </Link>
    </div>
  )
}
