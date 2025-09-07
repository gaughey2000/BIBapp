// server/tests/health.test.js
import { api } from "./helpers.js";

test("GET /health -> 200 with {ok:true}", async () => {
  await api.get("/health").expect(200).expect({ ok: true });
});