// src/app/dashboard/client/payments/return/page.jsx
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import RequestHandler from "@/lib/request-handler";
import { toast } from "sonner";

function PaymentReturnContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState("verifying");
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      // Chapa sometimes sends 'trx_ref' instead of 'tx_ref'
      let tx_ref = searchParams.get("tx_ref");
      if (!tx_ref) {
        tx_ref = searchParams.get("trx_ref");
      }

      const status_param = searchParams.get("status");

      console.log("Payment return params:", { tx_ref, status_param });

      if (!tx_ref) {
        setStatus("failed");
        toast.error("Invalid payment response");
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
            toast.success("Payment successful! Your appointment is confirmed.");
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
              Your payment has been processed successfully. Your appointment is
              now confirmed.
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
                onClick={() => router.push("/dashboard/client/appointments")}
                className="flex-1"
              >
                View My Appointments
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
            Your payment could not be processed. Please try again or contact
            support.
          </p>
          <div className="flex gap-3">
            <Button onClick={() => router.back()} className="flex-1">
              Try Again
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

export default function PaymentReturnPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <PaymentReturnContent />
    </Suspense>
  );
}
