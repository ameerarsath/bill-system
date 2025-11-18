import React from 'react';

export const ServantDashboard: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Servant Dashboard</h1>
      <div className="card">
        <p className="text-gray-600">
          This page will show:
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Table grid with status (FREE/OCCUPIED)</li>
            <li>Menu browser by categories</li>
            <li>Order cart and checkout</li>
            <li>Active orders list</li>
          </ul>
        </p>
      </div>
    </div>
  );
};
