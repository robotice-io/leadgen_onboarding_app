# 🚀 Robotice LeadGen - Implementation Guide

## ✅ What's Been Implemented

### **Phase 1: UI Components & Authentication (COMPLETED)**

#### **1. Reusable UI Components** (`components/ui/`)
- ✅ `Button.tsx` - Primary, secondary, outline variants with loading states
- ✅ `Input.tsx` - Form inputs with labels, errors, and helper text
- ✅ `Card.tsx` - Card container with Header, Body, Footer sections
- ✅ `Toast.tsx` - Toast notifications (success/error/info)
- ✅ `Skeleton.tsx` - Loading skeletons for better UX

**Features:**
- Consistent with existing wizard design
- Dark mode support
- Fully typed with TypeScript
- Accessible (ARIA labels, keyboard navigation)

#### **2. Authentication System**

**Pages Created:**
- ✅ `/login` - User login with email/password
- ✅ `/register` - New user registration
- ✅ `/verify-email` - Email verification notice
- ✅ `/forgot-password` - Password reset request

**Auth Utilities** (`lib/auth-client.ts`):
- ✅ `login()` - Authenticate user, store JWT token
- ✅ `register()` - Create new account
- ✅ `logout()` - Clear session and redirect
- ✅ `getToken()` - Retrieve stored auth token
- ✅ `isAuthenticated()` - Check if user is logged in

**Features:**
- JWT token storage in localStorage
- Automatic token injection in API calls
- Form validation
- Error handling with user-friendly messages
- Loading states
- Toast notifications

#### **3. Route Protection** (`middleware.ts`)
- ✅ Protects `/onboarding` and `/dashboard` routes
- ✅ Redirects unauthenticated users to `/login`
- ✅ Redirects authenticated users away from auth pages
- ✅ Preserves redirect URL after login

#### **4. API Integration Updates** (`lib/api.ts`)
- ✅ Auto-inject JWT token in `Authorization` header
- ✅ Maintains existing API key functionality
- ✅ Works with existing proxy pattern

---

## 📦 Dependencies Added

```json
{
  "@tanstack/react-query": "^5.62.14",  // Data fetching & caching
  "recharts": "^2.15.0",                 // Charts for dashboard
  "date-fns": "^4.1.0",                  // Date formatting
  "zod": "^3.24.1"                       // Schema validation
}
```

---

## 🎯 Next Steps

### **Phase 2: Dashboard (TO DO)**

#### **1. Dashboard Layout**
Create `app/(dashboard)/layout.tsx`:
- Sidebar navigation
- Header with user menu
- Logout functionality
- Tenant switcher (if multi-tenant)

#### **2. Main Dashboard Page**
Create `app/(dashboard)/dashboard/[tenantSlug]/page.tsx`:
- Metrics cards (emails sent, open rate, etc.)
- Charts (line, pie, bar)
- Recent emails table
- Real-time polling with React Query

#### **3. Email Analytics Page**
Create `app/(dashboard)/dashboard/[tenantSlug]/email/[uuid]/page.tsx`:
- Email details
- Open timeline
- Device breakdown
- Engagement metrics

#### **4. Dashboard Components**
Create `components/dashboard/`:
- `MetricsCard.tsx` - Display key metrics
- `EmailTable.tsx` - List of emails with sorting/filtering
- `LineChart.tsx` - Open rate trends
- `PieChart.tsx` - Device breakdown
- `Sidebar.tsx` - Navigation menu
- `Header.tsx` - Top bar with user info

---

## 🔧 Configuration

### **Environment Variables**

Update `.env.local`:
```bash
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://192.241.157.92:8000
API_KEY=lk_ad23ea53ecf1a7937b66d9a18fe30848056fc88a97eea7f7a2a7b1d9a1cc1175

# OAuth State Signing
STATE_SIGNING_KEY=<your-existing-key>
```

### **Backend API Endpoints Required**

Your backend should have these endpoints:

**Authentication:**
- `POST /api/v1/auth/register` - Create user account
- `POST /api/v1/auth/login` - Authenticate user (returns JWT)
- `POST /api/v1/auth/verify-email` - Verify email with token
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password` - Reset password with token

**Dashboard (Already Implemented):**
- `GET /api/v1/dashboard/{tenant_id}/stats` - Full dashboard stats
- `GET /api/v1/dashboard/{tenant_id}/quick-stats` - Real-time stats
- `GET /api/v1/dashboard/{tenant_id}/recent-emails` - Recent emails
- `GET /api/v1/dashboard/{tenant_id}/email/{uuid}` - Email analytics

---

## 🎨 Design System

### **Colors**
- Primary: `#3B82F6` (blue-600)
- Success: `#10B981` (green-600)
- Error: `#EF4444` (red-600)
- Background: Gradient with subtle blue tint

