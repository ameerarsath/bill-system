import { motion } from 'framer-motion';

export const SettingsPage = () => {
  return (
    <div className="space-y-6 fade-in">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Hotel Settings</h2>
        <p className="text-gray-600 mt-1">Configure your hotel preferences</p>
      </div>

      <motion.div
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Basic Information
          </h3>
          <div className="space-y-4">
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="hotel-name"
              >
                Hotel Name
              </label>
              <input
                id="hotel-name"
                type="text"
                defaultValue="Grand Palace Restaurant"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-2"
                  htmlFor="gst"
                >
                  GST Number
                </label>
                <input
                  id="gst"
                  type="text"
                  defaultValue="27AABCU9603R1ZX"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-2"
                  htmlFor="service-charge"
                >
                  Service Charge (%)
                </label>
                <input
                  id="service-charge"
                  type="number"
                  defaultValue="10"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            WhatsApp Bill Settings
          </h3>
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="whatsapp-message"
            >
              Bill Message Template
            </label>
            <textarea
              id="whatsapp-message"
              rows={4}
              defaultValue="Thank you for dining at Grand Palace! Your bill amount is ₹{amount}. We hope to see you again soon!"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors">
            Save Settings
          </button>
        </div>
      </motion.div>
    </div>
  );
};
