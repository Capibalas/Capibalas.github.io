import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { productsService } from '../config/dataSource'

const ProductDetail = () => {
  const { productId } = useParams()
  const [isVisible, setIsVisible] = useState(false)
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Load product from Firebase
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true)
        setError(null)
        const productsData = await productsService.getProducts()
        const foundProduct = productsData.find(p => p.id === productId)
        
        if (foundProduct) {
          // Transform Firebase product to match expected format
          const transformedProduct = {
            ...foundProduct,
            category: getCategoryDisplayName(foundProduct.category),
            sku: `BWM-${foundProduct.id.slice(0, 8).toUpperCase()}`,
            inStock: foundProduct.stock > 0,
            rating: 4.8, // Default rating
            reviews: Math.floor(Math.random() * 200) + 50, // Random reviews
            features: foundProduct.features || [],
            specifications: foundProduct.specifications || getDefaultSpecifications(foundProduct),
            gallery: getProductGallery(foundProduct),
            description_long: foundProduct.description || "Producto de alta calidad diseñado para satisfacer las necesidades más exigentes."
          }
          setProduct(transformedProduct)
        } else {
          setError('Producto no encontrado')
        }
      } catch (err) {
        console.error('Error loading product:', err)
        setError('Error al cargar el producto')
        // Fallback to mock data if Firebase fails
        const mockProducts = {
          'sifon-profesional-05l': {
            id: 1,
            title: "Sifón Profesional 0.5L",
            description: "Sifón de aluminio anodizado con válvula de precisión para resultados perfectos en cada preparación culinaria.",
            image: "🥤",
            category: "Sifones",
            sku: "BWM-SP-05L",
            inStock: true,
            rating: 4.9,
            reviews: 127,
            features: [
              "Aluminio anodizado de alta calidad",
              "Válvula de precisión alemana",
              "Capacidad de 500ml",
              "Fácil limpieza y mantenimiento",
              "Diseño ergonómico",
              "Resistente a la corrosión"
            ],
            specifications: {
              "Capacidad": "500ml",
              "Material": "Aluminio anodizado",
              "Peso": "680g",
              "Dimensiones": "25cm x 8cm",
              "Presión máxima": "15 bar",
              "Garantía": "2 años"
            },
            gallery: ["🥤", "🔧", "📏", "✨"],
            description_long: "El Sifón Profesional 0.5L es la herramienta perfecta para chefs profesionales y entusiastas de la cocina que buscan crear espumas, mousses y texturas únicas. Fabricado con aluminio anodizado de primera calidad y equipado con una válvula de precisión alemana, garantiza resultados consistentes y profesionales en cada uso."
          }
        }
        setProduct(mockProducts[productId] || null)
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      loadProduct()
    }
  }, [productId])

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

  const getDefaultSpecifications = (product) => {
    const specs = {}
    if (product.price) specs["Precio"] = `$${product.price.toLocaleString()}`
    if (product.stock) specs["Stock"] = `${product.stock} unidades`
    if (product.minOrder) specs["Pedido mínimo"] = `${product.minOrder} unidades`
    if (product.category) specs["Categoría"] = getCategoryDisplayName(product.category)
    specs["Garantía"] = "1 año"
    return specs
  }

  const getProductGallery = (product) => {
    const gallery = []
    if (product.image && !product.image.startsWith('http')) {
      gallery.push(product.image)
    }
    // Add some default gallery items
    gallery.push("📦", "✨", "🔧", "📏")
    return gallery.slice(0, 4)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Cargando producto...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            {error || 'Producto no encontrado'}
          </h1>
          <p className="text-slate-600 mb-6">
            El producto que buscas no existe o no se pudo cargar.
          </p>
          <div className="space-x-4">
            <Link to="/productos" className="text-red-600 hover:text-red-700 font-medium">
              Ver todos los productos
            </Link>
            <span className="text-slate-400">|</span>
            <Link to="/" className="text-red-600 hover:text-red-700 font-medium">
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    )
  }

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
              <Link to="/#productos" className="text-slate-700 hover:text-red-600 transition-colors font-medium">
                Productos
              </Link>
              <Link to="/#contacto" className="text-slate-700 hover:text-red-600 transition-colors font-medium">
                Contacto
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <nav className="flex items-center space-x-2 text-sm text-slate-600">
          <Link to="/" className="hover:text-red-600 transition-colors">Inicio</Link>
          <span>/</span>
          <Link to="/#productos" className="hover:text-red-600 transition-colors">Productos</Link>
          <span>/</span>
          <span className="text-slate-900 font-medium">{product.name || product.title}</span>
        </nav>
      </div>

      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Product Images */}
          <div className={`transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
            <div className="bg-white rounded-3xl p-12 shadow-xl border border-white/50">
              <div className="text-center mb-8">
                <div className="w-48 h-48 mx-auto bg-gradient-to-br from-red-100 to-red-200 rounded-3xl flex items-center justify-center shadow-lg overflow-hidden">
                  {product.image && product.image.startsWith('http') ? (
                    <img
                      src={product.image}
                      alt={product.name || product.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="text-8xl" style={{ display: product.image && product.image.startsWith('http') ? 'none' : 'flex' }}>
                    {product.image || '🥤'}
                  </div>
                </div>
              </div>
              
              {/* Gallery */}
              <div className="grid grid-cols-4 gap-4">
                {product.gallery && product.gallery.length > 0 ? (
                  product.gallery.map((img, index) => (
                    <div key={index} className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center text-2xl cursor-pointer hover:scale-110 transition-transform duration-300 overflow-hidden">
                      {img && img.startsWith('http') ? (
                        <img
                          src={img}
                          alt={`${product.name || product.title} ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className="text-2xl" style={{ display: img && img.startsWith('http') ? 'none' : 'flex' }}>
                        {img || '🥤'}
                      </div>
                    </div>
                  ))
                ) : (
                  // Generate gallery from main image if no gallery exists
                  Array.from({ length: 4 }, (_, index) => (
                    <div key={index} className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center text-2xl cursor-pointer hover:scale-110 transition-transform duration-300 overflow-hidden">
                      {product.image && product.image.startsWith('http') ? (
                        <img
                          src={product.image}
                          alt={`${product.name || product.title} ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className="text-2xl" style={{ display: product.image && product.image.startsWith('http') ? 'none' : 'flex' }}>
                        {product.image || '🥤'}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
            <div className="space-y-6">
              {/* Category & SKU */}
              <div className="flex items-center space-x-4">
                <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                  {product.category}
                </span>
                <span className="text-slate-500 text-sm">SKU: {product.sku}</span>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-black text-slate-900">
                {product.name || product.title}
              </h1>

              {/* Rating */}
              <div className="flex items-center space-x-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-slate-300'}>
                      ⭐
                    </span>
                  ))}
                </div>
                <span className="text-slate-600 font-medium">{product.rating}</span>
                <span className="text-slate-500">({product.reviews} reseñas)</span>
              </div>

              

              {/* Description */}
              <p className="text-lg text-slate-600 leading-relaxed">
                {product.description_long}
              </p>

              {/* Features */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Características principales:</h3>
                <ul className="space-y-3">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-slate-700">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Stock Status */}
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                <span className="text-green-600 font-medium">En stock - Envío inmediato</span>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-4">
                <button className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-4 px-8 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-red-500/25">
                  Solicitar Cotización
                </button>
                <a
                  href={`https://wa.me/525660547499?text=Hola,%20me%20interesa%20obtener%20más%20información%20sobre%20el%20producto:%20${encodeURIComponent(product.name || product.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full border-2 border-red-500 text-red-600 hover:bg-red-50 py-4 px-8 rounded-2xl font-bold text-lg transition-all duration-300 block text-center"
                >
                  Contactar Especialista
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className={`mt-20 transition-all duration-1000 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-white rounded-3xl p-12 shadow-xl border border-white/50">
            <h2 className="text-3xl font-black text-slate-900 mb-8 text-center">
              Especificaciones Técnicas
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="bg-slate-50 rounded-xl p-6">
                  <div className="text-sm text-slate-600 font-medium mb-1">{key}</div>
                  <div className="text-lg font-bold text-slate-900">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail