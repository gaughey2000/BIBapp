// server/src/config/env.js
import 'dotenv/config';

const required = (name) => {
  const v = process.env[name];
  if (!v) throw new Error(`[ENV] Missing required env: ${name}`);
  return v;
};

const isProd = process.env.NODE_ENV === 'production';

// Validate environment on startup
function validateEnv() {
  const criticalVars = ['JWT_SECRET'];
  const missing = criticalVars.filter(key => !process.env[key]);
  
  if (missing.length > 0 && isProd) {
    console.error('❌ Missing critical environment variables in production:');
    missing.forEach(key => console.error(`   - ${key}`));
    process.exit(1);
  }
  
  // Warnings for missing but non-critical vars
  const warnings = [];
  if (!process.env.DATABASE_URL) warnings.push('DATABASE_URL');
  if (!process.env.CLIENT_URL) warnings.push('CLIENT_URL');
  
  if (warnings.length > 0 && !isProd) {
    console.warn('⚠️  Missing environment variables (using defaults):');
    warnings.forEach(key => console.warn(`   - ${key}`));
  }
}

validateEnv();

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT ? Number(process.env.PORT) : 4000,

  // Render client origin (no trailing slash)
  CLIENT_URL: (process.env.CLIENT_URL || "http://localhost:5173").replace(/\/+$/, ""),

  // Prisma uses DATABASE_URL directly
  DATABASE_URL: process.env.DATABASE_URL,

  // JWT - REQUIRE in production to prevent weak default
  JWT_SECRET: isProd 
    ? required('JWT_SECRET') 
    : (process.env.JWT_SECRET || "dev-secret"),
};