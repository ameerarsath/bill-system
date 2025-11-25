import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Users, Loader2, X } from 'lucide-react';
import { tablesApi } from '../../api/tablesApi';
import type { RestaurantTable, CreateTableRequest } from '../../types/backend.types';

export const TableManagementPage = () => {
  // Data state
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingTable, setEditingTable] = useState<RestaurantTable | null>(null);

  // Form state
  const [formData, setFormData] = useState<CreateTableRequest>({
    tableNumber: '',
    capacity: 2,
  });

  // Fetch tables
  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await tablesApi.getAllTables();
      setTables(data);
    } catch (err) {
      console.error('Failed to fetch tables:', err);
      setError('Failed to load tables.');
    } finally {
      setLoading(false);
    }
  };

  // Open modal for create or edit
  const openModal = (table?: RestaurantTable) => {
    if (table) {
      setEditingTable(table);
      setFormData({
        tableNumber: table.tableNumber,
        capacity: table.capacity,
      });
    } else {
      setEditingTable(null);
      setFormData({
        tableNumber: '',
        capacity: 2,
      });
    }
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setEditingTable(null);
    setFormData({
      tableNumber: '',
      capacity: 2,
    });
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.tableNumber.trim()) {
      alert('Table number is required');
      return;
    }

    if (formData.capacity < 1) {
      alert('Capacity must be at least 1');
      return;
    }

    try {
      setUpdating(true);

      if (editingTable) {
        // Update existing table
        await tablesApi.updateTable(editingTable.id, formData);
      } else {
        // Create new table
        await tablesApi.createTable(formData);
      }

      await fetchTables();
      closeModal();
    } catch (err: any) {
      console.error('Failed to save table:', err);
      alert(err.response?.data?.message || 'Failed to save table.');
    } finally {
      setUpdating(false);
    }
  };

  // Handle delete
  const handleDelete = async (id: number, tableNumber: string) => {
    if (!confirm(`Are you sure you want to delete table ${tableNumber}?`)) {
      return;
    }

    try {
      setUpdating(true);
      await tablesApi.deleteTable(id);
      await fetchTables();
    } catch (err: any) {
      console.error('Failed to delete table:', err);
      alert(err.response?.data?.message || 'Failed to delete table.');
    } finally {
      setUpdating(false);
    }
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    const styles = {
      FREE: 'bg-green-100 text-green-700',
      OCCUPIED: 'bg-red-100 text-red-700',
      RESERVED: 'bg-yellow-100 text-yellow-700',
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-700';
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary-500 mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading tables...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6 fade-in">
        <div className="max-w-2xl mx-auto mt-12">
          <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Tables</h3>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={() => fetchTables()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Table Management</h1>
          <p className="text-slate-500 mt-1">Manage restaurant tables and seating capacity</p>
        </div>
        <button
          onClick={() => openModal()}
          disabled={updating}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-5 h-5" />
          Add Table
        </button>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tables.map((table) => (
          <motion.div
            key={table.id}
            className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">Table {table.tableNumber}</h3>
                  <p className="text-sm text-slate-500">Capacity: {table.capacity}</p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(table.status)}`}>
                {table.status}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => openModal(table)}
                disabled={updating}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(table.id, table.tableNumber)}
                disabled={updating}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {tables.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 font-medium">No tables found</p>
          <p className="text-slate-500 text-sm mt-1">Click "Add Table" to create your first table</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-white rounded-xl p-6 max-w-md w-full"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800">
                {editingTable ? 'Edit Table' : 'Add New Table'}
              </h2>
              <button
                onClick={closeModal}
                disabled={updating}
                className="text-slate-400 hover:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Table Number *
                </label>
                <input
                  type="text"
                  value={formData.tableNumber}
                  onChange={(e) => setFormData({ ...formData, tableNumber: e.target.value })}
                  placeholder="e.g., 1, A1, VIP-1"
                  required
                  disabled={updating}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Capacity *
                </label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 1 })}
                  min="1"
                  max="20"
                  required
                  disabled={updating}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={updating}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {updating && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingTable ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
