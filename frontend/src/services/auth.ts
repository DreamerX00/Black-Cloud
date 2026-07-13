import type { AuthSession, User } from "@/types/auth";
import type { LoginInput, SignupInput } from "@/lib/validations/auth";

/**
 * Auth service — thin abstraction over the backend `/auth/*` endpoints.
 *
 * ponytail: The MVP does not have a live FastAPI yet, so this is a
 * localStorage-backed mock that satisfies the exact contract the real
 * service will implement. When the backend lands, swap the internals
 * without touching a single component.
 */

const LS_USERS = "bc.users";        // signup registry (mock only)
const LS_SESSION = "bc.session";    // active session (kept in real impl too, as cache)

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

interface StoredUser extends User {
  passwordHash: string; // in mock, plain text — clearly labeled
}

function readUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(LS_USERS) ?? "[]") as StoredUser[];
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]) {
  localStorage.setItem(LS_USERS, JSON.stringify(users));
}

function makeSession(user: User): AuthSession {
  return {
    user,
    token: `mock.${user.id}.${Date.now()}`,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  };
}

// ─── Public API (contract matches future FastAPI shape) ─────────────────────

export async function login(input: LoginInput): Promise<AuthSession> {
  await sleep(400); // mimic network
  const users = readUsers();
  const user = users.find((u) => u.email.toLowerCase() === input.email.toLowerCase());
  if (!user || user.passwordHash !== input.password) {
    throw new Error("Invalid email or password");
  }
  const session = makeSession(user);
  localStorage.setItem(LS_SESSION, JSON.stringify(session));
  return session;
}

export async function signup(input: SignupInput): Promise<AuthSession> {
  await sleep(500);
  const users = readUsers();
  if (users.some((u) => u.email.toLowerCase() === input.email.toLowerCase())) {
    throw new Error("An account with that email already exists");
  }
  const user: StoredUser = {
    id: crypto.randomUUID(),
    email: input.email,
    name: input.name,
    avatarUrl: null,
    createdAt: new Date().toISOString(),
    passwordHash: input.password, // mock-only
  };
  writeUsers([...users, user]);
  const session = makeSession(user);
  localStorage.setItem(LS_SESSION, JSON.stringify(session));
  return session;
}

export async function logout(): Promise<void> {
  await sleep(150);
  localStorage.removeItem(LS_SESSION);
}

export function getStoredSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LS_SESSION);
    if (!raw) return null;
    const session = JSON.parse(raw) as AuthSession;
    if (new Date(session.expiresAt).getTime() < Date.now()) {
      localStorage.removeItem(LS_SESSION);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}
