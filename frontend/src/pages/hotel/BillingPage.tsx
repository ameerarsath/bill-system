import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, CheckCircle, Clock, X } from 'lucide-react';
import { mockBills } from '../../data/mockHotelData';
import type { Bill } from '../../data/mockHotelData';
import { formatCurrency, getStatusBadgeClass } from '../../utils/hotelHelpers';

export const BillingPage = () => {
  const [bills, setBills] = useState<Bill[]>(mockBills);
  const [searchQuery, setSearchQuery] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [newStatus, setNewStatus] = useState<'paid' | 'pending'>('paid');
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'success' });

  // Filter bills based on search query
  const filteredBills = bills.filter(
    (bill) =>
      bill.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.tableNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.waiter.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Show notification
  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  // Handle status update request
  const handleStatusUpdate = (bill: Bill, status: 'paid' | 'pending') => {
    setSelectedBill(bill);
    setNewStatus(status);
    setShowConfirmModal(true);
  };

  // Confirm status update
  const confirmStatusUpdate = () => {
    if (selectedBill) {
      setBills(
        bills.map((bill) =>
          bill.id === selectedBill.id ? { ...bill, status: newStatus } : bill
        )
      );
      showNotification(
        `Bill ${selectedBill.id} marked as ${newStatus}`,
        'success'
      );
      setShowConfirmModal(false);
      setSelectedBill(null);
    }
  };

  // Cancel status update
  const cancelStatusUpdate = () => {
    setShowConfirmModal(false);
    setSelectedBill(null);
  };

  return (
    <div className="space-y-6 fade-in">
      {/* Notification */}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-20 right-8 z-50 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 ${
              notification.type === 'success'
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white'
            }`}
          >
            <CheckCircle className="w-5 h-5" />
            <p className="font-medium">{notification.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && selectedBill && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Update Payment Status
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Confirm the payment status change
                  </p>
                </div>
                <button
                  onClick={cancelStatusUpdate}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Bill No</p>
                    <p className="font-semibold text-gray-900">
                      {selectedBill.id}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Table</p>
                    <p className="font-semibold text-gray-900">
                      {selectedBill.tableNo}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Amount</p>
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(selectedBill.amount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Current Status</p>
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(
                        selectedBill.status
                      )}`}
                    >
                      {selectedBill.status.charAt(0).toUpperCase() +
                        selectedBill.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-center text-gray-700">
                  Change status to{' '}
                  <span
                    className={`font-bold ${
                      newStatus === 'paid' ? 'text-green-600' : 'text-amber-600'
                    }`}
                  >
                    {newStatus.toUpperCase()}
                  </span>
                  ?
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={cancelStatusUpdate}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmStatusUpdate}
                  className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Billing Management
          </h2>
          <p className="text-gray-600 mt-1">
            View and manage all bills - Update payment status
          </p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search bills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            />
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Total Bills</p>
          <p className="text-2xl font-bold text-gray-900">{bills.length}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <p className="text-sm text-green-700">Paid Bills</p>
          <p className="text-2xl font-bold text-green-600">
            {bills.filter((b) => b.status === 'paid').length}
          </p>
        </div>
        <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
          <p className="text-sm text-amber-700">Pending Bills</p>
          <p className="text-2xl font-bold text-amber-600">
            {bills.filter((b) => b.status === 'pending').length}
          </p>
        </div>
      </div>

      {/* Bills Table */}
      <motion.div
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                  Bill No
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                  Date & Time
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                  Table
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                  Waiter
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                  Items
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBills.map((bill) => (
                <tr
                  key={bill.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    {bill.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">
                        {new Date(bill.date).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="text-xs text-gray-500 mt-0.5">
                        {new Date(bill.date).toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        })}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {bill.tableNo}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {bill.waiter}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">
                    {formatCurrency(bill.amount)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {bill.items} items
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(
                        bill.status
                      )}`}
                    >
                      {bill.status.charAt(0).toUpperCase() +
                        bill.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {bill.status === 'pending' ? (
                        <button
                          onClick={() => handleStatusUpdate(bill, 'paid')}
                          className="flex items-center gap-1 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-medium rounded-lg transition-colors"
                          title="Mark as Paid"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          Mark Paid
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStatusUpdate(bill, 'pending')}
                          className="flex items-center gap-1 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium rounded-lg transition-colors"
                          title="Mark as Pending"
                        >
                          <Clock className="w-3.5 h-3.5" />
                          Mark Pending
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* No Results */}
      {filteredBills.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
          <p className="text-gray-500">No bills found matching your search</p>
        </div>
      )}
    </div>
  );
};
