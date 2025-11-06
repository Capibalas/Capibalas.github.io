import emailjs from '@emailjs/browser'
import { emailConfig, validateEmailConfig } from '../config/emailConfig'

// Inicializar EmailJS con la public key
const initEmailJS = () => {
  if (emailConfig.publicKey) {
    emailjs.init(emailConfig.publicKey)
  }
}

// Llamar a la inicialización cuando se carga el módulo
initEmailJS()

/**
 * Enviar email de contacto desde el formulario
 * @param {Object} formData - Datos del formulario de contacto
 * @returns {Promise} - Promesa con el resultado del envío
 */
export const sendContactEmail = async (formData) => {
  if (!validateEmailConfig()) {
    throw new Error('EmailJS no está configurado correctamente')
  }

  if (!emailConfig.contactTemplateId) {
    console.warn('No hay template ID para emails de contacto configurado')
    return null
  }

  const templateParams = {
    from_name: formData.name,
    from_email: formData.email,
    phone: formData.phone || 'No proporcionado',
    business: formData.business || 'No especificado',
    interest: formData.interest || 'Información general',
    message: formData.message || 'Sin mensaje adicional',
    to_email: 'contacto@bestwhipmx.com', // Email de destino
  }

  try {
    const response = await emailjs.send(
      emailConfig.serviceId,
      emailConfig.contactTemplateId,
      templateParams
    )
    console.log('Email de contacto enviado exitosamente:', response)
    return response
  } catch (error) {
    console.error('Error al enviar email de contacto:', error)
    throw error
  }
}

/**
 * Enviar email de confirmación de pedido
 * @param {Object} orderData - Datos del pedido
 * @returns {Promise} - Promesa con el resultado del envío
 */
export const sendOrderConfirmationEmail = async (orderData) => {
  if (!validateEmailConfig()) {
    throw new Error('EmailJS no está configurado correctamente')
  }

  if (!emailConfig.orderTemplateId) {
    console.warn('No hay template ID para emails de pedido configurado')
    return null
  }

  // Formatear items del pedido para el email
  const itemsList = orderData.items
    .map((item, index) => 
      `${index + 1}. ${item.title} - Cantidad: ${item.quantity} - Subtotal: $${item.subtotal.toLocaleString()}`
    )
    .join('\n')

  const templateParams = {
    to_name: orderData.userEmail.split('@')[0], // Nombre del usuario del email
    to_email: orderData.userEmail,
    order_number: `ORD-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
    order_date: new Date().toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    items_list: itemsList,
    subtotal: `$${orderData.subtotal.toLocaleString()}`,
    iva: `$${orderData.iva.toLocaleString()}`,
    shipping_cost: orderData.shippingCost === 0 ? 'GRATIS' : `$${orderData.shippingCost.toLocaleString()}`,
    total: `$${orderData.total.toLocaleString()}`,
    shipping_address: orderData.shippingAddress,
    city: orderData.city,
    postal_code: orderData.postalCode,
    payment_method: orderData.paymentMethod === 'transferencia' ? 'Transferencia Bancaria' : 
                     orderData.paymentMethod === 'tarjeta' ? 'Tarjeta de Crédito' : 'Pago Contra Entrega',
    notes: orderData.notes || 'Sin notas especiales',
  }

  try {
    const response = await emailjs.send(
      emailConfig.serviceId,
      emailConfig.orderTemplateId,
      templateParams
    )
    console.log('Email de confirmación de pedido enviado exitosamente:', response)
    return response
  } catch (error) {
    console.error('Error al enviar email de confirmación:', error)
    throw error
  }
}

/**
 * Enviar email personalizado
 * @param {string} templateId - ID de la plantilla de EmailJS
 * @param {Object} params - Parámetros para la plantilla
 * @returns {Promise} - Promesa con el resultado del envío
 */
export const sendCustomEmail = async (templateId, params) => {
  if (!validateEmailConfig()) {
    throw new Error('EmailJS no está configurado correctamente')
  }

  try {
    const response = await emailjs.send(
      emailConfig.serviceId,
      templateId,
      params
    )
    console.log('Email personalizado enviado exitosamente:', response)
    return response
  } catch (error) {
    console.error('Error al enviar email personalizado:', error)
    throw error
  }
}

export default {
  sendContactEmail,
  sendOrderConfirmationEmail,
  sendCustomEmail,
}