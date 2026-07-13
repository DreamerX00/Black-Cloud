/**
 * Auth domain types.
 * Shape mirrors what the FastAPI `/auth` endpoints will return
 * (see plan/ARCHITECTURE.md §Auth). Backend can generate identical
 * Pydantic models — keep this file the single frontend truth.
 */

export type UserId = string;

export interface User {
  id: UserId;
  email: string;
  name: string;
  avatarUrl?: string | null;
  createdAt: string; // ISO 8601
}

export interface AuthSession {
  user: User;
  token: string; // JWT — stored client-side; backend also sets httpOnly cookie in prod
  expiresAt: string; // ISO 8601
}
