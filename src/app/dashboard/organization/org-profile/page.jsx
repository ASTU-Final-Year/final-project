"use client";

import { useEffect, useState, useRef } from "react";
import RequestHandler from "@/lib/request-handler";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOrganizationStore } from "@/store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
Building2,
Mail,
Phone,
MapPin,
Calendar,
CheckCircle,
Loader2,
Camera,
Edit2,
CalendarDays,
Check,
Building,
User,
ShieldCheck,
Save,
Briefcase,
Bell,
Clock,
Sparkles
} from "lucide-react";

export default function OrganizationProfilePage() {
const organization = useOrganizationStore(({ organization }) => organization);
const setOrganization = useOrganizationStore(({ setOrganization }) => setOrganization);
const [isLoading, setIsLoading] = useState(organization == null);
const [isSaving, setIsSaving] = useState(false);
const [isEditing, setIsEditing] = useState(false);
const [activeTab, setActiveTab] = useState("profile");
// Local state for editable fields
const [profileForm, setProfileForm] = useState({
name: "",
email: "",
phone: "",
address: "",
sector: "",
foundedDate: "2026-05-10",
});
const [profilePic, setProfilePic] = useState(null);
const fileInputRef = useRef(null);

// Load organization details from backend or store
useEffect(() => {
const fetchOrgData = async () => {
try {
const orgRes = await RequestHandler.Get("/query/v1/organization");
if (orgRes.ok) {
const {
organizations: [fetchedOrg],
} = await orgRes.json();
setOrganization(fetchedOrg);
setProfileForm({
name: fetchedOrg.name || "",
email: fetchedOrg.email || "",
phone: fetchedOrg.phone || "",
address: fetchedOrg.address || "",
sector: fetchedOrg.sector || fetchedOrg.category || "Service Industry",
foundedDate: fetchedOrg.foundedDate || "2026-05-10",
});
}
} catch (error) {
console.error("Failed to load organization data", error);
} finally {
setIsLoading(false);
}
};
fetchOrgData();
}, [setOrganization]);

// Handle local state updates
useEffect(() => {
if (organization) {
setProfileForm({
name: organization.name || "",
email: organization.email || "",
phone: organization.phone || "",
address: organization.address || "",
sector: organization.sector || organization.category || "Service Industry",
foundedDate: organization.foundedDate || "2026-05-10",
});
if (organization.profilePic) {
setProfilePic(organization.profilePic);
}
}
}, [organization]);

// Handle form change
const handleChange = (e) => {
const { name, value } = e.target;
setProfileForm((prev) => ({
...prev,
[name]: value,
}));
};

// Simulated image upload using FileReader
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
if (organization) {
const updatedOrg = { ...organization, profilePic: base64String };
setOrganization(updatedOrg);
}
toast.success("Profile photo uploaded successfully!");
};
reader.readAsDataURL(file);
}
};

// Simulate updating database record
const handleSaveChanges = async (e) => {
e.preventDefault();
setIsSaving(true);
await new Promise((resolve) => setTimeout(resolve, 1200));
if (organization) {
const updatedOrg = {
...organization,
name: profileForm.name,
email: profileForm.email,
phone: profileForm.phone,
address: profileForm.address,
sector: profileForm.sector,
foundedDate: profileForm.foundedDate,
profilePic: profilePic,
};
setOrganization(updatedOrg);
setIsEditing(false);
setIsSaving(false);
toast.success("Organization profile updated successfully!");
} else {
setIsSaving(false);
toast.error("Unable to update. Session expired.");
}
};

if (isLoading) {
return (
<div className="h-96 flex items-center justify-center bg-white border border-slate-200 rounded-2xl shadow-sm">
<div className="text-center space-y-3">
<Loader2 className="h-10 w-10 animate-spin text-indigo-600 mx-auto" />
<p className="text-sm font-medium text-slate-550">Loading organization profile...</p>
</div>
</div>
);
}

if (!organization) {
return (
<div className="p-8 text-center bg-white border border-slate-200 rounded-2xl shadow-sm">
<Building className="h-12 w-12 text-slate-300 mx-auto mb-4" />
<h3 className="text-lg font-medium text-slate-700">No Organization Session Found</h3>
<p className="text-sm text-slate-500 mt-1">Please sign in with your admin credentials to access your profile.</p>
</div>
);
}

