"use client";

import { useState, useEffect } from "react";
import { 
  LayoutDashboard, Calendar, ClipboardList, 
  Users, UserCircle, Bell, 
  Search, CheckCircle, Clock, AlertCircle,
  Eye, FileText, Video as VideoIcon,
  Camera, LogOut, Settings, HelpCircle,
  TrendingUp, Activity, Award, Target, Flag,
  Phone, Mail, MoreVertical, Star, Heart,
  Calendar as CalendarIcon, MessageCircle, History,
  ChevronLeft, ChevronRight, Filter, X,
  Plus, UserPlus, Download, Printer,
  Droplet, Syringe, Stethoscope, Pill, 
  Activity as ActivityIcon, Smile, ThumbsUp
} from "lucide-react";

export default function EmployeeClientsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [toastMessage, setToastMessage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
  }, []);

  const stats = {
    totalClients: 48,
    weeklyAppointments: 12,
    avgSatisfaction: 4.9,
    recurringPatients: 8
  };

  // Clients Data
  const [allClients, setAllClients] = useState([
    { 
      id: 1,
      name: "Sarah Johnson",
      patientId: "PT-001",
      status: "ACTIVE",
      bloodType: "A+",
      allergies: "None",
      lastVisit: "Apr 16, 2026",
      nextAppointment: "Today 9:00 AM",
      upcomingService: "General Checkup",
      profileImage: null,
      initials: "SJ",
      category: "active"
    },
    { 
      id: 2,
      name: "Tekle Wondimu",
      patientId: "PT-042",
      status: "ACTIVE",
      bloodType: "O+",
      allergies: "Penicillin",
      lastVisit: "Apr 10, 2026",
      nextAppointment: "Today 10:30 AM",
      upcomingService: "Lab Test",
      profileImage: null,
      initials: "TW",
      category: "active"
    },
    { 
      id: 3,
      name: "Selam Tesfaye",
      patientId: "PT-109",
      status: "ACTIVE",
      bloodType: "B+",
      allergies: "None",
      lastVisit: "Apr 05, 2026",
      nextAppointment: "Today 1:00 PM",
      upcomingService: "Dental Checkup",
      profileImage: null,
      initials: "ST",
      category: "active"
    },
    { 
      id: 4,
      name: "Abebe Kebede",
      patientId: "PT-255",
      status: "NEW",
      bloodType: "TBD",
      allergies: "TBD",
      registrationDate: "2 days ago",
      firstAppointment: "Today 3:00 PM",
      upcomingService: "X-Ray",
      profileImage: null,
      initials: "AK",
      category: "new"
    },
    { 
      id: 5,
      name: "Hiwot Alemu",
      patientId: "PT-068",
      status: "ACTIVE",
      bloodType: "A-",
      allergies: "None",
      lastVisit: "Apr 18, 2026",
      nextAppointment: "Tomorrow 9:00 AM",
      upcomingService: "Follow-up",
      profileImage: null,
      initials: "HA",
      category: "active"
    },
    { 
      id: 6,
      name: "Solomon Desta",
      patientId: "PT-122",
      status: "ACTIVE",
      bloodType: "O-",
      allergies: "Latex",
      lastVisit: "Apr 12, 2026",
      nextAppointment: "Tomorrow 11:00 AM",
      upcomingService: "Cardiology",
      profileImage: null,
      initials: "SD",
      category: "active"
    },
    { 
      id: 7,
      name: "Meron Assefa",
      patientId: "PT-178",
      status: "RECURRING",
      bloodType: "AB+",
      allergies: "None",
      lastVisit: "Apr 15, 2026",
      nextAppointment: "Apr 28, 2026",
      upcomingService: "Physical Therapy",
      profileImage: null,
      initials: "MA",
      category: "recurring"
    },
    { 
      id: 8,
      name: "Dawit Mekonnen",
      patientId: "PT-201",
      status: "UPCOMING",
      bloodType: "B-",
      allergies: "Sulfa",
      lastVisit: "Apr 20, 2026",
      nextAppointment: "Apr 29, 2026",
      upcomingService: "Consultation",
      profileImage: null,
      initials: "DM",
      category: "upcoming"
    }
  ]);

  // Filter clients based on selected tab
  const getFilteredClients = () => {
    let filtered = [...allClients];
    
    if (selectedTab === "recent") {
      filtered = filtered.filter(c => c.lastVisit);
    } else if (selectedTab === "upcoming") {
      filtered = filtered.filter(c => c.category === "upcoming");
    } else if (selectedTab === "recurring") {
      filtered = filtered.filter(c => c.category === "recurring");
    } else if (selectedTab === "new") {
      filtered = filtered.filter(c => c.status === "NEW");
    }
    
    if (searchTerm) {
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.patientId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  const filteredClients = getFilteredClients();
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const paginatedClients = filteredClients.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const showToast = (message, type = "success") => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const StatCard = ({ label, value, icon: Icon, color, bgColor }) => (
    <div className={`bg-white rounded-2xl border border-gray-200 p-4 hover:shadow-md transition-all`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">{label}</p>
        </div>
        <div className={`p-2 rounded-xl ${bgColor}`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
      </div>
    </div>
  );

  // Perfect Square Client Card - Exactly like uploaded image
  const SquareClientCard = ({ client }) => (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 hover:shadow-lg transition-all h-full">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {client.profileImage ? (
            <img src={client.profileImage} alt={client.name} className="w-14 h-14 rounded-full object-cover" />
          ) : (
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
              {client.initials}
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-gray-900 text-base">{client.name}</h3>
              <p className="text-xs text-gray-500">ID: {client.patientId}</p>
            </div>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              client.status === "ACTIVE" ? "bg-green-100 text-green-700" :
              client.status === "NEW" ? "bg-blue-100 text-blue-700" :
              client.status === "RECURRING" ? "bg-purple-100 text-purple-700" :
              "bg-yellow-100 text-yellow-700"
            }`}>
              {client.status}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div>
              <p className="text-xs text-gray-400">BLOOD TYPE</p>
              <p className="text-sm font-semibold text-gray-800">{client.bloodType}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">ALLERGIES</p>
              <p className="text-sm font-semibold text-gray-800">{client.allergies}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-1">
            {client.lastVisit && (
              <div>
                <p className="text-xs text-gray-400">LAST VISIT</p>
                <p className="text-sm font-semibold text-gray-800">{client.lastVisit}</p>
              </div>
            )}
            {client.nextAppointment && (
              <div>
                <p className="text-xs text-gray-400">NEXT APPT</p>
                <p className="text-sm font-semibold text-blue-600">{client.nextAppointment}</p>
              </div>
            )}
            {client.registrationDate && (
              <div>
                <p className="text-xs text-gray-400">REGISTRATION</p>
                <p className="text-sm font-semibold text-gray-800">{client.registrationDate}</p>
              </div>
            )}
            {client.firstAppointment && (
              <div>
                <p className="text-xs text-gray-400">FIRST APPT</p>
                <p className="text-sm font-semibold text-blue-600">{client.firstAppointment}</p>
              </div>
            )}
          </div>
          
          {/* Buttons Row */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            <button className="text-xs font-medium text-white bg-blue-600 px-2 py-1 rounded-lg hover:bg-blue-700">
              {client.upcomingService}
            </button>
            <button onClick={() => showToast(`View ${client.name}'s profile`)} className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-lg hover:bg-blue-100">
              View Profile
            </button>
            <button onClick={() => showToast(`Schedule for ${client.name}`)} className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-lg hover:bg-gray-200">
              Schedule
            </button>
            <button onClick={() => showToast(`Message ${client.name}`)} className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-lg hover:bg-gray-200">
              Message
            </button>
            {client.status !== "NEW" && (
              <button onClick={() => showToast(`View ${client.name}'s history`)} className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-lg hover:bg-gray-200">
                History
              </button>
            )}
            {client.status === "NEW" && (
              <>
                <button onClick={() => showToast(`Onboard ${client.name}`)} className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-lg hover:bg-green-100">
                  Onboard
                </button>
                <button className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-lg cursor-not-allowed">
                  No History
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );

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
        <div className="px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SS</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">ServeSync+</h1>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">CLINICAL DASHBOARD</span>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
              <Settings className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
              <HelpCircle className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 ml-2 pl-3 border-l border-gray-200">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">AB</span>
              </div>
              <div className="hidden lg:block">
                <p className="text-xs font-medium text-gray-700">Dr. Abebe Bekele</p>
                <p className="text-xs text-gray-500">Organization Employee</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar + Main Content */}
      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-57px)] sticky top-[57px]">
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
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg text-gray-600 hover:bg-gray-50">
                  <ClipboardList className="w-4 h-4" /> My Tasks
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg bg-blue-50 text-blue-600 font-medium">
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
                    <p className="text-xs text-gray-500">Senior Doctor</p>
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
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">My Clients</h1>
            <p className="text-gray-500 text-sm">View and manage all your assigned patients with real-time care metrics.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <StatCard label="TOTAL CLIENTS" value={stats.totalClients} icon={Users} color="text-blue-600" bgColor="bg-blue-50" />
            <StatCard label="WEEKLY APPOINTMENTS" value={stats.weeklyAppointments} icon={CalendarIcon} color="text-green-600" bgColor="bg-green-50" />
            <StatCard label="AVG SATISFACTION" value={stats.avgSatisfaction} icon={Star} color="text-yellow-600" bgColor="bg-yellow-50" />
            <StatCard label="RECURRING PATIENTS" value={stats.recurringPatients} icon={Heart} color="text-purple-600" bgColor="bg-purple-50" />
          </div>

          {/* Tabs and Search in ONE ROW */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex gap-2 flex-wrap">
              <button 
                onClick={() => { setSelectedTab("all"); setCurrentPage(1); }}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  selectedTab === "all" ? "bg-blue-600 text-white shadow-md" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                All Clients
              </button>
              <button 
                onClick={() => { setSelectedTab("recent"); setCurrentPage(1); }}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  selectedTab === "recent" ? "bg-blue-600 text-white shadow-md" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Recent
              </button>
              <button 
                onClick={() => { setSelectedTab("upcoming"); setCurrentPage(1); }}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  selectedTab === "upcoming" ? "bg-blue-600 text-white shadow-md" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Upcoming
              </button>
              <button 
                onClick={() => { setSelectedTab("recurring"); setCurrentPage(1); }}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  selectedTab === "recurring" ? "bg-blue-600 text-white shadow-md" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Recurring
              </button>
              <button 
                onClick={() => { setSelectedTab("new"); setCurrentPage(1); }}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  selectedTab === "new" ? "bg-blue-600 text-white shadow-md" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                New
              </button>
            </div>
            
            {/* Search Input - Next to Tabs */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg w-64 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Showing results counter */}
          <div className="mb-4 text-sm text-gray-500">
            Showing {paginatedClients.length} of {filteredClients.length} clients
          </div>

          {/* Clients Grid - Square Cards 2 columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {paginatedClients.map(client => (
              <SquareClientCard key={client.id} client={client} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p-1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Today's Appointments & Recent Activity */}
          <div className="grid grid-cols-2 gap-6 mt-8">
            {/* Today's Appointments */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900">Today's Appointments</h3>
                <button className="text-sm text-blue-600 hover:text-blue-700">View All</button>
              </div>
              <div className="space-y-3">
                {[
                  { name: "Sarah Johnson", time: "AM", service: "General Checkup", room: "Room 204" },
                  { name: "Tekle Wondimu", time: "AM", service: "Lab Test", room: "Lab 2" },
                  { name: "Selam Tesfaye", time: "PM", service: "Dental Checkup", room: "Room 108" },
                  { name: "Abebe Kebede", time: "PM", service: "X-Ray", room: "Radiology" }
                ].map((apt, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{apt.name}</p>
                      <p className="text-xs text-gray-500">
                        <span className="font-medium">{apt.time}</span> • {apt.service} • {apt.room}
                      </p>
                    </div>
                    <button className="text-xs text-blue-600">Details</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {[
                  { action: "Sarah Johnson - General Checkup completed", time: "2 hours ago" },
                  { action: "Tekle Wondimu - Lab Test scheduled for tomorrow", time: "Yesterday" },
                  { action: "Selam Tesfaye - Sent medical history message", time: "Yesterday" },
                  { action: "Abebe Kebede - New patient registration complete", time: "2 days ago" }
                ].map((activity, idx) => (
                  <div key={idx} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
                    <div>
                      <p className="text-sm text-gray-700">{activity.action}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
                    </div>
                  </div>
                ))}
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