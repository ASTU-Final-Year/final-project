// src/components/payment/button.jsx
"use client";

import { useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import RequestHandler from "@/lib/request-handler";
import { toast } from "sonner";

export default function PaymentButton({
  amount,
  currency = "ETB",
  appointmentId,
  email,
  reason,
  onSuccess,
  onError,
  children,
}) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    if (!amount || amount <= 0) {
      toast.error("Invalid payment amount");
      onError?.("Invalid payment amount");
      return;
    }

    if (!email) {
      toast.error("Email is required for payment");
      onError?.("Email is required");
      return;
    }

    setIsProcessing(true);

    try {
      const res = await RequestHandler.Post("/api/v1/payment/initialize", {
        body: {
          amount: amount,
          currency: currency,
          email: email,
          reason: reason || "Appointment Payment",
          appointmentId: appointmentId,
        },
      });

      if (res.ok) {
        const data = await res.json();

        if (data.success && data.paymentUrl) {
          onSuccess?.(data);
          // Redirect to payment gateway
          window.location.href = data.paymentUrl;
        } else {
          throw new Error(data.error || "Payment initialization failed");
        }
      } else {
        const error = await res.json();
        throw new Error(error.error || "Payment failed");
      }
    } catch (error) {
      console.error("Payment failed:", error);
      toast.error(error.message || "Payment failed. Please try again.");
      onError?.(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Button onClick={handlePayment} disabled={isProcessing} className="w-full">
      {isProcessing ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <CreditCard className="h-4 w-4 mr-2" />
          {children || `Pay ${amount.toLocaleString()} ${currency}`}
        </>
      )}
    </Button>
  );
}
