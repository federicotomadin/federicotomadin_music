import { useState } from "react"
import { useData } from "@/contexts/DataContext"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"

const BASE_URL = import.meta.env.BASE_URL

// Default gallery from public folder when no Firestore images
const DEFAULT_GALLERY = [
  { url: "/DSC00753.JPG", caption: "En escena" },
  { url: "/DSC00756.JPG", caption: "Presentación" },
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
    <section id="galeria" className="py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-light mb-4">
            Galería
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Momentos en escena y detrás de escena
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {imagesToShow.map((img, idx) => (
              <button
                key={img.url + idx}
                className="aspect-square overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                onClick={() => setSelectedImage({ url: img.url, caption: img.caption })}
              >
                <img
                  src={img.url || `${BASE_URL}placeholder.svg`}
                  alt={img.caption || "Galería"}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          {selectedImage && (
            <>
              <img
                src={selectedImage.url}
                alt=""
                className="w-full max-h-[80vh] object-contain"
              />
              {selectedImage.caption && (
                <DialogTitle className="px-6 py-4 text-center">
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
