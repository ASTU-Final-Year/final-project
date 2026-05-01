"use client";

import { useState, useEffect } from "react";
import { 
  LayoutDashboard, Calendar, ClipboardList, 
  Users, UserCircle, Bell, 
  Search, CheckCircle, Clock, AlertCircle,
  Eye, FileText, Video as VideoIcon,
  Camera, LogOut, CircleCheck, CircleAlert, Circle,
  ArrowUpDown, Filter, ChevronDown, ChevronRight,
  TrendingUp, Activity, Award, Target
} from "lucide-react";

export default function EmployeeDashboardPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortBy, setSortBy] = useState("priority");
  const [activeTab, setActiveTab] = useState("tasks");
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    setSelectedDate(formattedDate);
  }, []);

  const stats = {
    totalTasks: 12,
    dueToday: 5,
    completed: 3,
    highPriority: 2
  };

  // Complete Task Schedule Data
  const [allTaskSchedule, setAllTaskSchedule] = useState([
    { 
      id: 1,
      time: "8:00 AM",
      title: "Available Slot",
      type: "available",
      status: "available",
      category: "available",
      date: "2024-04-23",
      priority: "low"
    },
    { 
      id: 2,
      time: "9:00 AM",
      title: "Sarah Johnson",
      subtitle: "PATIENT VISIT",
      description: "Post-operative consultation • Room 302",
      status: "in-progress",
      progress: 65,
      type: "patient",
      category: "appointment",
      date: "2024-04-23",
      priority: "high",
      patientName: "Sarah Johnson"
    },
    { 
      id: 3,
      time: "10:30 AM",
      title: "Tekle Wondimu",
      subtitle: "READY",
      description: "Diagnostic Review • Lab A",
      status: "ready",
      arrivedTime: "Arrived 10:15 AM",
      priority: "normal",
      type: "patient",
      category: "appointment",
      date: "2024-04-23",
      patientName: "Tekle Wondimu"
    },
    { 
      id: 4,
      time: "11:30 AM",
      title: "Complete Patient Records",
      subtitle: "CLINICAL DUTY",
      description: "Administrative updates for morning sessions",
      status: "scheduled",
      type: "duty",
      category: "task",
      date: "2024-04-23",
      priority: "high"
    },
    { 
      id: 5,
      time: "12:00 PM",
      title: "LUNCH BREAK",
      type: "break",
      category: "break",
      date: "2024-04-23"
    },
    { 
      id: 6,
      time: "1:00 PM",
      title: "Selam Tesfaye",
      subtitle: "SCHEDULED",
      description: "Immunization Protocol - Pediatric Wing",
      status: "scheduled",
      type: "patient",
      category: "appointment",
      date: "2024-04-23",
      hasCheckIn: true,
      priority: "normal",
      patientName: "Selam Tesfaye"
    },
    { 
      id: 7,
      time: "2:00 PM",
      title: "Available Slot",
      type: "available",
      category: "available",
      date: "2024-04-23",
      priority: "low"
    },
    { 
      id: 8,
      time: "3:00 PM",
      title: "Abebe Kebede",
      subtitle: "SCHEDULED",
      description: "Mobility Assessment - Therapy Room 2",
      status: "scheduled",
      type: "patient",
      category: "appointment",
      date: "2024-04-23",
      priority: "normal",
      patientName: "Abebe Kebede"
    },
    { 
      id: 9,
      time: "4:00 PM",
      title: "SHIFT END",
      type: "shift-end",
      category: "shift",
      date: "2024-04-23"
    },
    // Tomorrow's tasks (for testing)
    { 
      id: 10,
      time: "9:00 AM",
      title: "Dr. Genet Mekonnen",
      subtitle: "CONSULTATION",
      description: "Cardiology Review • Room 405",
      status: "scheduled",
      type: "patient",
      category: "appointment",
      date: "2024-04-24",
      priority: "high",
      patientName: "Dr. Genet Mekonnen"
    },
    { 
      id: 11,
      time: "2:00 PM",
      title: "Team Meeting",
      subtitle: "DEPARTMENT MEETING",
      description: "Weekly clinical review",
      type: "duty",
      category: "task",
      date: "2024-04-25",
      priority: "medium"
    }
  ]);

  // Filter tasks based on active tab
  const getFilteredTasks = () => {
    let filtered = [...allTaskSchedule];
    const today = new Date().toISOString().split('T')[0];
    const currentDate = "2024-04-23"; // Using the date from the schedule
    
    if (activeTab === "today") {
      filtered = filtered.filter(task => task.date === currentDate);
    } else if (activeTab === "appointments") {
      filtered = filtered.filter(task => task.category === "appointment");
    } else if (activeTab === "tasks") {
      // Show all tasks (appointments + duties + available slots)
      filtered = filtered;
    }
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(task => 
        (task.title && task.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (task.subtitle && task.subtitle.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply status filter
    if (selectedStatus !== "All") {
      filtered = filtered.filter(task => task.status === selectedStatus.toLowerCase());
    }
    
    // Apply sorting
    filtered = sortTasks(filtered);
    
    return filtered;
  };

  // Sort function
  const sortTasks = (tasks) => {
    const sorted = [...tasks];
    switch(sortBy) {
      case "priority":
        const priorityOrder = { high: 0, normal: 1, medium: 2, low: 3 };
        return sorted.sort((a, b) => {
          const priorityA = priorityOrder[a.priority] ?? 4;
          const priorityB = priorityOrder[b.priority] ?? 4;
          return priorityA - priorityB;
        });
      case "time":
        const timeToMinutes = (timeStr) => {
          const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
          if (match) {
            let hours = parseInt(match[1]);
            const minutes = parseInt(match[2]);
            const ampm = match[3].toUpperCase();
            if (ampm === 'PM' && hours !== 12) hours += 12;
            if (ampm === 'AM' && hours === 12) hours = 0;
            return hours * 60 + minutes;
          }
          return 0;
        };
        return sorted.sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));
      case "patient":
        return sorted.sort((a, b) => {
          const nameA = a.patientName || a.title || "";
          const nameB = b.patientName || b.title || "";
          return nameA.localeCompare(nameB);
        });
      default:
        return sorted;
    }
  };

  // Summary Stats
  const summaryStats = {
    totalAppointments: allTaskSchedule.filter(t => t.category === "appointment").length,
    completed: 7,
    inProgress: 1,
    remaining: 4,
    onTimeRate: 98,
    target: ">80%",
    change: "+2 from yesterday"
  };

  const showToast = (message, type = "success") => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleApplyFilters = () => {
    showToast(`Filters applied! View: ${activeTab === "tasks" ? "All Tasks" : activeTab === "today" ? "Today's Tasks" : "Appointments"}, Sort: ${sortBy === "priority" ? "Priority" : sortBy === "time" ? "Time" : "Patient Name"}`, "success");
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'in-progress':
        return <span className="text-xs font-medium px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">IN PROGRESS</span>;
      case 'ready':
        return <span className="text-xs font-medium px-2 py-0.5 bg-green-100 text-green-700 rounded-full">READY</span>;
      case 'scheduled':
        return <span className="text-xs font-medium px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full">SCHEDULED</span>;
      default:
        return null;
    }
  };

  const StatCard = ({ label, value, icon: Icon, color, bgColor }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">{label}</p>
        </div>
        <div className={`p-2 rounded-lg ${bgColor}`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
      </div>
    </div>
  );

  // Task Schedule Card Component
  const TaskScheduleCard = ({ task }) => {
    if (task.type === "available") {
      return (
        <div className="border-l-4 border-green-400 bg-white rounded-r-xl border border-gray-200 p-4 mb-3 hover:shadow-md transition-all">
          <div className="flex items-center gap-3">
            <div className="w-20 flex-shrink-0">
              <span className="text-sm font-semibold text-gray-700">{task.time}</span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-600">{task.title}</p>
            </div>
            <button className="text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">Book</button>
          </div>
        </div>
      );
    }

    if (task.type === "break") {
      return (
        <div className="border-l-4 border-orange-400 bg-orange-50 rounded-r-xl border border-orange-200 p-4 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-20 flex-shrink-0">
              <span className="text-sm font-semibold text-gray-700">{task.time}</span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-orange-700">{task.title}</p>
            </div>
          </div>
        </div>
      );
    }

    if (task.type === "shift-end") {
      return (
        <div className="border-l-4 border-gray-400 bg-gray-50 rounded-r-xl border border-gray-200 p-4 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-20 flex-shrink-0">
              <span className="text-sm font-semibold text-gray-700">{task.time}</span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-700">{task.title}</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="border-l-4 border-blue-400 bg-white rounded-r-xl border border-gray-200 p-4 mb-3 hover:shadow-md transition-all">
        <div className="flex items-start gap-3">
          <div className="w-20 flex-shrink-0">
            <span className="text-sm font-semibold text-gray-700">{task.time}</span>
            {task.arrivedTime && (
              <p className="text-xs text-green-600 mt-1">{task.arrivedTime}</p>
            )}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start flex-wrap gap-2">
              <div>
                <p className="font-bold text-gray-900">{task.title}</p>
                <p className="text-xs font-medium text-gray-500">{task.subtitle}</p>
                <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                {task.priority && (
                  <p className="text-xs text-gray-400 mt-1">PRIORITY: {task.priority.toUpperCase()}</p>
                )}
              </div>
              {getStatusBadge(task.status)}
            </div>
            {task.progress && (
              <div className="mt-2">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>In Progress</span>
                  <span>{task.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${task.progress}%` }}></div>
                </div>
              </div>
            )}
            {task.hasCheckIn && (
              <button className="mt-2 text-xs font-medium text-white bg-blue-600 px-3 py-1 rounded-lg hover:bg-blue-700">
                Check In
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const filteredTasks = getFilteredTasks();

  // Get count display for tabs
  const getTabCount = () => {
    if (activeTab === "today") {
      return allTaskSchedule.filter(t => t.date === "2024-04-23").length;
    }
    return filteredTasks.length;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right">
          <div className={`px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
            toastMessage.type === "success" ? "bg-green-500 text-white" : "bg-blue-500 text-white"
          }`}>
            <CheckCircle className="w-4 h-4" />
            {toastMessage.message}
          </div>
        </div>
      )}

      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SS</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">ServeSync+</h1>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">EMPLOYEE PORTAL</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span>{selectedDate || "Wednesday, April 23, 2026"}</span>
            </div>
            <button className="relative p-2 text-gray-400 hover:text-gray-600">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Sidebar + Main Content */}
      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-65px)] sticky top-[65px]">
          <div className="p-4">
            <div className="mb-6">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">MENU</h2>
              <nav className="space-y-1">
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg text-gray-600 hover:bg-gray-50">
                  <LayoutDashboard className="w-4 h-4" /> My Dashboard
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg text-gray-600 hover:bg-gray-50">
                  <Calendar className="w-4 h-4" /> My Schedule
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg bg-blue-50 text-blue-600 font-medium">
                  <ClipboardList className="w-4 h-4" /> My Tasks
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg text-gray-600 hover:bg-gray-50">
                  <Users className="w-4 h-4" /> My Clients
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg text-gray-600 hover:bg-gray-50">
                  <UserCircle className="w-4 h-4" /> My Profile
                </button>
              </nav>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">AB</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Dr. Abebe Bekele</p>
                    <p className="text-xs text-gray-500">abebe.b@servesync.com</p>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-3 pt-2 border-t border-gray-200">Organization Employee</p>
                <p className="text-xs font-medium text-gray-600">MAIN HOSPITAL BRANCH</p>
                <button className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">My Tasks & Appointments</h1>
            <p className="text-gray-500 text-sm">Manage your daily appointments and clinical duties</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <StatCard label="TOTAL TASKS" value={stats.totalTasks} icon={ClipboardList} color="text-blue-600" bgColor="bg-blue-50" />
            <StatCard label="DUE TODAY" value={stats.dueToday} icon={Clock} color="text-yellow-600" bgColor="bg-yellow-50" />
            <StatCard label="COMPLETED" value={stats.completed} icon={CheckCircle} color="text-green-600" bgColor="bg-green-50" />
            <StatCard label="HIGH PRIORITY" value={stats.highPriority} icon={AlertCircle} color="text-red-600" bgColor="bg-red-50" />
          </div>

          {/* Search Input */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search appointments or tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Tabs and Filter Row */}
          <div className="flex flex-wrap justify-between items-center mb-6">
            <div className="flex gap-4">
              <button 
                onClick={() => { setActiveTab("tasks"); setSearchTerm(""); }}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${
                  activeTab === "tasks" 
                    ? "bg-blue-600 text-white shadow-md" 
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                All Tasks
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === "tasks" ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"}`}>
                  {allTaskSchedule.length}
                </span>
              </button>
              <button 
                onClick={() => { setActiveTab("today"); setSearchTerm(""); }}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${
                  activeTab === "today" 
                    ? "bg-blue-600 text-white shadow-md" 
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Today
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === "today" ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"}`}>
                  {allTaskSchedule.filter(t => t.date === "2024-04-23").length}
                </span>
              </button>
              <button 
                onClick={() => { setActiveTab("appointments"); setSearchTerm(""); }}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${
                  activeTab === "appointments" 
                    ? "bg-blue-600 text-white shadow-md" 
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Appointments
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === "appointments" ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"}`}>
                  {allTaskSchedule.filter(t => t.category === "appointment").length}
                </span>
              </button>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Sort by:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white"
                >
                  <option value="priority">Priority (Highest)</option>
                  <option value="time">Time (Earliest)</option>
                  <option value="patient">Patient Name (A-Z)</option>
                </select>
              </div>
              <button 
                onClick={handleApplyFilters}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                <Filter className="w-4 h-4" />
                Apply Filters
              </button>
            </div>
          </div>

          {/* Results Info */}
          <div className="mb-3 flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Showing <span className="font-medium text-gray-700">{filteredTasks.length}</span> {filteredTasks.length === 1 ? 'item' : 'items'}
              {activeTab === "today" && " for today"}
              {activeTab === "appointments" && " (appointments only)"}
            </p>
            <p className="text-xs text-gray-400">
              Sorted by: {sortBy === "priority" ? "Priority (Highest first)" : sortBy === "time" ? "Time (Earliest first)" : "Patient Name (A-Z)"}
            </p>
          </div>

          {/* TASK SCHEDULE Section - Filtered */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              TASK SCHEDULE
              {activeTab === "today" && " - TODAY"}
              {activeTab === "appointments" && " - APPOINTMENTS"}
            </h3>
            {filteredTasks.length > 0 ? (
              <div className="space-y-2">
                {filteredTasks.map(task => (
                  <TaskScheduleCard key={task.id} task={task} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No tasks found for the selected filter.
              </div>
            )}
          </div>

          {/* Today's Summary Section */}
          <div className="grid grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{summaryStats.totalAppointments}</p>
              <p className="text-xs text-gray-500">TOTAL APPOINTMENTS</p>
              <p className="text-xs text-green-600 mt-1">{summaryStats.change}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{summaryStats.completed}</p>
              <p className="text-xs text-gray-500">COMPLETED</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">{summaryStats.inProgress}</p>
              <p className="text-xs text-gray-500">IN PROGRESS</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <p className="text-2xl font-bold text-yellow-600">{summaryStats.remaining}</p>
              <p className="text-xs text-gray-500">REMAINING</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-2xl font-bold text-gray-900 text-center">{summaryStats.onTimeRate}%</p>
              <p className="text-xs text-gray-500 text-center">ON-TIME RATE</p>
              <p className="text-xs text-green-600 text-center mt-1">Target: {summaryStats.target}</p>
            </div>
          </div>

          {/* Live Updates Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-800">Today's Summary</p>
                <p className="text-xs text-blue-600">LIVE UPDATES</p>
              </div>
              <Activity className="w-5 h-5 text-blue-500 animate-pulse" />
            </div>
          </div>
        </main>
      </div>

      <style jsx global>{`
        @media print {
          nav, aside, .sticky { display: none !important; }
          main { padding: 20px !important; }
        }
      `}</style>
    </div>
  );
}