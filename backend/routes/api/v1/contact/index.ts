// backend/routes/api/v1/contact/index.ts
import { json, type RouterHandlers } from "@bepalo/router";
import { z } from "zod";
import { securityConfig } from "~/config";
import EmailService from "~/services/email.service";

// Validation schema for contact form
const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

export default {
  POST: {
    HANDLER: [
      async (request) => {
        try {
          // Parse request body
          const body = await request.json();

          // Validate input
          const validation = contactSchema.safeParse(body);
          if (!validation.success) {
            return json(
              {
                error: "Validation failed",
                details: validation.error.issues,
              },
              { status: 400 },
            );
          }

          const { name, email, subject, message } = validation.data;

          // Send email to support
          await EmailService.send({
            to: "support@servesyncplus.net",
            from: {
              name: "ServeSync+ Contact Form",
              address: securityConfig.smtpEmail,
            },
            replyTo: {
              name: name,
              address: email,
            },
            subject: `[Contact Form] ${subject}`,
            html: `
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="utf-8">
                <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background: #4f46e5; color: white; padding: 20px; text-align: center; }
                  .content { padding: 20px; background: #f9fafb; }
                  .field { margin-bottom: 15px; }
                  .label { font-weight: bold; color: #4f46e5; margin-bottom: 5px; }
                  .value { background: white; padding: 10px; border-radius: 5px; border: 1px solid #e5e7eb; }
                  .footer { text-align: center; padding: 20px; font-size: 12px; color: #6b7280; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h2>New Contact Form Submission</h2>
                  </div>
                  <div class="content">
                    <div class="field">
                      <div class="label">Name:</div>
                      <div class="value">${escapeHtml(name)}</div>
                    </div>
                    <div class="field">
                      <div class="label">Email:</div>
                      <div class="value">${escapeHtml(email)}</div>
                    </div>
                    <div class="field">
                      <div class="label">Subject:</div>
                      <div class="value">${escapeHtml(subject)}</div>
                    </div>
                    <div class="field">
                      <div class="label">Message:</div>
                      <div class="value">${escapeHtml(message).replace(/\n/g, "<br/>")}</div>
                    </div>
                  </div>
                  <div class="footer">
                    <p>This message was sent from the ServeSync+ contact form.</p>
                    <p>Reply to: ${escapeHtml(email)}</p>
                  </div>
                </div>
              </body>
              </html>
            `,
            text: `
              New Contact Form Submission
              
              Name: ${name}
              Email: ${email}
              Subject: ${subject}
              
              Message:
              ${message}
              
              ---
              Reply to: ${email}
            `,
          });

          // Optional: Send auto-reply to user
          await EmailService.send({
            to: email,
            from: {
              name: "ServeSync+ Support",
              address: securityConfig.smtpEmail,
            },
            subject: "We've received your message",
            html: `
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="utf-8">
                <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background: #4f46e5; color: white; padding: 20px; text-align: center; }
                  .content { padding: 20px; background: #f9fafb; }
                  .footer { text-align: center; padding: 20px; font-size: 12px; color: #6b7280; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h2>Thank You for Contacting Us</h2>
                  </div>
                  <div class="content">
                    <p>Dear ${escapeHtml(name)},</p>
                    <p>We have received your message and our team will respond within 24 hours.</p>
                    <p><strong>Your message:</strong></p>
                    <div style="background: white; padding: 15px; border-radius: 5px; border: 1px solid #e5e7eb;">
                      ${escapeHtml(message).replace(/\n/g, "<br/>")}
                    </div>
                    <p style="margin-top: 20px;">Best regards,<br/>ServeSync+ Support Team</p>
                  </div>
                  <div class="footer">
                    <p>© ${new Date().getFullYear()} ServeSync+. All rights reserved.</p>
                  </div>
                </div>
              </body>
              </html>
            `,
            text: `
              Thank You for Contacting Us
              
              Dear ${name},
              
              We have received your message and our team will respond within 24 hours.
              
              Your message:
              ${message}
              
              Best regards,
              ServeSync+ Support Team
            `,
          });

          // Optional: Store in database
          // await db.insert(tables.contactMessages).values({
          //   name,
          //   email,
          //   subject,
          //   message,
          //   createdAt: new Date(),
          // });

          return json(
            {
              success: true,
              message: "Message sent successfully",
            },
            { status: 200 },
          );
        } catch (error) {
          console.error("Contact form error:", error);
          return json(
            {
              error: "Failed to send message",
              details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 },
          );
        }
      },
    ],
  },
} satisfies RouterHandlers;

// Helper function to escape HTML
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
