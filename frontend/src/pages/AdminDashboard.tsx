import React from 'react';

export const AdminDashboard: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="card">
          <h2 className="text-lg font-semibold mb-2">Menu Management</h2>
          <p className="text-gray-600 text-sm">Manage menu items and categories</p>
        </div>
        <div className="card">
          <h2 className="text-lg font-semibold mb-2">Tables</h2>
          <p className="text-gray-600 text-sm">Manage restaurant tables</p>
        </div>
        <div className="card">
          <h2 className="text-lg font-semibold mb-2">Reports</h2>
          <p className="text-gray-600 text-sm">View sales and performance reports</p>
        </div>
      </div>
    </div>
  );
};
