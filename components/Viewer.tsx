"use client";

import { createContext, useContext } from "react";
import type { Role } from "@/lib/auth/session";

const ViewerContext = createContext<Role | null>(null);

// Set once in the root layout from the verified session cookie
export function ViewerProvider({ role, children }: { role: Role | null; children: React.ReactNode }) {
  return <ViewerContext.Provider value={role}>{children}</ViewerContext.Provider>;
}

// Whether to show editing controls. Purely cosmetic — the server re-checks.
export function useCanEdit() {
  return useContext(ViewerContext) === "owner";
}
