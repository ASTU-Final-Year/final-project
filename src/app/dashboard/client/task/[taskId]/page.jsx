// src/app/dashboard/client/task/[taskId]/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChevronLeft,
  Loader2,
  CheckCircle,
  CreditCard,
  FileText,
  Upload,
  AlertCircle,
  CalendarDays,
  Clock,
  Building2,
} from "lucide-react";
import RequestHandler from "@/lib/request-handler";
import { toast } from "sonner";
import PaymentButton from "@/components/payment/button";

export default function TaskCompletionPage() {
  const { taskId } = useParams();
  const router = useRouter();
  const [task, setTask] = useState(null);
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({});
  const [files, setFiles] = useState({});
  const [activeTab, setActiveTab] = useState("requirements");

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await RequestHandler.Get(
          `/query/v1/task?~id=${taskId}&select={"":["id","name","status","isDone","requirements","submissions","createdAt"],"appointment":["id","startTime","endTime","status","service":["name","description","price"],"organization":["name","address","email","phone"]],"client":["firstname","lastname","email","phone"]}`,
        );

        if (res.ok) {
          const {
            tasks: [taskData],
          } = await res.json();
          setTask(taskData);
          setAppointment(taskData.appointment);

          // Pre-fill form data from previous submissions if any
          if (taskData.submissions) {
            setFormData(taskData.submissions);
          }
        } else {
          toast.error("Task not found");
          router.back();
        }
      } catch (error) {
        console.error("Failed to fetch task:", error);
        toast.error("Failed to load task");
      } finally {
        setLoading(false);
      }
    };

    if (taskId) fetchTask();
  }, [taskId, router]);

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

    // Show uploading state
    setUploadingFile(field);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch(
        `/api/v1/client/upload?taskId=${task.id}&requirementId=${field}`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        },
      );

      if (uploadRes.ok) {
        const data = await uploadRes.json();
        setFormData((prev) => ({
          ...prev,
          [field]: {
            name: file.name,
            size: file.size,
            type: file.type,
            uploaded: true,
          },
        }));
        toast.success(`File "${file.name}" uploaded successfully`);

        // Refresh task to show updated submissions
        const res = await RequestHandler.Get(
          `/query/v1/task?&~id=${task.id}&select={"":["id","name","status","isDone","requirements","submissions","createdAt"],"appointment":["id","startTime","endTime","status","service":["name","description","price"],"organization":["name","address","email","phone"]],"client":["firstname","lastname","email","phone"]}`,
        );
        if (res.ok) {
          const {
            tasks: [taskData],
          } = await res.json();
          setTask(taskData);
        }
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
      const deleteRes = await fetch(
        `/api/v1/client/upload?taskId=${task.id}&requirementId=${field}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (deleteRes.ok) {
        setFormData((prev) => {
          const newData = { ...prev };
          delete newData[field];
          return newData;
        });
        toast.success("File deleted successfully");

        // Refresh task
        const res = await RequestHandler.Get(
          `/query/v1/task?~id=${task.id}&select={"":["id","name","status","isDone","requirements","submissions","createdAt"],"appointment":["id","startTime","endTime","status","service":["name","description","price"],"organization":["name","address","email","phone"]],"client":["firstname","lastname","email","phone"]}`,
        );
        if (res.ok) {
          const {
            tasks: [taskData],
          } = await res.json();
          setTask(taskData);
        }
      } else {
        toast.error("Failed to delete file");
      }
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete file");
    }
  };

  const handlePayment = async () => {
    setIsSubmitting(true);
    try {
      const paymentConfig = task?.requirements?.payment;
      const res = await RequestHandler.Post("/api/v1/payment/initialize", {
        body: {
          amount: paymentConfig.amount,
          currency: paymentConfig.currency,
          reason: paymentConfig.reason,
          taskId: task.id,
          appointmentId: appointment.id,
        },
      });

      if (res.ok) {
        const { paymentUrl, reference } = await res.json();
        // Save payment reference temporarily
        await RequestHandler.Patch("/query/v1/task?client", {
          body: {
            id: task.id,
            submissions: {
              ...formData,
              paymentReference: reference,
              paymentStatus: "pending",
            },
          },
        });
        window.location.href = paymentUrl;
      }
    } catch (error) {
      console.error("Payment failed:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Upload files
      const uploadedFiles = {};
      for (const [field, file] of Object.entries(files)) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", file);
        const uploadRes = await fetch("/api/v1/upload", {
          method: "POST",
          body: uploadFormData,
        });
        if (uploadRes.ok) {
          const { url } = await uploadRes.json();
          uploadedFiles[field] = url;
        }
      }

      const submissions = {
        ...formData,
        uploadedFiles,
        completedAt: new Date().toISOString(),
      };

      const res = await RequestHandler.Patch("/query/v1/task?client", {
        body: {
          id: task.id,
          submissions: submissions,
          status: "completed",
          isDone: true,
          completedAt: new Date().toISOString(),
        },
      });

      if (res.ok) {
        toast.success("Task completed successfully!");
        router.push(`/dashboard/client/appointment/${appointment.id}`);
      } else {
        const error = await res.json();
        toast.error(error.message || "Failed to complete task");
      }
    } catch (error) {
      console.error("Submission failed:", error);
      toast.error("Failed to submit requirements");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!task || !appointment) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold">Task not found</h2>
        <Button className="mt-4" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  const hasPayment = task.requirements?.payment;
  const hasForm =
    task.requirements?.form && Object.keys(task.requirements.form).length > 0;
  const isPaymentComplete = task.submissions?.payment?.status === "completed";

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        {/* <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="h-5 w-5" />
        </Button> */}
        <div>
          <h1 className="text-2xl font-bold">Complete Task</h1>
          <p className="text-gray-500 text-sm">{task.name}</p>
        </div>
      </div>

      {/* Appointment Info Card */}
      <Card>
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Building2 className="h-4 w-4" />
            <span>{appointment.organization?.name}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CalendarDays className="h-4 w-4" />
            <span>{new Date(appointment.startTime).toLocaleDateString()}</span>
            <Clock className="h-4 w-4 ml-2" />
            <span>{new Date(appointment.startTime).toLocaleTimeString()}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FileText className="h-4 w-4" />
            <span>{appointment.service?.name}</span>
          </div>
        </CardContent>
      </Card>

      {/* Requirements Tabs */}
      {(hasPayment || hasForm) && (
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-2">
            {hasForm && <TabsTrigger value="requirements">Form</TabsTrigger>}
            {hasPayment && <TabsTrigger value="payment">Payment</TabsTrigger>}
          </TabsList>

          {/* Form Tab */}
          {hasForm && (
            <TabsContent value="requirements" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Required Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(task.requirements.form).map(
                    ([fieldName, config]) => (
                      <div key={fieldName} className="space-y-2">
                        <Label>
                          {fieldName
                            .replace(/-/g, " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                          {!config.optional && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </Label>

                        {config.type === "file" ? (
                          <div className="border-2 border-dashed rounded-lg p-4 text-center">
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
                              className="cursor-pointer"
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
                              {files[fieldName] && (
                                <p className="text-sm text-green-600 mt-2">
                                  {files[fieldName].name}
                                </p>
                              )}
                            </label>
                          </div>
                        ) : config.type === "textarea" ? (
                          <Textarea
                            rows={config.rows || 4}
                            placeholder={config.placeholder}
                            value={formData[fieldName] || ""}
                            onChange={(e) =>
                              handleInputChange(fieldName, e.target.value)
                            }
                            required={!config.optional}
                          />
                        ) : (
                          <Input
                            type={config.type === "number" ? "number" : "text"}
                            placeholder={config.placeholder}
                            min={config.min}
                            max={config.max}
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
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Payment Tab */}
          {hasPayment && (
            <TabsContent value="payment" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Payment Required</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isPaymentComplete ? (
                    <div className="text-center py-8">
                      <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                      <p className="font-medium">Payment Completed</p>
                      <p className="text-sm text-gray-500">
                        Your payment has been processed successfully.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-gray-600">Amount Due</p>
                            <p className="text-3xl font-bold">
                              {task.requirements.payment.amount}{" "}
                              {task.requirements.payment.currency}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              {task.requirements.payment.reason}
                            </p>
                          </div>
                          <CreditCard className="h-12 w-12 text-blue-500" />
                        </div>
                      </div>
                      <PaymentButton
                        amount={task.requirements.payment.amount}
                        currency={task.requirements.payment.currency || "ETB"}
                        taskId={task.id} // Pass the task ID
                        appointmentId={appointment?.id}
                        email={user?.email}
                        reason={task.requirements.payment.reason}
                        onSuccess={() => {
                          toast.success("Payment completed!");
                          fetchTask(); // Refresh task to show updated status
                        }}
                        onError={(error) => {
                          toast.error("Payment failed. Please try again.");
                        }}
                      />
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      )}

      {/* Submit Button */}
      <div className="flex gap-3 justify-end">
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || (hasPayment && !isPaymentComplete)}
          className="bg-green-600 hover:bg-green-700"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <CheckCircle className="h-4 w-4 mr-2" />
          )}
          Complete Task
        </Button>
      </div>
    </div>
  );
}
