import { useData } from "@/contexts/DataContext"

const DEFAULT_BIO = `Músico - Baterista - Compositor. Jazz moderno con raíces folclóricas sutilmente evocadas.

Baterista y compositor, nacido en Santa Fe, Argentina, en el año de 1986. Se formó en el instrumento con el baterista y percusionista Gonzalo Díaz en la ciudad de Santa Fe por el lapso de dos años. Tomó clases con Germán Boco, Pipi Piazzolla, Pablo Raposo, Carlos Lastra, Eloy Michelini y Jerónimo Carmona. Se desempeña artísticamente como baterista en diferentes formaciones de jazz local como de proyectos de música original. Lleva adelante actualmente el Federico Tomadin Grupo, en el que participan Joaquín Sombielle (piano), Pablo Giordano (contrabajo), Camila Nebbia (saxo tenor) y César Rizzardi (guitarra). En el año 2018 la formación ganó el concurso "Primera Toma" para presentar su primer disco en el Festival Internacional de Jazz de Buenos Aires.

Actualmente su nuevo grupo en formación, quinteto, está compuesto por Pablo Juárez (piano), Pablo Giordano (contrabajo), Martín Portella (saxo tenor) y Ramiro Barrios (guitarra).`

export function BioSection() {
  const { settings } = useData()
  const bio = settings.bio || DEFAULT_BIO

  // Split bio into paragraphs for better visual treatment
  const paragraphs = bio.split("\n").filter((p) => p.trim())

  return (
    <section id="bio" className="py-28 md:py-36 bg-background">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left: Bio text */}
          <div>
            <div className="flex items-center gap-4 mb-10">
              <div className="section-line" />
              <span className="text-primary text-xs font-sans font-medium uppercase tracking-[0.25em]">
                Biografia
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-light mb-10 text-foreground leading-tight text-balance">
              Bio
            </h2>
            <div className="space-y-6">
              {paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-foreground/70 text-base leading-relaxed font-sans font-light"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Right: Photo */}
          <div className="relative lg:sticky lg:top-28">
            <div className="relative overflow-hidden rounded-lg">
              <img
                src="/FotoGrupo.jpg"
                alt="Federico Tomadin Grupo"
                className="w-full aspect-[4/5] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border border-primary/20 rounded-lg -z-10" />
          </div>
        </div>
      </div>
    </section>
  )
}
