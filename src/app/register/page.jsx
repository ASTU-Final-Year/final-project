// app/register/page.jsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2,
  Mail,
  Phone,
  Users,
  Lock,
  Eye,
  EyeOff,
  Check,
  Clock,
  Briefcase,
  Crown,
  Sparkles,
  ArrowLeft,
  AlertCircle,
  Info,
  ChevronRight,
  Scissors,
  Coffee,
  Wrench,
  Zap,
  Plus,
  Trash2,
} from "lucide-react";

import { cn } from "@/lib/utils";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

function RegistrationPage({ onBackClick, onRegisterSuccess, onLoginClick }) {
  const router = useRouter();
  
  // State to store all form data including selected plan
  const [companyData, setCompanyData] = useState({
    name: '',
    sector: '',
    description: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    region: '',
    employeeCount: '',
    password: '',
    confirmPassword: '',
    services: [
      {
        id: 1,
        name: '',
        duration: 40,
        price: 0,
        description: '',
        serviceStartTime: '09:00',
        serviceEndTime: '17:00',
        availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
      }
    ],
    businessHours: {
      monday: { active: true, open: '09:00', close: '17:00' },
      tuesday: { active: true, open: '09:00', close: '17:00' },
      wednesday: { active: true, open: '09:00', close: '17:00' },
      thursday: { active: true, open: '09:00', close: '17:00' },
      friday: { active: true, open: '09:00', close: '17:00' },
      saturday: { active: false, open: '09:00', close: '17:00' },
      sunday: { active: false, open: '09:00', close: '17:00' }
    },
    selectedPlan: 'free',
    acceptTerms: false
  });

  // State for password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // State for validation errors
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Time options
  const timeOptions = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00'
  ];

  // Convert 24h time to display format
  const getDisplayTime = (time24) => {
    if (!time24) return '';
    const [hour, minute] = time24.split(':');
    const h = parseInt(hour);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return `${hour12}:${minute} ${ampm}`;
  };

  // Days of week
  const daysOfWeek = [
    { id: 'monday', label: 'Monday', short: 'Mon' },
    { id: 'tuesday', label: 'Tuesday', short: 'Tue' },
    { id: 'wednesday', label: 'Wednesday', short: 'Wed' },
    { id: 'thursday', label: 'Thursday', short: 'Thu' },
    { id: 'friday', label: 'Friday', short: 'Fri' },
    { id: 'saturday', label: 'Saturday', short: 'Sat' },
    { id: 'sunday', label: 'Sunday', short: 'Sun' }
  ];

  // Plan definitions - EXACTLY as previous design
  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 'ETB 0',
      period: '/month',
      employees: 10,
      maxServices: 1,
      features: [
        'Up to 10 employees',
        'Basic booking system',
        'Email support',
        '1 service only',
        'No advanced analytics',
        'No SMS notifications'
      ]
    },
    {
      id: 'small',
      name: 'Small Business',
      price: 'ETB 1,000',
      period: '/month',
      employees: 30,
      maxServices: 3,
      features: [
        'Up to 30 employees',
        'Up to 3 services',
        'Email notifications',
        'Basic reports',
        'Calendar integration'
      ],
      popular: true
    },
    {
      id: 'medium',
      name: 'Medium Business',
      price: 'ETB 3,000',
      period: '/month',
      employees: 200,
      maxServices: 20,
      features: [
        'Up to 200 employees',
        'Up to 20 services',
        'SMS notifications',
        'Advanced analytics',
        'Priority support',
        'API access'
      ]
    },
    {
      id: 'large',
      name: 'Large Business',
      price: 'ETB 10,000',
      period: '/month',
      employees: 1000,
      maxServices: 100,
      features: [
        'Up to 1000 employees',
        'Up to 100 services',
        'AI assistant',
        '24/7 priority support',
        'Custom integrations',
        'Dedicated account manager',
        'SLA guarantee'
      ]
    }
  ];

  // Get max employees based on selected plan
  const getMaxEmployees = () => {
    const plan = plans.find(p => p.id === companyData.selectedPlan);
    return plan ? plan.employees : 10;
  };

  // Get max services based on selected plan
  const getMaxServices = () => {
    const plan = plans.find(p => p.id === companyData.selectedPlan);
    return plan ? plan.maxServices : 1;
  };

  // Update company info
  const updateCompanyInfo = (field, value) => {
    setCompanyData({
      ...companyData,
      [field]: value
    });
    
    // Clear error for this field
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: null
      });
    }
  };

  // Update business hours
  const updateBusinessHour = (day, field, value) => {
    setCompanyData({
      ...companyData,
      businessHours: {
        ...companyData.businessHours,
        [day]: {
          ...companyData.businessHours[day],
          [field]: value
        }
      }
    });
  };

  // Add new service
  const addService = () => {
    const maxServices = getMaxServices();
    const currentServices = companyData.services.filter(s => s.name.trim() !== '').length;
    
    if (currentServices >= maxServices) {
      alert(`Your ${getPlanDisplayName()} plan allows maximum ${maxServices} services.`);
      return;
    }

    const newService = {
      id: Date.now(),
      name: '',
      duration: 40,
      price: 0,
      description: '',
      serviceStartTime: '09:00',
      serviceEndTime: '17:00',
      availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
    };
    setCompanyData({
      ...companyData,
      services: [...companyData.services, newService]
    });
  };

  // Update service
  const updateService = (id, field, value) => {
    setCompanyData({
      ...companyData,
      services: companyData.services.map(service => 
        service.id === id ? { ...service, [field]: value } : service
      )
    });
  };

  // Toggle available day for a service
  const toggleServiceDay = (serviceId, day) => {
    setCompanyData({
      ...companyData,
      services: companyData.services.map(service => {
        if (service.id === serviceId) {
          const currentDays = service.availableDays || [];
          const newDays = currentDays.includes(day)
            ? currentDays.filter(d => d !== day)
            : [...currentDays, day];
          return { ...service, availableDays: newDays };
        }
        return service;
      })
    });
  };

  // Remove service
  const removeService = (id) => {
    if (companyData.services.length > 1) {
      setCompanyData({
        ...companyData,
        services: companyData.services.filter(service => service.id !== id)
      });
    }
  };

  // Handle plan selection
  const selectPlan = (planId) => {
    setCompanyData({
      ...companyData,
      selectedPlan: planId,
      employeeCount: companyData.employeeCount > plans.find(p => p.id === planId).employees 
        ? '' 
        : companyData.employeeCount
    });
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!companyData.name) newErrors.name = 'Company name is required';
    if (!companyData.email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(companyData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!companyData.employeeCount) newErrors.employeeCount = 'Number of employees is required';
    else if (companyData.employeeCount > getMaxEmployees()) {
      newErrors.employeeCount = `Maximum ${getMaxEmployees()} employees for this plan`;
    }
    
    if (!companyData.password) newErrors.password = 'Password is required';
    else if (companyData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!companyData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (companyData.password !== companyData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!companyData.city) newErrors.city = 'City is required';
    
    // Service validation
    const hasValidService = companyData.services.some(service => service.name.trim() !== '');
    if (!hasValidService) {
      newErrors.services = 'Please add at least one service with a name';
    }

    return newErrors;
  };

  // ===== ONLY THIS FUNCTION IS CHANGED TO SAVE COMPANY DATA =====
  const handleRegister = () => {
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      try {
        const existingCompanies = JSON.parse(localStorage.getItem('registeredCompanies') || '[]');
        
        const emailExists = existingCompanies.some(company => company.email === companyData.email);
        if (emailExists) {
          setErrors({ email: 'A company with this email already exists' });
          setIsSubmitting(false);
          return;
        }
        
        // Remove confirmPassword before saving
        const { confirmPassword, acceptTerms, ...companyDataWithoutConfirm } = companyData;
        
        // Create the new company object with all data
        const newCompany = {
          ...companyDataWithoutConfirm,
          id: Date.now(),
          registeredAt: new Date().toISOString(),
          maxEmployees: getMaxEmployees(),
          maxServices: getMaxServices(),
          // Add empty availability array for calendar
          availability: [],
          // Add default rating and reviews
          rating: 0,
          reviews: 0,
          // Add status
          isActive: true,
          isOpen: true
        };
        
        // Save to registered companies list
        existingCompanies.push(newCompany);
        localStorage.setItem('registeredCompanies', JSON.stringify(existingCompanies));
        
        // Save current company for auto-login to dashboard
        localStorage.setItem('currentCompany', JSON.stringify(newCompany));
        
        // Call the success callback if provided
        if (onRegisterSuccess) {
          onRegisterSuccess(newCompany);
        }
        
        // Redirect to dashboard
        router.push('/dashboard');
      } catch (error) {
        console.error('Registration error:', error);
        setErrors({ form: 'Registration failed. Please try again.' });
      } finally {
        setIsSubmitting(false);
      }
    }, 1500);
  };
  // ===== END OF CHANGED FUNCTION =====

  const getPlanDisplayName = () => {
    const plan = plans.find(p => p.id === companyData.selectedPlan);
    return plan ? plan.name : 'Free';
  };

  // Get icon based on service name or default
  const getServiceIcon = (index) => {
    const icons = [Scissors, Coffee, Wrench, Zap];
    const IconComponent = icons[index % icons.length];
    return <IconComponent className="h-4 w-4" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50/30 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
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

        {/* Header */}
        <div className="text-center mb-8">
          <Badge 
            variant="outline" 
            className="px-4 py-1.5 text-sm font-medium rounded-full bg-primary/5 text-primary border-primary/20 mb-4"
          >
            <Building2 className="h-3.5 w-3.5 mr-1" />
            Join ServiceSync+
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-orange-600">
            Register Your Company
          </h1>
          <p className="text-lg text-muted-foreground mt-3">
            Start managing your service bookings efficiently
          </p>
        </div>

        {/* Plans Selection - EXACTLY as previous design */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Choose Your Plan
            </h2>
            <p className="text-sm text-muted-foreground">14-day free trial on paid plans</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {plans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => selectPlan(plan.id)}
                className={cn(
                  "relative rounded-xl border-2 transition-all cursor-pointer p-5 bg-white hover:shadow-md",
                  companyData.selectedPlan === plan.id
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-gray-200 hover:border-primary/30"
                )}
              >
                {plan.popular && (
                  <Badge className="absolute -top-2 -right-2 bg-primary text-white border-0">
                    Popular
                  </Badge>
                )}
                
                <h3 className="text-lg font-bold mb-1">#{plan.name}</h3>
                <div className="mb-3">
                  <span className="text-xl font-bold text-primary">{plan.price}</span>
                  <span className="text-sm text-muted-foreground ml-1">{plan.period}</span>
                </div>
                
                <ul className="space-y-1.5 mb-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="text-xs flex items-start gap-1.5">
                      {feature.startsWith('No') ? (
                        <span className="text-gray-400">✗</span>
                      ) : (
                        <span className="text-primary">✓</span>
                      )}
                      <span className={feature.startsWith('No') ? "text-gray-400" : "text-gray-700"}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                
                {companyData.selectedPlan === plan.id && (
                  <div className="absolute top-2 right-2 h-5 w-5 bg-primary rounded-full flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Selected Plan Summary */}
          <Alert className="mt-4 bg-primary/5 border-primary/20">
            <Info className="h-4 w-4 text-primary" />
            <AlertTitle className="text-primary text-sm">Selected: {getPlanDisplayName()} Plan</AlertTitle>
            <AlertDescription className="text-xs">
              Max {getMaxEmployees()} employees • Max {getMaxServices()} services
            </AlertDescription>
          </Alert>
        </div>

        {/* Registration Form */}
        <Card className="border-2 shadow-xl">
          <CardHeader className="bg-muted/30 border-b pb-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Building2 className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">Company Information</CardTitle>
                <CardDescription>Fill in your details to create an account</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            {errors.form && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{errors.form}</AlertDescription>
              </Alert>
            )}

            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="hours">Business Hours</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Company Name */}
                  <div className="space-y-1">
                    <Label htmlFor="company-name" className="text-sm flex items-center gap-1">
                      <Building2 className="h-3 w-3" /> Company Name *
                    </Label>
                    <Input
                      id="company-name"
                      placeholder="e.g., Helen Automobil"
                      value={companyData.name}
                      onChange={(e) => updateCompanyInfo('name', e.target.value)}
                      className={cn("h-9", errors.name && "border-destructive")}
                    />
                    {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                  </div>

                  {/* Sector */}
                  <div className="space-y-1">
                    <Label htmlFor="sector" className="text-sm flex items-center gap-1">
                      <Briefcase className="h-3 w-3" /> Sector
                    </Label>
                    <Input
                      id="sector"
                      placeholder="e.g., Automotive"
                      value={companyData.sector}
                      onChange={(e) => updateCompanyInfo('sector', e.target.value)}
                      className="h-9"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <Label htmlFor="email" className="text-sm flex items-center gap-1">
                      <Mail className="h-3 w-3" /> Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="contact@helenautomobil.com"
                      value={companyData.email}
                      onChange={(e) => updateCompanyInfo('email', e.target.value)}
                      className={cn("h-9", errors.email && "border-destructive")}
                    />
                    {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <Label htmlFor="phone" className="text-sm flex items-center gap-1">
                      <Phone className="h-3 w-3" /> Phone
                    </Label>
                    <Input
                      id="phone"
                      placeholder="+251 91 234 5678"
                      value={companyData.phone}
                      onChange={(e) => updateCompanyInfo('phone', e.target.value)}
                      className="h-9"
                    />
                  </div>

                  {/* Password */}
                  <div className="space-y-1">
                    <Label htmlFor="password" className="text-sm flex items-center gap-1">
                      <Lock className="h-3 w-3" /> Password *
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create password"
                        value={companyData.password}
                        onChange={(e) => updateCompanyInfo('password', e.target.value)}
                        className={cn("h-9 pr-8", errors.password && "border-destructive")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                      >
                        {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </button>
                    </div>
                    {errors.password ? (
                      <p className="text-xs text-destructive">{errors.password}</p>
                    ) : (
                      <p className="text-xs text-muted-foreground">Min 6 characters</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1">
                    <Label htmlFor="confirm-password" className="text-sm flex items-center gap-1">
                      <Lock className="h-3 w-3" /> Confirm Password *
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm password"
                        value={companyData.confirmPassword}
                        onChange={(e) => updateCompanyInfo('confirmPassword', e.target.value)}
                        className={cn("h-9 pr-8", errors.confirmPassword && "border-destructive")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                      >
                        {showConfirmPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-xs text-destructive">{errors.confirmPassword}</p>
                    )}
                  </div>

                  {/* City */}
                  <div className="space-y-1">
                    <Label htmlFor="city" className="text-sm">City *</Label>
                    <Select
                      value={companyData.city}
                      onValueChange={(value) => updateCompanyInfo('city', value)}
                    >
                      <SelectTrigger id="city" className={cn("h-9", errors.city && "border-destructive")}>
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="addis-ababa">Addis Ababa</SelectItem>
                        <SelectItem value="bahir-dar">Bahir Dar</SelectItem>
                        <SelectItem value="gondar">Gondar</SelectItem>
                        <SelectItem value="hawassa">Hawassa</SelectItem>
                        <SelectItem value="mekelle">Mekelle</SelectItem>
                        <SelectItem value="adama">Adama</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
                  </div>

                  {/* Region */}
                  <div className="space-y-1">
                    <Label htmlFor="region" className="text-sm">Region</Label>
                    <Select
                      value={companyData.region}
                      onValueChange={(value) => updateCompanyInfo('region', value)}
                    >
                      <SelectTrigger id="region" className="h-9">
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="addis-ababa">Addis Ababa</SelectItem>
                        <SelectItem value="amhara">Amhara</SelectItem>
                        <SelectItem value="oromia">Oromia</SelectItem>
                        <SelectItem value="sidama">Sidama</SelectItem>
                        <SelectItem value="tigray">Tigray</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Address */}
                  <div className="space-y-1 md:col-span-2">
                    <Label htmlFor="address" className="text-sm">Address</Label>
                    <Input
                      id="address"
                      placeholder="Street address"
                      value={companyData.address}
                      onChange={(e) => updateCompanyInfo('address', e.target.value)}
                      className="h-9"
                    />
                  </div>

                  {/* Employee Count */}
                  <div className="space-y-1">
                    <Label htmlFor="employees" className="text-sm flex items-center gap-1">
                      <Users className="h-3 w-3" /> Employees *
                    </Label>
                    <Input
                      id="employees"
                      type="number"
                      min="1"
                      max={getMaxEmployees()}
                      placeholder={`Max ${getMaxEmployees()}`}
                      value={companyData.employeeCount}
                      onChange={(e) => updateCompanyInfo('employeeCount', parseInt(e.target.value) || '')}
                      className={cn("h-9", errors.employeeCount && "border-destructive")}
                    />
                    {errors.employeeCount ? (
                      <p className="text-xs text-destructive">{errors.employeeCount}</p>
                    ) : (
                      <p className="text-xs text-muted-foreground">Max {getMaxEmployees()} for this plan</p>
                    )}
                  </div>

                  {/* Description */}
                  <div className="space-y-1 md:col-span-2">
                    <Label htmlFor="description" className="text-sm">Company Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Tell us about your company..."
                      value={companyData.description}
                      onChange={(e) => updateCompanyInfo('description', e.target.value)}
                      rows={2}
                      className="text-sm"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="hours" className="space-y-4">
                <div className="bg-muted/20 rounded-lg p-4">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-1">
                    <Clock className="h-4 w-4 text-primary" />
                    Operating Hours
                  </h3>

                  <div className="space-y-2">
                    {daysOfWeek.map((day) => (
                      <div key={day.id} className="flex flex-col sm:flex-row sm:items-center gap-2 p-2 bg-background rounded border text-sm">
                        <div className="flex items-center gap-2 sm:w-32">
                          <Switch
                            checked={companyData.businessHours[day.id].active}
                            onCheckedChange={(checked) => updateBusinessHour(day.id, 'active', checked)}
                            className="scale-75"
                          />
                          <Label className="text-xs font-medium">{day.label}</Label>
                        </div>

                        {companyData.businessHours[day.id].active ? (
                          <div className="flex-1 flex items-center gap-1">
                            <Select
                              value={companyData.businessHours[day.id].open}
                              onValueChange={(value) => updateBusinessHour(day.id, 'open', value)}
                            >
                              <SelectTrigger className="h-7 text-xs w-20">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {timeOptions.map(time => (
                                  <SelectItem key={time} value={time} className="text-xs">
                                    {getDisplayTime(time)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            <span className="text-xs">to</span>

                            <Select
                              value={companyData.businessHours[day.id].close}
                              onValueChange={(value) => updateBusinessHour(day.id, 'close', value)}
                            >
                              <SelectTrigger className="h-7 text-xs w-20">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {timeOptions.map(time => (
                                  <SelectItem key={time} value={time} className="text-xs">
                                    {getDisplayTime(time)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        ) : (
                          <Badge variant="secondary" className="text-xs">Closed</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="services" className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-sm font-semibold">Services Offered</h3>
                    <p className="text-xs text-muted-foreground">
                      Max {getMaxServices()} services for your plan
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={addService}
                    className="h-8 gap-1"
                    disabled={companyData.services.filter(s => s.name.trim() !== '').length >= getMaxServices()}
                  >
                    <Plus className="h-3 w-3" /> Add Service
                  </Button>
                </div>

                {errors.services && (
                  <p className="text-xs text-destructive mb-2">{errors.services}</p>
                )}

                <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                  {companyData.services.map((service, index) => (
                    <div key={service.id} className="border rounded-lg p-3 bg-muted/5">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-1">
                          <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                            {getServiceIcon(index)}
                          </div>
                          <h4 className="text-xs font-medium">Service #{index + 1}</h4>
                        </div>
                        {companyData.services.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => removeService(service.id)}
                          >
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <div>
                          <Label className="text-xs">Service Name *</Label>
                          <Input
                            placeholder="e.g. Oil Change"
                            value={service.name}
                            onChange={(e) => updateService(service.id, 'name', e.target.value)}
                            className="h-7 text-xs"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Duration (min)</Label>
                          <Input
                            type="number"
                            value={service.duration}
                            onChange={(e) => updateService(service.id, 'duration', parseInt(e.target.value) || 40)}
                            className="h-7 text-xs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <div>
                          <Label className="text-xs">Price (ETB)</Label>
                          <Input
                            type="number"
                            value={service.price}
                            onChange={(e) => updateService(service.id, 'price', parseInt(e.target.value) || 0)}
                            className="h-7 text-xs"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Available From</Label>
                          <Select
                            value={service.serviceStartTime}
                            onValueChange={(value) => updateService(service.id, 'serviceStartTime', value)}
                          >
                            <SelectTrigger className="h-7 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {timeOptions.map(time => (
                                <SelectItem key={time} value={time} className="text-xs">
                                  {getDisplayTime(time)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <div>
                          <Label className="text-xs">Available Until</Label>
                          <Select
                            value={service.serviceEndTime}
                            onValueChange={(value) => updateService(service.id, 'serviceEndTime', value)}
                          >
                            <SelectTrigger className="h-7 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {timeOptions.map(time => (
                                <SelectItem key={time} value={time} className="text-xs">
                                  {getDisplayTime(time)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-xs">Description</Label>
                          <Input
                            placeholder="Brief description"
                            value={service.description}
                            onChange={(e) => updateService(service.id, 'description', e.target.value)}
                            className="h-7 text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs mb-1 block">Available Days</Label>
                        <div className="flex flex-wrap gap-1">
                          {daysOfWeek.map(day => (
                            <Badge
                              key={day.id}
                              variant={service.availableDays?.includes(day.id) ? "default" : "outline"}
                              className="cursor-pointer text-xs px-2 py-0 h-5"
                              onClick={() => toggleServiceDay(service.id, day.id)}
                            >
                              {day.short}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>

          <CardFooter className="bg-muted/30 border-t flex-col sm:flex-row gap-3 justify-between p-4">
            <div className="flex items-center gap-1 text-xs">
              <span>Already have an account?</span>
              <Button 
                variant="link" 
                onClick={() => router.push('/login')} 
                className="p-0 h-auto text-xs"
              >
                Sign in here
              </Button>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={onBackClick} disabled={isSubmitting} size="sm" className="h-8">
                Cancel
              </Button>
              <Button onClick={handleRegister} disabled={isSubmitting} size="sm" className="h-8 gap-1">
                {isSubmitting ? 'Registering...' : `Register ${getPlanDisplayName()}`}
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default RegistrationPage;