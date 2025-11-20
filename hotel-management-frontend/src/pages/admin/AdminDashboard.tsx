import { motion } from 'framer-motion';
import { calculateStats, getStatusBadgeClass } from '../../utils/adminHelpers';
import { mockTenants, subscriptionPlans } from '../../data/mockAdminData';
import { Hotel, CheckCircle, AlertCircle, Users } from 'lucide-react';

export const AdminDashboard = () => {
  const stats = calculateStats(mockTenants);

  return (
    <div className="p-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Tenants</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Hotel className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4">All registered hotels</p>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Active Subscriptions</p>
              <p className="text-3xl font-bold text-emerald-600 mt-2">{stats.active}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4">Currently active</p>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Expired Subscriptions</p>
              <p className="text-3xl font-bold text-rose-600 mt-2">{stats.expired}</p>
            </div>
            <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-rose-600" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4">Needs renewal</p>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Users</p>
              <p className="text-3xl font-bold text-violet-600 mt-2">{stats.totalUsers}</p>
            </div>
            <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-violet-600" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4">Across all tenants</p>
        </motion.div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tenants */}
        <motion.div
          className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Tenants</h3>
          <div className="space-y-3">
            {mockTenants.slice(0, 5).map((tenant) => (
              <div key={tenant.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Hotel className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900">{tenant.hotelName}</p>
                    <p className="text-xs text-gray-500">{tenant.ownerName}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(tenant.status)}`}>
                  {tenant.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Subscription Overview */}
        <motion.div
          className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-lg font-bold text-gray-800 mb-4">Subscription Overview</h3>
          <div className="space-y-4">
            {subscriptionPlans.map((plan) => {
              const count = mockTenants.filter((t) => t.plan === plan.name).length;
              return (
                <div key={plan.name} className="p-4 bg-gradient-to-r from-blue-50 to-white rounded-lg border border-blue-100">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-gray-900">{plan.name}</h4>
                    <span className="text-2xl font-bold text-blue-600">${plan.price}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {count} active tenant{count !== 1 ? 's' : ''}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {plan.features.slice(0, 2).map((feature) => (
                      <span key={feature} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
