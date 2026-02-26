import { useData } from "@/contexts/DataContext"

const DEFAULT_BIO = `Músico - Baterista - Compositor. Jazz moderno con raíces folclóricas sutilmente evocadas.

Baterista y compositor, nacido en Santa Fe, Argentina, en el año de 1986. Se formó en el instrumento con el baterista y percusionista Gonzalo Díaz en la ciudad de Santa Fe por el lapso de dos años. Tomó clases con Germán Boco, Pipi Piazzolla, Pablo Raposo, Carlos Lastra, Eloy Michelini y Jerónimo Carmona. Se desempeña artísticamente como baterista en diferentes formaciones de jazz local como de proyectos de música original. Lleva adelante actualmente el Federico Tomadin Grupo, en el que participan Joaquín Sombielle (piano), Pablo Giordano (contrabajo), Camila Nebbia (saxo tenor) y César Rizzardi (guitarra). En el año 2018 la formación ganó el concurso "Primera Toma" para presentar su primer disco en el Festival Internacional de Jazz de Buenos Aires.

Actualmente su nuevo grupo en formación, quinteto, está compuesto por Pablo Juárez (piano), Pablo Giordano (contrabajo), Martín Portella (saxo tenor) y Ramiro Barrios (guitarra).`

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
