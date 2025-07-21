import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { productsService, ordersService } from '../firebase/services'

const MakeOrder = () => {
  const { user } = useAuth()
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showCart, setShowCart] = useState(true)
  const [orderStep, setOrderStep] = useState('products') // products, checkout, confirmation
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [orderData, setOrderData] = useState({
    shippingAddress: '',
    city: '',
    postalCode: '',
    paymentMethod: 'transferencia',
    notes: ''
  })
  const [shippingCost, setShippingCost] = useState(0)
  const [shippingCalculated, setShippingCalculated] = useState(false)

  // Constantes para cálculos
  const IVA_RATE = 0.16 // 16% IVA en México

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        const productsData = await productsService.getProducts()
        setProducts(productsData)
      } catch (err) {
        console.error('Error loading products:', err)
        setError('Error al cargar los productos. Por favor, intenta de nuevo.')
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  const categories = [
    { id: 'all', name: 'Todos los productos' },
    { id: 'sifones', name: 'Sifones' },
    { id: 'capsulas', name: 'Cápsulas' },
    { id: 'kits', name: 'Kits Completos' }
  ]

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory)

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id)
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + product.minOrder }
          : item
      ))
    } else {
      setCart([...cart, { ...product, quantity: product.minOrder }])
    }
    // Resetear cálculo de envío cuando cambie el carrito
    setShippingCalculated(false)
    setShippingCost(0)
  }

  const updateQuantity = (productId, newQuantity) => {
    const product = products.find(p => p.id === productId)
    if (newQuantity < product.minOrder) return
    
    setCart(cart.map(item =>
      item.id === productId
        ? { ...item, quantity: newQuantity }
        : item
    ))
    // Resetear cálculo de envío cuando cambie la cantidad
    setShippingCalculated(false)
    setShippingCost(0)
  }

  // Función para agregar cajas completas de cápsulas
  const addBoxToCart = (product, boxSize) => {
    const existingItem = cart.find(item => item.id === product.id)
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + boxSize }
          : item
      ))
    } else {
      setCart([...cart, { ...product, quantity: boxSize }])
    }
    // Resetear cálculo de envío cuando cambie el carrito
    setShippingCalculated(false)
    setShippingCost(0)
  }

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId))
    // Resetear cálculo de envío cuando se remueva un producto
    setShippingCalculated(false)
    setShippingCost(0)
  }

  const getSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getIVA = () => {
    return getSubtotal() * IVA_RATE
  }

  const getCartTotal = () => {
    return getSubtotal() + getIVA() + shippingCost
  }

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  // Función para calcular envío basado en código postal y peso
  const calculateShipping = async (postalCode, city) => {
    try {
      // Simular cálculo de envío basado en ubicación
      const weight = getCartItemCount() * 0.1 // Estimamos 100g por producto
      let baseCost = 150 // Costo base de envío
      
      // Ajustar costo según la ciudad/región
      const cityLower = city.toLowerCase()
      if (cityLower.includes('cdmx') || cityLower.includes('ciudad de mexico') || cityLower.includes('df')) {
        baseCost = 100 // CDMX más barato
      } else if (cityLower.includes('guadalajara') || cityLower.includes('monterrey') || cityLower.includes('puebla')) {
        baseCost = 120 // Ciudades principales
      } else if (postalCode.startsWith('0') || postalCode.startsWith('1')) {
        baseCost = 100 // Zona metropolitana
      } else {
        baseCost = 180 // Otras ciudades
      }

      // Costo adicional por peso
      const weightCost = Math.ceil(weight) * 15
      
      // Envío gratis para pedidos mayores a $3000
      const subtotal = getSubtotal()
      if (subtotal >= 3000) {
        setShippingCost(0)
        setShippingCalculated(true)
        return 0
      }

      const totalShipping = baseCost + weightCost
      setShippingCost(totalShipping)
      setShippingCalculated(true)
      return totalShipping
    } catch (error) {
      console.error('Error calculating shipping:', error)
      setShippingCost(150) // Costo por defecto
      setShippingCalculated(true)
      return 150
    }
  }

  const handleCheckout = () => {
    setOrderStep('checkout')
  }

  const handleOrderDataChange = (field, value) => {
    setOrderData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleConfirmOrder = async () => {
    try {
      setLoading(true)
      
      // Crear el pedido en Firebase
      const orderItems = cart.map(item => ({
        productId: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity
      }))

      const orderToCreate = {
        userId: user.uid,
        userEmail: user.email,
        items: orderItems,
        subtotal: getSubtotal(),
        iva: getIVA(),
        shippingCost: shippingCost,
        total: getCartTotal(),
        shippingAddress: orderData.shippingAddress,
        city: orderData.city,
        postalCode: orderData.postalCode,
        paymentMethod: orderData.paymentMethod,
        notes: orderData.notes,
        status: 'pending'
      }

      await ordersService.addOrder(orderToCreate)
      
      setOrderStep('confirmation')
      setCart([])
      setOrderData({
        shippingAddress: '',
        city: '',
        postalCode: '',
        paymentMethod: 'transferencia',
        notes: ''
      })
    } catch (err) {
      console.error('Error creating order:', err)
      setError('Error al procesar el pedido. Por favor, intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (orderStep === 'confirmation') {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl text-white">✓</span>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">¡Pedido Confirmado!</h2>
          <p className="text-slate-600 mb-6">
            Tu pedido ha sido procesado exitosamente. Recibirás un email de confirmación en breve.
          </p>
          <div className="bg-slate-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-slate-600">Número de pedido:</p>
            <p className="text-xl font-bold text-slate-900">ORD-{new Date().getFullYear()}-{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</p>
          </div>
          <button
            onClick={() => setOrderStep('products')}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-3 rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all"
          >
            Hacer Otro Pedido
          </button>
        </div>
      </div>
    )
  }

  if (orderStep === 'checkout') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <button
            onClick={() => setOrderStep('products')}
            className="text-red-600 hover:text-red-700 mr-4"
          >
            ← Volver a productos
          </button>
          <h2 className="text-2xl font-bold text-slate-900">Finalizar Pedido</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Resumen del Pedido</h3>
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-3 border-b border-slate-200">
                  <div>
                    <p className="font-medium text-slate-900">{item.title}</p>
                    <p className="text-sm text-slate-600">Cantidad: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-slate-900">${(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-200 pt-4 mt-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Subtotal:</span>
                <span className="font-bold text-slate-900">${getSubtotal().toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">IVA (16%):</span>
                <span className="font-bold text-slate-900">${getIVA().toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Envío:</span>
                <span className="font-bold text-slate-900">
                  {shippingCalculated ? (
                    shippingCost === 0 ? (
                      <span className="text-green-600">¡GRATIS!</span>
                    ) : (
                      `$${shippingCost.toLocaleString()}`
                    )
                  ) : (
                    <span className="text-orange-600">Se calculará automáticamente</span>
                  )}
                </span>
              </div>
              <div className="border-t border-slate-300 pt-2">
                <div className="flex justify-between items-center text-xl font-bold text-slate-900">
                  <span>Total:</span>
                  <span>${getCartTotal().toLocaleString()}</span>
                </div>
              </div>
              {getSubtotal() >= 3000 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-2 mt-2">
                  <p className="text-xs text-green-700 text-center font-medium">
                    🎉 ¡Envío gratis por compra mayor a $3,000!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Checkout Form */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Información de Envío</h3>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Dirección de Envío *
                </label>
                <textarea
                  value={orderData.shippingAddress}
                  onChange={(e) => handleOrderDataChange('shippingAddress', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  rows={3}
                  placeholder="Ingresa la dirección completa de envío"
                  required
                ></textarea>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Ciudad *
                  </label>
                  <input
                    type="text"
                    value={orderData.city}
                    onChange={(e) => {
                      handleOrderDataChange('city', e.target.value)
                      // Calcular envío automáticamente si ambos campos están llenos
                      if (e.target.value && orderData.postalCode) {
                        calculateShipping(orderData.postalCode, e.target.value)
                      }
                    }}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Ciudad"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Código Postal *
                  </label>
                  <input
                    type="text"
                    value={orderData.postalCode}
                    onChange={(e) => {
                      handleOrderDataChange('postalCode', e.target.value)
                      // Calcular envío automáticamente si ambos campos están llenos
                      if (e.target.value && orderData.city) {
                        calculateShipping(e.target.value, orderData.city)
                      }
                    }}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="CP"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Método de Pago *
                </label>
                <select
                  value={orderData.paymentMethod}
                  onChange={(e) => handleOrderDataChange('paymentMethod', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                >
                  <option value="transferencia">Transferencia Bancaria</option>
                  <option value="tarjeta">Tarjeta de Crédito</option>
                  <option value="contraentrega">Pago Contra Entrega</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Notas Especiales (Opcional)
                </label>
                <textarea
                  value={orderData.notes}
                  onChange={(e) => handleOrderDataChange('notes', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  rows={2}
                  placeholder="Instrucciones especiales para el pedido"
                ></textarea>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="button"
                onClick={handleConfirmOrder}
                disabled={loading || !orderData.shippingAddress || !orderData.city || !orderData.postalCode}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-4 rounded-lg font-bold text-lg hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? 'Procesando...' : `Confirmar Pedido - $${getCartTotal().toLocaleString()}`}
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando productos...</p>
        </div>
      </div>
    )
  }

  if (error && products.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          <h3 className="font-bold mb-2">Error al cargar productos</h3>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header with Gradient Background */}
        <div className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 rounded-2xl p-8 mb-8 text-white shadow-2xl">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-red-100 bg-clip-text text-transparent">
                Catálogo de Productos
              </h1>
              <p className="text-red-100 text-lg">
                Descubre nuestra amplia gama de productos profesionales
              </p>
              <div className="flex items-center space-x-4 mt-4">
                <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
                  <span className="text-2xl">📦</span>
                  <span className="text-sm font-medium">{filteredProducts.length} productos disponibles</span>
                </div>
                {cart.length > 0 && (
                  <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
                    <span className="text-2xl">🛒</span>
                    <span className="text-sm font-medium">{getCartItemCount()} items en carrito</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => setShowCart(!showCart)}
                className="relative bg-white/20 backdrop-blur-sm border border-white/30 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">🛒</span>
                  <span>Carrito ({getCartItemCount()})</span>
                </div>
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-red-800 text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold animate-pulse">
                    {cart.length}
                  </span>
                )}
              </button>
              
              {cart.length > 0 && (
                <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3">
                  <div className="text-center">
                    <p className="text-sm text-red-100">Total</p>
                    <p className="text-xl font-bold">${getCartTotal().toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-lg mb-8 shadow-lg">
            <div className="flex items-center">
              <span className="text-2xl mr-3">⚠️</span>
              <div>
                <h3 className="font-bold">Error</h3>
                <p>{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Información sobre presentaciones de cajas */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-2xl p-6 mb-8">
          <div className="flex items-start space-x-4">
            <div className="text-4xl">📦</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Presentaciones de Cápsulas</h3>
              <p className="text-slate-700 mb-3">
                Nuestras cápsulas de N2O están disponibles en presentaciones de caja completa para garantizar la mejor calidad y precio.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-100 border border-blue-300 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-blue-600 font-bold">📦 Caja de 36 piezas</span>
                  </div>
                  <p className="text-sm text-blue-700">Ideal para uso moderado y pruebas</p>
                </div>
                <div className="bg-green-100 border border-green-300 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-green-600 font-bold">📦 Caja de 54 piezas</span>
                  </div>
                  <p className="text-sm text-green-700">Mejor precio por unidad, ideal para uso frecuente</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Category Filter */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 mb-8">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
            <span className="text-2xl mr-2">🏷️</span>
            Filtrar por Categoría
          </h3>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25'
                    : 'bg-slate-100 text-slate-700 border border-slate-300 hover:bg-red-50 hover:border-red-300 hover:text-red-600'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Enhanced Products Grid */}
          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-12 text-center">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">No hay productos disponibles</h3>
                <p className="text-slate-600">No se encontraron productos en esta categoría.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="group bg-white rounded-2xl shadow-xl border border-slate-200 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                    <div className="text-center mb-6">
                      <div className="w-24 h-24 mx-auto mb-4 overflow-hidden rounded-2xl bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
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
                        <div className="w-full h-full bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center text-4xl" style={{display: product.image && product.image.startsWith('http') ? 'none' : 'flex'}}>
                          {product.image && !product.image.startsWith('http') ? product.image : '📦'}
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-red-600 transition-colors">
                        {product.title}
                      </h3>
                      <p className="text-sm text-slate-600 mb-4 line-clamp-2">{product.description}</p>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-slate-600">Precio:</span>
                          <span className="text-2xl font-bold text-red-600">${product.price?.toLocaleString()}</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-slate-600">Stock:</span>
                          <span className={`text-sm font-bold ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {product.stock} unidades
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-slate-600">Mín. pedido:</span>
                          <span className="text-sm font-bold text-slate-900">{product.minOrder}</span>
                        </div>
                        
                        {/* Información de presentación de cajas */}
                        {product.category === 'capsulas' && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-blue-600 text-lg">📦</span>
                              <span className="text-sm font-bold text-blue-800">Presentaciones Disponibles:</span>
                            </div>
                            <div className="text-xs text-blue-700 space-y-1">
                              <div className="flex justify-between">
                                <span>• Caja de 36 piezas</span>
                                <span className="font-medium">${(product.price * 36).toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>• Caja de 54 piezas</span>
                                <span className="font-medium">${(product.price * 54).toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {product.category === 'capsulas' ? (
                        <div className="space-y-3">
                          {/* Selector de cantidad personalizada para cápsulas */}
                          <div className="bg-purple-50 border border-purple-200 rounded-xl p-3">
                            <label className="block text-sm font-medium text-purple-700 mb-2">
                              Cantidad personalizada:
                            </label>
                            <div className="flex items-center space-x-2">
                              <input
                                type="number"
                                min={product.minOrder}
                                max={product.stock}
                                defaultValue={product.minOrder}
                                className="flex-1 px-3 py-2 border border-purple-300 rounded-lg text-center focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                id={`quantity-${product.id}`}
                              />
                              <button
                                onClick={() => {
                                  const input = document.getElementById(`quantity-${product.id}`)
                                  const quantity = parseInt(input.value) || product.minOrder
                                  if (quantity >= product.minOrder && quantity <= product.stock) {
                                    const customProduct = { ...product, quantity }
                                    setCart(prev => {
                                      const existing = prev.find(item => item.id === product.id)
                                      if (existing) {
                                        return prev.map(item =>
                                          item.id === product.id
                                            ? { ...item, quantity: item.quantity + quantity }
                                            : item
                                        )
                                      } else {
                                        return [...prev, { ...product, quantity }]
                                      }
                                    })
                                    setShippingCalculated(false)
                                    setShippingCost(0)
                                  }
                                }}
                                disabled={product.stock === 0}
                                className="bg-purple-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-600 transition-colors disabled:opacity-50"
                              >
                                ➕
                              </button>
                            </div>
                          </div>
                          
                          {/* Botones de cajas predefinidas */}
                          <div className="space-y-2">
                            <button
                              onClick={() => addBoxToCart(product, 36)}
                              disabled={product.stock === 0}
                              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-bold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
                            >
                              <span className="flex items-center justify-center">
                                <span className="text-lg mr-2">📦</span>
                                Caja 36 piezas - ${(product.price * 36).toLocaleString()}
                              </span>
                            </button>
                            <button
                              onClick={() => addBoxToCart(product, 54)}
                              disabled={product.stock === 0}
                              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-bold hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
                            >
                              <span className="flex items-center justify-center">
                                <span className="text-lg mr-2">📦</span>
                                Caja 54 piezas - ${(product.price * 54).toLocaleString()}
                              </span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {/* Selector de cantidad para otros productos */}
                          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Cantidad:
                            </label>
                            <div className="flex items-center space-x-2">
                              <input
                                type="number"
                                min={product.minOrder}
                                max={product.stock}
                                defaultValue={product.minOrder}
                                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-center focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                id={`quantity-${product.id}`}
                              />
                              <button
                                onClick={() => {
                                  const input = document.getElementById(`quantity-${product.id}`)
                                  const quantity = parseInt(input.value) || product.minOrder
                                  if (quantity >= product.minOrder && quantity <= product.stock) {
                                    const customProduct = { ...product, quantity }
                                    setCart(prev => {
                                      const existing = prev.find(item => item.id === product.id)
                                      if (existing) {
                                        return prev.map(item =>
                                          item.id === product.id
                                            ? { ...item, quantity: item.quantity + quantity }
                                            : item
                                        )
                                      } else {
                                        return [...prev, { ...product, quantity }]
                                      }
                                    })
                                    setShippingCalculated(false)
                                    setShippingCost(0)
                                  }
                                }}
                                disabled={product.stock === 0}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                              >
                                🛒
                              </button>
                            </div>
                          </div>
                          
                          {/* Botón rápido con cantidad mínima */}
                          <button
                            onClick={() => addToCart(product)}
                            disabled={product.stock === 0}
                            className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-4 rounded-xl font-bold text-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
                          >
                            {product.stock === 0 ? (
                              <span className="flex items-center justify-center">
                                <span className="text-xl mr-2">❌</span>
                                Sin Stock
                              </span>
                            ) : (
                              <span className="flex items-center justify-center">
                                <span className="text-xl mr-2">🛒</span>
                                Agregar {product.minOrder} al Carrito
                              </span>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Enhanced Shopping Cart Sidebar */}
          {showCart && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 sticky top-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center">
                    <span className="text-2xl mr-2">🛒</span>
                    Carrito
                  </h3>
                  <button
                    onClick={() => setShowCart(false)}
                    className="text-slate-400 hover:text-slate-600 lg:hidden"
                  >
                    ✕
                  </button>
                </div>
                
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🛒</div>
                    <p className="text-slate-600 font-medium">Tu carrito está vacío</p>
                    <p className="text-sm text-slate-500 mt-2">Agrega productos para comenzar</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                      {cart.map((item) => (
                        <div key={item.id} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="font-semibold text-slate-900 text-sm flex-1 pr-2">{item.title}</h4>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-500 hover:text-red-700 text-lg font-bold"
                            >
                              ✕
                            </button>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {item.category === 'capsulas' ? (
                                <>
                                  <button
                                    onClick={() => updateQuantity(item.id, Math.max(item.quantity - 36, item.minOrder))}
                                    className="w-8 h-8 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-bold text-xs"
                                    title="Quitar caja de 36"
                                  >
                                    -36
                                  </button>
                                  <button
                                    onClick={() => updateQuantity(item.id, Math.max(item.quantity - 54, item.minOrder))}
                                    className="w-8 h-8 bg-green-500 text-white rounded-lg hover:bg-green-600 font-bold text-xs"
                                    title="Quitar caja de 54"
                                  >
                                    -54
                                  </button>
                                  <span className="text-sm font-bold bg-white px-3 py-1 rounded-lg border border-slate-300">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 36)}
                                    className="w-8 h-8 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-bold text-xs"
                                    title="Agregar caja de 36"
                                  >
                                    +36
                                  </button>
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 54)}
                                    className="w-8 h-8 bg-green-500 text-white rounded-lg hover:bg-green-600 font-bold text-xs"
                                    title="Agregar caja de 54"
                                  >
                                    +54
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity - item.minOrder)}
                                    className="w-8 h-8 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 font-bold"
                                  >
                                    -
                                  </button>
                                  <span className="text-sm font-bold bg-white px-3 py-1 rounded-lg border border-slate-300">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity + item.minOrder)}
                                    className="w-8 h-8 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 font-bold"
                                  >
                                    +
                                  </button>
                                </>
                              )}
                            </div>
                            <span className="font-bold text-slate-900">${(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-slate-200 pt-6">
                      <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-4 mb-4 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600">Subtotal:</span>
                          <span className="font-bold text-slate-900">${getSubtotal().toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600">IVA (16%):</span>
                          <span className="font-bold text-slate-900">${getIVA().toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600">Envío:</span>
                          <span className="font-bold text-slate-900">
                            {shippingCalculated ? (
                              shippingCost === 0 ? (
                                <span className="text-green-600">¡GRATIS!</span>
                              ) : (
                                `$${shippingCost.toLocaleString()}`
                              )
                            ) : (
                              <span className="text-orange-600">Por calcular</span>
                            )}
                          </span>
                        </div>
                        <div className="border-t border-slate-300 pt-2">
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-slate-900">Total:</span>
                            <span className="text-2xl font-bold text-red-600">${getCartTotal().toLocaleString()}</span>
                          </div>
                        </div>
                        {getSubtotal() >= 3000 && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-2 mt-2">
                            <p className="text-xs text-green-700 text-center font-medium">
                              🎉 ¡Envío gratis por compra mayor a $3,000!
                            </p>
                          </div>
                        )}
                      </div>
                      
                      {!shippingCalculated && cart.length > 0 && (
                        <div className="mb-4">
                          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                            <p className="text-sm text-blue-700 mb-3 text-center">
                              💡 Calcula tu envío para ver el total final
                            </p>
                            <div className="space-y-2">
                              <input
                                type="text"
                                placeholder="Código Postal"
                                className="w-full px-3 py-2 border border-blue-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    const postalCode = e.target.value
                                    const city = e.target.nextSibling.value || 'Ciudad'
                                    if (postalCode) {
                                      calculateShipping(postalCode, city)
                                    }
                                  }
                                }}
                              />
                              <input
                                type="text"
                                placeholder="Ciudad"
                                className="w-full px-3 py-2 border border-blue-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    const city = e.target.value
                                    const postalCode = e.target.previousSibling.value || '00000'
                                    if (city) {
                                      calculateShipping(postalCode, city)
                                    }
                                  }
                                }}
                              />
                              <button
                                onClick={() => {
                                  const inputs = document.querySelectorAll('input[placeholder*="Código"], input[placeholder*="Ciudad"]')
                                  const postalCode = inputs[0]?.value || '00000'
                                  const city = inputs[1]?.value || 'Ciudad'
                                  calculateShipping(postalCode, city)
                                }}
                                className="w-full bg-blue-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                              >
                                📍 Calcular Envío
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      <button
                        onClick={handleCheckout}
                        className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-4 rounded-xl font-bold text-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                      >
                        <span className="flex items-center justify-center">
                          <span className="text-xl mr-2">💳</span>
                          Proceder al Checkout
                        </span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MakeOrder