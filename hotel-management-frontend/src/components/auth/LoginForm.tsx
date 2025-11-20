import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Info, User, Lock, ChefHat, UtensilsCrossed, Settings } from 'lucide-react';
import { PremiumLogo } from '../shared/PremiumLogo';
import { useAuth, getLoginHints } from '../../context/AuthContext';
import type { LoginCredentials, LoginFormErrors } from '../../types/auth.types';

type MessageType = 'error' | 'success' | 'info';

interface Message {
  text: string;
  type: MessageType;
}

export const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    identifier: '',
    password: '',
  });

  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [message, setMessage] = useState<Message | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [showHints, setShowHints] = useState(true);

  const loginHints = getLoginHints();

  const validateForm = (): boolean => {
    const newErrors: LoginFormErrors = {};

    if (!credentials.identifier.trim()) {
      newErrors.identifier = 'Please enter your username';
    }

    if (!credentials.password) {
      newErrors.password = 'Please enter your password';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setShake(true);
      setTimeout(() => setShake(false), 300);
      return false;
    }

    return true;
  };

  const showMessage = (text: string, type: MessageType) => {
    setMessage({ text, type });
  };

  const hideMessage = () => {
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    hideMessage();
    setErrors({});

    if (!validateForm()) {
      showMessage('Please check the form for errors', 'error');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const success = login(credentials);

      if (success) {
        showMessage('✓ Authentication successful. Redirecting...', 'success');

        setTimeout(() => {
          setIsLoading(false);
          setCredentials({ identifier: '', password: '' });
          hideMessage();

          // Redirect based on role
          const username = credentials.identifier.toLowerCase();
          if (username === 'admin') {
            navigate('/hotel');
          } else if (username === 'waiter') {
            navigate('/wk/take-order');
          } else if (username === 'kitchen') {
            navigate('/wk/kitchen');
          }
        }, 1500);
      } else {
        setIsLoading(false);
        showMessage('Invalid username or password. Please try again.', 'error');
        setShake(true);
        setTimeout(() => setShake(false), 300);
      }
    }, 800);
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    showMessage('Password reset instructions will be sent to your registered email', 'info');
    setTimeout(() => hideMessage(), 4000);
  };

  const handleInputChange = (field: 'identifier' | 'password', value: string) => {
    setCredentials({ ...credentials, [field]: value });
    setErrors({ ...errors, [field]: undefined });
    hideMessage();
  };

  const getMessageIcon = (type: MessageType) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="w-4 h-4" />;
      case 'success':
        return <CheckCircle className="w-4 h-4" />;
      case 'info':
        return <Info className="w-4 h-4" />;
    }
  };

  const getMessageClass = (type: MessageType) => {
    switch (type) {
      case 'error':
        return 'bg-red-500/10 border-red-500/30 text-red-300';
      case 'success':
        return 'bg-green-500/10 border-green-500/30 text-green-300';
      case 'info':
        return 'bg-blue-500/10 border-blue-500/30 text-blue-300';
    }
  };

  return (
    <motion.article
      className={`premium-card rounded-2xl p-8 md:p-10 ${shake ? 'animate-[errorShake_0.3s_ease-in-out]' : ''}`}
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Brand Identity */}
      <header className="text-center mb-10">
        <PremiumLogo />

        <h1 className="text-3xl md:text-4xl font-semibold text-white mb-3 tracking-tight">
          Welcome Back
        </h1>
        <p className="text-white text-opacity-60 text-sm font-light tracking-wide">
          Digital Management Platform
        </p>
      </header>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Username Input */}
        <div>
          <label
            htmlFor="username"
            className="block text-white text-opacity-80 text-sm font-medium mb-2.5"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={credentials.identifier}
            onChange={(e) => handleInputChange('identifier', e.target.value)}
            className="premium-input w-full px-4 py-3.5 rounded-lg"
            placeholder="Enter username"
            required
            aria-label="Username"
          />
          {errors.identifier && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-xs text-red-400 flex items-center gap-1"
            >
              <AlertCircle className="w-3 h-3" />
              {errors.identifier}
            </motion.p>
          )}
        </div>

        {/* Password Input */}
        <div>
          <label
            htmlFor="password"
            className="block text-white text-opacity-80 text-sm font-medium mb-2.5"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={credentials.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className="premium-input w-full px-4 py-3.5 rounded-lg"
            placeholder="Enter your password"
            required
            aria-label="Password"
          />
          {errors.password && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-xs text-red-400 flex items-center gap-1"
            >
              <AlertCircle className="w-3 h-3" />
              {errors.password}
            </motion.p>
          )}
        </div>

        {/* Message Container */}
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

        {/* Forgot Password */}
        <div className="text-right">
          <a
            href="#"
            onClick={handleForgotPassword}
            className="premium-link text-sm font-medium"
          >
            Forgot Password?
          </a>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="premium-button w-full py-3.5 rounded-lg text-white font-semibold text-base tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <motion.span
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              Signing in...
            </span>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="divider"></div>

      {/* Demo Credentials */}
      {showHints && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-white text-opacity-70 text-xs font-medium">
              Demo Credentials
            </p>
            <button
              onClick={() => setShowHints(false)}
              className="text-white text-opacity-40 hover:text-opacity-70 text-xs"
            >
              Hide
            </button>
          </div>

          <div className="grid gap-2">
            {/* Admin */}
            <motion.button
              type="button"
              onClick={() => {
                setCredentials({
                  identifier: loginHints.admin.username,
                  password: loginHints.admin.password,
                });
                hideMessage();
              }}
              className="premium-card p-3 text-left hover:bg-white/10 transition-all rounded-lg border border-white/10"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center">
                  <Settings className="w-4 h-4 text-primary-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-opacity-90 text-xs font-semibold">
                    {loginHints.admin.label}
                  </p>
                  <p className="text-white text-opacity-50 text-xs truncate">
                    {loginHints.admin.username} / {loginHints.admin.password}
                  </p>
                </div>
              </div>
            </motion.button>

            {/* Waiter */}
            <motion.button
              type="button"
              onClick={() => {
                setCredentials({
                  identifier: loginHints.waiter.username,
                  password: loginHints.waiter.password,
                });
                hideMessage();
              }}
              className="premium-card p-3 text-left hover:bg-white/10 transition-all rounded-lg border border-white/10"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <UtensilsCrossed className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-opacity-90 text-xs font-semibold">
                    {loginHints.waiter.label}
                  </p>
                  <p className="text-white text-opacity-50 text-xs truncate">
                    {loginHints.waiter.username} / {loginHints.waiter.password}
                  </p>
                </div>
              </div>
            </motion.button>

            {/* Kitchen */}
            <motion.button
              type="button"
              onClick={() => {
                setCredentials({
                  identifier: loginHints.kitchen.username,
                  password: loginHints.kitchen.password,
                });
                hideMessage();
              }}
              className="premium-card p-3 text-left hover:bg-white/10 transition-all rounded-lg border border-white/10"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <ChefHat className="w-4 h-4 text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-opacity-90 text-xs font-semibold">
                    {loginHints.kitchen.label}
                  </p>
                  <p className="text-white text-opacity-50 text-xs truncate">
                    {loginHints.kitchen.username} / {loginHints.kitchen.password}
                  </p>
                </div>
              </div>
            </motion.button>
          </div>
        </div>
      )}

      {!showHints && (
        <div className="text-center">
          <button
            onClick={() => setShowHints(true)}
            className="premium-link text-xs"
          >
            Show demo credentials
          </button>
        </div>
      )}

      {/* Footer Caption */}
      <footer className="text-center mt-6">
        <p className="text-white text-opacity-50 text-xs font-light leading-relaxed">
          Trusted by hotel owners, staff, and culinary professionals worldwide
        </p>
      </footer>
    </motion.article>
  );
};
