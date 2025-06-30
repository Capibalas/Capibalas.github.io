// Configuración de administradores
// Agrega aquí los emails de Google que tendrán acceso de administrador al portal B2B

export const ADMIN_EMAILS = [
  // Email de administrador principal:
  'contacto@bestwhip.com.mx',
  
  // Emails adicionales de administradores:
  // 'admin@bestwhipmx.com',
  // 'gerente@bestwhipmx.com',
  
  // Email de desarrollo (solo para testing):
  'dev@bestwhipmx.com',
]

// Función para verificar si un email es administrador
export const isAdminEmail = (email) => {
  if (!email) return false
  return ADMIN_EMAILS.includes(email.toLowerCase())
}

// Función para agregar un nuevo administrador (solo para desarrollo)
export const addAdminEmail = (email) => {
  if (email && !ADMIN_EMAILS.includes(email.toLowerCase())) {
    ADMIN_EMAILS.push(email.toLowerCase())
    console.log(`✅ Admin email added: ${email}`)
  }
}

export default {
  ADMIN_EMAILS,
  isAdminEmail,
  addAdminEmail
}