"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  Mail,
  Lock,
  User,
  Phone,
  Globe,
  ChevronRight,
  ChevronLeft,
  Eye,
  EyeOff,
  CheckCircle2,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePricingPlanStore } from "@/store";
import RequestHandler from "@/lib/request-handler";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Auth from "@/lib/auth";

export default function RegisterOrganizationContent({ searchParams }) {
  const router = useRouter();
  const params = use(searchParams);
  const planQuery = params["plan"];

  const pricingPlans = usePricingPlanStore((state) => state.pricingPlans);
  const setPricingPlans = usePricingPlanStore((state) => state.setPricingPlans);
  const selectedPlan = usePricingPlanStore((state) => state.selectedPlan);
  const setSelectedPlan = usePricingPlanStore((state) => state.setSelectedPlan);

  const [step, setStep] = useState(1);
  const [steped, setSteped] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    gender: "",
    adminEmail: "",
    adminPhone: "",
    password: "",
    name: "",
    slug: "",
    description: "",
    sector: "",
    isGovernment: false,
    address: "",
    orgEmail: "",
    orgPhone: "",
    pricingPlanId: "",
    billingPeriodAnnual: false,
  });

  // Add these to your state declarations
  const [sectors, setSectors] = useState([
    "Automotive",
    "Beauty",
    "Government",
    "Healthcare",
    "Technology",
  ]);
  const [newSector, setNewSector] = useState("");

  // Function to handle adding a custom sector
  const handleAddSector = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevents the select dropdown from closing

    const trimmed = newSector.trim();
    if (trimmed && !sectors.includes(trimmed)) {
      setSectors((prev) => [...prev, trimmed]);
      handleChange("sector", trimmed); // Automatically select the newly added sector
      setNewSector("");
    }
  };
  const [errors, setErrors] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) (async () => setLoaded(true))();
    if (loaded) {
      RequestHandler.Get("/api/v1/pricing-plans").then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          if (data?.pricingPlans) {
            setPricingPlans(data.pricingPlans);
            setSelectedPlan(data.pricingPlans[0].id);
          }
        }
      });
    }
  }, [loaded, setPricingPlans, setSelectedPlan]);

  useEffect(() => {
    const initialPlanId =
      planQuery ||
      selectedPlan ||
      (pricingPlans?.length > 0 ? pricingPlans[0] : "");
    if (initialPlanId) {
      setFormData((prev) => ({ ...prev, pricingPlanId: initialPlanId }));
    }
  }, [planQuery, selectedPlan, pricingPlans]);

  useEffect(() => {
    if (formData.name.length >= 3) {
      const generatedSlug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "")
        .substring(0, 30);
      setFormData((prev) => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.name]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validateStep = (currentStep) => {
    const newErrors = {};
    const phoneRegex = /^\+\d{2,3}\s?\d{9,10}$/;
    if (currentStep === 1) {
      if (formData.name.length < 3 || formData.name.length > 54)
        newErrors.name = "3-54 characters";
      if (formData.slug.length < 3 || formData.slug.length > 30)
        newErrors.slug = "3-30 characters";
      if (formData.description.length > 200)
        newErrors.description = "Max 200 characters";
      if (formData.sector.length < 3 || formData.sector.length > 30)
        newErrors.sector = "Required";
      if (formData.address.length < 4 || formData.address.length > 50)
        newErrors.address = "4-50 characters";
      if (
        !/\S+@\S+\.\S+/.test(formData.orgEmail) ||
        formData.orgEmail.length > 30
      )
        newErrors.orgEmail = "Invalid email (Max 30)";
      if (!phoneRegex.test(formData.orgPhone))
        newErrors.orgPhone = "Format: +251 900000000";
      if (!formData.pricingPlanId) newErrors.pricingPlanId = "Required";
    } else if (steped === 2) {
      if (formData.firstname.length < 3 || formData.firstname.length > 40)
        newErrors.firstname = "3-40 characters";
      if (formData.lastname.length < 3 || formData.lastname.length > 40)
        newErrors.lastname = "3-40 characters";
      if (!["M", "F", "U"].includes(formData.gender))
        newErrors.gender = "Required";
      if (!phoneRegex.test(formData.adminPhone))
        newErrors.adminPhone = "Format: +251 900000000";
      if (
        !/\S+@\S+\.\S+/.test(formData.adminEmail) ||
        formData.adminEmail.length > 40
      )
        newErrors.adminEmail = "Invalid email (Max 40)";
      if (formData.password.length < 8 || formData.password.length > 30)
        newErrors.password = "8-30 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (steped < 2 || !validateStep(2)) return;
    setIsSubmitting(true);
    const plan = pricingPlans?.find(
      (plan) => plan.id === formData.pricingPlanId,
    );
    const body = {
      admin: {
        firstname: formData.firstname,
        lastname: formData.lastname,
        gender: formData.gender,
        email: formData.adminEmail,
        phone: formData.adminPhone,
        password: formData.password,
      },
      name: formData.name,
      slug: formData.slug,
      description: formData.description,
      sector: formData.sector,
      isGovernment: formData.isGovernment,
      address: formData.address,
      email: formData.orgEmail,
      phone: formData.orgPhone,
      pricingPlanId: formData.pricingPlanId,
      billingPeriod: formData.billingPeriodAnnual ? "annually" : "monthly",
      // billingStart:
      //   plan?.price > 0 ? new Date(Time.after(7).days.fromNow()._ms).toUTCString() : null,
      // billingEnd:
      //   plan?.price > 0
      //     ? new Date(
      //         Time.after(formData.billingPeriodAnnual ? 365 : 30).days.fromNow()
      //           ._ms,
      //       ).toUTCString()
      //     : null,
    };
    Auth.registerOrganization(body)
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
    <div className="max-w-3xl mx-auto w-full">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 mb-4">
          <Building2 className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Set up your workspace
        </h1>
      </div>

      <div className="flex items-center justify-center mb-10">
        <div className="flex items-center">
          <div
            className={cn(
              "flex items-center justify-center h-9 w-9 rounded-full border-2 text-sm font-bold transition-colors",
              step >= 1
                ? "bg-primary border-primary text-white"
                : "border-slate-300 text-slate-400",
            )}
          >
            {step > 1 ? <CheckCircle2 className="h-5 w-5" /> : "1"}
          </div>
          <span
            className={cn(
              "ml-3 text-sm font-semibold",
              step >= 1 ? "text-slate-900" : "text-slate-500",
            )}
          >
            Organization Details
          </span>
        </div>
        <div
          className={cn(
            "w-16 h-0.5 mx-4 transition-colors",
            step >= 2 ? "bg-primary" : "bg-slate-200",
          )}
        />
        <div className="flex items-center">
          <div
            className={cn(
              "flex items-center justify-center h-9 w-9 rounded-full border-2 text-sm font-bold transition-colors",
              step >= 2
                ? "bg-primary border-primary text-white"
                : "border-slate-300 text-slate-400",
            )}
          >
            2
          </div>
          <span
            className={cn(
              "ml-3 text-sm font-semibold",
              step >= 1 ? "text-slate-900" : "text-slate-500",
            )}
          >
            Admin Details
          </span>
        </div>
      </div>

      <div className="bg-white shadow-slate-200/50 rounded border-5 shadow-xl overflow-hidden">
        {/* Error Message */}
        {error && (
          <Alert variant="destructive" className="py-2.5">
            <AlertDescription className="text-xs font-medium text-center">
              {error}
            </AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit} className="p-8 sm:p-12">
          {step === 2 ? (
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
                        errors.firstname && "border-red-500",
                      )}
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
                  <Input
                    className={cn("h-12", errors.lastname && "border-red-500")}
                    value={formData.lastname}
                    onChange={(e) => handleChange("lastname", e.target.value)}
                  />
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
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Male</SelectItem>
                      <SelectItem value="F">Female</SelectItem>
                      <SelectItem value="U">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium">
                    Admin Phone <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      className={cn(
                        "pl-11 h-12",
                        errors.adminPhone && "border-red-500",
                      )}
                      placeholder="+251 900000000"
                      value={formData.adminPhone}
                      onChange={(e) =>
                        handleChange("adminPhone", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label className="text-slate-700 font-medium">
                    Admin Email <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      className={cn(
                        "pl-11 h-12",
                        errors.adminEmail && "border-red-500",
                      )}
                      isSubmitting
                      type="email"
                      value={formData.adminEmail}
                      onChange={(e) =>
                        handleChange("adminEmail", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label className="text-slate-700 font-medium">
                    Password <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      className={cn(
                        "pl-11 pr-11 h-12",
                        errors.password && "border-red-500",
                      )}
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                {/* Organization Name */}
                <div className="md:col-span-2 space-y-2">
                  <Label className="text-slate-700 font-medium">
                    Organization Name <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      className={cn(
                        "pl-11 h-12",
                        errors.name && "border-red-500",
                      )}
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-xs font-medium text-red-500 mt-1">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Organization Description */}
                <div className="md:col-span-2 space-y-2">
                  <Label className="text-slate-700 font-medium">
                    Description
                  </Label>
                  <Textarea
                    className="min-h-[100px]"
                    value={formData.description}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                  />
                </div>

                {/* Organization slug */}
                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium">
                    Slug (URL) <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      className="pl-11 h-12 bg-slate-50 text-slate-500"
                      value={formData.slug}
                      readOnly
                    />
                  </div>
                </div>

                {/* Organization Sector */}
                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium">
                    Sector <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.sector}
                    onValueChange={(v) => handleChange("sector", v)}
                  >
                    <SelectTrigger
                      className={cn(
                        "min-h-12 h-12 w-full",
                        errors.sector && "border-red-500 focus:ring-red-500",
                      )}
                    >
                      <SelectValue placeholder="Select or add a sector" />
                    </SelectTrigger>

                    <SelectContent>
                      {/* Dynamic List of Options */}
                      {sectors.map((sector) => (
                        <SelectItem key={sector} value={sector}>
                          {sector}
                        </SelectItem>
                      ))}

                      {/* Dynamic Addition Input */}
                      <div className="flex items-center gap-2 p-2 mt-2 border-t border-slate-100">
                        <Input
                          placeholder="Add custom sector..."
                          value={newSector}
                          onChange={(e) => setNewSector(e.target.value)}
                          className="h-9 text-sm"
                          onKeyDown={(e) => {
                            // Stop Radix from hijacking keystrokes for navigation
                            e.stopPropagation();
                            if (e.key === "Enter") {
                              handleAddSector(e);
                            }
                          }}
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          className="h-9 px-3"
                          onClick={handleAddSector}
                          disabled={!newSector.trim()}
                        >
                          Add
                        </Button>
                      </div>
                    </SelectContent>
                  </Select>
                  {errors.sector && (
                    <p className="text-xs font-medium text-red-500 mt-1">
                      {errors.sector}
                    </p>
                  )}
                </div>

                {/* Organization Address */}
                <div className="md:col-span-2 space-y-2">
                  <Label className="text-slate-700 font-medium">
                    Full Address <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      className={cn(
                        "pl-11 h-12",
                        errors.address && "border-red-500",
                      )}
                      placeholder="e.g., Mexico, Addis Ababa"
                      value={formData.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                    />
                  </div>
                </div>

                {/* Organization Email */}
                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium">
                    Organization Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    className={cn("h-12", errors.orgEmail && "border-red-500")}
                    type="email"
                    value={formData.orgEmail}
                    onChange={(e) => handleChange("orgEmail", e.target.value)}
                  />
                </div>

                {/* Organization Phone */}
                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium">
                    Organization Phone <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    className={cn("h-12", errors.orgPhone && "border-red-500")}
                    placeholder="+251 900000000"
                    value={formData.orgPhone}
                    onChange={(e) => handleChange("orgPhone", e.target.value)}
                  />
                </div>

                {/* Organization Pricing Plan */}
                <div className="md:col-span-2 space-y-2 flex flex-col sm:grid sm:grid-cols-2 gap-4">
                  {/*  */}
                  <div className="col-span-1 space-y-2">
                    <Label className="text-slate-700 font-medium">
                      Pricing Plan <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.pricingPlanId}
                      onValueChange={(v) => handleChange("pricingPlanId", v)}
                    >
                      <SelectTrigger
                        className={cn(
                          "min-h-12 h-12 w-full mb-0 bg-primary/5",
                          errors.pricingPlanId && "border-red-500",
                        )}
                      >
                        <SelectValue placeholder="Select a plan" />
                      </SelectTrigger>
                      <SelectContent>
                        {pricingPlans?.length > 0 ? (
                          pricingPlans.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="free">Free Plan</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  {/*  */}
                  <div className="space-y-0.5 col-span-1 pt-5">
                    <Label className="text-base font-normal">
                      <Switch
                        size="default"
                        checked={formData.billingPeriodAnnual}
                        onCheckedChange={(checked) =>
                          handleChange("billingPeriodAnnual", checked)
                        }
                      />
                      Annual Billing
                    </Label>
                    <p className="text-sm text-slate-500 ml-10">
                      Billing will be calculated and done anually
                    </p>
                  </div>
                </div>

                {/* Organization is Government */}
                <div className="md:col-span-2 flex flex-col gap-4 items-start justify-between rounded-lg">
                  {/*  */}
                  <div className="space-y-0.5">
                    <Label className="text-base font-normal">
                      <Switch
                        size="default"
                        checked={formData.isGovernment}
                        onCheckedChange={(checked) =>
                          handleChange("isGovernment", checked)
                        }
                      />
                      Government Organization
                    </Label>
                    <p className="text-sm text-slate-500 ml-10">
                      Enable if this is a state or federal entity.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-4 pt-10 mt-10 border-t border-slate-100">
            {step === 2 && (
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-12"
                onClick={() => {
                  setSteped(1);
                  setStep(1);
                }}
              >
                <ChevronLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            )}
            {step === 1 ? (
              <Button
                type="button"
                className="w-full h-12 font-bold"
                onClick={() => {
                  if (validateStep(1)) {
                    setStep(2);
                    setTimeout(() => setSteped(2), 500);
                  }
                }}
              >
                Next Step <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                className="flex-[2] h-12 font-bold"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Create Workspace"}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
