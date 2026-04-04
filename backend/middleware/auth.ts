import { JWT, JwtPayload } from "@bepalo/jwt";
import {
  CTXAuth,
  CTXCookie,
  FreeHandler,
  ParseAuthFn,
  Status,
  status,
} from "@bepalo/router";
import { CTXSession } from "~/base";
import { securityConfig } from "~/config";
import SessionService from "~/services/session.service";

export const sessionJwt = JWT.createSymmetric<
  JwtPayload<{
    sessionId: string;
    role: string;
  }>
>(securityConfig.authJwtKey, securityConfig.authJwtAlg);

export const parseAuth: ParseAuthFn<CTXCookie & CTXAuth> = async (req, ctx) => {
  const sessionToken = ctx.cookie[securityConfig.sessionCookie];
  if (!sessionToken) {
    return new Error("Null session cookie");
  }
  const { payload, valid, error } = sessionJwt.verifySync(sessionToken);
  if (!(valid && payload)) {
    return error;
  }
  const isBlacklisted = await SessionService.isSessionBlacklistedById(
    payload.sessionId,
  );
  if (isBlacklisted) return new Error("Invalid session");
  return { id: payload.sessionId, role: payload.role };
};

export const parseSession: () => FreeHandler<CTXAuth & CTXSession> =
  () => async (req, ctx) => {
    const auth = ctx.auth;
    const session = await SessionService.getSessionById(auth.id);
    if (!session) return status(Status._401_Unauthorized, "Invalid session");
    ctx.session = session;
  };
