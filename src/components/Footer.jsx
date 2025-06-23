const Footer = () => {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { name: 'Facebook', icon: '📘', url: '#' },
    { name: 'Instagram', icon: '📷', url: '#' },
    { name: 'WhatsApp', icon: '💬', url: '#' },
    { name: 'YouTube', icon: '📹', url: '#' }
  ]

  const quickLinks = [
    { name: 'Productos', href: '#productos' },
    { name: 'Características', href: '#caracteristicas' },
    { name: 'Contacto', href: '#contacto' },
    { name: 'Soporte', href: '#' }
  ]

  const productLinks = [
    { name: 'Sifón Profesional 0.5L', href: '#' },
    { name: 'Sifón Premium 1L', href: '#' },
    { name: 'Cápsulas N2O Premium', href: '#' },
    { name: 'Accesorios', href: '#' }
  ]

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-red-600 to-red-700"></div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-red-500/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-red-600/5 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <h3 className="text-3xl font-bold mb-4">
                Best<span className="italic text-red-300">Whip</span><span className="text-red-400">MX</span>
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Equipamiento profesional para elevar tu experiencia culinaria. Calidad premium, resultados excepcionales.
              </p>
            </div>
            
            {/* Social Links */}
            <div className="space-y-3">
              <h4 className="text-white font-semibold">Síguenos</h4>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-lg hover:bg-red-500/20 hover:scale-110 transition-all duration-300 border border-white/20"
                    title={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-6">Enlaces Rápidos</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-red-400 transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-red-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-white font-semibold mb-6">Productos</h4>
            <ul className="space-y-3">
              {productLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-red-400 transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-red-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-6">Contacto</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <span className="text-red-400 mt-1">📍</span>
                <div>
                  <p className="text-gray-400">Ciudad de México</p>
                  <p className="text-gray-500 text-sm">Envíos a toda la República</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <span className="text-red-400 mt-1">📞</span>
                <div>
                  <p className="text-gray-400">+52 (55) 1234-5678</p>
                  <p className="text-gray-500 text-sm">Lun - Vie: 9:00 AM - 6:00 PM</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <span className="text-red-400 mt-1">✉️</span>
                <div>
                  <p className="text-gray-400">info@bestwhipmx.com</p>
                  <p className="text-gray-500 text-sm">Respuesta en 24 horas</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-red-500/10 to-red-600/10 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-red-400/20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h4 className="text-2xl font-bold text-white mb-2">
                Mantente Actualizado
              </h4>
              <p className="text-gray-400">
                Recibe ofertas especiales, tips culinarios y novedades directamente en tu email
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="tu@email.com"
                className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/50 transition-all duration-300"
              />
              <button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 whitespace-nowrap">
                Suscribirse
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {currentYear} BestWhipMX. Todos los derechos reservados.
            </div>
            <div className="flex flex-wrap gap-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-red-400 transition-colors">
                Política de Privacidad
              </a>
              <a href="#" className="text-gray-400 hover:text-red-400 transition-colors">
                Términos de Servicio
              </a>
              <a href="#" className="text-gray-400 hover:text-red-400 transition-colors">
                Política de Devoluciones
              </a>
            </div>
          </div>
        </div>

        {/* Made with love */}
        <div className="text-center mt-8 pt-6 border-t border-gray-800">
          <p className="text-gray-500 text-sm flex items-center justify-center">
            Hecho con <span className="text-red-400 mx-2 animate-pulse">❤️</span> para chefs apasionados
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer