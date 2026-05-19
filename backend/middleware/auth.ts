import { JWT, type JwtPayload } from "@bepalo/jwt";
import { clearCookie, json } from "@bepalo/router";
import type {
  Auth,
  Handler,
  FreeHandler,
  CTXAuth,
  CTXCookie,
  ParseAuthFn,
} from "@bepalo/router";
import { eq, sql, type InferSelectModel } from "drizzle-orm";
import { securityConfig } from "~/config";
import { db } from "~/db";
import { tables } from "~/db/schema";

export const sessionJwt = JWT.createSymmetric<
  JwtPayload<{
    sid: string;
    role: string;
  }>
>(
  securityConfig.authJwtKey || "session-secret",
  securityConfig.authJwtAlg || "HS256",
);

export const SESSION_COOKIE_ID = securityConfig.sessionCookie;
export const SESSION_MAX_AGE = securityConfig.sessionMaxAge;

export type Session = Required<InferSelectModel<typeof tables.session>> & {
  user: Required<Omit<InferSelectModel<typeof tables.user>, "password">>;
};

export type OrganizationSession = {
  organization: Required<InferSelectModel<typeof tables.organization>>;
};

export type EmployeeSession = {
  employments: Required<InferSelectModel<typeof tables.employee>>[];
};

export type CTXSession = {
  session: Session | (Session & (OrganizationSession | EmployeeSession));
};

export type CTXOrganizationSession = {
  session: Session & OrganizationSession;
};

export type CTXEmployeeSession = {
  session: Session & EmployeeSession;
};
declare global {
  export type BEPALO_Session = Session;
  export type BEPALO_CTXSession = CTXSession;
}

export const hashPassword = (password: string): string =>
  Bun.password.hashSync(password);

export const verifyPassword = (password: string, hash: string): boolean =>
  Bun.password.verifySync(password, hash);

export const parseAuth: ParseAuthFn<CTXCookie> = async (
  req,
  { cookie, headers },
) => {
  let token;
  if (cookie && cookie[SESSION_COOKIE_ID]) {
    token = cookie[SESSION_COOKIE_ID];
    if (!token) {
      return new Error("Invalid session cookie");
    }
  } else {
    const authHeader = req.headers.get("authorziation");
    if (!authHeader) {
      return new Error("Unauthorized");
    }
    let scheme;
    [, token] = authHeader?.split(" ", 2);
    if (scheme !== "Bearer" || !token) {
      return new Error("Invalid authorziation header");
    }
  }
  const { valid, payload, error } = sessionJwt.verifySync(token);
  if (!valid || !payload) {
    headers.append(...clearCookie(SESSION_COOKIE_ID, { path: "/" }));
    if (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error(error);
      }
      return error;
    }
    return new Error("Invalid session");
  }
  const [blacklist] = await db
    .select({ count: sql<number>`count (*)` })
    .from(tables.sessionBlacklist)
    .where(eq(tables.sessionBlacklist.sessionId, payload.sid))
    .limit(1);
  if (blacklist && blacklist?.count >= 1) {
    return new Error("Invalid session");
  }
  const id = payload.sid;
  const role = payload.role;
  const auth: Auth = {
    id,
    role,
  };
  return auth;
};

export const parseSession = (options?: {
  optional?: boolean;
}): FreeHandler<CTXAuth & CTXSession> => {
  const optional = options?.optional;
  return async (req, ctx) => {
    if (ctx.auth == null) {
      // ctx.headers.append(...clearCookie(SESSION_COOKIE_ID, { path: "/" }));
      return optional
        ? undefined
        : json(
            { error: "Unauthorized" },
            {
              status: 401,
              // headers: [clearCookie(SESSION_COOKIE_ID, { path: "/" })],
            },
          );
    }
    const { id, role } = ctx.auth;
    const { password: _, ...user } = tables.user;
    const [session] = await db
      .select({
        ...tables.session,
        user,
      })
      .from(tables.session)
      .leftJoin(tables.user, eq(tables.session.userId, tables.user.id))
      .where(eq(tables.session.id, id));
    if (!session) {
      ctx.headers.append(...clearCookie(SESSION_COOKIE_ID, { path: "/" }));
      return json(
        { error: "missing or invalid session" },
        {
          status: 400,
          // headers: [clearCookie(SESSION_COOKIE_ID, { path: "/" })],
        },
      );
    }
    ctx.session = session;
    if (session.user.role === "organization_admin") {
      const [organization] = await db
        .select(tables.organization)
        .from(tables.organization)
        .where(eq(tables.organization.adminId, session.user.id));
      ctx.session.organization = organization;
    } else if (session.user.role === "employee") {
      const employments = await db
        .select(tables.employee)
        .from(tables.employee)
        .where(eq(tables.employee.userId, session.user.id));
      ctx.session.employments = employments;
    }
  };
};

// export const authFilter = (authorizeOptions?: {
//   allowRole?: (role: string) => boolean;
//   forbidRole?: (role: string) => boolean;
//   forPermissions?: string[];
//   hasPermission?: (
//     permission: string,
//     role: string,
//   ) => boolean | null | undefined;
//   endHere?: boolean;
// }): Handler<CTXCookie & CTXAuth & CTXSession>[] => [
//   parseCookie(),
//   authenticate({
//     parseAuth,
//   }),
//   authorizeOptions ? authorize(authorizeOptions) : () => {},
//   parseSession(),
// ];
