import { useMemo, useState } from "react"
import emailjs from "@emailjs/browser"
import { useData } from "@/contexts/DataContext"
import { assetUrl, cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import type { ShopProduct } from "@/types"

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || ""
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || ""
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || ""

function fallbackProducts(): ShopProduct[] {
  return [
    {
      id: "tornasolado-vinyl",
      title: "Tornasolado Vinilo LP",
      description:
        "Debut en estudio del Federico Tomadin Grupo. Composiciones originales con influencias del jazz moderno y raices folkloricas sutilmente evocadas.",
      coverImage: assetUrl("Tornasolado-Frontal.jpg"),
      format: "Vinilo LP",
      price: "",
      purchaseUrl: "",
      discs: 2,
      soldOut: false,
      isActive: true,
      order: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]
}

function resolveCover(coverImage: string): string {
  if (!coverImage) return assetUrl("Tornasolado-Frontal.jpg")
  if (coverImage.startsWith("http") || coverImage.startsWith("data:") || coverImage.startsWith("blob:")) {
    return coverImage
  }
  return assetUrl(coverImage)
}

function VinylDisc({ labelSrc }: { labelSrc: string }) {
  return (
    <div
      className="relative h-full w-full rounded-full ring-1 ring-white/20 shadow-[0_12px_40px_rgba(0,0,0,0.55)]"
      style={{
        background: `
          radial-gradient(circle at 30% 26%, rgba(255,255,255,0.22) 0%, transparent 34%),
          repeating-radial-gradient(circle at center, #2a2a2a 0px, #141414 1px, #0a0a0a 2px, #1c1c1c 3px)
        `,
      }}
    >
      <div className="absolute inset-[31%] overflow-hidden rounded-full border border-white/20 shadow-inner">
        <img src={labelSrc} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/20" />
      </div>
      <div className="absolute inset-[47.5%] rounded-full bg-[#1a1917] ring-1 ring-white/25" />
    </div>
  )
}

function VinylMockup({
  cover,
  title,
  discs,
}: {
  cover: string
  title: string
  discs: number
}) {
  const count = discs > 1 ? 2 : 1

  return (
    <div className="relative w-full">
      <div className="relative w-full pt-[66%]">
        {Array.from({ length: count }).map((_, i) => {
          const fromRight = count === 1 ? 2 : 0 + (count - 1 - i) * 14
          return (
            <div
              key={i}
              className="pointer-events-none absolute top-[3%] aspect-square h-[94%] transition-transform duration-700 ease-out group-hover:rotate-[8deg]"
              style={{ right: `${fromRight}%`, zIndex: i + 1 }}
            >
              <VinylDisc labelSrc={cover} />
            </div>
          )
        })}
        <div className="absolute top-0 left-0 z-10 h-full aspect-square overflow-hidden shadow-[0_18px_50px_rgba(0,0,0,0.55)]">
          <img
            src={cover}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          />
        </div>
      </div>
    </div>
  )
}

export function ShopSection() {
  const { shopProducts, loading } = useData()
  const [selected, setSelected] = useState<ShopProduct | null>(null)
  const [qty, setQty] = useState("1")
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")

  const products = useMemo(() => {
    const active = shopProducts
      .filter((p) => p.isActive)
      .sort((a, b) => a.order - b.order)
    return active.length > 0 ? active : fallbackProducts()
  }, [shopProducts])

  const openPurchase = (product: ShopProduct) => {
    if (product.soldOut) return
    if (product.purchaseUrl) {
      window.open(product.purchaseUrl, "_blank", "noopener,noreferrer")
      return
    }
    setSelected(product)
    setQty("1")
    setStatus("idle")
    setErrorMsg("")
  }

  const handleOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selected) return
    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      setStatus("error")
      setErrorMsg("El pedido no esta configurado. Escribime desde Contacto.")
      return
    }

    const form = e.currentTarget
    const name = (form.elements.namedItem("from_name") as HTMLInputElement).value
    const email = (form.elements.namedItem("from_email") as HTMLInputElement).value
    const city = (form.elements.namedItem("city") as HTMLInputElement).value
    const notes = (form.elements.namedItem("notes") as HTMLTextAreaElement).value

    setStatus("sending")
    try {
      const message = [
        `Pedido de vinilo: ${selected.title}`,
        selected.format ? `Formato: ${selected.format}` : "",
        `Cantidad: ${qty}`,
        city ? `Ciudad / envio: ${city}` : "",
        notes ? `Notas: ${notes}` : "",
      ]
        .filter(Boolean)
        .join("\n")

      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        { from_name: name, from_email: email, message },
        PUBLIC_KEY,
      )
      setStatus("success")
      form.reset()
    } catch (err) {
      console.error("EmailJS shop error:", err)
      setStatus("error")
      setErrorMsg("No se pudo enviar el pedido. Intentá de nuevo o escribinos en Contacto.")
    }
  }

  return (
    <section id="shop" className="scroll-mt-28 bg-background py-28 md:py-36">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="mb-10 flex items-center gap-4">
          <div className="section-line" />
          <span className="font-sans text-xs font-medium uppercase tracking-[0.25em] text-primary">
            Vinilos
          </span>
        </div>
        <div className="mb-16 flex flex-col gap-6 md:mb-20 md:flex-row md:items-end md:justify-between">
          <h2 className="font-serif text-3xl font-light leading-tight text-foreground md:text-4xl lg:text-5xl">
            Shop
          </h2>
          <p className="max-w-md font-sans text-base font-light leading-relaxed text-foreground/50">
            Ediciones en vinilo para escuchar en casa
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
          </div>
        ) : (
          <div className="max-w-6xl">
            {products.map((product) => {
              const cover = resolveCover(product.coverImage)
              return (
                <article
                  key={product.id}
                  className="group grid items-center gap-10 border-t border-border/40 py-12 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:gap-12 md:py-16 lg:gap-16"
                >
                  <VinylMockup
                    cover={cover}
                    title={product.title}
                    discs={product.discs || 1}
                  />

                  <div className="relative z-20 space-y-6 md:py-4">
                    <div className="space-y-3">
                      <h3 className="font-serif text-2xl font-medium uppercase leading-tight tracking-wide text-foreground md:text-3xl lg:text-[2.1rem]">
                        {product.title}
                      </h3>
                      {product.format && (
                        <p className="font-sans text-xs font-medium uppercase tracking-[0.2em] text-primary">
                          {product.format}
                        </p>
                      )}
                    </div>
                    {product.description && (
                      <p className="max-w-md font-sans text-base font-light leading-relaxed text-foreground/55">
                        {product.description}
                      </p>
                    )}
                    {product.price && (
                      <p className="font-sans text-lg font-medium text-foreground">
                        {product.price}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() => openPurchase(product)}
                      disabled={product.soldOut}
                      className={cn(
                        "inline-flex items-center justify-center px-10 py-3.5 font-sans text-xs font-semibold uppercase tracking-[0.22em] transition-colors duration-300",
                        product.soldOut
                          ? "cursor-not-allowed bg-foreground/15 text-foreground/40"
                          : "bg-foreground text-background hover:bg-primary hover:text-primary-foreground",
                      )}
                    >
                      {product.soldOut ? "Agotado" : "Comprar"}
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>

      <Dialog
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open) {
            setSelected(null)
            setStatus("idle")
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pedir {selected?.title}</DialogTitle>
            <DialogDescription>
              Completá tus datos y te escribo para coordinar el pago y el envío.
            </DialogDescription>
          </DialogHeader>
          {status === "success" ? (
            <div className="flex items-start gap-3 py-4 text-sm text-green-400">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
              <span>Pedido enviado. Te respondo a la brevedad con los datos de compra.</span>
            </div>
          ) : (
            <form onSubmit={handleOrder} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="shop_from_name">Nombre</Label>
                  <Input id="shop_from_name" name="from_name" required disabled={status === "sending"} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shop_from_email">Email</Label>
                  <Input
                    id="shop_from_email"
                    name="from_email"
                    type="email"
                    required
                    disabled={status === "sending"}
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="shop_qty">Cantidad</Label>
                  <Input
                    id="shop_qty"
                    name="qty"
                    type="number"
                    min={1}
                    max={10}
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    required
                    disabled={status === "sending"}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shop_city">Ciudad / envío</Label>
                  <Input id="shop_city" name="city" placeholder="Buenos Aires" disabled={status === "sending"} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="shop_notes">Notas (opcional)</Label>
                <Textarea
                  id="shop_notes"
                  name="notes"
                  rows={3}
                  placeholder="Comentarios para el envío o el pago"
                  disabled={status === "sending"}
                />
              </div>
              {status === "error" && (
                <div className="flex items-start gap-2 text-sm text-red-400">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setSelected(null)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={status === "sending"}>
                  {status === "sending" ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Enviando...
                    </span>
                  ) : (
                    "Enviar pedido"
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
