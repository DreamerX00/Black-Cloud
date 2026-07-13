"use client";

import { create } from "zustand";
import type { AuthSession, User } from "@/types/auth";
import { getStoredSession } from "@/services/auth";

/**
 * Client-side session store.
 * Persistence lives in the auth service (localStorage). This store is the
 * reactive mirror; it re-reads on hydrate() so we don't fight SSR on first paint.
 */

interface AuthState {
  user: User | null;
  token: string | null;
  hydrated: boolean;
  hydrate: () => void;
  setSession: (session: AuthSession | null) => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  token: null,
  hydrated: false,
  hydrate: () => {
    const session = getStoredSession();
    set({
      user: session?.user ?? null,
      token: session?.token ?? null,
      hydrated: true,
    });
  },
  setSession: (session) =>
    set({
      user: session?.user ?? null,
      token: session?.token ?? null,
    }),
}));
