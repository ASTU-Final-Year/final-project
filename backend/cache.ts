import { Cache } from "@bepalo/cache";
import { Time } from "@bepalo/time";
import type { Session, User } from "./base";
import { cacheConfig } from "./config";
import SessionService from "./services/session.service";
import { LOGE } from "./lib";

export const sessionBlacklistCache = new Cache<string, boolean>({
  now: () => Time.now(),
  lruMaxSize: cacheConfig.sessionBlacklist.lruMaxSize,
  cleanupInterval: cacheConfig.sessionBlacklist.cleanupInterval,
  expiryBucketSize: cacheConfig.sessionBlacklist.expiryBucketSize,
  deleteExpiredOnGet: true,
  onGetMiss: async (cache, sessionId, reason) => {
    const sessionBlacklist =
      await SessionService.getSessionBlacklistById(sessionId);
    if (sessionBlacklist) {
      cache.set(sessionId, true, {
        exp: sessionBlacklist.expiresAt?.getTime(),
      });
      return true;
    }
  },
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
    // userCache.delete(userId);
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
  onGetMiss: async (cache, sessionId, reason) => {
    // // Check if session exists and is not expired
    const session = await SessionService.getSessionById(sessionId);
    if (session) {
      cache.set(sessionId, session, { exp: session.expiresAt?.getTime() });
      return true;
    }
  },
});
