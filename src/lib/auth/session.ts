import { cookies } from "next/headers";
import { db } from "../db/dataStore";
import { UserProfile, UserRole } from "../types";

export const SESSION_COOKIE_NAME = "seminar_connect_session";

export interface SessionData {
  userId: string;
  role: UserRole;
  email: string;
}

export async function getCurrentUser(): Promise<UserProfile | null> {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!sessionCookie?.value) {
    return null;
  }

  try {
    const session: SessionData = JSON.parse(sessionCookie.value);
    const user = db.findUserById(session.userId);
    return user || null;
  } catch (err) {
    return null;
  }
}

export async function requireAuth(allowedRoles?: UserRole[]): Promise<UserProfile> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    throw new Error("FORBIDDEN");
  }

  return user;
}
