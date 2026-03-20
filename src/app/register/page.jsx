// app/register/page.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Mail, Lock, Eye, EyeOff, MapPin, ArrowLeft, CheckCircle, Briefcase } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    sector: "",
    email: "",
    password: "",
    confirmPassword: "",
    region: "",
    city: "",
    address: "",
    pricingPlan: "",
  });
  const [errors, setErrors] = useState({});

  const regions = [
    "Addis Ababa", "Afar", "Amhara", "Benishangul-Gumuz", "Central Ethiopia",
    "Dire Dawa", "Gambela", "Harari", "Oromia", "Sidama", "Somali",
    "South Ethiopia", "South West Ethiopia", "Tigray"
  ];

  const citiesByRegion = {
    "Addis Ababa": ["Addis Ababa", "Bole", "Kirkos", "Lideta", "Yeka", "Gulele", "Kolfe Keranio", "Nifas Silk-Lafto", "Akaki Kality"],
    "Afar": ["Semera", "Asayita", "Awash", "Dubti", "Mile", "Logiya"],
    "Amhara": ["Bahir Dar", "Gondar", "Dessie", "Debre Markos", "Debre Tabor", "Lalibela", "Woldia", "Kombolcha"],
    "Oromia": ["Adama", "Jimma", "Bishoftu", "Ambo", "Shashamane", "Nekemte", "Asella", "Burayu", "Sebeta"],
    "Tigray": ["Mekelle", "Adigrat", "Axum", "Shire", "Adwa", "Humera", "Wukro"],
    "Sidama": ["Hawassa", "Yirgalem", "Aleta Wondo", "Wendo"],
    "Somali": ["Jijiga", "Gode", "Kebri Dahar", "Degahabur"],
    "Harari": ["Harar"],
    "Dire Dawa": ["Dire Dawa"],
    "Gambela": ["Gambela"],
    "Benishangul-Gumuz": ["Assosa"],
    "Central Ethiopia": ["Hosaena", "Butajira", "Worabe"],
    "South Ethiopia": ["Arba Minch", "Jinka", "Konso", "Dilla"],
    "South West Ethiopia": ["Bonga", "Mizan Teferi", "Tepi"],
  };

  const pricingPlans = ["Free Plan", "Small Plan", "Medium Plan", "Large Plan"];

  const getCities = () => citiesByRegion[formData.region] || [];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === "region") setFormData(prev => ({ ...prev, city: "" }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.companyName) newErrors.companyName = "Company name is required";
    if (!formData.sector) newErrors.sector = "Sector name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Minimum 6 characters";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords don't match";
    if (!formData.region) newErrors.region = "Select a region";
    if (!formData.city) newErrors.city = "Select a city";
    if (!formData.pricingPlan) newErrors.pricingPlan = "Select a plan";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      console.log("Registration data:", formData);
      setIsSubmitting(false);
      router.push("/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mb-6">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
            ← Back to Home
          </Link>
        </div>

        <div className="text-center">
          <div className="flex justify-center">
            <div className="h-12 w-12 rounded-full bg-green-600 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-green-900">Create Your Account</h2>
          <p className="mt-2 text-sm text-gray-600">Register your company to start managing bookings</p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Pricing Link */}
          <div className="mb-6 text-center">
            <p className="text-sm text-gray-600">
              Need more features?{" "}
              <Link href="/pricing" className="font-medium text-green-600 hover:text-green-700">
                View Pricing Plans →
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                Company Name *
              </Label>
              <div className="mt-1 relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => handleChange("companyName", e.target.value)}
                  className={`pl-9 ${errors.companyName ? "border-red-500" : "border-gray-300"}`}
                  placeholder="e.g., Helen Automotive"
                />
              </div>
              {errors.companyName && <p className="mt-1 text-xs text-red-500">{errors.companyName}</p>}
            </div>

            <div>
              <Label htmlFor="sector" className="block text-sm font-medium text-gray-700">
                Sector Name *
              </Label>
              <div className="mt-1 relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="sector"
                  type="text"
                  value={formData.sector}
                  onChange={(e) => handleChange("sector", e.target.value)}
                  className={`pl-9 ${errors.sector ? "border-red-500" : "border-gray-300"}`}
                  placeholder="e.g., Automotive, Technology, Healthcare, Hospitality"
                />
              </div>
              {errors.sector && <p className="mt-1 text-xs text-red-500">{errors.sector}</p>}
            </div>

            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address *
              </Label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className={`pl-9 ${errors.email ? "border-red-500" : "border-gray-300"}`}
                  placeholder="contact@company.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            <div>
              <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password *
              </Label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className={`pl-9 pr-9 ${errors.password ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password *
              </Label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  className={`pl-9 pr-9 ${errors.confirmPassword ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
            </div>

            <div>
              <Label htmlFor="region" className="block text-sm font-medium text-gray-700">
                Region *
              </Label>
              <div className="mt-1 relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                <Select value={formData.region} onValueChange={(value) => handleChange("region", value)}>
                  <SelectTrigger className={`pl-9 ${errors.region ? "border-red-500" : "border-gray-300"}`}>
                    <SelectValue placeholder="Select a region" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map(region => <SelectItem key={region} value={region}>{region}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              {errors.region && <p className="mt-1 text-xs text-red-500">{errors.region}</p>}
            </div>

            <div>
              <Label htmlFor="city" className="block text-sm font-medium text-gray-700">
                City *
              </Label>
              <div className="mt-1 relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                <Select value={formData.city} onValueChange={(value) => handleChange("city", value)} disabled={!formData.region}>
                  <SelectTrigger className={`pl-9 ${errors.city ? "border-red-500" : "border-gray-300"}`}>
                    <SelectValue placeholder={formData.region ? "Select a city" : "Select region first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {getCities().map(city => <SelectItem key={city} value={city}>{city}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
            </div>

            <div>
              <Label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Street Address
              </Label>
              <div className="mt-1">
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  className="border-gray-300"
                  placeholder="Your business address"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="pricingPlan" className="block text-sm font-medium text-gray-700">
                Choose Pricing Plan *
              </Label>
              <div className="mt-1">
                <Select value={formData.pricingPlan} onValueChange={(value) => handleChange("pricingPlan", value)}>
                  <SelectTrigger className={errors.pricingPlan ? "border-red-500" : "border-gray-300"}>
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {pricingPlans.map(plan => <SelectItem key={plan} value={plan.toLowerCase()}>{plan}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              {errors.pricingPlan && <p className="mt-1 text-xs text-red-500">{errors.pricingPlan}</p>}
            </div>

            <div>
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
                {isSubmitting ? "Creating account..." : "Create Account"}
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-green-600 hover:text-green-700">
                  Sign in
                </Link>
              </p>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                <CheckCircle className="inline h-3 w-3 mr-1" />
                Secure registration · 256-bit encryption
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}