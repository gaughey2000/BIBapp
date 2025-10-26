// server/tests/service-crud.test.js
import { api, seedAdmin } from "./helpers.js";
import { prisma } from "../src/app.js";

describe("Service CRUD Operations", () => {
  let adminToken;
  let createdServiceId;

  // Set up admin user before all tests
  beforeAll(async () => {
    const { email, password } = await seedAdmin();
    const res = await api
      .post("/api/auth/login")
      .send({ email, password })
      .expect(200);
    adminToken = res.body.token;
  });

  // Clean up after all tests
  afterAll(async () => {
    // Clean up test services
    if (createdServiceId) {
      await prisma.service.deleteMany({
        where: { name: { contains: "[TEST]" } },
      });
    }
    await prisma.$disconnect();
  });

  describe("POST /api/admin/services - Create Service", () => {
    it("creates service with valid complete data", async () => {
      const serviceData = {
        name: "[TEST] Botox Treatment",
        description: "Anti-wrinkle treatment for forehead",
        price_cents: 15000,
        duration_min: 30,
        buffer_min: 15,
        is_active: true,
        treatment_type: "BOTULINUM_TOXIN",
        more_info: "Requires consultation",
      };

      const res = await api
        .post("/api/admin/services")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(serviceData)
        .expect(201);

      expect(res.body).toMatchObject({
        name: serviceData.name,
        price_cents: serviceData.price_cents,
        duration_min: serviceData.duration_min,
        treatment_type: serviceData.treatment_type,
      });
      expect(res.body.service_id).toBeDefined();
      createdServiceId = res.body.service_id;
    });

    it("creates service with minimal required data (uses defaults)", async () => {
      const serviceData = {
        name: "[TEST] Simple Service",
        price_cents: 5000,
        duration_min: 20,
      };

      const res = await api
        .post("/api/admin/services")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(serviceData)
        .expect(201);

      expect(res.body.buffer_min).toBe(15); // Default
      expect(res.body.is_active).toBe(true); // Default
      expect(res.body.treatment_type).toBe("OTHER_SERVICES"); // Default
    });

    it("rejects service with missing required fields", async () => {
      const invalidData = {
        // Missing name
        price_cents: 10000,
        duration_min: 30,
      };

      const res = await api
        .post("/api/admin/services")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(invalidData)
        .expect(400);

      expect(res.body.error).toBeDefined();
    });

    it("rejects service with negative price", async () => {
      const invalidData = {
        name: "[TEST] Invalid Price",
        price_cents: -5000, // Negative!
        duration_min: 30,
      };

      const res = await api
        .post("/api/admin/services")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(invalidData)
        .expect(400);

      expect(res.body.error).toContain("Invalid input");
    });

    it("rejects service with invalid duration (zero)", async () => {
      const invalidData = {
        name: "[TEST] Zero Duration",
        price_cents: 10000,
        duration_min: 0, // Invalid!
      };

      const res = await api
        .post("/api/admin/services")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(invalidData)
        .expect(400);
    });

    it("rejects service with invalid treatment type", async () => {
      const invalidData = {
        name: "[TEST] Invalid Type",
        price_cents: 10000,
        duration_min: 30,
        treatment_type: "INVALID_TYPE", // Not in enum!
      };

      const res = await api
        .post("/api/admin/services")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(invalidData)
        .expect(400);
    });

    it("rejects service creation without authentication", async () => {
      const serviceData = {
        name: "[TEST] No Auth",
        price_cents: 10000,
        duration_min: 30,
      };

      await api
        .post("/api/admin/services")
        // No Authorization header!
        .send(serviceData)
        .expect(401);
    });

    it("rejects service creation with invalid token", async () => {
      const serviceData = {
        name: "[TEST] Bad Token",
        price_cents: 10000,
        duration_min: 30,
      };

      await api
        .post("/api/admin/services")
        .set("Authorization", "Bearer invalid-token-here")
        .send(serviceData)
        .expect(401);
    });
  });

  describe("PUT /api/admin/services/:id - Update Service", () => {
    let serviceToUpdate;

    beforeAll(async () => {
      // Create a service to update
      const res = await api
        .post("/api/admin/services")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "[TEST] Update Me",
          price_cents: 10000,
          duration_min: 30,
        })
        .expect(201);
      serviceToUpdate = res.body;
    });

    it("updates service with valid data", async () => {
      const updates = {
        name: "[TEST] Updated Name",
        price_cents: 12000,
        is_active: false,
      };

      const res = await api
        .put(`/api/admin/services/${serviceToUpdate.service_id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updates)
        .expect(200);

      expect(res.body.name).toBe(updates.name);
      expect(res.body.price_cents).toBe(updates.price_cents);
      expect(res.body.is_active).toBe(false);
    });

    it("performs partial update (only price)", async () => {
      const updates = {
        price_cents: 15000,
      };

      const res = await api
        .put(`/api/admin/services/${serviceToUpdate.service_id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updates)
        .expect(200);

      expect(res.body.price_cents).toBe(15000);
      expect(res.body.duration_min).toBe(serviceToUpdate.duration_min);
    });

    it("returns error for non-existent service ID", async () => {
      const updates = {
        price_cents: 20000,
      };

      await api
        .put("/api/admin/services/99999")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updates)
        .expect(500);
    });

    it("rejects update with invalid data", async () => {
      const updates = {
        price_cents: -5000, // Negative price!
      };

      await api
        .put(`/api/admin/services/${serviceToUpdate.service_id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updates)
        .expect(400);
    });

    it("rejects update without authentication", async () => {
      const updates = {
        price_cents: 20000,
      };

      await api
        .put(`/api/admin/services/${serviceToUpdate.service_id}`)
        .send(updates)
        .expect(401);
    });

    it("rejects update with invalid service ID format", async () => {
      const updates = {
        price_cents: 20000,
      };

      await api
        .put("/api/admin/services/not-a-number")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updates)
        .expect(400);
    });
  });

  describe("DELETE /api/admin/services/:id - Delete Service", () => {
    let serviceToDelete;

    beforeEach(async () => {
      // Create a fresh service for each delete test
      const res = await api
        .post("/api/admin/services")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "[TEST] Delete Me",
          price_cents: 5000,
          duration_min: 15,
        })
        .expect(201);
      serviceToDelete = res.body;
    });

    it("deletes service successfully", async () => {
      await api
        .delete(`/api/admin/services/${serviceToDelete.service_id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      // Verify it's actually deleted
      const check = await prisma.service.findUnique({
        where: { service_id: serviceToDelete.service_id },
      });
      expect(check).toBeNull();
    });

    it("returns error for non-existent service ID", async () => {
      await api
        .delete("/api/admin/services/99999")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(500);
    });

    it("rejects deletion without authentication", async () => {
      await api
        .delete(`/api/admin/services/${serviceToDelete.service_id}`)
        .expect(401);
    });

    it("rejects deletion with invalid ID format", async () => {
      await api
        .delete("/api/admin/services/not-a-number")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(400);
    });
  });

  describe("GET /api/services/:id - Get Single Service", () => {
    let testService;

    beforeAll(async () => {
      // Create a test service
      const res = await api
        .post("/api/admin/services")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "[TEST] Get Me",
          price_cents: 8000,
          duration_min: 25,
        })
        .expect(201);
      testService = res.body;
    });

    it("returns service by ID (public endpoint)", async () => {
      const res = await api
        .get(`/api/services/${testService.service_id}`)
        .expect(200);

      expect(res.body.service_id).toBe(testService.service_id);
      expect(res.body.name).toBe(testService.name);
      expect(res.body.price_cents).toBe(testService.price_cents);
    });

    it("returns 404 for non-existent service ID", async () => {
      await api.get("/api/services/99999").expect(404);
    });

    it("returns 400 for invalid ID format", async () => {
      await api.get("/api/services/not-a-number").expect(400);
    });
  });

  describe("GET /api/services - List Services", () => {
    beforeAll(async () => {
      // Create active and inactive services
      await api
        .post("/api/admin/services")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "[TEST] Active Service",
          price_cents: 10000,
          duration_min: 30,
          is_active: true,
        });

      await api
        .post("/api/admin/services")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "[TEST] Inactive Service",
          price_cents: 10000,
          duration_min: 30,
          is_active: false,
        });
    });

    it("returns only active services for public", async () => {
      const res = await api.get("/api/services").expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      
      // All services should be active
      const allActive = res.body.every((service) => service.is_active === true);
      expect(allActive).toBe(true);

      // Should not include inactive test service
      const hasInactive = res.body.some(
        (service) => service.name === "[TEST] Inactive Service"
      );
      expect(hasInactive).toBe(false);
    });

    it("services are sorted by treatment_type and name", async () => {
      const res = await api.get("/api/services").expect(200);

      // Check that services are sorted
      for (let i = 1; i < res.body.length; i++) {
        const prev = res.body[i - 1];
        const curr = res.body[i];

        const isSorted =
          prev.treatment_type < curr.treatment_type ||
          (prev.treatment_type === curr.treatment_type &&
            prev.name <= curr.name);

        expect(isSorted).toBe(true);
      }
    });
  });

  describe("GET /api/admin/services - Admin List Services", () => {
    it("returns all services including inactive for admin", async () => {
      const res = await api
        .get("/api/admin/services")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);

      // Should include both active and inactive
      const hasActive = res.body.some((s) => s.is_active === true);
      const hasInactive = res.body.some((s) => s.is_active === false);

      expect(hasActive).toBe(true);
      expect(hasInactive).toBe(true);
    });

    it("rejects request without authentication", async () => {
      await api.get("/api/admin/services").expect(401);
    });
  });
});
