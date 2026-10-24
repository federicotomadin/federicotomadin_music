import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { whatsappChatUrl } from "@/lib/phone"

interface WhatsAppNotifyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  numbers: string[]
  message: string
}

export function WhatsAppNotifyDialog({
  open,
  onOpenChange,
  numbers,
  message,
}: WhatsAppNotifyDialogProps) {
  const [index, setIndex] = useState(0)
  const [copied, setCopied] = useState<"message" | "numbers" | null>(null)

  const current = numbers[index]
  const remaining = numbers.length - index

  const copy = async (value: string, kind: "message" | "numbers") => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(kind)
      setTimeout(() => setCopied(null), 2000)
    } catch {
      setCopied(null)
    }
  }

  const openChat = () => {
    if (!current) return
    window.open(whatsappChatUrl(current, message), "_blank", "noopener,noreferrer")
    if (index < numbers.length - 1) setIndex((i) => i + 1)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setIndex(0)
        onOpenChange(next)
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Avisar por WhatsApp</DialogTitle>
          <DialogDescription>
            WhatsApp no permite envíos masivos automáticos. Abrí un chat listo para cada
            persona, o copiá los números para una lista de difusión.
          </DialogDescription>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          {numbers.length} {numbers.length === 1 ? "persona dejó" : "personas dejaron"} WhatsApp.
          {remaining > 0 ? ` Quedan ${remaining}.` : " Ya recorriste todos."}
        </p>

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => copy(message, "message")}>
            {copied === "message" ? "Mensaje copiado" : "Copiar mensaje"}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => copy(numbers.join("\n"), "numbers")}
          >
            {copied === "numbers" ? "Números copiados" : "Copiar números"}
          </Button>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
          {current && (
            <Button type="button" onClick={openChat}>
              Abrir WhatsApp {index + 1}/{numbers.length}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
