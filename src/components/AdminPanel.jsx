import { useState } from 'react'
import { seedProducts } from '../utils/seedProducts'
import ProductManager from './ProductManager'
import AdminOrders from './AdminOrders'
import { useAuth } from '../contexts/AuthContext'

const AdminPanel = () => {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [activeTab, setActiveTab] = useState('orders')
  const { loginAsDevAdmin, devMode, user } = useAuth()

  const handleSeedProducts = async () => {
    setLoading(true)
    setMessage('Poblando productos...')
    
    try {
      const success = await seedProducts()
      if (success) {
        setMessage('✅ Productos poblados exitosamente')
      } else {
        setMessage('❌ Error al poblar productos')
      }
    } catch (error) {
      setMessage('❌ Error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDevLogin = () => {
    loginAsDevAdmin()
    setMessage('🔧 Modo desarrollo admin activado')
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Panel de Administración</h2>
          {!user && (
            <button
              onClick={handleDevLogin}
              className="bg-purple-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-600 transition-colors text-sm"
            >
              🔧 Login Dev Admin
            </button>
          )}
          {devMode && (
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
              🔧 Modo Desarrollo
            </span>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-6 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'products'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📦 Gestión de Productos
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'orders'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🛒 Administrar Pedidos
          </button>
          <button
            onClick={() => setActiveTab('system')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'system'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ⚙️ Sistema
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'products' && (
          <div>
            <ProductManager />
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            <AdminOrders />
          </div>
        )}

        {activeTab === 'system' && (
          <div className="space-y-6">
          <div className="border border-slate-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Población de Datos</h3>
            <p className="text-slate-600 mb-4">
              Ejecuta este proceso para poblar la base de datos con productos de ejemplo.
            </p>
            
            <button
              onClick={handleSeedProducts}
              disabled={loading}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Poblando...' : 'Poblar Productos'}
            </button>
            
            {message && (
              <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                <p className="text-sm">{message}</p>
              </div>
            )}
          </div>
          
          <div className="border border-slate-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Estado del Sistema</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Firebase:</span>
                <span className="text-green-600 font-medium">✅ Conectado</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Autenticación:</span>
                <span className="text-green-600 font-medium">✅ Activa</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Firestore:</span>
                <span className="text-green-600 font-medium">✅ Operacional</span>
              </div>
            </div>
          </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPanel