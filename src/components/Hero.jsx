import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/whipped.mp4" type="video/mp4" />
        </video>
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
        {/* Gradient overlay for enhanced visual effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30"></div>
      </div>


      {/* Hero Content */}
      <div className="relative z-10 text-center max-w-7xl mx-auto px-6">
        <div className={`mb-8 transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <span className="inline-block bg-gradient-to-r from-emerald-400/20 to-blue-400/20 backdrop-blur-sm border border-white/20 rounded-full px-6 py-2 text-white/90 text-sm font-medium mb-6">
            ✨ Tecnología Culinaria Profesional
          </span>
        </div>
        
        <h1 className={`text-6xl md:text-8xl font-black text-white mb-8 transition-all duration-1000 delay-500 leading-tight ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          Transforma tu
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-red-500 to-red-600 animate-pulse">
            Experiencia Culinaria
          </span>
        </h1>
        
        <p className={`text-xl md:text-2xl text-white/80 mb-12 max-w-4xl mx-auto leading-relaxed transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          Descubre la perfección en cada preparación con nuestros sifones profesionales y cápsulas de N2O de alta calidad.
          <span className="block mt-2 text-lg text-white/60">Eleva tus creaciones culinarias al siguiente nivel</span>
        </p>

        <div className={`flex flex-col sm:flex-row gap-6 justify-center items-center transition-all duration-1000 delay-900 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <Link to="/productos" className="group bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-10 py-4 rounded-2xl text-lg font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/25 flex items-center space-x-2">
            <span>Ver Productos</span>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <Link to="/login" className="group border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-slate-900 px-10 py-4 rounded-2xl text-lg font-bold transition-all duration-300 transform hover:scale-105 flex items-center space-x-2">
            <span>Portal B2B</span>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Stats */}
        <div className={`mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 transition-all duration-1000 delay-1100 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {[
            { number: "500+", label: "Chefs Satisfechos" },
            { number: "99.9%", label: "Pureza N2O" },
            { number: "24/7", label: "Soporte" },
            { number: "2 años", label: "Garantía" }
          ].map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-blue-300 mb-2 group-hover:scale-110 transition-transform duration-300">
                {stat.number}
              </div>
              <div className="text-white/70 font-medium text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-1200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="flex flex-col items-center text-white/80">
          <span className="text-sm mb-3 font-medium">Desliza para explorar</span>
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center hover:border-emerald-400 transition-colors duration-300">
            <div className="w-1 h-3 bg-gradient-to-b from-emerald-400 to-blue-400 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero