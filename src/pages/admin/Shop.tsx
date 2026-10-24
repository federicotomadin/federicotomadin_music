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
import { Plus, Pencil, Trash2, AlertCircle, CheckCircle2 } from "lucide-react"
import type { ShopProductFormData } from "@/types"

const BASE_URL = import.meta.env.BASE_URL

const emptyForm = (order: number): ShopProductFormData => ({
  title: "",
  description: "",
  coverImage: "",
  format: "Vinilo LP",
  price: "",
  purchaseUrl: "",
  discs: 2,
  soldOut: false,
  isActive: true,
  order,
})

export function AdminShop() {
  const { shopProducts, addShopProduct, updateShopProduct, deleteShopProduct, uploadImage } = useData()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<{ id: string; data: ShopProductFormData } | null>(null)
  const [form, setForm] = useState<ShopProductFormData>(emptyForm(0))
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

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
    }, 5000)
  }

  const reset = () => {
    setForm(emptyForm(shopProducts.length))
    setEditing(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editing) {
        await updateShopProduct(editing.id, form)
      } else {
        await addShopProduct(form)
      }
      setOpen(false)
      reset()
      showMessage(editing ? "Producto actualizado" : "Producto creado", false)
    } catch (err) {
      console.error(err)
      showMessage(`Error al guardar: ${err instanceof Error ? err.message : "Error desconocido"}`, true)
    }
  }

  const handleEdit = (p: { id: string } & ShopProductFormData) => {
    setEditing({ id: p.id, data: p })
    setForm({
      title: p.title,
      description: p.description || "",
      coverImage: p.coverImage || "",
      format: p.format || "Vinilo LP",
      price: p.price || "",
      purchaseUrl: p.purchaseUrl || "",
      discs: p.discs || 1,
      soldOut: p.soldOut ?? false,
      isActive: p.isActive,
      order: p.order,
    })
    setOpen(true)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const url = await uploadImage(file, "shop")
      setForm((f) => ({ ...f, coverImage: url }))
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Shop</h2>
          <p className="text-muted-foreground">Vinilos y merch para la tienda del sitio</p>
        </div>
        <Button
          onClick={() => {
            reset()
            setOpen(true)
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo producto
        </Button>
      </div>

      <div className="grid gap-4">
        {shopProducts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No hay productos cargados. Mientras tanto el sitio muestra Tornasolado por defecto.
              Agregá un vinilo con precio y link de compra (Mercado Pago, Bandcamp o WhatsApp) para reemplazarlo.
            </CardContent>
          </Card>
        ) : (
          shopProducts
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((product) => (
              <Card key={product.id}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="flex gap-4">
                    <img
                      src={product.coverImage || `${BASE_URL}placeholder.svg`}
                      alt=""
                      className="h-16 w-16 rounded object-cover"
                    />
                    <div>
                      <CardTitle className="text-lg">{product.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {product.format}
                        {product.price ? ` · ${product.price}` : ""}
                        {product.soldOut ? " · Agotado" : ""}
                        {!product.isActive ? " · Oculto" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => deleteShopProduct(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Editar" : "Nuevo"} producto</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Título</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Tornasolado Vinilo LP"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Descripción</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Formato</Label>
                <Input
                  value={form.format}
                  onChange={(e) => setForm((f) => ({ ...f, format: e.target.value }))}
                  placeholder="Vinilo LP"
                />
              </div>
              <div className="space-y-2">
                <Label>Precio (opcional)</Label>
                <Input
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  placeholder="$25.000 ARS"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>URL de compra (opcional)</Label>
              <Input
                value={form.purchaseUrl}
                onChange={(e) => setForm((f) => ({ ...f, purchaseUrl: e.target.value }))}
                placeholder="https://mpago.la/... o Bandcamp / WhatsApp"
              />
              <p className="text-xs text-muted-foreground">
                Si la dejás vacía, Comprar abre un formulario de pedido que te llega por email.
              </p>
            </div>
            <div className="space-y-2">
              <Label>Tapa</Label>
              <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
              {form.coverImage && (
                <img src={form.coverImage} alt="" className="mt-2 h-24 w-24 rounded object-cover" />
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Discos visibles</Label>
                <Input
                  type="number"
                  min={1}
                  max={2}
                  value={form.discs}
                  onChange={(e) => setForm((f) => ({ ...f, discs: Math.min(2, Math.max(1, parseInt(e.target.value) || 1)) }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Orden</Label>
                <Input
                  type="number"
                  value={form.order}
                  onChange={(e) => setForm((f) => ({ ...f, order: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="shop-active"
                  checked={form.isActive}
                  onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                />
                <Label htmlFor="shop-active">Activo</Label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="shop-soldout"
                  checked={form.soldOut}
                  onChange={(e) => setForm((f) => ({ ...f, soldOut: e.target.checked }))}
                />
                <Label htmlFor="shop-soldout">Agotado</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={uploading}>
                Guardar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
