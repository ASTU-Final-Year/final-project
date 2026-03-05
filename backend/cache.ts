import { Cache } from "@bepalo/cache";
import { Time } from "@bepalo/time";
import type { Session, User } from "./base";
import { cacheConfig } from "./config";
import { sessions, users } from "./db/schema";
import { db } from "./db";
import { and, eq, gte } from "drizzle-orm";

export const userCache = new Cache<string, User>({
  now: () => Time.now(),
  defaultMaxAge: cacheConfig.user.maxAge,
  lruMaxSize: cacheConfig.user.lruMaxSize,
  cleanupInterval: cacheConfig.user.cleanupInterval,
  expiryBucketSize: cacheConfig.user.expiryBucketSize,
  onDelete: (_cache, userId, _entry, reason) => {
    // console.log("Evicted user", userId, reason);
  },
  onGetMiss: async (cache, userId, reason) => {
    const [user] = await db
      .select({
        id: users.id,
        firstname: users.firstname,
        lastname: users.lastname,
        email: users.email,
        gender: users.gender,
        phone: users.phone,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, userId));

    if (user) {
      cache.set(userId, user as User);
      return true;
    }
    return false;
  },
});

export const sessionBlacklistCache = new Cache<string, boolean>({
  now: () => Time.now(),
  lruMaxSize: cacheConfig.sessionBlacklist.lruMaxSize,
  cleanupInterval: cacheConfig.sessionBlacklist.cleanupInterval,
  expiryBucketSize: cacheConfig.sessionBlacklist.expiryBucketSize,
  deleteExpiredOnGet: true,
  onDelete: async (_cache, sessionId, _entry, reason) => {
    const [deletedSession] = await db
      .delete(sessions)
      .where(eq(sessions.id, sessionId))
      .returning();
    const dbUpdated = !!deletedSession;
    // console.log("Evicted session_blacklist", sessionId, reason, dbUpdated);
  },
});

export const sessionCache = new Cache<string, Session>({
  now: () => Time.now(),
  defaultMaxAge: cacheConfig.session.maxAge,
  lruMaxSize: cacheConfig.session.lruMaxSize,
  cleanupInterval: cacheConfig.session.cleanupInterval,
  expiryBucketSize: cacheConfig.user.expiryBucketSize,
  onDelete: async (_cache, sessionId, entry, reason) => {
    const { userId } = entry.value;
    // Clear user cache
    userCache.delete(userId);
    if (reason === "expired") {
      try {
        // Delete session from database
        await db.delete(sessions).where(eq(sessions.id, sessionId));
      } catch (error) {
        console.error("Error deleting session from database:", error);
      }
    }
    // console.log("Evicted session", sessionId, reason);
  },
  onGetHit: (_cache, sessionId) => {
    // console.log("Session Hit: ", sessionId);
  },
  onGetMiss: async (cache, sessionId, reason) => {
    // console.log("Session cache", reason, sessionId);
    // Check if session exists and is not expired
    const [session] = await db
      .select({
        id: sessions.id,
        userId: sessions.userId,
        expiresAt: sessions.expiresAt,
        createdAt: sessions.createdAt,
        updatedAt: sessions.updatedAt,
      })
      .from(sessions)
      .where(
        and(
          eq(sessions.id, sessionId),
          gte(sessions.expiresAt, new Date()), // Only return non-expired sessions
        ),
      );
    if (session) {
      cache.set(sessionId, session);
      return true;
    }
    return false;
  },
});
