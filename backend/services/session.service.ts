// services/session.service.ts

import { and, eq, gte } from "drizzle-orm";
import { Session, SessionBlacklist, SessionInit } from "~/base";
import { db } from "~/db";
import { sessions, sessionsBlacklist, users } from "~/db/schema";
import { Cache } from "@bepalo/cache";
import { Time } from "@bepalo/time";
import { cacheConfig } from "~/config";
import { LOGE } from "~/lib";

export default class SessionService {
  //
  // Session
  //
  static async createSession(sessionInit: SessionInit): Promise<Session> {
    const [session] = await db.insert(sessions).values(sessionInit).returning();
    const [user] = await db
      .select({
        id: users.id,
        firstname: users.firstname,
        lastname: users.lastname,
        gender: users.gender,
        role: users.role,
        email: users.email,
        phone: users.phone,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, session.userId));
    sessionCache.set(session.id, { ...session, user } as Session);
    return { ...session, user } as Session;
  }

  static async getSessionById(sessionId: string): Promise<Session | undefined> {
    const cachedSession = sessionCache.get(sessionId)?.value;
    if (!cachedSession) {
      const session = (await db.query.sessions.findFirst({
        with: {
          user: {
            columns: {
              id: true,
              firstname: true,
              lastname: true,
              gender: true,
              role: true,
              email: true,
              phone: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
        where: () =>
          and(
            eq(sessions.id, sessionId),
            gte(sessions.expiresAt, new Date()), // Only return non-expired sessions
          ),
      })) as Session | undefined;
      if (session) {
        sessionCache.set(sessionId, session);
      }
      return session;
    } else {
      return cachedSession;
    }
  }

  static async deleteSessionById(sessionId: string): Promise<void> {
    const session = await SessionService.getSessionById(sessionId);
    if (session) {
      // add to blacklist if not expired yet
      if (session.expiresAt && session.expiresAt.getTime() > Date.now()) {
        await SessionService.blacklistSession(session);
      }
      sessionCache.delete(sessionId);
      await db.delete(sessions).where(eq(sessions.id, sessionId));
    }
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
    const exp = session.expiresAt
      ? session.expiresAt.getTime() / 1000
      : undefined;
    sessionBlacklistCache.set(session.id, sessionBlacklist, {
      exp,
    });
    return sessionBlacklist;
  }

  static async getSessionBlacklistById(
    sessionId: string,
  ): Promise<SessionBlacklist | undefined> {
    const cachedSessionBlacklist = sessionBlacklistCache.get(sessionId)?.value;
    if (cachedSessionBlacklist != null) {
      return cachedSessionBlacklist;
    }
    const [sessionBlacklist] = await db
      .select()
      .from(sessionsBlacklist)
      .where(eq(sessionsBlacklist.sessionId, sessionId));
    if (sessionBlacklist) {
      sessionBlacklistCache.set(sessionId, sessionBlacklist);
    }
    return sessionBlacklist;
  }

  static async isSessionBlacklistedById(sessionId: string): Promise<boolean> {
    const cachedSessionBlacklist = sessionBlacklistCache.get(sessionId)?.value;
    if (cachedSessionBlacklist != null) {
      return true;
    }
    const [sessionBlacklist] = await db
      .select()
      .from(sessionsBlacklist)
      .where(eq(sessionsBlacklist.sessionId, sessionId));
    if (sessionBlacklist != null) {
      sessionBlacklistCache.set(sessionId, sessionBlacklist);
      return true;
    }
    return false;
  }

  static async deleteSessionBlacklistById(sessionId: string): Promise<void> {
    await db.delete(sessions).where(eq(sessions.id, sessionId));
  }
}

export const sessionBlacklistCache = new Cache<string, SessionBlacklist>({
  now: () => Time.now(),
  lruMaxSize: cacheConfig.sessionBlacklist.lruMaxSize,
  cleanupInterval: cacheConfig.sessionBlacklist.cleanupInterval,
  expiryBucketSize: cacheConfig.sessionBlacklist.expiryBucketSize,
  deleteExpiredOnGet: true,
  onDelete: async (_cache, sessionId, _entry, reason) => {
    if (reason === "expired") {
      await SessionService.deleteSessionBlacklistById(sessionId);
    }
  },
});

export const sessionCache = new Cache<string, Session>({
  now: () => Time.now(),
  defaultMaxAge: cacheConfig.session.maxAge,
  lruMaxSize: cacheConfig.session.lruMaxSize,
  cleanupInterval: cacheConfig.session.cleanupInterval,
  expiryBucketSize: cacheConfig.user.expiryBucketSize,
  onDelete: async (_cache, sessionId, entry, reason) => {
    // Clear user cache
    if (reason === "expired") {
      try {
        // Delete session from database
        await SessionService.deleteSessionById(sessionId);
        // await db.delete(sessions).where(eq(sessions.id, sessionId));
      } catch (error) {
        LOGE("Error deleting session from database:", error);
      }
    }
  },
});
