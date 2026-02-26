import { useState } from "react"
import { useData } from "@/contexts/DataContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Plus, Pencil, Trash2 } from "lucide-react"
import type { EventFormData } from "@/types"

const BASE_URL = import.meta.env.BASE_URL

export function AdminEvents() {
  const { events, addEvent, updateEvent, deleteEvent, uploadImage } = useData()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<{ id: string; data: EventFormData } | null>(null)
  const [form, setForm] = useState<EventFormData>({
    title: "",
    date: "",
    location: "",
    description: "",
    image: "",
    ticketUrl: "",
    isActive: true,
  })
  const [uploading, setUploading] = useState(false)

  const reset = () => {
    setForm({
      title: "",
      date: "",
      location: "",
      description: "",
      image: "",
      ticketUrl: "",
      isActive: true,
    })
    setEditing(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editing) {
        await updateEvent(editing.id, form)
      } else {
        await addEvent(form)
      }
      setOpen(false)
      reset()
    } catch (err) {
      console.error(err)
    }
  }

  const handleEdit = (e: { id: string } & EventFormData) => {
    setEditing({ id: e.id, data: e })
    setForm({
      title: e.title,
      date: e.date,
      location: e.location,
      description: e.description || "",
      image: e.image,
      ticketUrl: e.ticketUrl || "",
      isActive: e.isActive,
    })
    setOpen(true)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadImage(file, "events")
      setForm((f) => ({ ...f, image: url }))
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
          <h2 className="text-2xl font-semibold">Eventos</h2>
          <p className="text-muted-foreground">Gestionar conciertos y fechas</p>
        </div>
        <Button onClick={() => { reset(); setOpen(true) }}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Evento
        </Button>
      </div>

      <div className="grid gap-4">
        {events.length === 0 ? (
          <Card><CardContent className="py-12 text-center text-muted-foreground">No hay eventos. Creá uno.</CardContent></Card>
        ) : (
          events.map((event) => (
            <Card key={event.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex gap-4">
                  <img src={event.image || `${BASE_URL}placeholder.svg`} alt="" className="w-16 h-16 object-cover rounded" />
                  <div>
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{event.date} • {event.location}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(event)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteEvent(event.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </CardHeader>
            </Card>
          ))
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Editar" : "Nuevo"} Evento</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Título</Label>
              <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Fecha</Label>
                <Input value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} placeholder="2024-03-15" />
              </div>
              <div className="space-y-2">
                <Label>Lugar</Label>
                <Input value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Descripción</Label>
              <Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} />
            </div>
            <div className="space-y-2">
              <Label>Imagen</Label>
              <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
              {form.image && <img src={form.image} alt="" className="w-24 h-24 object-cover rounded mt-2" />}
            </div>
            <div className="space-y-2">
              <Label>URL Entradas (opcional)</Label>
              <Input value={form.ticketUrl} onChange={(e) => setForm((f) => ({ ...f, ticketUrl: e.target.value }))} placeholder="https://..." />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="active" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} />
              <Label htmlFor="active">Activo</Label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={uploading}>Guardar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
