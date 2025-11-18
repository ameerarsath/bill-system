import React, { useState, useEffect, useRef } from 'react';
import { billsApi } from '../api/bills';
import { paymentsApi } from '../api/payments';
import { Bill, PaymentMethod } from '../types';
import { formatCurrency, formatDate, getStatusColor } from '../utils/format';
import { PAYMENT_METHODS } from '../utils/constants';
import { Search, QrCode, CreditCard, CheckCircle, X, Phone, Receipt, DollarSign } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

export const CashierDashboard: React.FC = () => {
  const [bill, setBill] = useState<Bill | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'search' | 'scanner'>('search');

  // Payment form state
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [transactionRef, setTransactionRef] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');

  // QR Scanner state
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const qrScannerRef = useRef<Html5Qrcode | null>(null);
  const scannerDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      // Cleanup scanner on unmount
      if (qrScannerRef.current && isScanning) {
        qrScannerRef.current.stop().catch(console.error);
      }
    };
  }, [isScanning]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a phone number or bill number');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Try searching by phone first (if it's numeric)
      if (/^\d+$/.test(searchQuery)) {
        const results = await billsApi.getBillsByPhone(searchQuery);
        setSearchResults(results);
        if (results.length === 0) {
          setError('No bills found for this phone number');
        } else if (results.length === 1) {
          setBill(results[0]);
          setSearchResults([]);
          setShowPaymentForm(false);
        }
      } else {
        // Search by bill number
        const result = await billsApi.getBillByNumber(searchQuery);
        setBill(result);
        setSearchResults([]);
        setShowPaymentForm(false);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to search bills');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectBill = (selectedBill: Bill) => {
    setBill(selectedBill);
    setSearchResults([]);
    setShowPaymentForm(false);
  };

  const startQRScanner = async () => {
    if (!scannerDivRef.current) return;

    try {
      setScanError(null);
      const qrScanner = new Html5Qrcode('qr-reader');
      qrScannerRef.current = qrScanner;

      await qrScanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        async (decodedText) => {
          // Stop scanning
          await qrScanner.stop();
          setIsScanning(false);

          // Extract token from URL
          // Expected format: http://localhost:5173/invoice/{token}
          const match = decodedText.match(/\/invoice\/([^/?]+)/);
          if (match) {
            const token = match[1];
            await loadBillByToken(token);
          } else {
            setScanError('Invalid QR code format. Please scan a valid invoice QR code.');
          }
        },
        (errorMessage) => {
          // Ignore scan errors (happens frequently during scanning)
        }
      );

      setIsScanning(true);
    } catch (err: any) {
      console.error('QR Scanner error:', err);
      setScanError('Failed to start QR scanner. Please check camera permissions.');
      setIsScanning(false);
    }
  };

  const stopQRScanner = async () => {
    if (qrScannerRef.current && isScanning) {
      try {
        await qrScannerRef.current.stop();
        qrScannerRef.current = null;
      } catch (err) {
        console.error('Error stopping scanner:', err);
      }
    }
    setIsScanning(false);
  };

  const loadBillByToken = async (token: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await billsApi.getInvoiceByToken(token);
      setBill(data);
      setShowPaymentForm(false);
      setActiveTab('search'); // Switch back to main view
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load bill');
    } finally {
      setLoading(false);
    }
  };

  const handleRecordPayment = async () => {
    if (!bill) return;

    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid payment amount');
      return;
    }

    if (amount > bill.remainingAmount) {
      alert('Payment amount cannot exceed remaining amount');
      return;
    }

    setLoading(true);
    try {
      await paymentsApi.recordPayment({
        billId: bill.id,
        paymentMethod,
        amount,
        transactionReference: transactionRef || undefined,
        notes: paymentNotes || undefined,
      });

      // Reload bill to get updated payment status
      const updatedBill = await billsApi.getBillById(bill.id);
      setBill(updatedBill);

      // Reset payment form
      setPaymentAmount('');
      setTransactionRef('');
      setPaymentNotes('');
      setPaymentMethod('CASH');
      setShowPaymentForm(false);

      alert('Payment recorded successfully!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to record payment');
    } finally {
      setLoading(false);
    }
  };

  const openPaymentForm = () => {
    if (bill && bill.remainingAmount > 0) {
      setPaymentAmount(bill.remainingAmount.toString());
      setShowPaymentForm(true);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 flex items-center space-x-3">
        <CreditCard className="w-8 h-8 text-primary-600" />
        <span>Cashier Dashboard</span>
      </h1>

      {/* Tab Selection */}
      <div className="mb-6 flex space-x-2">
        <button
          onClick={() => {
            setActiveTab('search');
            if (isScanning) stopQRScanner();
          }}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === 'search'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Search className="w-5 h-5 inline mr-2" />
          Search Bills
        </button>
        <button
          onClick={() => setActiveTab('scanner')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === 'scanner'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <QrCode className="w-5 h-5 inline mr-2" />
          QR Scanner
        </button>
      </div>

      {/* Search Tab */}
      {activeTab === 'search' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Search */}
          <div className="lg:col-span-1">
            <div className="card">
              <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <Search className="w-5 h-5" />
                <span>Search Bills</span>
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="label">Phone Number or Bill Number</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      placeholder="Enter phone or bill number"
                      className="input flex-1"
                    />
                    <button
                      onClick={handleSearch}
                      disabled={loading}
                      className="btn btn-primary"
                    >
                      <Search className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                    {error}
                  </div>
                )}

                {/* Search Results */}
                {searchResults.length > 1 && (
                  <div className="mt-4">
                    <h3 className="font-semibold mb-2">Search Results ({searchResults.length})</h3>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {searchResults.map((result) => (
                        <div
                          key={result.id}
                          onClick={() => handleSelectBill(result)}
                          className="p-3 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold">{result.billNumber}</p>
                              <p className="text-xs text-gray-600">{formatDate(result.createdAt)}</p>
                              {result.customerPhone && (
                                <p className="text-xs text-gray-600">
                                  <Phone className="w-3 h-3 inline" /> {result.customerPhone}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-primary-600">
                                {formatCurrency(result.totalAmount)}
                              </p>
                              <span className={`text-xs px-2 py-1 rounded ${getStatusColor(result.paymentStatus)}`}>
                                {result.paymentStatus}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Bill Details & Payment */}
          <div className="lg:col-span-2">
            {bill ? (
              <div className="space-y-4">
                {/* Bill Header */}
                <div className="card">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold flex items-center space-x-2">
                        <Receipt className="w-6 h-6 text-primary-600" />
                        <span>{bill.billNumber}</span>
                      </h2>
                      <p className="text-sm text-gray-600">Order: {bill.order.orderNumber}</p>
                      <p className="text-sm text-gray-600">{formatDate(bill.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <span className={`badge text-lg px-4 py-2 ${getStatusColor(bill.paymentStatus)}`}>
                        {bill.paymentStatus}
                      </span>
                      {bill.customerPhone && (
                        <p className="text-sm text-gray-600 mt-2">
                          <Phone className="w-4 h-4 inline" /> {bill.customerPhone}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Items */}
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">Items</h3>
                    <div className="space-y-2">
                      {bill.order.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-start p-2 bg-gray-50 rounded">
                          <div className="flex-1">
                            <p className="font-medium">
                              {item.quantity}x {item.menuItemName}
                              {item.isVeg ? (
                                <span className="text-green-600 text-xs ml-2">● VEG</span>
                              ) : (
                                <span className="text-red-600 text-xs ml-2">● NON-VEG</span>
                              )}
                            </p>
                            {item.specialNotes && (
                              <p className="text-xs text-gray-600 italic">{item.specialNotes}</p>
                            )}
                          </div>
                          <p className="font-semibold">{formatCurrency(item.totalPrice)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bill Summary */}
                  <div className="border-t border-gray-200 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">{formatCurrency(bill.subtotal)}</span>
                    </div>
                    {bill.discountAmount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount ({bill.discountPercentage}%):</span>
                        <span className="font-medium">- {formatCurrency(bill.discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax ({bill.taxPercentage}%):</span>
                      <span className="font-medium">{formatCurrency(bill.taxAmount)}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold pt-2 border-t border-gray-300">
                      <span>Total:</span>
                      <span className="text-primary-600">{formatCurrency(bill.totalAmount)}</span>
                    </div>
                  </div>
                </div>

                {/* Payment History */}
                {bill.payments && bill.payments.length > 0 && (
                  <div className="card">
                    <h3 className="font-semibold mb-3">Payment History</h3>
                    <div className="space-y-2">
                      {bill.payments.map((payment) => (
                        <div key={payment.id} className="flex justify-between items-center p-3 bg-green-50 border border-green-200 rounded">
                          <div>
                            <p className="font-medium">{payment.paymentMethod}</p>
                            {payment.transactionReference && (
                              <p className="text-xs text-gray-600">Ref: {payment.transactionReference}</p>
                            )}
                            <p className="text-xs text-gray-600">{formatDate(payment.paymentDate)}</p>
                          </div>
                          <p className="font-bold text-green-700">{formatCurrency(payment.amount)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Payment Summary */}
                <div className="card bg-gradient-to-r from-blue-50 to-primary-50">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Paid Amount</p>
                      <p className="text-2xl font-bold text-green-600">{formatCurrency(bill.paidAmount)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Remaining Amount</p>
                      <p className="text-2xl font-bold text-red-600">{formatCurrency(bill.remainingAmount)}</p>
                    </div>
                  </div>

                  {bill.remainingAmount > 0 && !showPaymentForm && (
                    <button
                      onClick={openPaymentForm}
                      className="w-full mt-4 btn btn-primary flex items-center justify-center space-x-2"
                    >
                      <DollarSign className="w-5 h-5" />
                      <span>Record Payment</span>
                    </button>
                  )}
                </div>

                {/* Payment Form */}
                {showPaymentForm && (
                  <div className="card border-2 border-primary-200">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold">Record Payment</h3>
                      <button
                        onClick={() => setShowPaymentForm(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="label">Payment Method *</label>
                        <select
                          value={paymentMethod}
                          onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                          className="input"
                        >
                          {PAYMENT_METHODS.map((method) => (
                            <option key={method} value={method}>
                              {method}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="label">
                          Amount * (Max: {formatCurrency(bill.remainingAmount)})
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={paymentAmount}
                          onChange={(e) => setPaymentAmount(e.target.value)}
                          className="input"
                          placeholder="Enter amount"
                        />
                      </div>

                      {paymentMethod !== 'CASH' && (
                        <div>
                          <label className="label">Transaction Reference</label>
                          <input
                            type="text"
                            value={transactionRef}
                            onChange={(e) => setTransactionRef(e.target.value)}
                            className="input"
                            placeholder="Enter transaction ID"
                          />
                        </div>
                      )}

                      <div>
                        <label className="label">Notes (Optional)</label>
                        <textarea
                          value={paymentNotes}
                          onChange={(e) => setPaymentNotes(e.target.value)}
                          className="input"
                          rows={2}
                          placeholder="Add any notes"
                        />
                      </div>

                      <div className="flex space-x-3">
                        <button
                          onClick={handleRecordPayment}
                          disabled={loading}
                          className="flex-1 btn btn-success flex items-center justify-center space-x-2"
                        >
                          <CheckCircle className="w-5 h-5" />
                          <span>Confirm Payment</span>
                        </button>
                        <button
                          onClick={() => setShowPaymentForm(false)}
                          className="btn bg-gray-200 text-gray-700 hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="card text-center py-12">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Search for a bill to view details and process payment</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* QR Scanner Tab */}
      {activeTab === 'scanner' && (
        <div className="max-w-2xl mx-auto">
          <div className="card">
            <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <QrCode className="w-5 h-5" />
              <span>Scan Customer QR Code</span>
            </h2>

            {!isScanning ? (
              <div className="text-center py-8">
                <QrCode className="w-24 h-24 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-6">
                  Click the button below to start scanning customer QR codes
                </p>
                <button
                  onClick={startQRScanner}
                  className="btn btn-primary px-8 py-3 text-lg"
                >
                  Start QR Scanner
                </button>
                {scanError && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                    {scanError}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div id="qr-reader" ref={scannerDivRef} className="rounded-lg overflow-hidden mb-4"></div>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={stopQRScanner}
                    className="btn bg-red-600 text-white hover:bg-red-700"
                  >
                    Stop Scanner
                  </button>
                </div>
                <p className="text-sm text-gray-600 text-center mt-4">
                  Position the QR code within the frame to scan
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
