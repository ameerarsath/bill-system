import React from 'react';
import { useParams } from 'react-router-dom';

export const InvoicePage: React.FC = () => {
  const { qrToken } = useParams<{ qrToken: string }>();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="card">
          <h1 className="text-2xl font-bold mb-6">Invoice</h1>
          <p className="text-gray-600">
            Token: {qrToken}
          </p>
          <p className="mt-4 text-sm text-gray-500">
            This page will display the full invoice with QR code, order items, prices, and payment status.
          </p>
        </div>
      </div>
    </div>
  );
};
