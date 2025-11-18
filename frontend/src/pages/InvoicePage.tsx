import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { billsApi } from '../api/bills';
import { Bill } from '../types';
import { formatCurrency, formatDate, getStatusColor } from '../utils/format';
import { Receipt, CheckCircle, Clock, Phone, QrCode } from 'lucide-react';

export const InvoicePage: React.FC = () => {
  const { qrToken } = useParams<{ qrToken: string }>();
  const [bill, setBill] = useState<Bill | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (qrToken) {
      loadInvoice();
    }
  }, [qrToken]);

  const loadInvoice = async () => {
    if (!qrToken) return;

    setLoading(true);
    try {
      const data = await billsApi.getInvoiceByToken(qrToken);
      setBill(data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invoice not found');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (error || !bill) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto p-6 text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-red-800 mb-2">Invoice Not Found</h2>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Receipt className="w-8 h-8 text-primary-600" />
              <h1 className="text-3xl font-bold">Invoice</h1>
            </div>
            <span className={`badge text-lg px-4 py-2 ${getStatusColor(bill.paymentStatus)}`}>
              {bill.paymentStatus}
            </span>
          </div>

          {/* Bill Info */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-600">Bill Number</p>
              <p className="font-semibold">{bill.billNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Order Number</p>
              <p className="font-semibold">{bill.order.orderNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Date</p>
              <p className="font-semibold">{formatDate(bill.createdAt)}</p>
            </div>
            {bill.customerPhone && (
              <div>
                <p className="text-sm text-gray-600">Customer Phone</p>
                <p className="font-semibold flex items-center space-x-1">
                  <Phone className="w-4 h-4" />
                  <span>{bill.customerPhone}</span>
                </p>
              </div>
            )}
          </div>

          {/* Order Details */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Order Details</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Table/Type:</span>
                <span className="font-medium">
                  {bill.order.tableNumber || bill.order.orderType}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Served By:</span>
                <span className="font-medium">{bill.order.createdBy}</span>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Items</h2>
            <div className="space-y-2">
              {bill.order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-start p-3 bg-gray-50 rounded">
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
                      <p className="text-xs text-gray-600 italic mt-1">{item.specialNotes}</p>
                    )}
                    <p className="text-sm text-gray-600 mt-1">
                      {formatCurrency(item.unitPrice)} each
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(item.totalPrice)}</p>
                  </div>
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
                <span>
                  Discount
                  {bill.discountPercentage > 0 && ` (${bill.discountPercentage}%)`}:
                </span>
                <span className="font-medium">- {formatCurrency(bill.discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax ({bill.taxPercentage}%):</span>
              <span className="font-medium">{formatCurrency(bill.taxAmount)}</span>
            </div>

            <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-300">
              <span>Total:</span>
              <span className="text-primary-600">{formatCurrency(bill.totalAmount)}</span>
            </div>
          </div>

          {/* Payment Details */}
          {bill.payments && bill.payments.length > 0 && (
            <div className="mt-6 border-t border-gray-200 pt-4">
              <h3 className="font-semibold mb-3">Payment History</h3>
              <div className="space-y-2">
                {bill.payments.map((payment) => (
                  <div key={payment.id} className="flex justify-between items-center text-sm p-2 bg-green-50 rounded">
                    <div>
                      <span className="font-medium">{payment.paymentMethod}</span>
                      {payment.transactionReference && (
                        <span className="text-gray-600 ml-2">({payment.transactionReference})</span>
                      )}
                      <p className="text-xs text-gray-600">{formatDate(payment.paymentDate)}</p>
                    </div>
                    <span className="font-semibold text-green-700">
                      {formatCurrency(payment.amount)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-gray-50 rounded">
                <div className="flex justify-between text-sm mb-1">
                  <span>Paid Amount:</span>
                  <span className="font-semibold text-green-600">
                    {formatCurrency(bill.paidAmount)}
                  </span>
                </div>
                {bill.remainingAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Remaining:</span>
                    <span className="font-semibold text-red-600">
                      {formatCurrency(bill.remainingAmount)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* QR Code */}
        {bill.qrCodeBase64 && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-lg font-semibold mb-4 flex items-center justify-center space-x-2">
              <QrCode className="w-5 h-5" />
              <span>QR Code</span>
            </h2>
            <div className="flex justify-center mb-4">
              <img
                src={`data:image/png;base64,${bill.qrCodeBase64}`}
                alt="Invoice QR Code"
                className="w-48 h-48 border border-gray-300 rounded"
              />
            </div>
            <p className="text-sm text-gray-600">
              Scan this QR code at the cashier to make payment
            </p>
          </div>
        )}

        {/* Payment Status Banner */}
        {bill.paymentStatus === 'PAID' && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-center space-x-2 text-green-800">
            <CheckCircle className="w-6 h-6" />
            <span className="font-semibold text-lg">Payment Completed</span>
          </div>
        )}

        {bill.paymentStatus === 'PENDING' && (
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center justify-center space-x-2 text-yellow-800">
            <Clock className="w-6 h-6" />
            <span className="font-semibold text-lg">Payment Pending - Please proceed to cashier</span>
          </div>
        )}

        {bill.paymentStatus === 'PARTIAL' && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-blue-800 mb-2">
              <Clock className="w-6 h-6" />
              <span className="font-semibold text-lg">Partial Payment Received</span>
            </div>
            <p className="text-sm text-blue-700">
              Remaining amount: <span className="font-bold">{formatCurrency(bill.remainingAmount)}</span>
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Thank you for dining with us!</p>
          <p className="mt-2">Hotel Billing System</p>
        </div>
      </div>
    </div>
  );
};
