"use client"

import { Button } from "@/components/ui/button"
import { Briefcase, Star, Users, Award } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-menst-cloud via-menst-paper to-gray-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-menst-primary leading-tight tracking-tight">
                Professionelle Ästhetik für den{" "}
                <span className="text-menst-gold">erfolgreichen Mann</span>
              </h1>
              <p className="text-xl text-menst-steel leading-relaxed max-w-2xl">
                Diskrete, wissenschaftlich fundierte Behandlungen in maskuliner Atmosphäre. 
                Für Männer, die Exzellenz schätzen und natürliche Ergebnisse erwarten.
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-6 text-sm text-menst-steel">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-menst-gold" />
                <span>Facharzt-geführt</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-menst-gold" />
                <span>1000+ Männer behandelt</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-menst-gold" />
                <span>4.9/5 Bewertung</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="h-12 px-8 text-base font-semibold"
                id="cmp.menst-cta-primary"
              >
                Beratungstermin buchen
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="h-12 px-8 text-base"
              >
                Mehr erfahren
              </Button>
            </div>
          </div>

          {/* Visual Element */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="w-80 h-80 bg-gradient-to-br from-menst-primary to-menst-gold rounded-3xl shadow-2xl flex items-center justify-center animate-float">
                <Briefcase className="w-24 h-24 text-white opacity-90" />
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-menst-gold rounded-2xl shadow-lg flex items-center justify-center animate-pulse">
                <Star className="w-8 h-8 text-menst-primary" />
              </div>
              <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-white rounded-xl shadow-lg flex items-center justify-center border border-menst-cloud">
                <Users className="w-6 h-6 text-menst-primary" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}