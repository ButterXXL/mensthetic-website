import { HeroSection } from "@/components/mensthetic/hero-section"
import { ServicesSection } from "@/components/mensthetic/services-section" 
import { ContactSection } from "@/components/mensthetic/contact-section"

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ServicesSection />
      <ContactSection />
    </main>
  )
}