import React from 'react';

export const KitchenDisplay: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Kitchen Display System</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Pending Orders</h2>
          <p className="text-gray-600 text-sm">New orders appear here with sound alert</p>
        </div>
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Cooking</h2>
          <p className="text-gray-600 text-sm">Orders currently being prepared</p>
        </div>
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Ready</h2>
          <p className="text-gray-600 text-sm">Orders ready for serving</p>
        </div>
      </div>
    </div>
  );
};
