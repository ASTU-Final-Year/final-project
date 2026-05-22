// src/app/dashboard/employee/profile/page.jsx
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
  Clock,
  Briefcase,
  GraduationCap,
  Shield,
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

  // Preferences (could be stored in employee.preferences)
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsAlerts: true,
    dailyReminders: true,
    weeklyReports: false,
  });

  // Fetch employee data
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await RequestHandler.Get("/api/v1/employee");
        if (!res.ok) throw new Error("Failed to fetch employee");
        const data = await res.json();
        // Response could be { employee: {...} } or just the object
        const emp = data.employee || data;
        setEmployee(emp);
        
        // Populate form with user data
        setEditForm({
          firstname: emp.user?.firstname || "",
          lastname: emp.user?.lastname || "",
          phone: emp.user?.phone || "",
          gender: emp.user?.gender || "U",
          jobTitle: emp.jobTitle || "",
          department: emp.preferences?.department || "",
          specialization: emp.preferences?.specialization || "",
          experienceYears: emp.preferences?.experienceYears || "",
          licenseNumber: emp.preferences?.licenseNumber || "",
          medicalSchool: emp.preferences?.medicalSchool || "",
        });
        
        if (emp.preferences?.notifications) {
          setPreferences(prev => ({ ...prev, ...emp.preferences.notifications }));
        }
      } catch (error) {
        console.error("Failed to fetch employee:", error);
        toast.error("Could not load profile");
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
        },
      };
      const res = await RequestHandler.Patch("/api/v1/employee", { body: payload });
      if (res.ok) {
        toast.success("Profile updated successfully");
        setProfileUpdateHash(prev => prev + 1);
        setEditing(false);
        // Refresh employee data
        const refreshRes = await RequestHandler.Get("/api/v1/employee");
        if (refreshRes.ok) {
          const data = await refreshRes.json();
          setEmployee(data.employee || data);
        }
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handlePreferenceToggle = async (key, value) => {
    const newPrefs = { ...preferences, [key]: value };
    setPreferences(newPrefs);
    // Save immediately – you can debounce if needed
    await RequestHandler.Patch("/api/v1/employee", {
      body: { preferences: { notifications: newPrefs } },
    });
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="p-6 text-center text-red-500">
        Employee profile not found. Please contact support.
      </div>
    );
  }

  const fullName = `${editForm.firstname} ${editForm.lastname}`.trim() || "Employee";

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header with Avatar */}
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-indigo-600 to-indigo-800" />
        <CardContent className="relative pt-16">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end justify-between">
            <div className="flex gap-6 items-end">
              <div className="relative">
                <Avatar className="w-28 h-28 border-4 border-white shadow-lg">
                  <AvatarImage
                    src={`/api/v1/user/profile_picture?${profileUpdateHash}`}
                    alt={fullName}
                  />
                  <AvatarFallback className="bg-indigo-500 text-white text-2xl">
                    {editForm.firstname?.[0]}{editForm.lastname?.[0]}
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
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      if (file.size > 1 * 1024 * 1024) {
                        toast.error("File too large (max 1MB)");
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
                          toast.success("Photo updated");
                          setProfileUpdateHash(prev => prev + 1);
                        } else {
                          throw new Error();
                        }
                      } catch {
                        toast.error("Upload failed");
                      } finally {
                        setUploadingPhoto(false);
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
              <div>
                <h1 className="text-2xl font-bold text-indigo-950">{fullName}</h1>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <Badge variant="secondary">{employee.jobTitle || "Employee"}</Badge>
                  {employee.isActive ? (
                    <Badge className="bg-green-100 text-green-700">Active</Badge>
                  ) : (
                    <Badge variant="outline">Inactive</Badge>
                  )}
                </div>
              </div>
            </div>
            <Button variant="outline" onClick={() => setEditing(!editing)}>
              <PenLine className="w-4 h-4 mr-2" />
              {editing ? "Cancel" : "Edit Profile"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="professional" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="professional">Professional Info</TabsTrigger>
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* Professional Info Tab */}
        <TabsContent value="professional" className="space-y-6">
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
                  <div><Label>Job Title</Label><Input value={editForm.jobTitle} onChange={e => setEditForm({...editForm, jobTitle: e.target.value})} /></div>
                  <div><Label>Department</Label><Input value={editForm.department} onChange={e => setEditForm({...editForm, department: e.target.value})} /></div>
                  <div><Label>Specialization</Label><Input value={editForm.specialization} onChange={e => setEditForm({...editForm, specialization: e.target.value})} /></div>
                  <div><Label>Experience (years)</Label><Input type="number" value={editForm.experienceYears} onChange={e => setEditForm({...editForm, experienceYears: e.target.value})} /></div>
                  <div><Label>License Number</Label><Input value={editForm.licenseNumber} onChange={e => setEditForm({...editForm, licenseNumber: e.target.value})} /></div>
                  <div><Label>Medical School</Label><Input value={editForm.medicalSchool} onChange={e => setEditForm({...editForm, medicalSchool: e.target.value})} /></div>
                </>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between"><span className="text-muted-foreground">Job Title</span><span className="font-medium">{editForm.jobTitle || "—"}</span></div>
                  <Separator />
                  <div className="flex justify-between"><span className="text-muted-foreground">Department</span><span className="font-medium">{editForm.department || "—"}</span></div>
                  <Separator />
                  <div className="flex justify-between"><span className="text-muted-foreground">Specialization</span><span className="font-medium">{editForm.specialization || "—"}</span></div>
                  <Separator />
                  <div className="flex justify-between"><span className="text-muted-foreground">Experience</span><span className="font-medium">{editForm.experienceYears || "0"} years</span></div>
                  <Separator />
                  <div className="flex justify-between"><span className="text-muted-foreground">License</span><span className="font-medium">{editForm.licenseNumber || "—"}</span></div>
                  <Separator />
                  <div className="flex justify-between"><span className="text-muted-foreground">Medical School</span><span className="font-medium">{editForm.medicalSchool || "—"}</span></div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Personal Info Tab */}
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {editing ? (
                <>
                  <div><Label>First Name</Label><Input value={editForm.firstname} onChange={e => setEditForm({...editForm, firstname: e.target.value})} /></div>
                  <div><Label>Last Name</Label><Input value={editForm.lastname} onChange={e => setEditForm({...editForm, lastname: e.target.value})} /></div>
                  <div><Label>Phone</Label><Input value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} /></div>
                  <div><Label>Gender</Label>
                    <select className="w-full p-2 border rounded-md" value={editForm.gender} onChange={e => setEditForm({...editForm, gender: e.target.value})}>
                      <option value="U">Prefer not to say</option><option value="M">Male</option><option value="F">Female</option>
                    </select>
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between"><span className="text-muted-foreground">Full Name</span><span className="font-medium">{fullName}</span></div>
                  <Separator />
                  <div className="flex justify-between"><span className="text-muted-foreground">Gender</span><span className="font-medium">{editForm.gender === "M" ? "Male" : editForm.gender === "F" ? "Female" : "Prefer not to say"}</span></div>
                  <Separator />
                  <div className="flex justify-between"><span className="text-muted-foreground">Phone</span><span className="font-medium">{editForm.phone || "—"}</span></div>
                  <Separator />
                  <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span className="font-medium">{employee.user?.email}</span></div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Bell className="w-5 h-5" /> Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between"><div><p className="font-medium">Email Notifications</p><p className="text-sm text-muted-foreground">Receive updates via email</p></div><Switch checked={preferences.emailNotifications} onCheckedChange={val => handlePreferenceToggle("emailNotifications", val)} /></div>
              <Separator />
              <div className="flex items-center justify-between"><div><p className="font-medium">SMS Alerts</p><p className="text-sm text-muted-foreground">Get text messages for urgent updates</p></div><Switch checked={preferences.smsAlerts} onCheckedChange={val => handlePreferenceToggle("smsAlerts", val)} /></div>
              <Separator />
              <div className="flex items-center justify-between"><div><p className="font-medium">Daily Reminders</p><p className="text-sm text-muted-foreground">Receive daily task reminders</p></div><Switch checked={preferences.dailyReminders} onCheckedChange={val => handlePreferenceToggle("dailyReminders", val)} /></div>
              <Separator />
              <div className="flex items-center justify-between"><div><p className="font-medium">Weekly Reports</p><p className="text-sm text-muted-foreground">Weekly summary of activities</p></div><Switch checked={preferences.weeklyReports} onCheckedChange={val => handlePreferenceToggle("weeklyReports", val)} /></div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {editing && (
        <div className="flex justify-end gap-3 sticky bottom-4 bg-white p-4 rounded-lg shadow-lg border">
          <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
          <Button onClick={handleUpdateProfile} className="bg-indigo-600 hover:bg-indigo-700">Save Changes</Button>
        </div>
      )}
    </div>
  );
}