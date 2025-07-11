import { useState, useEffect, useRef } from 'react'

const Features = () => {
  const [isVisible, setIsVisible] = useState(false)
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

  const features = [
    {
      icon: "🤝",
      title: "Tu Aliado Estratégico",
      description: "No solo vendemos productos, somos tu socio comercial que se encarga de toda la cadena de importación para que tú te enfoques en tu negocio"
    },
    {
      icon: "🌍",
      title: "Olvídate de Importar",
      description: "Nosotros nos ocupamos de toda la logística internacional: trámites aduanales, permisos, transporte y almacenamiento"
    },
    {
      icon: "📦",
      title: "Inventario Siempre Disponible",
      description: "Mantenemos stock permanente en México para garantizar entregas inmediatas sin esperas de importación"
    },
    {
      icon: "💰",
      title: "Precios Competitivos",
      description: "Al importar en grandes volúmenes, te ofrecemos los mejores precios del mercado con márgenes atractivos para tu negocio"
    },
    {
      icon: "🚚",
      title: "Logística Completa",
      description: "Entrega directa a tu negocio con rutas optimizadas y seguimiento en tiempo real de todos tus pedidos"
    },
    {
      icon: "🎯",
      title: "Soporte Comercial 360°",
      description: "Capacitación técnica, material promocional, asesoría de ventas y soporte post-venta especializado"
    },
    {
      icon: "📈",
      title: "Crecimiento Conjunto",
      description: "Planes de crecimiento personalizados, financiamiento flexible y estrategias de mercado para expandir tu negocio"
    },
    {
      icon: "🔒",
      title: "Garantía Total",
      description: "Respaldamos cada producto con garantía completa y servicio técnico especializado en territorio nacional"
    },
    {
      icon: "⚡",
      title: "Respuesta Inmediata",
      description: "Equipo dedicado disponible para resolver cualquier situación comercial o técnica en tiempo récord"
    }
  ]

  const benefits = [
    "Eliminas todos los riesgos y costos de importación",
    "Reduces tiempo de gestión administrativa",
    "Obtienes precios mayoristas sin volúmenes mínimos",
    "Accedes a productos premium con garantía local",
    "Recibes soporte técnico y comercial especializado",
    "Cuentas con inventario disponible 24/7",
    "Optimizas tu flujo de caja con términos flexibles"
  ]

  return (
    <section id="caracteristicas" ref={sectionRef} className="py-20 bg-gradient-to-br from-slate-50 to-gray-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-64 h-64 bg-gradient-to-r from-red-200/20 to-red-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-to-r from-red-300/20 to-red-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            ¿Por qué elegir <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">BestWhip</span> como tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">Socio Estratégico</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
            <strong>No solo vendemos productos</strong> - somos tu aliado estratégico que se encarga de toda la importación para que tú te enfoques en hacer crecer tu negocio
          </p>
          <div className="bg-red-50 border-l-4 border-red-500 p-4 max-w-4xl mx-auto rounded-r-lg">
            <p className="text-lg text-red-800 font-semibold">
              🤝 <strong>Tu Socio Estratégico:</strong> Nosotros nos ocupamos de importar, tú te ocupas de vender
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-white/50 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-red-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Benefits Section */}
        <div className={`bg-gradient-to-r from-red-500 to-red-600 rounded-3xl p-12 text-white transition-all duration-1000 delay-800 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-6">
                Tu Socio Estratégico de Confianza
              </h3>
              <p className="text-red-100 text-lg mb-8 leading-relaxed">
                Únete a cientos de empresarios que han simplificado su operación al confiar en nosotros toda la gestión de importación y logística.
              </p>
              <button className="bg-white text-red-600 hover:bg-gray-100 px-8 py-4 rounded-full font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                Comenzar Ahora
              </button>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-6 text-red-100">
                Ventajas de ser nuestro socio comercial:
              </h4>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li
                    key={index}
                    className={`flex items-center text-white transition-all duration-500 ${
                      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
                    }`}
                    style={{ transitionDelay: `${1000 + index * 100}ms` }}
                  >
                    <div className="w-3 h-3 bg-red-200 rounded-full mr-4 flex-shrink-0"></div>
                    <span className="text-lg">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className={`mt-20 grid grid-cols-2 lg:grid-cols-4 gap-8 transition-all duration-1000 delay-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {[
            { number: "200+", label: "Socios Comerciales" },
            { number: "99.9%", label: "Disponibilidad Stock" },
            { number: "24/7", label: "Soporte Comercial" },
            { number: "100%", label: "Gestión Importación" }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features