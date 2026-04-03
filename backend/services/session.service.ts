// services/session.service.ts

import { and, eq, gte } from "drizzle-orm";
import { Session, SessionBlacklist, SessionInit } from "~/base";
import { db } from "~/db";
import { sessions, sessionsBlacklist, users } from "~/db/schema";

export default class SessionService {
  //
  // Session
  //
  static async createSession(sessionInit: SessionInit): Promise<Session> {
    const [session] = await db.insert(sessions).values(sessionInit).returning();
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, session.userId));
    return { ...session, user } as Session;
  }

  static async getSessionById(sessionId: string): Promise<Session | undefined> {
    const session = (await db.query.sessions.findFirst({
      with: {
        user: true,
      },
      where: () =>
        and(
          eq(sessions.id, sessionId),
          gte(sessions.expiresAt, new Date()), // Only return non-expired sessions
        ),
    })) as Session | undefined;
    return session;
  }

  static async deleteSessionById(sessionId: string): Promise<void> {
    await db.delete(sessions).where(eq(sessions.id, sessionId));
  }

  //
  // Session Blacklist
  //
  static async blacklistSession(session: Session): Promise<SessionBlacklist> {
    const [sessionBlacklist] = await db
      .insert(sessionsBlacklist)
      .values({
        sessionId: session.id,
        userId: session.userId,
        expiresAt: session.expiresAt,
      })
      .returning();
    return sessionBlacklist;
  }

  static async getSessionBlacklistById(
    sessionId: string,
  ): Promise<SessionBlacklist | undefined> {
    const [sessionBlacklist] = await db
      .select()
      .from(sessionsBlacklist)
      .where(eq(sessionsBlacklist.sessionId, sessionId));
    return sessionBlacklist;
  }

  static async deleteSessionBlacklistById(sessionId: string): Promise<void> {
    await db.delete(sessions).where(eq(sessions.id, sessionId));
  }
}
