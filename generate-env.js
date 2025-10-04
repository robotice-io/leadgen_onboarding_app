#!/usr/bin/env node

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Generate a secure random key for state signing
const stateSigningKey = crypto.randomBytes(32).toString('hex');

const envContent = `# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://192.241.157.92:8000
API_KEY=lk_ad23ea53ecf1a7937b66d9a18fe30848056fc88a97eea7f7a2a7b1d9a1cc1175

# State signing key for OAuth (auto-generated secure key)
STATE_SIGNING_KEY=${stateSigningKey}
`;

const envPath = path.join(__dirname, '.env.local');

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Environment file created successfully!');
  console.log(`📁 Location: ${envPath}`);
  console.log('🔑 Generated secure STATE_SIGNING_KEY');
  console.log('\n📋 Next steps:');
  console.log('1. Review the .env.local file');
  console.log('2. Restart your development server: npm run dev');
  console.log('3. The API key will be automatically included in all requests');
} catch (error) {
  console.error('❌ Error creating environment file:', error.message);
  console.log('\n📝 Manual setup:');
  console.log('Create a .env.local file with the following content:');
  console.log('\n' + envContent);
}
