# Configuración de Firebase para Netlify

## Problemas Identificados y Soluciones

### 1. Errores de CORS y Headers
**Problema:** Los headers de CORS estaban mal configurados causando errores de conexión.
**Solución:** Se actualizó `netlify.toml` con headers correctos para Firebase Auth.

### 2. Configuración de Variables de Entorno
**Problema:** Las variables de entorno no se estaban cargando correctamente en producción.
**Solución:** Se creó `.env.production` y se configuraron las variables en Netlify.

### 3. Inicialización de Firebase
**Problema:** Firebase no se inicializaba correctamente en el entorno de producción.
**Solución:** Se mejoró la inicialización con manejo de errores y reintentos.

## Configuración Requerida en Netlify

### Variables de Entorno
En el panel de Netlify, configurar las siguientes variables:

```
VITE_FIREBASE_API_KEY=AIzaSyCKh6ifKk0fXQlAy-ixQq-JRoAh4ppjUl0
VITE_FIREBASE_AUTH_DOMAIN=bestwhip-67e0b.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=bestwhip-67e0b
VITE_FIREBASE_STORAGE_BUCKET=bestwhip-67e0b.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=886546495426
VITE_FIREBASE_APP_ID=1:886546495426:web:f8f87f0938ec2dfec8085b
VITE_FIREBASE_MEASUREMENT_ID=G-GEJR9MKLTL
NODE_ENV=production
```

### Configuración de Firebase Console

1. **Dominios Autorizados:**
   - Agregar el dominio de Netlify (ej: `bestwhip.netlify.app`)
   - Agregar el dominio personalizado (ej: `bestwhip.com.mx`)

2. **Firestore Database:**
   - Asegurarse de que la base de datos esté creada
   - Verificar las reglas de seguridad

3. **Authentication:**
   - Habilitar Google Sign-In
   - Configurar dominios autorizados

## Archivos Modificados

### 1. `src/firebase/config.js`
- Mejorada la inicialización con manejo de errores
- Agregado soporte para detección de entorno

### 2. `src/utils/netlifyConfig.js` (NUEVO)
- Configuración específica para Netlify
- Manejo de errores de Firebase
- Sistema de reintentos

### 3. `src/contexts/AuthContext.jsx`
- Integrado el sistema de reintentos
- Mejorado el manejo de errores

### 4. `netlify.toml`
- Corregidos los headers de CORS
- Optimizada la configuración para Firebase

### 5. `public/_redirects` (NUEVO)
- Configuración de redirects para SPA

### 6. `.env.production` (NUEVO)
- Variables de entorno para producción

## Pasos para Desplegar

1. **Commit y Push de los cambios**
2. **Configurar variables de entorno en Netlify**
3. **Verificar dominios en Firebase Console**
4. **Desplegar en Netlify**
5. **Probar la funcionalidad de autenticación**

## Verificación

Para verificar que todo funciona:

1. Abrir la consola del navegador
2. Buscar mensajes de "Firebase connected successfully"
3. Probar el login con Google
4. Verificar que no hay errores de CORS

## Troubleshooting

### Error: "Firebase connection error"
- Verificar que las variables de entorno estén configuradas
- Comprobar que el dominio esté autorizado en Firebase

### Error: "Popup blocked"
- Verificar los headers de Cross-Origin-Opener-Policy
- Asegurarse de que el dominio esté en la lista de autorizados

### Error: "Permission denied"
- Verificar las reglas de Firestore
- Comprobar que la base de datos esté creada