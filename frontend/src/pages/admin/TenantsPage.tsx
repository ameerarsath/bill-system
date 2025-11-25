import { motion } from 'framer-motion';
import { Hotel, Info } from 'lucide-react';

export const TenantsPage = () => {

  return (
    <div className="p-8">
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Hotel className="w-10 h-10 text-indigo-600" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-3">Single Tenant System</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            This is a single-tenant hotel billing system. Multi-tenant management features are not available in the current deployment.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="text-sm font-medium text-blue-900 mb-1">System Configuration</p>
                <p className="text-xs text-blue-700">
                  This system is configured for a single hotel. To enable multi-tenant features, contact your system administrator.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
