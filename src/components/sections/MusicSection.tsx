import { useData } from "@/contexts/DataContext"
import { Button } from "@/components/ui/button"

const BASE_URL = import.meta.env.BASE_URL

export function MusicSection() {
  const { settings } = useData()

  const albums = [
    {
      id: "tornasolado",
      title: "Tornasolado",
      cover: "/Tornasolado-Frontal.jpg",
      description: "Debut en estudio del Federico Tomadin Grupo. Composiciones originales con influencias del jazz moderno y raíces folclóricas sutilmente evocadas.",
      credits: "Joaquín Sombielle, César Rizzardi, Pablo Giordano, Camila Nebbia",
      spotifyUrl: settings.spotifyTornasoladoUrl || settings.spotifyUrl,
    },
    {
      id: "album2",
      title: settings.album2Title || "Straight Street",
      cover: settings.album2Cover || "/straight_street.png",
      description: settings.album2Description || "Standards de jazz. Federico Tomadin en batería.",
      spotifyUrl: settings.spotifyAlbum2Url,
    },
  ]

  return (
    <section id="musica" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-serif font-light mb-16">
          Música
        </h2>

        <div className="space-y-16 max-w-4xl mx-auto">
          {albums.map((album) => (
            <div
              key={album.id}
              className="grid md:grid-cols-[200px_1fr] gap-8 items-start"
            >
              <img
                src={album.cover}
                alt={album.title}
                className="w-full aspect-square object-cover rounded-lg shadow-lg"
              />
              <div className="space-y-4">
                <h3 className="text-2xl md:text-3xl font-serif font-light">
                  {album.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {album.description}
                </p>
                {"credits" in album && album.credits && (
                  <p className="text-sm text-muted-foreground">
                    {album.credits}
                  </p>
                )}
                {album.spotifyUrl && (
                  <Button asChild className="bg-[#1DB954] hover:bg-[#1ed760] text-white">
                    <a
                      href={album.spotifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Obtener álbum
                    </a>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
