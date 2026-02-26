import { useState } from "react"
import { useData } from "@/contexts/DataContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Plus, Pencil, Trash2 } from "lucide-react"
import type { GalleryImageFormData } from "@/types"

const BASE_URL = import.meta.env.BASE_URL

export function AdminGallery() {
  const { galleryImages, addGalleryImage, updateGalleryImage, deleteGalleryImage, uploadImage } = useData()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<{ id: string; data: GalleryImageFormData } | null>(null)
  const [form, setForm] = useState<GalleryImageFormData>({
    url: "",
    alt: "",
    caption: "",
    order: 0,
    isActive: true,
  })
  const [uploading, setUploading] = useState(false)

  const reset = () => {
    setForm({
      url: "",
      alt: "",
      caption: "",
      order: galleryImages.length,
      isActive: true,
    })
    setEditing(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editing) {
        await updateGalleryImage(editing.id, form)
      } else {
        await addGalleryImage(form)
      }
      setOpen(false)
      reset()
    } catch (err) {
      console.error(err)
    }
  }

  const handleEdit = (img: { id: string } & GalleryImageFormData) => {
    setEditing({ id: img.id, data: img })
    setForm({
      url: img.url,
      alt: img.alt || "",
      caption: img.caption || "",
      order: img.order,
      isActive: img.isActive,
    })
    setOpen(true)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadImage(file, "gallery")
      setForm((f) => ({ ...f, url }))
    } catch (err) {
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Galería</h2>
          <p className="text-muted-foreground">Imágenes para la sección galería</p>
        </div>
        <Button onClick={() => { reset(); setOpen(true) }}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Imagen
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {galleryImages.map((img) => (
          <Card key={img.id}>
            <div className="relative">
              <img src={img.url || `${BASE_URL}placeholder.svg`} alt={img.alt || ""} className="w-full aspect-square object-cover rounded-t-lg" />
              <div className="absolute top-2 right-2 flex gap-1">
                <Button variant="secondary" size="icon" className="h-8 w-8" onClick={() => handleEdit(img)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => deleteGalleryImage(img.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
            <CardContent className="p-2">
              <p className="text-sm truncate">{img.caption || img.alt || "Sin título"}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {galleryImages.length === 0 && (
        <Card><CardContent className="py-12 text-center text-muted-foreground">No hay imágenes. Agregá fotos de conciertos y presentaciones.</CardContent></Card>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Editar" : "Nueva"} Imagen</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Imagen</Label>
              <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} required={!editing} />
              {form.url && <img src={form.url} alt="" className="w-full h-32 object-cover rounded mt-2" />}
            </div>
            <div className="space-y-2">
              <Label>Caption (opcional)</Label>
              <Input value={form.caption} onChange={(e) => setForm((f) => ({ ...f, caption: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Alt (opcional)</Label>
              <Input value={form.alt} onChange={(e) => setForm((f) => ({ ...f, alt: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Orden</Label>
              <Input type="number" value={form.order} onChange={(e) => setForm((f) => ({ ...f, order: parseInt(e.target.value) || 0 }))} />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="active" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} />
              <Label htmlFor="active">Activo</Label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={uploading || !form.url}>Guardar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
