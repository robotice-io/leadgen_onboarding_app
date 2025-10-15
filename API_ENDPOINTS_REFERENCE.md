# 📋 **Complete API Endpoints Reference**

## 🔐 **Authentication & Authorization**

### **Base URL**: `https://lead-gen-service.robotice.io/api/v1`

### **API Key Format**: `lk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` (Set via server-side `API_KEY` environment variable)

---

## 🔑 **Authentication Endpoints** (`/auth`)

### **1. User Login** ✅ **API KEY ONLY**
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "jose@robotice.io",
  "password": "Robotice.2025",
  "remember_me": false
}
```
**Response:**
```json
{
  "status": "success",
  "message": "Login successful",
  "user": {
    "id": 10,
    "email": "jose@robotice.io",
    "first_name": "Robotice.io",
    "last_name": "",
    "is_active": true,
    "is_verified": false
  },
  "tenant": {
    "id": 21,
    "name": "Robotice.io",
    "email": "jose@robotice.io",
    "onboarding_status": "completed",
    "onboarding_step": 999
  }
}
```

### **2. User Registration**
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "SecurePassword123",
  "first_name": "John",
  "last_name": "Doe"
}
```

### **3. Email Verification**
```http
POST /api/v1/auth/verify-email
Content-Type: application/json

{
  "email": "user@example.com",
  "verification_code": "abc123"
}
```

### **4. Forgot Password**
```http
POST /api/v1/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### **5. Reset Password**
```http
POST /api/v1/auth/reset-password
Content-Type: application/json

{
  "token": "reset_token_here",
  "new_password": "NewSecurePassword123"
}
```

### **6. Get User Info** ✅ **API KEY REQUIRED**
```http
GET /api/v1/auth/user-info
X-API-Key: lk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
X-Tenant-ID: 21
Content-Type: application/json
```

### **7. Get Tenant Info** ✅ **API KEY REQUIRED**
```http
GET /api/v1/auth/tenant-info
X-API-Key: lk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
X-Tenant-ID: 21
Content-Type: application/json
```

### **8. Refresh Token** ⚠️ **JWT DEPRECATED**
```http
POST /api/v1/auth/refresh
Authorization: Bearer <refresh_token>
```

---

## 📊 **Dashboard Endpoints** (`/dashboard`)

### **9. Quick Stats** ✅ **API KEY REQUIRED**
```http
GET /api/v1/dashboard/{tenant_id}/quick-stats
X-API-Key: lk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Content-Type: application/json
```

### **10. Recent Emails** ✅ **API KEY REQUIRED**
```http
GET /api/v1/dashboard/{tenant_id}/recent-emails?limit=10
X-API-Key: lk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Content-Type: application/json
```

### **11. Email Analytics** ✅ **API KEY REQUIRED**
```http
GET /api/v1/dashboard/{tenant_id}/email/{uuid}
X-API-Key: lk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Content-Type: application/json
```

### **12. Dashboard Stats** ✅ **API KEY REQUIRED**
```http
GET /api/v1/dashboard/{tenant_id}/stats?days=30
X-API-Key: lk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Content-Type: application/json
```

### **13. Dashboard Config** ✅ **API KEY REQUIRED**
```http
GET /api/v1/dashboard/{tenant_id}/config
X-API-Key: lk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Content-Type: application/json
```

### **14. Health Check** ✅ **API KEY REQUIRED**
```http
GET /api/v1/dashboard/{tenant_id}/health
X-API-Key: lk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Content-Type: application/json
```

### **15. Open Rate Trend Chart** ✅ **API KEY REQUIRED**
```http
GET /api/v1/dashboard/{tenant_id}/charts/open-rate-trend?days=7
X-API-Key: lk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Content-Type: application/json
```

### **16. Device Breakdown Chart** ✅ **API KEY REQUIRED**
```http
GET /api/v1/dashboard/{tenant_id}/charts/device-breakdown
X-API-Key: lk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Content-Type: application/json
```

---

## 📧 **Email Endpoints** (`/email`)

### **17. Send Email** ✅ **API KEY REQUIRED**
```http
POST /api/v1/email/send
X-API-Key: lk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Content-Type: application/json

