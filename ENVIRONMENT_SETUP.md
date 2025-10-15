# 🔒 Environment Variables Setup

## **⚠️ TEMPORARY DEBUGGING MODE**
This configuration exposes the API key to the client for debugging purposes only. This is a temporary measure to isolate connectivity issues.

## **Security Notice**
**IMPORTANT**: The current configuration exposes the API key in the browser. This should be reverted to server-side only after debugging is complete.

## **Setup Instructions**

### **1. Create Environment File**
Copy the example file and create your local environment configuration:

```bash
cp env.example .env.local
```

### **2. Configure Your Environment Variables**
Edit `.env.local` with your actual values:

```env
# Backend API Configuration
NEXT_PUBLIC_API_BASE_URL=https://lead-gen-service.robotice.io

# API Key - TEMPORARY: exposed to client for debugging
NEXT_PUBLIC_API_KEY=your-actual-api-key-here

# App Configuration
NEXT_PUBLIC_APP_BASE_URL=http://localhost:3000

# OAuth Configuration (if needed)
STATE_SIGNING_KEY=your-state-signing-key-here

# Development/Production flags
NODE_ENV=development
```

### **3. Security Best Practices**

#### **✅ DO:**
- Use environment variables for all sensitive data
- Keep `.env.local` in `.gitignore` (already configured)
- Use different API keys for development/production
- Rotate API keys regularly

#### **❌ DON'T:**
- Hardcode API keys in source code
- Commit `.env.local` to version control
- Share API keys in chat/email
- Use production keys in development

### **4. Production Deployment**

For production deployments (Vercel, Netlify, etc.), set environment variables in your hosting platform's dashboard:

- **Vercel**: Project Settings → Environment Variables
- **Netlify**: Site Settings → Environment Variables
- **Railway**: Project → Variables

### **5. Verification**

After setting up environment variables, restart your development server:

```bash
npm run dev
```

The application should work without any hardcoded API keys.

## **🔍 Troubleshooting**

### **Error: "API key not configured"**
- Ensure `.env.local` exists and contains `API_KEY` (server-side only)
- Restart your development server after adding environment variables
- Check that the environment variable name is exactly `API_KEY` (without NEXT_PUBLIC_)

### **Error: "Environment variable not found"**
- Verify the variable name matches exactly (case-sensitive)
- Ensure the variable starts with `NEXT_PUBLIC_` for client-side access
- Check that `.env.local` is in the project root directory

## **📝 Environment Variable Reference**

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API base URL | Yes | `https://lead-gen-service.robotice.io` |
| `API_KEY` | API authentication key (server-side only) | Yes | `lk_...` |
| `NEXT_PUBLIC_APP_BASE_URL` | Frontend app base URL | No | `http://localhost:3000` |
| `STATE_SIGNING_KEY` | OAuth state signing key | No | `random-string` |
| `NODE_ENV` | Environment mode | No | `development` |

---

**Remember: Security is everyone's responsibility! 🔐**