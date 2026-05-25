"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Auth from "@/lib/auth";

export default function ForgotPasswordContent() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your email address");
      setSuccess("");
      return;
    }
    setIsSubmitting(true);
    setError("");
    setSuccess("");
    Auth.requestPasswordReset({ email: email.trim() })
      .then(({ message }) => {
        setSuccess(message);
        setIsSubmitting(false);
      })
      .catch(({ message }) => {
        setError(message);
        setIsSubmitting(false);
      });
  };

  return (
    <div className="min-h-screen flex flex-col py-16 px-4">
      <div className="container mx-auto w-full max-w-[450px]">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">
            Reset your password
          </h1>
          <p className="text-slate-300 mt-2 text-sm">
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

        <Card className="border-5 rounded shadow-xl overflow-hidden px-4 py-10">
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="py-2.5">
                  <AlertDescription className="text-xs font-medium text-center">
                    {error}
                  </AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert className="py-2.5 border-green-200 bg-green-50">
                  <AlertDescription className="text-xs font-medium text-center text-green-800">
                    {success}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address *
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError("");
                    }}
                    className="pl-10 h-11"
                    disabled={!!success}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 text-base font-semibold mt-2"
                disabled={isSubmitting || !!success}
              >
                {isSubmitting ? "Sending..." : "Send reset link"}
                {!isSubmitting && <Send className="ml-2 h-4 w-4" />}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col border-t p-6 bg-slate-50/50">
            <Link
              href="/login"
              className="text-sm font-semibold text-primary hover:underline flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to sign in
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
