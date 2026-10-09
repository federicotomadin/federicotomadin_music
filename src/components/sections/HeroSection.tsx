import { useData } from "@/contexts/DataContext"
import { assetUrl } from "@/lib/utils"
import { Play, Pause, ChevronDown } from "lucide-react"
import { useRef, useState } from "react"

export function HeroSection() {
  const { musicTracks } = useData()
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const featuredTrack = musicTracks.filter((t) => t.isActive).sort((a, b) => (a.order ?? 0) - (b.order ?? 0))[0]
  const heroBackgroundSrc = assetUrl("background.jpg")

  const handlePlay = () => {
    if (!featuredTrack?.url) return
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
    <section className="relative min-h-screen flex flex-col">
      {/* Background image */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-background">
        {/* Blurred fill covers the whole screen around the pulled-back photo */}
        <img
          src={heroBackgroundSrc}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover object-[34%_36%] md:object-[46%_24%] scale-125 blur-2xl brightness-[0.45] saturate-150"
        />
        <img
          src={heroBackgroundSrc}
          alt="Federico Tomadin - Baterista"
          className="absolute left-1/2 top-[calc(50%+2.5rem)] h-[82%] w-[92%] -translate-x-1/2 -translate-y-1/2 object-contain object-center brightness-110 contrast-[1.05]"
        />
        <div className="absolute inset-0 bg-black/10 md:bg-black/20" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/40 to-transparent h-32 md:h-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#131211] via-[#131211]/20 md:via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/15 md:from-black/25 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-end pb-16 md:pb-24 pt-32">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl space-y-8">
            {/* Subtitle */}
            <div className="flex items-center gap-4">
              <div className="w-8 h-px bg-primary" />
              <p className="text-primary text-xs font-sans font-medium uppercase tracking-[0.25em]">
                Musico / Baterista / Compositor
              </p>
            </div>

            {/* Name */}
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl xl:text-9xl text-foreground font-light leading-[0.9] tracking-tight">
              <span className="block">Federico</span>
              <span className="block text-primary italic">Tomadin</span>
            </h1>

            {/* Music player - only show when there's an active track */}
            {featuredTrack && (
              <div className="flex items-center gap-5 pt-4">
                <button
                  onClick={handlePlay}
                  disabled={!featuredTrack.url}
                  className="w-14 h-14 rounded-full border border-foreground/20 flex items-center justify-center hover:border-primary hover:bg-primary/10 transition-all duration-300 shrink-0 disabled:opacity-30 disabled:cursor-not-allowed group"
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5 text-foreground group-hover:text-primary transition-colors" />
                  ) : (
                    <Play className="h-5 w-5 text-foreground group-hover:text-primary transition-colors ml-0.5" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground text-sm font-medium truncate">
                    {featuredTrack.title}
                  </p>
                  <p className="text-foreground/40 text-xs font-sans mt-1">
                    {featuredTrack.artist}
                    {featuredTrack.duration && (
                      <>
                        <span className="text-foreground/20 mx-1">{"/"}</span>
                        {featuredTrack.duration}
                      </>
                    )}
                  </p>
                </div>
              </div>
            )}
            <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
        <a
          href="#bio"
          className="flex flex-col items-center gap-2 text-foreground/30 hover:text-foreground/50 transition-colors duration-300"
          aria-label="Scroll down"
        >
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </a>
      </div>
    </section>
  )
}
