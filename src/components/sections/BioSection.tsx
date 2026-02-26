import { useData } from "@/contexts/DataContext"

const DEFAULT_BIO = `Baterista y compositor, nacido en Santa Fe, Argentina, en el año de 1986.

Formado en la Escuela de Música de la Universidad Nacional del Litoral, donde tuvo como profesores a Carlos Inzillo, Adrián Iaies y Juan Carlos "Mono" Fontana, entre otros. Su actividad se desarrolla principalmente en el ámbito del jazz y la música de autor, integrando y dirigiendo proyectos de música original.

Actualmente lidera el Federico Tomadin Grupo, conformado por Joaquín Sombielle (piano), Pablo Giordano (contrabajo), Camila Nebbia (saxo tenor) y César Rizzardi (guitarra). En 2018 el grupo obtuvo el premio al Mejor Debut en el Festival Internacional de Jazz de Buenos Aires con su álbum Tornasolado.`

export function BioSection() {
  const { settings } = useData()
  const bio = settings.bio || DEFAULT_BIO

  return (
    <section id="bio" className="py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Bio text (federicotomadin.com BIO page layout) */}
          <div>
            <div className="w-12 h-0.5 bg-primary mb-8" />
            <h2 className="text-2xl md:text-3xl font-serif font-light mb-8 text-foreground">
              Bio
            </h2>
            <p className="text-foreground/90 leading-relaxed whitespace-pre-line">
              {bio}
            </p>
          </div>

          {/* Right: Photo (Brad Mehldau / federicotomadin.com style) */}
          <div className="relative">
            <img
              src="/FotoGrupo.jpg"
              alt="Federico Tomadin Grupo"
              className="w-full aspect-[4/3] object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
