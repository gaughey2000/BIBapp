import { app } from "./app.js";
import { ENV } from "./config/env.js";

const port = ENV.PORT;
app.listen(port, () => {
  const mode = ENV.NODE_ENV || "development";
  console.log(`[server] ${mode} on :${port}`);
});