### **Typography**
- Font: Poppins (400, 500, 600, 700)
- Headings: font-semibold
- Body: font-normal

### **Components**
All components follow the existing wizard design:
- Rounded corners (`rounded-md`, `rounded-xl`)
- Backdrop blur effects
- Dark mode support
- Consistent spacing (p-6, gap-4)

---

## 🔄 User Flow

### **New User Journey**
```
1. Landing page (/)
   ↓
2. Click "Empezar" → Register (/register)
   ↓
3. Fill form → Submit
   ↓
4. Email verification notice (/verify-email)
   ↓
5. Click link in email → Verify account
   ↓
6. Login (/login)
   ↓
7. Onboarding wizard (/onboarding) - EXISTING
   ↓
8. Complete wizard → OAuth flow - EXISTING
   ↓
9. Dashboard (/dashboard/[tenantSlug]) - TO BUILD
```

### **Returning User Journey**
```
1. Login (/login)
   ↓
2. Dashboard (/dashboard/[tenantSlug])
```

---

## 🧪 Testing Checklist

### **Authentication**
- [ ] User can register with email/password
- [ ] Validation works (password length, matching passwords)
- [ ] User can login with credentials
- [ ] Invalid credentials show error
- [ ] "Remember me" persists session
- [ ] Logout clears session
- [ ] Protected routes redirect to login
- [ ] Authenticated users can't access auth pages

### **UI Components**
- [ ] Buttons show loading state
- [ ] Inputs display errors correctly
- [ ] Toast notifications auto-dismiss
- [ ] Dark mode works on all pages
- [ ] Mobile responsive

---

## 📝 Code Examples

### **Using Auth in Components**

```typescript
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getUser, logout } from "@/lib/auth-client";

export default function ProtectedPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }
    setUser(getUser());
  }, [router]);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h1>Welcome, {user.email}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### **Using API with Auth**

```typescript
import { apiGet, apiPost } from "@/lib/api";

// GET request (token auto-injected)
const response = await apiGet("/api/v1/dashboard/21/stats");
const data = await response.json();

// POST request (token auto-injected)
const response = await apiPost("/api/v1/tenants/", {
  name: "My Company",
  email: "contact@company.com"
});
```

### **Using React Query for Polling**

```typescript
"use client";

import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";

export function DashboardStats({ tenantId }: { tenantId: number }) {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-stats", tenantId],
    queryFn: async () => {
      const res = await apiGet(`/api/v1/dashboard/${tenantId}/quick-stats`);
      return res.json();
    },
    refetchInterval: 15000, // Poll every 15 seconds
  });

  if (isLoading) return <Skeleton />;

  return (
    <div>
      <p>Emails Sent: {data.emails_sent_today}</p>
      <p>Open Rate: {(data.open_rate_today * 100).toFixed(1)}%</p>
    </div>
  );
}
```

---

## 🚨 Important Notes

### **Security**
1. **JWT Storage**: Currently using localStorage. For production, consider httpOnly cookies.
2. **Token Refresh**: Implement token refresh logic before expiry.
3. **HTTPS**: Always use HTTPS in production.
4. **CORS**: Backend CORS is configured for Vercel domains.

### **Backend Integration**
1. **Auth Endpoints**: Need to be implemented in your FastAPI backend.
2. **JWT Format**: Backend should return `{ access_token: string, user: {...} }`.
3. **Token Validation**: Backend should validate JWT on protected endpoints.

### **Existing Code**
1. **Wizard**: Moved to `/onboarding` (protected route).
2. **OAuth Flow**: Unchanged, works after authentication.
3. **API Calls**: Updated to include auth token.

---

## 🎯 Quick Start

### **1. Install Dependencies**
```bash
npm install
```

### **2. Run Development Server**
```bash
npm run dev
```

### **3. Test Auth Flow**
1. Go to `http://localhost:3000/register`
2. Create an account
3. Login at `http://localhost:3000/login`
4. You'll be redirected to `/onboarding`

### **4. Build Dashboard (Next Phase)**
Follow the "Phase 2: Dashboard" section above.

---

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Verify backend API is running
3. Check environment variables are set
4. Ensure dependencies are installed

---

**Status**: Phase 1 Complete ✅  
**Next**: Build Dashboard Components  
**Timeline**: 1-2 weeks for full dashboard implementation
