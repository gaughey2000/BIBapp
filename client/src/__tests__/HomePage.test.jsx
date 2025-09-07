import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";

vi.mock("../api", () => ({
    // mock exactly what HomePage uses:
    api: {
      get: vi.fn().mockResolvedValue({
        data: [
          { service_id: 1, name: "Consultation", duration_min: 30, buffer_min: 0, price_cents: 2500 },
          { service_id: 2, name: "Treatment",    duration_min: 60, buffer_min: 10, price_cents: 9000 },
        ],
      }),
    },
  }));

describe("HomePage", () => {
  it("renders mock services", async () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText("Consultation")).toBeInTheDocument();
      expect(screen.getByText("Treatment")).toBeInTheDocument();
    });
  });
});