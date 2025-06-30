import { useState } from 'react';
import { salesService } from '../config/dataSource';

const SalesEntry = ({ products, clients, onSaleAdded }) => {
  const [saleData, setSaleData] = useState({
    date: new Date().toISOString().split('T')[0],
    clientId: '',
    items: [{ productId: '', quantity: 1 }]
  });
  const [loading, setLoading] = useState(false);

  const addSaleItem = () => {
    setSaleData(prev => ({
      ...prev,
      items: [...prev.items, { productId: '', quantity: 1 }]
    }));
  };

  const removeSaleItem = (index) => {
    setSaleData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateSaleItem = (index, field, value) => {
    setSaleData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Validate data
      if (!saleData.clientId) {
        alert('Por favor selecciona un cliente');
        return;
      }

      const validItems = saleData.items.filter(item => item.productId && item.quantity > 0);
      if (validItems.length === 0) {
        alert('Por favor agrega al menos un producto válido');
        return;
      }

      // Create sales records for each item
      for (const item of validItems) {
        await salesService.addSale({
          date: new Date(saleData.date),
          clientId: saleData.clientId,
          productId: item.productId,
          quantity: parseInt(item.quantity),
          channel: clients.find(c => c.id === saleData.clientId)?.name === "Venta en Línea" ? "En línea" : "Mayoreo"
        });
      }

      // Reset form
      setSaleData({
        date: new Date().toISOString().split('T')[0],
        clientId: '',
        items: [{ productId: '', quantity: 1 }]
      });

      alert('Venta registrada con éxito');
      onSaleAdded();
    } catch (error) {
      alert('Error al registrar venta: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <details className="bg-white rounded-xl p-6 shadow-lg" open>
      <summary className="font-bold text-xl text-slate-800 cursor-pointer">📝 Registrar Nueva Venta</summary>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="sale-date" className="block text-sm font-medium text-slate-700">Fecha</label>
            <input 
              type="date" 
              id="sale-date" 
              value={saleData.date}
              onChange={(e) => setSaleData(prev => ({ ...prev, date: e.target.value }))}
              required 
              className="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="sale-client" className="block text-sm font-medium text-slate-700">Cliente</label>
            <select 
              id="sale-client" 
              value={saleData.clientId}
              onChange={(e) => setSaleData(prev => ({ ...prev, clientId: e.target.value }))}
              required 
              className="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Seleccionar cliente</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>{client.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Productos</label>
          {saleData.items.map((item, index) => (
            <div key={index} className="grid grid-cols-3 gap-2 items-center">
              <select
                value={item.productId}
                onChange={(e) => updateSaleItem(index, 'productId', e.target.value)}
                className="w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">Seleccionar producto</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>{product.name}</option>
                ))}
              </select>
              
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => updateSaleItem(index, 'quantity', e.target.value)}
                min="1"
                className="w-full border-slate-300 rounded-md shadow-sm text-center focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Cantidad"
                required
              />
              
              <button
                type="button"
                onClick={() => removeSaleItem(index)}
                className="text-red-500 font-bold hover:text-red-700"
                disabled={saleData.items.length === 1}
              >
                ✕
              </button>
            </div>
          ))}
          
          <button
            type="button"
            onClick={addSaleItem}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
          >
            + Añadir Producto
          </button>
        </div>

        <div className="border-t pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-green-700 transition-all disabled:opacity-50"
          >
            {loading ? 'Registrando...' : 'Registrar Nota de Venta'}
          </button>
        </div>
      </form>
    </details>
  );
};

export default SalesEntry;