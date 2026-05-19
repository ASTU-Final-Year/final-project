"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  Loader2,
  Circle,
  CheckCircle,
  Wifi,
  WifiOff,
  AlertCircle,
  Sparkles,
  TrendingUp,
  Shield,
  Star
} from "lucide-react";
import { format, isToday, isTomorrow, parseISO } from "date-fns";
import RequestHandler from "@/lib/request-handler";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function ClientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showProgressDialog, setShowProgressDialog] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [cancelledList, setCancelledList] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await RequestHandler.Get(
        '/query/v1/appointment?mine&select={"":["id","status","startTime","endTime","notes","service","organization"]}'
      );
      if (res.ok) {
        const { appointments: data } = await res.json();
        const formatted = data.map(apt => ({
          id: apt.id,
          name: apt.service?.name || "Service",
          location: apt.organization?.name || "Provider",
          status: apt.status,
          date: apt.startTime ? format(parseISO(apt.startTime), "MMM d, yyyy") : "Unknown",
          time: apt.startTime ? format(parseISO(apt.startTime), "h:mm a") : "Unknown",
          startTime: apt.startTime,
          rawStatus: apt.status
        }));
        setAppointments(formatted);
        
        const cancelled = data.filter(apt => apt.status === "canceled").map(apt => ({
          id: apt.id,
          name: apt.service?.name || "Service",
          location: apt.organization?.name || "Provider",
          date: apt.startTime ? format(parseISO(apt.startTime), "MMM d, yyyy") : "Unknown"
        }));
        setCancelledList(cancelled);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setNetworkError(true);
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId, appointmentName, location, date) => {
    if (!appointmentId) {
      toast.error("Cannot cancel this appointment");
      return;
    }
    
    try {
      const res = await RequestHandler.Patch(`/query/v1/appointment?mine&id=${appointmentId}`, {
        body: { status: "canceled" }
      });
      
      if (res.ok) {
        const newCancelled = {
          id: appointmentId,
          name: appointmentName,
          location: location,
          date: date
        };
        setCancelledList(prev => [newCancelled, ...prev]);
        setAppointments(prev => prev.filter(apt => apt.id !== appointmentId));
        toast.success(`${appointmentName} cancelled successfully`);
      } else {
        throw new Error("Failed to cancel");
      }
    } catch (error) {
      console.error("Failed to cancel appointment:", error);
      toast.error("Failed to cancel appointment");
    }
  };

  const getTodayAppointments = () => {
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return appointments.filter(apt => apt.date === today && apt.rawStatus !== "canceled");
  };

  const getTomorrowAppointments = () => {
    const tomorrow = new Date(Date.now() + 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return appointments.filter(apt => apt.date === tomorrow && apt.rawStatus !== "canceled");
  };

  const getThisWeekAppointments = () => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 86400000);
    return appointments.filter(apt => {
      const aptDate = new Date(apt.startTime);
      return aptDate >= today && aptDate <= nextWeek && apt.rawStatus !== "canceled" && apt.rawStatus !== "completed";
    });
  };

  const getCompletedAppointments = () => {
    return appointments.filter(apt => apt.rawStatus === "completed").slice(0, 3);
  };

  const handleTrackProgress = (apt) => {
    setSelectedAppointment(apt);
    setShowProgressDialog(true);
  };

  const getProgressStages = (status, hasNetworkError = false) => {
    const stages = [
      { 
        id: "scheduled", 
        name: "Scheduled", 
        icon: "📅", 
        description: "Appointment confirmed and waiting",
        statusText: "Pending"
      },
      { 
        id: "assigned", 
        name: "Preparation", 
        icon: "👨‍🍳", 
        description: "Provider is preparing for your service",
        statusText: "In Progress"
      },
      { 
        id: "in-progress", 
        name: "In Progress", 
        icon: "🔥", 
        description: "Service is currently being done",
        statusText: "In Progress"
      },
      { 
        id: "quality-check", 
        name: "Quality Check", 
        icon: "📦", 
        description: "Final inspection in progress",
        statusText: "Almost Done"
      },
      { 
        id: "completed", 
        name: "Completed", 
        icon: "✅", 
        description: "Service completed successfully",
        statusText: "Completed"
      }
    ];

    let currentStepIndex = 0;
    let isInterrupted = hasNetworkError;
    
    if (status === "scheduled") currentStepIndex = 0;
    else if (status === "assigned") currentStepIndex = 1;
    else if (status === "in-progress") currentStepIndex = 2;
    else if (status === "quality-check") currentStepIndex = 3;
    else if (status === "completed") currentStepIndex = 4;
    
    // Calculate progress percentage
    const progressPercent = (currentStepIndex / 4) * 100;
    
    if (isInterrupted && currentStepIndex < 3) {
      const displayedStages = stages.slice(0, currentStepIndex + 1);
      return { stages: [...displayedStages], currentStep: currentStepIndex, isInterrupted: true, progressPercent };
    }
    
    return { stages, currentStep: currentStepIndex, isInterrupted: false, progressPercent };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-64"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-28 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl"></div>)}
            </div>
            <div className="h-96 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  const todayAppointments = getTodayAppointments();
  const tomorrowAppointments = getTomorrowAppointments();
  const weekAppointments = getThisWeekAppointments();
  const completedAppointments = getCompletedAppointments();
  const completedCount = completedAppointments.length;

  const statCards = [
    { label: "UPCOMING", value: appointments.filter(apt => apt.rawStatus !== "canceled" && apt.rawStatus !== "completed").length, color: "from-blue-500 to-blue-600", icon: Calendar, badge: "+2 New", gradient: "from-blue-50 to-blue-100" },
    { label: "COMPLETED", value: completedCount, color: "from-green-500 to-green-600", icon: CheckCircle2, gradient: "from-green-50 to-green-100" },
    { label: "IN PROGRESS", value: appointments.filter(apt => apt.rawStatus === "in-progress").length, color: "from-purple-500 to-purple-600", icon: TrendingUp, gradient: "from-purple-50 to-purple-100" },
    { label: "CANCELLED", value: cancelledList.length, color: "from-red-500 to-red-600", icon: XCircle, gradient: "from-red-50 to-red-100" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30">
      <div className="max-w-4xl mx-auto p-6">
        
        {/* Header with gradient text */}
        <div className="mb-8 text-center md:text-left">
          <div className="inline-flex items-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-indigo-500" />
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent">
              My Appointments
            </h1>
          </div>
          <p className="text-gray-500">View and manage all your service appointments</p>
        </div>

        {/* Stats Row - Enhanced with gradients and animations */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, index) => (
            <div 
              key={stat.label} 
              className={`bg-gradient-to-br ${stat.gradient} rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-white/50`}
              style={{ animationDelay: `${index * 100}ms`, animation: 'fadeInUp 0.5s ease-out forwards' }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-600 tracking-wider">{stat.label}</span>
                {stat.badge && <Badge className="bg-green-500 text-white text-xs shadow-md">✨ {stat.badge}</Badge>}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-md`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Today Section - Enhanced */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
              <h2 className="text-xl font-bold text-gray-900">Today</h2>
            </div>
            <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
          
          <div className="space-y-4">
            {todayAppointments.map((apt, idx) => (
              <div key={apt.id} className="bg-white rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-indigo-200 group" style={{ animationDelay: `${idx * 100}ms`, animation: 'fadeInUp 0.5s ease-out forwards' }}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-base mb-1 group-hover:text-indigo-600 transition-colors">{apt.name}</h3>
                    <p className="text-sm text-gray-500 mb-3 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {apt.location}
                    </p>
                    {apt.rawStatus === "in-progress" && (
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600 font-medium">Progress</span>
                          <span className="text-purple-600 font-bold">60%</span>
                        </div>
                        <Progress value={60} className="h-2 bg-purple-100" indicatorClassName="bg-gradient-to-r from-purple-500 to-pink-500" />
                      </div>
                    )}
                    {apt.rawStatus === "scheduled" && (
                      <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs shadow-md">✨ Insurance Pre-approved</Badge>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-sm font-bold bg-gray-800 text-white hover:bg-gray-900 border-gray-700 transition-all duration-300 shadow-md"
                      onClick={() => handleTrackProgress(apt)}
                    >
                      Track Progress
                    </Button>
                    {apt.rawStatus !== "canceled" && apt.rawStatus !== "completed" && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-sm bg-white text-red-600 hover:bg-red-50 border-red-300 hover:border-red-500 transition-all duration-300 shadow-sm"
                        onClick={() => handleCancelAppointment(apt.id, apt.name, apt.location, apt.date)}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {todayAppointments.length === 0 && (
              <div className="bg-gradient-to-r from-gray-50 to-indigo-50/30 rounded-xl p-8 text-center border-2 border-dashed border-gray-200">
                <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500">No appointments for today</p>
                <p className="text-xs text-gray-400 mt-1">Enjoy your free time! 🎉</p>
              </div>
            )}
          </div>
        </div>

        {/* Tomorrow Section - Enhanced */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-orange-500 to-pink-600 rounded-full"></div>
              <h2 className="text-xl font-bold text-gray-900">Tomorrow</h2>
            </div>
            <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">{new Date(Date.now() + 86400000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
          
          <div className="space-y-3">
            {tomorrowAppointments.map((apt, idx) => (
              <div key={apt.id} className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-orange-200 group" style={{ animationDelay: `${idx * 100}ms`, animation: 'fadeInUp 0.5s ease-out forwards' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">{apt.name}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      {apt.location} • {apt.time}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-sm font-bold bg-gray-800 text-white hover:bg-gray-900 border-gray-700 transition-all duration-300 shadow-md"
                      onClick={() => handleTrackProgress(apt)}
                    >
                      Track Progress
                    </Button>
                    {apt.rawStatus !== "canceled" && apt.rawStatus !== "completed" && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-sm bg-white text-red-600 hover:bg-red-50 border-red-300 hover:border-red-500 transition-all duration-300 shadow-sm"
                        onClick={() => handleCancelAppointment(apt.id, apt.name, apt.location, apt.date)}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {tomorrowAppointments.length === 0 && (
              <div className="bg-gradient-to-r from-gray-50 to-orange-50/30 rounded-xl p-8 text-center border-2 border-dashed border-gray-200">
                <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500">No appointments for tomorrow</p>
                <p className="text-xs text-gray-400 mt-1">Plan your day ahead! 🌟</p>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Week Section - Enhanced */}
        <div className="mb-8">
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-teal-600 rounded-full"></div>
              <h2 className="text-xl font-bold text-gray-900">Upcoming week</h2>
            </div>
            <p className="text-sm text-gray-500 mt-1">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(Date.now() + 7 * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-indigo-50/50 border-b">
                  <tr>
                    <th className="text-left p-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">DATE</th>
                    <th className="text-left p-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">SERVICE</th>
                    <th className="text-left p-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">LOCATION</th>
                    <th className="text-left p-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {weekAppointments.map((apt, idx) => (
                    <tr key={apt.id} className="border-b hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-transparent transition-colors duration-200" style={{ animationDelay: `${idx * 50}ms`, animation: 'fadeInUp 0.3s ease-out forwards' }}>
                      <td className="p-4 text-sm font-medium text-gray-900">{apt.date}</td>
                      <td className="p-4">
                        <span className="text-sm text-gray-900">{apt.name}</span>
                        </td>
                      <td className="p-4 text-sm text-gray-600 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {apt.location}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-sm font-bold bg-gray-800 text-white hover:bg-gray-900 border-gray-700 transition-all duration-300 shadow-md"
                            onClick={() => handleTrackProgress(apt)}
                          >
                            Track Progress
                          </Button>
                          {apt.rawStatus !== "canceled" && apt.rawStatus !== "completed" && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-sm bg-white text-red-600 hover:bg-red-50 border-red-300 hover:border-red-500 transition-all duration-300 shadow-sm"
                              onClick={() => handleCancelAppointment(apt.id, apt.name, apt.location, apt.date)}
                            >
                              Cancel
                            </Button>
                          )}
                        </div>
                        </td>
                    </tr>
                  ))}
                  {weekAppointments.length === 0 && (
                    <tr>
                      <td colSpan="4" className="p-12 text-center">
                        <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                        <p className="text-gray-500">No upcoming appointments this week</p>
                        <p className="text-xs text-gray-400 mt-1">Take a break! 💫</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Completed & Cancelled Sections - Enhanced */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-white to-green-50/30 rounded-xl shadow-lg border border-green-100 p-5 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center shadow-md">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Completed Appointments</h3>
              </div>
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md">{completedCount}</Badge>
            </div>
            <div className="space-y-3">
              {completedAppointments.map((apt) => (
                <div key={apt.id} className="flex items-center justify-between py-2 border-b border-green-100">
                  <div>
                    <p className="font-medium text-gray-900">{apt.name}</p>
                    <p className="text-xs text-gray-500">{apt.location} • {apt.date}</p>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                </div>
              ))}
              {completedCount === 0 && (
                <div className="text-center py-6">
                  <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-2">
                    <CheckCircle2 className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-gray-500">No completed appointments yet</p>
                  <p className="text-xs text-gray-400 mt-1">Complete your first service! 🎯</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-red-50/30 rounded-xl shadow-lg border border-red-100 p-5 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-rose-600 flex items-center justify-center shadow-md">
                  <XCircle className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Cancelled Appointments</h3>
              </div>
              <Badge className="bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-md">{cancelledList.length}</Badge>
            </div>
            <div className="space-y-3">
              {cancelledList.map((apt) => (
                <div key={apt.id} className="flex items-center justify-between py-2 border-b border-red-100">
                  <div>
                    <p className="font-medium text-gray-900">{apt.name}</p>
                    <p className="text-xs text-gray-500">{apt.location} • {apt.date}</p>
                  </div>
                  <XCircle className="w-4 h-4 text-red-400" />
                </div>
              ))}
              {cancelledList.length === 0 && (
                <div className="text-center py-6">
                  <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-2">
                    <XCircle className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-gray-500">No cancelled appointments</p>
                  <p className="text-xs text-gray-400 mt-1">All your appointments are on track! 🌈</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {appointments.length === 0 && !loading && (
          <div className="bg-gradient-to-br from-white to-indigo-50/50 rounded-xl p-16 text-center shadow-lg border-2 border-dashed border-indigo-200 mt-6">
            <div className="w-20 h-20 mx-auto bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
              <Calendar className="w-10 h-10 text-indigo-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Appointments Yet</h3>
            <p className="text-gray-500">When you book appointments, they'll appear here</p>
            <div className="mt-4 inline-flex items-center gap-2 text-sm text-indigo-600">
              <Sparkles className="w-4 h-4" />
              <span>Ready to book your first service?</span>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* Progress Tracking Dialog - Enhanced with dynamic status */}
      <Dialog open={showProgressDialog} onOpenChange={setShowProgressDialog}>
        <DialogContent className="max-w-2xl bg-gradient-to-br from-white to-indigo-50/30 border border-indigo-100">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-indigo-700 bg-clip-text text-transparent">Track Progress</DialogTitle>
            <DialogDescription>
              {selectedAppointment?.name} at {selectedAppointment?.location}
            </DialogDescription>
          </DialogHeader>
          
          {selectedAppointment && (
            <div className="space-y-8 mt-6">
              <div className="space-y-6">
                {(() => {
                  const { stages, currentStep, isInterrupted, progressPercent } = getProgressStages(selectedAppointment.rawStatus, networkError);
                  const currentStatusText = stages[currentStep]?.statusText || 
                    (selectedAppointment.rawStatus === "scheduled" ? "Pending" :
                     selectedAppointment.rawStatus === "in-progress" ? "In Progress" :
                     selectedAppointment.rawStatus === "completed" ? "Completed" : "Processing");
                  
                  return (
                    <>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${
                            selectedAppointment.rawStatus === 'completed' ? 'bg-green-500 animate-pulse' :
                            selectedAppointment.rawStatus === 'in-progress' ? 'bg-purple-500 animate-pulse' :
                            selectedAppointment.rawStatus === 'scheduled' ? 'bg-yellow-500' :
                            selectedAppointment.rawStatus === 'assigned' ? 'bg-blue-500' :
                            'bg-gray-500'
                          }`} />
                          <span className="text-sm font-medium text-gray-700">
                            Status: <span className="font-bold text-gray-900">{currentStatusText}</span>
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          Progress: <span className="font-bold text-indigo-600">{Math.round(progressPercent)}%</span>
                        </div>
                        {networkError && selectedAppointment.rawStatus !== 'completed' && (
                          <div className="flex items-center gap-1 text-red-500">
                            <WifiOff className="w-4 h-4" />
                            <span className="text-xs">Interrupted</span>
                          </div>
                        )}
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-6">
                        <Progress value={progressPercent} className="h-3 bg-gray-200 rounded-full" indicatorClassName="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500" />
                      </div>

                      <div className="flex items-center justify-between">
                        {stages.map((stage, idx) => (
                          <div key={stage.id} className="flex flex-col items-center flex-1">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                              idx < currentStep ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg' :
                              idx === currentStep ? 
                                (selectedAppointment.rawStatus === 'in-progress' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white ring-4 ring-purple-200 animate-pulse' :
                                 selectedAppointment.rawStatus === 'assigned' ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white ring-4 ring-blue-200' :
                                 selectedAppointment.rawStatus === 'scheduled' ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white ring-4 ring-yellow-200' :
                                 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white ring-4 ring-indigo-200') :
                              'bg-gray-200 text-gray-400'
                            }`}>
                              {idx < currentStep ? (
                                <CheckCircle className="w-6 h-6" />
                              ) : idx === currentStep && selectedAppointment.rawStatus !== 'completed' ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                              ) : (
                                <span className="text-xl">{stage.icon}</span>
                              )}
                            </div>
                            <p className="text-xs font-medium mt-2 text-center">{stage.name}</p>
                            <p className="text-xs text-gray-400 text-center hidden md:block">{stage.description}</p>
                          </div>
                        ))}
                      </div>

                      {isInterrupted && (
                        <div className="bg-red-50 rounded-lg p-4 border border-red-200 mt-4">
                          <div className="flex items-start gap-3">
                            <WifiOff className="w-5 h-5 text-red-500 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-red-700">Service Interrupted</p>
                              <p className="text-xs text-red-600 mt-1">
                                Due to network issues, progress updates may be delayed. 
                                Please check your connection or contact support.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className={`rounded-lg p-4 mt-4 ${
                        selectedAppointment.rawStatus === 'in-progress' ? 'bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200' :
                        selectedAppointment.rawStatus === 'scheduled' ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200' :
                        selectedAppointment.rawStatus === 'completed' ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200' :
                        selectedAppointment.rawStatus === 'assigned' ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200' :
                        'bg-gray-50'
                      }`}>
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            selectedAppointment.rawStatus === 'in-progress' ? 'bg-purple-100' :
                            selectedAppointment.rawStatus === 'scheduled' ? 'bg-yellow-100' :
                            selectedAppointment.rawStatus === 'completed' ? 'bg-green-100' :
                            selectedAppointment.rawStatus === 'assigned' ? 'bg-blue-100' :
                            'bg-gray-100'
                          }`}>
                            {selectedAppointment.rawStatus === 'scheduled' && '📅'}
                            {selectedAppointment.rawStatus === 'assigned' && '👨‍🍳'}
                            {selectedAppointment.rawStatus === 'in-progress' && '🔥'}
                            {selectedAppointment.rawStatus === 'completed' && '✅'}
                          </div>
                          <div className="flex-1">
                            <p className={`text-sm font-medium ${
                              selectedAppointment.rawStatus === 'in-progress' ? 'text-purple-700' :
                              selectedAppointment.rawStatus === 'scheduled' ? 'text-yellow-700' :
                              selectedAppointment.rawStatus === 'completed' ? 'text-green-700' :
                              selectedAppointment.rawStatus === 'assigned' ? 'text-blue-700' :
                              'text-gray-700'
                            }`}>
                              {selectedAppointment.rawStatus === 'scheduled' && 'Your appointment is scheduled and confirmed. Please arrive 10 minutes before your scheduled time.'}
                              {selectedAppointment.rawStatus === 'assigned' && 'Provider is preparing for your service. You will be notified when it starts.'}
                              {selectedAppointment.rawStatus === 'in-progress' && 'Service is currently in progress. Estimated completion in 15-20 minutes.'}
                              {selectedAppointment.rawStatus === 'quality-check' && 'Service is almost complete. Final quality check in progress.'}
                              {selectedAppointment.rawStatus === 'completed' && 'Service completed successfully! Thank you for choosing us. Please rate your experience.'}
                            </p>
                            {selectedAppointment.rawStatus === 'in-progress' && (
                              <p className="text-xs text-purple-600 mt-1">
                                ⏰ Estimated remaining time: 15-20 minutes
                              </p>
                            )}
                            {selectedAppointment.rawStatus === 'scheduled' && (
                              <p className="text-xs text-yellow-600 mt-1">
                                📍 Please arrive 10 minutes before your scheduled time
                              </p>
                            )}
                            {selectedAppointment.rawStatus === 'assigned' && (
                              <p className="text-xs text-blue-600 mt-1">
                                👨‍🔧 Your provider is getting ready for you
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>

              <Button onClick={() => setShowProgressDialog(false)} className="w-full bg-gradient-to-r from-gray-900 to-gray-700 hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-lg">
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}