import { api } from "./helpers.js";

test("GET /api/services -> array", async () => {
  const res = await api.get("/api/services").expect(200);
  expect(Array.isArray(res.body)).toBe(true);
});