const memberDate = organization.createdAt 
? new Date(organization.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
: "May 2026";

return (
<div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-slate-700">
{/* 1. Header Banner & Profile Information Card */}
<Card className="border border-slate-200 overflow-hidden bg-white shadow-md rounded-3xl transition-shadow hover:shadow-lg duration-300">
{/* Banner Section */}
<div className="h-40 sm:h-56 w-full bg-gradient-to-r from-violet-600 via-indigo-600 to-indigo-700 relative shrink-0">
<div className="absolute top-4 right-4 flex gap-2">
<Badge className="bg-white/20 text-white border-0 font-medium text-[10px] px-3 py-1 rounded-full backdrop-blur-sm shadow-sm select-none tracking-wider">
PRO ACCOUNT
</Badge>
</div>
{/* Avatar Picture container overlapping bottom edge */}
<div 
onClick={handlePhotoUploadClick}
className="w-28 h-28 sm:w-36 sm:h-36 border-4 border-white bg-slate-50 rounded-full shadow-xl absolute -bottom-14 sm:-bottom-18 left-8 flex items-center justify-center overflow-hidden group cursor-pointer transition-transform duration-300 hover:scale-105"
>
{profilePic ? (
<img 
src={profilePic} 
alt={organization.name} 
className="h-full w-full object-cover"
/>
) : (
<div className="h-full w-full bg-gradient-to-tr from-violet-100 to-indigo-150 flex items-center justify-center text-indigo-700 font-medium text-4xl">
{organization.name?.substring(0, 2).toUpperCase() || "OR"}
</div>
)}
{/* Upload Camera Overlay */}
<div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-255 flex items-center justify-center text-white flex-col">
<Camera className="w-6 h-6 drop-shadow-md animate-pulse" />
<span className="text-[10px] mt-1.5 font-medium uppercase tracking-wider drop-shadow-md">Upload Logo</span>
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

{/* Card Main Info area */}
<CardContent className="pt-18 sm:pt-22 pb-6 px-8 sm:px-10">
<div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
<div className="space-y-3">
<div className="flex flex-wrap items-center gap-3">
<h1 className="text-2xl sm:text-3.5xl font-medium text-slate-900 tracking-tight leading-none">
{organization.name}
</h1>
{/* VERY LEGIBLE VERIFIED BADGE - White rounded button with green text and emerald borders */}
<Badge className="bg-white hover:bg-white text-emerald-600 border border-emerald-200/80 gap-1 rounded-full px-3 py-1 font-semibold text-xs shadow-sm select-none">
<ShieldCheck className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
Verified Partner
</Badge>
</div>
<div className="flex items-center gap-2 text-slate-500 font-medium text-sm tracking-wide">
<Calendar className="w-4 h-4 text-indigo-500" />
<span>Member since {memberDate}</span>
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
: "bg-white text-slate-850 text-slate-800 hover:bg-slate-50 hover:border-slate-350"
)}
>
<Edit2 className="w-4 h-4 text-indigo-500" />
{isEditing ? "Cancel Edit" : "Edit Profile"}
</Button>
</div>
</CardContent>
</Card>

