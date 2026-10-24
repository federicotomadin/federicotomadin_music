import { SubscribeBox } from "@/components/sections/SubscribeBox"

export function SubscribeSection() {
  return (
    <section id="novedades" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-6 lg:px-12">
        <SubscribeBox className="max-w-3xl mx-auto" />
      </div>
    </section>
  )
}
