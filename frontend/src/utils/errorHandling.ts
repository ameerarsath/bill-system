/**
 * Error Handling Utilities
 * Centralized error handling for consistent error messages across the application
 */

export interface ErrorDetails {
  code: string;
  message: string;
  status?: number;
  isRetryable: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export const ERROR_CODES = {
  // Network errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  NO_RESPONSE: 'NO_RESPONSE',

  // Authentication errors
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  ACCESS_DENIED: 'ACCESS_DENIED',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',

  // Client errors
  INVALID_REQUEST: 'INVALID_REQUEST',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',

  // Server errors
  SERVER_ERROR: 'SERVER_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  SERVICE_NOT_FOUND: 'SERVICE_NOT_FOUND',

  // Rate limiting
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',

  // Unknown
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

export const ERROR_MESSAGES = {
  [ERROR_CODES.NETWORK_ERROR]: 'Unable to connect to server. Please check your internet connection.',
  [ERROR_CODES.TIMEOUT_ERROR]: 'Request timeout. The server is taking too long to respond.',
  [ERROR_CODES.NO_RESPONSE]: 'No response from server. Please check your connection.',
  [ERROR_CODES.INVALID_CREDENTIALS]: 'Invalid username or password. Please try again.',
  [ERROR_CODES.ACCESS_DENIED]: 'Access denied. Your account may be locked or you may not have permission.',
  [ERROR_CODES.SESSION_EXPIRED]: 'Your session has expired. Please log in again.',
  [ERROR_CODES.TOKEN_EXPIRED]: 'Your authentication token has expired. Please log in again.',
  [ERROR_CODES.INVALID_REQUEST]: 'Invalid request. Please check your input and try again.',
  [ERROR_CODES.VALIDATION_ERROR]: 'Validation failed. Please check your input.',
  [ERROR_CODES.NOT_FOUND]: 'Resource not found.',
  [ERROR_CODES.SERVER_ERROR]: 'Server error. Please try again in a few moments.',
  [ERROR_CODES.SERVICE_UNAVAILABLE]: 'Service temporarily unavailable. Please try again later.',
  [ERROR_CODES.SERVICE_NOT_FOUND]: 'Service not found. Please contact support.',
  [ERROR_CODES.RATE_LIMIT_EXCEEDED]: 'Too many requests. Please wait a moment before trying again.',
  [ERROR_CODES.UNKNOWN_ERROR]: 'An unexpected error occurred. Please try again.',
} as const;

/**
 * Parse an error object and extract detailed error information
 */
export const parseError = (error: any): ErrorDetails => {
  // Default error details
  let errorCode: string = ERROR_CODES.UNKNOWN_ERROR;
  let errorMessage: string = ERROR_MESSAGES[ERROR_CODES.UNKNOWN_ERROR];
  let isRetryable = false;
  let severity: ErrorDetails['severity'] = 'medium';
  let status: number | undefined;

  // Check for axios errors
  if (error.code === 'ECONNABORTED') {
    errorCode = ERROR_CODES.TIMEOUT_ERROR;
    errorMessage = ERROR_MESSAGES[ERROR_CODES.TIMEOUT_ERROR];
    isRetryable = true;
    severity = 'low';
  } else if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
    errorCode = ERROR_CODES.NETWORK_ERROR;
    errorMessage = ERROR_MESSAGES[ERROR_CODES.NETWORK_ERROR];
    isRetryable = true;
    severity = 'high';
  } else if (error.response) {
    // Server responded with error status
    status = error.response.status;
    const data = error.response.data;

    switch (status) {
      case 400:
        errorCode = ERROR_CODES.INVALID_REQUEST;
        errorMessage = data?.message || ERROR_MESSAGES[ERROR_CODES.INVALID_REQUEST];
        isRetryable = false;
        severity = 'low';
        break;

      case 401:
        errorCode = ERROR_CODES.INVALID_CREDENTIALS;
        errorMessage = data?.message || ERROR_MESSAGES[ERROR_CODES.INVALID_CREDENTIALS];
        isRetryable = false;
        severity = 'medium';
        break;

      case 403:
        errorCode = ERROR_CODES.ACCESS_DENIED;
        errorMessage = data?.message || ERROR_MESSAGES[ERROR_CODES.ACCESS_DENIED];
        isRetryable = false;
        severity = 'high';
        break;

      case 404:
        errorCode = ERROR_CODES.NOT_FOUND;
        errorMessage = data?.message || ERROR_MESSAGES[ERROR_CODES.NOT_FOUND];
        isRetryable = false;
        severity = 'low';
        break;

      case 429:
        errorCode = ERROR_CODES.RATE_LIMIT_EXCEEDED;
        errorMessage = data?.message || ERROR_MESSAGES[ERROR_CODES.RATE_LIMIT_EXCEEDED];
        isRetryable = true;
        severity = 'medium';
        break;

      case 500:
      case 502:
      case 503:
      case 504:
        errorCode = ERROR_CODES.SERVER_ERROR;
        errorMessage = ERROR_MESSAGES[ERROR_CODES.SERVER_ERROR];
        isRetryable = true;
        severity = 'high';
        break;

      default:
        errorMessage = data?.message || `Unexpected error (${status})`;
        isRetryable = false;
        severity = 'medium';
    }
  } else if (error.request) {
    // Request made but no response received
    errorCode = ERROR_CODES.NO_RESPONSE;
    errorMessage = ERROR_MESSAGES[ERROR_CODES.NO_RESPONSE];
    isRetryable = true;
    severity = 'high';
  }

  // Override with custom error code if provided
  if (error.code && Object.values(ERROR_CODES).includes(error.code)) {
    errorCode = error.code;
  }

  return {
    code: errorCode,
    message: errorMessage,
    status,
    isRetryable,
    severity,
  };
};

/**
 * Log error details in development environment
 */
export const logError = (context: string, error: any, additionalInfo?: Record<string, any>) => {
  if (import.meta.env.DEV) {
    const errorDetails = parseError(error);
    console.error(`[${context}] Error:`, {
      ...errorDetails,
      originalError: error,
      response: error.response?.data,
      ...additionalInfo,
    });
  }
};

/**
 * Check if user is online
 */
export const isOnline = (): boolean => {
  return navigator.onLine;
};

/**
 * Format error message for user display
 */
export const formatErrorMessage = (error: any): string => {
  const errorDetails = parseError(error);
  return errorDetails.message;
};

/**
 * Determine if error should trigger a retry
 */
export const shouldRetry = (error: any, currentRetryCount: number, maxRetries: number = 3): boolean => {
  if (currentRetryCount >= maxRetries) {
    return false;
  }

  const errorDetails = parseError(error);
  return errorDetails.isRetryable;
};

/**
 * Calculate retry delay with exponential backoff
 */
export const getRetryDelay = (retryCount: number, baseDelay: number = 1000): number => {
  return Math.min(baseDelay * Math.pow(2, retryCount), 10000); // Max 10 seconds
};

/**
 * Validate form input
 */
export const validateInput = {
  username: (value: string): string | null => {
    if (!value.trim()) {
      return 'Username is required';
    }
    if (value.trim().length < 3) {
      return 'Username must be at least 3 characters';
    }
    if (value.trim().length > 50) {
      return 'Username must not exceed 50 characters';
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(value.trim())) {
      return 'Username can only contain letters, numbers, underscores, and hyphens';
    }
    return null;
  },

  password: (value: string): string | null => {
    if (!value) {
      return 'Password is required';
    }
    if (value.length < 6) {
      return 'Password must be at least 6 characters';
    }
    if (value.length > 100) {
      return 'Password must not exceed 100 characters';
    }
    return null;
  },

  email: (value: string): string | null => {
    if (!value.trim()) {
      return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value.trim())) {
      return 'Please enter a valid email address';
    }
    return null;
  },

  phone: (value: string): string | null => {
    if (!value.trim()) {
      return 'Phone number is required';
    }
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
    if (!phoneRegex.test(value.trim())) {
      return 'Please enter a valid phone number';
    }
    return null;
  },

  required: (value: string, fieldName: string = 'This field'): string | null => {
    if (!value || !value.trim()) {
      return `${fieldName} is required`;
    }
    return null;
  },
};

/**
 * Create an enhanced error object with additional metadata
 */
export const createError = (
  code: string,
  message: string,
  originalError?: any
): Error & { code: string; originalError?: any } => {
  const error = new Error(message) as Error & { code: string; originalError?: any };
  error.code = code;
  if (originalError) {
    error.originalError = originalError;
  }
  return error;
};
