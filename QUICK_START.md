# 🚀 Quick Start Guide - Fix "Failed to Fetch" Error

## ⚡ **Immediate Action Required**

### **Step 1: Create `.env.local` File**

In the root directory of your project, create a file named `.env.local` and add:

```env
NEXT_PUBLIC_API_BASE_URL=http://192.241.157.92:8000
NEXT_PUBLIC_API_KEY=lk_ad23ea53ecf1a7937b66d9a18fe30848056fc88a97eea7f7a2a7b1d9a1cc1175
```

### **Step 2: Restart Your Dev Server**

```bash
npm run dev
```

### **Step 3: Test Login**

Go to `http://localhost:3000/login` and use:
- **Email:** `jose@robotice.io`
- **Password:** `Robotice.2025`

## 🌐 **For Vercel Deployment**

1. Go to your Vercel project settings
2. Add these environment variables:
   - `NEXT_PUBLIC_API_BASE_URL` = `http://192.241.157.92:8000`
   - `NEXT_PUBLIC_API_KEY` = `lk_ad23ea53ecf1a7937b66d9a18fe30848056fc88a97eea7f7a2a7b1d9a1cc1175`
3. Redeploy

## ✅ **That's It!**

Your "Failed to fetch" error should now be resolved. The application will:
- ✅ Authenticate users correctly
- ✅ Load dashboard data
- ✅ Display real-time analytics
- ✅ Work on any Vercel preview URL

## 🧪 **Available Test Accounts**

| Email | Password | Tenant ID |
|-------|----------|-----------|
| jose@robotice.io | Robotice.2025 | 21 |
| manuel.z@robotice.io | Robotice.2025 | 22 |
| marjana.z@robotice.io | Robotice.2025 | 23 |
| benja@arch.finance | Robotice.2025 | 26 |
| emma.s@devups.io | Robotice.2025 | 24 |

## 📚 **More Information**

- See `ENV_SETUP.md` for detailed environment variable setup
- See `API_INTEGRATION_COMPLETE.md` for technical details on what was fixed
