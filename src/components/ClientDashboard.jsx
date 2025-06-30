import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { ordersService, invoicesService, notificationsService } from '../firebase/services'

const ClientDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalSpent: 0,
    lastOrderDate: null
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user?.uid) return
      
      try {
        setLoading(true)
        setError(null)
        
        // Cargar órdenes del usuario
        const userOrders = await ordersService.getUserOrders(user.uid)
        
        // Calcular estadísticas
        const totalOrders = userOrders.length
        const pendingOrders = userOrders.filter(order => order.status === 'pending').length
        const totalSpent = userOrders.reduce((sum, order) => sum + order.total, 0)
        const lastOrderDate = userOrders.length > 0 ?
          new Date(userOrders[0].createdAt?.toDate?.() || userOrders[0].createdAt) : null
        
        setStats({
          totalOrders,
          pendingOrders,
          totalSpent,
          lastOrderDate
        })
        
        // Obtener las 3 órdenes más recientes
        setRecentOrders(userOrders.slice(0, 3))
        
        // Cargar notificaciones del usuario
        const userNotifications = await notificationsService.getUserNotifications(user.uid)
        setNotifications(userNotifications.slice(0, 3))
        
      } catch (err) {
        console.error('Error loading dashboard data:', err)
        setError('Error al cargar los datos del dashboard')
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [user?.uid])

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completado':
        return 'bg-green-100 text-green-800'
      case 'Enviado':
        return 'bg-blue-100 text-blue-800'
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-800'
      case 'Cancelado':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return '✅'
      case 'info':
        return 'ℹ️'
      case 'warning':
        return '⚠️'
      case 'error':
        return '❌'
      default:
        return 'ℹ️'
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

  const formatRelativeTime = (date) => {
    const now = new Date()
    const diffInHours = Math.floor((now - new Date(date?.toDate?.() || date)) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Hace menos de 1 hora'
    if (diffInHours < 24) return `Hace ${diffInHours} horas`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays === 1) return 'Hace 1 día'
    return `Hace ${diffInDays} días`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          <h3 className="font-bold mb-2">Error al cargar dashboard</h3>
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
    <div className="space-y-8">
      {/* Enhanced Welcome Section */}
      <div className="relative bg-gradient-to-r from-red-500 via-red-600 to-red-700 rounded-3xl p-8 text-white overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
        
        <div className="relative flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl backdrop-blur-sm">
                👋
              </div>
              <div>
                <h2 className="text-4xl font-bold mb-1">
                  ¡Bienvenido, {user?.displayName?.split(' ')[0]}!
                </h2>
                <p className="text-red-100 text-lg">
                  Gestiona tus pedidos y mantente al día con tu cuenta
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 mt-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/30">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">📊</span>
                  <div>
                    <p className="text-sm text-red-100">Estado de cuenta</p>
                    <p className="font-bold">Activa</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/30">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">⭐</span>
                  <div>
                    <p className="text-sm text-red-100">Nivel</p>
                    <p className="font-bold">Premium</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="hidden lg:block">
            <div className="w-32 h-32 bg-white/20 rounded-3xl flex items-center justify-center text-6xl backdrop-blur-sm animate-float">
              🎯
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="group bg-white rounded-2xl p-6 shadow-xl border border-slate-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-semibold mb-1">Total de Pedidos</p>
              <p className="text-4xl font-bold text-slate-900 mb-2">{stats.totalOrders}</p>
              <div className="flex items-center text-green-600 text-sm">
                <span className="mr-1">↗️</span>
                <span className="font-medium">+12% este mes</span>
              </div>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
              📦
            </div>
          </div>
        </div>

        <div className="group bg-white rounded-2xl p-6 shadow-xl border border-slate-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-semibold mb-1">Pedidos Pendientes</p>
              <p className="text-4xl font-bold text-slate-900 mb-2">{stats.pendingOrders}</p>
              <div className="flex items-center text-yellow-600 text-sm">
                <span className="mr-1">⏳</span>
                <span className="font-medium">En proceso</span>
              </div>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
              ⏳
            </div>
          </div>
        </div>

        <div className="group bg-white rounded-2xl p-6 shadow-xl border border-slate-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-semibold mb-1">Total Gastado</p>
              <p className="text-4xl font-bold text-slate-900 mb-2">
                ${stats.totalSpent.toLocaleString()}
              </p>
              <div className="flex items-center text-green-600 text-sm">
                <span className="mr-1">💰</span>
                <span className="font-medium">Ahorros disponibles</span>
              </div>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
              💰
            </div>
          </div>
        </div>

        <div className="group bg-white rounded-2xl p-6 shadow-xl border border-slate-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-semibold mb-1">Último Pedido</p>
              <p className="text-2xl font-bold text-slate-900 mb-2">
                {stats.lastOrderDate ? stats.lastOrderDate.toLocaleDateString() : 'N/A'}
              </p>
              <div className="flex items-center text-purple-600 text-sm">
                <span className="mr-1">📅</span>
                <span className="font-medium">Reciente</span>
              </div>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
              📅
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Enhanced Recent Orders */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-xl">
                  📋
                </div>
                <h3 className="text-xl font-bold text-slate-900">Pedidos Recientes</h3>
              </div>
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
                {recentOrders.length} pedidos
              </span>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentOrders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4">
                    📦
                  </div>
                  <h4 className="text-lg font-semibold text-slate-900 mb-2">No hay pedidos recientes</h4>
                  <p className="text-slate-600">Cuando realices pedidos, aparecerán aquí</p>
                </div>
              ) : (
                recentOrders.map((order, index) => (
                  <div key={order.id} className="group p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all duration-200 border border-slate-200 hover:border-slate-300">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                            {index + 1}
                          </div>
                          <p className="font-bold text-slate-900">{order.id}</p>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(getStatusDisplayName(order.status))}`}>
                            {getStatusDisplayName(order.status)}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 ml-11">
                          {new Date(order.createdAt?.toDate?.() || order.createdAt).toLocaleDateString()} • {order.items?.length || 0} productos
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-slate-900">${order.total.toLocaleString()}</p>
                        <p className="text-xs text-slate-500">MXN</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="mt-6">
              <button className="w-full bg-gradient-to-r from-red-50 to-red-100 text-red-600 py-4 rounded-xl font-bold hover:from-red-100 hover:to-red-200 transition-all duration-300 transform hover:scale-105 border border-red-200">
                Ver Todos los Pedidos →
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Notifications */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center text-xl">
                  🔔
                </div>
                <h3 className="text-xl font-bold text-slate-900">Notificaciones</h3>
              </div>
              <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full">
                {notifications.length} nuevas
              </span>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {notifications.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4">
                    🔔
                  </div>
                  <h4 className="text-lg font-semibold text-slate-900 mb-2">No hay notificaciones</h4>
                  <p className="text-slate-600">Te mantendremos informado sobre tus pedidos</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div key={notification.id} className="flex items-start space-x-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all border border-slate-200">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-xl shadow-sm">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900 mb-1">{notification.message}</p>
                      <p className="text-xs text-slate-500">
                        {formatRelativeTime(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="mt-6">
              <button className="w-full bg-slate-100 text-slate-700 py-4 rounded-xl font-bold hover:bg-slate-200 transition-all duration-300 transform hover:scale-105">
                Ver Todas las Notificaciones →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Quick Actions */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center text-2xl text-white">
            ⚡
          </div>
          <h3 className="text-2xl font-bold text-slate-900">Acciones Rápidas</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button className="group flex flex-col items-center space-y-4 p-6 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-2xl hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
              🛒
            </div>
            <div className="text-center">
              <h4 className="font-bold text-lg mb-1">Hacer Nuevo Pedido</h4>
              <p className="text-red-100 text-sm">Explora nuestro catálogo</p>
            </div>
          </button>
          
          <button className="group flex flex-col items-center space-y-4 p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
              📋
            </div>
            <div className="text-center">
              <h4 className="font-bold text-lg mb-1">Ver Historial</h4>
              <p className="text-blue-100 text-sm">Revisa pedidos anteriores</p>
            </div>
          </button>
          
          <button className="group flex flex-col items-center space-y-4 p-6 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
              🧾
            </div>
            <div className="text-center">
              <h4 className="font-bold text-lg mb-1">Descargar Facturas</h4>
              <p className="text-green-100 text-sm">Gestiona tu facturación</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ClientDashboard