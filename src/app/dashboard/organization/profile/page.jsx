"use client";

import { useEffect, useState, useRef } from "react";
import RequestHandler from "@/lib/request-handler";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useOrganizationStore, useSessionStore } from "@/store";
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
  Bell,
  Clock,
  Sparkles,
  ShieldCheck,
  User,
  Briefcase,
  Save,
  X,
  ArrowUp,
  VenusAndMars,
} from "lucide-react";

export default function OrganizationProfilePage() {
  const organization = useOrganizationStore((state) => state.organization);
  const setOrganization = useOrganizationStore(
    (state) => state.setOrganization,
  );
  const profileUpdateHash = useSessionStore((s) => s.profileUpdateHash);
  const setProfileUpdateHash = useSessionStore((s) => s.setProfileUpdateHash);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditingOrg, setIsEditingOrg] = useState(false);
  const [isEditingAdmin, setIsEditingAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState("organization");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef(null);

  // Admin profile state
  const [adminProfile, setAdminProfile] = useState(null);
  const [adminEditForm, setAdminEditForm] = useState({
    firstname: "",
    lastname: "",
    phone: "",
    gender: "U",
  });

  // Organization profile state
  const [orgForm, setOrgForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    sector: "",
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsAlerts: true,
    appointmentReminders: true,
    promotionalOffers: false,
  });

  // Fetch organization and admin data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch organization
        const orgRes = await RequestHandler.Get("/query/v1/organization");
        if (orgRes.ok) {
          const { organizations } = await orgRes.json();
          const fetchedOrg = organizations?.[0];
          if (fetchedOrg) {
            setOrganization(fetchedOrg);
            setOrgForm({
              name: fetchedOrg.name || "",
              email: fetchedOrg.email || "",
              phone: fetchedOrg.phone || "",
              address: fetchedOrg.address || "",
              sector: fetchedOrg.sector || "Service Industry",
            });
          }
        }

        // Fetch admin user profile
        const userRes = await RequestHandler.Get("/query/v1/user?mine");
        if (userRes.ok) {
          const { users } = await userRes.json();
          const userData = users?.[0];
          if (userData) {
            setAdminProfile(userData);
            setAdminEditForm({
              firstname: userData.firstname || "",
              lastname: userData.lastname || "",
              phone: userData.phone || "",
              gender: userData.gender || "U",
            });
          }
        }

        // Load notification preferences if stored
        if (organization?.preferences?.notifications) {
          setNotifications((prev) => ({
            ...prev,
            ...organization.preferences.notifications,
          }));
        }
      } catch (error) {
        console.error("Failed to load data", error);
        toast.error("Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [setOrganization]);

  // Handle organization update
  const handleUpdateOrganization = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await RequestHandler.Patch("/query/v1/organization", {
        body: {
          name: orgForm.name,
          phone: orgForm.phone,
          address: orgForm.address,
          sector: orgForm.sector,
        },
      });

      if (!res.ok) throw new Error("Update failed");

      const { organizations } = await res.json();
      if (organizations?.[0]) {
        setOrganization(organizations[0]);
      }

      setIsEditingOrg(false);
      toast.success("Organization profile updated successfully!");
    } catch (error) {
      console.error("Failed to update:", error);
      toast.error("Failed to update organization profile");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle admin profile update
  const handleUpdateAdmin = async () => {
    setIsSaving(true);

    try {
      const res = await RequestHandler.Patch("/query/v1/user?mine", {
        body: {
          firstname: adminEditForm.firstname,
          lastname: adminEditForm.lastname,
          phone: adminEditForm.phone,
          gender: adminEditForm.gender,
        },
      });

      if (!res.ok) throw new Error("Update failed");

      const { users } = await res.json();
      if (users?.[0]) {
        setAdminProfile(users[0]);
      }

      setIsEditingAdmin(false);
      setProfileUpdateHash((p) => p + 1);
      toast.success("Admin profile updated successfully!");
    } catch (error) {
      console.error("Failed to update:", error);
      toast.error("Failed to update admin profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleNotificationChange = async (key, value) => {
    const newPrefs = { ...notifications, [key]: value };
    setNotifications(newPrefs);

    try {
      await RequestHandler.Patch("/query/v1/user?mine", {
        body: {
          preferences: {
            ...adminProfile?.preferences,
            notifications: newPrefs,
          },
        },
      });
      toast.success("Notification preferences saved");
    } catch {
      toast.error("Failed to save preferences");
    }
  };

  const handlePhotoUpload = async (file) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size must be less than 2MB");
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
        setOrganization({
          ...organization,
          profile: data.profile_picture[0].profile,
        });
      }
      toast.success("Logo updated successfully");
      setProfileUpdateHash((h) => h + 1);
    } catch {
      toast.error("Failed to upload logo");
    } finally {
      setUploadingPhoto(false);
    }
  };

  if (isLoading) {
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

  if (!organization || !adminProfile) {
    return (
      <div className="max-w-6xl mx-auto p-6 text-center">
        <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium">No Organization Found</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Please sign in with your admin credentials to access your profile.
        </p>
      </div>
    );
  }

  const memberSince = organization.createdAt
    ? new Date(organization.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "May 2026";

  const orgInitials = organization.name?.substring(0, 2).toUpperCase() || "OR";
  const adminFullName = `${adminProfile.firstname || ""} ${adminProfile.lastname || ""}`;

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4 md:p-6">
      {/* Header with avatar */}
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-primary to-primary/80" />
        <CardContent className="relative pt-20">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end justify-between">
            <div className="flex gap-6 items-end">
              <div className="relative group">
                <Avatar className="w-28 h-28 border-4 shadow-lg rounded-full border-border/40 ring-1 ring-primary/10 overflow-clip">
                  <AvatarImage
                    className="rounded"
                    src={`/api/v1/user/profile_picture?${profileUpdateHash}`}
                    alt={organization.name}
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl rounded-full">
                    {orgInitials}
                  </AvatarFallback>
                </Avatar>
                <label
                  htmlFor="org-photo-upload"
                  className="absolute -bottom-2 -right-2 border-2 border-primary/10 p-1.5 bg-white rounded-full shadow-md cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <ArrowUp className="w-4 h-4 text-gray-600" />
                  <input
                    id="org-photo-upload"
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
                <h1 className="text-2xl font-bold">{organization.name}</h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                  <Badge variant="secondary" className="gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Verified Partner
                  </Badge>
                  <span>Member since {memberSince}</span>
                  <Badge variant="outline" className="gap-1">
                    <Building2 className="w-3 h-3" />
                    Organization Admin
                  </Badge>
                </div>
              </div>
            </div>
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
                <p className="text-2xl font-bold">0</p>
              </div>
              <Calendar className="w-8 h-8 text-primary" />
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
                <p className="text-2xl font-bold">0</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs
        defaultValue="organization"
        className="space-y-4"
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="organization">Organization</TabsTrigger>
          <TabsTrigger value="admin">Admin Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* Organization Information Tab */}
        <TabsContent value="organization">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Organization Information</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingOrg(!isEditingOrg)}
                  className="gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  {isEditingOrg ? "Cancel" : "Edit"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    Organization Name
                  </Label>
                  {isEditingOrg ? (
                    <Input
                      name="name"
                      value={orgForm.name}
                      onChange={(e) =>
                        setOrgForm({ ...orgForm, name: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-foreground">{organization.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-muted-foreground" />
                    Industry Sector
                  </Label>
                  {isEditingOrg ? (
                    <Input
                      name="sector"
                      value={orgForm.sector}
                      onChange={(e) =>
                        setOrgForm({ ...orgForm, sector: e.target.value })
                      }
                      placeholder="e.g., Healthcare, Technology, Retail"
                    />
                  ) : (
                    <p className="text-foreground">
                      {organization.sector || "Not specified"}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    Email Address
                  </Label>
                  <div className="flex items-center gap-2">
                    <p className="text-foreground">{organization.email}</p>
                    <Badge variant="outline" className="gap-1">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      Verified
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Email cannot be changed
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    Phone Number
                  </Label>
                  {isEditingOrg ? (
                    <Input
                      name="phone"
                      value={orgForm.phone}
                      onChange={(e) =>
                        setOrgForm({ ...orgForm, phone: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-foreground">
                      {organization.phone || "Not provided"}
                    </p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    Address
                  </Label>
                  {isEditingOrg ? (
                    <Input
                      name="address"
                      value={orgForm.address}
                      onChange={(e) =>
                        setOrgForm({ ...orgForm, address: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-foreground">
                      {organization.address || "Not provided"}
                    </p>
                  )}
                </div>
              </div>

              {/* Account Status - Read Only */}
              <div className="pt-4 border-t">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Account Status
                </Label>
                <div className="flex items-center gap-3 mt-2 p-3 bg-muted/30 rounded-lg">
                  <div
                    className={cn(
                      "h-2.5 w-2.5 rounded-full",
                      organization.isActive !== false
                        ? "bg-green-500 animate-pulse"
                        : "bg-red-500",
                    )}
                  />
                  <span className="font-medium">
                    {organization.isActive !== false
                      ? "Active Standard Account"
                      : "Suspended"}
                  </span>
                </div>
              </div>

              {isEditingOrg && (
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleUpdateOrganization}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* Admin Profile Information Tab */}
        <TabsContent value="admin">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Admin Personal Information</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingAdmin(!isEditingAdmin)}
                  className="gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  {isEditingAdmin ? "Cancel" : "Edit"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    First Name
                  </Label>
                  {isEditingAdmin ? (
                    <Input
                      value={adminEditForm.firstname}
                      onChange={(e) =>
                        setAdminEditForm({
                          ...adminEditForm,
                          firstname: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <p className="text-foreground">{adminProfile.firstname}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    Last Name
                  </Label>
                  {isEditingAdmin ? (
                    <Input
                      value={adminEditForm.lastname}
                      onChange={(e) =>
                        setAdminEditForm({
                          ...adminEditForm,
                          lastname: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <p className="text-foreground">{adminProfile.lastname}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <VenusAndMars className="w-4 h-4 text-muted-foreground" />
                    Gender
                  </Label>
                  {isEditingAdmin ? (
                    <select
                      value={adminEditForm.gender}
                      onChange={(e) =>
                        setAdminEditForm({
                          ...adminEditForm,
                          gender: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded-md bg-background"
                    >
                      <option value="U">Prefer not to say</option>
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                    </select>
                  ) : (
                    <p className="text-foreground">
                      {adminProfile.gender === "M"
                        ? "Male"
                        : adminProfile.gender === "F"
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
                  {isEditingAdmin ? (
                    <Input
                      value={adminEditForm.phone}
                      onChange={(e) =>
                        setAdminEditForm({
                          ...adminEditForm,
                          phone: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <p className="text-foreground">
                      {adminProfile.phone || "Not provided"}
                    </p>
                  )}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    Email Address
                  </Label>
                  <div className="flex items-center gap-2">
                    <p className="text-foreground">{adminProfile.email}</p>
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
              {isEditingAdmin && (
                <div className="flex gap-3 pt-4">
                  <Button onClick={handleUpdateAdmin} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
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
                    Get real-time booking alerts on your mobile phone
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
                    Receive reminders before upcoming appointments
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
