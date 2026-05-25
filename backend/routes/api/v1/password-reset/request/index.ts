// ROUTE: /api/v1/password-reset/request
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

const TPasswordResetRequest = type({
  email: "string.email",
}).pipe((v) => ({ email: v.email.toLowerCase() }));

type PasswordResetRequest = typeof TPasswordResetRequest.infer;

export default {
  POST: {
    FILTER: [
      parseBody({
        accept: ["application/x-www-form-urlencoded", "application/json"],
        maxSize: 1024,
        once: true,
      }),
      (req, ctx) => {
        const form = TPasswordResetRequest(ctx.body);
        if (form instanceof ArkErrors) {
          return status(Status._400_BadRequest, "Invalid email");
        }
        ctx.resetForm = form;
      },
    ],
    HANDLER: [
      async (req, { resetForm }) => {
        try {
          await PasswordResetService.requestReset(resetForm.email);
        } catch (err) {
          console.error("Password reset email failed:", err);
        }
        return json({
          message:
            "If an account exists for that email, a reset link has been sent.",
        });
      },
    ],
  },
} satisfies RouterHandlers<
  {},
  {
    POST: CTXBody & { body: PasswordResetRequest; resetForm: PasswordResetRequest };
  }
>;