{/* 2. Aggregate Statistics row */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
{/* Total Appointments */}
<Card className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm flex items-center justify-between transition-all duration-300 hover:shadow-md hover:scale-[1.015]">
<div className="space-y-1">
<p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Total Appointments</p>
<p className="text-4.5xl font-medium text-slate-900 tracking-tight mt-1.5">4</p>
</div>
<div className="h-14 w-14 rounded-2xl bg-indigo-50 flex items-center justify-center border border-indigo-100 text-indigo-650 text-indigo-600 shadow-inner shrink-0 bg-indigo-50/50">
<CalendarDays className="h-7 w-7" />
</div>
</Card>

{/* Completed Services */}
<Card className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm flex items-center justify-between transition-all duration-300 hover:shadow-md hover:scale-[1.015]">
<div className="space-y-1">
<p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Completed Services</p>
<p className="text-4.5xl font-medium text-slate-900 tracking-tight mt-1.5">0</p>
</div>
<div className="h-14 w-14 rounded-2xl bg-emerald-50 flex items-center justify-center border border-emerald-100 text-emerald-650 text-emerald-600 shadow-inner shrink-0 bg-emerald-50/50">
<CheckCircle className="h-7 w-7" />
</div>
</Card>
</div>

{/* 3. Navigation Tab pills */}
<div className="flex bg-slate-100/90 p-1.5 rounded-2xl max-w-xs sm:max-w-sm border border-slate-200/60 shadow-inner">
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
</div>

{/* 4. Tab Contents - Profile Info Form or Notifications */}
{activeTab === "profile" ? (
<Card className="border border-slate-200 bg-white shadow-sm rounded-3xl overflow-hidden">
<CardHeader className="border-b border-slate-100 py-6 px-8 sm:px-10 bg-slate-50/50">
<CardTitle className="text-xl sm:text-2xl font-medium text-slate-900">
Personal Information
</CardTitle>
</CardHeader>
<CardContent className="p-8 sm:p-10">
<form onSubmit={handleSaveChanges} className="space-y-8">
{/* Form Input fields Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
{/* Organization Status - READ ONLY badge */}
<div className="space-y-2.5">
<Label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Account Status</Label>
<div className="flex items-center gap-3 border border-slate-100 bg-slate-50/50 h-14 px-5 rounded-2xl">
<div className={cn("h-2.5 w-2.5 rounded-full shrink-0", organization.isActive !== false ? "bg-emerald-500 animate-pulse" : "bg-rose-500")} />
<span className="font-medium text-slate-700 text-sm sm:text-base">
{organization.isActive !== false ? "Active Standard Account" : "Suspended"}
</span>
</div>
</div>

{/* Name */}
<div className="space-y-2.5">
<Label htmlFor="name" className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Organization Name</Label>
{isEditing ? (
<div className="relative">
<Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-500" />
<Input
id="name"
name="name"
value={profileForm.name}
onChange={handleChange}
className="pl-12 h-14 rounded-2xl border-slate-200 text-sm sm:text-base font-normal text-slate-800 focus:border-indigo-400 focus:ring-indigo-400/20"
required
/>
</div>
) : (
<div className="flex items-center gap-4 text-slate-800 h-14 bg-white border border-slate-150 px-5 rounded-2xl hover:border-violet-300 hover:bg-violet-50/5 hover:shadow-sm transition-all duration-300 cursor-default group">
<div className="h-8 w-8 rounded-xl bg-violet-100 flex items-center justify-center text-violet-650 shrink-0 group-hover:scale-105 transition-transform">
<User className="h-4.5 w-4.5" />
</div>
<div className="flex flex-col min-w-0">
<span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider leading-none mb-1">Company Name</span>
<span className="text-sm sm:text-base font-medium text-slate-850 truncate">{profileForm.name || "Not specified"}</span>
</div>
</div>
)}
</div>

{/* Email with Verified Badge */}
<div className="space-y-2.5">
<Label htmlFor="email" className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Email Address</Label>
{isEditing ? (
<div className="relative">
<Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-500" />
<Input
id="email"
name="email"
type="email"
value={profileForm.email}
onChange={handleChange}
className="pl-12 pr-28 h-14 rounded-2xl border-slate-200 text-sm sm:text-base font-normal text-slate-800 focus:border-indigo-400 focus:ring-indigo-400/20"
required
/>
<Badge className="absolute right-3 top-1/2 -translate-y-1/2 bg-white text-emerald-600 border border-emerald-200 gap-1 rounded-full py-1 font-semibold text-[9px] uppercase tracking-wider select-none shadow-sm">
<Check className="w-3 h-3 text-emerald-500" /> Verified
</Badge>
</div>
) : (
<div className="flex items-center justify-between text-slate-850 h-14 bg-white border border-slate-150 px-5 rounded-2xl hover:border-violet-300 hover:bg-violet-50/5 hover:shadow-sm transition-all duration-300 cursor-default group">
<div className="flex items-center gap-4 min-w-0">
<div className="h-8 w-8 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 group-hover:scale-105 transition-transform">
<Mail className="h-4.5 w-4.5" />
</div>
<div className="flex flex-col min-w-0">
<span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider leading-none mb-1">Corporate Email</span>
<span className="text-sm sm:text-base font-medium text-slate-850 truncate">{profileForm.email}</span>
</div>
</div>
<Badge className="bg-white text-emerald-600 border border-emerald-250/80 gap-1 rounded-full px-2.5 py-1 font-semibold text-[9px] uppercase tracking-wider shrink-0 select-none shadow-sm">
<Check className="w-3 h-3 text-emerald-500" /> Verified
</Badge>
</div>
)}
</div>

{/* Phone Number */}
<div className="space-y-2.5">
<Label htmlFor="phone" className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Phone Number</Label>
{isEditing ? (
<div className="relative">
<Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-500" />
<Input
id="phone"
name="phone"
value={profileForm.phone}
onChange={handleChange}
className="pl-12 h-14 rounded-2xl border-slate-200 text-sm sm:text-base font-normal text-slate-800 focus:border-indigo-400 focus:ring-indigo-400/20"
required
/>
</div>
) : (
<div className="flex items-center gap-4 text-slate-800 h-14 bg-white border border-slate-150 px-5 rounded-2xl hover:border-violet-300 hover:bg-violet-50/5 hover:shadow-sm transition-all duration-300 cursor-default group">
<div className="h-8 w-8 rounded-xl bg-sky-100 flex items-center justify-center text-sky-650 shrink-0 group-hover:scale-105 transition-transform">
<Phone className="h-4.5 w-4.5" />
</div>
<div className="flex flex-col min-w-0">
<span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider leading-none mb-1">Contact Line</span>
<span className="text-sm sm:text-base font-medium text-slate-850 truncate">{profileForm.phone || "Not specified"}</span>
</div>
</div>
)}
</div>

{/* Address */}
<div className="space-y-2.5">
<Label htmlFor="address" className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Address / Location</Label>
{isEditing ? (
<div className="relative">
<MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-500" />
<Input
id="address"
name="address"
value={profileForm.address}
onChange={handleChange}
className="pl-12 h-14 rounded-2xl border-slate-200 text-sm sm:text-base font-normal text-slate-800 focus:border-indigo-400 focus:ring-indigo-400/20"
required
/>
</div>
) : (
<div className="flex items-center gap-4 text-slate-800 h-14 bg-white border border-slate-150 px-5 rounded-2xl hover:border-violet-300 hover:bg-violet-50/5 hover:shadow-sm transition-all duration-300 cursor-default group">
<div className="h-8 w-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-650 shrink-0 group-hover:scale-105 transition-transform">
<MapPin className="h-4.5 w-4.5" />
</div>
<div className="flex flex-col min-w-0">
<span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider leading-none mb-1">Physical Address</span>
<span className="text-sm sm:text-base font-medium text-slate-850 truncate">{profileForm.address || "Not specified"}</span>
</div>
</div>
)}
</div>

{/* Category Sector */}
<div className="space-y-2.5">
<Label htmlFor="sector" className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Industry Sector</Label>
{isEditing ? (
<div className="relative">
<Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-500" />
<Input
id="sector"
name="sector"
value={profileForm.sector}
onChange={handleChange}
className="pl-12 h-14 rounded-2xl border-slate-200 text-sm sm:text-base font-normal text-slate-800 focus:border-indigo-400 focus:ring-indigo-400/20"
/>
</div>
) : (
<div className="flex items-center gap-4 text-slate-800 h-14 bg-white border border-slate-150 px-5 rounded-2xl hover:border-violet-300 hover:bg-violet-50/5 hover:shadow-sm transition-all duration-300 cursor-default group">
<div className="h-8 w-8 rounded-xl bg-violet-100 flex items-center justify-center text-violet-650 shrink-0 group-hover:scale-105 transition-transform">
<Briefcase className="h-4.5 w-4.5" />
</div>
<div className="flex flex-col min-w-0">
<span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider leading-none mb-1">Domain Sector</span>
<span className="text-sm sm:text-base font-medium text-slate-850 truncate">{profileForm.sector}</span>
</div>
</div>
)}
</div>

{/* Founded Date */}
<div className="space-y-2.5">
<Label htmlFor="foundedDate" className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Founded Date</Label>
{isEditing ? (
<div className="relative">
<Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-500" />
<Input
id="foundedDate"
name="foundedDate"
type="date"
value={profileForm.foundedDate}
onChange={handleChange}
className="pl-12 h-14 rounded-2xl border-slate-200 text-sm sm:text-base font-normal text-slate-800 focus:border-indigo-400 focus:ring-indigo-400/20"
/>
</div>
) : (
<div className="flex items-center gap-4 text-slate-805 text-slate-800 h-14 bg-white border border-slate-150 px-5 rounded-2xl hover:border-violet-300 hover:bg-violet-50/5 hover:shadow-sm transition-all duration-300 cursor-default group">
<div className="h-8 w-8 rounded-xl bg-teal-100 flex items-center justify-center text-teal-650 shrink-0 group-hover:scale-105 transition-transform">
<Calendar className="h-4.5 w-4.5" />
</div>
<div className="flex flex-col min-w-0">
<span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider leading-none mb-1">Founding Milestone</span>
<span className="text-sm sm:text-base font-medium text-slate-850 truncate">
{profileForm.foundedDate
? new Date(profileForm.foundedDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
: "Not specified"
}
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
className="h-12 px-8 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-md hover:shadow-[0_0_18px_rgba(99,102,241,0.45)] transition-all hover:scale-[1.015]"
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
) : (
/* Notifications Tab */
<Card className="border border-slate-200 bg-white shadow-sm rounded-3xl overflow-hidden">
<CardHeader className="border-b border-slate-100 py-6 px-8 sm:px-10 bg-slate-50/50">
<CardTitle className="text-xl font-medium text-slate-900 flex items-center gap-2.5">
<Bell className="w-6 h-6 text-indigo-650 text-indigo-500" />
Recent Notifications
</CardTitle>
</CardHeader>
<CardContent className="p-8 sm:p-10 space-y-5">
{/* Notif 1 */}
<div className="flex gap-4 p-5 rounded-2xl border border-slate-150 bg-white hover:border-violet-300 hover:-translate-y-0.5 hover:shadow-md hover:bg-slate-50/50 transition-all duration-300 cursor-pointer group">
<div className="h-11 w-11 bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100 text-indigo-650 text-indigo-600 shrink-0 group-hover:scale-105 transition-transform">
<Sparkles className="w-5 h-5 animate-pulse" />
</div>
<div className="space-y-1.5 flex-1 min-w-0">
<div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
<h4 className="font-semibold text-slate-950 text-base leading-none">Welcome to ServeSync+!</h4>
<Badge className="bg-white text-emerald-600 border border-emerald-200/80 font-semibold text-[9px] uppercase tracking-wider rounded-md py-0.5 px-2 select-none shadow-sm">
System
</Badge>
</div>
<p className="text-slate-605 text-slate-600 text-sm leading-relaxed font-normal">
Your organization account has been fully verified and setup. You can now start registering calendars, services, and employee slots to receive customer bookings.
</p>
<div className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
<Clock className="w-3.5 h-3.5" /> Just now
</div>
</div>
</div>

{/* Notif 2 */}
<div className="flex gap-4 p-5 rounded-2xl border border-slate-150 bg-white hover:border-violet-300 hover:-translate-y-0.5 hover:shadow-md hover:bg-slate-50/50 transition-all duration-300 cursor-pointer group">
<div className="h-11 w-11 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100 text-blue-650 text-blue-600 shrink-0 group-hover:scale-105 transition-transform">
<ShieldCheck className="w-5 h-5" />
</div>
<div className="space-y-1.5 flex-1 min-w-0">
<div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
<h4 className="font-semibold text-slate-950 text-base leading-none">Security Profile Configured</h4>
<Badge className="bg-white text-emerald-600 border border-emerald-200/80 font-semibold text-[9px] uppercase tracking-wider rounded-md py-0.5 px-2 select-none shadow-sm">
Security
</Badge>
</div>
<p className="text-slate-605 text-slate-600 text-sm leading-relaxed font-normal">
Your email verification check completed successfully. Keep your administrator password protected.
</p>
<div className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
<Clock className="w-3.5 h-3.5" /> 2 hours ago
</div>
</div>
</div>

</CardContent>
</Card>
)}

</div>
);
}

