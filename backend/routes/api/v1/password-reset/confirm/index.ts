// ROUTE: /api/v1/password-reset/confirm
import {
  CTXBody,
  json,
  parseBody,
  RouterHandlers,
  status,
  Status,
} from "@bepalo/router";
import { ArkErrors, type } from "arktype";
import PasswordResetService from "~/services/password-reset.service";

const TPasswordResetConfirm = type({
  token: "1 <= string <= 4096",
  password: "8 <= string <= 30",
});

type PasswordResetConfirm = typeof TPasswordResetConfirm.infer;

export default {
  POST: {
    FILTER: [
      parseBody({
        accept: ["application/x-www-form-urlencoded", "application/json"],
        maxSize: 4096,
        once: true,
      }),
      (req, ctx) => {
        const form = TPasswordResetConfirm(ctx.body);
        if (form instanceof ArkErrors) {
          return status(Status._400_BadRequest, "Invalid request");
        }
        ctx.confirmForm = form;
      },
    ],
    HANDLER: [
      async (req, { confirmForm }) => {
        const result = await PasswordResetService.resetPassword(
          confirmForm.token,
          confirmForm.password,
        );
        if ("error" in result) {
          return status(Status._400_BadRequest, result.error);
        }
        return json({ message: "Password updated successfully" });
      },
    ],
  },
} satisfies RouterHandlers<
  {},
  {
    POST: CTXBody & {
      body: PasswordResetConfirm;
      confirmForm: PasswordResetConfirm;
    };
  }
>;
