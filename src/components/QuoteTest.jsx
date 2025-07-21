import { useState, useEffect } from 'react';
import { ordersService } from '../firebase/services';

const QuoteTest = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const allOrders = await ordersService.getAllOrders();
      console.log('Órdenes cargadas:', allOrders);
      setOrders(allOrders);
    } catch (error) {
      console.error('Error al cargar órdenes:', error);
    } finally {
      setLoading(false);
    }
  };

  const testSaveOrder = async () => {
    try {
      const testOrder = {
        userId: 'test_user',
        userEmail: 'test@example.com',
        userName: 'Usuario de Prueba',
        userPhone: '5551234567',
        items: [{
          productId: 'test_product',
          title: 'Producto de Prueba',
          quantity: 5,
          price: 100,
          subtotal: 500
        }],
        total: 500,
        status: 'pending',
        notes: 'Esta es una cotización de prueba',
        shippingAddress: 'Dirección de prueba',
        paymentMethod: 'Por cotizar',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const orderId = await ordersService.addOrder(testOrder);
      console.log('Cotización guardada con ID:', orderId);
      alert(`Cotización guardada exitosamente con ID: ${orderId}`);
      
      // Recargar la lista
      await loadOrders();
      
    } catch (error) {
      console.error('Error al guardar cotización de prueba:', error);
      alert('Error al guardar: ' + error.message);
    }
  };

  if (loading) {
    return <div className="p-4">Cargando cotizaciones...</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Prueba de Cotizaciones</h2>
      
      <button 
        onClick={testSaveOrder}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Guardar Cotización de Prueba
      </button>

      <button 
        onClick={loadOrders}
        className="bg-green-500 text-white px-4 py-2 rounded ml-2"
      >
        Recargar Órdenes
      </button>

      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Cotizaciones actuales ({orders.length}):</h3>
        {orders.length === 0 ? (
          <p className="text-gray-500">No hay cotizaciones aún</p>
        ) : (
          <div className="space-y-2">
            {orders.map(order => (
              <div key={order.id} className="border p-3 rounded">
                <p><strong>ID:</strong> {order.id}</p>
                <p><strong>Cliente:</strong> {order.userName || order.userEmail}</p>
                <p><strong>Producto:</strong> {order.items?.[0]?.title || 'Sin producto'}</p>
                <p><strong>Cantidad:</strong> {order.items?.[0]?.quantity || 0}</p>
                <p><strong>Total:</strong> ${order.total || 0}</p>
                <p><strong>Estado:</strong> {order.status}</p>
                <p><strong>Fecha:</strong> {new Date(order.createdAt?.toDate?.() || order.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuoteTest;