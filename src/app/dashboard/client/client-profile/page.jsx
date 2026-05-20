"use client";

import { useEffect, useState, useRef } from "react";
import RequestHandler from "@/lib/request-handler";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useClientStore, useSessionStore } from "@/store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Loader2,
  Camera,
  Edit2,
  Check,
  ShieldCheck,
  Save,
  Bell,
  Clock,
  Sparkles,
  MapPin,
  Cake,
  Heart,
  Activity,
  CalendarDays,
  Star,
  Award,
  ShoppingBag,
  Clock as ClockIcon,
  CheckCircle
} from "lucide-react";

export default function ClientProfilePage() {
  const client = useClientStore((state) => state.client);
  const setClient = useClientStore((state) => state.setClient);
  const session = useSessionStore((state) => state.session);
  
  const [isLoading, setIsLoading] = useState(client == null);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [isClient, setIsClient] = useState(false);
  const [totalAppointments, setTotalAppointments] = useState(0);
  
  // Local state for editable fields
  const [profileForm, setProfileForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    bio: "",
  });
  
  const [profilePic, setProfilePic] = useState(null);
  const fileInputRef = useRef(null);

  // Mark when client-side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load client details from backend or store
  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const clientRes = await RequestHandler.Get("/query/v1/user?mine&~role=client");
        if (clientRes.ok) {
          const { users: [fetchedClient] } = await clientRes.json();
          setClient(fetchedClient);
          setProfileForm({
            firstname: fetchedClient.firstname || "",
            lastname: fetchedClient.lastname || "",
            email: fetchedClient.email || "",
            phone: fetchedClient.phone || "",
            address: fetchedClient.address || "",
            dateOfBirth: fetchedClient.dateOfBirth || "",
            bio: fetchedClient.bio || "",
          });
          
          // Fetch appointments count
          const appointmentsRes = await RequestHandler.Get(`/query/v1/appointment?~clientId=${fetchedClient.id}`);
          if (appointmentsRes.ok) {
            const { count } = await appointmentsRes.json();
            setTotalAppointments(count || 0);
          }
        }
      } catch (error) {
        console.error("Failed to load client data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchClientData();
  }, [setClient]);

  // Handle local state updates
  useEffect(() => {
    if (client) {
      setProfileForm({
        firstname: client.firstname || "",
        lastname: client.lastname || "",
        email: client.email || "",
        phone: client.phone || "",
        address: client.address || "",
        dateOfBirth: client.dateOfBirth || "",
        bio: client.bio || "",
      });
      if (client.profilePic) {
        setProfilePic(client.profilePic);
      }
      
      // Fetch updated appointments count when client changes
      const fetchAppointmentsCount = async () => {
        const appointmentsRes = await RequestHandler.Get(`/query/v1/appointment?~clientId=${client.id}`);
        if (appointmentsRes.ok) {
          const { count } = await appointmentsRes.json();
          setTotalAppointments(count || 0);
        }
      };
      fetchAppointmentsCount();
    }
  }, [client]);

  // Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Image upload using FileReader
  const handlePhotoUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File size must be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setProfilePic(base64String);
        if (client) {
          const updatedClient = { ...client, profilePic: base64String };
          setClient(updatedClient);
        }
        toast.success("Profile photo uploaded successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  // Update database record
  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call - replace with actual update endpoint
    await new Promise((resolve) => setTimeout(resolve, 1200));
    
    if (client) {
      const updatedClient = {
        ...client,
        firstname: profileForm.firstname,
        lastname: profileForm.lastname,
        email: profileForm.email,
        phone: profileForm.phone,
        address: profileForm.address,
        dateOfBirth: profileForm.dateOfBirth,
        bio: profileForm.bio,
        profilePic: profilePic,
      };
      setClient(updatedClient);
      setIsEditing(false);
      setIsSaving(false);
      toast.success("Profile updated successfully!");
    } else {
      setIsSaving(false);
      toast.error("Unable to update. Session expired.");
    }
  };

  // Client-side check for hydration
  if (!isClient) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center bg-white border border-slate-200 rounded-2xl shadow-sm">
        <div className="text-center space-y-3">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mx-auto" />
          <p className="text-sm font-medium text-slate-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl shadow-sm">
        <User className="h-12 w-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-700">No Client Session Found</h3>
        <p className="text-sm text-slate-500 mt-1">Please sign in to access your profile.</p>
      </div>
    );
  }

  const memberDate = client.createdAt 
    ? new Date(client.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "2024";

  const fullName = `${profileForm.firstname} ${profileForm.lastname}`.trim() || "Client";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-slate-700">
      {/* Header Banner & Profile Information Card - Enhanced Hero Section */}
      <Card className="border border-slate-200 overflow-hidden bg-white shadow-md rounded-3xl transition-shadow hover:shadow-lg duration-300 relative">
        {/* Hero Background Image with Overlay */}
        <div className="relative h-72 sm:h-96 w-full overflow-hidden">
          {/* Background Image - Replace with your image URL */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1573164713988-8665fc963095?w=1200&h=400&fit=crop')`,
            }}
          >
            {/* Dark Gradient Overlay for better text visibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
            {/* Additional overlay gradient from bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
          </div>
          
          {/* Hero Content */}
          <div className="relative h-full flex flex-col justify-between p-6 sm:p-10">
            {/* Top Section - Badge */}
            <div className="flex justify-end">
              <Badge className="bg-white/20 backdrop-blur-md text-white border border-white/30 font-medium text-xs sm:text-sm px-4 py-2 rounded-full shadow-lg select-none tracking-wider">
                ⭐ PREMIUM CLIENT ⭐
              </Badge>
            </div>
            
            {/* Bottom Section - Welcome Message - Made Bigger and More Attractive */}
            <div className="mb-6">
              <div className="space-y-3">
                <p className="text-white/90 text-lg sm:text-xl font-medium tracking-wide animate-in slide-in-from-left-5 duration-700">
                  Welcome Back,
                </p>
                <h2 className="text-6xl sm:text-7xl md:text-8xl font-bold text-white tracking-tight leading-none animate-in slide-in-from-left-5 duration-700 delay-100">
                  {fullName.split(' ')[0]}
                </h2>
                <div className="flex items-center gap-3 text-white/80 text-sm sm:text-base mt-4 animate-in slide-in-from-left-5 duration-700 delay-200">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Member since {memberDate}</span>
                  </div>
                  <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verified Account</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Avatar Picture container - Positioned to overlap the hero and card content */}
        <div className="relative px-6 sm:px-8">
          <div 
            onClick={handlePhotoUploadClick}
            className="absolute -top-16 sm:-top-20 w-28 h-28 sm:w-32 sm:h-32 border-4 border-white bg-gradient-to-br from-rose-50 to-pink-50 rounded-full shadow-2xl flex items-center justify-center overflow-hidden group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-3xl z-10"
          >
            {profilePic ? (
              <img 
                src={profilePic} 
                alt={fullName} 
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white font-bold text-4xl">
                {fullName.substring(0, 2).toUpperCase()}
              </div>
            )}
            {/* Upload Camera Overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center text-white flex-col backdrop-blur-sm">
              <Camera className="w-6 h-6 drop-shadow-md animate-pulse" />
              <span className="text-[10px] mt-1.5 font-medium uppercase tracking-wider drop-shadow-md">Change Photo</span>
            </div>
          </div>
          
          {/* Invisible file input */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
        </div>

        {/* Card Main Info area - Adjusted padding to account for overlapping avatar */}
        <CardContent className="pt-20 sm:pt-24 pb-6 px-6 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-none">
                  {fullName}
                </h1>
                <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 gap-1.5 rounded-full px-3 py-1.5 font-semibold text-xs shadow-sm select-none">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Verified Client
                </Badge>
              </div>
              <div className="flex items-center gap-3 text-slate-500 text-sm">
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{client.email}</span>
                </div>
                {client.phone && (
                  <>
                    <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5" />
                      <span>{client.phone}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Toggle Edit Button */}
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant="outline"
              className={cn(
                "gap-2 rounded-2xl h-11 px-6 shadow-sm text-sm font-medium transition-all shrink-0 border-slate-200",
                isEditing 
                  ? "bg-slate-100 text-slate-800" 
                  : "bg-white text-slate-800 hover:bg-slate-50 hover:border-slate-300"
              )}
            >
              <Edit2 className="w-4 h-4 text-rose-500" />
              {isEditing ? "Cancel Edit" : "Edit Profile"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistics row - Only Total Appointments Card */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <Card className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-indigo-50/30 p-7 shadow-sm flex items-center justify-between transition-all duration-300 hover:shadow-md hover:scale-[1.015]">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-indigo-600 uppercase tracking-widest">Total Appointments</p>
            <p className="text-4.5xl font-bold text-slate-900 tracking-tight mt-1.5">{totalAppointments}</p>
          </div>
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <CalendarDays className="h-7 w-7 text-white" />
          </div>
        </Card>
      </div>

      {/* Navigation Tab pills */}
      <div className="flex bg-slate-100/90 p-1.5 rounded-2xl max-w-md border border-slate-200/60 shadow-inner">
        <button 
          className={cn(
            "flex-1 py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm transition-all text-center", 
            activeTab === "profile" 
              ? "bg-white text-slate-900 shadow-sm border border-slate-200/50" 
              : "text-slate-500 hover:text-slate-900"
          )} 
          onClick={() => setActiveTab("profile")}
        >
          Profile Info
        </button>
        <button 
          className={cn(
            "flex-1 py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm transition-all text-center", 
            activeTab === "notifications" 
              ? "bg-white text-slate-900 shadow-sm border border-slate-200/50" 
              : "text-slate-500 hover:text-slate-900"
          )} 
          onClick={() => setActiveTab("notifications")}
        >
          Notifications
        </button>
        <button 
          className={cn(
            "flex-1 py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm transition-all text-center", 
            activeTab === "activity" 
              ? "bg-white text-slate-900 shadow-sm border border-slate-200/50" 
              : "text-slate-500 hover:text-slate-900"
          )} 
          onClick={() => setActiveTab("activity")}
        >
          Activity
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === "profile" ? (
        <Card className="border border-slate-200 bg-white shadow-sm rounded-3xl overflow-hidden">
          <CardHeader className="border-b border-slate-100 py-6 px-8 sm:px-10 bg-slate-50/50">
            <CardTitle className="text-xl sm:text-2xl font-medium text-slate-900">
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 sm:p-10">
            <form onSubmit={handleSaveChanges} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                {/* Account Status */}
                <div className="space-y-2.5">
                  <Label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Account Status</Label>
                  <div className="flex items-center gap-3 border border-slate-100 bg-slate-50/50 h-14 px-5 rounded-2xl">
                    <div className={cn("h-2.5 w-2.5 rounded-full shrink-0", client.isActive !== false ? "bg-emerald-500 animate-pulse" : "bg-rose-500")} />
                    <span className="font-medium text-slate-700 text-sm sm:text-base">
                      {client.isActive !== false ? "Active Account" : "Inactive"}
                    </span>
                  </div>
                </div>

                {/* First Name */}
                <div className="space-y-2.5">
                  <Label htmlFor="firstname" className="text-xs font-semibold text-slate-400 uppercase tracking-widest">First Name</Label>
                  {isEditing ? (
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-rose-500" />
                      <Input
                        id="firstname"
                        name="firstname"
                        value={profileForm.firstname}
                        onChange={handleChange}
                        className="pl-12 h-14 rounded-2xl border-slate-200 text-sm sm:text-base font-normal text-slate-800 focus:border-rose-400 focus:ring-rose-400/20"
                        required
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-4 text-slate-800 h-14 bg-white border border-slate-150 px-5 rounded-2xl hover:border-rose-300 hover:bg-rose-50/5 transition-all duration-300 cursor-default group">
                      <div className="h-8 w-8 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0 group-hover:scale-105 transition-transform">
                        <User className="h-4.5 w-4.5" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider leading-none mb-1">First Name</span>
                        <span className="text-sm sm:text-base font-medium text-slate-850 truncate">{profileForm.firstname || "Not specified"}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Last Name */}
                <div className="space-y-2.5">
                  <Label htmlFor="lastname" className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Last Name</Label>
                  {isEditing ? (
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-rose-500" />
                      <Input
                        id="lastname"
                        name="lastname"
                        value={profileForm.lastname}
                        onChange={handleChange}
                        className="pl-12 h-14 rounded-2xl border-slate-200 text-sm sm:text-base font-normal text-slate-800 focus:border-rose-400 focus:ring-rose-400/20"
                        required
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-4 text-slate-800 h-14 bg-white border border-slate-150 px-5 rounded-2xl hover:border-rose-300 hover:bg-rose-50/5 transition-all duration-300 cursor-default group">
                      <div className="h-8 w-8 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0 group-hover:scale-105 transition-transform">
                        <User className="h-4.5 w-4.5" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider leading-none mb-1">Last Name</span>
                        <span className="text-sm sm:text-base font-medium text-slate-850 truncate">{profileForm.lastname || "Not specified"}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2.5">
                  <Label htmlFor="email" className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Email Address</Label>
                  {isEditing ? (
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-rose-500" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={profileForm.email}
                        onChange={handleChange}
                        className="pl-12 pr-28 h-14 rounded-2xl border-slate-200 text-sm sm:text-base font-normal text-slate-800 focus:border-rose-400 focus:ring-rose-400/20"
                        required
                      />
                      <Badge className="absolute right-3 top-1/2 -translate-y-1/2 bg-white text-emerald-600 border border-emerald-200 gap-1 rounded-full py-1 font-semibold text-[9px] uppercase tracking-wider select-none shadow-sm">
                        <Check className="w-3 h-3 text-emerald-500" /> Verified
                      </Badge>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-slate-850 h-14 bg-white border border-slate-150 px-5 rounded-2xl hover:border-rose-300 hover:bg-rose-50/5 transition-all duration-300 cursor-default group">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="h-8 w-8 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 group-hover:scale-105 transition-transform">
                          <Mail className="h-4.5 w-4.5" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider leading-none mb-1">Email Address</span>
                          <span className="text-sm sm:text-base font-medium text-slate-850 truncate">{profileForm.email}</span>
                        </div>
                      </div>
                      <Badge className="bg-white text-emerald-600 border border-emerald-250/80 gap-1 rounded-full px-2.5 py-1 font-semibold text-[9px] uppercase tracking-wider shrink-0 select-none shadow-sm">
                        <Check className="w-3 h-3 text-emerald-500" /> Verified
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2.5">
                  <Label htmlFor="phone" className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Phone Number</Label>
                  {isEditing ? (
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-rose-500" />
                      <Input
                        id="phone"
                        name="phone"
                        value={profileForm.phone}
                        onChange={handleChange}
                        className="pl-12 h-14 rounded-2xl border-slate-200 text-sm sm:text-base font-normal text-slate-800 focus:border-rose-400 focus:ring-rose-400/20"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-4 text-slate-800 h-14 bg-white border border-slate-150 px-5 rounded-2xl hover:border-rose-300 hover:bg-rose-50/5 transition-all duration-300 cursor-default group">
                      <div className="h-8 w-8 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600 shrink-0 group-hover:scale-105 transition-transform">
                        <Phone className="h-4.5 w-4.5" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider leading-none mb-1">Phone Number</span>
                        <span className="text-sm sm:text-base font-medium text-slate-850 truncate">{profileForm.phone || "Not specified"}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Address */}
                <div className="space-y-2.5">
                  <Label htmlFor="address" className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Address</Label>
                  {isEditing ? (
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-rose-500" />
                      <Input
                        id="address"
                        name="address"
                        value={profileForm.address}
                        onChange={handleChange}
                        className="pl-12 h-14 rounded-2xl border-slate-200 text-sm sm:text-base font-normal text-slate-800 focus:border-rose-400 focus:ring-rose-400/20"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-4 text-slate-800 h-14 bg-white border border-slate-150 px-5 rounded-2xl hover:border-rose-300 hover:bg-rose-50/5 transition-all duration-300 cursor-default group">
                      <div className="h-8 w-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0 group-hover:scale-105 transition-transform">
                        <MapPin className="h-4.5 w-4.5" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider leading-none mb-1">Address</span>
                        <span className="text-sm sm:text-base font-medium text-slate-850 truncate">{profileForm.address || "Not specified"}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Date of Birth */}
                <div className="space-y-2.5">
                  <Label htmlFor="dateOfBirth" className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Date of Birth</Label>
                  {isEditing ? (
                    <div className="relative">
                      <Cake className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-rose-500" />
                      <Input
                        id="dateOfBirth"
                        name="dateOfBirth"
                        type="date"
                        value={profileForm.dateOfBirth}
                        onChange={handleChange}
                        className="pl-12 h-14 rounded-2xl border-slate-200 text-sm sm:text-base font-normal text-slate-800 focus:border-rose-400 focus:ring-rose-400/20"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-4 text-slate-800 h-14 bg-white border border-slate-150 px-5 rounded-2xl hover:border-rose-300 hover:bg-rose-50/5 transition-all duration-300 cursor-default group">
                      <div className="h-8 w-8 rounded-xl bg-teal-100 flex items-center justify-center text-teal-600 shrink-0 group-hover:scale-105 transition-transform">
                        <Cake className="h-4.5 w-4.5" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider leading-none mb-1">Date of Birth</span>
                        <span className="text-sm sm:text-base font-medium text-slate-850 truncate">
                          {profileForm.dateOfBirth
                            ? new Date(profileForm.dateOfBirth).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
                            : "Not specified"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bio */}
                <div className="space-y-2.5 md:col-span-2">
                  <Label htmlFor="bio" className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Bio / About Me</Label>
                  {isEditing ? (
                    <div className="relative">
                      <Heart className="absolute left-4 top-4 h-5 w-5 text-rose-500" />
                      <textarea
                        id="bio"
                        name="bio"
                        value={profileForm.bio}
                        onChange={handleChange}
                        rows={4}
                        className="w-full pl-12 pr-4 py-3 h-auto rounded-2xl border border-slate-200 text-sm sm:text-base font-normal text-slate-800 focus:border-rose-400 focus:ring-rose-400/20 resize-none"
                        placeholder="Tell us a little about yourself..."
                      />
                    </div>
                  ) : (
                    <div className="flex items-start gap-4 text-slate-800 bg-white border border-slate-150 px-5 py-4 rounded-2xl hover:border-rose-300 hover:bg-rose-50/5 transition-all duration-300 cursor-default group">
                      <div className="h-8 w-8 rounded-xl bg-pink-100 flex items-center justify-center text-pink-600 shrink-0 group-hover:scale-105 transition-transform">
                        <Heart className="h-4.5 w-4.5" />
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider leading-none mb-1">About Me</span>
                        <span className="text-sm sm:text-base font-medium text-slate-850">
                          {profileForm.bio || "No bio added yet. Click edit to tell us about yourself!"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              {isEditing && (
                <div className="flex justify-end pt-5 border-t border-slate-100">
                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="h-12 px-8 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold text-sm shadow-md hover:shadow-[0_0_18px_rgba(244,114,182,0.45)] transition-all hover:scale-[1.015]"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving changes...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      ) : activeTab === "notifications" ? (
        <Card className="border border-slate-200 bg-white shadow-sm rounded-3xl overflow-hidden">
          <CardHeader className="border-b border-slate-100 py-6 px-8 sm:px-10 bg-slate-50/50">
            <CardTitle className="text-xl font-medium text-slate-900 flex items-center gap-2.5">
              <Bell className="w-6 h-6 text-rose-500" />
              Recent Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 sm:p-10 space-y-5">
            <div className="flex gap-4 p-5 rounded-2xl border border-slate-150 bg-white hover:border-rose-300 hover:-translate-y-0.5 hover:shadow-md hover:bg-slate-50/50 transition-all duration-300 cursor-pointer group">
              <div className="h-11 w-11 bg-rose-50 rounded-2xl flex items-center justify-center border border-rose-100 text-rose-600 shrink-0 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                  <h4 className="font-semibold text-slate-950 text-base leading-none">Welcome to ServeSync+!</h4>
                  <Badge className="bg-white text-emerald-600 border border-emerald-200/80 font-semibold text-[9px] uppercase tracking-wider rounded-md py-0.5 px-2 select-none shadow-sm">
                    Welcome
                  </Badge>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed font-normal">
                  Thank you for joining ServeSync+! Start exploring amazing services and book your first appointment.
                </p>
                <div className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
                  <Clock className="w-3.5 h-3.5" /> Just now
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border border-slate-200 bg-white shadow-sm rounded-3xl overflow-hidden">
          <CardHeader className="border-b border-slate-100 py-6 px-8 sm:px-10 bg-slate-50/50">
            <CardTitle className="text-xl font-medium text-slate-900 flex items-center gap-2.5">
              <Activity className="w-6 h-6 text-rose-500" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 sm:p-10">
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No recent activity to display</p>
              <p className="text-sm text-slate-400 mt-1">Your activities will appear here</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}