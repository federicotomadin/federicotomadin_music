import { useState, useRef } from "react"
import { useData } from "@/contexts/DataContext"
import { Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function MusicSection() {
  const { musicTracks, settings, loading } = useData()
  const [currentTrack, setCurrentTrack] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const activeTracks = musicTracks
    .filter((t) => t.isActive)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

  const handlePlay = (track: { id: string; url: string }) => {
    if (currentTrack === track.id) {
      if (isPlaying) audioRef.current?.pause()
      else audioRef.current?.play()
      setIsPlaying(!isPlaying)
    } else {
      setCurrentTrack(track.id)
      if (audioRef.current) {
        audioRef.current.src = track.url
        audioRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  return (
    <section id="musica" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Brad Mehldau style: Featured album block */}
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-[200px_1fr] gap-8 mb-16">
            <img
              src="/TapaDiscoTornasolado.jpg"
              alt="Tornasolado"
              className="w-full aspect-square object-cover rounded-lg shadow-lg"
            />
            <div className="flex flex-col justify-center">
              <h2 className="text-3xl md:text-4xl font-serif font-light mb-4">
                Tornasolado
              </h2>
              <p className="text-muted-foreground mb-6 max-w-xl">
                Debut en estudio del Federico Tomadin Grupo. Compositions originales con influencias del jazz moderno y raíces folclóricas sutilmente evocadas.
              </p>
              {settings.spotifyUrl && (
                <Button asChild variant="outline" className="w-fit">
                  <a href={settings.spotifyUrl} target="_blank" rel="noopener noreferrer">
                    Escuchar en Spotify
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* Track list - Brad Mehldau style */}
          <h3 className="text-xl font-serif font-light mb-6">Tracks</h3>
        </div>

        <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          </div>
        ) : activeTracks.length === 0 ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <p className="text-muted-foreground mb-4">Un Recuerdo — Federico Tomadin</p>
              <p className="text-sm text-muted-foreground mb-6">
                Subí tus tracks desde el panel de administración.
              </p>
              {settings.spotifyUrl && (
                <Button asChild variant="outline">
                  <a href={settings.spotifyUrl} target="_blank" rel="noopener noreferrer">
                    Escuchar en Spotify
                  </a>
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-2">
            {activeTracks.map((track, i) => (
              <div
                key={track.id}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-lg border border-border bg-card hover:bg-card/90 transition-colors",
                  currentTrack === track.id && "border-primary/50 bg-primary/5"
                )}
              >
                <span className="text-muted-foreground text-sm w-6">{i + 1}.</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0"
                  onClick={() => handlePlay(track)}
                >
                  {currentTrack === track.id && isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5" />
                  )}
                </Button>
                {track.coverImage ? (
                  <img src={track.coverImage} alt="" className="w-10 h-10 rounded object-cover shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded bg-muted flex items-center justify-center shrink-0">
                    <Play className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{track.title}</p>
                  <p className="text-sm text-muted-foreground truncate">{track.artist}{track.album && ` • ${track.album}`}</p>
                </div>
                {track.duration && (
                  <span className="text-sm text-muted-foreground font-mono">{track.duration}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
