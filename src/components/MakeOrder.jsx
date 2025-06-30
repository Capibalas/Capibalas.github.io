import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { productsService, ordersService } from '../firebase/services'

const MakeOrder = () => {
  const { user } = useAuth()
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showCart, setShowCart] = useState(false)
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
  }

  const updateQuantity = (productId, newQuantity) => {
    const product = products.find(p => p.id === productId)
    if (newQuantity < product.minOrder) return
    
    setCart(cart.map(item => 
      item.id === productId 
        ? { ...item, quantity: newQuantity }
        : item
    ))
  }

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId))
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
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
            <div className="border-t border-slate-200 pt-4 mt-4">
              <div className="flex justify-between items-center text-xl font-bold text-slate-900">
                <span>Total:</span>
                <span>${getCartTotal().toLocaleString()}</span>
              </div>
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
                    onChange={(e) => handleOrderDataChange('city', e.target.value)}
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
                    onChange={(e) => handleOrderDataChange('postalCode', e.target.value)}
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
                      </div>

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
                            Agregar al Carrito
                          </span>
                        )}
                      </button>
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
                            </div>
                            <span className="font-bold text-slate-900">${(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-slate-200 pt-6">
                      <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-4 mb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-slate-900">Total:</span>
                          <span className="text-2xl font-bold text-red-600">${getCartTotal().toLocaleString()}</span>
                        </div>
                      </div>
                      
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