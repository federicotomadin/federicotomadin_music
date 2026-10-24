import { useData } from "@/contexts/DataContext"

export function Footer() {
  const { settings } = useData()

  const socialLinks = [
    { url: settings.spotifyUrl, label: "Spotify" },
    { url: settings.appleMusicUrl, label: "Apple Music" },
    { url: settings.youtubeUrl, label: "YouTube" },
    { url: settings.instagramUrl, label: "Instagram" },
    { url: settings.facebookUrl, label: "Facebook" },
  ].filter((s) => s.url)

  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="container mx-auto px-6 lg:px-12 py-16">
        <div className="grid md:grid-cols-3 gap-12 items-start">
          {/* Name */}
          <div>
            <p className="text-xl font-serif italic text-foreground">
              Federico <span className="text-primary">Tomadin</span>
            </p>
            <p className="text-sm text-foreground/40 mt-2 font-sans font-light">
              Musico / Baterista / Compositor
            </p>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-3">
            <span className="text-xs text-foreground/30 uppercase tracking-[0.2em] font-sans mb-1">
              Navegacion
            </span>
            {[
              { label: "Bio", href: "#bio" },
              { label: "Musica", href: "#musica" },
              { label: "Shop", href: "#shop" },
              { label: "Conciertos", href: "#conciertos" },
              { label: "Novedades", href: "#novedades" },
              { label: "Galeria", href: "#galeria" },
              { label: "Contacto", href: "#contacto" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm text-foreground/50 hover:text-foreground transition-colors duration-300 font-sans"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Social */}
          <div className="flex flex-col gap-3">
            <span className="text-xs text-foreground/30 uppercase tracking-[0.2em] font-sans mb-1">
              Redes
            </span>
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-foreground/50 hover:text-primary transition-colors duration-300 font-sans"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border/30 text-center">
          <p className="text-xs text-foreground/25 font-sans tracking-wider">
            {new Date().getFullYear()} Federico Tomadin. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
