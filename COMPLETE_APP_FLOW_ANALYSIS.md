# 🔍 COMPLETE APP FLOW ANALYSIS

## 📋 **App Architecture Overview**

This app has evolved from a simple web form (wizard) to a full-featured application with:
- **Authentication System** (login/register)
- **Onboarding Wizard** (3-step process)
- **Dashboard** (analytics and management)
- **OAuth Integration** (Google Gmail API)
- **Tenant Management** (multi-tenant architecture)

---

## 🏗️ **App Structure & Routes**

### **Main Pages:**
1. **`/`** - Landing page (redirects to wizard)
2. **`/login`** - Authentication page
3. **`/register`** - User registration
4. **`/onboarding`** - 3-step wizard (protected)
5. **`/dashboard`** - Main dashboard (protected)
6. **`/oauth/callback`** - Google OAuth callback
7. **`/onboarding/already-linked`** - Error page for existing tenants

### **API Routes:**
- **`/api/bridge/[...path]`** - Proxy for backend API calls
- **`/api/oauth/google/start`** - OAuth initiation
- **`/api/oauth/google/callback`** - OAuth callback handler
- **`/api/test-send`** - Email testing endpoint

---

## 🔄 **Complete User Journey**

### **1. Landing Page (`/`)**
```
User visits → Sees "Onboarding LeadGen" → Clicks "Empezar" → Redirects to /onboarding
```

### **2. Authentication Check (`/onboarding`)**
```
User lands on /onboarding → isAuthenticated() check → If not authenticated → Redirect to /login
```

### **3. Login Flow (`/login`)**
```
User enters credentials → login() function → POST /api/v1/auth/login → 
Store JWT token → Fetch user data → Fetch tenant data → Redirect to /onboarding
```

### **4. Onboarding Wizard (3 Steps)**

#### **Step 1: Company Information**
```
User enters:
- Company name (orgName)
- Contact email (contactEmail)

API Call: POST /api/v1/tenants/
Payload: { name: orgName, email: contactEmail }
Response: { id: tenantId, ... }

On Success: → Step 2
On Error 400: → /onboarding/already-linked
```

#### **Step 2: Google OAuth Setup**
```
User enters:
- Google Client ID
- Google Client Secret

API Call: POST /api/v1/tenants/{tenantId}/oauth/client
Payload: {
  client_id: googleClientId,
  client_secret: googleClientSecret,
  redirect_uri: "https://app.com/oauth/callback",
  scopes: ["openid", "email", "profile", "https://www.googleapis.com/auth/gmail.send"],
  access_type: "offline",
  prompt: "consent"
}

On Success: → Step 3
```

#### **Step 3: Google OAuth Connection**
```
User clicks "Connect Google" → 
API Call: POST /api/v1/oauth/init?tenant_id={tenantId} → 
Response: { auth_url: "https://accounts.google.com/oauth/..." } → 
Redirect to Google OAuth → 
Google redirects to /oauth/callback → 
Process OAuth → 
Redirect to /dashboard
```

### **5. OAuth Callback (`/oauth/callback`)**
```
Google redirects with code & state → 
API Call: GET /api/v1/oauth/callback?code=...&state=... → 
API Call: POST /api/v1/oauth/refresh → 
Send test emails → 
Redirect to /dashboard
```

### **6. Dashboard (`/dashboard`)**
```
User lands on dashboard → 
Check authentication → 
Get tenant from localStorage → 
API Call: GET /api/v1/dashboard/{tenantId}/quick-stats → 
API Call: GET /api/v1/dashboard/{tenantId}/recent-emails → 
Display analytics and data
```

---

## 🔌 **API Endpoints Analysis**

### **Authentication Endpoints** (NO API KEY REQUIRED)
| Endpoint | Method | Purpose | Headers |
|----------|--------|---------|---------|
| `/api/v1/auth/login` | POST | User login | `Content-Type: application/json` |
| `/api/v1/auth/register` | POST | User registration | `Content-Type: application/json` |
| `/api/v1/auth/me` | GET | Get current user | `Authorization: Bearer {token}` |
| `/api/v1/auth/me/tenant` | GET | Get user's tenant | `Authorization: Bearer {token}` |
| `/api/v1/auth/verify-email` | POST | Email verification | `Content-Type: application/json` |
| `/api/v1/auth/forgot-password` | POST | Password reset request | `Content-Type: application/json` |
| `/api/v1/auth/reset-password` | POST | Password reset | `Content-Type: application/json` |

### **Tenant Management Endpoints** (API KEY REQUIRED)
| Endpoint | Method | Purpose | Headers |
|----------|--------|---------|---------|
| `/api/v1/tenants/` | POST | Create tenant | `X-API-Key: {key}`, `Content-Type: application/json` |
| `/api/v1/tenants/{id}/oauth/client` | POST | Save OAuth credentials | `X-API-Key: {key}`, `Content-Type: application/json` |

### **OAuth Endpoints** (API KEY REQUIRED)
| Endpoint | Method | Purpose | Headers |
|----------|--------|---------|---------|
| `/api/v1/oauth/init` | POST | Initialize OAuth flow | `X-API-Key: {key}`, `Content-Type: application/json` |
| `/api/v1/oauth/callback` | GET | Handle OAuth callback | `X-API-Key: {key}` |
| `/api/v1/oauth/refresh` | POST | Refresh OAuth tokens | `X-API-Key: {key}`, `Content-Type: application/json` |

### **Dashboard Endpoints** (JWT ONLY - NO API KEY)
| Endpoint | Method | Purpose | Headers |
|----------|--------|---------|---------|
| `/api/v1/dashboard/{tenantId}/quick-stats` | GET | Real-time stats | `Authorization: Bearer {token}` |
| `/api/v1/dashboard/{tenantId}/recent-emails` | GET | Recent emails | `Authorization: Bearer {token}` |
| `/api/v1/dashboard/{tenantId}/email/{uuid}` | GET | Email analytics | `Authorization: Bearer {token}` |

### **Telemetry Endpoints** (API KEY + JWT REQUIRED)
| Endpoint | Method | Purpose | Headers |
|----------|--------|---------|---------|
| `/api/v1/telemetry/stats/{tenantId}` | GET | Email statistics | `X-API-Key: {key}`, `Authorization: Bearer {token}` |
| `/api/v1/telemetry/email/{uuid}/opens` | GET | Email open details | `X-API-Key: {key}`, `Authorization: Bearer {token}` |

### **Email Endpoints** (API KEY REQUIRED)
| Endpoint | Method | Purpose | Headers |
|----------|--------|---------|---------|
| `/api/v1/email/send` | POST | Send email | `X-API-Key: {key}`, `Content-Type: application/json` |

---

## 🐛 **Current Issues Identified**

### **1. API Key Logic Inconsistency**
- **Problem**: The current logic only adds API key to `/telemetry/*` endpoints
- **Reality**: Backend requires API key for `/tenants/*`, `/oauth/*`, and `/email/*` endpoints
- **Impact**: Wizard steps 1 and 3 fail with "API key required" error

### **2. Mixed Authentication Requirements**
- **Auth endpoints**: No API key, no JWT (except `/auth/me`)
- **Tenant/OAuth endpoints**: API key required, no JWT
- **Dashboard endpoints**: JWT required, no API key
- **Telemetry endpoints**: Both API key and JWT required

### **3. Path Duplication Issue**
- **Problem**: API calls were getting double-prefixed (`/api/bridge/api/v1/...`)
- **Status**: ✅ FIXED (base URL no longer includes `/api/v1`)

### **4. Authentication Flow Complexity**
- **Issue**: Multiple authentication checks in different places
- **Problem**: Inconsistent redirect logic between pages

---

## 🔧 **Required Fixes**

### **1. Update API Key Logic**
```typescript
// Current (WRONG):
if (path.includes('/telemetry/')) {
  headers["X-API-Key"] = apiKey;
}

// Should be (CORRECT):
if (path.includes('/telemetry/') || 
    path.includes('/tenants/') || 
    path.includes('/oauth/') || 
    path.includes('/email/')) {
  headers["X-API-Key"] = apiKey;
}
```

### **2. Fix OAuth Callback Email Sending**
- **Problem**: Direct fetch calls bypass API key logic
- **Solution**: Use `apiPost()` instead of direct `fetch()`

### **3. Simplify Authentication Flow**
- **Problem**: Multiple auth checks causing redirect loops
- **Solution**: Centralize authentication logic

---

## 📊 **Data Flow Summary**

### **LocalStorage Keys Used:**
- `robotice_auth_token` - JWT token
- `robotice_user` - User data
- `robotice_tenant` - Tenant data
- `robotice_refresh_token` - Refresh token
- `robotice-tenant-id` - Tenant ID (wizard)
- `robotice-contact-email` - Contact email (wizard)
- `robotice-org-name` - Organization name (wizard)
- `robotice-oauth-state` - OAuth state

### **State Management:**
- **Authentication**: `lib/auth-client.ts`
- **API Calls**: `lib/api.ts`
- **Internationalization**: `lib/i18n.tsx`
- **Dashboard Data**: React Query hooks

---

## 🎯 **Next Steps**

1. **Fix API key logic** for all required endpoints
2. **Update OAuth callback** to use proper API calls
3. **Test complete user journey** end-to-end
4. **Simplify authentication flow** to prevent redirect loops
5. **Add proper error handling** for all API calls

This analysis shows the app has grown complex with mixed requirements. The main issue is that the API key logic doesn't match what the backend actually expects.
