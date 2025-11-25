import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Lock } from 'lucide-react';
import { authApi } from '../../api/authApi';
import type { ChangePasswordRequest } from '../../types/auth.types';

type MessageType = 'error' | 'success' | 'info';

interface Message {
  text: string;
  type: MessageType;
}

export const SettingsPage = () => {
  const [passwordData, setPasswordData] = useState<ChangePasswordRequest>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState<Message | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const showMessage = (text: string, type: MessageType) => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showMessage('New password and confirm password do not match', 'error');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showMessage('New password must be at least 6 characters', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authApi.changePassword(passwordData);
      showMessage(response.message, 'success');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: any) {
      showMessage(error.response?.data?.message || 'Failed to change password', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const getMessageIcon = (type: MessageType) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="w-4 h-4" />;
      case 'success':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getMessageClass = (type: MessageType) => {
    switch (type) {
      case 'error':
        return 'bg-red-50 border-red-200 text-red-700';
      case 'success':
        return 'bg-green-50 border-green-200 text-green-700';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-700';
    }
  };

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

      {/* Change Password Section */}
      <motion.div
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
            <Lock className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Change Password</h3>
            <p className="text-sm text-gray-600">Update your account password</p>
          </div>
        </div>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center gap-2 text-sm p-3.5 rounded-lg border mb-4 ${getMessageClass(message.type)}`}
          >
            {getMessageIcon(message.type)}
            <span>{message.text}</span>
          </motion.div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="current-password"
            >
              Current Password
            </label>
            <input
              id="current-password"
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData({ ...passwordData, currentPassword: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              required
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="new-password"
              >
                New Password
              </label>
              <input
                id="new-password"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, newPassword: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                required
                minLength={6}
                disabled={isLoading}
              />
              <p className="mt-1 text-xs text-gray-500">At least 6 characters</p>
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="confirm-password"
              >
                Confirm New Password
              </label>
              <input
                id="confirm-password"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                required
                minLength={6}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Changing Password...' : 'Change Password'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
