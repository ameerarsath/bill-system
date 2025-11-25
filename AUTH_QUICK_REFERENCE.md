# Authentication Quick Reference Guide

## 🎯 Core Principle
**NEVER reset login state on refresh** - Auth persists using localStorage + initialization tracking

---

## 📦 Key Components

### 1. Token Storage (`utils/tokenStorage.ts`)
```typescript
import { getToken, setToken, clearAuthStorage } from './utils/tokenStorage';

// Get current token
const token = getToken();

// Check if logged in
const isLoggedIn = getToken() !== null;

// Logout (clear everything)
clearAuthStorage();
```

### 2. Auth Hook (`useAuth`)
```typescript
import { useAuth } from './context/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, isInitialized, login, logout } = useAuth();

  // IMPORTANT: Always check isInitialized first
  if (!isInitialized) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <LoginPrompt />;
  }

  return <Dashboard user={user} />;
}
```

### 3. Protected Routes
```typescript
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Single role
<Route path="/admin" element={
  <ProtectedRoute allowedRoles={['admin']}>
    <AdminDashboard />
  </ProtectedRoute>
} />

// Multiple roles
<Route path="/orders" element={
  <ProtectedRoute allowedRoles={['admin', 'waiter', 'kitchen']}>
    <OrdersPage />
  </ProtectedRoute>
} />
```

---

## 🔑 Authentication Flow

### Login
```typescript
import { useAuth } from './context/AuthContext';

const { login } = useAuth();

// In your login handler
const success = await login({ identifier: username, password });
if (success) {
  navigate('/dashboard');
}
```

### Logout
```typescript
import { useAuth } from './context/AuthContext';

const { logout } = useAuth();

// In your logout handler
logout();
navigate('/login');
```

### Check Auth Status
```typescript
const { isAuthenticated, user, isInitialized } = useAuth();

// Wait for initialization
if (!isInitialized) {
  return <Loading />;
}

// Check if logged in
if (isAuthenticated && user) {
  console.log(`Logged in as ${user.name}`);
}
```

---

## 🛡️ Security Rules

### ✅ DO
- ✅ Use `getToken()` to access token
- ✅ Use `clearAuthStorage()` on logout
- ✅ Check `isInitialized` before `isAuthenticated`
- ✅ Let backend validate all tokens
- ✅ Use HTTPS in production

### ❌ DON'T
- ❌ Access localStorage directly
- ❌ Trust client-side JWT parsing for security
- ❌ Check auth without waiting for initialization
- ❌ Store sensitive data in localStorage
- ❌ Use tokens after logout

---

## 🔄 State Flow on Page Refresh

```
1. Browser refreshes
2. App mounts
3. AuthProvider calls initializeAuth()
4. Token loaded from localStorage (instant)
5. User loaded from localStorage (instant)
6. State updated: isAuthenticated=true, isInitialized=true
7. ProtectedRoute sees isInitialized=true → checks auth → allows access
8. User sees authenticated UI (NO REDIRECT)
9. Background: API validates token
10. If valid → update user data
11. If invalid → logout and redirect
```

---

## 🐛 Common Issues & Solutions

### Issue: User logged out on refresh
```typescript
// ❌ WRONG - Checks auth before initialization
if (!isAuthenticated) {
  return <Navigate to="/login" />;
}

// ✅ CORRECT - Wait for initialization first
if (!isInitialized) {
  return <Loading />;
}
if (!isAuthenticated) {
  return <Navigate to="/login" />;
}
```

### Issue: Infinite loading spinner
```typescript
// ❌ WRONG - Missing useEffect dependency
useEffect(() => {
  authStore.initializeAuth();
}, []); // authStore.initializeAuth might change

// ✅ CORRECT - Include function in deps
useEffect(() => {
  authStore.initializeAuth();
}, [authStore.initializeAuth]);
```

### Issue: Token not sent with API calls
```typescript
// ❌ WRONG - Direct localStorage access
const token = localStorage.getItem('jwt_token');

// ✅ CORRECT - Use token utility
import { getToken } from './utils/tokenStorage';
const token = getToken();
```

---

## 📊 Auth State Properties

```typescript
interface AuthState {
  user: User | null;              // Current user data
  isAuthenticated: boolean;       // Is user logged in?
  isInitialized: boolean;         // Has auth been restored from storage?
  login: (creds) => Promise<boolean>;
  logout: () => void;
}
```

**Critical**: Always check `isInitialized` before `isAuthenticated`

---

## 🚀 Best Practices

### 1. Component Pattern
```typescript
function ProtectedComponent() {
  const { isInitialized, isAuthenticated, user } = useAuth();

  // Step 1: Wait for initialization
  if (!isInitialized) {
    return <LoadingSpinner />;
  }

  // Step 2: Check authentication
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Step 3: Check authorization
  if (user?.role !== 'admin') {
    return <AccessDenied />;
  }

  // Step 4: Render protected content
  return <AdminContent />;
}
```

### 2. API Call Pattern
```typescript
import { getToken } from './utils/tokenStorage';

async function makeApiCall() {
  const token = getToken();

  if (!token) {
    throw new Error('Not authenticated');
  }

  const response = await fetch('/api/endpoint', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (response.status === 401) {
    // Token expired - handled by interceptor
    clearAuthStorage();
    window.location.href = '/login?session=expired';
  }

  return response.json();
}
```

### 3. Conditional Rendering
```typescript
function Navigation() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav>
      {isAuthenticated ? (
        <>
          <span>Welcome, {user?.name}</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
}
```

---

## 📁 File Reference

| File | Purpose |
|------|---------|
| `utils/tokenStorage.ts` | Token management utilities |
| `store/authStore.ts` | Zustand state management |
| `context/AuthContext.tsx` | React Context provider |
| `components/auth/ProtectedRoute.tsx` | Route protection |
| `api/client.ts` | Axios instance with auth |
| `api/authApi.ts` | Auth API calls |

---

## 🔧 Environment Setup

**`.env.local`**:
```bash
VITE_API_URL=http://localhost:8080/api
```

**Production `.env.production`**:
```bash
VITE_API_URL=https://api.yourdomain.com
```

---

## ✅ Testing Checklist

- [ ] Login → Refresh → Still logged in ✅
- [ ] Login → Close browser → Reopen → Still logged in ✅
- [ ] Protected route → Refresh → No redirect ✅
- [ ] Logout → All data cleared ✅
- [ ] Invalid token → Redirect to login ✅
- [ ] Expired token → Redirect to login ✅
- [ ] Wrong role → Redirect to correct dashboard ✅

---

## 🎯 Remember

1. **localStorage = Token + User data**
2. **isInitialized = Wait before checking auth**
3. **ProtectedRoute = Handles loading state**
4. **Backend validates = Client display only**
5. **clearAuthStorage() = Complete logout**

---

**Questions?** See `PERSISTENT_AUTH_IMPLEMENTATION.md` for full details.
