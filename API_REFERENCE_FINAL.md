# LEADGEN MVP API - DEFINITIVE ENDPOINT MANUAL

## Overview
This API provides lead generation and email marketing capabilities with tenant-based multi-tenancy. The API is accessible via HTTPS with automatic HTTP to HTTPS redirection.

## Authentication Methods

### Primary Authentication: API Key + Tenant ID
Most endpoints require:
- `X-API-Key` header with your API key
- `X-Tenant-ID` header with your tenant ID (for tenant-specific endpoints)

### Secondary Authentication: Login (No API Key Required)
- `POST /api/v1/auth/login` - No API key required, returns user and tenant info

### Deprecated Authentication: JWT Tokens
- JWT-based authentication is deprecated
- Use API key authentication instead

---

## Health & System

### GET /healthz
**Description:** Health Check
**Parameters:** None
**Request Body:** None
**Example Response:**
```json
{"status":"ok"}
```

---

## Authentication

### POST /api/v1/auth/register
**Description:** Register a new user
**Parameters:** None
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "first_name": "John",
  "last_name": "Doe"
}
```
**Example Response:**
```json
{
  "message": "User created successfully. Please check your email for verification.",
  "user_id": 17,
  "tenant_id": 28,
  "email": "user@example.com",
  "email_sent": true,
  "tenant": {
    "id": 28,
    "name": "John",
    "email": "user@example.com",
    "onboarding_status": "not_started",
    "onboarding_step": 1
  }
}
```

### POST /api/v1/auth/login
**Description:** Login user (No API key required)
**Parameters:** None
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
**Example Response:**
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
**Error Response (401):**
```json
{
  "detail": "Incorrect email or password"
}
```

### POST /api/v1/auth/verify-email
**Description:** Verify email address
**Parameters:** None
**Request Body:**
```json
{
  "token": "verification_token_here"
}
```

### POST /api/v1/auth/forgot-password
**Description:** Request password reset
**Parameters:** None
**Request Body:**
```json
{
  "email": "user@example.com"
}
```

### POST /api/v1/auth/reset-password
**Description:** Reset password with token
**Parameters:** None
**Request Body:**
```json
{
  "token": "reset_token_here",
  "new_password": "newpassword123"
}
```

### POST /api/v1/auth/refresh
**Description:** Refresh authentication token
**Parameters:** None
**Request Body:**
```json
{
  "refresh_token": "refresh_token_here"
}
```

### GET /api/v1/auth/user-info
**Description:** Get user information using API key and tenant ID
**Parameters:** None
**Headers Required:**
- `X-API-Key`: Your API key
- `X-Tenant-ID`: Tenant ID (required)
**Request Body:** None
**Example Response:**
```json
{
  "id": 17,
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "is_active": true,
  "is_verified": false
}
```

### GET /api/v1/auth/tenant-info
**Description:** Get tenant information using API key and tenant ID
**Parameters:** None
**Headers Required:**
- `X-API-Key`: Your API key
- `X-Tenant-ID`: Tenant ID (required)
**Request Body:** None
**Example Response:**
```json
{
  "tenant_id": 28,
  "tenant_name": "John",
  "tenant_email": "user@example.com",
  "onboarding_status": "not_started",
  "onboarding_step": 1,
  "onboarding_completed_at": null,
  "onboarding_meta": null
}
```

---

## Tenants

### GET /api/v1/tenants/
**Description:** Get all tenants
**Parameters:** None
**Request Body:** None
**Example Response:**
```json
[
  {
    "name": "Company Name",
    "email": "company@example.com",
    "id": 23
  }
]
```

### GET /api/v1/tenants/{tenant_id}
**Description:** Get specific tenant
**Parameters:**
- `tenant_id` (path): Tenant ID (required)
**Request Body:** None
**Example Response:**
```json
{
  "name": "Company Name",
  "email": "company@example.com",
  "id": 23
}
```

### POST /api/v1/tenants/
**Description:** Create new tenant
**Parameters:** None
**Request Body:**
```json
{
  "name": "Company Name",
  "email": "company@example.com"
}
```

### GET /api/v1/tenants/{tenant_id}/oauth/client
**Description:** Get OAuth client configuration
**Parameters:**
- `tenant_id` (path): Tenant ID (required)
**Request Body:** None
**Example Response:**
```json
{
  "redirect_uri": "https://leadgen-onboarding.robotice.io/oauth/callback",
  "scopes": ["openid", "email", "profile", "https://www.googleapis.com/auth/gmail.send"],
  "access_type": "offline",
  "prompt": "consent",
  "client_id": "374714611790-0fal8doata52oo15mqi50b5965lm11hj.apps.googleusercontent.com",
  "secret_mask": "****"
}
```

### POST /api/v1/tenants/{tenant_id}/oauth/client
**Description:** Create/update OAuth client
**Parameters:**
- `tenant_id` (path): Tenant ID (required)
**Request Body:**
```json
{
  "client_id": "your_google_client_id",
  "client_secret": "your_google_client_secret"
}
```

---

## Email

### POST /api/v1/email/send
**Description:** Send email via tenant's Gmail
**Parameters:** None
**Request Body:**
```json
{
  "tenant_id": 23,
  "to": "recipient@example.com",
  "subject": "Email Subject",
  "body": "Plain text email body",
  "html": "<h1>HTML email body</h1>"
}
```
**Example Response:**
```json
{"status":"enqueued"}
```

---

## OAuth

### POST /api/v1/oauth/init
**Description:** Initialize OAuth flow
**Parameters:** None
**Request Body:**
```json
{
  "tenant_id": 23
}
```

### GET /api/v1/oauth/callback
**Description:** OAuth callback handler
**Parameters:**
- `code` (query): Authorization code (required)
- `state` (query): State parameter (required)
**Request Body:** None

### POST /api/v1/oauth/refresh
**Description:** Refresh OAuth token
**Parameters:** None
**Request Body:**
```json
{
  "tenant_id": 23
}
```

---

## Dashboard

### GET /api/v1/dashboard/{tenant_id}/stats
**Description:** Get dashboard statistics
**Parameters:**
- `tenant_id` (path): Tenant ID (required)
**Request Body:** None
**Example Response:**
```json
{
  "emails_sent": 3,
  "unique_opens": 0,
  "total_opens": 0,
  "open_rate": 0.0,
  "avg_opens_per_email": 0.0,
  "unique_devices": 0,
  "device_breakdown": {},
  "multi_device_opens": 0,
  "last_updated": "2025-10-13T13:29:23.007794"
}
```

### GET /api/v1/dashboard/{tenant_id}/quick-stats
**Description:** Get quick dashboard stats
**Parameters:**
- `tenant_id` (path): Tenant ID (required)
**Request Body:** None

### GET /api/v1/dashboard/{tenant_id}/recent-emails
**Description:** Get recent emails
**Parameters:**
- `tenant_id` (path): Tenant ID (required)
**Request Body:** None

### GET /api/v1/dashboard/{tenant_id}/config
**Description:** Get dashboard configuration
**Parameters:**
- `tenant_id` (path): Tenant ID (required)
**Request Body:** None

### GET /api/v1/dashboard/{tenant_id}/health
**Description:** Get dashboard health status
**Parameters:**
- `tenant_id` (path): Tenant ID (required)
**Request Body:** None

### GET /api/v1/dashboard/{tenant_id}/charts/device-breakdown
**Description:** Get device breakdown chart data
**Parameters:**
- `tenant_id` (path): Tenant ID (required)
**Request Body:** None

### GET /api/v1/dashboard/{tenant_id}/charts/open-rate-trend
**Description:** Get open rate trend chart data
**Parameters:**
- `tenant_id` (path): Tenant ID (required)
**Request Body:** None

### GET /api/v1/dashboard/{tenant_id}/email/{uuid}
**Description:** Get specific email details
**Parameters:**
- `tenant_id` (path): Tenant ID (required)
- `uuid` (path): Email UUID (required)
**Request Body:** None

---

## Telemetry

### GET /api/v1/telemetry/stats/{tenant_id}
**Description:** Get telemetry statistics
**Parameters:**
- `tenant_id` (path): Tenant ID (required)
**Request Body:** None
**Example Response:**
```json
{
  "emails_sent": 3,
  "unique_opens": 0,
  "total_opens": 0,
  "open_rate": 0.0,
  "avg_opens_per_email": 0.0,
  "unique_devices": 0,
  "device_breakdown": {},
  "multi_device_opens": 0,
  "last_updated": "2025-10-13T13:29:23.007794"
}
```

### GET /api/v1/telemetry/email/{uuid}/opens
**Description:** Get email open tracking data
**Parameters:**
- `uuid` (path): Email UUID (required)
**Request Body:** None

### GET /api/v1/telemetry/open/{uuid}.png
**Description:** Email open tracking pixel
**Parameters:**
- `uuid` (path): Email UUID (required)
**Request Body:** None
**Response:** PNG image (1x1 pixel)

---

## Activity Logs

### GET /api/v1/tenant-activity-logs/
**Description:** Get all activity logs
**Parameters:** None
**Request Body:** None

### GET /api/v1/tenant-activity-logs/{tenant_id}
**Description:** Get tenant activity logs
**Parameters:**
- `tenant_id` (path): Tenant ID (required)
**Request Body:** None
**Example Response:**
```json
[
  {
    "tenant_id": 23,
    "activity_type": "email_sent",
    "activity_data": {
      "action": "email_sent",
      "to": "recipient@example.com",
      "subject": "Email Subject",
      "status": "success",
      "error_message": null
    },
    "timestamp": "2025-10-13T13:22:15.755439Z",
    "ip_address": null,
    "user_agent": null,
    "id": 484,
    "created_at": "2025-10-13T13:22:15.755439Z"
  }
]
```

### GET /api/v1/tenant-activity-logs/stats/summary
**Description:** Get activity logs summary statistics
**Parameters:** None
**Request Body:** None

---

## Common Response Codes

- **200**: Success
- **201**: Created
- **400**: Bad Request
- **401**: Unauthorized
- **403**: Forbidden
- **404**: Not Found
- **422**: Validation Error
- **500**: Internal Server Error

## Authentication Header

All requests must include:
```
X-API-Key: your_api_key_here
```

## Required Headers for Specific Endpoints

### Endpoints requiring X-Tenant-ID header:
- `GET /api/v1/auth/user-info`
- `GET /api/v1/auth/tenant-info`

### Endpoints with tenant_id in path:
- All `/api/v1/dashboard/{tenant_id}/...` endpoints
- All `/api/v1/telemetry/stats/{tenant_id}` endpoints
- All `/api/v1/tenant-activity-logs/{tenant_id}` endpoints
- All `/api/v1/tenants/{tenant_id}/...` endpoints

## Base URL

```
https://lead-gen.robotice.io
```

**Note:** The API is now accessible via HTTPS with SSL certificate. HTTP requests will automatically redirect to HTTPS.

## HTTPS & SSL Configuration

### SSL Certificate
- **Domain**: lead-gen.robotice.io
- **Certificate Authority**: Let's Encrypt
- **Expiry**: 2026-01-11 (auto-renewal enabled)
- **Protocols**: TLS 1.2, TLS 1.3
- **HTTP/2**: Supported

### Security Features
- **HTTP to HTTPS Redirect**: Automatic redirection
- **HSTS**: HTTP Strict Transport Security enabled
- **CORS**: Cross-Origin Resource Sharing configured
- **API Key Authentication**: Required for most endpoints

### Testing SSL
```bash
# Test SSL certificate
openssl s_client -connect lead-gen.robotice.io:443 -servername lead-gen.robotice.io

