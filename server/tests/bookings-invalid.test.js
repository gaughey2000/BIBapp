import { api } from "./helpers.js";

test("POST /api/bookings invalid -> 400", async () => {
  const res = await api.post("/api/bookings").send({}).expect(400);
  expect(res.body.error).toBeTruthy();
});