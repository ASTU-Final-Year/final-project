// backend/routes/api/v1/payment/initialize/route.ts
import {
  authenticate,
  json,
  parseCookie,
  type CTXAuth,
  type CTXCookie,
  type RouterHandlers,
} from "@bepalo/router";
import { db } from "~/db";
import { tables } from "~/db/schema";
import { eq } from "drizzle-orm";
import { parseAuth, parseSession, type CTXSession } from "~/middleware";
import { chapaConfig, config } from "~/config";

const CHAPA_API_URL = chapaConfig.baseUrl + "/transaction/initialize";
const CHAPA_SECRET_KEY = chapaConfig.secretKey;

export default {
  POST: {
    // Add authentication filters to ensure session exists
    FILTER: [parseCookie(), authenticate({ parseAuth }), parseSession()],
    HANDLER: [
      async (request, ctx) => {
        try {
          // Ensure session and user exist
          if (!ctx.session?.userId) {
            return json({ error: "Unauthorized" }, { status: 401 });
          }

          const body = await request.json();
          const { amount, currency, email, taskId, appointmentId, reason } =
            body;

          console.log("Payment request:", {
            amount,
            currency,
            email,
            appointmentId,
            reason,
          });

          if (!amount || amount <= 0) {
            return json({ error: "Invalid amount" }, { status: 400 });
          }

          if (!email) {
            return json({ error: "Email is required" }, { status: 400 });
          }

          // Get user details from session
          const user = ctx.session.user;
          if (!user) {
            return json({ error: "User session not found" }, { status: 401 });
          }

          // Generate unique transaction reference
          const tx_ref = `tx-${Date.now()}-${Math.random().toString(36).substring(7)}`;

          // Prepare Chapa request
          // backend/routes/api/v1/payment/initialize/route.ts

          const chapaPayload = {
            amount: amount.toString(),
            currency: currency || "ETB",
            email: email,
            first_name: user.firstname || "Guest",
            last_name: user.lastname || "User",
            tx_ref: tx_ref,
            callback_url: `${config.publicUrl}/api/v1/payment/verify`,
            return_url: `${config.publicUrl}/dashboard/client/payments/return?tx_ref=${tx_ref}`,
            customization: {
              title: "ServeSync Pay", // Max 16 characters, no special chars
              description: reason || "Appointment Payment",
            },
            meta: {
              appointmentId: appointmentId,
              userId: ctx.session.userId,
            },
          };

          console.log("Chapa payload:", chapaPayload);

          // Store payment record using transactionId field

          await db.insert(tables.payment).values({
            userId: ctx.session.userId,
            appointmentId: appointmentId,
            ...(taskId ? { taskId } : {}),
            transactionId: tx_ref,
            tx_ref,
            amount: amount,
            status: "pending",
            checkoutUrl: "",
            createdAt: new Date(),
            updatedAt: new Date(),
          });

          // Make request to Chapa
          const response = await fetch(CHAPA_API_URL, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(chapaPayload),
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.error("Chapa error:", errorData);

            await db
              .update(tables.payment)
              .set({ status: "failed", updatedAt: new Date() })
              .where(eq(tables.payment.transactionId, tx_ref));

            return json(
              { error: errorData.message || "Payment initialization failed" },
              { status: response.status },
            );
          }

          const data = await response.json();
          console.log("Chapa response:", data);

          // Update checkout URL
          if (data.data?.checkout_url) {
            await db
              .update(tables.payment)
              .set({
                checkoutUrl: data.data.checkout_url,
                updatedAt: new Date(),
              })
              .where(eq(tables.payment.transactionId, tx_ref));
          }

          return json({
            success: true,
            paymentUrl: data.data?.checkout_url,
            reference: tx_ref,
          });
        } catch (error) {
          console.error("Payment initialization error:", error);
          return json(
            { error: "Failed to initialize payment" },
            { status: 500 },
          );
        }
      },
    ],
  },
} satisfies RouterHandlers<CTXCookie & CTXAuth & CTXSession>;
