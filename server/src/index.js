import { app } from "./app.js";
import { ENV } from "./config/env.js";

const port = ENV.PORT;
const mode = ENV.NODE_ENV || "development";

app.listen(port, () => {
  console.log(`
╔══════════════════════════════════════════════════════════════════╗
║               🚀 BIB Server Running                             ║
╚══════════════════════════════════════════════════════════════════╝

  📍 Mode:        ${mode}
  🔌 Port:        ${port}
  🗄️  Database:    ${ENV.DATABASE_URL ? '✅ Connected' : '❌ Not configured'}
  🔐 JWT Secret:  ${ENV.JWT_SECRET === 'dev-secret' ? '⚠️  Using dev secret' : '✅ Configured'}
  🌐 CORS:        ${ENV.CLIENT_URL}
  
  🎯 API:         http://localhost:${port}
  ❤️  Health:      http://localhost:${port}/health
  
╚══════════════════════════════════════════════════════════════════╝
  `);
});