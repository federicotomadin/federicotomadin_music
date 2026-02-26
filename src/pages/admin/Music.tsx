import { useState } from "react"
import { useData } from "@/contexts/DataContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import type { MusicTrackFormData } from "@/types"

const BASE_URL = import.meta.env.BASE_URL

export function AdminMusic() {
  const { musicTracks, addMusicTrack, updateMusicTrack, deleteMusicTrack, uploadImage, uploadAudio } = useData()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<{ id: string; data: MusicTrackFormData } | null>(null)
  const [form, setForm] = useState<MusicTrackFormData>({
    title: "",
    artist: "Federico Tomadin",
    album: "",
    url: "",
    coverImage: "",
    duration: "",
    isActive: true,
    order: 0,
  })
  const [uploading, setUploading] = useState(false)

  const reset = () => {
    setForm({
      title: "",
      artist: "Federico Tomadin",
      album: "",
      url: "",
      coverImage: "",
      duration: "",
      isActive: true,
      order: musicTracks.length,
    })
    setEditing(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editing) {
        await updateMusicTrack(editing.id, form)
      } else {
        await addMusicTrack(form)
      }
      setOpen(false)
      reset()
    } catch (err) {
      console.error(err)
    }
  }

  const handleEdit = (t: { id: string } & MusicTrackFormData) => {
    setEditing({ id: t.id, data: t })
    setForm({
      title: t.title,
      artist: t.artist,
      album: t.album || "",
      url: t.url,
      coverImage: t.coverImage || "",
      duration: t.duration || "",
      isActive: t.isActive,
      order: t.order,
    })
    setOpen(true)
  }

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadImage(file, "music")
      setForm((f) => ({ ...f, coverImage: url }))
    } catch (err) {
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadAudio(file, "audio")
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
          <h2 className="text-2xl font-semibold">Música</h2>
          <p className="text-muted-foreground">Subí tracks para reproducir en el sitio</p>
        </div>
        <Button onClick={() => { reset(); setOpen(true) }}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Track
        </Button>
      </div>

      <div className="grid gap-4">
        {musicTracks.length === 0 ? (
          <Card><CardContent className="py-12 text-center text-muted-foreground">No hay tracks. Subí música (MP3) o pegá URLs de audio.</CardContent></Card>
        ) : (
          musicTracks.map((track) => (
            <Card key={track.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex gap-4">
                  <img src={track.coverImage || `${BASE_URL}placeholder.svg`} alt="" className="w-12 h-12 object-cover rounded" />
                  <div>
                    <CardTitle className="text-lg">{track.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{track.artist}{track.album && ` • ${track.album}`}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(track)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteMusicTrack(track.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </CardHeader>
            </Card>
          ))
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Editar" : "Nuevo"} Track</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Título</Label>
              <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Artista</Label>
                <Input value={form.artist} onChange={(e) => setForm((f) => ({ ...f, artist: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Álbum (opcional)</Label>
                <Input value={form.album} onChange={(e) => setForm((f) => ({ ...f, album: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>URL del audio (o subí archivo)</Label>
              <Input value={form.url} onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))} placeholder="https://... o subí MP3" />
              <Input type="file" accept="audio/*" onChange={handleAudioUpload} disabled={uploading} />
            </div>
            <div className="space-y-2">
              <Label>Portada (opcional)</Label>
              <Input type="file" accept="image/*" onChange={handleCoverUpload} disabled={uploading} />
              {form.coverImage && <img src={form.coverImage} alt="" className="w-24 h-24 object-cover rounded mt-2" />}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Duración (ej: 3:45)</Label>
                <Input value={form.duration} onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Orden</Label>
                <Input type="number" value={form.order} onChange={(e) => setForm((f) => ({ ...f, order: parseInt(e.target.value) || 0 }))} />
              </div>
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
