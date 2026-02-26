import { useState } from "react"
import { useData } from "@/contexts/DataContext"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"

// Default gallery from public folder when no Firestore images
const DEFAULT_GALLERY = [
  { url: "/DSC00753.JPG", caption: "En escena" },
  { url: "/DSC00756.JPG", caption: "Presentacion" },
  { url: "/DSC00762.JPG", caption: "Concierto" },
  { url: "/FedericoTomadinFestivalJazz.jpeg", caption: "Festival de Jazz Buenos Aires" },
  { url: "/FotoGrupo.jpg", caption: "Federico Tomadin Grupo" },
  { url: "/DSC00786.JPG", caption: "En vivo" },
]

export function GallerySection() {
  const { galleryImages, loading } = useData()
  const [selectedImage, setSelectedImage] = useState<{ url: string; caption?: string } | null>(null)

  const activeImages = galleryImages
    .filter((i) => i.isActive)
    .sort((a, b) => a.order - b.order)

  const imagesToShow = activeImages.length > 0
    ? activeImages.map((i) => ({ url: i.url, caption: i.caption }))
    : DEFAULT_GALLERY

  return (
    <section id="galeria" className="py-28 md:py-36 bg-card">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex items-center gap-4 mb-10">
          <div className="section-line" />
          <span className="text-primary text-xs font-sans font-medium uppercase tracking-[0.25em]">
            Fotos
          </span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-20">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-light text-foreground leading-tight">
            Galeria
          </h2>
          <p className="text-foreground/50 max-w-md font-sans font-light text-base leading-relaxed">
            Momentos en escena y detras de escena
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {imagesToShow.map((img, idx) => (
              <button
                key={img.url + idx}
                className="group relative aspect-[4/3] overflow-hidden rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                onClick={() => setSelectedImage({ url: img.url, caption: img.caption })}
              >
                <img
                  src={img.url}
                  alt={img.caption || "Galeria"}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-500" />
                {img.caption && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-foreground text-sm font-sans font-medium">{img.caption}</p>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-background border-border">
          {selectedImage && (
            <>
              <img
                src={selectedImage.url}
                alt={selectedImage.caption || ""}
                className="w-full max-h-[80vh] object-contain"
              />
              {selectedImage.caption && (
                <DialogTitle className="px-6 py-5 text-center text-foreground font-serif font-light text-lg">
                  {selectedImage.caption}
                </DialogTitle>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
