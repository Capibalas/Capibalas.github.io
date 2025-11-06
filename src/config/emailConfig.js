// EmailJS Configuration
// Para obtener estas credenciales:
// 1. Crear cuenta en https://www.emailjs.com/
// 2. Ir a Email Services y agregar un servicio (Gmail, Outlook, etc.)
// 3. Ir a Email Templates y crear plantillas personalizadas
// 4. Ir a Account para obtener tu Public Key

export const emailConfig = {
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '',
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || '',
  contactTemplateId: import.meta.env.VITE_EMAILJS_CONTACT_TEMPLATE_ID || '',
  orderTemplateId: import.meta.env.VITE_EMAILJS_ORDER_TEMPLATE_ID || '',
}

// Validar configuración
export const validateEmailConfig = () => {
  const { publicKey, serviceId } = emailConfig
  
  if (!publicKey || !serviceId) {
    console.warn('EmailJS no está configurado correctamente. Verifica las variables de entorno.')
    return false
  }
  
  return true
}