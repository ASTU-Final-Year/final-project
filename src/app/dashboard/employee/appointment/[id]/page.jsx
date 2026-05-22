// src/app/dashboard/client/appointment/[id]/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  ChevronLeft,
  Loader2,
  FileText,
  CreditCard,
  Star,
  MessageCircle,
  Calendar,
} from "lucide-react";
import RequestHandler from "@/lib/request-handler";
import Link from "next/link";
import { toast } from "sonner";

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
      return "bg-green-100 text-green-700";
    case "in-progress":
      return "bg-blue-100 text-blue-700";
    case "scheduled":
      return "bg-yellow-100 text-yellow-700";
    case "canceled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

// Star Rating Component
const StarRating = ({ rating, onRate, readonly = false }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onRate?.(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          className={!readonly ? "cursor-pointer" : "cursor-default"}
        >
          <Star
            className={`h-5 w-5 ${
              star <= (hover || rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export default function AppointmentDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [appointment, setAppointment] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(0);
  const [submittingRating, setSubmittingRating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch appointment with service and organization
        const aptRes = await RequestHandler.Get(
          // `/query/v1/appointment?~id=${id}&select={"":["id","startTime","endTime","status","notes"],"service":["id","name","description","price","imageUrl","rating"],"organization":["id","name","address","email","phone","sector"],"client":["firstname","lastname","email","phone"]}`,
          `/query/v1/appointment?~id=${id}`,
        );

        if (!aptRes.ok) throw new Error("Appointment not found");

        const {
          appointments: [appointmentData],
        } = await aptRes.json();
        setAppointment(appointmentData);
        setRating(appointmentData.service?.rating || 0);

        // Fetch related tasks
        const taskRes = await RequestHandler.Get(
          `/query/v1/task?~appointmentId=${id}&order=["createdAt.asc","completedAt.asc"]`,
          // `/query/v1/task?~appointmentId=${id}&order=["createdAt.asc"]&select={"":["id","name","status","isDone","requirements","submissions","createdAt","completedAt"],"employee":{"user":["firstname","lastname"]}}`,
        );

        if (taskRes.ok) {
          const { tasks: taskList } = await taskRes.json();
          setTasks(taskList || []);
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold">Appointment not found</h2>
        <p className="text-gray-600 mt-2">
          {error || "The appointment you're looking for doesn't exist."}
        </p>
        <Button className="mt-4" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  const completedTasks = tasks.filter(
    (t) => t.isDone || t.status === "completed",
  ).length;
  const totalTasks = tasks.length;
  const progressPercent =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const canReschedule =
    appointment.status === "scheduled" &&
    new Date(appointment.startTime) > new Date();

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      {/* <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Appointment Details</h1>
      </div> */}

      {/* Service Header with Image */}
      <Card className="overflow-hidden pt-0">
        {appointment.service?.imageUrl && (
          <div className="h-48 w-full relative">
            <img
              src={appointment.service.imageUrl}
              alt={appointment.service.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <CardHeader>
          <div className="flex justify-between items-start flex-wrap gap-2">
            <div>
              <CardTitle className="text-xl">
                {appointment.service?.name}
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                {appointment.organization?.name}
              </p>
            </div>
            <Badge className={getStatusColor(appointment.status)}>
              {appointment.status?.replace("-", " ")}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Appointment Info */}
      <Card>
        <CardHeader>
          <CardTitle>Appointment Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <CalendarDays className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-medium">
                  {formatDate(appointment.startTime)}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Time</p>
                <p className="font-medium">
                  {formatTime(appointment.startTime)} -{" "}
                  {formatTime(appointment.endTime)}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-medium">
                  {appointment.organization?.address}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Building2 className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Sector</p>
                <p className="font-medium">
                  {appointment.organization?.sector}
                </p>
              </div>
            </div>
          </div>

          {appointment.notes && (
            <>
              <Separator />
              <div>
                <p className="text-sm text-gray-600">Additional Notes</p>
                <p className="text-gray-800 mt-1">{appointment.notes}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Progress Tracker */}
      {totalTasks > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Service Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Overall Progress</span>
                <span className="font-medium">
                  {Math.round(progressPercent)}%
                </span>
              </div>
              <Progress value={progressPercent} className="h-2" />
            </div>

            <div className="space-y-3">
              {tasks.map((task, idx) => {
                const isCompleted = task.isDone || task.status === "completed";
                const hasRequirements =
                  task.requirements &&
                  (task.requirements.form || task.requirements.payment);
                const needsAction =
                  !isCompleted && hasRequirements && !task.submissions;

                return (
                  <div key={task.id} className="flex gap-3 items-start">
                    <div className="mt-0.5">
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : needsAction ? (
                        <AlertCircle className="h-5 w-5 text-yellow-600" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-300" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p
                        className={`font-medium ${isCompleted ? "text-gray-500 line-through" : "text-gray-900"}`}
                      >
                        {task.name}
                      </p>
                      {task.employee?.user && (
                        <p className="text-xs text-gray-500">
                          Assigned to: {task.employee.user.firstname}{" "}
                          {task.employee.user.lastname}
                        </p>
                      )}
                      {needsAction && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="mt-2"
                          onClick={() =>
                            router.push(`/dashboard/client/task/${task.id}`)
                          }
                        >
                          Complete Requirements
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Organization Contact */}
      <Card>
        <CardHeader>
          <CardTitle>Organization Contact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <Building2 className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">Organization</p>
              <p className="text-gray-900">{appointment.organization?.name}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="text-gray-900">{appointment.organization?.email}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="text-gray-900">
                {appointment.organization?.phone || "Not provided"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
