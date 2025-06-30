# Configuración de Firebase Authentication

## Problema: "No pasa nada" al hacer login con Google

Si el login con Google no funciona, sigue estos pasos para configurar Firebase Authentication:

### 1. Verificar Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto: `bestwhip-67e0b`
3. En el menú lateral, ve a **Authentication**

### 2. Habilitar Google Authentication

1. En Authentication, ve a la pestaña **Sign-in method**
2. Busca **Google** en la lista de proveedores
3. Haz clic en **Google** para configurarlo
4. **Habilita** el proveedor Google
5. Configura los campos requeridos:
   - **Project support email**: Tu email
   - **Project public-facing name**: BestWhipMX
6. Guarda los cambios

### 3. Configurar dominios autorizados

1. En Authentication > Settings > **Authorized domains**
2. Asegúrate de que estén agregados:
   - `localhost` (para desarrollo)
   - Tu dominio de producción (si aplica)

### 4. Verificar configuración OAuth

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Selecciona el proyecto asociado a Firebase
3. Ve a **APIs & Services > Credentials**
4. Busca el **OAuth 2.0 Client ID** creado por Firebase
5. Verifica que en **Authorized JavaScript origins** esté:
   - `http://localhost:3000` (para desarrollo)
   - `http://localhost:5173` (para Vite)
   - Tu dominio de producción

### 5. Verificar configuración en código

Asegúrate de que en `src/firebase/config.js` tengas la configuración correcta:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyCKh6ifKk0fXQlAy-ixQq-JRoAh4ppjUl0",
  authDomain: "bestwhip-67e0b.firebaseapp.com",
  projectId: "bestwhip-67e0b",
  storageBucket: "bestwhip-67e0b.firebasestorage.app",
  messagingSenderId: "886546495426",
  appId: "1:886546495426:web:f8f87f0938ec2dfec8085b",
  measurementId: "G-GEJR9MKLTL"
};
```

### 6. Probar la configuración

1. Ve a `/login` en tu aplicación
2. Abre las herramientas de desarrollador (F12)
3. Ve a la pestaña **Console**
4. Haz clic en "Continuar con Google"
5. Revisa los logs en la consola para ver errores específicos

### 7. Errores comunes y soluciones

#### Error: "popup-blocked"
- **Solución**: Permite popups en tu navegador para localhost

#### Error: "unauthorized-domain"
- **Solución**: Agrega tu dominio a los dominios autorizados en Firebase

#### Error: "api-key-not-valid"
- **Solución**: Verifica que la API key en `config.js` sea correcta

#### Error: "auth-domain-config-required"
- **Solución**: Verifica que `authDomain` esté configurado correctamente

### 8. Verificar en modo incógnito

Prueba el login en una ventana de incógnito para descartar problemas de caché o extensiones del navegador.

### 9. Logs de debug

En la página de login, verás un panel de debug (solo en desarrollo) que muestra:
- Estado del usuario
- Estado de admin
- Estado de loading

### 10. Contacto

Si sigues teniendo problemas:
1. Revisa la consola del navegador para errores específicos
2. Verifica que Firebase Authentication esté habilitado
3. Confirma que Google como proveedor esté configurado
4. Asegúrate de que los dominios estén autorizados

## Comandos útiles para debug

```bash
# Verificar que el proyecto esté corriendo
npm run dev

# Limpiar caché del navegador
Ctrl + Shift + R (o Cmd + Shift + R en Mac)