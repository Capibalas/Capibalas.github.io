import { useState, useEffect } from 'react'

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-red-900 via-red-800 to-slate-900">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-red-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-red-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-red-400/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-50 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className={`text-2xl font-bold text-white transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
            Best<span className="italic text-red-300">Whip</span><span className="text-red-400">MX</span>
          </div>
          <div className={`hidden md:flex space-x-8 transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
            <a href="#productos" className="text-white hover:text-red-300 transition-colors">Productos</a>
            <a href="#caracteristicas" className="text-white hover:text-red-300 transition-colors">Características</a>
            <a href="#contacto" className="text-white hover:text-red-300 transition-colors">Contacto</a>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 text-center max-w-6xl mx-auto px-6">
        <h1 className={`text-5xl md:text-7xl font-bold text-white mb-6 transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          Transforma tu
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-300 to-red-500 animate-pulse">
            Experiencia Culinaria
          </span>
        </h1>
        
        <p className={`text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          Descubre la perfección en cada preparación con nuestros sifones profesionales y cápsulas de N2O de alta calidad
        </p>

        <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-1000 delay-900 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/25">
            Ver Productos
          </button>
          <button className="border-2 border-white text-white hover:bg-white hover:text-red-900 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105">
            Obtener Información
          </button>
        </div>

        {/* Floating animation icons */}
        <div className="absolute top-10 left-10 animate-bounce delay-1000">
          <div className="w-8 h-8 bg-red-400/30 rounded-full"></div>
        </div>
        <div className="absolute top-20 right-16 animate-bounce delay-1500">
          <div className="w-6 h-6 bg-red-300/30 rounded-full"></div>
        </div>
        <div className="absolute bottom-20 left-20 animate-bounce delay-2000">
          <div className="w-10 h-10 bg-red-500/30 rounded-full"></div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-1200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="flex flex-col items-center text-white">
          <span className="text-sm mb-2">Desliza para explorar</span>
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero