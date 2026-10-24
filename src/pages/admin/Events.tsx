import { useState } from "react"
import { useData } from "@/contexts/DataContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Plus, Pencil, Trash2, AlertCircle, CheckCircle2, Bell, Loader2 } from "lucide-react"
import { WhatsAppNotifyDialog } from "@/components/admin/WhatsAppNotifyDialog"
import { isNewsletterConfigured, notifySubscribers } from "@/lib/notify"
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
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [notify, setNotify] = useState(true)
  const [notifyingId, setNotifyingId] = useState<string | null>(null)
  const [whatsapp, setWhatsapp] = useState<{ numbers: string[]; message: string } | null>(null)

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
    setNotify(true)
  }

  const showMessage = (msg: string, isError: boolean) => {
    if (isError) {
      setError(msg)
      setSuccess(null)
    } else {
      setSuccess(msg)
      setError(null)
    }
    setTimeout(() => { setError(null); setSuccess(null) }, 5000)
  }

  const sendEventNotice = async (data: EventFormData) => {
    const result = await notifySubscribers({
      kind: "event",
      title: data.title,
      date: data.date,
      location: data.location,
      description: data.description,
      ticketUrl: data.ticketUrl,
    })
    if (!result.emailConfigured) {
      showMessage(
        "El evento está publicado, pero el email a suscriptores no está configurado. Falta VITE_EMAILJS_NEWSLETTER_TEMPLATE_ID (un template de EmailJS con destinatario {{to_email}}).",
        true,
      )
    } else if (result.emailsSent === 0 && result.emailsFailed === 0) {
      showMessage("El evento está publicado. No hay suscriptores con email para avisar.", false)
    } else {
      const emailPart = `${result.emailsSent} emails enviados${result.emailsFailed ? `, ${result.emailsFailed} con error` : ""}`
      showMessage(`Aviso: ${emailPart}`, result.emailsFailed > 0 && result.emailsSent === 0)
    }
    if (result.whatsappNumbers.length > 0) {
      setWhatsapp({ numbers: result.whatsappNumbers, message: result.message })
    }
    return result
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      if (editing) {
        await updateEvent(editing.id, form)
      } else {
        await addEvent(form)
      }
      const shouldNotify = !editing && notify && form.isActive
      const createdForm = form
      setOpen(false)
      reset()
      showMessage(editing ? "Evento actualizado" : "Evento creado", false)
      if (shouldNotify) {
        setNotifyingId("new")
        try {
          await sendEventNotice(createdForm)
        } catch (notifyErr) {
          console.error(notifyErr)
          showMessage("El evento se guardó, pero no se pudieron enviar los avisos", true)
        }
      }
    } catch (err) {
      console.error(err)
      showMessage(`Error al guardar: ${err instanceof Error ? err.message : "Error desconocido"}`, true)
    } finally {
      setNotifyingId(null)
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
    setError(null)
    try {
      const url = await uploadImage(file, "events")
      setForm((f) => ({ ...f, image: url }))
    } catch (err) {
      console.error(err)
      showMessage(`Error al subir imagen: ${err instanceof Error ? err.message : "Error desconocido"}`, true)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert>
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-500">{success}</AlertDescription>
        </Alert>
      )}
      {!isNewsletterConfigured() && (
        <Alert>
          <AlertCircle className="h-4 w-4 text-primary" />
          <AlertDescription>
            Los avisos por email no se envían todavía. En EmailJS creá un template con destinatario{" "}
            <code>{"{{to_email}}"}</code>, asunto <code>{"{{subject}}"}</code> y cuerpo{" "}
            <code>{"{{message}}"}</code>. Después agregá <code>VITE_EMAILJS_NEWSLETTER_TEMPLATE_ID</code>{" "}
            en <code>.env</code> y en GitHub Secrets, y reiniciá el servidor.
          </AlertDescription>
        </Alert>
      )}
      {notifyingId && (
        <Alert>
          <Loader2 className="h-4 w-4 animate-spin" />
          <AlertDescription>Enviando avisos a suscriptores...</AlertDescription>
        </Alert>
      )}
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
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Avisar suscriptores"
                    disabled={notifyingId !== null}
                    onClick={async () => {
                      setNotifyingId(event.id)
                      try {
                        await sendEventNotice(event)
                      } catch (err) {
                        console.error(err)
                        showMessage("No se pudo avisar a los suscriptores", true)
                      } finally {
                        setNotifyingId(null)
                      }
                    }}
                  >
                    {notifyingId === event.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bell className="h-4 w-4" />}
                  </Button>
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
                <Input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
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
            {!editing && (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="notify" checked={notify} onChange={(e) => setNotify(e.target.checked)} />
                  <Label htmlFor="notify">Avisar a suscriptores</Label>
                </div>
                {!isNewsletterConfigured() && notify && (
                  <p className="text-xs text-muted-foreground">
                    El email automático necesita el template de novedades en EmailJS. WhatsApp se puede abrir desde el panel.
                  </p>
                )}
              </div>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={uploading || notifyingId !== null}>Guardar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <WhatsAppNotifyDialog
        open={Boolean(whatsapp)}
        onOpenChange={(next) => {
          if (!next) setWhatsapp(null)
        }}
        numbers={whatsapp?.numbers ?? []}
        message={whatsapp?.message ?? ""}
      />
    </div>
  )
}
