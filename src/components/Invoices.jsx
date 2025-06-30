import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { invoicesService } from '../firebase/services'

const Invoices = () => {
  const { user } = useAuth()
  const [invoices, setInvoices] = useState([])
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterYear, setFilterYear] = useState('2024')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadInvoices = async () => {
      if (!user?.uid) return
      
      try {
        setLoading(true)
        setError(null)
        const userInvoices = await invoicesService.getUserInvoices(user.uid)
        setInvoices(userInvoices)
      } catch (err) {
        console.error('Error loading invoices:', err)
        setError('Error al cargar las facturas. Por favor, intenta de nuevo.')
      } finally {
        setLoading(false)
      }
    }

    loadInvoices()
  }, [user?.uid])

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
      case 'Pagada':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'overdue':
      case 'Vencida':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
      case 'Pagada':
        return '✅'
      case 'pending':
      case 'Pendiente':
        return '⏳'
      case 'overdue':
      case 'Vencida':
        return '❌'
      default:
        return '🧾'
    }
  }

  const getStatusDisplayName = (status) => {
    switch (status) {
      case 'paid':
        return 'Pagada'
      case 'pending':
        return 'Pendiente'
      case 'overdue':
        return 'Vencida'
      default:
        return status
    }
  }

  const filteredInvoices = invoices.filter(invoice => {
    const invoiceDate = invoice.issueDate?.toDate?.() || invoice.issueDate || invoice.createdAt?.toDate?.() || invoice.createdAt
    const year = new Date(invoiceDate).getFullYear().toString()
    const yearMatch = filterYear === 'all' || year === filterYear
    const statusMatch = filterStatus === 'all' || invoice.status === filterStatus || getStatusDisplayName(invoice.status) === filterStatus
    return yearMatch && statusMatch
  })

  const downloadInvoice = (invoice) => {
    // Simular descarga de PDF
    alert(`Descargando factura ${invoice.id}...`)
  }

  const printInvoice = (invoice) => {
    // Simular impresión
    window.print()
  }

  if (selectedInvoice) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSelectedInvoice(null)}
              className="text-red-600 hover:text-red-700 font-medium"
            >
              ← Volver a facturas
            </button>
            <h2 className="text-2xl font-bold text-slate-900">Factura {selectedInvoice.id}</h2>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => downloadInvoice(selectedInvoice)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              📥 Descargar PDF
            </button>
            <button
              onClick={() => printInvoice(selectedInvoice)}
              className="bg-slate-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-600 transition-colors"
            >
              🖨️ Imprimir
            </button>
          </div>
        </div>

        {/* Invoice Detail */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
          {/* Invoice Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <img 
                src="/logo png.png" 
                alt="BestWhipMX Logo" 
                className="h-16 w-auto mb-4"
              />
              <div className="text-sm text-slate-600">
                <p>BestWhipMX</p>
                <p>Av. Ejemplo 123, CDMX</p>
                <p>RFC: BMX123456789</p>
                <p>Tel: +52 (56) 6054-7499</p>
              </div>
            </div>
            <div className="text-right">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">FACTURA</h1>
              <div className="text-sm text-slate-600">
                <p><span className="font-medium">Número:</span> {selectedInvoice.id}</p>
                <p><span className="font-medium">Fecha:</span> {new Date(selectedInvoice.issueDate?.toDate?.() || selectedInvoice.issueDate || selectedInvoice.createdAt?.toDate?.() || selectedInvoice.createdAt).toLocaleDateString()}</p>
                <p><span className="font-medium">Vencimiento:</span> {new Date(selectedInvoice.dueDate?.toDate?.() || selectedInvoice.dueDate).toLocaleDateString()}</p>
                <p><span className="font-medium">Pedido:</span> {selectedInvoice.orderNumber}</p>
              </div>
            </div>
          </div>

          {/* Client Info */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Facturar a:</h3>
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="font-medium text-slate-900">{selectedInvoice.clientInfo?.name || selectedInvoice.userEmail || user?.displayName || 'Cliente'}</p>
              <p className="text-slate-600">{selectedInvoice.clientInfo?.email || selectedInvoice.userEmail || user?.email}</p>
              <p className="text-slate-600">{selectedInvoice.clientInfo?.address || selectedInvoice.billingAddress || 'Dirección no especificada'}</p>
              <p className="text-slate-600">RFC: {selectedInvoice.clientInfo?.rfc || 'XAXX010101000'}</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="text-left py-3 font-bold text-slate-900">Descripción</th>
                  <th className="text-center py-3 font-bold text-slate-900">Cantidad</th>
                  <th className="text-right py-3 font-bold text-slate-900">Precio Unit.</th>
                  <th className="text-right py-3 font-bold text-slate-900">Total</th>
                </tr>
              </thead>
              <tbody>
                {selectedInvoice.items.map((item, index) => (
                  <tr key={index} className="border-b border-slate-200">
                    <td className="py-3 text-slate-900">{item.description || item.title || item.name}</td>
                    <td className="py-3 text-center text-slate-900">{item.quantity}</td>
                    <td className="py-3 text-right text-slate-900">${(item.unitPrice || item.price).toLocaleString()}</td>
                    <td className="py-3 text-right font-medium text-slate-900">${(item.total || item.subtotal || (item.price * item.quantity)).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64">
              <div className="flex justify-between py-2">
                <span className="text-slate-600">Subtotal:</span>
                <span className="font-medium text-slate-900">${selectedInvoice.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-600">IVA (16%):</span>
                <span className="font-medium text-slate-900">${selectedInvoice.tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-t border-slate-200">
                <span className="text-lg font-bold text-slate-900">Total:</span>
                <span className="text-lg font-bold text-slate-900">${selectedInvoice.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="mt-8 pt-8 border-t border-slate-200">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Estado de Pago</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedInvoice.status)}`}>
                      {getStatusIcon(selectedInvoice.status)} {getStatusDisplayName(selectedInvoice.status)}
                    </span>
                  </div>
                  {selectedInvoice.paymentDate && (
                    <p className="text-sm text-slate-600">
                      <span className="font-medium">Fecha de pago:</span> {new Date(selectedInvoice.paymentDate?.toDate?.() || selectedInvoice.paymentDate).toLocaleDateString()}
                    </p>
                  )}
                  <p className="text-sm text-slate-600">
                    <span className="font-medium">Método de pago:</span> {selectedInvoice.paymentMethod}
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Información Bancaria</h3>
                <div className="text-sm text-slate-600 space-y-1">
                  <p><span className="font-medium">Banco:</span> Banco Ejemplo</p>
                  <p><span className="font-medium">Cuenta:</span> 1234567890</p>
                  <p><span className="font-medium">CLABE:</span> 123456789012345678</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando facturas...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          <h3 className="font-bold mb-2">Error al cargar facturas</h3>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-900">Facturas</h2>
        
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Year Filter */}
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          >
            <option value="all">Todos los años</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2025">2025</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          >
            <option value="all">Todos los estados</option>
            <option value="paid">Pagadas</option>
            <option value="pending">Pendientes</option>
            <option value="overdue">Vencidas</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Total Facturas</p>
              <p className="text-3xl font-bold text-slate-900">{filteredInvoices.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
              🧾
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Pagadas</p>
              <p className="text-3xl font-bold text-green-600">
                {filteredInvoices.filter(inv => inv.status === 'paid' || inv.status === 'Pagada').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl">
              ✅
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Pendientes</p>
              <p className="text-3xl font-bold text-yellow-600">
                {filteredInvoices.filter(inv => inv.status === 'pending' || inv.status === 'Pendiente').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center text-2xl">
              ⏳
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Total Monto</p>
              <p className="text-2xl font-bold text-slate-900">
                ${filteredInvoices.reduce((sum, inv) => sum + inv.total, 0).toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-2xl">
              💰
            </div>
          </div>
        </div>
      </div>

      {/* Invoices List */}
      <div className="space-y-4">
        {filteredInvoices.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-12 text-center">
            <div className="text-6xl mb-4">🧾</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No hay facturas</h3>
            <p className="text-slate-600">No se encontraron facturas con los filtros seleccionados.</p>
          </div>
        ) : (
          filteredInvoices.map((invoice) => (
            <div
              key={invoice.id}
              className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => setSelectedInvoice(invoice)}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <h3 className="text-lg font-bold text-slate-900">{invoice.id}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(invoice.status)}`}>
                      {getStatusIcon(invoice.status)} {getStatusDisplayName(invoice.status)}
                    </span>
                  </div>
                  
                  <div className="grid md:grid-cols-4 gap-4 text-sm text-slate-600">
                    <div>
                      <span className="font-medium">Fecha:</span> {new Date(invoice.issueDate?.toDate?.() || invoice.issueDate || invoice.createdAt?.toDate?.() || invoice.createdAt).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">Vencimiento:</span> {new Date(invoice.dueDate?.toDate?.() || invoice.dueDate).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">Pedido:</span> {invoice.orderNumber || invoice.orderId}
                    </div>
                    <div>
                      <span className="font-medium">Total:</span>
                      <span className="text-lg font-bold text-slate-900 ml-1">
                        ${invoice.total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      downloadInvoice(invoice)
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                  >
                    📥 Descargar
                  </button>
                  <button className="text-red-600 hover:text-red-700 font-medium">
                    Ver detalles →
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Invoices