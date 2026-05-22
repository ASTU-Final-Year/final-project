// src/app/dashboard/client/appointments/[id]/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
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
} from "lucide-react";
import RequestHandler from "@/lib/request-handler";
import Link from "next/link";

// Helper to format date
const formatDate = (dateString) => {
  if (!dateString) return "Not scheduled";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Helper to format time
const formatTime = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function AppointmentDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [appointment, setAppointment] = useState(null);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        // Adjust the endpoint to match your backend.
        // Example: /api/v1/client/appointments/{id}?include=tasks
        const res = await RequestHandler.Get(`/query/v1/appointment?~id=${id}`);
        if (!res.ok) throw new Error("Appointment not found");
        const { count, appointments: [appointment] } = await res.json();
        setAppointment(appointment);
        // Assume progress tasks are in data.tasks or data.progress
        // const tasks = data.tasks || data.progress || [];
        // setProgress(tasks);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchAppointment();
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
        <h2 className="text-xl font-bold text-indigo-900">Appointment not found</h2>
        <p className="text-indigo-600 mt-2">{error || "The appointment you're looking for doesn't exist."}</p>
        <Button className="mt-4" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  // Calculate overall progress percentage
  const totalSteps = progress.length;
  const completedSteps = progress.filter((step) => step.state === "completed" || step.isDone).length;
  const progressPercent = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header with back button */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-indigo-950">Appointment Details</h1>
      </div>

      {/* Appointment summary card */}
      <Card className="border-indigo-100 shadow-sm">
        <CardHeader>
          <div className="flex justify-between items-start flex-wrap gap-2">
            <CardTitle className="text-indigo-900">Service Information</CardTitle>
            <Badge
              className={
                appointment.status === "completed"
                  ? "bg-green-100 text-green-700"
                  : appointment.status === "in_progress"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-yellow-100 text-yellow-700"
              }
            >
              {appointment.status?.replace("_", " ") || "Scheduled"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <Building2 className="h-5 w-5 text-indigo-500 mt-0.5" />
              <div>
                <p className="text-sm text-indigo-600">Organization</p>
                <p className="font-medium text-indigo-900">{appointment.organization?.name || "—"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-indigo-500 mt-0.5" />
              <div>
                <p className="text-sm text-indigo-600">Service</p>
                <p className="font-medium text-indigo-900">{appointment.service?.name || "—"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CalendarDays className="h-5 w-5 text-indigo-500 mt-0.5" />
              <div>
                <p className="text-sm text-indigo-600">Date</p>
                <p className="font-medium text-indigo-900">{formatDate(appointment.date)}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-indigo-500 mt-0.5" />
              <div>
                <p className="text-sm text-indigo-600">Time</p>
                <p className="font-medium text-indigo-900">{formatTime(appointment.date)}</p>
              </div>
            </div>
            {appointment.organization?.address && (
              <div className="flex items-start gap-3 md:col-span-2">
                <MapPin className="h-5 w-5 text-indigo-500 mt-0.5" />
                <div>
                  <p className="text-sm text-indigo-600">Location</p>
                  <p className="text-indigo-900">{appointment.organization.address}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Progress tracker */}
      <Card className="border-indigo-100 shadow-sm">
        <CardHeader>
          <CardTitle className="text-indigo-900">Service Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {totalSteps > 0 ? (
            <>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-indigo-600">
                  <span>Overall progress</span>
                  <span>{Math.round(progressPercent)}%</span>
                </div>
                <Progress value={progressPercent} className="h-2" />
              </div>

              <div className="space-y-4">
                {progress.map((step, idx) => {
                  const isCompleted = step.state === "completed" || step.isDone === true;
                  const isCurrent = step.state === "in_progress" && !isCompleted;
                  const isPending = (!isCompleted && !isCurrent) || step.state === "pending";

                  return (
                    <div key={step.id || idx} className="flex gap-3 items-start">
                      <div className="mt-0.5">
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : isCurrent ? (
                          <Loader2 className="h-5 w-5 text-indigo-600 animate-spin" />
                        ) : (
                          <Circle className="h-5 w-5 text-indigo-300" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${isCompleted ? "text-indigo-600" : "text-indigo-900"}`}>
                          {step.title || step.name || `Step ${idx + 1}`}
                        </p>
                        {step.notes && <p className="text-sm text-indigo-500 mt-1">{step.notes}</p>}
                        {isCurrent && (
                          <Badge variant="outline" className="mt-1 bg-indigo-50 text-indigo-700 border-indigo-200">
                            In progress
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <p className="text-indigo-600 text-center py-4">No progress steps available for this appointment.</p>
          )}
        </CardContent>
      </Card>

      {/* Additional info – client contact */}
      <Card className="border-indigo-100 shadow-sm">
        <CardHeader>
          <CardTitle className="text-indigo-900">Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <User className="h-5 w-5 text-indigo-500 mt-0.5" />
            <div>
              <p className="text-sm text-indigo-600">Client Name</p>
              <p className="text-indigo-900">{appointment.client?.firstname} {appointment.client?.lastname}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-indigo-500 mt-0.5" />
            <div>
              <p className="text-sm text-indigo-600">Email</p>
              <p className="text-indigo-900">{appointment.client?.email}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="h-5 w-5 text-indigo-500 mt-0.5" />
            <div>
              <p className="text-sm text-indigo-600">Phone</p>
              <p className="text-indigo-900">{appointment.client?.phone}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action buttons */}
      <div className="flex gap-3 justify-end">
        <Button variant="outline" className="border-indigo-200 text-indigo-700" onClick={() => router.back()}>
          Back to Appointments
        </Button>
        {appointment.status !== "completed" && (
          <Button className="bg-indigo-600 hover:bg-indigo-700">Reschedule</Button>
        )}
      </div>
    </div>
  );
}