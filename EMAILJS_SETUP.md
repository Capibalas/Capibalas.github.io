# Configuración de EmailJS para BestWhip

Esta guía te ayudará a configurar EmailJS para enviar correos electrónicos desde la aplicación de BestWhip.

## ¿Qué es EmailJS?

EmailJS es un servicio que permite enviar correos electrónicos directamente desde JavaScript/React sin necesidad de un backend. Es ideal para:
- Formularios de contacto
- Confirmaciones de pedidos
- Notificaciones automáticas
- Emails transaccionales

## Paso 1: Crear una Cuenta en EmailJS

1. Ve a [https://www.emailjs.com/](https://www.emailjs.com/)
2. Haz clic en "Sign Up" (Registrarse)
3. Crea tu cuenta gratuita (incluye 200 emails/mes gratis)

## Paso 2: Conectar un Servicio de Email

1. Una vez dentro, ve a la sección **"Email Services"**
2. Haz clic en **"Add New Service"**
3. Selecciona tu proveedor de email:
   - **Gmail** (recomendado para cuentas personales)
   - **Outlook/Office365**
   - **Yahoo**
   - Otros servicios SMTP

### Configuración para Gmail:

1. Selecciona "Gmail"
2. Haz clic en "Connect Account"
3. Autoriza a EmailJS a usar tu cuenta de Gmail
4. **IMPORTANTE**: Asegúrate de que tu cuenta Gmail tenga habilitado el acceso de aplicaciones menos seguras o mejor aún, usa una "Contraseña de aplicación"
5. Copia el **Service ID** que se genera (ej: `service_abc123`)

## Paso 3: Crear Plantillas de Email

### Plantilla 1: Formulario de Contacto

1. Ve a la sección **"Email Templates"**
2. Haz clic en **"Create New Template"**
3. Configura la plantilla:

**Template Name:** `contact_form`

**Subject:** `Nuevo mensaje de contacto - {{from_name}}`

**Content (HTML):**
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #dc2626;">Nuevo Mensaje de Contacto - BestWhip</h2>
  
  <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h3 style="color: #1f2937; margin-top: 0;">Datos del Cliente:</h3>
    <p><strong>Nombre:</strong> {{from_name}}</p>
    <p><strong>Email:</strong> {{from_email}}</p>
    <p><strong>Teléfono:</strong> {{phone}}</p>
    <p><strong>Tipo de Negocio:</strong> {{business}}</p>
    <p><strong>Producto de Interés:</strong> {{interest}}</p>
  </div>
  
  <div style="background-color: #fff; padding: 20px; border-left: 4px solid #dc2626;">
    <h3 style="color: #1f2937; margin-top: 0;">Mensaje:</h3>
    <p style="line-height: 1.6;">{{message}}</p>
  </div>
  
  <div style="margin-top: 30px; padding: 15px; background-color: #fef2f2; border-radius: 8px;">
    <p style="margin: 0; color: #991b1b; font-size: 14px;">
      <strong>Responder a:</strong> {{from_email}}
    </p>
  </div>
</div>
```

**To Email:** `{{to_email}}` (o tu email fijo como `contacto@bestwhipmx.com`)

4. Guarda la plantilla y copia el **Template ID** (ej: `template_xyz789`)

### Plantilla 2: Confirmación de Pedido

1. Crea otra plantilla nueva
2. Configura:

**Template Name:** `order_confirmation`

**Subject:** `Confirmación de Pedido #{{order_number}} - BestWhip`

**Content (HTML):**
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="margin: 0;">¡Pedido Confirmado! 🎉</h1>
    <p style="font-size: 18px; margin: 10px 0 0 0;">Gracias por tu compra, {{to_name}}</p>
  </div>
  
  <div style="background-color: #f9fafb; padding: 30px;">
    <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
      <h2 style="color: #1f2937; margin-top: 0;">Detalles del Pedido</h2>
      <p><strong>Número de Pedido:</strong> {{order_number}}</p>
      <p><strong>Fecha:</strong> {{order_date}}</p>
    </div>
    
    <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
      <h3 style="color: #1f2937; margin-top: 0;">Productos</h3>
      <pre style="white-space: pre-wrap; font-family: monospace; background-color: #f3f4f6; padding: 15px; border-radius: 4px;">{{items_list}}</pre>
    </div>
    
    <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
      <h3 style="color: #1f2937; margin-top: 0;">Resumen de Pago</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">Subtotal:</td>
          <td style="padding: 8px 0; text-align: right; border-bottom: 1px solid #e5e7eb;">{{subtotal}}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">IVA (16%):</td>
          <td style="padding: 8px 0; text-align: right; border-bottom: 1px solid #e5e7eb;">{{iva}}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">Envío:</td>
          <td style="padding: 8px 0; text-align: right; border-bottom: 1px solid #e5e7eb;">{{shipping_cost}}</td>
        </tr>
        <tr style="font-weight: bold; font-size: 18px;">
          <td style="padding: 12px 0; color: #dc2626;">TOTAL:</td>
          <td style="padding: 12px 0; text-align: right; color: #dc2626;">{{total}}</td>
        </tr>
      </table>
    </div>
    
    <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
      <h3 style="color: #1f2937; margin-top: 0;">Dirección de Envío</h3>
      <p>{{shipping_address}}</p>
      <p>{{city}}, C.P. {{postal_code}}</p>
    </div>
    
    <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
      <h3 style="color: #1f2937; margin-top: 0;">Método de Pago</h3>
      <p>{{payment_method}}</p>
    </div>
    
    {{#if notes}}
    <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
      <h4 style="margin-top: 0; color: #92400e;">Notas Especiales:</h4>
      <p style="margin-bottom: 0; color: #78350f;">{{notes}}</p>
    </div>
    {{/if}}
  </div>
  
  <div style="background-color: #1f2937; color: white; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
    <p style="margin: 0 0 10px 0;">¿Tienes preguntas? Contáctanos:</p>
    <p style="margin: 0;">📧 contacto@bestwhipmx.com | 📱 +52 (56) 6054-7499</p>
  </div>
</div>
```

**To Email:** `{{to_email}}`

3. Guarda y copia el **Template ID**

## Paso 4: Obtener la Public Key

1. Ve a **"Account"** en el menú lateral
2. En la sección **"General"**, encontrarás tu **Public Key**
3. Cópiala (ej: `AbCdEfGhIjKlMnOp`)

## Paso 5: Configurar Variables de Entorno

1. Crea un archivo `.env.local` en la raíz del proyecto (si no existe)
2. Agrega las siguientes variables con tus valores reales:

```env
# EmailJS Configuration
VITE_EMAILJS_PUBLIC_KEY=tu_public_key_aqui
VITE_EMAILJS_SERVICE_ID=tu_service_id_aqui
VITE_EMAILJS_CONTACT_TEMPLATE_ID=tu_contact_template_id_aqui
VITE_EMAILJS_ORDER_TEMPLATE_ID=tu_order_template_id_aqui
```

### Ejemplo con valores reales:
```env
VITE_EMAILJS_PUBLIC_KEY=AbCdEfGhIjKlMnOp
VITE_EMAILJS_SERVICE_ID=service_abc123
VITE_EMAILJS_CONTACT_TEMPLATE_ID=template_xyz789
VITE_EMAILJS_ORDER_TEMPLATE_ID=template_def456
```

## Paso 6: Reiniciar el Servidor de Desarrollo

Después de configurar las variables de entorno:

```bash
npm run dev
```

## Cómo Funciona

### Formulario de Contacto
Cuando un usuario llena el formulario de contacto:
1. Se envía un email a tu dirección configurada (`contacto@bestwhipmx.com`)
2. El email contiene todos los datos del formulario
3. Automáticamente se abre WhatsApp como método adicional de contacto

### Confirmación de Pedidos
Cuando un cliente completa un pedido:
1. Se guarda el pedido en Firebase
2. Se envía un email de confirmación al cliente con todos los detalles
3. El cliente recibe una copia del pedido con número de orden, productos, total, etc.

## Verificación

Para verificar que EmailJS está funcionando:

1. Abre la consola del navegador (F12)
2. Llena el formulario de contacto o haz un pedido
3. Revisa la consola por mensajes como:
   - ✅ `Email enviado exitosamente`
   - ⚠️ `EmailJS no está configurado correctamente`

## Límites del Plan Gratuito

- **200 emails por mes** gratis
- Para más emails, considera actualizar a un plan pagado
- Los emails enviados se pueden ver en el dashboard de EmailJS

## Troubleshooting

### "EmailJS no está configurado correctamente"
- Verifica que todas las variables de entorno estén en el archivo `.env.local`
- Asegúrate de que las variables comiencen con `VITE_`
- Reinicia el servidor de desarrollo

### Los emails no llegan
- Verifica el spam/correo no deseado
- Revisa el dashboard de EmailJS para ver si el email se envió
- Verifica que el Service ID y Template IDs sean correctos

### Error 403 (Forbidden)
- Verifica que tu Public Key esté correcta
- Asegúrate de que el servicio de email esté activo en EmailJS

## Personalización Adicional

Puedes personalizar las plantillas según tus necesidades:
- Cambiar colores y diseño
- Agregar logo de la empresa
- Modificar el contenido del email
- Agregar campos adicionales

## Archivos Relacionados

- [`src/config/emailConfig.js`](src/config/emailConfig.js) - Configuración de EmailJS
- [`src/services/emailService.js`](src/services/emailService.js) - Servicio de envío de emails
- [`src/components/ContactForm.jsx`](src/components/ContactForm.jsx) - Formulario de contacto
- [`src/components/MakeOrder.jsx`](src/components/MakeOrder.jsx) - Sistema de pedidos

## Recursos Adicionales

- [Documentación oficial de EmailJS](https://www.emailjs.com/docs/)
- [EmailJS Dashboard](https://dashboard.emailjs.com/)
- [Ejemplos de plantillas](https://www.emailjs.com/docs/examples/)

---

**Nota:** Mantén tus credenciales de EmailJS seguras y nunca las compartas públicamente. El archivo `.env.local` está en `.gitignore` para evitar que se suba a GitHub.