import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { whoAmI, adminLogout } from "../api";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [status, setStatus] = useState("checking"); // "checking" | "guest" | "authed"
  const [user, setUser] = useState(null);

  // Check server session on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await whoAmI();
        if (!cancelled) {
          setUser(data);
          setStatus("authed");
        }
      } catch {
        if (!cancelled) {
          setUser(null);
          setStatus("guest");
        }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const refetchMe = async () => {
    const data = await whoAmI();
    setUser(data);
    setStatus("authed");
    return data;
  };

  const logout = async () => {
    try { await adminLogout(); } catch {}
    setUser(null);
    setStatus("guest");
  };

  const value = useMemo(() => ({
    status,
    user,
    isChecking: status === "checking",
    isAuthed: status === "authed",
    refetchMe,
    logout,
  }), [status, user]);

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}