import { app } from './app.js';
import { ENV } from './config/env.js';


const port = ENV.PORT || process.env.PORT || 4000;

// Render/Cloudflare provide PORT
app.listen(port, () => {
  console.log(`[server] ${ENV.NODE_ENV || 'production'} on :${port}`);
});