"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Droplets, Flame, FlaskConical, Check } from "lucide-react"

const services = [
  {
    icon: Droplets,
    title: "Hyaluronsäure",
    description: "Natürliche Volumengebung und Faltenreduktion. Subtile Ergebnisse, die Ihre maskulinen Gesichtszüge betonen.",
    treatments: [
      "Faltenunterspritzung",
      "Lippenkonturierung", 
      "Gesichtskonturierung"
    ],
    priceFrom: "ab 250€"
  },
  {
    icon: Flame,
    title: "Lipolyse",
    description: "Nicht-operative Fettreduktion für definierte Konturen. Moderne Verfahren ohne Ausfallzeiten.",
    treatments: [
      "Doppelkinn-Behandlung",
      "Körperkonturierung",
      "Fettpolster-Reduktion"
    ],
    priceFrom: "ab 300€"
  },
  {
    icon: FlaskConical,
    title: "Hormon-Analyse",
    description: "Umfassende Diagnostik für optimale Gesundheit und Wohlbefinden. Wissenschaftlich fundiert.",
    treatments: [
      "Testosteron-Check",
      "Schilddrüsen-Diagnostik",
      "Vitamin-Status"
    ],
    priceFrom: "ab 150€"
  }
]

export function ServicesSection() {
  return (
    <section id="sec.menst-services" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-menst-primary mb-4">
            Unsere Spezialbereiche
          </h2>
          <p className="text-xl text-menst-steel max-w-2xl mx-auto">
            Maßgeschneiderte Behandlungen für maskuline Ästhetik
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md hover:-translate-y-2"
            >
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-menst-primary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-menst-gold transition-colors duration-300">
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
                <CardDescription className="text-menst-steel leading-relaxed">
                  {service.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <ul className="space-y-2">
                  {service.treatments.map((treatment, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-menst-steel">
                      <Check className="w-4 h-4 text-menst-gold flex-shrink-0" />
                      <span>{treatment}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="pt-4 border-t border-menst-cloud">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-menst-primary">
                      {service.priceFrom}
                    </span>
                    <Button variant="outline" size="sm">
                      Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" className="h-12 px-8">
            Alle Behandlungen ansehen
          </Button>
        </div>
      </div>
    </section>
  )
}