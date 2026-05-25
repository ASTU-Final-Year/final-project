import { JWT } from "@bepalo/jwt";
import type { Receipt } from "@upyo/core";
import { config, passwordResetJwt, passwordResetMaxAge, securityConfig } from "~/config";
import EmailService from "./email.service";
import UserService from "./user.service";

export default class PasswordResetService {
  static async requestReset(email: string): Promise<Receipt | null> {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await UserService.getUserByEmail(normalizedEmail);
    if (!user) {
      return null;
    }

    const token = passwordResetJwt.signSync({
      sub: "password-reset",
      email: normalizedEmail,
      userId: user.id,
      iat: JWT.now(),
      exp: Math.floor((Date.now() + passwordResetMaxAge) / 1000),
    });

    const resetLink = `${config.url}:${config.frontendPort}/reset-password?t=${encodeURIComponent(token)}`;

    return EmailService.send({
      from: securityConfig.smtpEmail,
      to: normalizedEmail,
      subject: "Reset your ServeSync+ password",
      content: {
        html: `
        <div>
          <h1>Password reset request</h1>
          <p>Hi ${user.firstname}, we received a request to reset your password.</p>
          <p>
            <a href="${resetLink}">Reset your password</a>
          </p>
          <p>This link expires in one hour. If you did not request this, you can ignore this email.</p>
          <p>&copy; ${new Date().getFullYear()} ServeSync+</p>
        </div>
        `,
      },
    });
  }

  static async resetPassword(
    token: string,
    password: string,
  ): Promise<{ success: true } | { error: string }> {
    const { payload, valid, error } = passwordResetJwt.verifySync(token);
    if (!valid || !payload || payload.sub !== "password-reset") {
      return { error: error?.message || "Invalid or expired reset link" };
    }

    const user = await UserService.getUserById(payload.userId);
    if (!user || user.email !== payload.email) {
      return { error: "Invalid or expired reset link" };
    }

    await UserService.updatePasswordById(user.id, password);
    return { success: true };
  }
}