# Test HTTPS endpoint
curl -I https://lead-gen.robotice.io/healthz
```

## Rate Limits

- No specific rate limits documented
- Standard HTTP status codes apply

## Migration from HTTP to HTTPS

### Frontend Configuration Update
Update your frontend API base URL from:
```javascript
// OLD
const API_BASE_URL = 'http://192.241.157.92:8000';

// NEW
const API_BASE_URL = 'https://lead-gen.robotice.io';
```

### Environment Variables
Update environment variables:
```bash
# OLD
NEXT_PUBLIC_API_BASE_URL=http://192.241.157.92:8000

# NEW
NEXT_PUBLIC_API_BASE_URL=https://lead-gen.robotice.io
```

## Known Issues

### Dashboard Stats Endpoint
- **Endpoint**: `GET /api/v1/dashboard/{tenant_id}/stats`
- **Issue**: Pydantic validation error with `device_breakdown` field
- **Error**: `Input should be a valid dictionary [type=dict_type, input_value=[], input_type=list]`
- **Status**: Data validation issue, not HTTPS connectivity issue
- **Workaround**: Use `GET /api/v1/dashboard/{tenant_id}/health` for health checks

## API Status & Monitoring

### Health Endpoints
- **System Health**: `GET /healthz` - Returns `{"status":"ok"}`
- **Dashboard Health**: `GET /api/v1/dashboard/{tenant_id}/health` - Returns tenant-specific health status

### SSL Certificate Monitoring
- **Certificate Expiry**: 2026-01-11
- **Auto-renewal**: Enabled via Certbot
- **Monitoring**: Check certificate status with `certbot certificates`

## Quick Reference

### Base URL
```
https://lead-gen.robotice.io
```

### Authentication Headers
```bash
# For most endpoints
X-API-Key: your_api_key_here
X-Tenant-ID: your_tenant_id

