// src/app/dashboard/employee/profile/page.jsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  User,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  Bell,
  Clock,
  Briefcase,
  GraduationCap,
  Heart,
  Shield,
  Lock,
  Key,
  PenLine,
  Loader2,
  ArrowUp,
} from "lucide-react";
import RequestHandler from "@/lib/request-handler";
import { useSessionStore } from "@/store";

export default function EmployeeProfilePage() {
  const [employee, setEmployee] = useState(null);
  const profileUpdateHash = useSessionStore((s) => s.profileUpdateHash);
  const setProfileUpdateHash = useSessionStore((s) => s.setProfileUpdateHash);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [editForm, setEditForm] = useState({
    firstname: "",
    lastname: "",
    phone: "",
    gender: "U",
    jobTitle: "",
    department: "",
    specialization: "",
    experienceYears: "",
    licenseNumber: "",
    medicalSchool: "",
  });

  // Notification preferences (stored in preferences JSON)
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsAlerts: true,
    dailyReminders: true,
    weeklyReports: false,
  });

  // Work schedule (stored in preferences as well)
  const [workSchedule, setWorkSchedule] = useState({
    monday: { start: "09:00", end: "17:00", enabled: true },
    tuesday: { start: "09:00", end: "17:00", enabled: true },
    wednesday: { start: "09:00", end: "17:00", enabled: true },
    thursday: { start: "09:00", end: "17:00", enabled: true },
    friday: { start: "09:00", end: "17:00", enabled: true },
    saturday: { start: "12:00", end: "13:00", enabled: true },
    sunday: { start: "12:00", end: "13:00", enabled: true },
    lunchBreak: { start: "12:00", end: "13:00", enabled: true },
  });

  // Skills & certifications (example – fetched from preferences)
  const [skills, setSkills] = useState([
    "Cardiology",
    "ECG",
    "Patient Care",
    "Emergency Medicine",
    "Telemedicine",
  ]);
  const [certifications, setCertifications] = useState([
    "Board Certified Cardiologist – American Board of Internal Medicine • 2018",
    "Advanced Cardiac Life Support (ACLS) – American Heart Association • 2023",
  ]);

  // Fetch employee data
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await RequestHandler.Get("/api/v1/employee");
        if (res.ok) {
          const data = await res.json();
          setEmployee(data.employee);
          setEditForm({
            firstname: data.employee.user?.firstname || "",
            lastname: data.employee.user?.lastname || "",
            phone: data.employee.user?.phone || "",
            gender: data.employee.user?.gender || "U",
            jobTitle: data.employee.jobTitle || "",
            department: data.employee.preferences?.department || "",
            specialization: data.employee.preferences?.specialization || "",
            experienceYears: data.employee.preferences?.experienceYears || "",
            licenseNumber: data.employee.preferences?.licenseNumber || "",
            medicalSchool: data.employee.preferences?.medicalSchool || "",
          });

          // Load preferences from JSON
          if (data.employee.preferences) {
            if (data.employee.preferences.notifications) {
              setPreferences((prev) => ({
                ...prev,
                ...data.employee.preferences.notifications,
              }));
            }
            if (data.employee.preferences.workSchedule) {
              setWorkSchedule((prev) => ({
                ...prev,
                ...data.employee.preferences.workSchedule,
              }));
            }
            if (data.employee.preferences.skills) {
              setSkills(data.employee.preferences.skills);
            }
            if (data.employee.preferences.certifications) {
              setCertifications(data.employee.preferences.certifications);
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch employee:", error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      const payload = {
        firstname: editForm.firstname,
        lastname: editForm.lastname,
        phone: editForm.phone,
        gender: editForm.gender,
        jobTitle: editForm.jobTitle,
        preferences: {
          department: editForm.department,
          specialization: editForm.specialization,
          experienceYears: editForm.experienceYears,
          licenseNumber: editForm.licenseNumber,
          medicalSchool: editForm.medicalSchool,
          notifications: preferences,
          workSchedule,
          skills,
          certifications,
        },
      };
      const res = await RequestHandler.Patch("/api/v1/employee", { body: payload });
      if (res.ok) {
        toast.success("Profile updated successfully");
        setProfileUpdateHash((p) => p + 1);
        setEditing(false);
        // Refresh employee data
        const refreshRes = await RequestHandler.Get("/api/v1/employee");
        if (refreshRes.ok) {
          const data = await refreshRes.json();
          setEmployee(data.employee);
        }
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handlePhotoUpload = async (file) => {
    if (!file) return;
    if (file.size > 1 * 1024 * 1024) {
      toast.error("File size must be less than 1MB");
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
        toast.success("Profile photo updated");
        setProfileUpdateHash((p) => p + 1);
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      toast.error("Failed to upload photo");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handlePreferenceToggle = async (key, value) => {
    const newPrefs = { ...preferences, [key]: value };
    setPreferences(newPrefs);
    // Save immediately (optional)
    await RequestHandler.Patch("/api/v1/employee", {
      body: { preferences: { notifications: newPrefs } },
    });
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
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (!employee) return <div>Employee not found</div>;

  const fullName = `${editForm.firstname} ${editForm.lastname}`;
  const memberSince = employee.createdAt
    ? new Date(employee.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Jan 2024";

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 md:p-6">
      {/* Header Section with Avatar */}
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-indigo-600 to-indigo-800" />
        <CardContent className="relative pt-16">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end justify-between">
            <div className="flex gap-6 items-end">
              <div className="relative group">
                <Avatar className="w-28 h-28 border-4 border-white shadow-lg">
                  <AvatarImage
                    src={`/api/v1/user/profile_picture?${profileUpdateHash}`}
                    alt={fullName}
                  />
                  <AvatarFallback className="bg-indigo-500 text-white text-2xl">
                    {editForm.firstname?.[0]}
                    {editForm.lastname?.[0]}
                  </AvatarFallback>
                </Avatar>
                <label
                  htmlFor="photo-upload"
                  className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-md cursor-pointer hover:bg-gray-100"
                >
                  <ArrowUp className="w-4 h-4 text-gray-600" />
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/jpeg,image/png"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handlePhotoUpload(e.target.files[0])}
                    disabled={uploadingPhoto}
                  />
                </label>
                {uploadingPhoto && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-indigo-950">{fullName}</h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="secondary" className="gap-1">
                    <CheckCircle className="w-3 h-3" />
                    {employee.jobTitle || "Employee"}
                  </Badge>
                  <span>ID: {employee.id?.slice(0, 8)}</span>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setEditing(!editing)}
              className="gap-2"
            >
              <PenLine className="w-4 h-4" />
              {editing ? "Cancel" : "Edit Profile"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="professional" className="space-y-6">
        <TabsList className="grid w-full max-w-3xl grid-cols-4">
          <TabsTrigger value="professional">Professional Info</TabsTrigger>
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="schedule">Work Schedule</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Professional Info Tab */}
        <TabsContent value="professional" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Professional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {editing ? (
                  <>
                    <div>
                      <Label>Job Title</Label>
                      <Input
                        value={editForm.jobTitle}
                        onChange={(e) =>
                          setEditForm({ ...editForm, jobTitle: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label>Department</Label>
                      <Input
                        value={editForm.department}
                        onChange={(e) =>
                          setEditForm({ ...editForm, department: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label>Specialization</Label>
                      <Input
                        value={editForm.specialization}
                        onChange={(e) =>
                          setEditForm({ ...editForm, specialization: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label>Experience (years)</Label>
                      <Input
                        type="number"
                        value={editForm.experienceYears}
                        onChange={(e) =>
                          setEditForm({ ...editForm, experienceYears: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label>License Number</Label>
                      <Input
                        value={editForm.licenseNumber}
                        onChange={(e) =>
                          setEditForm({ ...editForm, licenseNumber: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label>Medical School</Label>
                      <Input
                        value={editForm.medicalSchool}
                        onChange={(e) =>
                          setEditForm({ ...editForm, medicalSchool: e.target.value })
                        }
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Job Title</span>
                      <span className="font-medium">{employee.jobTitle || "—"}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Department</span>
                      <span className="font-medium">{editForm.department || "—"}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Specialization</span>
                      <span className="font-medium">{editForm.specialization || "—"}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Experience</span>
                      <span className="font-medium">{editForm.experienceYears || "0"} years</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">License</span>
                      <span className="font-medium">{editForm.licenseNumber || "—"}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Medical School</span>
                      <span className="font-medium">{editForm.medicalSchool || "—"}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Joined</span>
                      <span className="font-medium">{memberSince}</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Skills & Certifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Skills & Certifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-2">Certifications</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    {certifications.map((cert) => (
                      <li key={cert}>{cert}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Personal Information Tab */}
        <TabsContent value="personal" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {editing ? (
                  <>
                    <div>
                      <Label>First Name</Label>
                      <Input
                        value={editForm.firstname}
                        onChange={(e) =>
                          setEditForm({ ...editForm, firstname: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label>Last Name</Label>
                      <Input
                        value={editForm.lastname}
                        onChange={(e) =>
                          setEditForm({ ...editForm, lastname: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input
                        value={editForm.phone}
                        onChange={(e) =>
                          setEditForm({ ...editForm, phone: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label>Gender</Label>
                      <select
                        className="w-full p-2 border rounded-md bg-background"
                        value={editForm.gender}
                        onChange={(e) =>
                          setEditForm({ ...editForm, gender: e.target.value })
                        }
                      >
                        <option value="U">Prefer not to say</option>
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                      </select>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Full Name</span>
                      <span className="font-medium">{fullName}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gender</span>
                      <span className="font-medium">
                        {editForm.gender === "M"
                          ? "Male"
                          : editForm.gender === "F"
                          ? "Female"
                          : "Prefer not to say"}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phone</span>
                      <span className="font-medium">{editForm.phone || "—"}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email</span>
                      <span className="font-medium">{employee.user?.email}</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Contact Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Contact Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Email Notifications</span>
                  <Switch
                    checked={preferences.emailNotifications}
                    onCheckedChange={(val) =>
                      handlePreferenceToggle("emailNotifications", val)
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span>SMS Alerts</span>
                  <Switch
                    checked={preferences.smsAlerts}
                    onCheckedChange={(val) => handlePreferenceToggle("smsAlerts", val)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span>Daily Reminders</span>
                  <Switch
                    checked={preferences.dailyReminders}
                    onCheckedChange={(val) =>
                      handlePreferenceToggle("dailyReminders", val)
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span>Weekly Reports</span>
                  <Switch
                    checked={preferences.weeklyReports}
                    onCheckedChange={(val) =>
                      handlePreferenceToggle("weeklyReports", val)
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Work Schedule Tab */}
        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Work Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map(
                (day) => (
                  <div key={day} className="flex items-center justify-between">
                    <span className="capitalize w-24 font-medium">{day}</span>
                    <div className="flex items-center gap-3">
                      <Input
                        type="time"
                        value={workSchedule[day]?.start || "09:00"}
                        onChange={(e) =>
                          setWorkSchedule({
                            ...workSchedule,
                            [day]: { ...workSchedule[day], start: e.target.value },
                          })
                        }
                        className="w-28"
                        disabled={!editing}
                      />
                      <span>–</span>
                      <Input
                        type="time"
                        value={workSchedule[day]?.end || "17:00"}
                        onChange={(e) =>
                          setWorkSchedule({
                            ...workSchedule,
                            [day]: { ...workSchedule[day], end: e.target.value },
                          })
                        }
                        className="w-28"
                        disabled={!editing}
                      />
                      <Switch
                        checked={workSchedule[day]?.enabled}
                        onCheckedChange={(val) =>
                          setWorkSchedule({
                            ...workSchedule,
                            [day]: { ...workSchedule[day], enabled: val },
                          })
                        }
                        disabled={!editing}
                      />
                    </div>
                  </div>
                )
              )}
              <Separator />
              <div className="flex items-center justify-between">
                <span>Lunch Break</span>
                <div className="flex items-center gap-3">
                  <Input
                    type="time"
                    value={workSchedule.lunchBreak?.start || "12:00"}
                    onChange={(e) =>
                      setWorkSchedule({
                        ...workSchedule,
                        lunchBreak: { ...workSchedule.lunchBreak, start: e.target.value },
                      })
                    }
                    className="w-28"
                    disabled={!editing}
                  />
                  <span>–</span>
                  <Input
                    type="time"
                    value={workSchedule.lunchBreak?.end || "13:00"}
                    onChange={(e) =>
                      setWorkSchedule({
                        ...workSchedule,
                        lunchBreak: { ...workSchedule.lunchBreak, end: e.target.value },
                      })
                    }
                    className="w-28"
                    disabled={!editing}
                  />
                  <Switch
                    checked={workSchedule.lunchBreak?.enabled}
                    onCheckedChange={(val) =>
                      setWorkSchedule({
                        ...workSchedule,
                        lunchBreak: { ...workSchedule.lunchBreak, enabled: val },
                      })
                    }
                    disabled={!editing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Account Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Key className="w-4 h-4" />
                Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Lock className="w-4 h-4" />
                Setup Two-Factor Authentication (2FA)
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save changes button (only shown in edit mode) */}
      {editing && (
        <div className="flex justify-end gap-3 sticky bottom-4 bg-white p-4 rounded-lg shadow-lg border">
          <Button variant="outline" onClick={() => setEditing(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpdateProfile} className="bg-indigo-600 hover:bg-indigo-700">
            Save All Changes
          </Button>
        </div>
      )}
    </div>
  );
}