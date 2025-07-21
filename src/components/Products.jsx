import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { productsService } from '../config/dataSource'

const Products = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
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

  // Load products from Firebase
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        const productsData = await productsService.getProducts()
        // Limit to first 3 products for the homepage section
        setProducts(productsData.slice(0, 3))
      } catch (err) {
        console.error('Error loading products:', err)
        setError('Error al cargar los productos')
        // Fallback to mock data if Firebase fails
        setProducts([
          {
            id: 'sifon-profesional-05l',
            title: "Sifón Profesional 0.5L",
            description: "Sifón de aluminio anodizado con válvula de precisión para resultados perfectos",
            image: "🥤",
            features: ["Aluminio anodizado", "Válvula de precisión", "500ml capacidad", "Fácil limpieza"]
          },
          {
            id: 'sifon-premium-1l',
            title: "Sifón Premium 1L",
            description: "Máxima capacidad para uso comercial con acabados de alta calidad",
            image: "🫧",
            features: ["1000ml capacidad", "Uso comercial", "Acabado premium", "Válvula reforzada"]
          },
          {
            id: 'capsulas-n2o-premium',
            title: "Cápsulas N2O Premium",
            description: "Cápsulas de óxido nitroso de alta pureza para resultados profesionales",
            image: "💨",
            features: ["99.9% pureza", "Compatible universal", "Pack de 24 unidades", "Sellado hermético"]
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  return (
    <section id="productos" ref={sectionRef} className="py-24 bg-gradient-to-br from-white via-slate-50 to-emerald-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 right-10 w-32 h-32 bg-emerald-100 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-48 h-48 bg-blue-100 rounded-full opacity-40 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-100 rounded-full opacity-30 animate-pulse delay-500"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-block bg-gradient-to-r from-emerald-400/20 to-blue-400/20 backdrop-blur-sm border border-white/30 rounded-full px-6 py-2 mb-6">
            <span className="text-emerald-600 font-semibold text-sm">🚀 Productos Premium</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-6">
            Nuestros <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-600">Productos</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-medium">
            Equipamiento profesional de última generación para chefs y entusiastas de la cocina que buscan la excelencia culinaria
          </p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-600 font-medium">Cargando productos...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold text-red-800 mb-2">Error al cargar productos</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Reintentar
              </button>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No hay productos disponibles</h3>
            <p className="text-slate-600">Los productos se mostrarán aquí una vez que estén configurados.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {products.map((product, index) => (
              <div
                key={product.id}
                className={`group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 border border-white/50 overflow-hidden ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                {/* Background gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Product Icon/Image */}
                <div className="relative text-center mb-8">
                  <div className="w-28 h-28 mx-auto bg-gradient-to-br from-emerald-100 to-blue-100 rounded-2xl flex items-center justify-center text-5xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg overflow-hidden">
                    {product.image && product.image.startsWith('http') ? (
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="w-full h-full flex items-center justify-center text-5xl" style={{display: product.image && product.image.startsWith('http') ? 'none' : 'flex'}}>
                      {product.image && !product.image.startsWith('http') ? product.image : '📦'}
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                </div>

                {/* Product Info */}
                <div className="relative text-center">
                  <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-emerald-600 group-hover:to-blue-600 transition-all duration-300">
                    {product.title}
                  </h3>
                  <p className="text-slate-600 mb-6 leading-relaxed font-medium">
                    {product.description}
                  </p>
                  
                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {(product.features || []).slice(0, 4).map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center justify-center text-sm text-slate-600 font-medium">
                        <span className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full mr-3 group-hover:scale-150 transition-transform duration-300"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Price Display (if available) */}
                  {product.price && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl border border-emerald-200">
                      <p className="text-sm text-slate-600 mb-1">Precio desde</p>
                      <p className="text-2xl font-bold text-emerald-600">${product.price.toLocaleString()}</p>
                    </div>
                  )}

                  {/* CTA Buttons */}
                  <div className="space-y-3">
                    <Link
                      to={`/producto/${product.id}`}
                      className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white py-3 px-6 rounded-2xl font-bold transition-all duration-300 transform group-hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/25 flex items-center justify-center space-x-2"
                    >
                      <span>Ver Detalles</span>
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                    <a
                      href={`https://wa.me/525660547499?text=Hola,%20me%20interesa%20obtener%20más%20información%20sobre%20el%20producto:%20${encodeURIComponent(product.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 py-3 px-6 rounded-2xl font-bold transition-all duration-300 transform group-hover:scale-105 flex items-center justify-center space-x-2"
                    >
                      <span>Obtener Información</span>
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className={`text-center mt-20 transition-all duration-1000 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="relative bg-gradient-to-br from-emerald-50 to-blue-50 rounded-3xl p-12 border border-white/50 overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-200/30 to-blue-200/30 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-purple-200/30 to-emerald-200/30 rounded-full translate-y-12 -translate-x-12"></div>
            
            <div className="relative z-10">
              <div className="inline-block bg-gradient-to-r from-emerald-400/20 to-blue-400/20 backdrop-blur-sm border border-white/30 rounded-full px-6 py-2 mb-6">
                <span className="text-emerald-600 font-semibold text-sm">💡 Soluciones Personalizadas</span>
              </div>
              
              <h3 className="text-3xl font-black text-slate-900 mb-6">
                ¿Necesitas una solución <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">personalizada</span>?
              </h3>
              
              <p className="text-slate-600 mb-8 max-w-3xl mx-auto text-lg leading-relaxed font-medium">
                Contáctanos para asesoría especializada y encuentra el equipamiento perfecto para tus necesidades culinarias.
                Nuestro equipo de expertos te ayudará a elegir la mejor solución.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="https://wa.me/525660547499?text=Hola,%20me%20interesa%20obtener%20asesoría%20especializada%20sobre%20sus%20productos%20de%20sifones%20y%20cápsulas%20N2O."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white py-4 px-8 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/25 flex items-center space-x-2"
                >
                  <span>Contactar Especialista</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </a>
                
                <Link to="/productos" className="group border-2 border-slate-300 hover:border-red-500 text-slate-700 hover:text-red-600 py-4 px-8 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 flex items-center space-x-2">
                  <span>Ver Catálogo Completo</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Products