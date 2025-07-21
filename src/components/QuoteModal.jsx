import { useState } from 'react'

const QuoteModal = ({ isOpen, onClose, product }) => {
  const [quoteData, setQuoteData] = useState({
    quantity: 1,
    name: '',
    email: '',
    phone: '',
    company: '',
    notes: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setQuoteData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const totalEstimate = product?.price ? product.price * quoteData.quantity : 'Por cotizar';
    
    // Create WhatsApp message with quote details
    const quoteMessage = `🧾 *SOLICITUD DE COTIZACIÓN*

📦 *Producto:* ${product?.name || product?.title}
📊 *Cantidad:* ${quoteData.quantity} unidades
💰 *Estimado total:* ${typeof totalEstimate === 'number' ? `$${totalEstimate.toLocaleString()}` : totalEstimate}

👤 *Datos del Cliente:*
• Nombre: ${quoteData.name}
• Email: ${quoteData.email}
• Teléfono: ${quoteData.phone || 'No proporcionado'}
• Empresa: ${quoteData.company || 'No especificada'}

📝 *Notas adicionales:*
${quoteData.notes || 'Sin notas adicionales'}

📋 *Especificaciones del producto:*
• SKU: ${product?.sku || 'No especificado'}
• Categoría: ${product?.category || 'No especificada'}
• Stock disponible: ${product?.stock || 'Consultar'}

Por favor, envíenme una cotización formal con:
• Precio unitario y total
• Tiempo de entrega
• Formas de pago
• Garantías y servicio post-venta

¡Gracias por su atención!`

    // Create WhatsApp link
    const whatsappLink = `https://wa.me/525660547499?text=${encodeURIComponent(quoteMessage)}`
    
    // Open WhatsApp
    window.open(whatsappLink, '_blank')
    
    // Close modal and reset form
    onClose()
    setQuoteData({
      quantity: 1,
      name: '',
      email: '',
      phone: '',
      company: '',
      notes: ''
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-black text-slate-900">
            Solicitar Cotización
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-colors"
          >
            <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Product Info */}
        <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-2xl p-6 mb-6 border border-red-200">
          <div className="flex items-start space-x-4">
            <div className="w-20 h-20 bg-gradient-to-br from-red-200 to-red-300 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
              {product?.image || '📦'}
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">{product?.name || product?.title}</h3>
              <p className="text-slate-600 mb-3">{product?.description}</p>
              
              {/* Product Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                {product?.price && (
                  <div className="bg-white/50 rounded-lg p-3">
                    <span className="text-slate-500">Precio unitario:</span>
                    <div className="font-bold text-slate-900">${product.price}</div>
                  </div>
                )}
                {product?.category && (
                  <div className="bg-white/50 rounded-lg p-3">
                    <span className="text-slate-500">Categoría:</span>
                    <div className="font-bold text-slate-900">{product.category}</div>
                  </div>
                )}
                {product?.stock && (
                  <div className="bg-white/50 rounded-lg p-3">
                    <span className="text-slate-500">Disponible:</span>
                    <div className="font-bold text-green-600">{product.stock} unidades</div>
                  </div>
                )}
                {product?.sku && (
                  <div className="bg-white/50 rounded-lg p-3">
                    <span className="text-slate-500">SKU:</span>
                    <div className="font-bold text-slate-900">{product.sku}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quote Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Quantity Selector */}
          <div>
            <label className="block text-slate-700 font-medium mb-3">Cantidad *</label>
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => setQuoteData(prev => ({ ...prev, quantity: Math.max(1, prev.quantity - 1) }))}
                className="w-12 h-12 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center transition-colors"
              >
                <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              
              <div className="flex-1">
                <input
                  type="number"
                  name="quantity"
                  value={quoteData.quantity}
                  onChange={handleInputChange}
                  min="1"
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all text-center text-lg font-bold"
                />
              </div>
              
              <button
                type="button"
                onClick={() => setQuoteData(prev => ({ ...prev, quantity: prev.quantity + 1 }))}
                className="w-12 h-12 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center transition-colors"
              >
                <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
            
            {/* Quick quantity buttons */}
            <div className="flex gap-2 mt-3">
              {[5, 10, 25, 50, 100].map(qty => (
                <button
                  key={qty}
                  type="button"
                  onClick={() => setQuoteData(prev => ({ ...prev, quantity: qty }))}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    quoteData.quantity === qty
                      ? 'bg-red-500 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {qty}
                </button>
              ))}
            </div>
          </div>

          {/* Personal Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-slate-700 font-medium mb-2">Nombre Completo *</label>
              <input
                type="text"
                name="name"
                value={quoteData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
                placeholder="Tu nombre"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-2">Email *</label>
              <input
                type="email"
                name="email"
                value={quoteData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
                placeholder="tu@email.com"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-slate-700 font-medium mb-2">Teléfono</label>
              <input
                type="tel"
                name="phone"
                value={quoteData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
                placeholder="+52 (56) 6054-7499"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-2">Empresa</label>
              <input
                type="text"
                name="company"
                value={quoteData.company}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
                placeholder="Nombre de tu empresa"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-slate-700 font-medium mb-2">Notas adicionales</label>
            <textarea
              name="notes"
              value={quoteData.notes}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all resize-none"
              placeholder="Especificaciones adicionales, fechas de entrega, etc."
            ></textarea>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <div className="text-blue-500 text-xl">💬</div>
              <div>
                <h4 className="text-blue-800 font-semibold mb-1">¿Cómo funciona?</h4>
                <p className="text-blue-700 text-sm">
                  Al enviar esta solicitud, se abrirá WhatsApp con toda tu información pre-llenada. 
                  Nuestro equipo te responderá con una cotización personalizada en menos de 24 horas.
                </p>
              </div>
            </div>
          </div>

          {/* WhatsApp Contact Section */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
            <div className="flex items-center space-x-3">
              <div className="text-green-500 text-2xl">📱</div>
              <div className="flex-1">
                <h4 className="text-green-800 font-semibold mb-1">¿Necesitas más información?</h4>
                <p className="text-green-700 text-sm mb-2">
                  Contáctanos directamente por WhatsApp para asesoría personalizada y respuesta inmediata.
                </p>
                <a
                  href="https://wa.me/525660547499"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.03 22l5.25-1.38c1.45.79 3.08 1.21 4.76 1.21 5.46 0 9.91-4.45 9.91-9.91s-4.45-9.91-9.91-9.91zM12.04 20.3c-1.48 0-2.93-.39-4.2-1.15l-.3-.18-3.12.82.83-3.04-.19-.3c-.8-1.26-1.22-2.7-1.22-4.18 0-4.97 4.04-9.01 9.01-9.01s9.01 4.04 9.01 9.01-4.04 9.01-9.01 9.01zM16.82 14.5c-.17-.09-1-.49-1.15-.55s-.27-.08-.38.08c-.11.17-.42.55-.52.66-.09.11-.18.12-.35.04-.17-.08-.71-.26-1.35-.83-.5-.44-.83-.99-.93-1.16-.09-.17-.01-.26.07-.35.08-.08.17-.21.26-.32.09-.11.12-.17.18-.28.06-.11.03-.21-.02-.28s-.38-.91-.52-1.25c-.14-.34-.28-.29-.38-.3-.09-.01-.19-.01-.29-.01s-.26.04-.38.12c-.12.08-.47.46-.47 1.12 0 .66.48 1.3.55 1.39.06.09.94 1.44 2.28 2.02 1.34.58 1.34.39 1.58.36.24-.03.78-.32.89-.62.11-.3.11-.55.08-.62-.03-.07-.11-.12-.28-.21z"/>
                  </svg>
                  <span>WhatsApp: +52 56 6054 7499</span>
                </a>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border-2 border-slate-300 text-slate-700 hover:bg-slate-50 py-3 px-6 rounded-xl font-bold transition-all duration-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-6 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2"
            >
              <span>Enviar Cotización por WhatsApp</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default QuoteModal