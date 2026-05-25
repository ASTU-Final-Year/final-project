// src/app/dashboard/client/profile/page.jsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  User,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  Bell,
  PenLine,
  Loader2,
  ArrowUp,
  VenusAndMars,
} from "lucide-react";
import RequestHandler from "@/lib/request-handler";
import { useSessionStore } from "@/store";

export default function EmployeeProfilePage() {
  const [profile, setProfile] = useState(null);
  const profileUpdateHash = useSessionStore((s) => s.profileUpdateHash);
  const setProfileUpdateHash = useSessionStore((s) => s.setProfileUpdateHash);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    completedServices: 0,
  });
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsAlerts: true,
    appointmentReminders: true,
    promotionalOffers: false,
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [editForm, setEditForm] = useState({
    firstname: "",
    lastname: "",
    phone: "",
    gender: "U",
  });

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Use the query endpoint with "mine" to get current user
        const userRes = await RequestHandler.Get("/query/v1/user?mine");
        if (!userRes.ok) throw new Error("Failed to fetch user");

        const { users } = await userRes.json();
        const userData = users?.[0];
        if (!userData) throw new Error("No user data");

        setProfile(userData);
        setEditForm({
          firstname: userData.firstname || "",
          lastname: userData.lastname || "",
          phone: userData.phone || "",
          gender: userData.gender || "U",
        });

        // Load notification preferences from the preferences JSON
        if (userData.preferences?.notifications) {
          setNotifications((prev) => ({
            ...prev,
            ...userData.preferences.notifications,
          }));
        }

        // Fetch appointment stats (adjust endpoint if needed)
        const aptRes = await RequestHandler.Get(
          '/query/v1/appointment?mine&select={"":["status"]}',
        );
        if (aptRes.ok) {
          const { appointments } = await aptRes.json();
          const completed =
            appointments?.filter((a) => a.status === "completed").length || 0;
          setStats({
            totalAppointments: appointments?.length || 0,
            completedServices: completed,
          });
        }
      } catch (err) {
        console.error(err);
        toast.error("Could not load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Update core profile fields (name, phone, gender)
  const handleUpdateProfile = async () => {
    try {
      const res = await RequestHandler.Patch("/query/v1/user?mine", {
        body: {
          firstname: editForm.firstname,
          lastname: editForm.lastname,
          phone: editForm.phone,
          gender: editForm.gender,
        },
      });
      if (!res.ok) throw new Error("Update failed");

      const { users } = await res.json();
      if (users?.[0]) setProfile((prev) => ({ ...prev, ...users[0] }));

      toast.success("Profile updated");
      setProfileUpdateHash((h) => h + 1);
      setEditing(false);
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  // Update notification preferences (stored in preferences JSON)
  const handleNotificationChange = async (key, value) => {
    const newPrefs = { ...notifications, [key]: value };
    setNotifications(newPrefs);
    try {
      await RequestHandler.Patch("/query/v1/user?mine", {
        body: {
          preferences: {
            ...profile?.preferences,
            notifications: newPrefs,
          },
        },
      });
      toast.success("Notification preferences saved");
    } catch {
      toast.error("Failed to save preferences");
    }
  };

  // Photo upload (same as employee page)
  const handlePhotoUpload = async (file) => {
    if (!file) return;
    if (file.size > 1 * 1024 * 1024) {
      toast.error("File size must be less than 1MB");
      return;
    }
    if (!file.type.match(/image\/(jpeg|png)/)) {
      toast.error("Only JPEG and PNG images are allowed");
      return;
    }

    const formData = new FormData();
    formData.append("profile", file);
    setUploadingPhoto(true);
    try {
      const res = await fetch("/api/v1/user/profile_picture", {
        method: "PUT",
        body: formData,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      if (data.profile_picture?.[0]?.profile) {
        setProfile((prev) => ({
          ...prev,
          profile: data.profile_picture[0].profile,
        }));
      }
      toast.success("Photo updated");
      setProfileUpdateHash((h) => h + 1);
    } catch {
      toast.error("Failed to upload photo");
    } finally {
      setUploadingPhoto(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex gap-4">
          <Skeleton className="w-24 h-24 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-32" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6 text-center text-red-500">
        Unable to load profile. Please try again later.
      </div>
    );
  }

  const fullName = `${profile.firstname || ""} ${profile.lastname || ""}`;
  const memberSince = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Unknown";

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4 md:p-6">
      {/* Header with avatar */}
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-indigo-500 to-indigo-700" />
        <CardContent className="relative pt-20">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end justify-between">
            <div className="flex gap-6 items-end">
              <div className="relative group">
                <Avatar className="w-28 h-28 border-4 shadow-lg rounded-[12px] border-border/40 ring-1 ring-primary/10 overflow-clip">
                  <AvatarImage
                    className="rounded"
                    src={`/api/v1/user/profile_picture?${profileUpdateHash}`}
                    alt={fullName}
                  />
                  <AvatarFallback className="bg-indigo-500 text-white text-2xl rounded">
                    {profile.firstname?.[0]}
                    {profile.lastname?.[0]}
                  </AvatarFallback>
                </Avatar>
                <label
                  htmlFor="client-photo-upload"
                  className="absolute -bottom-2 -right-2 border-2 border-primary/10 p-1.5 bg-white rounded-full shadow-md cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <ArrowUp className="w-4 h-4 text-gray-600" />
                  <input
                    id="client-photo-upload"
                    type="file"
                    accept="image/jpeg,image/png"
                    className="hidden"
                    onChange={(e) =>
                      e.target.files?.[0] &&
                      handlePhotoUpload(e.target.files[0])
                    }
                    disabled={uploadingPhoto}
                  />
                </label>
                {uploadingPhoto && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                )}
              </div>
              <div className="mb-2">
                <h1 className="text-2xl font-bold">{fullName}</h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                  <Badge variant="secondary" className="gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Verified
                  </Badge>
                  <span>Member since {memberSince}</span>
                  <Badge variant="outline" className="gap-1">
                    <User className="w-3 h-3" />
                    Client
                  </Badge>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setEditing(!editing)}
              className="gap-2"
              disabled={uploadingPhoto}
            >
              <PenLine className="w-4 h-4" />
              {editing ? "Cancel" : "Edit Profile"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Appointments
                </p>
                <p className="text-2xl font-bold">{stats.totalAppointments}</p>
              </div>
              <Calendar className="w-8 h-8 text-indigo-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Completed Services
                </p>
                <p className="text-2xl font-bold">{stats.completedServices}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="profile">Profile Info</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* Profile Information Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    First Name
                  </Label>
                  {editing ? (
                    <Input
                      value={editForm.firstname}
                      onChange={(e) =>
                        setEditForm({ ...editForm, firstname: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-foreground">{profile.firstname}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    Last Name
                  </Label>
                  {editing ? (
                    <Input
                      value={editForm.lastname}
                      onChange={(e) =>
                        setEditForm({ ...editForm, lastname: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-foreground">{profile.lastname}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <VenusAndMars className="w-4 h-4 text-muted-foreground" />
                    Gender
                  </Label>
                  {editing ? (
                    <select
                      value={editForm.gender}
                      onChange={(e) =>
                        setEditForm({ ...editForm, gender: e.target.value })
                      }
                      className="w-full p-2 border rounded-md bg-background"
                    >
                      <option value="U">Prefer not to say</option>
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                    </select>
                  ) : (
                    <p className="text-foreground">
                      {profile.gender === "M"
                        ? "Male"
                        : profile.gender === "F"
                          ? "Female"
                          : "Prefer not to say"}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    Phone Number
                  </Label>
                  {editing ? (
                    <Input
                      value={editForm.phone}
                      onChange={(e) =>
                        setEditForm({ ...editForm, phone: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-foreground">
                      {profile.phone || "Not provided"}
                    </p>
                  )}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    Email Address
                  </Label>
                  <div className="flex items-center gap-2">
                    <p className="text-foreground">{profile.email}</p>
                    <Badge variant="outline" className="gap-1">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      Verified
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Email cannot be changed
                  </p>
                </div>
              </div>
              {editing && (
                <div className="flex gap-3 pt-4">
                  <Button onClick={handleUpdateProfile}>Save Changes</Button>
                  <Button variant="outline" onClick={() => setEditing(false)}>
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive service updates and billing reports via email
                  </p>
                </div>
                <Switch
                  checked={notifications.emailNotifications}
                  onCheckedChange={(val) =>
                    handleNotificationChange("emailNotifications", val)
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">SMS Alerts</p>
                  <p className="text-sm text-muted-foreground">
                    Get real‑time booking alerts on your mobile phone
                  </p>
                </div>
                <Switch
                  checked={notifications.smsAlerts}
                  onCheckedChange={(val) =>
                    handleNotificationChange("smsAlerts", val)
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">Appointment Reminders</p>
                  <p className="text-sm text-muted-foreground">
                    Receive reminders before your upcoming appointments
                  </p>
                </div>
                <Switch
                  checked={notifications.appointmentReminders}
                  onCheckedChange={(val) =>
                    handleNotificationChange("appointmentReminders", val)
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">Promotional Offers</p>
                  <p className="text-sm text-muted-foreground">
                    Be the first to hear about seasonal discounts
                  </p>
                </div>
                <Switch
                  checked={notifications.promotionalOffers}
                  onCheckedChange={(val) =>
                    handleNotificationChange("promotionalOffers", val)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
