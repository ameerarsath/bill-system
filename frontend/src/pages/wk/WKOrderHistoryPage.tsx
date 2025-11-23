import { History } from 'lucide-react';

export const WKOrderHistoryPage = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="food-card p-12 text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center mx-auto mb-6">
          <History className="w-10 h-10 text-primary-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-3">Order History</h1>
        <p className="text-slate-500 text-lg">
          This page is under construction. View past orders and their details here.
        </p>
      </div>
    </div>
  );
};
