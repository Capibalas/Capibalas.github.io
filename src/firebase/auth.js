import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from './config';

const googleProvider = new GoogleAuthProvider();

// Configure Google provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export const authService = {
  // Sign in with Google
  async signInWithGoogle() {
    try {
      console.log('🔄 Iniciando signInWithPopup...');
      const result = await signInWithPopup(auth, googleProvider);
      console.log('✅ Login exitoso:', result.user.email);
      return {
        user: result.user,
        success: true
      };
    } catch (error) {
      console.error('❌ Error signing in with Google:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      let userFriendlyMessage = 'Error al iniciar sesión con Google';
      
      // Mensajes más específicos según el tipo de error
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          userFriendlyMessage = 'Login cancelado. Por favor, inténtalo de nuevo.';
          break;
        case 'auth/popup-blocked':
          userFriendlyMessage = 'Popup bloqueado por el navegador. Permite popups para este sitio.';
          break;
        case 'auth/cancelled-popup-request':
          userFriendlyMessage = 'Solicitud de login cancelada.';
          break;
        case 'auth/network-request-failed':
          userFriendlyMessage = 'Error de conexión. Verifica tu internet.';
          break;
        case 'auth/too-many-requests':
          userFriendlyMessage = 'Demasiados intentos. Espera un momento e inténtalo de nuevo.';
          break;
        default:
          userFriendlyMessage = `Error: ${error.message}`;
      }
      
      return {
        user: null,
        success: false,
        error: userFriendlyMessage
      };
    }
  },

  // Sign out
  async signOut() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Error signing out:', error);
      return { success: false, error: error.message };
    }
  },

  // Get current user
  getCurrentUser() {
    return auth.currentUser;
  },

  // Listen to auth state changes
  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, callback);
  }
};