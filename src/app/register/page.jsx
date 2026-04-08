"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  UserPlus,
  Mail,
  Lock,
  User,
  Phone,
  Building2,
  Briefcase,
  BadgeInfo,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Auth from "@/lib/auth";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function UserRegistrationPage() {
  const router = useRouter();

  const [role, setRole] = useState("client"); // "client" or "employee"
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    gender: "",
    email: "",
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    const phoneRegex = /^\+\d{2,3}\s?\d{9,10}$/;

    // Match schema: "3 <= string <= 40"
    if (formData.firstname.length < 3 || formData.firstname.length > 40) {
      newErrors.firstname = "Must be between 3 and 40 characters";
    }

    if (formData.lastname.length < 3 || formData.lastname.length > 40) {
      newErrors.lastname = "Must be between 3 and 40 characters";
    }

    // Match schema: "'M'|'F'|'U'"
    if (!["M", "F", "U"].includes(formData.gender)) {
      newErrors.gender = "Please select a valid gender";
    }

    // Match schema: "string.email <= 40"
    if (!/\S+@\S+\.\S+/.test(formData.email) || formData.email.length > 40) {
      newErrors.email = "Invalid email format or exceeds 40 characters";
    }

    // Match schema: /^\+\d{2,3}\s?\d{9,10}$/
    if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Format: +251 900000000";
    }

    // Match schema: "8 <= string <= 30"
    if (formData.password.length < 8 || formData.password.length > 30) {
      newErrors.password = "Must be between 8 and 30 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    const body = formData;
    Auth.registerUser(body)
      .then(({ success }) => {
        if (success) {
          setError("");
          setIsSubmitting(false);
          setTimeout(() => {
            router.push("/login");
          }, 1500);
        }
      })
      .catch(({ message }) => {
        setIsSubmitting(false);
        setError(message);
      });
  };

  return (
    <div className="min-h-screen bg-accent flex flex-col py-16 px-4">
      <div className="max-w-3xl mx-auto w-full">
        {/* Header section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded bg-primary/10 mb-4">
            <UserPlus className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Create an Account
          </h1>
          <p className="text-slate-500 mt-2">
            Join the platform as a client or an employee.
          </p>
        </div>

        {/* Role Toggle Switcher */}
        <div className="flex justify-center mb-8">
          <div className="bg-slate-200/50 p-1 rounded inline-flex flex-col sm:flex-row">
            <button
              type="button"
              onClick={() => {
                setRole("client");
                setErrors({});
              }}
              className={cn(
                "px-8 py-2.5 rounded text-sm font-semibold transition-all duration-300",
                role === "client"
                  ? "bg-white text-primary shadow-sm"
                  : "text-slate-500 hover:text-slate-700",
              )}
            >
              Client
            </button>
            <button
              type="button"
              onClick={() => {
                setRole("employee");
                setErrors({});
              }}
              className={cn(
                "px-8 py-2.5 rounded text-sm font-semibold transition-all duration-300",
                role === "employee"
                  ? "bg-white text-primary shadow-sm"
                  : "text-slate-500 hover:text-slate-700",
              )}
            >
              Employee
            </button>
            <button
              type="button"
              onClick={() => {
                router.push("/register/organization");
                setErrors({});
              }}
              className={cn(
                "px-8 py-2.5 bg-primary/80 text-primary-foreground border border-primary/10 rounded text-sm font-semibold transition-all duration-300",
              )}
            >
              <span className="flex items-center">
                Organization <ArrowRight className="ml-2 h-4 w-4" />
              </span>
            </button>
          </div>
        </div>

        {/* Registration Form Card */}
        <div className="bg-white rounded border-5 shadow-xl overflow-hidden">
          {/* Error Message */}
          {error && (
            <Alert variant="destructive" className="py-2.5">
              <AlertDescription className="text-xs font-medium text-center">
                {error}
              </AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="px-8 py-10">
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium">
                    First Name <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      className={cn(
                        "pl-11 h-12",
                        errors.firstname &&
                          "border-red-500 focus-visible:ring-red-500",
                      )}
                      placeholder="Abebe"
                      value={formData.firstname}
                      onChange={(e) =>
                        handleChange("firstname", e.target.value)
                      }
                    />
                  </div>
                  {errors.firstname && (
                    <p className="text-xs font-medium text-red-500 mt-1">
                      {errors.firstname}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium">
                    Last Name <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      className={cn(
                        "pl-11 h-12",
                        errors.lastname &&
                          "border-red-500 focus-visible:ring-red-500",
                      )}
                      placeholder="Bekele"
                      value={formData.lastname}
                      onChange={(e) => handleChange("lastname", e.target.value)}
                    />
                  </div>
                  {errors.lastname && (
                    <p className="text-xs font-medium text-red-500 mt-1">
                      {errors.lastname}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium">
                    Gender <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(v) => handleChange("gender", v)}
                  >
                    <SelectTrigger
                      className={cn(
                        "min-h-12 h-12 w-full mb-0",
                        errors.gender && "border-red-500",
                      )}
                    >
                      <SelectValue className="" placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Male</SelectItem>
                      <SelectItem value="F">Female</SelectItem>
                      <SelectItem value="U">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && (
                    <p className="text-xs font-medium text-red-500 mt-1">
                      {errors.gender}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium">
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      type="email"
                      className={cn(
                        "pl-11 h-12",
                        errors.email &&
                          "border-red-500 focus-visible:ring-red-500",
                      )}
                      placeholder="abebe@example.com"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs font-medium text-red-500 mt-1">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label className="text-slate-700 font-medium">
                    Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      className={cn(
                        "pl-11 h-12",
                        errors.phone &&
                          "border-red-500 focus-visible:ring-red-500",
                      )}
                      placeholder="+251 900000000"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-xs font-medium text-red-500 mt-1">
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label className="text-slate-700 font-medium">
                    Password <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      className={cn(
                        "pl-11 pr-11 h-12",
                        errors.password &&
                          "border-red-500 focus-visible:ring-red-500",
                      )}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs font-medium text-red-500 mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-100">
              <Button
                type="submit"
                className="w-full h-12 font-bold shadow-md hover:shadow-lg transition-all text-base"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Creating account..."
                  : `Register as ${role === "client" ? "Client" : "Employee"}`}
                {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </form>

          {/* Footer */}
          <div className="flex flex-col border-t p-6 bg-slate-50/50">
            <p className="text-sm text-slate-500 text-center">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-primary hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