# For login endpoint (no headers required)
# Just send email/password in request body
```

### Common Endpoints
- **Health Check**: `GET /healthz`
- **API Documentation**: `GET /docs`
- **Login**: `POST /api/v1/auth/login` (no API key required)
- **User Info**: `GET /api/v1/auth/user-info`
- **Tenant Info**: `GET /api/v1/auth/tenant-info`
- **Send Email**: `POST /api/v1/email/send`
- **Dashboard Health**: `GET /api/v1/dashboard/{tenant_id}/health`

### Test Commands
```bash
# Test HTTPS endpoint (login - no API key required)
curl -X POST "https://lead-gen.robotice.io/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"yourpassword"}'

# Test API key endpoint
curl -X GET "https://lead-gen.robotice.io/api/v1/auth/user-info" \
  -H "X-API-Key: your_api_key" \
  -H "X-Tenant-ID: your_tenant_id"
```

---

## Frontend Implementation Notes

### Current Implementation Status (2025-10-14)

**Architecture Pattern:** Direct client-to-backend HTTPS calls (temporary debugging mode)

**Environment Variables:**
- `NEXT_PUBLIC_API_BASE_URL`: https://lead-gen.robotice.io
- `NEXT_PUBLIC_API_KEY`: ⚠️ Exposed for debugging (temporary)

**Files Modified:**
- `lib/api.ts`: Direct backend calls with X-API-Key injection
- `lib/auth-client.ts`: buildHeaders() helper, login() no longer requires API key

**Health Check Endpoint:**
- Frontend: `/api/health/backend` (Next.js route)
- Backend: `/healthz` (actual health check)

**Security Status:** 
- ✅ HTTPS enabled on backend (Mixed Content resolved)
- ⚠️ API key temporarily exposed client-side for debugging
- ⚠️ Login endpoint no longer requires API key per backend specification
- Plan: Revert to secure server-side proxy pattern once connectivity confirmed
