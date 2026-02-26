import { useData } from "@/contexts/DataContext"
import { Play, Pause } from "lucide-react"
import { useRef, useState } from "react"

export function HeroSection() {
  const { events, musicTracks } = useData()
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const latestEvent = events.filter((e) => e.isActive).sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )[0]

  const featuredTrack = musicTracks.filter((t) => t.isActive).sort((a, b) => (a.order ?? 0) - (b.order ?? 0))[0]

  const handlePlay = () => {
    if (!featuredTrack?.url) {
      // Fallback: could open Spotify/Apple Music link
      return
    }
    if (isPlaying) {
      audioRef.current?.pause()
    } else {
      if (audioRef.current) {
        audioRef.current.src = featuredTrack.url
        audioRef.current.play()
      }
    }
    setIsPlaying(!isPlaying)
  }

  return (
    <section className="relative min-h-[100vh] flex flex-col pt-16">
      {/* Background image - drummer photo */}
      <div className="absolute inset-0 z-0">
        <img
          src="/background.jpg"
          alt="Federico Tomadin - Baterista"
          className="w-full h-full object-cover object-left-top brightness-150"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/35 to-transparent" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col lg:flex-row">
        {/* Left: Content panel (Brad Mehldau style - featured news/events) */}
        <div className="flex-1 flex items-center p-6 lg:p-12">
          <div className="max-w-xl space-y-8">
            <p className="text-white/90 text-sm uppercase tracking-widest">
              Músico - Baterista - Compositor
            </p>

            {latestEvent && (
              <div className="space-y-4">
                <h3 className="text-xl md:text-2xl font-semibold text-white">
                  {latestEvent.title}
                </h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  {latestEvent.description}
                </p>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-xl md:text-2xl font-semibold text-white">
                FESTIVAL DE JAZZ DE BUENOS AIRES — NOVIEMBRE 2018
              </h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Dos años de trabajo lleva este novel conjunto conformado por la afianzada sección rítmica de Federico Tomadin (batería) junto a Joaquín Sombielle (piano) y Pablo Giordano (contrabajo), a quienes se suman Camila Nebbia (saxo tenor) y César Rizzardi (guitarra). La presentación de Tornasolado, su debut en estudio, permitirá apreciar la musicalidad del grupo a partir de composiciones originales con influencias del jazz moderno y raíces folclóricas sutilmente evocadas.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Artist name + Music player (federicotomadin.com style) */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 text-center lg:text-right lg:items-end">
          <h1 className="font-script text-5xl md:text-7xl lg:text-8xl text-[#d4af37] leading-tight mb-8">
            <span className="block">federico</span>
            <span className="block">tomadin</span>
          </h1>

          <div className="w-full max-w-md bg-black/50 backdrop-blur-sm rounded-lg p-4 border border-white/10">
            <div className="flex items-center gap-4">
              <button
                onClick={handlePlay}
                disabled={!featuredTrack?.url}
                className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                  {isPlaying ? (
                    <Pause className="h-5 w-5 text-white" />
                  ) : (
                    <Play className="h-5 w-5 text-white ml-0.5" />
                  )}
              </button>
              <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">
                    {featuredTrack ? `${featuredTrack.title} — ${featuredTrack.artist}` : "Un Recuerdo — Federico Tomadin"}
                  </p>
                <p className="text-white/60 text-sm font-mono">
                  00:00 / {featuredTrack?.duration || "08:33"}
                </p>
              </div>
            </div>
            <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
          </div>
        </div>
      </div>
    </section>
  )
}
