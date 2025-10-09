import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AdminLogin from "../pages/AdminLogin";

vi.mock("../api", () => ({
  login: vi.fn().mockRejectedValue({ response: { data: { error: "Invalid credentials" } } }),
}));
vi.mock("../auth/AuthContext", () => ({
  useAuth: () => ({ refetchMe: vi.fn() }),
}));

describe("AdminLogin", () => {
  it("shows error on bad creds", async () => {
    render(
      <MemoryRouter>
        <AdminLogin />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "x@x.com" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "bad" } });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
    await waitFor(() =>
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
    );
  });
});