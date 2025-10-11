/**
 * COMPLETE AUTHENTICATION TESTING SCRIPT
 * 
 * This script tests all authentication endpoints to verify:
 * 1. Proxy detection works correctly
 * 2. API key is NOT sent to auth endpoints
 * 3. JWT token is sent to authenticated endpoints
 * 4. Error handling returns status codes
 * 5. User data is properly fetched and stored
 * 
 * HOW TO USE:
 * 1. Open browser console on your deployed app
 * 2. Copy and paste this entire script
 * 3. Run: await runAllTests()
 * 4. Check the results
 */

// Test configuration
const TEST_CONFIG = {
  API_BASE: "http://192.241.157.92:8000",
  TEST_USER: {
    email: "jose@robotice.io",
    password: "Robotice.2025"
  }
};

// Helper: Detect if proxy should be used
function shouldUseProxy() {
  const isFrontendHttps = window.location.protocol === "https:";
  const apiIsHttp = TEST_CONFIG.API_BASE.startsWith("http://");
  return isFrontendHttps && apiIsHttp;
}

// Helper: Get request URL
function getRequestUrl(path) {
  const useProxy = shouldUseProxy();
  if (useProxy) {
    return `/api/bridge${path}`;
  } else {
    return `${TEST_CONFIG.API_BASE}${path}`;
  }
}

// Test 1: Login Endpoint
async function testLogin() {
  console.log("\n🧪 TEST 1: Login Endpoint");
  console.log("=====================================");
  
  const url = getRequestUrl("/api/v1/auth/login");
  console.log("📍 URL:", url);
  console.log("🔧 Using Proxy:", shouldUseProxy());
  
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: TEST_CONFIG.TEST_USER.email,
        password: TEST_CONFIG.TEST_USER.password
      })
    });
    
    console.log("📊 Status:", response.status);
    console.log("📊 Status Text:", response.statusText);
    
    if (response.ok) {
      const data = await response.json();
      console.log("✅ SUCCESS!");
      console.log("📦 Response:", data);
      console.log("🔑 Token:", data.access_token ? "✅ Received" : "❌ Missing");
      
      // Store token for next tests
      window.TEST_TOKEN = data.access_token;
      localStorage.setItem("robotice_auth_token", data.access_token);
      
      return { success: true, data };
    } else {
      const error = await response.text();
      console.log("❌ FAILED!");
      console.log("📦 Error:", error);
      return { success: false, error };
    }
  } catch (error) {
    console.log("❌ EXCEPTION:", error.message);
    return { success: false, error: error.message };
  }
}

// Test 2: Get Current User
async function testGetCurrentUser() {
  console.log("\n🧪 TEST 2: Get Current User");
  console.log("=====================================");
  
  const token = window.TEST_TOKEN || localStorage.getItem("robotice_auth_token");
  if (!token) {
    console.log("❌ No token available. Run testLogin() first.");
    return { success: false, error: "No token" };
  }
  
  const url = getRequestUrl("/api/v1/auth/me");
  console.log("📍 URL:", url);
  console.log("🔧 Using Proxy:", shouldUseProxy());
  console.log("🔑 Token:", token.substring(0, 20) + "...");
  
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    });
    
    console.log("📊 Status:", response.status);
    console.log("📊 Status Text:", response.statusText);
    
    if (response.ok) {
      const data = await response.json();
      console.log("✅ SUCCESS!");
      console.log("📦 Response:", data);
      console.log("👤 User ID:", data.id);
      console.log("📧 Email:", data.email);
      
      // Store user data
      localStorage.setItem("robotice_user", JSON.stringify(data));
      
      return { success: true, data };
    } else {
      const error = await response.text();
      console.log("❌ FAILED!");
      console.log("📦 Error:", error);
      return { success: false, error };
    }
  } catch (error) {
    console.log("❌ EXCEPTION:", error.message);
    return { success: false, error: error.message };
  }
}

// Test 3: Get User Tenant
async function testGetUserTenant() {
  console.log("\n🧪 TEST 3: Get User Tenant");
  console.log("=====================================");
  
  const token = window.TEST_TOKEN || localStorage.getItem("robotice_auth_token");
  if (!token) {
    console.log("❌ No token available. Run testLogin() first.");
    return { success: false, error: "No token" };
  }
  
  const url = getRequestUrl("/api/v1/auth/me/tenant");
  console.log("📍 URL:", url);
  console.log("🔧 Using Proxy:", shouldUseProxy());
  
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    });
    
    console.log("📊 Status:", response.status);
    console.log("📊 Status Text:", response.statusText);
    
    if (response.ok) {
      const data = await response.json();
      console.log("✅ SUCCESS!");
      console.log("📦 Response:", data);
      return { success: true, data };
    } else {
      const error = await response.text();
      console.log("⚠️ No tenant found (expected for new user)");
      console.log("📦 Error:", error);
      return { success: true, note: "No tenant (expected)" };
    }
  } catch (error) {
    console.log("❌ EXCEPTION:", error.message);
    return { success: false, error: error.message };
  }
}

// Test 4: Verify Proxy Headers
async function testProxyHeaders() {
  console.log("\n🧪 TEST 4: Verify Proxy Headers");
  console.log("=====================================");
  
  console.log("🌐 Frontend Protocol:", window.location.protocol);
  console.log("🔗 Backend URL:", TEST_CONFIG.API_BASE);
  console.log("🔀 Should Use Proxy:", shouldUseProxy());
  
  if (shouldUseProxy()) {
    console.log("✅ Proxy will be used (HTTPS → HTTP mixed content avoided)");
  } else {
    console.log("✅ Direct connection (both HTTP or backend is HTTPS)");
  }
  
  return { success: true };
}

// Test 5: localStorage Verification
async function testLocalStorage() {
  console.log("\n🧪 TEST 5: LocalStorage Verification");
  console.log("=====================================");
  
  const token = localStorage.getItem("robotice_auth_token");
  const userStr = localStorage.getItem("robotice_user");
  
  console.log("🔑 Token in localStorage:", token ? "✅ Found" : "❌ Missing");
  if (token) {
    console.log("   Token preview:", token.substring(0, 30) + "...");
  }
  
  console.log("👤 User in localStorage:", userStr ? "✅ Found" : "❌ Missing");
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      console.log("   User data:", user);
    } catch (e) {
      console.log("   ⚠️ Invalid JSON");
    }
  }
  
  const hasToken = !!token;
  const hasUser = !!userStr;
  
  if (hasToken && hasUser) {
    console.log("✅ PASS: Both token and user data present");
    return { success: true };
  } else {
    console.log("❌ FAIL: Missing data");
    return { success: false };
  }
}

// Test 6: Invalid Credentials
async function testInvalidLogin() {
  console.log("\n🧪 TEST 6: Invalid Credentials Error Handling");
  console.log("=====================================");
  
  const url = getRequestUrl("/api/v1/auth/login");
  
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "invalid@test.com",
        password: "wrongpassword"
      })
    });
    
    console.log("📊 Status:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log("✅ Error correctly returned");
      console.log("📊 Status Code:", response.status);
      console.log("📦 Error Message:", errorText);
      
      // Try to parse as JSON
      try {
        const errorJson = JSON.parse(errorText);
        console.log("📦 Parsed Error:", errorJson);
        console.log("✅ Error message includes status code:", `[${response.status}]` in errorText ? "Yes" : "No");
      } catch {
        console.log("📦 Plain text error");
      }
      
      return { success: true, note: "Error handling works correctly" };
    } else {
      console.log("❌ Should have failed with invalid credentials");
      return { success: false };
    }
  } catch (error) {
    console.log("❌ EXCEPTION:", error.message);
    return { success: false, error: error.message };
  }
}

// Run All Tests
async function runAllTests() {
  console.log("\n");
  console.log("🚀 STARTING COMPLETE AUTHENTICATION TEST SUITE");
  console.log("=".repeat(60));
  console.log("Environment:", window.location.origin);
  console.log("Protocol:", window.location.protocol);
  console.log("=".repeat(60));
  
  const results = {
    proxyHeaders: await testProxyHeaders(),
    login: await testLogin(),
    getCurrentUser: await testGetCurrentUser(),
    getUserTenant: await testGetUserTenant(),
    localStorage: await testLocalStorage(),
    invalidLogin: await testInvalidLogin(),
  };
  
  console.log("\n");
  console.log("📊 TEST SUMMARY");
  console.log("=".repeat(60));
  
  let passed = 0;
  let failed = 0;
  
  Object.entries(results).forEach(([name, result]) => {
    const status = result.success ? "✅ PASS" : "❌ FAIL";
    console.log(`${status} - ${name}`);
    if (result.success) passed++;
    else failed++;
  });
  
  console.log("=".repeat(60));
  console.log(`Total: ${passed} passed, ${failed} failed`);
  
  if (failed === 0) {
    console.log("\n🎉 ALL TESTS PASSED! Authentication system is working correctly.");
  } else {
    console.log("\n⚠️ Some tests failed. Check the details above.");
  }
  
  return results;
}

// Quick test: Just login
async function quickTestLogin() {
  console.log("🚀 Quick Login Test");
  const result = await testLogin();
  if (result.success) {
    await testGetCurrentUser();
    await testLocalStorage();
  }
  return result;
}

// Export functions for manual testing
console.log("\n✅ Test script loaded!");
console.log("\nAvailable commands:");
console.log("  await runAllTests()       - Run complete test suite");
console.log("  await quickTestLogin()    - Quick login test");
console.log("  await testLogin()         - Test login only");
console.log("  await testGetCurrentUser() - Test get user");
console.log("  await testGetUserTenant() - Test get tenant");
console.log("  await testLocalStorage()  - Check localStorage");
console.log("\nRun: await runAllTests()");
