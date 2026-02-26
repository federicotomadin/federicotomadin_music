import { useState, useEffect } from "react"
import { useData } from "@/contexts/DataContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function AdminSettings() {
  const { settings, updateSettings } = useData()
  const [form, setForm] = useState({
    bio: "",
    spotifyUrl: "",
    spotifyTornasoladoUrl: "",
    spotifyAlbum2Url: "",
    album2Title: "",
    album2Cover: "",
    album2Description: "",
    album2Credits: "",
    youtubeUrl: "",
    appleMusicUrl: "",
    instagramUrl: "",
    facebookUrl: "",
    contactEmail: "",
  })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setForm({
      bio: settings.bio || "",
      spotifyUrl: settings.spotifyUrl || "",
      spotifyTornasoladoUrl: settings.spotifyTornasoladoUrl || "",
      spotifyAlbum2Url: settings.spotifyAlbum2Url || "",
      album2Title: settings.album2Title || "Straight Street",
      album2Cover: settings.album2Cover || "",
      album2Description: settings.album2Description || "",
      album2Credits: settings.album2Credits || "",
      youtubeUrl: settings.youtubeUrl || "",
      appleMusicUrl: settings.appleMusicUrl || "",
      instagramUrl: settings.instagramUrl || "",
      facebookUrl: settings.facebookUrl || "",
      contactEmail: settings.contactEmail || "",
    })
  }, [settings])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateSettings(form)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Configuración</h2>
        <p className="text-muted-foreground">Bio, redes sociales y contacto</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Bio</CardTitle>
            <CardDescription>Texto que se muestra en la sección Bio del sitio</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={form.bio}
              onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
              rows={6}
              placeholder="Músico - Baterista - Compositor..."
            />
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Álbumes - Spotify</CardTitle>
            <CardDescription>Links de Spotify para cada álbum (botón "Obtener álbum")</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tornasolado — Spotify URL</Label>
              <Input value={form.spotifyTornasoladoUrl} onChange={(e) => setForm((f) => ({ ...f, spotifyTornasoladoUrl: e.target.value }))} placeholder="https://open.spotify.com/album/..." />
            </div>
            <div className="space-y-2">
              <Label>Álbum 2 — Título</Label>
              <Input value={form.album2Title} onChange={(e) => setForm((f) => ({ ...f, album2Title: e.target.value }))} placeholder="Straight Street" />
            </div>
            <div className="space-y-2">
              <Label>Álbum 2 — Spotify URL</Label>
              <Input value={form.spotifyAlbum2Url} onChange={(e) => setForm((f) => ({ ...f, spotifyAlbum2Url: e.target.value }))} placeholder="https://open.spotify.com/album/..." />
            </div>
            <div className="space-y-2">
              <Label>Álbum 2 — URL de portada</Label>
              <Input value={form.album2Cover} onChange={(e) => setForm((f) => ({ ...f, album2Cover: e.target.value }))} placeholder="/album2-cover.jpg o URL de imagen" />
            </div>
            <div className="space-y-2">
              <Label>Álbum 2 — Descripción</Label>
              <Input value={form.album2Description} onChange={(e) => setForm((f) => ({ ...f, album2Description: e.target.value }))} placeholder="Standards de jazz..." />
            </div>
            <div className="space-y-2">
              <Label>Álbum 2 — Integrantes</Label>
              <Input value={form.album2Credits} onChange={(e) => setForm((f) => ({ ...f, album2Credits: e.target.value }))} placeholder="Yago Agüero - Guitarra, Benjamin Groisman - Contrabajo..." />
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Redes Sociales</CardTitle>
            <CardDescription>URL general de Spotify (header/footer). Los álbumes tienen sus propios links arriba.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Spotify</Label>
              <Input value={form.spotifyUrl} onChange={(e) => setForm((f) => ({ ...f, spotifyUrl: e.target.value }))} placeholder="https://open.spotify.com/..." />
            </div>
            <div className="space-y-2">
              <Label>YouTube</Label>
              <Input value={form.youtubeUrl} onChange={(e) => setForm((f) => ({ ...f, youtubeUrl: e.target.value }))} placeholder="https://youtube.com/..." />
            </div>
            <div className="space-y-2">
              <Label>Apple Music</Label>
              <Input value={form.appleMusicUrl} onChange={(e) => setForm((f) => ({ ...f, appleMusicUrl: e.target.value }))} placeholder="https://music.apple.com/..." />
            </div>
            <div className="space-y-2">
              <Label>Instagram</Label>
              <Input value={form.instagramUrl} onChange={(e) => setForm((f) => ({ ...f, instagramUrl: e.target.value }))} placeholder="https://instagram.com/..." />
            </div>
            <div className="space-y-2">
              <Label>Facebook</Label>
              <Input value={form.facebookUrl} onChange={(e) => setForm((f) => ({ ...f, facebookUrl: e.target.value }))} placeholder="https://facebook.com/..." />
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Contacto</CardTitle>
            <CardDescription>Email mostrado en la sección de contacto</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Email de contacto</Label>
              <Input type="email" value={form.contactEmail} onChange={(e) => setForm((f) => ({ ...f, contactEmail: e.target.value }))} placeholder="contacto@example.com" />
            </div>
          </CardContent>
        </Card>

        <div className="mt-6">
          <Button type="submit">{saved ? "Guardado ✓" : "Guardar cambios"}</Button>
        </div>
      </form>
    </div>
  )
}
