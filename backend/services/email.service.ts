import { createMessage, MessageConstructor, Receipt } from "@upyo/core";
import { SmtpTransport } from "@upyo/smtp";
import { securityConfig } from "~/config";

const transport = new SmtpTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: securityConfig.smtpEmail,
    pass: securityConfig.smtpPassword,
  },
});

export default class EmailService {
  static async send(messageConstructor: MessageConstructor): Promise<Receipt> {
    const message = createMessage(messageConstructor);
    return transport.send(message);
  }
}
