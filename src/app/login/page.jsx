// app/login/page.jsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // ADD THIS IMPORT
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginPage({ onBackClick, onLoginSuccess, onSignupClick }) {
  // ADD THIS LINE - initialize router
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = () => {
    // Validation
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    // Get registered companies from localStorage
    const companies = JSON.parse(localStorage.getItem('registeredCompanies') || '[]');
    
    // Find company with matching email and password
    const company = companies.find(c => c.email === email && c.password === password);
    
    if (company) {
      console.log('✅ Login successful:', company.name);
      setError('');
      onLoginSuccess(company);
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50/30 py-8">
      <div className="container mx-auto px-4 max-w-md">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={onBackClick}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </div>

        {/* Login Card */}
        <Card className="border-2 shadow-xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-3xl font-bold text-primary">Welcome Back</CardTitle>
            <CardDescription>Sign in to your company account</CardDescription>
          </CardHeader>

          <CardContent>
            {/* Error Message */}
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
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
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password *
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <Button variant="link" className="p-0 h-auto text-sm text-primary">
                  Forgot password?
                </Button>
              </div>

              {/* Login Button */}
              <Button 
                onClick={handleLogin}
                className="w-full h-11 text-base font-semibold"
              >
                Sign In
              </Button>
            </div>
          </CardContent>

          {/* UPDATED FOOTER - This now navigates to registration page */}
          <CardFooter className="flex justify-center border-t pt-6">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Button
                variant="link"
                onClick={() => router.push('/register')} // CHANGED THIS LINE
                className="p-0 h-auto text-sm font-semibold text-primary"
              >
                Register your company
              </Button>
            </p>
          </CardFooter>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Secure login • 256-bit encryption
        </p>
      </div>
    </div>
  );
}