import { useState } from 'react'
import { authService } from '../firebase/auth'
import { auth } from '../firebase/config'

const FirebaseTest = () => {
  const [testResult, setTestResult] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const testFirebaseConnection = async () => {
    setIsLoading(true)
    setTestResult('Probando conexión...')
    
    try {
      // Verificar que Firebase esté inicializado
      console.log('🔍 Verificando Firebase...')
      console.log('Auth object:', auth)
      console.log('Auth config:', auth.config)
      
      setTestResult('✅ Firebase inicializado correctamente')
      
      // Probar Google Auth
      console.log('🔍 Probando Google Auth...')
      const result = await authService.signInWithGoogle()
      
      if (result.success) {
        setTestResult(`✅ Login exitoso: ${result.user.email}`)
      } else {
        setTestResult(`❌ Error en login: ${result.error}`)
      }
      
    } catch (error) {
      console.error('Error en test:', error)
      setTestResult(`❌ Error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testLogout = async () => {
    try {
      await authService.signOut()
      setTestResult('✅ Logout exitoso')
    } catch (error) {
      setTestResult(`❌ Error en logout: ${error.message}`)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border max-w-sm z-50">
      <h3 className="font-bold text-sm mb-2">Firebase Test</h3>
      
      <div className="space-y-2">
        <button
          onClick={testFirebaseConnection}
          disabled={isLoading}
          className="w-full bg-blue-500 text-white px-3 py-2 rounded text-sm disabled:opacity-50"
        >
          {isLoading ? 'Probando...' : 'Probar Login'}
        </button>
        
        <button
          onClick={testLogout}
          className="w-full bg-red-500 text-white px-3 py-2 rounded text-sm"
        >
          Probar Logout
        </button>
      </div>
      
      {testResult && (
        <div className="mt-2 p-2 bg-gray-100 rounded text-xs">
          {testResult}
        </div>
      )}
      
      <div className="mt-2 text-xs text-gray-500">
        <p>Usuario actual: {auth.currentUser?.email || 'Ninguno'}</p>
      </div>
    </div>
  )
}

export default FirebaseTest