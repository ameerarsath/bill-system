/**
 * Token Storage Utility
 * Centralized token management with security best practices
 *
 * Storage Strategy: localStorage for JWT tokens
 * Why localStorage over HttpOnly cookies for this stack:
 * - Separate React + Spring Boot architecture (different domains in dev)
 * - Easier token inspection and debugging
 * - Simpler implementation for SPA architecture
 * - Spring Boot backend handles token validation
 */

const TOKEN_KEY = 'jwt_token';
const USER_KEY = 'hotel_user';

/**
 * Get JWT token from storage
 */
export const getToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error reading token from storage:', error);
    return null;
  }
};

/**
 * Save JWT token to storage
 */
export const setToken = (token: string): void => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Error saving token to storage:', error);
  }
};

/**
 * Remove JWT token from storage
 */
export const removeToken = (): void => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error removing token from storage:', error);
  }
};

/**
 * Check if token exists
 */
export const hasToken = (): boolean => {
  return getToken() !== null;
};

/**
 * Get user data from storage
 */
export const getStoredUser = (): any | null => {
  try {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error reading user from storage:', error);
    return null;
  }
};

/**
 * Save user data to storage
 */
export const setStoredUser = (user: any): void => {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user to storage:', error);
  }
};

/**
 * Remove user data from storage
 */
export const removeStoredUser = (): void => {
  try {
    localStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error('Error removing user from storage:', error);
  }
};

/**
 * Clear all auth data from storage
 */
export const clearAuthStorage = (): void => {
  removeToken();
  removeStoredUser();
};

/**
 * Check if auth data exists in storage
 */
export const hasStoredAuth = (): boolean => {
  return hasToken() && getStoredUser() !== null;
};

/**
 * Parse JWT token to extract payload (without verification)
 * Note: This is for client-side display only, NOT for security decisions
 */
export const parseJwtPayload = (token: string): any | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing JWT payload:', error);
    return null;
  }
};

/**
 * Check if JWT token is expired
 * Note: This is client-side only, server MUST validate
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = parseJwtPayload(token);
    if (!payload || !payload.exp) {
      return true;
    }
    // exp is in seconds, Date.now() is in milliseconds
    return payload.exp * 1000 < Date.now();
  } catch (error) {
    return true;
  }
};

/**
 * Get token with expiration check
 */
export const getValidToken = (): string | null => {
  const token = getToken();
  if (!token) {
    return null;
  }

  // Check if token is expired (client-side check only)
  if (isTokenExpired(token)) {
    clearAuthStorage();
    return null;
  }

  return token;
};
