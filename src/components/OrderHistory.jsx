import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { ordersService } from '../firebase/services'

const OrderHistory = () => {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('date-desc')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadOrderHistory = async () => {
      if (!user?.uid) return
      
      try {
        setLoading(true)
        setError(null)
        const userOrders = await ordersService.getUserOrders(user.uid)
        setOrders(userOrders)
      } catch (err) {
        console.error('Error loading order history:', err)
        setError('Error al cargar el historial de pedidos. Por favor, intenta de nuevo.')
      } finally {
        setLoading(false)
      }
    }

    loadOrderHistory()
  }, [user?.uid])

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
      case 'Completado':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'shipped':
      case 'Enviado':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'pending':
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'cancelled':
      case 'Cancelado':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
      case 'Completado':
        return '✅'
      case 'shipped':
      case 'Enviado':
        return '🚚'
      case 'pending':
      case 'Pendiente':
        return '⏳'
      case 'cancelled':
      case 'Cancelado':
        return '❌'
      default:
        return '📦'
    }
  }

  const getStatusDisplayName = (status) => {
    switch (status) {
      case 'completed':
        return 'Completado'
      case 'shipped':
        return 'Enviado'
      case 'pending':
        return 'Pendiente'
      case 'cancelled':
        return 'Cancelado'
      default:
        return status
    }
  }

  const filteredOrders = orders.filter(order => {
    if (filterStatus === 'all') return true
    return order.status === filterStatus || getStatusDisplayName(order.status) === filterStatus
  })

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    switch (sortBy) {
      case 'date-desc':
        return new Date(b.createdAt?.toDate?.() || b.createdAt || b.date) - new Date(a.createdAt?.toDate?.() || a.createdAt || a.date)
      case 'date-asc':
        return new Date(a.createdAt?.toDate?.() || a.createdAt || a.date) - new Date(b.createdAt?.toDate?.() || b.createdAt || b.date)
      case 'total-desc':
        return b.total - a.total
      case 'total-asc':
        return a.total - b.total
      default:
        return 0
    }
  })

  if (selectedOrder) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSelectedOrder(null)}
              className="text-red-600 hover:text-red-700 font-medium"
            >
              ← Volver al historial
            </button>
            <h2 className="text-2xl font-bold text-slate-900">Detalles del Pedido</h2>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(selectedOrder.status)}`}>
            {getStatusIcon(selectedOrder.status)} {getStatusDisplayName(selectedOrder.status)}
          </span>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Info */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Información del Pedido</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Número de Pedido</p>
                  <p className="font-bold text-slate-900">{selectedOrder.id}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Fecha del Pedido</p>
                  <p className="font-bold text-slate-900">
                    {new Date(selectedOrder.createdAt?.toDate?.() || selectedOrder.createdAt || selectedOrder.date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Total</p>
                  <p className="font-bold text-slate-900">${selectedOrder.total.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Estado</p>
                  <p className="font-bold text-slate-900">{getStatusDisplayName(selectedOrder.status)}</p>
                </div>
              </div>
            </div>

            {/* Products */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Productos</h3>
              <div className="space-y-4">
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-4 border-b border-slate-200 last:border-b-0">
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{item.title || item.name}</p>
                      <p className="text-sm text-slate-600">Cantidad: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">${(item.subtotal || (item.price * item.quantity)).toLocaleString()}</p>
                      <p className="text-sm text-slate-600">${item.price} c/u</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Shipping & Tracking */}
          <div className="space-y-6">
            {/* Shipping Address */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Dirección de Envío</h3>
              <div className="text-slate-700">
                <p>{selectedOrder.shippingAddress}</p>
                {selectedOrder.city && selectedOrder.postalCode && (
                  <p>{selectedOrder.city}, {selectedOrder.postalCode}</p>
                )}
              </div>
            </div>

            {/* Tracking Info */}
            {selectedOrder.trackingNumber && (
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Información de Envío</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-slate-600">Número de Seguimiento</p>
                    <p className="font-medium text-slate-900">{selectedOrder.trackingNumber}</p>
                  </div>
                  {selectedOrder.estimatedDelivery && (
                    <div>
                      <p className="text-sm text-slate-600">Entrega Estimada</p>
                      <p className="font-medium text-slate-900">
                        {new Date(selectedOrder.estimatedDelivery).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  {selectedOrder.deliveredDate && (
                    <div>
                      <p className="text-sm text-slate-600">Fecha de Entrega</p>
                      <p className="font-medium text-green-600">
                        {new Date(selectedOrder.deliveredDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Cancel Reason */}
            {selectedOrder.cancelReason && (
              <div className="bg-red-50 rounded-xl border border-red-200 p-6">
                <h3 className="text-lg font-bold text-red-800 mb-2">Motivo de Cancelación</h3>
                <p className="text-red-700">{selectedOrder.cancelReason}</p>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              {(selectedOrder.status === 'completed' || selectedOrder.status === 'Completado') && (
                <button className="w-full bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition-colors">
                  Descargar Factura
                </button>
              )}
              {(selectedOrder.status === 'shipped' || selectedOrder.status === 'Enviado') && (
                <button className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors">
                  Rastrear Pedido
                </button>
              )}
              <button className="w-full bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition-colors">
                Reordenar Productos
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando historial de pedidos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          <h3 className="font-bold mb-2">Error al cargar pedidos</h3>
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-900">Historial de Pedidos</h2>
        
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          >
            <option value="all">Todos los estados</option>
            <option value="pending">Pendiente</option>
            <option value="shipped">Enviado</option>
            <option value="completed">Completado</option>
            <option value="cancelled">Cancelado</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          >
            <option value="date-desc">Más reciente</option>
            <option value="date-asc">Más antiguo</option>
            <option value="total-desc">Mayor monto</option>
            <option value="total-asc">Menor monto</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {sortedOrders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No hay pedidos</h3>
            <p className="text-slate-600">No se encontraron pedidos con los filtros seleccionados.</p>
          </div>
        ) : (
          sortedOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => setSelectedOrder(order)}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <h3 className="text-lg font-bold text-slate-900">{order.id}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)} {getStatusDisplayName(order.status)}
                    </span>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-600">
                    <div>
                      <span className="font-medium">Fecha:</span> {new Date(order.createdAt?.toDate?.() || order.createdAt || order.date).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">Productos:</span> {order.items.length} artículos
                    </div>
                    <div>
                      <span className="font-medium">Total:</span>
                      <span className="text-lg font-bold text-slate-900 ml-1">
                        ${order.total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {order.trackingNumber && (
                    <div className="text-sm text-slate-600">
                      <span className="font-medium">Tracking:</span> {order.trackingNumber}
                    </div>
                  )}
                  <button className="text-red-600 hover:text-red-700 font-medium">
                    Ver detalles →
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary Stats */}
      {sortedOrders.length > 0 && (
        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Resumen</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-slate-900">{sortedOrders.length}</p>
              <p className="text-sm text-slate-600">Total de pedidos</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {sortedOrders.filter(o => o.status === 'completed' || o.status === 'Completado').length}
              </p>
              <p className="text-sm text-slate-600">Completados</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {sortedOrders.filter(o => o.status === 'shipped' || o.status === 'Enviado').length}
              </p>
              <p className="text-sm text-slate-600">En tránsito</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                ${sortedOrders.reduce((sum, order) => sum + order.total, 0).toLocaleString()}
              </p>
              <p className="text-sm text-slate-600">Total gastado</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderHistory