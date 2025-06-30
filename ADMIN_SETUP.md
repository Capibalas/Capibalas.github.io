# Configuración de Acceso de Administrador

## Instrucciones para configurar tu acceso de administrador

### 1. Agregar tu email de administrador

Para obtener acceso al portal B2B, necesitas agregar tu email de Google a la lista de administradores autorizados.

**Pasos:**

1. Abre el archivo `src/config/adminConfig.js`
2. Reemplaza `'tu-email@gmail.com'` con tu email real de Google
3. Guarda el archivo

**Ejemplo:**
```javascript
export const ADMIN_EMAILS = [
  'mi-email@gmail.com', // Tu email real aquí
  // Puedes agregar más emails de administradores aquí
]
```

### 2. Cómo funciona el sistema de autenticación

- **Acceso público**: Cualquier usuario puede ver la landing page y el catálogo de productos
- **Acceso restringido**: Solo los emails en `ADMIN_EMAILS` pueden acceder al portal B2B
- **Autenticación**: Se usa Google OAuth para el login

### 3. Rutas protegidas

- `/login` - Página de login con Google
- `/dashboard` - Portal B2B (solo administradores)
- `/setup` - Configuración inicial (solo administradores)

### 4. Flujo de autenticación

1. Usuario hace clic en "Portal B2B" o "Acceso B2B"
2. Es redirigido a `/login`
3. Hace login con Google
4. El sistema verifica si su email está en la lista de administradores
5. Si es administrador: acceso concedido al portal B2B
6. Si no es administrador: mensaje de acceso denegado

### 5. Agregar más administradores

Para agregar más administradores, simplemente agrega sus emails a la lista en `adminConfig.js`:

```javascript
export const ADMIN_EMAILS = [
  'admin1@gmail.com',
  'admin2@gmail.com',
  'gerente@empresa.com',
  // Agrega más emails aquí
]
```

### 6. Características de seguridad

- ✅ Autenticación con Google OAuth
- ✅ Verificación de email en lista blanca
- ✅ Rutas protegidas con componente ProtectedRoute
- ✅ Estado de autenticación persistente
- ✅ Logout seguro
- ✅ Mensajes de error informativos

### 7. Desarrollo y testing

Durante el desarrollo, puedes:

1. Agregar tu email de desarrollo a la lista
2. Usar la consola del navegador para ver logs de autenticación
3. Verificar el estado de autenticación en las herramientas de desarrollo

### 8. Producción

En producción, asegúrate de:

1. Solo incluir emails de administradores reales
2. Remover emails de testing/desarrollo
3. Verificar que Firebase esté configurado correctamente
4. Probar el flujo completo de autenticación

## Solución de problemas

### Error: "Admin access denied"
- Verifica que tu email esté correctamente escrito en `adminConfig.js`
- Asegúrate de usar el mismo email con el que haces login en Google

### Error: "Firebase connection error"
- Verifica la configuración de Firebase en `src/firebase/config.js`
- Asegúrate de que la autenticación esté habilitada en Firebase Console

### Error: "Google login failed"
- Verifica que el dominio esté autorizado en Firebase Console
- Revisa la configuración de OAuth en Google Cloud Console

## Contacto

Si tienes problemas con la configuración, revisa los logs de la consola del navegador para más detalles sobre los errores.