// src/app/dashboard/employee/task/[id]/page.jsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronLeft,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  PlayCircle,
  AlertCircle,
  FileText,
  CreditCard,
  Upload,
  Download,
  Eye,
  User,
  CalendarDays,
  Building2,
  Phone,
  Mail,
  MapPin,
  Plus,
  Send,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  History,
  Link as LinkIcon,
} from "lucide-react";
import RequestHandler from "@/lib/request-handler";
import { format } from "date-fns";
import { toast } from "sonner";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSessionStore } from "@/store";

const formatDate = (date) => {
  if (!date) return "N/A";
  return format(new Date(date), "MMM dd, yyyy h:mm a");
};

const statusConfig = {
  pending: {
    label: "Pending",
    variant: "secondary",
    icon: Clock,
    color: "bg-yellow-100 text-yellow-700",
  },
  active: {
    label: "In Progress",
    variant: "default",
    icon: PlayCircle,
    color: "bg-blue-100 text-blue-700",
  },
  completed: {
    label: "Completed",
    variant: "success",
    icon: CheckCircle,
    color: "bg-green-100 text-green-700",
  },
  blocked: {
    label: "Blocked",
    variant: "destructive",
    icon: AlertCircle,
    color: "bg-red-100 text-red-700",
  },
  cancelled: {
    label: "Cancelled",
    variant: "outline",
    icon: XCircle,
    color: "bg-gray-100 text-gray-700",
  },
  review: {
    label: "Under Review",
    variant: "default",
    icon: Eye,
    color: "bg-purple-100 text-purple-700",
  },
  rejected: {
    label: "Rejected",
    variant: "destructive",
    icon: XCircle,
    color: "bg-red-100 text-red-700",
  },
  approved: {
    label: "Approved",
    variant: "success",
    icon: CheckCircle,
    color: "bg-green-100 text-green-700",
  },
};

