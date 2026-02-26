import { useData } from "@/contexts/DataContext"
import { ExternalLink } from "lucide-react"

export function MusicSection() {
  const { settings } = useData()

  const albums = [
    {
      id: "tornasolado",
      title: "Tornasolado",
      cover: "/Tornasolado-Frontal.jpg",
      description: "Debut en estudio del Federico Tomadin Grupo. Composiciones originales con influencias del jazz moderno y raices folkloricas sutilmente evocadas.",
      credits: "Joaquin Sombielle, Cesar Rizzardi, Pablo Giordano, Camila Nebbia",
      spotifyUrl: settings.spotifyTornasoladoUrl || settings.spotifyUrl,
    },
    {
      id: "album2",
      title: settings.album2Title || "Straight Street",
      cover: settings.album2Cover || "/straight_street.png",
      description: settings.album2Description || "Standards de jazz. Federico Tomadin en bateria.",
      credits: settings.album2Credits || "Yago Aguero - Guitarra y direccion, Benjamin Groisman - Contrabajo, Ramiro Sayas - Piano",
      spotifyUrl: settings.spotifyAlbum2Url,
    },
  ]

  return (
    <section id="musica" className="py-28 md:py-36 bg-card">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex items-center gap-4 mb-10">
          <div className="section-line" />
          <span className="text-primary text-xs font-sans font-medium uppercase tracking-[0.25em]">
            Discografia
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-light mb-20 text-foreground leading-tight">
          Musica
        </h2>

        <div className="space-y-20 max-w-5xl">
          {albums.map((album, index) => (
            <div
              key={album.id}
              className="group grid md:grid-cols-[280px_1fr] gap-10 lg:gap-14 items-start"
            >
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src={album.cover}
                  alt={album.title}
                  className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
              </div>
              <div className="space-y-5 py-2">
                <h3 className="text-2xl md:text-3xl font-serif font-light text-foreground">
                  {album.title}
                </h3>
                <p className="text-foreground/60 leading-relaxed font-sans font-light text-base">
                  {album.description}
                </p>
                {album.credits && (
                  <p className="text-sm text-foreground/40 font-sans leading-relaxed">
                    {album.credits}
                  </p>
                )}
                {album.spotifyUrl && (
                  <a
                    href={album.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-4 text-sm text-primary hover:text-primary/80 transition-colors duration-300 group/link"
                  >
                    <span className="font-medium">Escuchar en Spotify</span>
                    <ExternalLink className="w-3.5 h-3.5 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
