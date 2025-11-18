import React from 'react';

export const CashierDashboard: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Cashier Dashboard</h1>
      <div className="grid grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Search Bills</h2>
          <input
            type="text"
            placeholder="Enter phone number or bill number"
            className="input"
          />
        </div>
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">QR Scanner</h2>
          <p className="text-gray-600 text-sm">Scan customer QR code to load bill</p>
        </div>
      </div>
    </div>
  );
};
