import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { HeroSection } from "@/components/sections/HeroSection"
import { BioSection } from "@/components/sections/BioSection"
import { MusicSection } from "@/components/sections/MusicSection"
import { EventsSection } from "@/components/sections/EventsSection"
import { GallerySection } from "@/components/sections/GallerySection"
import { ContactSection } from "@/components/sections/ContactSection"

export function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <HeroSection />
        <BioSection />
        <MusicSection />
        <EventsSection />
        <GallerySection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
