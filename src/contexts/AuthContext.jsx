import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../firebase/auth'
import { isAdminEmail, isSuperAdmin } from '../config/adminConfig'
import { handleFirebaseError, retryFirebaseOperation } from '../utils/netlifyConfig'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isSuperAdminUser, setIsSuperAdminUser] = useState(false)
  const [devMode, setDevMode] = useState(false)

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((user) => {
      setUser(user)
      
      // Verificar si el usuario es administrador
      if (user && user.email) {
        const userIsAdmin = isAdminEmail(user.email)
        const userIsSuperAdmin = isSuperAdmin(user.email)
        setIsAdmin(userIsAdmin)
        setIsSuperAdminUser(userIsSuperAdmin)
        
        if (userIsSuperAdmin) {
          console.log('🔥 Super Admin access granted for:', user.email)
        } else if (userIsAdmin) {
          console.log('✅ Admin access granted for:', user.email)
        } else {
          console.log('❌ Admin access denied for:', user.email)
        }
      } else {
        setIsAdmin(false)
        setIsSuperAdminUser(false)
      }
      
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const login = async () => {
    try {
      const result = await retryFirebaseOperation(
        () => authService.signInWithGoogle(),
        3, // 3 intentos
        1000 // 1 segundo de delay
      )
      
      if (result.success) {
        return { success: true, user: result.user }
      } else {
        return { success: false, error: result.error }
      }
    } catch (error) {
      const handledError = handleFirebaseError(error.originalError || error)
      return { success: false, error: handledError.message }
    }
  }

  const logout = async () => {
    try {
      await authService.signOut()
      setUser(null)
      setIsAdmin(false)
      setIsSuperAdminUser(false)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const loginAsDev = () => {
    // Simular usuario de desarrollo
    const devUser = {
      uid: 'dev-user-123',
      email: 'dev@bestwhipmx.com',
      displayName: 'Usuario de Desarrollo',
      photoURL: null
    }
    setUser(devUser)
    setIsAdmin(false) // Usuario cliente, no admin
    setDevMode(true)
    setLoading(false)
    return { success: true, user: devUser }
  }

  const loginAsDevAdmin = () => {
    // Simular usuario administrador de desarrollo
    const devAdminUser = {
      uid: 'dev-admin-123',
      email: 'dev@bestwhipmx.com',
      displayName: 'Admin de Desarrollo',
      photoURL: null
    }
    setUser(devAdminUser)
    setIsAdmin(true) // Usuario admin
    setDevMode(true)
    setLoading(false)
    console.log('🔧 Modo desarrollo admin activado - Acceso completo habilitado')
    return { success: true, user: devAdminUser }
  }

  const value = {
    user,
    isAdmin,
    isSuperAdmin: isSuperAdminUser,
    loading,
    login,
    logout,
    loginAsDev,
    loginAsDevAdmin,
    devMode,
    isAuthenticated: !!user,
    hasAdminAccess: isAdmin
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Componente para proteger rutas que requieren autenticación
export const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, isAdmin, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Verificando acceso...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-white/50">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center text-3xl mb-4">
              🔒
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Acceso Requerido
            </h2>
            <p className="text-slate-600 mb-6">
              Necesitas iniciar sesión para acceder a esta página.
            </p>
            <a
              href="/login"
              className="inline-block bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-6 rounded-xl font-bold transition-all duration-300 transform hover:scale-105"
            >
              Iniciar Sesión
            </a>
          </div>
        </div>
      </div>
    )
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-white/50">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center text-3xl mb-4">
              ⛔
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Acceso Denegado
            </h2>
            <p className="text-slate-600 mb-2">
              No tienes permisos de administrador para acceder a esta página.
            </p>
            <p className="text-sm text-slate-500 mb-6">
              Usuario actual: {user.email}
            </p>
            <div className="space-y-3">
              <a
                href="/"
                className="block bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-6 rounded-xl font-bold transition-all duration-300 transform hover:scale-105"
              >
                Volver al Inicio
              </a>
              <button
                onClick={() => authService.signOut()}
                className="block w-full border-2 border-slate-300 hover:border-red-500 text-slate-700 hover:text-red-600 py-3 px-6 rounded-xl font-bold transition-all duration-300"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return children
}