// backend/routes/api/v1/payment/verify/route.ts
import { json, type RouterHandlers } from "@bepalo/router";
import { db } from "~/db";
import { tables } from "~/db/schema";
import { eq } from "drizzle-orm";
import { chapaConfig } from "~/config";

const CHAPA_API_URL = chapaConfig.baseUrl + "/transaction/verify/";
const CHAPA_SECRET_KEY = chapaConfig.secretKey;

export default {
  GET: {
    HANDLER: [
      async (request, ctx) => {
        const url = new URL(request.url);
        let tx_ref = url.searchParams.get("tx_ref");
        if (!tx_ref) {
          tx_ref = url.searchParams.get("trx_ref");
        }

        console.log("Payment verification request:", { tx_ref });

        if (!tx_ref) {
          return json(
            { error: "Transaction reference required" },
            { status: 400 },
          );
        }

        try {
          // Find payment by transactionId
          const [payment] = await db
            .select()
            .from(tables.payment)
            .where(eq(tables.payment.transactionId, tx_ref))
            .limit(1);

          if (!payment) {
            console.log("Payment not found for tx_ref:", tx_ref);
            return json({ error: "Payment not found" }, { status: 404 });
          }

          if (payment.status === "completed") {
            return json({
              success: true,
              message: "Payment already verified",
              payment: payment,
            });
          }

          // Verify with Chapa
          const response = await fetch(`${CHAPA_API_URL}${tx_ref}`, {
            headers: {
              Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
            },
          });

          const data = await response.json();

          if (data.data?.status === "success") {
            // Update payment status
            const [updatedPayment] = await db
              .update(tables.payment)
              .set({
                status: "completed",
                updatedAt: new Date(),
              })
              .where(eq(tables.payment.transactionId, tx_ref))
              .returning();

            // Update appointment status
            if (payment.appointmentId) {
              await db
                .update(tables.appointment)
                .set({
                  status: "scheduled",
                  updatedAt: new Date(),
                })
                .where(eq(tables.appointment.id, payment.appointmentId));
            }

            // Update task if this payment is linked to a task
            if (payment.taskId) {
              // Fetch the task first to get existing submissions
              const [task] = await db
                .select()
                .from(tables.task)
                .where(eq(tables.task.id, payment.taskId))
                .limit(1);

              if (task) {
                // Create updated submissions object with payment info
                const currentSubmissions = task.submissions || {};
                const updatedSubmissions = {
                  ...currentSubmissions,
                  payment: {
                    completed: true,
                    reference: tx_ref,
                    amount: payment.amount,
                    // currency: payment.currency,
                    completedAt: new Date().toISOString(),
                    method: "chapa",
                    transactionId: data.data.reference,
                  },
                };

                await db
                  .update(tables.task)
                  .set({
                    submissions: updatedSubmissions,
                    // status: "completed",
                    // isDone: true,
                    // completedAt: new Date(),
                    // updatedAt: new Date(),
                  })
                  .where(eq(tables.task.id, payment.taskId));
              }
            }

            return json({
              success: true,
              message: "Payment verified successfully",
              payment: updatedPayment || payment,
            });
          }

          return json({
            success: false,
            message: "Payment verification failed",
          });
        } catch (error) {
          console.error("Payment verification error:", error);
          return json({ error: "Verification failed" }, { status: 500 });
        }
      },
    ],
  },
} satisfies RouterHandlers;
