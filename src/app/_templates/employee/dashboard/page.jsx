"use client";

import { useState, useEffect } from "react";
import { 
  LayoutDashboard, Calendar, ClipboardList, 
  Users, UserCircle, Bell, 
  Search, CheckCircle, Clock, AlertCircle,
  Eye, FileText, Video as VideoIcon,
  Camera, LogOut, CircleCheck, CircleAlert, Circle,
  ArrowUpDown
} from "lucide-react";

export default function EmployeeDashboardPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortBy, setSortBy] = useState("priority");
  const [activeTab, setActiveTab] = useState("all");
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
  }, []);

  const stats = {
    totalTasks: 12,
    dueToday: 5,
    completed: 3,
    highPriority: 2
  };

  // All Appointments Data with profile images
  const [allAppointments, setAllAppointments] = useState([
    { 
      id: 1, 
      patient: "Sarah Johnson", 
      time: "09:00 AM", 
      service: "Routine Checkup", 
      room: "Room 302",
      status: "confirmed",
      date: "2024-04-24",
      priority: "high",
      hasViewChart: true,
      profileImage: null,
      initials: "SJ"
    },
    { 
      id: 2, 
      patient: "Tekle Wondimu", 
      time: "10:30 AM", 
      service: "Consultation", 
      room: "Lab A",
      status: "confirmed",
      date: "2024-04-24",
      priority: "medium",
      hasJoinCall: true,
      profileImage: null,
      initials: "TW"
    },
    { 
      id: 3, 
      patient: "Selam Tesfaye", 
      time: "01:45 PM", 
      service: "Follow-up", 
      room: "Room 105",
      status: "in-progress",
      date: "2024-04-24",
      priority: "high",
      hasDetails: true,
      profileImage: null,
      initials: "ST"
    },
    { 
      id: 4, 
      patient: "Abebe Kebede", 
      time: "03:30 PM", 
      service: "Immunization", 
      room: "Room 402",
      status: "pending",
      date: "2024-04-24",
      priority: "low",
      hasNotify: true,
      profileImage: null,
      initials: "AK"
    },
    { 
      id: 5, 
      patient: "Hiwot Alemu", 
      time: "08:00 AM", 
      service: "Radiology Review", 
      status: "scheduled",
      date: "2024-04-25",
      priority: "medium",
      profileImage: null,
      initials: "HA"
    },
    { 
      id: 6, 
      patient: "Solomon Desta", 
      time: "11:15 AM", 
      service: "Cardiac Stress Test", 
      status: "scheduled",
      date: "2024-04-25",
      priority: "high",
      profileImage: null,
      initials: "SD"
    },
    { 
      id: 7, 
      patient: "Tigist Worku", 
      time: "02:00 PM", 
      service: "Post-Op Follow-up", 
      status: "confirmed",
      date: "2024-04-25",
      priority: "medium",
      profileImage: null,
      initials: "TW"
    }
  ]);

  // Handle profile image upload
  const handleImageUpload = (appointmentId, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAllAppointments(prev => prev.map(apt => 
          apt.id === appointmentId 
            ? { ...apt, profileImage: reader.result }
            : apt
        ));
        showToast(`Photo uploaded for ${allAppointments.find(a => a.id === appointmentId)?.patient}`, "success");
      };
      reader.readAsDataURL(file);
    }
  };

  // Sort function
  const sortAppointments = (appointments) => {
    const sorted = [...appointments];
    switch(sortBy) {
      case "priority":
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return sorted.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
      case "date":
        return sorted.sort((a, b) => {
          const dateCompare = a.date.localeCompare(b.date);
          if (dateCompare !== 0) return dateCompare;
          // If same date, sort by time
          const timeA = a.time.replace(/[^0-9:]/g, '');
          const timeB = b.time.replace(/[^0-9:]/g, '');
          return timeA.localeCompare(timeB);
        });
      case "patient":
        return sorted.sort((a, b) => a.patient.localeCompare(b.patient));
      case "status":
        const statusOrder = { confirmed: 0, "in-progress": 1, pending: 2, scheduled: 3 };
        return sorted.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
      default:
        return sorted;
    }
  };

  const getFilteredAppointments = () => {
    let filtered = [...allAppointments];
    
    if (activeTab === "today") {
      const today = new Date().toISOString().split('T')[0];
      filtered = filtered.filter(apt => apt.date === today);
    }
    
    if (selectedStatus !== "All") {
      filtered = filtered.filter(apt => apt.status === selectedStatus.toLowerCase());
    }
    
    if (searchTerm) {
      filtered = filtered.filter(apt => 
        apt.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.service.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply sorting
    filtered = sortAppointments(filtered);
    
    return filtered;
  };

  const getGroupedAppointments = () => {
    let filtered = getFilteredAppointments();
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    
    const todayApps = filtered.filter(apt => apt.date === today);
    const tomorrowApps = filtered.filter(apt => apt.date === tomorrow);
    const otherApps = filtered.filter(apt => apt.date !== today && apt.date !== tomorrow);
    
    return { todayApps, tomorrowApps, otherApps };
  };

  const { todayApps, tomorrowApps, otherApps } = getGroupedAppointments();

  const showToast = (message, type = "success") => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'confirmed':
        return <span className="text-xs font-medium px-2 py-0.5 bg-green-100 text-green-700 rounded-full">CONFIRMED</span>;
      case 'in-progress':
        return <span className="text-xs font-medium px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">IN PROGRESS</span>;
      case 'pending':
        return <span className="text-xs font-medium px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full">PENDING</span>;
      case 'scheduled':
        return <span className="text-xs font-medium px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full">SCHEDULED</span>;
      default:
        return null;
    }
  };

  const getPriorityIcon = (priority) => {
    switch(priority) {
      case 'high':
        return <span className="text-xs font-medium text-red-600">🔥 High</span>;
      case 'medium':
        return <span className="text-xs font-medium text-orange-500">⚡ Medium</span>;
      case 'low':
        return <span className="text-xs font-medium text-gray-500">✓ Low</span>;
      default:
        return null;
    }
  };

  const StatCard = ({ label, value, icon: Icon, color, bgColor }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
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

  // Square Card Component with Profile Image
  const SquareAppointmentCard = ({ appointment }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all w-full">
      <div className="flex justify-end mb-2">
        <label className="cursor-pointer bg-gray-100 p-1.5 rounded-full hover:bg-gray-200 transition-colors">
          <Camera className="w-3.5 h-3.5 text-gray-500" />
          <input 
            type="file" 
            className="hidden" 
            accept="image/*"
            onChange={(e) => handleImageUpload(appointment.id, e)}
          />
        </label>
      </div>
      
      <div className="flex justify-center mb-3">
        {appointment.profileImage ? (
          <img 
            src={appointment.profileImage} 
            alt={appointment.patient}
            className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-xl">
            {appointment.initials}
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-start">
        <p className="font-bold text-gray-900 text-base">{appointment.patient}</p>
        {getPriorityIcon(appointment.priority)}
      </div>
      
      <p className="text-xs text-gray-500 mt-1">{appointment.time} — {appointment.service}</p>
      
      {appointment.room && (
        <p className="text-xs text-gray-400 mt-1 font-medium">{appointment.room}</p>
      )}
      
      <div className="flex justify-center mt-2">
        {getStatusBadge(appointment.status)}
      </div>
      
      <div className="flex justify-center gap-2 mt-3">
        {appointment.hasViewChart && (
          <button className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100">
            View Chart
          </button>
        )}
        {appointment.hasJoinCall && (
          <button className="text-xs font-medium text-white bg-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-700 flex items-center gap-1">
            <VideoIcon className="w-3 h-3" /> Join Call
          </button>
        )}
        {appointment.hasDetails && (
          <button className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100">
            Details
          </button>
        )}
        {appointment.hasNotify && (
          <button className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100">
            Notify
          </button>
        )}
      </div>
    </div>
  );

  // Simple card for tomorrow/other appointments
  const SimpleSquareCard = ({ appointment }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all w-full">
      <div className="flex justify-center mb-3">
        {appointment.profileImage ? (
          <img 
            src={appointment.profileImage} 
            alt={appointment.patient}
            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
            {appointment.initials}
          </div>
        )}
      </div>
      <div className="flex justify-between items-center">
        <p className="font-semibold text-gray-900 text-sm">{appointment.patient}</p>
        {getPriorityIcon(appointment.priority)}
      </div>
      <p className="text-xs text-gray-500 mt-1">{appointment.time} — {appointment.service}</p>
      <div className="flex justify-center mt-2">
        {getStatusBadge(appointment.status)}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right">
          <div className={`px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
            toastMessage.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
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
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">CLINICAL DASHBOARD</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span>{selectedDate || "04/24/2024"}</span>
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
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
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
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold text-xl">AB</span>
                </div>
                <p className="text-sm font-semibold text-gray-900">Dr. Abebe Bekele</p>
                <p className="text-xs text-gray-500">Senior Doctor</p>
                <p className="text-xs text-gray-400 mt-1">Cardiology Department</p>
                <button className="mt-4 w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
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
            <StatCard label="TOTALS TASKS" value={stats.totalTasks} icon={ClipboardList} color="text-blue-600" bgColor="bg-blue-50" />
            <StatCard label="DUE TODAY" value={stats.dueToday} icon={Clock} color="text-yellow-600" bgColor="bg-yellow-50" />
            <StatCard label="COMPLETED" value={stats.completed} icon={CheckCircle} color="text-green-600" bgColor="bg-green-50" />
            <StatCard label="HIGH PRIORITY" value={stats.highPriority} icon={AlertCircle} color="text-red-600" bgColor="bg-red-50" />
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-6 border-b border-gray-200 pb-3">
            <button onClick={() => { setActiveTab("all"); setSelectedStatus("All"); }} className={`px-4 py-2 text-sm font-medium rounded-lg ${activeTab === "all" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}>All Tasks</button>
            <button onClick={() => { setActiveTab("today"); setSelectedStatus("All"); }} className={`px-4 py-2 text-sm font-medium rounded-lg ${activeTab === "today" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}>Today</button>
            <button onClick={() => { setActiveTab("appointments"); setSelectedStatus("All"); }} className={`px-4 py-2 text-sm font-medium rounded-lg ${activeTab === "appointments" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}>Appointments</button>
          </div>

          {/* Filter Bar with Functional Sort By */}
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search appointments or tasks..." 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg" 
                />
              </div>
              
              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Sort by:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white"
                >
                  <option value="priority">Priority (Highest)</option>
                  <option value="date">Date (Earliest)</option>
                  <option value="patient">Patient Name (A-Z)</option>
                  <option value="status">Status</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Status:</span>
                <select 
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white"
                >
                  <option value="All">All ✓</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="in-progress">In Progress</option>
                  <option value="pending">Pending</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <input 
                  type="date" 
                  value={selectedDate} 
                  onChange={(e) => setSelectedDate(e.target.value)} 
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg" 
                />
              </div>
              
              <button 
                onClick={() => showToast("Filters applied!")} 
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <ArrowUpDown className="w-4 h-4" />
                Apply Filters
              </button>
            </div>
          </div>

          {/* ALL APPOINTMENTS Section - SQUARE CARDS */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900">ALL APPOINTMENTS</h3>
                <div className="text-xs text-gray-400">
                  Sorted by: {sortBy === "priority" ? "Priority (Highest)" : sortBy === "date" ? "Date (Earliest)" : sortBy === "patient" ? "Patient Name" : "Status"}
                </div>
              </div>
              
              {/* Today's Appointments - Square Cards Grid */}
              {todayApps.length > 0 && (
                <>
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold text-gray-800">Today's Appointments</h4>
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{todayApps.length} PATIENTS</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                    {todayApps.map(apt => (
                      <SquareAppointmentCard key={apt.id} appointment={apt} />
                    ))}
                  </div>
                </>
              )}

              {/* Tomorrow's Appointments - Square Cards Grid */}
              {tomorrowApps.length > 0 && (
                <>
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold text-gray-800">Tomorrow's Appointments</h4>
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{tomorrowApps.length} PATIENTS</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                    {tomorrowApps.map(apt => (
                      <SimpleSquareCard key={apt.id} appointment={apt} />
                    ))}
                  </div>
                </>
              )}

              {/* April 25 Appointments - Square Cards Grid */}
              {otherApps.length > 0 && (
                <>
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold text-gray-800">April 25 Appointments</h4>
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{otherApps.length} PATIENT</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {otherApps.map(apt => (
                      <SimpleSquareCard key={apt.id} appointment={apt} />
                    ))}
                  </div>
                </>
              )}

              {todayApps.length === 0 && tomorrowApps.length === 0 && otherApps.length === 0 && (
                <div className="text-center py-8 text-gray-500">No appointments found.</div>
              )}
            </div>

            {/* Appointment Summary */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Appointment Summary</h3>
              <p className="text-xs text-gray-500 mb-4">Overview of patient engagement and schedule utilization for the current cycle.</p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">{allAppointments.length}</p>
                  <p className="text-xs text-gray-500">TOTAL APPOINTMENTS</p>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">COMPLETION RATE</span>
                    <span className="font-medium text-gray-900">71%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: "71%" }}></div>
                  </div>
                </div>
              </div>
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