import { useState, useEffect, useRef } from 'react'
import { sendContactEmail } from '../services/emailService'

const ContactForm = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    business: '',
    interest: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Enviar email mediante EmailJS
      try {
        await sendContactEmail(formData)
        console.log('Email enviado exitosamente')
      } catch (emailError) {
        console.warn('No se pudo enviar el email:', emailError)
        // Continuar con WhatsApp aunque falle el email
      }
      
      // Create WhatsApp message
      const whatsappMessage = `Hola, me interesa obtener información sobre sus productos.

*Datos de contacto:*
• Nombre: ${formData.name}
• Email: ${formData.email}
• Teléfono: ${formData.phone || 'No proporcionado'}
• Tipo de Negocio: ${formData.business || 'No especificado'}
• Producto de Interés: ${formData.interest || 'Información general'}

*Mensaje:*
${formData.message || 'Sin mensaje adicional'}

Gracias por su atención.`
      
      // Create WhatsApp link
      const whatsappLink = `https://wa.me/525660547499?text=${encodeURIComponent(whatsappMessage)}`
      
      // Open WhatsApp
      window.open(whatsappLink, '_blank')
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setIsSubmitting(false)
      setSubmitted(true)
      
      // Reset form after 5 seconds
      setTimeout(() => {
        setSubmitted(false)
        setFormData({
          name: '',
          email: '',
          phone: '',
          business: '',
          interest: '',
          message: ''
        })
      }, 5000)
    } catch (error) {
      console.error('Error en el envío del formulario:', error)
      setIsSubmitting(false)
      // Aún así abrir WhatsApp como fallback
      const whatsappMessage = `Hola, me interesa obtener información sobre sus productos. Nombre: ${formData.name}, Email: ${formData.email}`
      const whatsappLink = `https://wa.me/525660547499?text=${encodeURIComponent(whatsappMessage)}`
      window.open(whatsappLink, '_blank')
    }
  }

  const interestOptions = [
    "Sifón Profesional 0.5L",
    "Sifón Premium 1L", 
    "Cápsulas N2O Premium",
    "Paquete Completo",
    "Asesoría Personalizada"
  ]

  return (
    <section id="contacto" ref={sectionRef} className="py-20 bg-gradient-to-br from-slate-900 via-red-900 to-red-800 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-red-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            ¿Listo para <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-300 to-red-400">Comenzar</span>?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Obtén información personalizada y precios especiales para tu negocio
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Contact Information */}
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
            <div className="space-y-8">
              <div>
                <h3 className="text-3xl font-bold text-white mb-6">
                  Conecta con Nosotros
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Nuestro equipo de especialistas está listo para ayudarte a encontrar la solución perfecta para tus necesidades culinarias.
                </p>
              </div>

              {/* Contact Methods */}
              <div className="space-y-6">
                {[
                  { icon: "📞", title: "Teléfono", info: "+52 (56) 6054-7499", desc: "Lun - Vie: 9:00 AM - 6:00 PM", href: "tel:+525660547499" },
                  { icon: "✉️", title: "Email", info: "contacto@bestwhipmx.com", desc: "Respuesta en 24 horas", href: "mailto:contacto@bestwhipmx.com" },
                  { icon: "📍", title: "Ubicación", info: "Ciudad de México", desc: "Envíos a toda la República", href: null },
                  { icon: "💬", title: "WhatsApp", info: "+52 (56) 6054-7499", desc: "Atención inmediata", href: "https://wa.me/525660547499?text=Hola,%20me%20interesa%20obtener%20información%20sobre%20sus%20productos%20de%20sifones%20y%20cápsulas%20N2O." }
                ].map((contact, index) => (
                  contact.href ? (
                    <a
                      key={index}
                      href={contact.href}
                      target={contact.title === "WhatsApp" ? "_blank" : "_self"}
                      rel={contact.title === "WhatsApp" ? "noopener noreferrer" : undefined}
                      className="flex items-start space-x-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer transform hover:scale-105"
                    >
                      <div className="text-2xl">{contact.icon}</div>
                      <div>
                        <h4 className="text-white font-semibold">{contact.title}</h4>
                        <p className="text-red-300 font-medium">{contact.info}</p>
                        <p className="text-gray-400 text-sm">{contact.desc}</p>
                      </div>
                    </a>
                  ) : (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                      <div className="text-2xl">{contact.icon}</div>
                      <div>
                        <h4 className="text-white font-semibold">{contact.title}</h4>
                        <p className="text-red-300 font-medium">{contact.info}</p>
                        <p className="text-gray-400 text-sm">{contact.desc}</p>
                      </div>
                    </div>
                  )
                ))}
              </div>

              {/* Benefits */}
              <div className="bg-gradient-to-r from-red-500/20 to-red-600/20 backdrop-blur-sm rounded-xl p-6 border border-red-400/30">
                <h4 className="text-white font-bold mb-4">🎁 Beneficios Exclusivos</h4>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center"><span className="w-2 h-2 bg-red-400 rounded-full mr-3"></span>Descuentos por volumen</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-red-400 rounded-full mr-3"></span>Asesoría técnica gratuita</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-red-400 rounded-full mr-3"></span>Garantía extendida</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-red-400 rounded-full mr-3"></span>Soporte prioritario</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              {!submitted ? (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white font-medium mb-2">Nombre Completo *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/50 transition-all duration-300"
                        placeholder="Tu nombre"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/50 transition-all duration-300"
                        placeholder="tu@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white font-medium mb-2">Teléfono</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/50 transition-all duration-300"
                        placeholder="+52 (56) 6054-7499"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">Tipo de Negocio</label>
                      <input
                        type="text"
                        name="business"
                        value={formData.business}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/50 transition-all duration-300"
                        placeholder="Restaurante, Hotel, etc."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Producto de Interés</label>
                    <select
                      name="interest"
                      value={formData.interest}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/50 transition-all duration-300"
                    >
                      <option value="" className="text-gray-900">Selecciona un producto</option>
                      {interestOptions.map((option, index) => (
                        <option key={index} value={option} className="text-gray-900">{option}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Mensaje</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/50 transition-all duration-300 resize-none"
                      placeholder="Cuéntanos sobre tus necesidades específicas..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-500 disabled:to-gray-600 text-white py-4 px-6 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/25 disabled:transform-none disabled:shadow-none flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                        Enviando...
                      </>
                    ) : (
                      'Contactar por WhatsApp 💬'
                    )}
                  </button>
                </form>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                    <span className="text-3xl">✅</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">¡Mensaje Enviado!</h3>
                  <p className="text-gray-300">
                    Gracias por tu interés. Nos pondremos en contacto contigo muy pronto.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactForm