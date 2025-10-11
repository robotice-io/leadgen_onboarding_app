# 🚀 Backend Integration Guide - Complete Reference

## 📋 **Overview**

This guide provides the complete backend integration reference based on the comprehensive documentation from the backend team.

## 🔑 **Critical Updates**

### **New Endpoint Added:**
- ✅ **`GET /api/v1/auth/me/tenant`** - Returns tenant information for the authenticated user
  - **Response:** `{ tenant_id: number, tenant_name: string, tenant_email: string }`
  - **Required for:** Getting the `tenant_id` needed for dashboard endpoints

## 🔐 **Complete Authentication Flow**

### **Step-by-Step Process:**

```javascript
// 1. LOGIN - Get JWT Token
const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    // ❌ NO API KEY REQUIRED
  },
  body: JSON.stringify({
    email: 'jose@robotice.io',
    password: 'Robotice.2025'
  })
});

const { access_token, token_type, expires_in } = await loginResponse.json();
// Store token in localStorage

// 2. GET USER INFO - Verify token works
const userResponse = await fetch(`${API_BASE_URL}/auth/me`, {
  headers: {
    'Authorization': `Bearer ${access_token}`,
    'Content-Type': 'application/json'
    // ❌ NO API KEY REQUIRED
  }
});

const user = await userResponse.json();
// Store user info

// 3. GET TENANT INFO - Get tenant_id for dashboard
const tenantResponse = await fetch(`${API_BASE_URL}/auth/me/tenant`, {
  headers: {
    'Authorization': `Bearer ${access_token}`,
    'Content-Type': 'application/json'
    // ❌ NO API KEY REQUIRED
  }
});

const { tenant_id, tenant_name, tenant_email } = await tenantResponse.json();
// Store tenant info - tenant_id is CRITICAL for dashboard

// 4. ACCESS DASHBOARD - Use tenant_id
const dashboardResponse = await fetch(`${API_BASE_URL}/dashboard/${tenant_id}/quick-stats`, {
  headers: {
    'Authorization': `Bearer ${access_token}`,
    'Content-Type': 'application/json'
    // ❌ NO API KEY REQUIRED for dashboard endpoints
  }
});

const dashboardData = await dashboardResponse.json();
```

## 📊 **API Endpoints Reference**

### **🔑 Authentication Endpoints (NO API KEY)**

| Method | Endpoint | Description | Headers |
|--------|----------|-------------|---------|
| POST | `/auth/login` | User login | `Content-Type: application/json` |
| POST | `/auth/register` | User registration | `Content-Type: application/json` |
| GET | `/auth/me` | Get current user | `Authorization: Bearer {token}` |
| **GET** | **`/auth/me/tenant`** | **Get user's tenant info** | **`Authorization: Bearer {token}`** |
| POST | `/auth/verify-email` | Email verification | `Content-Type: application/json` |
| POST | `/auth/forgot-password` | Password reset | `Content-Type: application/json` |

### **📈 Dashboard Endpoints (JWT ONLY - NO API KEY)**

| Method | Endpoint | Description | Headers |
|--------|----------|-------------|---------|
| GET | `/dashboard/{tenant_id}/quick-stats` | Real-time stats | `Authorization: Bearer {token}` |
| GET | `/dashboard/{tenant_id}/stats` | Full dashboard data | `Authorization: Bearer {token}` |
| GET | `/dashboard/{tenant_id}/email/{uuid}` | Email analytics | `Authorization: Bearer {token}` |
| GET | `/dashboard/{tenant_id}/config` | Tenant config | `Authorization: Bearer {token}` |

### **📊 Telemetry Endpoints (API KEY + JWT)**

| Method | Endpoint | Description | Headers |
|--------|----------|-------------|---------|
| GET | `/telemetry/stats/{tenant_id}` | Email statistics | `X-API-Key: {key}`, `Authorization: Bearer {token}` |
| GET | `/telemetry/email/{uuid}/opens` | Email opens | `X-API-Key: {key}`, `Authorization: Bearer {token}` |

## 📝 **Request/Response Examples**

### **1. Login**

**Request:**
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "jose@robotice.io",
  "password": "Robotice.2025"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 1800
}
```

### **2. Get User Info**

**Request:**
```http
GET /api/v1/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Response:**
```json
{
  "email": "jose@robotice.io",
  "first_name": "Robotice.io",
  "last_name": "",
  "id": 10,
  "is_active": true,
  "is_verified": false,
  "created_at": "2025-10-10T23:22:52.278147Z",
  "last_login": "2025-10-11T00:18:17.380450Z"
}
```

### **3. Get Tenant Info (NEW!)**

**Request:**
```http
GET /api/v1/auth/me/tenant
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Response:**
```json
{
  "tenant_id": 21,
  "tenant_name": "Robotice.io",
  "tenant_email": "jose@robotice.io"
}
```

### **4. Dashboard Quick Stats**

**Request:**
```http
GET /api/v1/dashboard/21/quick-stats
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Response:**
```json
{
  "tenant_id": 21,
  "emails_sent_today": 0,
  "opens_today": 0,
  "open_rate_today": 0.0,
  "unique_devices_today": 0,
  "last_updated": "2025-10-11T00:18:48.160829"
}
```

## 🧪 **Test Credentials**

| Email | Password | Tenant ID | Tenant Name |
|-------|----------|-----------|-------------|
| jose@robotice.io | Robotice.2025 | 21 | Robotice.io |
| manuel.z@robotice.io | Robotice.2025 | 22 | Robotice.io |
| marjana.z@robotice.io | Robotice.2025 | 23 | Robotice.io |
| benja@arch.finance | Robotice.2025 | 26 | Arch Finance |
| emma.s@devups.io | Robotice.2025 | 24 | Devups |

## 🔧 **Frontend Implementation**

### **Updated Authentication Client**

The `lib/auth-client.ts` now includes:

```typescript
// NEW FUNCTION - Get tenant information
export async function getUserTenant(): Promise<any> {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");

  const apiBase = getApiBaseUrl();
  const res = await fetch(`${apiBase}/api/v1/auth/me/tenant`, {
    headers: { 
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      // No API key required for auth endpoints
    },
  });

  if (!res.ok) {
    throw new Error("Failed to get tenant info");
  }

  return res.json();
}
```

### **Usage Example**

```typescript
import { login, getCurrentUser, getUserTenant } from '@/lib/auth-client';

// 1. Login
const { access_token } = await login('jose@robotice.io', 'Robotice.2025');

// 2. Get user info
const user = await getCurrentUser();

// 3. Get tenant info (includes tenant_id)
const tenant = await getUserTenant();
console.log(tenant.tenant_id); // 21

// 4. Use tenant_id for dashboard
const stats = await apiGet(`/api/v1/dashboard/${tenant.tenant_id}/quick-stats`);
```

## 🌐 **CORS Configuration**

✅ **DYNAMIC CORS ENABLED** - No manual configuration needed!

- **Development Mode:** Allows ALL origins (`*`)
- **Any Vercel preview URL works automatically**
- **Zero maintenance required**

## 🚨 **Error Handling**

### **Common Errors:**

**401 Unauthorized:**
```json
{
  "detail": "Could not validate credentials"
}
```
**Action:** Token expired or invalid - redirect to login

**404 Not Found:**
```json
{
  "detail": "No tenant found for this user"
}
```
**Action:** User has no tenant assigned - contact support

## ✅ **Summary**

### **Key Changes:**
1. ✅ **New endpoint:** `/auth/me/tenant` provides `tenant_id`
2. ✅ **Auth endpoints:** NO API key required
3. ✅ **Dashboard endpoints:** JWT only (NO API key)
4. ✅ **Telemetry endpoints:** API key + JWT required
5. ✅ **Dynamic CORS:** Works with any Vercel URL

### **Complete Flow:**
1. **Login** → Get JWT token
2. **Get user info** → Verify authentication
3. **Get tenant info** → Get `tenant_id`
4. **Access dashboard** → Use `tenant_id` + JWT
5. **Auto-refresh** → Every 15 seconds

**All integration points are now documented and implemented!** 🚀
