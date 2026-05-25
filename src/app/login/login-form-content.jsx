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
  const handleLogin = (e) => {
    if (e) e.preventDefault();
    // Validation
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    const body = { email, password };
    Auth.login(body)
      .then(({ session }) => {
        // setSession(session);
        setError("");
        router.push(redirectUrl || "/dashboard");
      })
      .catch(({ message }) => {
        setError(message);
      });
  };

  return (
    <div className="min-h-screen flex flex-col py-16 px-4">
      <div className="container mx-auto w-full max-w-[450px]">
        <div className="text-center mb-10">
          {/* <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 mb-4">
            <ShieldCheck className="h-8 w-8 text-primary" />
          </div> */}
          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">
            Sign in to get started
          </h1>
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

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address *
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="contact@company.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError("");
                    }}
                    className={cn(
                      "pl-10 h-11",
                      error &&
                        "border-destructive focus-visible:ring-destructive",
                    )}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password *
                  </Label>
                  <Link
                    href="/forgot-password"
                    className="text-[11px] font-semibold text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError("");
                    }}
                    className={cn(
                      "pl-10 pr-10 h-11",
                      error &&
                        "border-destructive focus-visible:ring-destructive",
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
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
              >
                Sign In
                <LogIn className="ml-2 h-4 w-4" />
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
