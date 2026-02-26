import { useState } from "react"
import { Link } from "react-router-dom"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useData } from "@/contexts/DataContext"
import { cn } from "@/lib/utils"

const menuItems = [
  { label: "HOME", href: "#" },
  { label: "BIO", href: "#bio" },
  { label: "MUSICA", href: "#musica" },
  { label: "CONCIERTOS", href: "#conciertos" },
  { label: "GALERIA", href: "#galeria" },
  { label: "CONTACTO", href: "#contacto" },
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { settings } = useData()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-lg lg:text-xl font-serif italic tracking-wide text-white">
              federico <span className="text-[#d4af37]">tomadin</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {menuItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-xs md:text-sm font-medium text-white/80 hover:text-white uppercase tracking-wider transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {settings.spotifyUrl && (
              <a
                href={settings.spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Spotify"
                className="text-white/60 hover:text-[#d4af37] transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.02-.181-1.2-.721-.18-.601.18-1.021.72-1.2C9.6 6.9 16.8 7.2 20.88 9.06c.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
              </a>
            )}
            {settings.youtubeUrl && (
              <a
                href={settings.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="text-white/60 hover:text-[#d4af37] transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            )}
            {settings.instagramUrl && (
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-white/60 hover:text-[#d4af37] transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            )}
            {settings.facebookUrl && (
              <a
                href={settings.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-white/60 hover:text-[#d4af37] transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            )}
            {settings.appleMusicUrl && (
              <a
                href={settings.appleMusicUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Apple Music"
                className="text-white/60 hover:text-[#d4af37] transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.994 6.124a10.338 10.338 0 0 0-.283-2.206 9.278 9.278 0 0 0-.663-1.846 6.987 6.987 0 0 0-1.178-1.592A6.966 6.966 0 0 0 19.33.75a7.145 7.145 0 0 0-2.207-.425 10.379 10.379 0 0 0-2.438.078 11.184 11.184 0 0 0-2.359.611 10.36 10.36 0 0 0-2.188 1.158 9.68 9.68 0 0 0-1.863 1.613 8.562 8.562 0 0 0-1.378 1.972 7.803 7.803 0 0 0-.913 2.208 7.077 7.077 0 0 0-.332 2.383 7.443 7.443 0 0 0 .118 1.37 8.07 8.07 0 0 0 .358 1.208 7.408 7.408 0 0 0 .593 1.047 7.633 7.633 0 0 0 .822.935 9.793 9.793 0 0 0 1.046.902 12.29 12.29 0 0 0 1.242.706 11.77 11.77 0 0 0 1.365.433 11.09 11.09 0 0 0 1.484.227 9.75 9.75 0 0 0 1.542-.095 8.65 8.65 0 0 0 1.548-.463 8.055 8.055 0 0 0 1.459-.809 7.563 7.563 0 0 0 1.319-1.129 6.67 6.67 0 0 0 1.11-1.44 6.015 6.015 0 0 0 .725-1.716 5.636 5.636 0 0 0 .363-1.876 6.106 6.106 0 0 0-.057-1.308zM16.715 3.87a5.24 5.24 0 0 1 1.377 1.081 5.255 5.255 0 0 1 .977 1.4 4.924 4.924 0 0 1 .605 1.687 4.712 4.712 0 0 1 .185 1.768c-.001.238-.025.475-.071.707a4.76 4.76 0 0 1-.213.69 5.086 5.086 0 0 1-.378.658 4.984 4.984 0 0 1-.552.601 6.192 6.192 0 0 1-.722.543 6.364 6.364 0 0 1-.853.463 6.698 6.698 0 0 1-1.025.385 6.56 6.56 0 0 1-1.186.2 6.698 6.698 0 0 1-1.231-.114 5.736 5.736 0 0 1-1.129-.384 4.954 4.954 0 0 1-.961-.584 4.704 4.704 0 0 1-.775-.738 4.382 4.382 0 0 1-.575-.862 4.068 4.068 0 0 1-.358-.946 3.816 3.816 0 0 1-.211-.978 4.026 4.026 0 0 1 .086-1.002 4.277 4.277 0 0 1 .284-.927 4.614 4.614 0 0 1 .477-.852 5.019 5.019 0 0 1 .679-.729 5.284 5.284 0 0 1 .872-.579 5.537 5.537 0 0 1 1.041-.394 5.682 5.682 0 0 1 1.197-.21 5.731 5.731 0 0 1 1.26.073 5.393 5.393 0 0 1 1.178.334 5.089 5.089 0 0 1 1.037.546 4.813 4.813 0 0 1 .881.729 4.614 4.614 0 0 1 .703.874 4.382 4.382 0 0 1 .477.946 4.135 4.135 0 0 1 .249.988zm-6.84 2.09v13.96c0 .286-.092.53-.275.733a.99.99 0 0 1-.726.304.964.964 0 0 1-.516-.146 1.048 1.048 0 0 1-.38-.403 1.47 1.47 0 0 1-.136-.582V5.395c0-.233.044-.443.132-.628a.995.995 0 0 1 .378-.423.96.96 0 0 1 .533-.149.985.985 0 0 1 .495.126.995.995 0 0 1 .363.358c.085.137.127.296.127.479z"/>
                </svg>
              </a>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border space-y-2">
            {menuItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  "block py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors",
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}
