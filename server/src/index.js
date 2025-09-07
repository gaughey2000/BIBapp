// server/src/index.js
import { app } from './app.js';
import { ENV } from './config/env.js';

app.listen(ENV.PORT, () => {
  console.log(`[server] ${ENV.NODE_ENV} on :${ENV.PORT}`);
});