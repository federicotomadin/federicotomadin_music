import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { HeroSection } from "@/components/sections/HeroSection"
import { BioSection } from "@/components/sections/BioSection"
import { MusicSection } from "@/components/sections/MusicSection"
import { ShopSection } from "@/components/sections/ShopSection"
import { EventsSection } from "@/components/sections/EventsSection"
import { SubscribeSection } from "@/components/sections/SubscribeSection"
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
        <ShopSection />
        <EventsSection />
        <SubscribeSection />
        <GallerySection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
