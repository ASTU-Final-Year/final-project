"use client";

import { use, useEffect, useState } from "react";
import { redirect, RedirectType, useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  LogIn,
  HomeIcon,
  Loader2,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { useSessionStore } from "@/store";
import Auth from "@/lib/auth";
import Link from "next/link";

export default function LoginFormContent({ searchParams }) {
  const router = useRouter();
  const params = use(searchParams);
  const redirectUrl = params["r"] && decodeURIComponent(params["r"]);

  const session = useSessionStore(({ session }) => session);
  const [_loaded, _setLoaded] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    if (!_loaded)
      (async () => {
        // if (_loaded && session?.user != null) {
        //   router.push(redirectUrl || "/dashboard");
        // }
        Auth.isLoggedIn().then((isLoggedIn) => {
          if (isLoggedIn) {
            router.push(redirectUrl || "/dashboard");
          }
        });
        _setLoaded(true);
      })();
  }, [router, _loaded, session?.user, redirectUrl]);

  if (!_loaded) {
    return null;
  }

  const validateEmail = (emailValue) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailValue);
  };

  const handleLogin = (e) => {
    if (e) e.preventDefault();

    // Reset errors
    setError("");
    setEmailError("");

    // Validation
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    const body = { email, password };
    Auth.login(body)
      .then(({ session }) => {
        setError("");
        setSuccess(true);
        setTimeout(() => {
          router.push(redirectUrl || "/dashboard");
        }, 800);
      })
      .catch(({ message }) => {
        setIsLoading(false);
        setError(message || "Login failed. Please try again.");
      });
  };

  return (
    <div className="min-h-screen flex flex-col py-16 px-4">
      <div className="container mx-auto w-full max-w-sm">
        <div className="text-center mb-10">
          {/* <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 mb-4">
            <ShieldCheck className="h-8 w-8 text-primary" />
          </div> */}
          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">
            Sign in to get started
          </h1>
          <p className="text-slate-300 text-sm mt-2">
            Welcome back to your workspace
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-5 rounded shadow-xl overflow-hidden px-4 py-10">
          <CardContent className="">
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Error Message */}
              {error && (
                <Alert variant="destructive" className="py-2.5">
                  <AlertDescription className="text-xs font-medium text-center">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Success Message */}
              {success && (
                <Alert className="py-2.5 bg-green-50 border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-xs font-medium text-center text-green-700">
                    Login successful! Redirecting...
                  </AlertDescription>
                </Alert>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="contact@company.com"
                    value={email}
                    autoComplete="email"
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError("");
                      if (emailError) setEmailError("");
                    }}
                    className={cn(
                      "pl-10 h-11",
                      (error || emailError) &&
                        "border-destructive focus-visible:ring-destructive",
                    )}
                    disabled={isLoading || success}
                  />
                </div>
                {emailError && (
                  <p className="text-xs font-medium text-red-500">
                    {emailError}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password <span className="text-red-500">*</span>
                  </Label>
                  <Button
                    type="button"
                    variant="link"
                    className="p-0 h-auto text-[11px] font-semibold text-primary hover:underline"
                    disabled={isLoading || success}
                    title="Password reset coming soon"
                  >
                    Forgot password?
                  </Button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    autoComplete="current-password"
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError("");
                    }}
                    className={cn(
                      "pl-10 pr-10 h-11",
                      error &&
                        "border-destructive focus-visible:ring-destructive",
                    )}
                    disabled={isLoading || success}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                    disabled={isLoading || success}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full h-11 text-base font-semibold mt-2 shadow-md hover:shadow-lg transition-all"
                disabled={isLoading || success}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : success ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Logged in successfully
                  </>
                ) : (
                  <>
                    Sign In
                    <LogIn className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>

          {/* Footer - Matches the Register page style with a light background */}
          <CardFooter className="flex flex-col border-t p-6 bg-slate-50/50">
            {/* Footer */}
            <p className="text-sm text-slate-500 text-center flex justify-center gap-3">
              <Link
                href="/"
                className="font-semibold text-primary hover:underline flex"
              >
                <HomeIcon size={18} />
              </Link>
              <span>
                <span> Don&apos;t have an account yet? </span>
                <Link
                  href="/register"
                  className="font-semibold text-primary hover:underline"
                >
                  Create One
                </Link>
              </span>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