const getStatusBadge = (status, isDone) => {
  if (isDone && status !== "completed") {
    return (
      <Badge className="bg-green-100 text-green-700 gap-1">
        <CheckCircle className="h-3 w-3" />
        Done
      </Badge>
    );
  }
  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;
  return (
    <Badge className={`${config.color} gap-1`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
};

// Submission Review Component
const SubmissionReview = ({
  submission,
  onApprove,
  onReject,
  onRequestChanges,
}) => {
  const [comments, setComments] = useState("");
  const [showCommentDialog, setShowCommentDialog] = useState(false);
  const [action, setAction] = useState(null);

  const handleAction = (actionType) => {
    setAction(actionType);
    setShowCommentDialog(true);
  };

  const submitAction = () => {
    if (action === "approve") {
      onApprove(comments);
    } else if (action === "reject") {
      onReject(comments);
    } else if (action === "changes") {
      onRequestChanges(comments);
    }
    setShowCommentDialog(false);
    setComments("");
    setAction(null);
  };

  const renderValue = (value) => {
    if (typeof value === "object") {
      return (
        <pre className="text-xs bg-muted p-2 rounded overflow-auto">
          {JSON.stringify(value, null, 2)}
        </pre>
      );
    }
    if (typeof value === "boolean") {
      return (
        <Badge variant={value ? "success" : "destructive"}>
          {value ? "Yes" : "No"}
        </Badge>
      );
    }
    return <p className="text-sm">{String(value)}</p>;
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {Object.entries(submission).map(([key, value]) => {
          if (key === "uploadedFiles") {
            return (
              <div key={key} className="border rounded-lg p-3">
                <Label className="text-xs text-muted-foreground">
                  Uploaded Files
                </Label>
                <div className="space-y-2 mt-2">
                  {Object.entries(value).map(([fileName, fileUrl]) => (
                    <a
                      key={fileName}
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                    >
                      <Download className="h-4 w-4" />
                      {fileName}
                    </a>
                  ))}
                </div>
              </div>
            );
          }
          return (
            <div key={key} className="border rounded-lg p-3">
              <Label className="text-xs text-muted-foreground capitalize">
                {key.replace(/([A-Z])/g, " $1").trim()}
              </Label>
              <div className="mt-1">{renderValue(value)}</div>
            </div>
          );
        })}
      </div>

      <Separator />
      <div className="flex gap-3">
        <Button
          onClick={() => handleAction("approve")}
          className="flex-1 bg-green-600 hover:bg-green-700"
        >
          <ThumbsUp className="h-4 w-4 mr-2" />
          Approve
        </Button>
        <Button
          onClick={() => handleAction("changes")}
          variant="outline"
          className="flex-1"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Request Changes
        </Button>
        <Button
          onClick={() => handleAction("reject")}
          variant="destructive"
          className="flex-1"
        >
          <ThumbsDown className="h-4 w-4 mr-2" />
          Reject
        </Button>
      </div>

      <Dialog open={showCommentDialog} onOpenChange={setShowCommentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {action === "approve"
                ? "Approve Submission"
                : action === "reject"
                  ? "Reject Submission"
                  : "Request Changes"}
            </DialogTitle>
            <DialogDescription>
              {action === "approve"
                ? "Add any approval notes (optional)"
                : action === "reject"
                  ? "Please provide a reason for rejection"
                  : "Please provide feedback for requested changes"}
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Enter comments..."
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCommentDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={submitAction}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Dynamic Form for Setting Requirements
const RequirementsForm = ({ requirements, onSave, isSubmitting }) => {
  const [formData, setFormData] = useState(
    requirements || { form: {}, payment: null },
  );

  const addFormField = () => {
    const fieldName = prompt("Enter field name:");
    if (!fieldName) return;
    const fieldType = prompt(
      "Enter field type (text, number, textarea, file):",
      "text",
    );
    const isOptional = confirm("Is this field optional?");

    const newField = {
      type: fieldType,
      optional: isOptional,
    };

    if (fieldType === "file") {
      newField.accept = ["image/jpeg", "image/png", "application/pdf"];
      newField.maxSize = 5 * 1024 * 1024;
      newField.multiple = false;
    }

    setFormData({
      ...formData,
      form: { ...formData.form, [fieldName]: newField },
    });
  };

  const removeField = (fieldName) => {
    const newForm = { ...formData.form };
    delete newForm[fieldName];
    setFormData({ ...formData, form: newForm });
  };

  const updateField = (fieldName, key, value) => {
    setFormData({
      ...formData,
      form: {
        ...formData.form,
        [fieldName]: { ...formData.form[fieldName], [key]: value },
      },
    });
  };

  const enablePayment = () => {
    setFormData({
      ...formData,
      payment: {
        amount: 100,
        currency: "ETB",
        reason: "Service Fee",
        methods: { chapa: { enabled: true } },
      },
    });
  };

  const disablePayment = () => {
    setFormData({ ...formData, payment: null });
  };

  return (
    <div className="space-y-6">
      {/* Form Fields Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Form Fields</h3>
          <Button size="sm" onClick={addFormField}>
            <Plus className="h-4 w-4 mr-1" />
            Add Field
          </Button>
        </div>

        {Object.keys(formData.form).length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed rounded-lg">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No form fields added</p>
          </div>
        ) : (
          <div className="space-y-3">
            {Object.entries(formData.form).map(([fieldName, config]) => (
              <Card key={fieldName}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <Input
                      value={fieldName}
                      onChange={(e) => {
                        const newForm = { ...formData.form };
                        newForm[e.target.value] = newForm[fieldName];
                        delete newForm[fieldName];
                        setFormData({ ...formData, form: newForm });
                      }}
                      className="max-w-[200px]"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeField(fieldName)}
                    >
                      <XCircle className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Type</Label>
                      <Select
                        value={config.type}
                        onValueChange={(v) => updateField(fieldName, "type", v)}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="number">Number</SelectItem>
                          <SelectItem value="textarea">Textarea</SelectItem>
                          <SelectItem value="file">File Upload</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-xs">Required</Label>
                      <Switch
                        checked={!config.optional}
                        onCheckedChange={(v) =>
                          updateField(fieldName, "optional", !v)
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Separator />

      {/* Payment Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Payment Requirement</h3>
          {!formData.payment ? (
            <Button size="sm" onClick={enablePayment}>
              <CreditCard className="h-4 w-4 mr-1" />
              Enable Payment
            </Button>
          ) : (
            <Button size="sm" variant="destructive" onClick={disablePayment}>
              Remove Payment
            </Button>
          )}
        </div>

        {formData.payment && (
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Amount</Label>
                  <Input
                    type="number"
                    value={formData.payment.amount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        payment: {
                          ...formData.payment,
                          amount: parseFloat(e.target.value),
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <Label className="text-xs">Currency</Label>
                  <Input
                    value={formData.payment.currency}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        payment: {
                          ...formData.payment,
                          currency: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs">Reason</Label>
                <Input
                  value={formData.payment.reason}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      payment: { ...formData.payment, reason: e.target.value },
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Button
        onClick={() => onSave(formData)}
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          "Save Requirements"
        )}
      </Button>
    </div>
  );
};

export default function EmployeeTaskDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [task, setTask] = useState(null);
  const [appointment, setAppointment] = useState(null);
  const [client, setClient] = useState(null);
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRequirementsDialog, setShowRequirementsDialog] = useState(false);
  const [showCreateNextDialog, setShowCreateNextDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [statusComment, setStatusComment] = useState("");
  const [previousTasks, setPreviousTasks] = useState([]);
  const [nextTasks, setNextTasks] = useState([]);
  const session = useSessionStore((s) => s.session);

  const fetchTaskDetails = useCallback(async () => {
    try {
      const res = await RequestHandler.Get(
        // `/query/v1/task?~id=${id}&select={"":["id","name","status","isDone","requirements","submissions","createdAt","updatedAt","startTime","endTime","completedAt","previousTaskId","nextTaskId","appointmentId","employeeId"],"appointment":["id","startTime","endTime","status","notes"],"service":["id","name","description","price","imageUrl"],"organization":["id","name","address","email","phone","sector"],"client":["id","firstname","lastname","email","phone","gender"],"employee":["id","jobTitle"],"user":["firstname","lastname","email"]}`,
        `/query/v1/task?~id=${id}`,
      );

      if (res.ok) {
        const {
          tasks: [taskData],
        } = await res.json();
        setTask(taskData);
        setAppointment(taskData.appointment);
        setClient(taskData.client);
        setOrganization(taskData.organization);

        // Fetch previous task if exists
        if (taskData.previousTaskId) {
          const prevRes = await RequestHandler.Get(
            `/query/v1/task?~id=${taskData.previousTaskId}`,
          );
          if (prevRes.ok) {
            const {
              tasks: [prevTask],
            } = await prevRes.json();
            setPreviousTasks(prevTask ? [prevTask] : []);
          }
        }

        // Fetch next tasks
        if (taskData.nextTaskId) {
          const nextRes = await RequestHandler.Get(
            `/query/v1/task?~id=${taskData.nextTaskId}`,
          );
          if (nextRes.ok) {
            const {
              tasks: [nextTask],
            } = await nextRes.json();
            setNextTasks(nextTask ? [nextTask] : []);
          }
        }
      } else {
        toast.error("Task not found");
        // router.push("/dashboard/employee/tasks");
      }
    } catch (error) {
      console.error("Failed to fetch task:", error);
      toast.error("Failed to load task details");
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    fetchTaskDetails();
  }, [fetchTaskDetails]);

  const handleUpdateStatus = async () => {
    setIsSubmitting(true);
    try {
      const updateData = { status: newStatus };
      if (newStatus === "completed") {
        updateData.isDone = true;
      }
      // if (statusComment) {
      //   updateData.submissions = {
      //     ...task?.submissions,
      //     // statusUpdateComment: statusComment,
      //     // statusUpdatedAt: new Date().toISOString(),
      //   };
      // }
      const updated = await RequestHandler.Patch(
        `/query/v1/appointment?~id=${appointment.id}`,
        {
          body: {
            status: "completed",
          },
        },
      );
      if (updated.ok) {
        const res = await RequestHandler.Patch(
          `/query/v1/task?~id=${task.id}`,
          {
            body: updateData,
          },
        );
        if (res.ok) {
          toast.success(`Task status updated to ${newStatus}`);
          setShowStatusDialog(false);
          setStatusComment("");
          fetchTaskDetails();
        }
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update status");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApproveSubmission = async (comments) => {
    setIsSubmitting(true);
    try {
      const res = await RequestHandler.Patch(`/query/v1/task?~id=${task.id}`, {
        body: {
          status: "approved",
          submissions: {
            ...task?.submissions,
            approvedAt: new Date().toISOString(),
            approvalComments: comments,
            approvedBy: "employee",
          },
        },
      });

      if (res.ok) {
        toast.success("Submission approved successfully!");
        fetchTaskDetails();
      }
    } catch (error) {
      console.error("Failed to approve:", error);
      toast.error("Failed to approve submission");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectSubmission = async (comments) => {
    setIsSubmitting(true);
    try {
      const res = await RequestHandler.Patch(`/query/v1/task?~id=${task.id}`, {
        body: {
          status: "rejected",
          submissions: {
            ...task?.submissions,
            rejectedAt: new Date().toISOString(),
            rejectionComments: comments,
          },
        },
      });

      if (res.ok) {
        toast.error("Submission rejected");
        fetchTaskDetails();
      }
    } catch (error) {
      console.error("Failed to reject:", error);
      toast.error("Failed to reject submission");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestChanges = async (comments) => {
    setIsSubmitting(true);
    try {
      const res = await RequestHandler.Patch(`/query/v1/task?~id=${task.id}`, {
        body: {
          status: "review",
          submissions: {
            ...task?.submissions,
            changesRequestedAt: new Date().toISOString(),
            changesRequestedComments: comments,
          },
        },
      });

      if (res.ok) {
        toast.info("Changes requested");
        fetchTaskDetails();
      }
    } catch (error) {
      console.error("Failed to request changes:", error);
      toast.error("Failed to request changes");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveRequirements = async (requirements) => {
    setIsSubmitting(true);
    try {
      const res = await RequestHandler.Patch(`/query/v1/task?~id=${task.id}`, {
        body: { requirements },
      });

      if (res.ok) {
        toast.success("Requirements saved successfully");
        setShowRequirementsDialog(false);
        fetchTaskDetails();
      }
    } catch (error) {
      console.error("Failed to save requirements:", error);
      toast.error("Failed to save requirements");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateNextTask = async (taskData) => {
    setIsSubmitting(true);
    try {
      const createRes = await RequestHandler.Post("/query/v1/task", {
        body: {
          ...taskData,
          previousTaskId: task.id,
          appointmentId: appointment?.id,
          organizationId: organization?.id,
          completedAt: new Date(),
          isDone: true,
        },
      });

      if (createRes.ok) {
        const {
          tasks: [newTask],
        } = await createRes.json();

        // Update current task with nextTaskId
        await RequestHandler.Patch(`/query/v1/task?~id=${task.id}`, {
          body: { nextTaskId: newTask.id },
        });

        toast.success("Next task created successfully!");
        setShowCreateNextDialog(false);
        fetchTaskDetails();
      }
    } catch (error) {
      console.error("Failed to create next task:", error);
      toast.error("Failed to create next task");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!task) return null;

  const hasSubmissions =
    task.submissions && Object.keys(task.submissions).length > 0;
  const needsReview = task.status === "pending" && hasSubmissions;
  const isInProgress = task.status === "active";
  const isCompleted = task.status === "completed" || task.isDone;
  const hasRequirements =
    task.requirements && (task.requirements.form || task.requirements.payment);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{task.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              {getStatusBadge(task.status, task.isDone)}
              {task.appointment?.service && (
                <Badge variant="outline">{task.appointment.service.name}</Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {!isCompleted && task.employee.id === session.userId && (
            <>
              <Button onClick={() => setShowStatusDialog(true)}>
                <PlayCircle className="h-4 w-4 mr-2" />
                Update Status
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCreateNextDialog(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Next Task
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Task Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Task Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                {/* <Label>Description</Label> */}
                <p className="text-muted-foreground ">
                  {previousTasks[0]?.employee.firstname}{" "}
                  {previousTasks[0]?.employee.lastname} said
                </p>
                <p className="mt-1 text-lg">
                  {task.description || "No description provided"}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Created
                  </Label>
                  <p className="text-sm">{formatDate(task.createdAt)}</p>
                </div>
                {task.startTime && (
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Start Time
                    </Label>
                    <p className="text-sm">{formatDate(task.startTime)}</p>
                  </div>
                )}
                {task.endTime && (
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      End Time
                    </Label>
                    <p className="text-sm">{formatDate(task.endTime)}</p>
                  </div>
                )}
                {task.completedAt && (
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Completed
                    </Label>
                    <p className="text-sm">{formatDate(task.completedAt)}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Requirements Section */}
          {hasRequirements && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Requirements
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowRequirementsDialog(true)}
                  >
                    Edit Requirements
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {task.requirements.form &&
                    Object.keys(task.requirements.form).length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Form Fields</h4>
                        <div className="space-y-1">
                          {Object.entries(task.requirements.form).map(
                            ([name, config]) => (
                              <div
                                key={name}
                                className="flex justify-between text-sm p-2 bg-muted/30 rounded"
                              >
                                <span>{name}</span>
                                <Badge variant="outline">
                                  {config.type} {!config.optional && "*"}
                                </Badge>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}
                  {task.requirements.payment && (
                    <div>
                      <h4 className="font-medium mb-2">Payment Required</h4>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="flex justify-between">
                          <span>Amount:</span>
                          <span className="font-bold">
                            {task.requirements.payment.amount}{" "}
                            {task.requirements.payment.currency}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {task.requirements.payment.reason}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submissions Section */}
          {hasSubmissions && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Client Submissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {needsReview ? (
                  <SubmissionReview
                    submission={task.submissions}
                    onApprove={handleApproveSubmission}
                    onReject={handleRejectSubmission}
                    onRequestChanges={handleRequestChanges}
                  />
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Submission has been reviewed</span>
                    </div>
                    {task.submissions.approvalComments && (
                      <div className="p-3 bg-green-50 rounded-lg">
                        <Label className="text-xs">Approval Comments</Label>
                        <p className="text-sm">
                          {task.submissions.approvalComments}
                        </p>
                      </div>
                    )}
                    {task.submissions.rejectionComments && (
                      <div className="p-3 bg-red-50 rounded-lg">
                        <Label className="text-xs">Rejection Comments</Label>
                        <p className="text-sm">
                          {task.submissions.rejectionComments}
                        </p>
                      </div>
                    )}
                    {task.submissions.changesRequestedComments && (
                      <div className="p-3 bg-yellow-50 rounded-lg">
                        <Label className="text-xs">Changes Requested</Label>
                        <p className="text-sm">
                          {task.submissions.changesRequestedComments}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Task Chain */}
          {(previousTasks.length > 0 || nextTasks.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LinkIcon className="h-5 w-5" />
                  Task Chain
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {previousTasks.length > 0 && (
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Previous Task
                    </Label>
                    {previousTasks.map((prev) => (
                      <Link
                        key={prev.id}
                        href={`/dashboard/employee/task/${prev.id}`}
                      >
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg mt-1 hover:bg-muted/50 cursor-pointer">
                          <div>
                            <p className="font-medium">{prev.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(prev.createdAt)}
                            </p>
                          </div>
                          {getStatusBadge(prev.status, prev.isDone)}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
                {nextTasks.length > 0 && (
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Next Task
                    </Label>
                    {nextTasks.map((next) => (
                      <Link
                        key={next.id}
                        href={`/dashboard/employee/task/${next.id}`}
                      >
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg mt-1 hover:bg-muted/50 cursor-pointer">
                          <div>
                            <p className="font-medium">{next.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(next.createdAt)}
                            </p>
                          </div>
                          {getStatusBadge(next.status, next.isDone)}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Client Info */}
          {client && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Client Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Avatar className="w-12 h-12 border-4 rounded-[12px] border-border/40 ring-1 ring-primary/10 shadow-lg">
                    <AvatarImage
                      className="rounded"
                      src={`/api/v1/user/profile_picture`}
                      // alt="profile"
                      alt={`${client.firstname || ""} ${client.lastname || ""}`}
                    />
                    <AvatarFallback className="bg-indigo-500 text-white text-2xl">
                      {client.firstname?.[0] || ""}
                      {client.lastname?.[0] || ""}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="text-lg">
                      {client.firstname} {client.lastname}
                    </p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {client.gender}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={`mailto:${client.email}`}
                    className="hover:underline"
                  >
                    {client.email}
                  </a>
                </div>
                {client.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${client.phone}`} className="hover:underline">
                      {client.phone}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Organization Info */}
          {organization && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Organization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="font-medium">{organization.name}</p>
                {organization.address && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{organization.address}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={`mailto:${organization.email}`}
                    className="hover:underline"
                  >
                    {organization.email}
                  </a>
                </div>
                {organization.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={`tel:${organization.phone}`}
                      className="hover:underline"
                    >
                      {organization.phone}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Appointment Info */}
          {appointment && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5" />
                  Appointment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Start Time
                  </span>
                  <span className="text-sm">
                    {formatDate(appointment.startTime)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    End Time
                  </span>
                  <span className="text-sm">
                    {/* {formatDate(appointment.startTime)} -{" "} */}
                    {formatDate(appointment.endTime)}
                  </span>
                </div>
                {appointment.notes && (
                  <div>
                    <Label className="text-xs">Notes</Label>
                    <p className="text-sm mt-1">{appointment.notes}</p>
                  </div>
                )}
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link
                    href={`/dashboard/employee/appointment/${appointment.id}`}
                  >
                    View Appointment Details
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Update Status Dialog */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Task Status</DialogTitle>
            <DialogDescription>
              Change the status of this task
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="active">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                  <SelectItem value="review">Under Review</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* <div className="space-y-2">
              <Label>Comment (Optional)</Label>
              <Textarea
                placeholder="Add a comment about this status change..."
                value={statusComment}
                onChange={(e) => setStatusComment(e.target.value)}
                rows={3}
              />
            </div> */}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowStatusDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateStatus}
              disabled={isSubmitting || !newStatus}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Update"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Requirements Dialog */}
      <Dialog
        open={showRequirementsDialog}
        onOpenChange={setShowRequirementsDialog}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Configure Task Requirements</DialogTitle>
            <DialogDescription>
              Set up what the client needs to provide
            </DialogDescription>
          </DialogHeader>
          <RequirementsForm
            requirements={task.requirements}
            onSave={handleSaveRequirements}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Create Next Task Dialog */}
      <Dialog
        open={showCreateNextDialog}
        onOpenChange={setShowCreateNextDialog}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Next Task</DialogTitle>
            <DialogDescription>
              Create a follow-up task in the workflow
            </DialogDescription>
          </DialogHeader>
          <CreateNextTaskForm
            onSave={handleCreateNextTask}
            isSubmitting={isSubmitting}
            organizationId={organization?.id}
            currentTaskId={task.id}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Create Next Task Form Component
const CreateNextTaskForm = ({
  onSave,
  isSubmitting,
  organizationId,
  currentTaskId,
}) => {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    employeeId: "",
    startTime: "",
    endTime: "",
  });

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await RequestHandler.Get(
          `/query/v1/employee?~organizationId=${organizationId}`,
        );
        if (res.ok) {
          const { employees } = await res.json();
          setEmployees(employees || []);
        }
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      }
    };
    if (organizationId) fetchEmployees();
  }, [organizationId]);

  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label>Task Name</Label>
        <Input
          placeholder="Enter task name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          placeholder="Enter task description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={3}
        />
      </div>
      <div className="space-y-2">
        <Label>Assign To</Label>
        <Select
          value={formData.employeeId}
          onValueChange={(v) => setFormData({ ...formData, employeeId: v })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select employee" />
          </SelectTrigger>
          <SelectContent>
            {employees.map((emp) => (
              <SelectItem key={emp.id} value={emp.id}>
                {emp.user?.firstname} {emp.user?.lastname} - {emp.jobTitle}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Start Time (Optional)</Label>
          <Input
            type="datetime-local"
            value={formData.startTime}
            onChange={(e) =>
              setFormData({ ...formData, startTime: e.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <Label>End Time (Optional)</Label>
          <Input
            type="datetime-local"
            value={formData.endTime}
            onChange={(e) =>
              setFormData({ ...formData, endTime: e.target.value })
            }
          />
        </div>
      </div>
      <Button
        onClick={() => onSave(formData)}
        disabled={isSubmitting || !formData.employeeId}
        className="w-full"
      >
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          "Create Task"
        )}
      </Button>
    </div>
  );
};
