# 🔍 20 CRITICAL QUESTIONS: Backend-Frontend Communication Analysis

## 🎯 **Purpose**

These 20 questions will help identify any remaining conflicts between backend and frontend, ensure proper API consumption, and verify all integration points work correctly.

---

## 📡 **1. Authentication & Token Management**

### **Q1: Login Response Format**
**What is the exact JSON response format for `/api/v1/auth/login`?**
- Does it include: `access_token`, `token_type`, `expires_in`, `refresh_token`?
- Is the response `{ "access_token": "string", "token_type": "bearer" }` or different?
- Should it include user data, or is that fetched separately?

### **Q2: JWT Token Expiration**
**How does token expiration work?**
- What is the default `expires_in` value?
- Should the frontend implement token refresh logic?
- Are there endpoints for token refresh (`/auth/refresh`)?

### **Q3: User Data After Login**
**Should `/api/v1/auth/login` return user data, or is `/api/v1/auth/me` the only source?**
- Current frontend expects: `{ id, email, created_at, tenant_id? }`
- Should login response include user data for immediate use?

---

## 🔐 **2. API Key & Security**

### **Q4: API Key Usage Policy**
**Which endpoints require the X-API-Key header?**
- Current frontend sends API key ONLY to `/telemetry/*` endpoints
- Should `/dashboard/*` endpoints require API key?
- Should `/auth/*` endpoints require API key?

### **Q5: API Key Value**
**What is the correct API key value for the frontend?**
- Current frontend uses: `lk_ad23ea53ecf1a7937b66d9a18fe30848056fc88a97eea7f7a2a7b1d9a1cc1175`
- Is this the correct key for all environments?

### **Q6: API Key Header Format**
**What is the exact header format for API key?**
- Current frontend sends: `X-API-Key: <key>`
- Is this the correct header name?

---

## 📡 **3. Request/Response Patterns**

### **Q7: Content-Type Headers**
**What Content-Type headers should the frontend send?**
- Current frontend sends: `"Content-Type": "application/json"`
- Should this be different for certain endpoints?

### **Q8: Accept Headers**
**What Accept headers should the frontend send?**
- Current frontend sends: `"Accept": "application/json"`
- Should this include version info or other requirements?

### **Q9: CORS Configuration**
**What CORS headers does the backend send?**
- Does the backend allow requests from Vercel domains?
- What origins are permitted?

### **Q10: Response Status Codes**
**What HTTP status codes should each endpoint return?**
- 200: Success
- 401: Unauthorized (invalid token)
- 404: Not found
- 422: Validation error
- 500: Server error

---

## 👤 **4. User Data & Profile**

### **Q11: User Object Structure**
**What fields are included in the user object from `/api/v1/auth/me`?**
- Current frontend expects: `{ id, email, created_at, tenant_id? }`
- Are there additional fields like: `first_name`, `last_name`, `avatar`, `role`?

### **Q12: Tenant Data Structure**
**What fields are included in the tenant object from `/api/v1/auth/me/tenant`?**
- Current frontend expects: `{ tenant_id, tenant_name?, created_at? }`
- Should this include: `plan_type`, `features`, `limits`?

### **Q13: User Registration Fields**
**What fields does `/api/v1/auth/register` accept?**
- Current frontend sends: `{ email, password, first_name, last_name }`
- Should it include: `company_name`, `phone`, `terms_accepted`?

---

## 🔄 **5. Error Handling & Edge Cases**

### **Q14: Error Response Format**
**What is the exact format of error responses?**
- Current frontend expects JSON: `{ "detail": "error message" }` or `{ "message": "error" }`
- Should errors be plain text or JSON?
- Should they include error codes?

### **Q15: Validation Error Format**
**How are validation errors structured for `/api/v1/auth/register`?**
- Should it return field-specific errors?
- Format: `{ "email": ["Already exists"], "password": ["Too short"] }`?

### **Q16: Authentication Error Codes**
**What specific error messages/codes should be returned?**
- Invalid email: "User not found" or "Email not registered"?
- Invalid password: "Invalid password" or "Could not validate credentials"?

---

## 🌐 **6. Environment & Deployment**

### **Q17: Environment Variables**
**What environment variables should the backend support?**
- `NEXT_PUBLIC_API_BASE_URL` - Current frontend uses this
- `API_KEY` - For server-side API key access
- Should there be different URLs for dev/staging/prod?

### **Q18: HTTPS Configuration**
**Does the backend support HTTPS?**
- Current frontend detects mixed content and uses proxy
- Should the backend be configured for HTTPS in production?

### **Q19: Rate Limiting**
**Does the backend implement rate limiting?**
- Should the frontend handle 429 (Too Many Requests) responses?
- What are the rate limits for auth endpoints?

### **Q20: Logging & Monitoring**
**What logging does the backend provide?**
- Should the backend log API key usage?
- Should it log authentication attempts?
- Should it log errors with request IDs for debugging?

---

## 🔧 **Backend Agent Checklist**

**For the backend agent to verify:**

1. **Authentication Endpoints**
   - [ ] Login returns only token (no user data)
   - [ ] `/auth/me` returns user data with correct fields
   - [ ] `/auth/me/tenant` returns tenant data or appropriate error

2. **Security Headers**
   - [ ] API key required only for telemetry endpoints
   - [ ] JWT token required for authenticated endpoints
   - [ ] No API key on `/auth/*` endpoints

3. **Error Handling**
   - [ ] JSON error responses with `detail` or `message` fields
   - [ ] Appropriate HTTP status codes
   - [ ] Field validation errors for registration

4. **Data Structures**
   - [ ] User object includes all required fields
   - [ ] Tenant object includes required fields
   - [ ] Registration accepts correct field names

5. **Environment Support**
   - [ ] Supports CORS for Vercel domains
   - [ ] Environment-based configuration
   - [ ] Proper HTTPS setup for production

---

## 📋 **Frontend Expectations Summary**

**What the frontend currently expects from the backend:**

1. **Login:** `POST /api/v1/auth/login` → `{ access_token, token_type }`
2. **User Data:** `GET /api/v1/auth/me` → `{ id, email, created_at, tenant_id? }`
3. **Tenant Data:** `GET /api/v1/auth/me/tenant` → `{ tenant_id, tenant_name? }`
4. **Headers:** No API key on auth endpoints, JWT on authenticated endpoints
5. **Errors:** JSON with status codes, fallback to text
6. **CORS:** Allow requests from frontend origin

**Any deviations from these expectations will cause integration issues.**

---

## 🚨 **Critical Issues to Resolve**

1. **User Data in Login Response** - Should login include user data or not?
2. **API Key Requirements** - Confirm exactly which endpoints need API keys
3. **Error Message Format** - JSON structure for errors
4. **CORS Origins** - Ensure frontend domains are allowed
5. **Environment URLs** - Confirm API base URLs for all environments

**Once these are clarified, all integration conflicts should be resolved!**
