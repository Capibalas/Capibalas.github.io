import { useState, useEffect, useRef } from 'react'

const Products = () => {
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

  const products = [
    {
      id: 1,
      title: "Sifón Profesional 0.5L",
      description: "Sifón de aluminio anodizado con válvula de precisión para resultados perfectos",
      price: "$899",
      image: "🥤",
      features: ["Aluminio anodizado", "Válvula de precisión", "500ml capacidad", "Fácil limpieza"]
    },
    {
      id: 2,
      title: "Sifón Premium 1L",
      description: "Máxima capacidad para uso comercial con acabados de alta calidad",
      price: "$1,299",
      image: "🫧",
      features: ["1000ml capacidad", "Uso comercial", "Acabado premium", "Válvula reforzada"]
    },
    {
      id: 3,
      title: "Cápsulas N2O Premium",
      description: "Cápsulas de óxido nitroso de alta pureza para resultados profesionales",
      price: "$199",
      image: "💨",
      features: ["99.9% pureza", "Compatible universal", "Pack de 24 unidades", "Sellado hermético"]
    }
  ]

  return (
    <section id="productos" ref={sectionRef} className="py-20 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 right-10 w-32 h-32 bg-red-100 rounded-full opacity-50"></div>
        <div className="absolute bottom-20 left-10 w-48 h-48 bg-red-200 rounded-full opacity-30"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Nuestros <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">Productos</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Equipamiento profesional para chefs y entusiastas de la cocina que buscan la excelencia
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <div
              key={product.id}
              className={`group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              {/* Product Icon */}
              <div className="text-center mb-6">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-300">
                  {product.image}
                </div>
              </div>

              {/* Product Info */}
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors">
                  {product.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {product.description}
                </p>
                
                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {product.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center justify-center text-sm text-gray-500">
                      <span className="w-2 h-2 bg-red-400 rounded-full mr-3"></span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Price */}
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800 mb-6">
                  {product.price}
                </div>

                {/* CTA Button */}
                <button className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-6 rounded-full font-semibold transition-all duration-300 transform group-hover:scale-105 hover:shadow-lg hover:shadow-red-500/25">
                  Obtener Información
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className={`text-center mt-16 transition-all duration-1000 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-2xl p-8 border border-red-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              ¿Necesitas una solución personalizada?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Contáctanos para asesoría especializada y encuentra el equipamiento perfecto para tus necesidades culinarias
            </p>
            <button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-8 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/25">
              Contactar Especialista
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Products