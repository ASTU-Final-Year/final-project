// src/app/dashboard/client/page.jsx - Main Client Dashboard
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CalendarDays,
  Clock,
  MapPin,
  Building2,
  User,
  Phone,
  Mail,
  CheckCircle,
  Circle,
  AlertCircle,
  ChevronRight,
  Star,
  StarHalf,
  Loader2,
  FileText,
  CreditCard,
  MessageCircle,
  Bell,
  Calendar,
  TrendingUp,
  Award,
  Clock as ClockIcon,
  Upload,
} from "lucide-react";
import RequestHandler from "@/lib/request-handler";
import Link from "next/link";
import { format } from "date-fns";
import { toast } from "sonner";
import { ta } from "date-fns/locale";

// Helper functions
const formatDate = (dateString) => {
  if (!dateString) return "Not scheduled";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatTime = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusColor = (status) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-700 border-green-200";
    case "active":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "scheduled":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "canceled":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

// Task Status Badge Component
const TaskStatusBadge = ({ task }) => {
  const isCompleted = task.isDone || task.status === "completed";
  const isActive = task.status === "active" && !isCompleted;
  const isPending = task.status === "pending" && !isCompleted;

  if (isCompleted) {
    return <Badge className="bg-green-100 text-green-700">Completed</Badge>;
  }
  if (isActive) {
    return <Badge className="bg-blue-100 text-blue-700">In Progress</Badge>;
  }
  if (
    isPending &&
    task.requirements &&
    Object.keys(task.requirements).length > 0
  ) {
    return (
      <Badge className="bg-yellow-100 text-yellow-700">Action Required</Badge>
    );
  }
  return <Badge variant="secondary">Pending</Badge>;
};

// Rating Component
const StarRating = ({ rating, onRate, size = "md", readonly = false }) => {
  const [hover, setHover] = useState(0);
  const stars = [1, 2, 3, 4, 5];
  const sizeClass =
    size === "sm" ? "h-3 w-3" : size === "lg" ? "h-6 w-6" : "h-5 w-5";

  return (
    <div className="flex gap-0.5">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onRate?.(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          className={!readonly ? "cursor-pointer" : "cursor-default"}
        >
          {star <= (hover || rating) ? (
            <Star className={`${sizeClass} fill-yellow-400 text-yellow-400`} />
          ) : star - 0.5 <= (hover || rating) ? (
            <StarHalf
              className={`${sizeClass} fill-yellow-400 text-yellow-400`}
            />
          ) : (
            <Star className={`${sizeClass} text-gray-300`} />
          )}
        </button>
      ))}
    </div>
  );
};