{
  "tenant_id": 21,
  "to": "recipient@example.com",
  "subject": "Test Email",
  "body": "Hello! This is a test email.",
  "html_content": "<h1>Hello!</h1><p>This is a test email.</p>",
  "auto_parse_html": true
}
```
**Response:**
```json
{
  "status": "enqueued"
}
```

---

## 🔗 **OAuth Endpoints** (`/oauth`)

### **18. Initiate OAuth** ✅ **API KEY REQUIRED**
```http
POST /api/v1/oauth/init?tenant_id=21
X-API-Key: lk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Content-Type: application/json
```

### **19. OAuth Callback** 🌐 **PUBLIC**
```http
GET /api/v1/oauth/callback?code=auth_code&state=state_token&tenant_id=21
```

### **20. Refresh OAuth Token** ✅ **API KEY REQUIRED**
```http
POST /api/v1/oauth/refresh?tenant_id=21
X-API-Key: lk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Content-Type: application/json
```

---

## 📈 **Telemetry Endpoints** (`/telemetry`)

### **21. Email Open Tracking** 🌐 **PUBLIC**
```http
GET /api/v1/telemetry/open/{uuid}.png?t=21
```
**Response:** 1x1 transparent PNG image

### **22. Email Statistics** ✅ **API KEY REQUIRED**
```http
GET /api/v1/telemetry/stats/{tenant_id}?days=30
X-API-Key: lk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Content-Type: application/json
```

### **23. Email Open Details** ✅ **API KEY REQUIRED**
```http
GET /api/v1/telemetry/email/{uuid}/opens
X-API-Key: lk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Content-Type: application/json
```

---

## 🏢 **Tenant Management Endpoints** (`/tenants`)

### **24. Create Tenant** ✅ **API KEY REQUIRED**
```http
POST /api/v1/tenants/
X-API-Key: lk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Content-Type: application/json

{
  "name": "Company Name",
  "email": "company@example.com",
  "domain": "example.com"
}
```

### **25. List All Tenants** ✅ **API KEY REQUIRED**
```http
GET /api/v1/tenants/
X-API-Key: lk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Content-Type: application/json
```

### **26. Get Tenant** ✅ **API KEY REQUIRED**
```http
GET /api/v1/tenants/{tenant_id}
X-API-Key: lk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Content-Type: application/json
```

### **27. Create Tenant OAuth Client** ✅ **API KEY REQUIRED**
```http
POST /api/v1/tenants/{tenant_id}/oauth/client
X-API-Key: lk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Content-Type: application/json

{
  "client_id": "google_client_id",
  "client_secret": "google_client_secret",
  "redirect_uri": "https://yourapp.com/callback",
  "scopes": ["https://www.googleapis.com/auth/gmail.send"],
  "access_type": "offline",
  "prompt": "consent"
}
```

### **28. Get Tenant OAuth Client** ✅ **API KEY REQUIRED**
```http
GET /api/v1/tenants/{tenant_id}/oauth/client
X-API-Key: lk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Content-Type: application/json
```

---

## 📋 **Activity Logs Endpoints** (`/tenant-activity-logs`)

### **29. List Activity Logs** ✅ **API KEY REQUIRED**
```http
GET /api/v1/tenant-activity-logs/?tenant_id=21&activity_type=email_sent&limit=100&offset=0
X-API-Key: lk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Content-Type: application/json
```

### **30. Get Tenant Activity Logs** ✅ **API KEY REQUIRED**
```http
GET /api/v1/tenant-activity-logs/{tenant_id}?activity_type=email_sent&limit=100&offset=0
X-API-Key: lk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Content-Type: application/json
```

### **31. Activity Stats Summary** ✅ **API KEY REQUIRED**
```http
GET /api/v1/tenant-activity-logs/stats/summary?tenant_id=21
X-API-Key: lk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Content-Type: application/json
```

---

## 🔑 **Authentication Methods**

### **✅ API Key Authentication (PRIMARY)**
- **Header**: `X-API-Key: lk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- **Tenant ID**: `X-Tenant-ID: 21` (for multi-tenant endpoints)
- **Used by**: All dashboard, email, telemetry, tenant management endpoints

### **⚠️ JWT Authentication (DEPRECATED)**
- **Header**: `Authorization: Bearer <jwt_token>`
- **Used by**: `/auth/me`, `/auth/me/tenant`, `/auth/refresh` (legacy endpoints)

### **🌐 Public Endpoints (NO AUTH)**
- **OAuth Callback**: `/api/v1/oauth/callback`
- **Email Tracking**: `/api/v1/telemetry/open/{uuid}.png`

---

## 📝 **Important Notes**

1. **API Key Format**: Always starts with `lk_` followed by 64-character hash
2. **Tenant ID**: Required for multi-tenant endpoints via `X-Tenant-ID` header
3. **Content-Type**: Always use `application/json` for JSON requests
4. **Base URL**: `https://lead-gen-service.robotice.io/api/v1`
5. **Rate Limiting**: No explicit rate limits implemented
6. **CORS**: Configured for frontend domains
7. **Error Responses**: Standard HTTP status codes with JSON error details

This is the complete and accurate list of all API endpoints with proper authentication methods and request/response formats! 🎯
