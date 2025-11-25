import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { PremiumLogo } from '../components/shared/PremiumLogo';
import { authApi } from '../api/authApi';

type MessageType = 'error' | 'success' | 'info';

interface Message {
  text: string;
  type: MessageType;
}

export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState<Message | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setMessage({ text: 'Invalid reset link. Please request a new one.', type: 'error' });
    }
  }, [token]);

  const showMessage = (text: string, type: MessageType) => {
    setMessage({ text, type });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!token) {
      showMessage('Invalid reset token', 'error');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showMessage('Passwords do not match', 'error');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showMessage('Password must be at least 6 characters', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authApi.resetPassword({
        token,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      });
      showMessage(response.message, 'success');

      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error: any) {
      showMessage(
        error.response?.data?.message || 'Failed to reset password. Please try again.',
        'error'
      );
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
        return 'bg-red-500/10 border-red-500/30 text-red-300';
      case 'success':
        return 'bg-green-500/10 border-green-500/30 text-green-300';
      default:
        return 'bg-blue-500/10 border-blue-500/30 text-blue-300';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 login-bg">
      <motion.article
        className="premium-card rounded-2xl p-8 md:p-10 w-full max-w-md"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        <header className="text-center mb-10">
          <PremiumLogo />

          <h1 className="text-3xl md:text-4xl font-semibold text-white mb-3 tracking-tight">
            Reset Password
          </h1>
          <p className="text-white text-opacity-60 text-sm font-light tracking-wide">
            Enter your new password
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="newPassword"
              className="block text-white text-opacity-80 text-sm font-medium mb-2.5"
            >
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({ ...passwordData, newPassword: e.target.value })
              }
              className="premium-input w-full px-4 py-3.5 rounded-lg"
              placeholder="Enter new password"
              required
              minLength={6}
              disabled={isLoading || !token}
            />
            <p className="mt-1 text-xs text-white text-opacity-50">At least 6 characters</p>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-white text-opacity-80 text-sm font-medium mb-2.5"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData({ ...passwordData, confirmPassword: e.target.value })
              }
              className="premium-input w-full px-4 py-3.5 rounded-lg"
              placeholder="Confirm new password"
              required
              minLength={6}
              disabled={isLoading || !token}
            />
          </div>

          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-center gap-2 text-sm p-3.5 rounded-lg border backdrop-blur-sm ${getMessageClass(message.type)}`}
            >
              {getMessageIcon(message.type)}
              <span>{message.text}</span>
            </motion.div>
          )}

          <button
            type="submit"
            disabled={isLoading || !token}
            className="premium-button w-full py-3.5 rounded-lg text-white font-semibold text-base tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <motion.span
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                Resetting...
              </span>
            ) : (
              'Reset Password'
            )}
          </button>

          <div className="text-center pt-4">
            <Link
              to="/"
              className="premium-link text-sm font-medium inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
        </form>

        <footer className="text-center mt-8">
          <p className="text-white text-opacity-50 text-xs font-light leading-relaxed">
            Remember your password?{' '}
            <Link to="/" className="premium-link">
              Sign in
            </Link>
          </p>
        </footer>
      </motion.article>
    </div>
  );
};
