// src/app/appointments/success/page.jsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function BookingSuccessPage() {
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get("id");

  return (
    <div
      className="w-full h-[100vh] bg-cover"
      style={{
        backgroundImage:
          'url("/images/pexels-lovetosmile-36200692-blurred-dim.jpg")',
      }}
    >
      <div className="container mx-auto px-4 py-16 max-w-md">
        <Card className="text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl">Booking Confirmed!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Your appointment has been successfully booked. You will receive a
              confirmation email and SMS with the details.
            </p>
            {appointmentId && (
              <p className="text-sm text-muted-foreground">
                Appointment ID: {appointmentId}
              </p>
            )}
            <div className="flex gap-3 pt-4">
              <Button asChild className="flex-1">
                <Link href="/dashboard/client/appointments">
                  View My Appointments
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