// Task Requirements Modal
const TaskRequirementsModal = ({ task, open, onClose, onComplete }) => {
  const [formData, setFormData] = useState({});
  const [uploadingFile, setUploadingFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  // Load existing submissions when task changes
  useEffect(() => {
    if (task?.submissions) {
      (async () => setFormData(task.submissions))();
    }
  }, [task]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = async (field, fileList) => {
    const file = fileList[0];
    if (!file) return;

    const fieldConfig = task?.requirements?.form?.[field];
    if (fieldConfig?.accept && !fieldConfig.accept.includes(file.type)) {
      toast.error(
        `Invalid file type. Accepted: ${fieldConfig.accept.join(", ")}`,
      );
      return;
    }
    if (fieldConfig?.maxSize && file.size > fieldConfig.maxSize) {
      toast.error(
        `File too large. Max size: ${fieldConfig.maxSize / (1024 * 1024)}MB`,
      );
      return;
    }

    setUploadingFile(field);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const uploadRes = await RequestHandler.Put(
        `/api/v1/client/upload?taskId=${task.id}&requirementId=${field}`,
        {
          body: uploadFormData,
        },
      );

      if (uploadRes.ok) {
        const data = await uploadRes.json();
        setFormData((prev) => ({
          ...prev,
          [field]: {
            ...data.file,
            // name: file.name,
            // size: file.size,
            // type: file.type,
            uploaded: true,
          },
        }));
        toast.success(`File "${file.name}" uploaded successfully`);
      } else {
        const error = await uploadRes.json();
        toast.error(error.error || "Failed to upload file");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload file");
    } finally {
      setUploadingFile(null);
    }
  };

  const handleDeleteFile = async (field) => {
    if (!confirm("Are you sure you want to delete this file?")) return;

    try {
      const deleteRes = await RequestHandler.Delete(
        `/api/v1/client/upload?taskId=${task.id}&requirementId=${field}`,
      );

      if (deleteRes.ok) {
        setFormData((prev) => {
          const newData = { ...prev };
          delete newData[field];
          delete newData.uploadedFiles?.[field];
          return newData;
        });
        toast.success("File deleted successfully");
      } else {
        toast.error("Failed to delete file");
      }
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete file");
    }
  };

  const handlePayment = async () => {
    setPaymentProcessing(true);
    try {
      const paymentConfig = task.requirements?.payment;
      console.log(task);
      const res = await RequestHandler.Post("/api/v1/payment/initialize", {
        body: {
          amount: paymentConfig.amount,
          currency: paymentConfig.currency,
          reason: paymentConfig.reason,
          email: task.client.email,
          appointmentId: task.appointmentId,
          taskId: task.id,
        },
      });
      if (res.ok) {
        const { paymentUrl, reference } = await res.json();
        await onComplete({ paymentReference: reference, status: "pending" });
        window.location.href = paymentUrl;
      }
    } catch (error) {
      console.error("Payment failed:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setPaymentProcessing(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const submissions = formData;

      await onComplete(submissions);
      onClose();
    } catch (error) {
      console.error("Submission failed:", error);
      toast.error("Failed to submit requirements");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open || !task?.requirements) return null;

  const hasPayment = task.requirements.payment;
  const hasForm =
    task.requirements.form && Object.keys(task.requirements.form).length > 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto m-4">
        <div className="sticky top-0 bg-white border-b p-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Complete Requirements</h2>
              <p className="text-sm text-gray-500">{task.name}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {hasPayment && (
            <div className="space-y-3">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Payment Required</p>
                    <p className="text-2xl font-bold">
                      {task.requirements.payment.amount}{" "}
                      {task.requirements.payment.currency}
                    </p>
                    <p className="text-sm text-gray-500">
                      {task.requirements.payment.reason}
                    </p>
                  </div>
                  <CreditCard className="h-8 w-8 text-blue-500" />
                </div>
              </div>
              <Button
                onClick={handlePayment}
                disabled={paymentProcessing}
                className="w-full"
              >
                {paymentProcessing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Pay Now"
                )}
              </Button>
            </div>
          )}

          {hasForm && (
            <div className="space-y-4">
              <h3 className="font-medium">Required Information</h3>
              {Object.entries(task.requirements.form).map(
                ([fieldName, config]) => (
                  <div key={fieldName} className="space-y-2">
                    <label className="text-sm font-medium">
                      {fieldName
                        .replace(/-/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                      {!config.optional && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>

                    {config.type === "file" ? (
                      <div className="border-2 border-dashed rounded-lg p-4 text-center">
                        {task.submissions?.uploadedFiles?.[fieldName] ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                              <div className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-green-600" />
                                <span className="text-sm truncate max-w-[200px]">
                                  {
                                    task.submissions.uploadedFiles[fieldName]
                                      .filename
                                  }
                                </span>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteFile(fieldName)}
                                className="text-destructive"
                              >
                                Remove
                              </Button>
                            </div>
                            <a
                              href={`/api/v1/client/upload?taskId=${task.id}&requirementId=${fieldName}&filename=${task.submissions.uploadedFiles[fieldName].filename}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                            >
                              <Eye className="h-3 w-3" />
                              View File →
                            </a>
                          </div>
                        ) : (
                          <>
                            <input
                              type="file"
                              id={`file-${fieldName}`}
                              className="hidden"
                              accept={config.accept?.join(",")}
                              onChange={(e) =>
                                handleFileChange(fieldName, e.target.files)
                              }
                            />
                            <label
                              htmlFor={`file-${fieldName}`}
                              className="cursor-pointer block"
                            >
                              <Upload className="h-8 w-8 mx-auto text-gray-400" />
                              <p className="text-sm text-gray-500">
                                Click to upload
                              </p>
                              {config.accept && (
                                <p className="text-xs text-gray-400 mt-1">
                                  Accepted: {config.accept.join(", ")}
                                </p>
                              )}
                              {config.maxSize && (
                                <p className="text-xs text-gray-400">
                                  Max size: {config.maxSize / (1024 * 1024)}MB
                                </p>
                              )}
                            </label>
                            {uploadingFile === fieldName && (
                              <div className="mt-2 flex items-center justify-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span className="text-sm">Uploading...</span>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    ) : config.type === "textarea" ? (
                      <textarea
                        className="w-full p-2 border rounded-md"
                        rows={config.rows || 4}
                        placeholder={config.placeholder}
                        value={formData[fieldName] || ""}
                        onChange={(e) =>
                          handleInputChange(fieldName, e.target.value)
                        }
                        required={!config.optional}
                      />
                    ) : config.type === "number" ? (
                      <input
                        type="number"
                        className="w-full p-2 border rounded-md"
                        placeholder={config.placeholder}
                        min={config.min}
                        max={config.max}
                        value={formData[fieldName] || ""}
                        onChange={(e) =>
                          handleInputChange(
                            fieldName,
                            parseFloat(e.target.value),
                          )
                        }
                        required={!config.optional}
                      />
                    ) : (
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md"
                        placeholder={config.placeholder}
                        value={formData[fieldName] || ""}
                        onChange={(e) =>
                          handleInputChange(fieldName, e.target.value)
                        }
                        required={!config.optional}
                      />
                    )}
                    {config.description && (
                      <p className="text-xs text-gray-500">
                        {config.description}
                      </p>
                    )}
                  </div>
                ),
              )}
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-white border-t p-4 flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <CheckCircle className="h-4 w-4 mr-2" />
            )}
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function ClientDashboard() {
  const router = useRouter();
  const [appointments, setAppointments] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    completedServices: 0,
    upcomingAppointments: 0,
    pendingTasks: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showRequirementsModal, setShowRequirementsModal] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      // Fetch appointments
      const aptRes = await RequestHandler.Get(
        '/query/v1/appointment?order=["startTime.desc"]&select={"":["id","startTime","endTime","status","notes"],"service":["name","description","price","imageUrl","rating"],"organization":["name","address","email","phone"]}',
      );
      if (aptRes.ok) {
        const { appointments: apts, count } = await aptRes.json();
        setAppointments(apts || []);
        const upcoming = (apts || []).filter(
          (a) => a.status === "scheduled" || new Date(a.startTime) > new Date(),
        ).length;
        const completed = (apts || []).filter(
          (a) => a.status === "completed",
        ).length;
        setStats((prev) => ({
          ...prev,
          totalAppointments: count || 0,
          completedServices: completed,
          upcomingAppointments: upcoming,
        }));
      }

      // Fetch tasks with requirements
      const taskRes = await RequestHandler.Get(
        '/query/v1/task?order=["createdAt.desc"]&select={"":["id","appointmentId","name","status","isDone","requirements","submissions","createdAt"],"appointment":["startTime"],"service":["name"],"client":["firstname","lastname","email"]}',
      );
      if (taskRes.ok) {
        const { tasks: taskList } = await taskRes.json();
        setTasks(taskList || []);
        const pendingWithRequirements = (taskList || []).filter(
          (t) =>
            !t.isDone &&
            t.status !== "completed" &&
            t.requirements &&
            (t.requirements.form || t.requirements.payment),
        ).length;
        setStats((prev) => ({
          ...prev,
          pendingTasks: pendingWithRequirements,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    (async () => fetchData())();
  }, [fetchData]);

  const handleCompleteTask = async (submissions) => {
    try {
      const res = await RequestHandler.Patch(
        `/query/v1/task?~id=${selectedTask.id}`,
        {
          body: {
            // id: selectedTask.id,
            submissions: { ...selectedTask.submissions, ...submissions },
            completedAt: new Date().toISOString(),
            // status: "completed",
            // isDone: true,
          },
        },
      );
      if (res.ok) {
        toast.success("Task completed successfully!");
        fetchData();
        setShowRequirementsModal(false);
        setSelectedTask(null);
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to complete task");
      }
    } catch (error) {
      console.error("Failed to complete task:", error);
      toast.error("Failed to complete task");
    }
  };
  const handleRateService = async (serviceId, rating) => {
    try {
      const res = await RequestHandler.Patch("/query/v1/organizationService", {
        body: {
          id: serviceId,
          rating: rating,
        },
      });
      if (res.ok) {
        toast.success("Thank you for your rating!");
        fetchData();
      }
    } catch (error) {
      console.error("Failed to rate service:", error);
      toast.error("Failed to submit rating");
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-96" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  const upcomingAppointments = appointments.filter(
    (a) => a.status === "scheduled" && new Date(a.startTime) >= new Date(),
  );
  const overDueAppointments = appointments.filter(
    (a) => a.status === "scheduled" && new Date(a.startTime) < new Date(),
  );
  const pastAppointments = appointments.filter(
    (a) => a.status === "completed" || new Date(a.startTime) < new Date(),
  );
  const actionRequiredTasks = tasks.filter(
    (t) =>
      !t.isDone &&
      t.status !== "completed" &&
      t.requirements &&
      ((t.requirements.form && Object.keys(t.requirements.form).length > 0) ||
        (t.submissions.payment &&
          t.submissions?.payment.status !== "completed")),
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Welcome Header */}
      {/* <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Dashboard</h1>
          <p className="text-muted-foreground">
            Track your appointments and tasks
          </p>
        </div>
        <Button onClick={() => router.push("/dashboard/client/appointments")}>
          <Calendar className="h-4 w-4 mr-2" />
          Book New Service
        </Button>
      </div> */}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Appointments
                </p>
                <p className="text-2xl font-bold">{stats.totalAppointments}</p>
              </div>
              <CalendarDays className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{stats.completedServices}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Upcoming</p>
                <p className="text-2xl font-bold">
                  {stats.upcomingAppointments}
                </p>
              </div>
              <ClockIcon className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden">
          {stats.pendingTasks > 0 && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-red-500 text-white">
                {stats.pendingTasks}
              </Badge>
            </div>
          )}
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Action Required</p>
                <p className="text-2xl font-bold">{stats.pendingTasks}</p>
              </div>
              <FileText className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList className="grid w-full max-w-xl grid-cols-5">
          <TabsTrigger value="upcoming">
            Upcoming{" "}
            <Badge variant="ghost" className="p-1">
              {upcomingAppointments.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="over-due">
            Over Due{" "}
            <Badge variant="ghost" className="p-1">
              {overDueAppointments.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="all">
            All
            <Badge variant="ghost" className="p-1">
              {appointments.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="history">
            History
            <Badge variant="ghost" className="p-1">
              {pastAppointments.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="tasks">
            Tasks{" "}
            <Badge variant="ghost" className="p-1">
              {actionRequiredTasks.length}
            </Badge>
          </TabsTrigger>
        </TabsList>
        {/* Upcoming Appointments Tab */}
        <TabsContent value="all" className="space-y-4">
          {appointments.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No appointments</p>
                <Button
                  className="mt-4"
                  onClick={() => router.push("/dashboard/client/appointments")}
                >
                  Book an Appointment
                </Button>
              </CardContent>
            </Card>
          ) : (
            appointments.map((apt) => (
              <Card key={apt.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        {apt.service?.imageUrl && (
                          <img
                            src={apt.service.imageUrl}
                            alt={apt.service.name}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <h3 className="font-semibold text-lg">
                            {apt.service?.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {apt.organization?.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-1 text-gray-600">
                          <CalendarDays className="h-4 w-4" />
                          {formatDate(apt.startTime)}
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <Clock className="h-4 w-4" />
                          {formatTime(apt.startTime)} -{" "}
                          {formatTime(apt.endTime)}
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <MapPin className="h-4 w-4" />
                          {apt.organization?.address}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(apt.status)}>
                        {apt.status?.replace("-", " ")}
                      </Badge>
                      <Button
                        variant="ghost"
                        className="mt-2"
                        onClick={() =>
                          router.push(`/dashboard/client/appointment/${apt.id}`)
                        }
                      >
                        View Details
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
        {/* Upcoming Tasks Tab */}
        <TabsContent value="upcoming" className="space-y-4">
          {upcomingAppointments.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No upcoming appointments</p>
                <Button
                  className="mt-4"
                  onClick={() => router.push("/dashboard/client/appointments")}
                >
                  Book an Appointment
                </Button>
              </CardContent>
            </Card>
          ) : (
            upcomingAppointments.map((apt) => (
              <Card key={apt.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        {apt.service?.imageUrl && (
                          <img
                            src={apt.service.imageUrl}
                            alt={apt.service.name}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <h3 className="font-semibold text-lg">
                            {apt.service?.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {apt.organization?.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-1 text-gray-600">
                          <CalendarDays className="h-4 w-4" />
                          {formatDate(apt.startTime)}
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <Clock className="h-4 w-4" />
                          {formatTime(apt.startTime)} -{" "}
                          {formatTime(apt.endTime)}
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <MapPin className="h-4 w-4" />
                          {apt.organization?.address}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(apt.status)}>
                        {apt.status?.replace("-", " ")}
                      </Badge>
                      <Button
                        variant="ghost"
                        className="mt-2"
                        onClick={() =>
                          router.push(`/dashboard/client/appointment/${apt.id}`)
                        }
                      >
                        View Details
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
        {/* Over-due Tasks Tab */}
        <TabsContent value="over-due" className="space-y-4">
          {overDueAppointments.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No over-due appointments</p>
                <Button
                  className="mt-4"
                  onClick={() => router.push("/dashboard/client/appointments")}
                >
                  Book an Appointment
                </Button>
              </CardContent>
            </Card>
          ) : (
            overDueAppointments.map((apt) => (
              <Card key={apt.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        {apt.service?.imageUrl && (
                          <img
                            src={apt.service.imageUrl}
                            alt={apt.service.name}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <h3 className="font-semibold text-lg">
                            {apt.service?.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {apt.organization?.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-1 text-gray-600">
                          <CalendarDays className="h-4 w-4" />
                          {formatDate(apt.startTime)}
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <Clock className="h-4 w-4" />
                          {formatTime(apt.startTime)} -{" "}
                          {formatTime(apt.endTime)}
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <MapPin className="h-4 w-4" />
                          {apt.organization?.address}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(apt.status)}>
                        {apt.status?.replace("-", " ")}
                      </Badge>
                      <Button
                        variant="ghost"
                        className="mt-2"
                        onClick={() =>
                          router.push(`/dashboard/client/appointment/${apt.id}`)
                        }
                      >
                        View Details
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
        <TabsContent value="tasks" className="space-y-4">
          {actionRequiredTasks.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                <p className="text-gray-500">
                  All caught up! No pending tasks.
                </p>
              </CardContent>
            </Card>
          ) : (
            actionRequiredTasks.map((task) => (
              <Card key={task.id}>
                <CardContent className="p-6">
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-yellow-600" />
                        <h3 className="font-semibold">{task.name}</h3>
                      </div>
                      <p className="text-sm text-gray-600">
                        {task.appointment?.service?.name} -{" "}
                        {formatDate(task.appointment?.startTime)}
                      </p>
                      {task.requirements?.payment && (
                        <Badge variant="outline" className="gap-1">
                          <CreditCard className="h-3 w-3" />
                          Payment Required
                        </Badge>
                      )}
                      {task.requirements?.payment &&
                      task.submissions &&
                      task.submissions.payment?.status === "completed" ? (
                        <Badge variant="outline" className="gap-1 bg-blue-50">
                          <CreditCard className="h-3 w-3" />
                          Payment Completed
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="gap-1 bg-blue-50">
                          <CreditCard className="h-3 w-3" />
                          Payment Pending
                        </Badge>
                      )}
                      {task.requirements?.form &&
                        Object.keys(task.requirements.form).length > 0 && (
                          <Badge variant="outline" className="gap-1">
                            <FileText className="h-3 w-3" />
                            Information Required
                          </Badge>
                        )}
                    </div>
                    <Button
                      onClick={() => {
                        setSelectedTask(task);
                        setShowRequirementsModal(true);
                      }}
                      className=""
                    >
                      Complete Task
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4">
          {pastAppointments.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No past appointments</p>
              </CardContent>
            </Card>
          ) : (
            pastAppointments.map((apt) => (
              <Card key={apt.id}>
                <CardContent className="p-6">
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    {apt.service?.imageUrl && (
                      <img
                        src={apt.service.imageUrl}
                        alt={apt.service.name}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                    )}
                    <div className="space-y-2 flex-1">
                      <h3 className="font-semibold">{apt.service?.name}</h3>
                      <p className="text-sm text-gray-500">
                        {apt.organization?.name}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <span>{formatDate(apt.startTime)}</span>
                        <span>{formatTime(apt.startTime)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(apt.status)}>
                        {apt.status?.replace("-", " ")}
                      </Badge>
                      {apt.status === "completed" && !apt.service?.rating && (
                        <div className="mt-2">
                          <StarRating
                            rating={0}
                            onRate={(rating) =>
                              handleRateService(apt.service?.id, rating)
                            } // Fixed function name
                            size="sm"
                          />
                        </div>
                      )}
                      {apt.service?.rating > 0 && (
                        <div className="mt-2 flex items-center gap-1">
                          <StarRating
                            rating={apt.service.rating}
                            readonly
                            size="sm"
                          />
                          <span className="text-xs text-gray-500">
                            ({apt.service.rating})
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Requirements Modal */}
      <TaskRequirementsModal
        task={selectedTask}
        open={showRequirementsModal}
        onClose={() => {
          setShowRequirementsModal(false);
          setSelectedTask(null);
        }}
        onComplete={handleCompleteTask}
      />
    </div>
  );
}
