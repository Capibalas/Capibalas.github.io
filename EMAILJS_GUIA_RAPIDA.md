# EmailJS - Guía Rápida de Configuración

## 🚀 Configuración Rápida en 5 Pasos

### 1️⃣ Instalar Dependencias
```bash
npm install @emailjs/browser
```
✅ Ya instalado

### 2️⃣ Crear Cuenta en EmailJS
- Ve a [emailjs.com](https://www.emailjs.com/) y regístrate
- Plan gratis incluye 200 emails/mes

### 3️⃣ Configurar Servicio de Email
1. Email Services → Add New Service
2. Selecciona Gmail (o tu proveedor)
3. Conecta tu cuenta
4. Copia el **Service ID**

### 4️⃣ Crear Plantillas

#### Plantilla de Contacto:
- Name: `contact_form`
- Subject: `Nuevo mensaje de contacto - {{from_name}}`
- Variables: `{{from_name}}`, `{{from_email}}`, `{{phone}}`, `{{business}}`, `{{interest}}`, `{{message}}`, `{{to_email}}`

#### Plantilla de Pedido:
- Name: `order_confirmation`
- Subject: `Confirmación de Pedido #{{order_number}} - BestWhip`
- Variables: `{{to_name}}`, `{{to_email}}`, `{{order_number}}`, `{{order_date}}`, `{{items_list}}`, `{{subtotal}}`, `{{iva}}`, `{{shipping_cost}}`, `{{total}}`, `{{shipping_address}}`, `{{city}}`, `{{postal_code}}`, `{{payment_method}}`, `{{notes}}`

### 5️⃣ Configurar Variables de Entorno

Crea `.env.local` con:
```env
VITE_EMAILJS_PUBLIC_KEY=tu_public_key
VITE_EMAILJS_SERVICE_ID=tu_service_id
VITE_EMAILJS_CONTACT_TEMPLATE_ID=tu_contact_template_id
VITE_EMAILJS_ORDER_TEMPLATE_ID=tu_order_template_id
```

### 6️⃣ Reiniciar Servidor
```bash
npm run dev
```

## ✅ Verificar Funcionamiento

1. Llena el formulario de contacto
2. Revisa la consola del navegador (F12)
3. Busca: `Email enviado exitosamente`
4. Revisa tu bandeja de entrada

## 📧 Qué se envía automáticamente

### Formulario de Contacto
- ✉️ Email a: `contacto@bestwhipmx.com`
- 📱 WhatsApp: Se abre automáticamente también

### Pedidos
- ✉️ Email al cliente con confirmación completa
- 💾 Pedido guardado en Firebase
- 📄 Incluye: productos, totales, dirección, método de pago

## 🔧 Archivos Creados

```
src/
  config/
    emailConfig.js          ← Configuración
  services/
    emailService.js         ← Lógica de envío
  components/
    ContactForm.jsx         ← Integrado ✅
    MakeOrder.jsx           ← Integrado ✅
```

## 📚 Documentación Completa

Ver [`EMAILJS_SETUP.md`](EMAILJS_SETUP.md) para instrucciones detalladas con ejemplos de plantillas HTML.

## 💡 Notas Importantes

- Las variables de entorno DEBEN comenzar con `VITE_`
- El archivo `.env.local` NO se sube a GitHub (está en .gitignore)
- Si los emails no llegan, revisa la carpeta de spam
- Plan gratuito: 200 emails/mes

## 🆘 Problemas Comunes

**No se envían emails:**
- ❌ Olvidaste reiniciar el servidor después de crear `.env.local`
- ❌ Variables mal configuradas
- ❌ Service ID o Template IDs incorrectos

**Solución:**
1. Verifica `.env.local`
2. Reinicia: `npm run dev`
3. Revisa consola del navegador

---

**¿Necesitas ayuda?** Consulta la documentación completa en [`EMAILJS_SETUP.md`](EMAILJS_SETUP.md)