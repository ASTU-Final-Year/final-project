// ROUTE: /api/v1/user
import {
  authenticate,
  CTXAuth,
  CTXBody,
  CTXCookie,
  json,
  parseBody,
  parseCookie,
  RouterHandlers,
  status,
  Status,
} from "@bepalo/router";
import { ArkErrors, type } from "arktype";
import { CTXSession, UserSecInit } from "~/base";
import { parseAuth, parseSession } from "~/middleware";
import SessionService from "~/services/session.service";
import UserService from "~/services/user.service";

const TUserRegister = type({
  firstname: "3 <= string <= 40",
  lastname: "3 <= string <= 40",
  gender: "'M'|'F'|'U'",
  "role?": "'employee'|'client'",
  email: "string.email <= 40",
  phone: /^\+\d{2,3}\s?\d{9,10}$/,
  password: "8 <= string <= 30",
}).pipe((u) => {
  u.email = u.email.toLowerCase();
  return u;
});

type UserRegister = typeof TUserRegister.infer;

export default {
  POST: {
    FILTER: [
      parseBody({
        accept: ["application/x-www-form-urlencoded", "application/json"],
        maxSize: 1024,
        once: true,
      }),
      (req, ctx) => {
        const userForm = TUserRegister(ctx.body);
        if (userForm instanceof ArkErrors) {
          return status(Status._400_BadRequest, "Invalid body");
        }
        ctx.userForm = userForm;
      },
    ],
    HANDLER: [
      async (req, { userForm }) => {
        if (await UserService.existsUserWithEmail(userForm.email)) {
          return status(
            Status._403_Forbidden,
            "User with email already exists",
          );
        }
        const { password, ...user } =
          userForm.role === "employee"
            ? await UserService.createEmployeeUser(userForm)
            : await UserService.createClientUser(userForm);
        return json(
          {
            user,
          },
          { status: Status._201_Created },
        );
      },
    ],
  },
  GET: {
    FILTER: [parseCookie(), authenticate({ parseAuth }), parseSession()],
    HANDLER: [
      async (req, { session }) => {
        const user = session.user;
        return json({
          user,
        });
      },
    ],
  },
  DELETE: {
    FILTER: [parseCookie(), authenticate({ parseAuth }), parseSession()],
    HANDLER: [
      async (req, { session }) => {
        await SessionService.deleteSessionById(session.id);
        await UserService.deleteUserById(session.userId);
        return status(Status._200_OK);
      },
    ],
  },
} satisfies RouterHandlers<
  {},
  {
    POST: CTXBody & { body: UserRegister; userForm: UserRegister };
    GET: CTXSession & CTXAuth & CTXCookie;
    DELETE: CTXSession & CTXAuth & CTXCookie;
  }
>;
