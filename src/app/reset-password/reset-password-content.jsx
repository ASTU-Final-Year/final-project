"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import Auth from "@/lib/auth";

export default function ResetPasswordContent({ searchParams }) {
  const router = useRouter();
  const params = use(searchParams);
  const token = params["t"] ? decodeURIComponent(params["t"]) : "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!token) {
      setError("Invalid or missing reset link. Request a new one from the login page.");
      return;
    }
    if (password.length < 8 || password.length > 30) {
      setError("Password must be between 8 and 30 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setIsSubmitting(true);
    setError("");
    Auth.resetPassword({ token, password })
      .then(({ message }) => {
        setSuccess(message);
        setIsSubmitting(false);
        setTimeout(() => router.push("/login"), 2000);
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
            Choose a new password
          </h1>
        </div>

        <Card className="border-5 rounded shadow-xl overflow-hidden px-4 py-10">
          <CardContent>
            {!token ? (
              <Alert variant="destructive" className="py-2.5">
                <AlertDescription className="text-xs font-medium text-center">
                  This reset link is invalid. Please request a new one.
                </AlertDescription>
              </Alert>
            ) : (
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
                    <AlertDescription className="text-xs font-medium text-center text-green-800 flex items-center justify-center gap-1">
                      <CheckCircle2 className="h-4 w-4" />
                      {success}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    New Password *
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="8–30 characters"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (error) setError("");
                      }}
                      className={cn("pl-10 pr-10 h-11", error && "border-destructive")}
                      disabled={!!success}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">
                    Confirm Password *
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Re-enter your password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (error) setError("");
                      }}
                      className={cn("pl-10 h-11", error && "border-destructive")}
                      disabled={!!success}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 text-base font-semibold mt-2"
                  disabled={isSubmitting || !!success}
                >
                  {isSubmitting ? "Updating..." : "Update password"}
                </Button>
              </form>
            )}
          </CardContent>

          <CardFooter className="flex flex-col border-t p-6 bg-slate-50/50 gap-2">
            <Link
              href="/forgot-password"
              className="text-sm font-semibold text-primary hover:underline"
            >
              Request a new reset link
            </Link>
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
