# 🔧 Environment Variables Setup

## ⚠️ **REQUIRED: Create `.env.local` File**

You need to manually create a `.env.local` file in the root directory of the project with the following content:

```env
NEXT_PUBLIC_API_BASE_URL=http://192.241.157.92:8000
NEXT_PUBLIC_API_KEY=lk_ad23ea53ecf1a7937b66d9a18fe30848056fc88a97eea7f7a2a7b1d9a1cc1175
```

## 📝 **Step-by-Step Instructions:**

### **1. Create the file:**
In the root directory (`leadgen_onboarding_app-main/`), create a new file named `.env.local`

### **2. Add the environment variables:**
Copy and paste the following into the `.env.local` file:

```env
NEXT_PUBLIC_API_BASE_URL=http://192.241.157.92:8000
NEXT_PUBLIC_API_KEY=lk_ad23ea53ecf1a7937b66d9a18fe30848056fc88a97eea7f7a2a7b1d9a1cc1175
```

### **3. Restart your development server:**
If you're running the app locally, restart it:
```bash
npm run dev
```

## 🚀 **For Vercel Deployment:**

Add these environment variables in your Vercel project settings:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

| Variable Name | Value |
|---------------|-------|
| `NEXT_PUBLIC_API_BASE_URL` | `http://192.241.157.92:8000` |
| `NEXT_PUBLIC_API_KEY` | `lk_ad23ea53ecf1a7937b66d9a18fe30848056fc88a97eea7f7a2a7b1d9a1cc1175` |

4. Redeploy your application

## ✅ **What These Variables Do:**

- **`NEXT_PUBLIC_API_BASE_URL`**: The base URL for the backend API server
- **`NEXT_PUBLIC_API_KEY`**: The API key required for telemetry endpoints (NOT required for auth or dashboard endpoints)

## 🔐 **API Key Usage:**

According to the backend configuration:

- ✅ **Authentication endpoints** (`/auth/*`) - NO API key required
- ✅ **Dashboard endpoints** (`/dashboard/*`) - NO API key required (JWT only)
- ⚠️ **Telemetry endpoints** (`/telemetry/*`) - API key required

## 🧪 **Test Credentials:**

After setting up the environment variables, you can test the login with:

| Email | Password | Tenant ID |
|-------|----------|-----------|
| jose@robotice.io | Robotice.2025 | 21 |
| manuel.z@robotice.io | Robotice.2025 | 22 |
| marjana.z@robotice.io | Robotice.2025 | 23 |
| benja@arch.finance | Robotice.2025 | 26 |
| emma.s@devups.io | Robotice.2025 | 24 |

## 🎉 **Ready to Go!**

Once you've created the `.env.local` file with the correct values, your application should be able to:
- ✅ Authenticate users successfully
- ✅ Access dashboard data with JWT tokens
- ✅ Fetch telemetry data with API key + JWT
- ✅ Work with any Vercel preview URL (dynamic CORS enabled on backend)
