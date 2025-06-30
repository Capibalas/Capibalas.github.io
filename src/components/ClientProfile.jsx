import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { userProfilesService, ordersService } from '../firebase/services'

const ClientProfile = () => {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    displayName: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    rfc: '',
    businessType: '',
    notifications: {
      orderUpdates: true,
      promotions: true,
      newsletter: false,
      invoiceReminders: true
    }
  })
  const [originalData, setOriginalData] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [userStats, setUserStats] = useState({
    memberSince: null,
    totalOrders: 0,
    accountStatus: 'Al corriente'
  })

  useEffect(() => {
    const loadProfileData = async () => {
      if (!user?.uid) return
      
      try {
        setLoading(true)
        setError(null)
        
        // Cargar perfil del usuario
        const profile = await userProfilesService.getUserProfile(user.uid)
        
        let data
        if (profile) {
          data = {
            displayName: profile.displayName || user?.displayName || '',
            email: profile.email || user?.email || '',
            phone: profile.phone || '',
            company: profile.company || '',
            position: profile.position || '',
            address: profile.address || '',
            city: profile.city || '',
            state: profile.state || '',
            zipCode: profile.zipCode || '',
            rfc: profile.rfc || '',
            businessType: profile.businessType || 'Restaurante',
            notifications: profile.notifications || {
              orderUpdates: true,
              promotions: true,
              newsletter: false,
              invoiceReminders: true
            }
          }
        } else {
          // Si no existe perfil, crear uno con datos básicos del usuario
          data = {
            displayName: user?.displayName || '',
            email: user?.email || '',
            phone: '',
            company: '',
            position: '',
            address: '',
            city: '',
            state: '',
            zipCode: '',
            rfc: '',
            businessType: 'Restaurante',
            notifications: {
              orderUpdates: true,
              promotions: true,
              newsletter: false,
              invoiceReminders: true
            }
          }
        }
        
        setProfileData(data)
        setOriginalData(data)
        
        // Cargar estadísticas del usuario
        const userOrders = await ordersService.getUserOrders(user.uid)
        setUserStats({
          memberSince: user.metadata?.creationTime || new Date(),
          totalOrders: userOrders.length,
          accountStatus: 'Al corriente'
        })
        
      } catch (err) {
        console.error('Error loading profile:', err)
        setError('Error al cargar el perfil. Por favor, intenta de nuevo.')
        
        // Fallback con datos básicos del usuario
        const fallbackData = {
          displayName: user?.displayName || '',
          email: user?.email || '',
          phone: '',
          company: '',
          position: '',
          address: '',
          city: '',
          state: '',
          zipCode: '',
          rfc: '',
          businessType: 'Restaurante',
          notifications: {
            orderUpdates: true,
            promotions: true,
            newsletter: false,
            invoiceReminders: true
          }
        }
        setProfileData(fallbackData)
        setOriginalData(fallbackData)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      loadProfileData()
    }
  }, [user])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    
    if (name.startsWith('notifications.')) {
      const notificationKey = name.split('.')[1]
      setProfileData(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [notificationKey]: checked
        }
      }))
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }))
    }
  }

  const handleSave = async () => {
    if (!user?.uid) return
    
    try {
      setSaving(true)
      setError(null)
      
      const profileToSave = {
        userId: user.uid,
        email: user.email,
        ...profileData,
        updatedAt: new Date()
      }
      
      // Guardar o actualizar perfil usando setUserProfile
      await userProfilesService.setUserProfile(user.uid, profileToSave)
      
      setOriginalData(profileData)
      setIsEditing(false)
      
    } catch (err) {
      console.error('Error saving profile:', err)
      setError('Error al guardar el perfil. Por favor, intenta de nuevo.')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setProfileData(originalData)
    setIsEditing(false)
  }

  const businessTypes = [
    'Restaurante',
    'Hotel',
    'Cafetería',
    'Bar',
    'Catering',
    'Panadería',
    'Repostería',
    'Cocina Industrial',
    'Otro'
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando perfil...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Mi Perfil</h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-red-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors"
          >
            ✏️ Editar Perfil
          </button>
        ) : (
          <div className="flex space-x-3">
            <button
              onClick={handleCancel}
              disabled={saving}
              className="bg-slate-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Guardando...' : '💾 Guardar'}
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Picture & Basic Info */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <img
                  src={user?.photoURL || '/default-avatar.png'}
                  alt={user?.displayName}
                  className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-slate-200"
                />
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                    📷
                  </button>
                )}
              </div>
              <h3 className="text-xl font-bold text-slate-900">{profileData.displayName}</h3>
              <p className="text-slate-600">{profileData.position}</p>
              <p className="text-slate-600">{profileData.company}</p>
            </div>

            {/* Account Stats */}
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Cliente desde:</span>
                  <span className="font-medium text-slate-900">
                    {userStats.memberSince ? new Date(userStats.memberSince).toLocaleDateString('es-ES', {
                      month: 'short',
                      year: 'numeric'
                    }) : 'N/A'}
                  </span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Total de pedidos:</span>
                  <span className="font-medium text-slate-900">{userStats.totalOrders}</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Estado de cuenta:</span>
                  <span className="font-medium text-green-600">{userStats.accountStatus}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Información Personal</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  name="displayName"
                  value={profileData.displayName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-slate-100 disabled:text-slate-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  disabled={true}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-slate-100 text-slate-600"
                />
                <p className="text-xs text-slate-500 mt-1">El email no se puede modificar</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-slate-100 disabled:text-slate-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Cargo/Posición
                </label>
                <input
                  type="text"
                  name="position"
                  value={profileData.position}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-slate-100 disabled:text-slate-600"
                />
              </div>
            </div>
          </div>

          {/* Company Information */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Información de la Empresa</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nombre de la Empresa
                </label>
                <input
                  type="text"
                  name="company"
                  value={profileData.company}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-slate-100 disabled:text-slate-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tipo de Negocio
                </label>
                <select
                  name="businessType"
                  value={profileData.businessType}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-slate-100 disabled:text-slate-600"
                >
                  {businessTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  RFC
                </label>
                <input
                  type="text"
                  name="rfc"
                  value={profileData.rfc}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-slate-100 disabled:text-slate-600"
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Dirección</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Dirección
                </label>
                <input
                  type="text"
                  name="address"
                  value={profileData.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-slate-100 disabled:text-slate-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Ciudad
                </label>
                <input
                  type="text"
                  name="city"
                  value={profileData.city}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-slate-100 disabled:text-slate-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Estado
                </label>
                <input
                  type="text"
                  name="state"
                  value={profileData.state}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-slate-100 disabled:text-slate-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Código Postal
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={profileData.zipCode}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-slate-100 disabled:text-slate-600"
                />
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Preferencias de Notificación</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">Actualizaciones de pedidos</p>
                  <p className="text-sm text-slate-600">Recibir notificaciones sobre el estado de tus pedidos</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="notifications.orderUpdates"
                    checked={profileData.notifications.orderUpdates}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">Promociones y ofertas</p>
                  <p className="text-sm text-slate-600">Recibir información sobre descuentos y promociones especiales</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="notifications.promotions"
                    checked={profileData.notifications.promotions}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">Newsletter</p>
                  <p className="text-sm text-slate-600">Recibir noticias y actualizaciones de la industria</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="notifications.newsletter"
                    checked={profileData.notifications.newsletter}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">Recordatorios de facturación</p>
                  <p className="text-sm text-slate-600">Recibir recordatorios sobre facturas pendientes</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="notifications.invoiceReminders"
                    checked={profileData.notifications.invoiceReminders}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Seguridad</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">Autenticación con Google</p>
                  <p className="text-sm text-slate-600">Tu cuenta está protegida con Google OAuth</p>
                </div>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  ✅ Activo
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">Última sesión</p>
                  <p className="text-sm text-slate-600">Hoy a las {new Date().toLocaleTimeString()}</p>
                </div>
                <button className="text-red-600 hover:text-red-700 font-medium">
                  Ver historial
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClientProfile