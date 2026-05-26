// ROUTE /api/v1/payment/webhook.ts
import { json, type RouterHandlers } from "@bepalo/router";
import { db } from "~/db";
import { tables } from "~/db/schema";
import { eq } from "drizzle-orm";
import PaymentService from "~/services/payment.service";
import NotificationService from "~/services/notifcation.service";

export default {
  POST: {
    HANDLER: [
      async (request) => {
        const body = await request.json();
        const { tx_ref, status } = body;

        if (!tx_ref) {
          return json(
            { error: "Missing transaction reference" },
            { status: 400 },
          );
        }

        // Verify payment with Chapa
        const verification = await PaymentService.verifyPayment(tx_ref);

        if (
          verification.status === "success" &&
          verification.data.status === "success"
        ) {
          // Update payment status
          await db
            .update(tables.payment)
            .set({
              status: "completed",
              updatedAt: new Date(),
            })
            .where(eq(tables.payment.transactionId, tx_ref));

          // Get payment record
          const [payment] = await db
            .select()
            .from(tables.payment)
            .where(eq(tables.payment.transactionId, tx_ref));

          if (payment && payment.taskId) {
            // Update task status
            const [task] = await db
              .select()
              .from(tables.task)
              .where(eq(tables.task.id, payment.taskId));

            if (task) {
              await db
                .update(tables.task)
                .set({
                  submissions: {
                    ...task.submissions,
                    payment: {
                      status: "completed",
                      completedAt: new Date().toISOString(),
                    },
                  },
                })
                .where(eq(tables.task.id, task.id));

              // Notify user
              await NotificationService.create(payment.userId, {
                type: "payment_received",
                title: "Payment Successful",
                message: `Your payment of ${payment.amount} ETB has been processed successfully.`,
                priority: "high",
                metadata: { taskId: task.id, amount: payment.amount },
              });
            }
          }
        } else {
          await db
            .update(tables.payment)
            .set({
              status: "failed",
              updatedAt: new Date(),
            })
            .where(eq(tables.payment.transactionId, tx_ref));
        }

        return json({ success: true });
      },
    ],
  },
} satisfies RouterHandlers;
