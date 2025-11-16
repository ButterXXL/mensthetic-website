"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, MapPin, Clock } from "lucide-react"

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Here you would integrate with your analytics system
      if (typeof window !== 'undefined' && (window as any).menstheticAnalytics) {
        await (window as any).menstheticAnalytics.submitContactForm(formData)
      }
      
      // Show success message
      alert('Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet.')
      setFormData({ name: "", email: "", phone: "", message: "" })
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Es gab einen Fehler beim Senden. Bitte versuchen Sie es erneut.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <section id="sec.menst-cta-booking" className="py-20 bg-gradient-to-br from-menst-primary via-menst-primary to-slate-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Bereit für den ersten Schritt?
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Vereinbaren Sie Ihr kostenloses Beratungsgespräch
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <Card className="shadow-2xl">
            <CardHeader>
              <CardTitle>Kontaktformular</CardTitle>
              <CardDescription>
                Füllen Sie das Formular aus und wir melden uns innerhalb von 24 Stunden bei Ihnen.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-menst-ink mb-2">
                    Name *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="h-12"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-menst-ink mb-2">
                    E-Mail *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="h-12"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-menst-ink mb-2">
                    Telefon (optional)
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="h-12"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-menst-ink mb-2">
                    Nachricht
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Beschreiben Sie kurz Ihre Wünsche oder Fragen..."
                    rows={4}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full h-12"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Wird gesendet...' : 'Nachricht senden'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            <Card className="bg-white/10 backdrop-blur border-white/20 text-white">
              <CardHeader>
                <CardTitle className="text-white">Kontaktinformationen</CardTitle>
                <CardDescription className="text-white/80">
                  Wir sind für Sie da
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-menst-gold mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Adresse</h4>
                    <p className="text-white/80">
                      Musterstraße 123<br />
                      12345 Berlin
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Phone className="w-6 h-6 text-menst-gold mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Telefon</h4>
                    <p className="text-white/80">+49 30 12345678</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-menst-gold mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">E-Mail</h4>
                    <p className="text-white/80">info@mensthetic.de</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Clock className="w-6 h-6 text-menst-gold mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Öffnungszeiten</h4>
                    <div className="text-white/80 space-y-1">
                      <p>Mo-Fr: 9:00-18:00 Uhr</p>
                      <p>Sa: 10:00-14:00 Uhr</p>
                      <p>So: Geschlossen</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-menst-gold text-menst-primary">
              <CardContent className="p-8 text-center">
                <h4 className="text-xl font-bold mb-2">Beratungsgespräch</h4>
                <p className="text-2xl font-bold mb-2">Kostenlos</p>
                <p className="text-sm opacity-80">
                  Ausführliche Analyse und individueller Behandlungsplan
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}