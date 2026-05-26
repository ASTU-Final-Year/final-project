// src/components/payment/verification.jsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import RequestHandler from "@/lib/request-handler";
import { toast } from "sonner";

export default function PaymentVerification() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState("verifying");
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      const tx_ref = searchParams.get("tx_ref");
      const status = searchParams.get("status");
      const transaction_id = searchParams.get("transaction_id");

      if (!tx_ref) {
        setStatus("failed");
        toast.error("Invalid payment verification");
        return;
      }

      try {
        const res = await RequestHandler.Get(
          `/api/v1/payment/verify?tx_ref=${tx_ref}`,
        );

        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setStatus("success");
            setPaymentDetails(data.payment);
            toast.success("Payment verified successfully!");

            // Clear stored pending payment
            sessionStorage.removeItem("pendingPayment");
          } else {
            setStatus("failed");
            toast.error(data.message || "Payment verification failed");
          }
        } else {
          setStatus("failed");
          toast.error("Failed to verify payment");
        }
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("failed");
        toast.error("Payment verification failed");
      }
    };

    verifyPayment();
  }, [searchParams]);

  if (status === "verifying") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg font-medium">Verifying your payment...</p>
        <p className="text-sm text-muted-foreground">Please wait</p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="max-w-md mx-auto mt-12">
        <Card className="text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Your payment has been processed successfully.
            </p>
            {paymentDetails && (
              <div className="bg-muted/30 p-4 rounded-lg text-left space-y-2">
                <p className="text-sm">
                  <strong>Amount:</strong> {paymentDetails.amount}{" "}
                  {paymentDetails.currency}
                </p>
                <p className="text-sm">
                  <strong>Transaction ID:</strong>{" "}
                  {paymentDetails.transactionId}
                </p>
                <p className="text-sm">
                  <strong>Date:</strong>{" "}
                  {new Date(paymentDetails.createdAt).toLocaleString()}
                </p>
              </div>
            )}
            <div className="flex gap-3">
              <Button
                onClick={() => router.push("/dashboard/client/tasks")}
                className="flex-1"
              >
                View My Tasks
              </Button>
              <Button
                onClick={() => router.push("/")}
                variant="outline"
                className="flex-1"
              >
                Go Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-12">
      <Card className="text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <XCircle className="h-16 w-16 text-red-500" />
          </div>
          <CardTitle className="text-2xl">Payment Failed</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Your payment could not be processed. Please try again.
          </p>
          <div className="flex gap-3">
            <Button onClick={() => window.history.back()} className="flex-1">
              Try Again
            </Button>
            <Button
              onClick={() => router.push("/dashboard/client/tasks")}
              variant="outline"
              className="flex-1"
            >
              View Tasks
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
