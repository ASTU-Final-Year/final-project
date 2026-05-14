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
} from "lucide-react";
import RequestHandler from "@/lib/request-handler";
import { useSessionStore } from "@/store";

export default function ClientProfilePage() {
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
    email: "",
    phone: "",
    gender: "U",
  });

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Get user profile - using "mine" parameter
        const userRes = await RequestHandler.Get("/query/v1/user?mine");
        if (userRes.ok) {
          const {
            users: [userData],
          } = await userRes.json();
          if (userData) {
            setProfile(userData);
            setEditForm({
              firstname: userData.firstname || "",
              lastname: userData.lastname || "",
              email: userData.email || "",
              phone: userData.phone || "",
              gender: userData.gender || "U",
            });

            // Load preferences from user profile
            if (userData.preferences?.notifications) {
              setNotifications((prev) => ({
                ...prev,
                ...userData.preferences.notifications,
              }));
            }
          }
        }

        // Fetch user's appointments stats
        const appointmentsRes = await RequestHandler.Get(
          '/query/v1/appointment?mine&select={"":["status"]}',
        );
        if (appointmentsRes.ok) {
          const { appointments } = await appointmentsRes.json();
          const completed =
            appointments?.filter((apt) => apt.status === "completed").length ||
            0;
          setStats({
            totalAppointments: appointments?.length || 0,
            completedServices: completed,
          });
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      const res = await RequestHandler.Patch("/query/v1/user?mine", {
        body: editForm,
      });
      if (res.ok) {
        const { users } = await res.json();
        if (users && users[0]) {
          setProfile((prev) => ({ ...prev, ...users[0] }));
        }
        toast.success("Profile updated successfully");
        setProfileUpdateHash((p) => p + 1);
        setEditing(false);
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handlePhotoUpload = async (file) => {
    if (!file) return;

    // Validate file size (1MB max)
    if (file.size > 1 * 1024 * 1024) {
      toast.error("File size must be less than 1MB");
      return;
    }

    // Validate file type
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

      if (res.ok) {
        const data = await res.json();
        if (data.profile_picture?.[0]?.profile) {
          setProfile((prev) => ({
            ...prev,
            profile: data.profile_picture[0].profile,
          }));
        }
        toast.success("Profile photo updated successfully");
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload photo");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleNotificationChange = async (key, value) => {
    const newNotifications = { ...notifications, [key]: value };
    setNotifications(newNotifications);

    // Save preferences via API
    try {
      await RequestHandler.Patch("/query/v1/user?mine", {
        body: {
          preferences: {
            ...profile?.preferences,
            notifications: newNotifications,
          },
        },
      });
      toast.success("Notification preferences updated");
    } catch (error) {
      console.error("Failed to save preferences:", error);
      toast.error("Failed to save preferences");
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 p-6">
        <div className="flex justify-between items-start">
          <div className="flex gap-4">
            <Skeleton className="w-24 h-24 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  const fullName = `${profile?.firstname || ""} ${profile?.lastname || ""}`;
  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Jan 2024";

  return (
    <div className="max-w-6xl mx-auto space-y-4 min-h-screen">
      {/* Header Section with Avatar */}
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-500 to-purple-600" />
        <CardContent className="relative pt-16">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end justify-between">
            <div className="flex gap-6 items-end">
              <div className="relative group">
                <Avatar className="w-28 h-28 border-4 border-white shadow-lg">
                  <AvatarImage
                    src={`/api/v1/user/profile_picture?${profileUpdateHash}`}
                    alt={fullName}
                  />
                  <AvatarFallback className="bg-blue-500 text-white text-2xl">
                    {profile?.firstname?.[0]}
                    {profile?.lastname?.[0]}
                  </AvatarFallback>
                </Avatar>
                <label
                  htmlFor="photo-upload"
                  className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-md cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <ArrowUp className="w-4 h-4 text-gray-600" />
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/jpeg,image/png"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handlePhotoUpload(e.target.files[0]);
                      }
                    }}
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
                <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap mt-1">
                  {/* GREEN VERIFIED BADGE - Header */}
                  <Badge className="gap-1 bg-green-100 text-green-700 border-green-200 hover:bg-green-200">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    Verified
                  </Badge>
                  <span>Member since {memberSince}</span>
                  {profile?.role === "client" && (
                    <Badge variant="outline" className="gap-1">
                      <User className="w-3 h-3" />
                      Client
                    </Badge>
                  )}
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

      {/* Stats Cards */}
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
              <Calendar className="w-8 h-8 text-blue-500" />
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
                    <User className="w-4 h-4" /> First Name
                  </Label>
                  {editing ? (
                    <Input
                      value={editForm.firstname}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          firstname: e.target.value,
                        })
                      }
                      placeholder="First Name"
                    />
                  ) : (
                    <p className="text-foreground">{profile?.firstname}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <User className="w-4 h-4" /> Last Name
                  </Label>
                  {editing ? (
                    <Input
                      value={editForm.lastname}
                      onChange={(e) =>
                        setEditForm({ ...editForm, lastname: e.target.value })
                      }
                      placeholder="Last Name"
                    />
                  ) : (
                    <p className="text-foreground">{profile?.lastname}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <User className="w-4 h-4" /> Gender
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
                      {profile?.gender === "M"
                        ? "Male"
                        : profile?.gender === "F"
                          ? "Female"
                          : "Prefer not to say"}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Mail className="w-4 h-4" /> Email Address
                  </Label>
                  {editing ? (
                    <div className="flex items-center gap-2 flex-wrap">
                      <Input
                        value={editForm.email}
                        onChange={(e) =>
                          setEditForm({ ...editForm, email: e.target.value })
                        }
                        type="email"
                        className="flex-1"
                      />
                      {/* GREEN VERIFIED BADGE - Email (edit mode) */}
                      <Badge className="gap-1 bg-green-100 text-green-700 border-green-200 shrink-0">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                        Verified
                      </Badge>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <p className="text-foreground">{profile?.email}</p>
                      {/* GREEN VERIFIED BADGE - Email (view mode) */}
                      <Badge className="gap-1 bg-green-100 text-green-700 border-green-200">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                        Verified
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Phone className="w-4 h-4" /> Phone Number
                  </Label>
                  {editing ? (
                    <Input
                      value={editForm.phone}
                      onChange={(e) =>
                        setEditForm({ ...editForm, phone: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-foreground">{profile?.phone}</p>
                  )}
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
                  onCheckedChange={(checked) =>
                    handleNotificationChange("emailNotifications", checked)
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">SMS Alerts</p>
                  <p className="text-sm text-muted-foreground">
                    Get real-time booking alerts on your mobile phone
                  </p>
                </div>
                <Switch
                  checked={notifications.smsAlerts}
                  onCheckedChange={(checked) =>
                    handleNotificationChange("smsAlerts", checked)
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
                  onCheckedChange={(checked) =>
                    handleNotificationChange("appointmentReminders", checked)
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">Promotional Offers</p>
                  <p className="text-sm text-muted-foreground">
                    Be the first to hear about seasonal discounts and offers
                  </p>
                </div>
                <Switch
                  checked={notifications.promotionalOffers}
                  onCheckedChange={(checked) =>
                    handleNotificationChange("promotionalOffers", checked)
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