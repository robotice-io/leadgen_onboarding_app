# Environment Setup Guide

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://192.241.157.92:8000
API_KEY=lk_ad23ea53ecf1a7937b66d9a18fe30848056fc88a97eea7f7a2a7b1d9a1cc1175

# State signing key for OAuth (generate a secure random key for production)
STATE_SIGNING_KEY=your-secure-random-key-here-change-in-production
```

## Environment Variables Explained

### `NEXT_PUBLIC_API_KEY`
- **Purpose**: Authentication key for telemetry endpoints only
- **Value**: `lk_ad23ea53ecf1a7937b66d9a18fe30848056fc88a97eea7f7a2a7b1d9a1cc1175`
- **Usage**: Only added to `/telemetry/*` endpoints as `X-API-Key` header
- **Security**: Keep this key secure and never commit it to version control

### `NEXT_PUBLIC_API_BASE_URL`
- **Purpose**: Base URL for the backend API
- **Value**: `http://192.241.157.92:8000`
- **Usage**: Used for direct API calls and proxy configuration

### `STATE_SIGNING_KEY`
- **Purpose**: HMAC signing key for OAuth state validation
- **Value**: Generate a secure random string (32+ characters)
- **Usage**: Used to sign OAuth state parameters for security

## Setup Instructions

1. **Create the environment file:**
   ```bash
   # In the project root directory
   touch .env.local
   ```

2. **Add the environment variables:**
   Copy the content above into your `.env.local` file

3. **Generate a secure STATE_SIGNING_KEY:**
   ```bash
   # Using Node.js
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   
   # Or using OpenSSL
   openssl rand -hex 32
   ```

4. **Restart your development server:**
   ```bash
   npm run dev
   ```

## Security Notes

- ✅ The API key is automatically included in all requests
- ✅ Environment variables are not exposed to the client-side
- ✅ The bridge proxy properly forwards the API key
- ⚠️ Never commit `.env.local` to version control
- ⚠️ Use different keys for development and production

## API Key Implementation

The API key is automatically added to all requests in the following ways:

1. **Client-side requests** (via `lib/api.ts`):
   - `apiGet()` and `apiPost()` functions automatically include `X-API-Key` header

2. **Server-side proxy** (via `app/api/bridge/[...path]/route.ts`):
   - Bridge API route forwards the API key to the backend

3. **Environment fallback**:
   - If `API_KEY` environment variable is not set, uses the default key
   - This ensures the application works even without proper environment setup

## Testing the Setup

After setting up the environment variables, you can test that the API key is being sent correctly by:

1. Starting the development server
2. Opening browser developer tools
3. Making a request through the application
4. Checking the Network tab to verify the `X-API-Key` header is present


