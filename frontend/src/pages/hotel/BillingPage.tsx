import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Download, Loader2, Filter, X, Calendar, DollarSign } from 'lucide-react';
import { billsApi } from '../../api/billsApi';
import type { Bill as BackendBill, PaymentStatus, PaymentMethod } from '../../types/backend.types';
import { formatCurrency, getStatusBadgeClass } from '../../utils/hotelHelpers';

// Filter types
type DateFilter = 'all' | 'today' | 'yesterday' | 'last7days' | 'last30days' | 'custom';

interface Filters {
  paymentStatus: PaymentStatus | 'ALL';
  dateFilter: DateFilter;
  customDateFrom: string;
  customDateTo: string;
  paymentMethod: PaymentMethod | 'ALL';
  minAmount: string;
  maxAmount: string;
  tableNumber: string;
}

export const BillingPage = () => {
  // Data state
  const [bills, setBills] = useState<BackendBill[]>([]);

  // UI state
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Filter state
  const [filters, setFilters] = useState<Filters>({
    paymentStatus: 'ALL',
    dateFilter: 'all',
    customDateFrom: '',
    customDateTo: '',
    paymentMethod: 'ALL',
    minAmount: '',
    maxAmount: '',
    tableNumber: '',
  });

  // Loading & error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch bills on mount
  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await billsApi.getAllBills();
      setBills(data);
    } catch (err) {
      console.error('Failed to fetch bills:', err);
      setError('Failed to load bills. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  // Helper: Check if date is in range
  const isDateInRange = (billDate: string): boolean => {
    const date = new Date(billDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (filters.dateFilter) {
      case 'all':
        return true;

      case 'today':
        return date >= today;

      case 'yesterday': {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const tomorrow = new Date(today);
        return date >= yesterday && date < tomorrow;
      }

      case 'last7days': {
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return date >= sevenDaysAgo;
      }

      case 'last30days': {
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return date >= thirtyDaysAgo;
      }

      case 'custom': {
        if (!filters.customDateFrom && !filters.customDateTo) return true;
        const from = filters.customDateFrom ? new Date(filters.customDateFrom) : null;
        const to = filters.customDateTo ? new Date(filters.customDateTo) : null;

        if (from && to) {
          to.setHours(23, 59, 59, 999);
          return date >= from && date <= to;
        } else if (from) {
          return date >= from;
        } else if (to) {
          to.setHours(23, 59, 59, 999);
          return date <= to;
        }
        return true;
      }

      default:
        return true;
    }
  };

  // Helper: Check if bill has payment method
  const hasPaymentMethod = (bill: BackendBill): boolean => {
    if (filters.paymentMethod === 'ALL') return true;
    return bill.payments.some(p => p.paymentMethod === filters.paymentMethod);
  };

  // Filter bills based on all filters
  const filteredBills = bills.filter((bill) => {
    // Search query filter
    const matchesSearch =
      bill.billNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (bill.order?.table?.tableNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.order?.createdBy?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // Payment status filter
    if (filters.paymentStatus !== 'ALL' && bill.paymentStatus !== filters.paymentStatus) {
      return false;
    }

    // Date filter
    if (!isDateInRange(bill.createdAt)) {
      return false;
    }

    // Payment method filter
    if (!hasPaymentMethod(bill)) {
      return false;
    }

    // Amount range filter
    if (filters.minAmount && bill.totalAmount < parseFloat(filters.minAmount)) {
      return false;
    }
    if (filters.maxAmount && bill.totalAmount > parseFloat(filters.maxAmount)) {
      return false;
    }

    // Table number filter
    if (filters.tableNumber &&
        !(bill.order?.table?.tableNumber || '').toLowerCase().includes(filters.tableNumber.toLowerCase())) {
      return false;
    }

    return true;
  });

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      paymentStatus: 'ALL',
      dateFilter: 'all',
      customDateFrom: '',
      customDateTo: '',
      paymentMethod: 'ALL',
      minAmount: '',
      maxAmount: '',
      tableNumber: '',
    });
    setSearchQuery('');
  };

  // Count active filters
  const activeFiltersCount =
    (filters.paymentStatus !== 'ALL' ? 1 : 0) +
    (filters.dateFilter !== 'all' ? 1 : 0) +
    (filters.paymentMethod !== 'ALL' ? 1 : 0) +
    (filters.minAmount || filters.maxAmount ? 1 : 0) +
    (filters.tableNumber ? 1 : 0);

  // Export bills to Excel
  const exportToExcel = () => {
    // Convert bills data to CSV format
    const headers = ['Bill No', 'Date', 'Time', 'Table', 'Waiter', 'Amount', 'Items', 'Status'];
    const csvData = filteredBills.map((bill) => [
      bill.billNumber,
      new Date(bill.order?.createdAt || new Date()).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      new Date(bill.order?.createdAt || new Date()).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
      bill.order?.table?.tableNumber || 'N/A',
      bill.order?.waiterName || 'N/A',
      bill.totalAmount,
      bill.order?.items?.length || 0,
      bill.paymentStatus,
    ]);

    // Create CSV string
    const csvContent = [
      headers.join(','),
      ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `bills_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading bills...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-12">
        <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Bills</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={() => fetchBills()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Billing Management
            </h2>
            <p className="text-gray-600 mt-1">
              View and filter all bills, export to Excel
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={exportToExcel}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
            >
              <Download className="w-4 h-4" />
              Download Excel
            </button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by bill no, table, waiter..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`relative flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors ${
              showFilters || activeFiltersCount > 0
                ? 'bg-orange-500 text-white hover:bg-orange-600'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-lg font-medium hover:bg-red-100 transition-colors"
            >
              <X className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-lg border border-gray-200 p-6 space-y-6"
            >
              {/* Row 1: Payment Status and Date Filter */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Payment Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Status
                  </label>
                  <select
                    value={filters.paymentStatus}
                    onChange={(e) =>
                      setFilters({ ...filters, paymentStatus: e.target.value as PaymentStatus | 'ALL' })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  >
                    <option value="ALL">All Status</option>
                    <option value="PENDING">Pending</option>
                    <option value="PARTIAL">Partial</option>
                    <option value="PAID">Paid</option>
                  </select>
                </div>

                {/* Date Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Date Range
                  </label>
                  <select
                    value={filters.dateFilter}
                    onChange={(e) =>
                      setFilters({ ...filters, dateFilter: e.target.value as DateFilter })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="yesterday">Yesterday</option>
                    <option value="last7days">Last 7 Days</option>
                    <option value="last30days">Last 30 Days</option>
                    <option value="custom">Custom Range</option>
                  </select>
                </div>
              </div>

              {/* Custom Date Range (shown when custom is selected) */}
              {filters.dateFilter === 'custom' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      From Date
                    </label>
                    <input
                      type="date"
                      value={filters.customDateFrom}
                      onChange={(e) =>
                        setFilters({ ...filters, customDateFrom: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      To Date
                    </label>
                    <input
                      type="date"
                      value={filters.customDateTo}
                      onChange={(e) =>
                        setFilters({ ...filters, customDateTo: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                    />
                  </div>
                </motion.div>
              )}

              {/* Row 2: Payment Method and Amount Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Payment Method Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method
                  </label>
                  <select
                    value={filters.paymentMethod}
                    onChange={(e) =>
                      setFilters({ ...filters, paymentMethod: e.target.value as PaymentMethod | 'ALL' })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  >
                    <option value="ALL">All Methods</option>
                    <option value="CASH">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="CARD">Card</option>
                    <option value="WALLET">Wallet</option>
                    <option value="CREDIT">Credit</option>
                  </select>
                </div>

                {/* Table Number Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Table Number
                  </label>
                  <input
                    type="text"
                    placeholder="Filter by table number..."
                    value={filters.tableNumber}
                    onChange={(e) =>
                      setFilters({ ...filters, tableNumber: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              {/* Row 3: Amount Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Amount Range
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="number"
                      placeholder="Min amount"
                      value={filters.minAmount}
                      onChange={(e) =>
                        setFilters({ ...filters, minAmount: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Max amount"
                      value={filters.maxAmount}
                      onChange={(e) =>
                        setFilters({ ...filters, maxAmount: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>

              {/* Active Filters Summary */}
              {activeFiltersCount > 0 && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {filters.paymentStatus !== 'ALL' && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                          Status: {filters.paymentStatus}
                        </span>
                      )}
                      {filters.dateFilter !== 'all' && (
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                          Date: {filters.dateFilter.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      )}
                      {filters.paymentMethod !== 'ALL' && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          Method: {filters.paymentMethod}
                        </span>
                      )}
                      {(filters.minAmount || filters.maxAmount) && (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                          Amount: {filters.minAmount || '0'} - {filters.maxAmount || '∞'}
                        </span>
                      )}
                      {filters.tableNumber && (
                        <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium">
                          Table: {filters.tableNumber}
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-gray-600">
                      {filteredBills.length} of {bills.length} bills
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
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
            {bills.filter((b) => b.paymentStatus === 'PAID').length}
          </p>
        </div>
        <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
          <p className="text-sm text-amber-700">Pending Bills</p>
          <p className="text-2xl font-bold text-amber-600">
            {bills.filter((b) => b.paymentStatus === 'PENDING').length}
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
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBills.map((bill) => (
                <tr
                  key={bill.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    {bill.billNumber}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">
                        {new Date(bill.order?.createdAt || new Date()).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="text-xs text-gray-500 mt-0.5">
                        {new Date(bill.order?.createdAt || new Date()).toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        })}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {bill.order?.table?.tableNumber || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {bill.order?.waiterName || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">
                    {formatCurrency(bill.totalAmount)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {bill.order?.items?.length || 0} items
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(
                        bill.paymentStatus.toLowerCase()
                      )}`}
                    >
                      {bill.paymentStatus}
                    </span>
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
