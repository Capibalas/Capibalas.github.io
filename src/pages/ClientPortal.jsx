import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Navigate } from 'react-router-dom'
import ClientDashboard from '../components/ClientDashboard'
import MakeOrder from '../components/MakeOrder'
import OrderHistory from '../components/OrderHistory'
import Invoices from '../components/Invoices'
import ClientProfile from '../components/ClientProfile'

const ClientPortal = () => {
  const { user, loading } = useAuth()
  const [activeSection, setActiveSection] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const menuItems = [
    { id: 'dashboard', name: 'Panel Principal', icon: '📊' },
    { id: 'orders', name: 'Hacer Pedidos', icon: '🛒' },
    { id: 'history', name: 'Historial de Pedidos', icon: '📋' },
    { id: 'invoices', name: 'Facturas', icon: '🧾' },
    { id: 'profile', name: 'Mi Perfil', icon: '👤' }
  ]

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <ClientDashboard />
      case 'orders':
        return <MakeOrder />
      case 'history':
        return <OrderHistory />
      case 'invoices':
        return <Invoices />
      case 'profile':
        return <ClientProfile />
      default:
        return <ClientDashboard />
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Toggle Button for Desktop */}
      <button
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className="fixed top-4 z-[60] hidden lg:flex bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg shadow-xl transition-all duration-300 items-center justify-center border-2 border-white"
        style={{ left: sidebarCollapsed ? '1rem' : '18.5rem' }}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {sidebarCollapsed ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          )}
        </svg>
      </button>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Enhanced Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 bg-white shadow-2xl transform transition-all duration-300 ease-in-out lg:relative lg:translate-x-0 border-r border-slate-200 ${
        sidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'
      } ${
        sidebarCollapsed ? 'lg:w-0 lg:overflow-hidden' : 'lg:w-72'
      }`}>
        {/* Logo Section */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-slate-200 bg-gradient-to-r from-red-500 to-red-600">
          <div className="flex items-center space-x-3">
            <img
              src="/logo png.png"
              alt="BestWhipMX Logo"
              className="h-12 w-auto filter brightness-0 invert"
            />
            <div className="text-white">
              <h2 className="font-bold text-lg">BestWhip</h2>
              <p className="text-xs text-red-100">Portal B2B</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:text-red-200 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="mt-6 px-3">
          {menuItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id)
                setSidebarOpen(false)
              }}
              className={`w-full flex items-center px-4 py-4 mb-2 text-left transition-all duration-200 rounded-xl group ${
                activeSection === item.id
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg transform scale-105'
                  : 'text-slate-700 hover:bg-red-50 hover:text-red-600 hover:transform hover:scale-102'
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={`text-2xl mr-4 p-2 rounded-lg transition-all ${
                activeSection === item.id
                  ? 'bg-white/20'
                  : 'bg-slate-100 group-hover:bg-red-100'
              }`}>
                {item.icon}
              </div>
              <div className="flex-1">
                <span className="font-semibold text-base">{item.name}</span>
                {activeSection === item.id && (
                  <div className="w-2 h-2 bg-white rounded-full ml-auto animate-pulse"></div>
                )}
              </div>
            </button>
          ))}
        </nav>

        {/* Enhanced User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={user.photoURL || '/default-avatar.png'}
                alt={user.displayName}
                className="w-12 h-12 rounded-full border-2 border-red-200 shadow-lg"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">
                {user.displayName}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {user.email}
              </p>
              <div className="flex items-center mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-xs text-green-600 font-medium">En línea</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Enhanced Top Bar */}
        <div className="bg-white/80 backdrop-blur-md shadow-lg border-b border-slate-200/50 sticky top-0 z-30">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">
                    {menuItems.find(item => item.id === activeSection)?.icon}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                      {menuItems.find(item => item.id === activeSection)?.name || 'Portal de Cliente'}
                    </h1>
                    <p className="text-sm text-slate-600">
                      {activeSection === 'dashboard' && 'Resumen de tu actividad'}
                      {activeSection === 'orders' && 'Explora y compra productos'}
                      {activeSection === 'history' && 'Revisa tus pedidos anteriores'}
                      {activeSection === 'invoices' && 'Gestiona tu facturación'}
                      {activeSection === 'profile' && 'Configura tu cuenta'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <button className="p-3 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all relative">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 7h6m0 0v6m0-6l-6 6" />
                    </svg>
                    <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                  </button>
                </div>
                
                <div className="hidden md:flex items-center space-x-3 bg-slate-50 rounded-xl px-4 py-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user.displayName?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {user.displayName?.split(' ')[0]}
                    </p>
                    <p className="text-xs text-slate-500">Cliente Premium</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  )
}

export default ClientPortal