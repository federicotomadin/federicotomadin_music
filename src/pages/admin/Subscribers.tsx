import { useEffect, useState } from "react"
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertCircle, CheckCircle2, Loader2, Send, Trash2 } from "lucide-react"
import { WhatsAppNotifyDialog } from "@/components/admin/WhatsAppNotifyDialog"
import { deleteSubscriber, listSubscribers } from "@/lib/subscribers"
import { isNewsletterConfigured, notifySubscribers } from "@/lib/notify"
import { whatsappChatUrl } from "@/lib/phone"
import type { Subscriber } from "@/types"

export function AdminSubscribers() {
  const { settings } = useData()
  const [items, setItems] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [progress, setProgress] = useState("")
  const [whatsapp, setWhatsapp] = useState<{ numbers: string[]; message: string } | null>(null)

  const showMessage = (msg: string, isError: boolean) => {
    if (isError) {
      setError(msg)
      setSuccess(null)
    } else {
      setSuccess(msg)
      setError(null)
    }
    setTimeout(() => {
      setError(null)
      setSuccess(null)
    }, 6000)
  }

  const refresh = async () => {
    setLoading(true)
    try {
      const data = await listSubscribers()
      setItems(data)
    } catch (err) {
      console.error(err)
      showMessage("No se pudieron cargar los suscriptores. Revisá las reglas de Firestore.", true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void refresh()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      await deleteSubscriber(id)
      setItems((prev) => prev.filter((s) => s.id !== id))
      showMessage("Suscriptor eliminado", false)
    } catch (err) {
      console.error(err)
      showMessage("No se pudo eliminar", true)
    }
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setProgress("")
    try {
      const result = await notifySubscribers(
        { kind: "custom", title, description: message },
        (sent, total) => setProgress(`Enviando emails ${sent}/${total}`),
      )
      setOpen(false)
      setTitle("")
      setMessage("")
      const emailPart = result.emailConfigured
        ? `${result.emailsSent} emails enviados${result.emailsFailed ? `, ${result.emailsFailed} con error` : ""}`
        : "EmailJS de novedades no está configurado"
      showMessage(emailPart, !result.emailConfigured && result.whatsappNumbers.length === 0)
      if (result.whatsappNumbers.length > 0) {
        setWhatsapp({ numbers: result.whatsappNumbers, message: result.message })
      }
    } catch (err) {
      console.error(err)
      showMessage("No se pudo enviar el aviso", true)
    } finally {
      setSending(false)
      setProgress("")
    }
  }

  const emailCount = items.filter((s) => s.isActive && s.email).length
  const whatsappCount = items.filter((s) => s.isActive && s.whatsapp).length

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
            Para avisos por email creá un template en EmailJS con destinatario {"{{to_email}}"} y
            variables {"{{subject}}"} y {"{{message}}"}. Después agregá{" "}
            <code>VITE_EMAILJS_NEWSLETTER_TEMPLATE_ID</code> en el entorno.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Suscriptores</h2>
          <p className="text-muted-foreground">
            {items.length} en la lista · {emailCount} emails · {whatsappCount} WhatsApp
          </p>
        </div>
        <Button onClick={() => setOpen(true)} disabled={items.length === 0}>
          <Send className="h-4 w-4 mr-2" />
          Enviar novedad
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : items.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Todavía no hay suscriptores.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {items.map((sub) => (
            <Card key={sub.id}>
              <CardHeader className="flex flex-row items-center justify-between py-4">
                <div>
                  <CardTitle className="text-base font-medium">
                    {sub.email || `WhatsApp ${sub.whatsapp}`}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {sub.whatsapp ? `+${sub.whatsapp}` : "Sin WhatsApp"}
                    {sub.createdAt ? ` · ${sub.createdAt.toLocaleDateString("es-AR")}` : ""}
                  </p>
                </div>
                <div className="flex gap-2">
                  {sub.whatsapp && (
                    <Button variant="ghost" size="sm" asChild>
                      <a
                        href={whatsappChatUrl(
                          sub.whatsapp,
                          `Hola! Te escribo desde ${settings.contactEmail || "federicotomadin.com"}`,
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        WhatsApp
                      </a>
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => handleDelete(sub.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enviar novedad</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSend} className="space-y-4">
            <div className="space-y-2">
              <Label>Asunto</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nuevo disco, fechas, etc."
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Mensaje</Label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                required
              />
            </div>
            {progress && <p className="text-sm text-muted-foreground">{progress}</p>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={sending}>
                Cancelar
              </Button>
              <Button type="submit" disabled={sending}>
                {sending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Enviar
              </Button>
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
