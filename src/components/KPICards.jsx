const KPICards = ({ kpis, tipoCambio }) => {
  const kpiData = [
    {
      title: "Ingresos Totales",
      value: kpis.totalIngresos.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }),
      subtitle: (kpis.totalIngresos / tipoCambio).toLocaleString('es-MX', { style: 'currency', currency: 'USD' }),
      icon: "💰",
      gradient: "from-emerald-500 to-emerald-600",
      bgGradient: "from-emerald-50 to-emerald-100",
      iconBg: "bg-emerald-100",
      textColor: "text-emerald-600"
    },
    {
      title: "Utilidad Bruta",
      value: kpis.utilidadBruta.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }),
      subtitle: `${((kpis.utilidadBruta / kpis.totalIngresos) * 100 || 0).toFixed(1)}% del total`,
      icon: "📈",
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100",
      iconBg: "bg-blue-100",
      textColor: "text-blue-600"
    },
    {
      title: "Utilidad Neta",
      value: kpis.utilidadNeta.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }),
      subtitle: kpis.utilidadNeta >= 0 ? "Ganancia positiva" : "Pérdida registrada",
      icon: kpis.utilidadNeta >= 0 ? "✅" : "⚠️",
      gradient: kpis.utilidadNeta >= 0 ? "from-purple-500 to-purple-600" : "from-red-500 to-red-600",
      bgGradient: kpis.utilidadNeta >= 0 ? "from-purple-50 to-purple-100" : "from-red-50 to-red-100",
      iconBg: kpis.utilidadNeta >= 0 ? "bg-purple-100" : "bg-red-100",
      textColor: kpis.utilidadNeta >= 0 ? "text-purple-600" : "text-red-600"
    },
    {
      title: "Margen Neto",
      value: `${kpis.margenNeto.toFixed(2)}%`,
      subtitle: kpis.margenNeto >= 20 ? "Excelente margen" : kpis.margenNeto >= 10 ? "Buen margen" : "Margen bajo",
      icon: "📊",
      gradient: kpis.margenNeto >= 0 ? "from-amber-500 to-amber-600" : "from-red-500 to-red-600",
      bgGradient: kpis.margenNeto >= 0 ? "from-amber-50 to-amber-100" : "from-red-50 to-red-100",
      iconBg: kpis.margenNeto >= 0 ? "bg-amber-100" : "bg-red-100",
      textColor: kpis.margenNeto >= 0 ? "text-amber-600" : "text-red-600"
    }
  ];

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">Métricas Clave</h2>
          <p className="text-slate-600 font-medium">Resumen ejecutivo de rendimiento financiero</p>
        </div>
        <div className="hidden md:block">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-xl flex items-center justify-center">
            <span className="text-2xl">🧮</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <div key={index} className={`group relative bg-gradient-to-br ${kpi.bgGradient} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-white/50`}>
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -translate-y-10 translate-x-10 group-hover:scale-110 transition-transform duration-300"></div>
            
            {/* Icon */}
            <div className={`w-14 h-14 ${kpi.iconBg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
              <span className="text-2xl">{kpi.icon}</span>
            </div>
            
            {/* Content */}
            <div className="relative z-10">
              <h3 className="text-slate-700 font-semibold text-sm mb-2">{kpi.title}</h3>
              <p className={`text-3xl font-black ${kpi.textColor} mb-1 group-hover:scale-105 transition-transform duration-300`}>
                {kpi.value}
              </p>
              <p className="text-slate-500 text-sm font-medium">
                {kpi.subtitle}
              </p>
            </div>
            
            {/* Gradient overlay on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${kpi.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default KPICards;