import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { ordersService } from '../firebase/services'

const AdminOrders = () => {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('date-desc')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadAllOrders = async () => {
      try {
        setLoading(true)
        setError(null)
        const allOrders = await ordersService.getAllOrders()
        setOrders(allOrders)
      } catch (err) {
        console.error('Error loading all orders:', err)
        setError('Error al cargar todos los pedidos. Por favor, intenta de nuevo.')
      } finally {
        setLoading(false)
      }
    }

    loadAllOrders()
  }, [])

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

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await ordersService.updateOrderStatus(orderId, newStatus)
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus }
          : order
      ))
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus })
      }
    } catch (err) {
      console.error('Error updating order status:', err)
      setError('Error al actualizar el estado del pedido.')
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
              ← Volver a todos los pedidos
            </button>
            <h2 className="text-2xl font-bold text-slate-900">Detalles del Pedido</h2>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedOrder.status}
              onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="pending">Pendiente</option>
              <option value="shipped">Enviado</option>
              <option value="completed">Completado</option>
              <option value="cancelled">Cancelado</option>
            </select>
            <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(selectedOrder.status)}`}>
              {getStatusIcon(selectedOrder.status)} {getStatusDisplayName(selectedOrder.status)}
            </span>
          </div>
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
                  <p className="text-sm text-slate-600 mb-1">Cliente</p>
                  <p className="font-bold text-slate-900">{selectedOrder.userEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Fecha del Pedido</p>
                  <p className="font-bold text-slate-900">
                    {new Date(selectedOrder.createdAt?.toDate?.() || selectedOrder.createdAt || selectedOrder.date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Método de Pago</p>
                  <p className="font-bold text-slate-900">{selectedOrder.paymentMethod || 'No especificado'}</p>
                </div>
              </div>
              
              {/* Desglose de costos */}
              {(selectedOrder.subtotal || selectedOrder.iva || selectedOrder.shippingCost) && (
                <div className="mt-6 bg-slate-50 rounded-lg p-4">
                  <h4 className="font-bold text-slate-900 mb-3">Desglose de Costos</h4>
                  <div className="space-y-2">
                    {selectedOrder.subtotal && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Subtotal:</span>
                        <span className="font-medium">${selectedOrder.subtotal.toLocaleString()}</span>
                      </div>
                    )}
                    {selectedOrder.iva && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">IVA (16%):</span>
                        <span className="font-medium">${selectedOrder.iva.toLocaleString()}</span>
                      </div>
                    )}
                    {selectedOrder.shippingCost !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Envío:</span>
                        <span className="font-medium">
                          {selectedOrder.shippingCost === 0 ? (
                            <span className="text-green-600">¡GRATIS!</span>
                          ) : (
                            `$${selectedOrder.shippingCost.toLocaleString()}`
                          )}
                        </span>
                      </div>
                    )}
                    <div className="border-t border-slate-300 pt-2">
                      <div className="flex justify-between font-bold">
                        <span>Total:</span>
                        <span>${selectedOrder.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
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

          {/* Shipping & Customer Info */}
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Información del Cliente</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-slate-600">Email</p>
                  <p className="font-medium text-slate-900">{selectedOrder.userEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">ID de Usuario</p>
                  <p className="font-medium text-slate-900 text-xs">{selectedOrder.userId}</p>
                </div>
              </div>
            </div>

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

            {/* Notes */}
            {selectedOrder.notes && (
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Notas del Cliente</h3>
                <p className="text-slate-700">{selectedOrder.notes}</p>
              </div>
            )}
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
          <p className="text-slate-600">Cargando todos los pedidos...</p>
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
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Administración de Pedidos</h2>
          <p className="text-slate-600">Gestiona todos los pedidos de la plataforma</p>
        </div>
        
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
          <div className="flex items-center">
            <div className="text-3xl mr-4">📦</div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{orders.length}</p>
              <p className="text-sm text-slate-600">Total de pedidos</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
          <div className="flex items-center">
            <div className="text-3xl mr-4">⏳</div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">
                {orders.filter(o => o.status === 'pending').length}
              </p>
              <p className="text-sm text-slate-600">Pendientes</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
          <div className="flex items-center">
            <div className="text-3xl mr-4">🚚</div>
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {orders.filter(o => o.status === 'shipped').length}
              </p>
              <p className="text-sm text-slate-600">En tránsito</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
          <div className="flex items-center">
            <div className="text-3xl mr-4">💰</div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                ${orders.reduce((sum, order) => sum + order.total, 0).toLocaleString()}
              </p>
              <p className="text-sm text-slate-600">Total en ventas</p>
            </div>
          </div>
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
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <h3 className="text-lg font-bold text-slate-900">{order.id}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)} {getStatusDisplayName(order.status)}
                    </span>
                  </div>
                  
                  <div className="grid md:grid-cols-4 gap-4 text-sm text-slate-600">
                    <div>
                      <span className="font-medium">Cliente:</span> {order.userEmail}
                    </div>
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
                  <select
                    value={order.status}
                    onChange={(e) => {
                      e.stopPropagation()
                      handleStatusChange(order.id, e.target.value)
                    }}
                    className="px-3 py-1 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <option value="pending">Pendiente</option>
                    <option value="shipped">Enviado</option>
                    <option value="completed">Completado</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                  <button className="text-red-600 hover:text-red-700 font-medium">
                    Ver detalles →
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default AdminOrders