import { useState } from 'react';
import { clientsService } from '../config/dataSource';

const ClientConfig = ({ clients, onDataUpdate }) => {
  const [showAddClient, setShowAddClient] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);

  const handleAddClient = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await clientsService.addClient(newClient);
      setNewClient({ name: '', email: '', phone: '', address: '' });
      setShowAddClient(false);
      onDataUpdate();
    } catch (error) {
      alert('Error al agregar cliente: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClient = async (clientId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      try {
        await clientsService.deleteClient(clientId);
        onDataUpdate();
      } catch (error) {
        alert('Error al eliminar cliente: ' + error.message);
      }
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-slate-800">Gestión de Clientes</h3>
        <button 
          onClick={() => setShowAddClient(true)}
          className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-all"
        >
          + Nuevo Cliente
        </button>
      </div>

      <div className="space-y-3">
        {clients.map(client => (
          <div key={client.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
            <div>
              <h4 className="font-semibold">{client.name}</h4>
              {client.email && <p className="text-sm text-slate-600">{client.email}</p>}
              {client.phone && <p className="text-sm text-slate-600">{client.phone}</p>}
            </div>
            <button
              onClick={() => handleDeleteClient(client.id)}
              className="text-red-500 hover:text-red-700 font-bold"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Add Client Modal */}
      {showAddClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Añadir Nuevo Cliente</h3>
            <form onSubmit={handleAddClient} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Nombre *</label>
                <input
                  type="text"
                  value={newClient.name}
                  onChange={(e) => setNewClient(prev => ({ ...prev, name: e.target.value }))}
                  required
                  className="mt-1 w-full border-slate-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={newClient.email}
                  onChange={(e) => setNewClient(prev => ({ ...prev, email: e.target.value }))}
                  className="mt-1 w-full border-slate-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Teléfono</label>
                <input
                  type="tel"
                  value={newClient.phone}
                  onChange={(e) => setNewClient(prev => ({ ...prev, phone: e.target.value }))}
                  className="mt-1 w-full border-slate-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Dirección</label>
                <textarea
                  value={newClient.address}
                  onChange={(e) => setNewClient(prev => ({ ...prev, address: e.target.value }))}
                  className="mt-1 w-full border-slate-300 rounded-md"
                  rows="2"
                />
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowAddClient(false)}
                  className="bg-slate-200 px-4 py-2 rounded-md"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
                >
                  {loading ? 'Guardando...' : 'Guardar Cliente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientConfig;