// ROUTE: /api/v1/session
import { JWT } from "@bepalo/jwt";
import {
  authenticate,
  clearCookie,
  CTXAuth,
  CTXBody,
  CTXCookie,
  json,
  parseBody,
  parseCookie,
  RouterHandlers,
  setCookie,
  status,
  Status,
} from "@bepalo/router";
import { ArkErrors, type } from "arktype";
import { CTXSession } from "~/base";
import { config, securityConfig } from "~/config";
import { parseAuth, parseSession, sessionJwt } from "~/middleware";
import PasswordService from "~/services/password.service";
import SessionService from "~/services/session.service";
import UserService from "~/services/user.service";

const TUserLogin = type({
  email: "string.email",
  password: "8 <= string <= 30",
});

type UserLogin = typeof TUserLogin.infer;

export default {
  POST: {
    FILTER: [
      parseBody({
        accept: ["application/x-www-form-urlencoded", "application/json"],
        maxSize: 1024,
        once: true,
      }),
      (req, ctx) => {
        const loginForm = TUserLogin(ctx.body);
        if (loginForm instanceof ArkErrors) {
          return status(Status._400_BadRequest, "Invalid login");
        }
        ctx.loginForm = loginForm;
      },
    ],
    HANDLER: [
      async (req, { loginForm }) => {
        const user = await UserService.getUserByEmail(loginForm.email);
        if (!user) {
          return status(Status._401_Unauthorized, "User not registerd");
        }
        const passwordMatches = await PasswordService.verifyPassword(
          loginForm.password,
          user.password,
        );
        if (!passwordMatches) {
          return status(Status._401_Unauthorized, "Invalid password");
        }
        const session = await SessionService.createSession({
          userId: user.id,
          expiresAt: new Date(Date.now() + securityConfig.sessionMaxAge),
          data: {},
        });
        const sessionCookieToken = sessionJwt.signSync({
          sessionId: session.id,
          role: session.user.role,
          iat: JWT.now(),
          exp: Math.floor((Date.now() + securityConfig.sessionMaxAge) / 1000),
        });
        return json(
          {
            session,
          },
          {
            status: Status._201_Created,
            headers: [
              setCookie(securityConfig.sessionCookie, sessionCookieToken, {
                path: "/",
                expires: new Date(Date.now() + securityConfig.sessionMaxAge),
                httpOnly: true,
                secure: config.isProduction,
              }),
            ],
          },
        );
      },
    ],
  },
  GET: {
    FILTER: [parseCookie(), authenticate({ parseAuth }), parseSession()],
    HANDLER: [
      (req, { session }) => {
        return json({
          session,
        });
      },
    ],
  },
  DELETE: {
    FILTER: [parseCookie(), authenticate({ parseAuth }), parseSession()],
    HANDLER: [
      async (req, { session }) => {
        await SessionService.deleteSessionById(session.id);
        return status(Status._200_OK, undefined, {
          headers: [
            clearCookie(securityConfig.sessionCookie, {
              path: "/",
              httpOnly: true,
              secure: config.isProduction,
            }),
          ],
        });
      },
    ],
  },
} satisfies RouterHandlers<
  {},
  {
    POST: CTXBody & { body: UserLogin; loginForm: UserLogin };
    GET: CTXCookie & CTXAuth & CTXSession;
    DELETE: CTXCookie & CTXAuth & CTXSession;
  }
>;
