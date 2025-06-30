import { useState, useEffect } from 'react';
import { expensesService } from '../config/dataSource';

const ExpensesTable = ({ month, expenses, onExpensesUpdate }) => {
  const [currentExpenses, setCurrentExpenses] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (month && month !== 'all') {
      setCurrentExpenses(expenses[month] || {
        'Renta': 0,
        'Sueldos': 0,
        'Publicidad': 0,
        'Logística': 0,
        'Otros': 0
      });
    } else {
      setCurrentExpenses({});
    }
  }, [month, expenses]);

  const handleExpenseChange = (category, value) => {
    setCurrentExpenses(prev => ({
      ...prev,
      [category]: parseFloat(value) || 0
    }));
  };

  const saveExpenses = async () => {
    if (month === 'all' || !month) return;
    
    setLoading(true);
    try {
      await expensesService.setExpenses(month, currentExpenses);
      onExpensesUpdate();
    } catch (error) {
      alert('Error al guardar gastos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const totalExpenses = Object.values(currentExpenses).reduce((sum, value) => sum + value, 0);

  if (month === 'all') {
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-slate-800 mb-4">Gastos Operativos</h3>
        <p className="text-slate-500 text-center py-8">
          Selecciona un mes específico para ver y editar los gastos operativos.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-bold text-slate-800 mb-4">Gastos Operativos (Mensual)</h3>
      <div className="space-y-3">
        {Object.entries(currentExpenses).map(([category, value]) => (
          <div key={category} className="flex justify-between items-center">
            <span className="text-sm text-slate-600">{category}</span>
            <input
              type="number"
              value={value}
              onChange={(e) => handleExpenseChange(category, e.target.value)}
              className="w-24 text-right border-slate-300 rounded-md shadow-sm bg-blue-50 focus:ring-indigo-500 focus:border-indigo-500"
              step="0.01"
            />
          </div>
        ))}
      </div>
      
      <div className="flex justify-between items-center border-t pt-3 mt-3">
        <p className="font-bold">Total Gastos Op.</p>
        <p className="font-bold text-lg text-red-600">
          {totalExpenses.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
        </p>
      </div>

      <button
        onClick={saveExpenses}
        disabled={loading}
        className="w-full mt-4 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-all disabled:opacity-50"
      >
        {loading ? 'Guardando...' : 'Guardar Gastos'}
      </button>
    </div>
  );
};

export default ExpensesTable;