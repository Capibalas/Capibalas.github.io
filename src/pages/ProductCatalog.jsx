import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { productsService } from '../config/dataSource'

const ProductCatalog = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Load products from Firebase
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        const productsData = await productsService.getProducts()
        
        // Transform Firebase products to match expected format
        const transformedProducts = productsData.map(product => ({
          ...product,
          categoryName: getCategoryDisplayName(product.category),
          rating: 4.8, // Default rating since it's not in Firebase yet
          reviews: Math.floor(Math.random() * 200) + 50, // Random reviews for now
          inStock: product.stock > 0,
          isNew: Math.random() > 0.7, // Random new flag
          isOffer: Math.random() > 0.6, // Random offer flag
          features: product.features || []
        }))
        
        setProducts(transformedProducts)
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
            category: "sifones",
            categoryName: "Sifones",
            rating: 4.9,
            reviews: 127,
            inStock: true,
            isNew: false,
            isOffer: true,
            features: ["Aluminio anodizado", "Válvula de precisión", "500ml capacidad", "Fácil limpieza"]
          },
          {
            id: 'sifon-premium-1l',
            title: "Sifón Premium 1L",
            description: "Máxima capacidad para uso comercial con acabados de alta calidad",
            image: "🫧",
            category: "sifones",
            categoryName: "Sifones",
            rating: 4.8,
            reviews: 89,
            inStock: true,
            isNew: true,
            isOffer: true,
            features: ["1000ml capacidad", "Uso comercial", "Acabado premium", "Válvula reforzada"]
          },
          {
            id: 'capsulas-n2o-premium',
            title: "Cápsulas N2O Premium",
            description: "Cápsulas de óxido nitroso de alta pureza para resultados profesionales",
            image: "💨",
            category: "capsulas",
            categoryName: "Cápsulas",
            rating: 4.9,
            reviews: 234,
            inStock: true,
            isNew: false,
            isOffer: true,
            features: ["99.9% pureza", "Compatible universal", "Pack de 24 unidades", "Sellado hermético"]
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  const getCategoryDisplayName = (category) => {
    switch (category) {
      case 'sifones':
        return 'Sifones'
      case 'capsulas':
        return 'Cápsulas'
      case 'kits':
        return 'Kits'
      case 'accesorios':
        return 'Accesorios'
      default:
        return category
    }
  }

  const categories = [
    { id: 'all', name: 'Todos los productos' },
    { id: 'sifones', name: 'Sifones' },
    { id: 'capsulas', name: 'Cápsulas' },
    { id: 'kits', name: 'Kits Completos' }
  ]

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-md shadow-xl border-b border-slate-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="group flex items-center space-x-2">
              <img 
                src="/logo png.png" 
                alt="BestWhipMX Logo" 
                className="h-12 w-auto"
              />
            </Link>
            <div className="flex items-center space-x-6">
              <Link to="/" className="text-slate-700 hover:text-red-600 transition-colors font-medium">
                Inicio
              </Link>
              <Link to="/productos" className="text-red-600 font-medium">
                Productos
              </Link>
              <Link to="/#contacto" className="text-slate-700 hover:text-red-600 transition-colors font-medium">
                Contacto
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className={`text-5xl md:text-6xl font-black mb-6 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            Catálogo de Productos
          </h1>
          <p className={`text-xl md:text-2xl text-red-100 max-w-3xl mx-auto transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            Descubre nuestra gama completa de sifones profesionales, cápsulas de N2O y kits especializados
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Category Filter */}
        <div className={`mb-12 transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
                    : 'bg-white text-slate-700 hover:bg-red-50 hover:text-red-600 border-2 border-slate-200 hover:border-red-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
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
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No hay productos en esta categoría</h3>
            <p className="text-slate-600">Intenta seleccionar una categoría diferente.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, index) => (
              <Link
                key={product.id}
                to={`/producto/${product.id}`}
                className={`group block transition-all duration-500 transform hover:-translate-y-2 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/50 overflow-hidden h-full">
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.isNew && (
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        NUEVO
                      </span>
                    )}
                    {product.isOffer && (
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        OFERTA
                      </span>
                    )}
                  </div>

                  {/* Stock Status */}
                  <div className="absolute top-4 right-4">
                    <span className={`w-3 h-3 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  </div>

                  {/* Background gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 to-red-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Product Icon/Image */}
                  <div className="relative text-center mb-6">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center text-4xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg overflow-hidden">
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
                      <div className="w-full h-full flex items-center justify-center text-4xl" style={{display: product.image && product.image.startsWith('http') ? 'none' : 'flex'}}>
                        {product.image && !product.image.startsWith('http') ? product.image : '📦'}
                      </div>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="relative text-center space-y-4">
                    <div className="text-sm text-red-600 font-medium">{product.categoryName}</div>
                    
                    <h3 className="text-xl font-black text-slate-900 group-hover:text-red-600 transition-colors duration-300">
                      {product.title}
                    </h3>
                    
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {product.description}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center justify-center space-x-1">
                      <div className="flex text-yellow-400 text-sm">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-slate-300'}>
                            ⭐
                          </span>
                        ))}
                      </div>
                      <span className="text-slate-600 text-sm">({product.reviews})</span>
                    </div>
                    
                    {/* Features */}
                    <ul className="space-y-2 text-sm">
                      {(product.features || []).slice(0, 2).map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center justify-center text-slate-600">
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {/* Price Display (if available) */}
                    {product.price && (
                      <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                        <p className="text-sm text-red-600 mb-1">Precio desde</p>
                        <p className="text-xl font-bold text-red-700">${product.price.toLocaleString()}</p>
                      </div>
                    )}

                    {/* CTA */}
                    <div className="pt-4">
                      <div className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-6 rounded-xl font-bold transition-all duration-300 transform group-hover:scale-105 text-sm">
                        Ver Detalles
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className={`text-center mt-20 transition-all duration-1000 delay-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-3xl p-12 border border-red-200/50">
            <h3 className="text-3xl font-black text-slate-900 mb-6">
              ¿No encuentras lo que buscas?
            </h3>
            <p className="text-slate-600 mb-8 max-w-2xl mx-auto text-lg">
              Contáctanos para soluciones personalizadas y asesoría especializada
            </p>
            <Link
              to="/#contacto"
              className="inline-block bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-4 px-8 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-red-500/25"
            >
              Contactar Especialista
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCatalog