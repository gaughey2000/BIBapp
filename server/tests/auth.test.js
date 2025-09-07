import { api, seedAdmin } from "./helpers.js";

beforeAll(async () => { await seedAdmin(); });

test("POST /api/auth/login -> 200 + cookie", async () => {
  const res = await api
    .post("/api/auth/login")
    .send({ email: "admin@bib.com", password: "MySecurePassword" })
    .expect(200);

  expect(res.body.email).toBe("admin@bib.com");
  const cookies = res.headers["set-cookie"] || [];
  expect(cookies.some((c) => c.startsWith("token="))).toBe(true);
});