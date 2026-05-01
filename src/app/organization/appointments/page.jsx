"use client";

import { useState, useEffect } from "react";
import { 
  LayoutDashboard, Users, Calendar as CalendarIcon, 
  ClipboardList, FileText, Settings, Bell, 
  Search, Edit, Eye, Plus, X, CheckCircle,
  Calendar, Clock, DollarSign, User, Briefcase,
  Filter, ChevronDown
} from "lucide-react";

export default function AppointmentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortBy, setSortBy] = useState("date");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [selectedDate, setSelectedDate] = useState("");
  const [toastMessage, setToastMessage] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [newAppointment, setNewAppointment] = useState({
    patient: "",
    service: "",
    doctor: "",
    date: "",
    time: "09:00 AM",
    amount: "",
    type: "",
    duration: "30 min"
  });

  // Predefined time slots for easy selection
  const timeSlots = [
    "08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM",
    "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM",
    "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
    "04:00 PM", "04:30 PM", "05:00 PM"
  ];

  // Set default date to today
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
    setNewAppointment(prev => ({ ...prev, date: today }));
  }, []);

  // Appointment data - with state for dynamic updates
  const [appointments, setAppointments] = useState({
    pending: [
      { 
        id: 1, 
        type: "NEEDS REVIEW", 
        amount: 120.00, 
        patient: "Eleanor Shellstrop", 
        service: "Initial Consultation", 
        doctor: "Dr. Aries", 
        time: "09:15 AM", 
        duration: "45 min",
        category: "Consultation",
        date: "2024-10-15"
      },
      { 
        id: 2, 
        type: "VERIFIED", 
        amount: 340.00, 
        patient: "Tahani Al-Jamil", 
        service: "Wellness Screening", 
        doctor: "Dr. Gupta", 
        time: "10:30 AM", 
        duration: "20 min",
        category: "Screening",
        date: "2024-10-15"
      }
    ],
    confirmed: [
      { 
        id: 3, 
        type: "ACTIVE ROOM 4", 
        amount: 340.00, 
        patient: "Jason Mendoza", 
        service: "Physical Examination", 
        doctor: "Dr. Blake", 
        time: "11:00 AM", 
        duration: "60 min",
        category: "Examination",
        date: "2024-10-16"
      },
      { 
        id: 4, 
        amount: 150.00, 
        patient: "Janet Dell-Trello", 
        service: "Routine Vaccination", 
        doctor: "Dr. Aries", 
        time: "08:00 AM", 
        status: "completed",
        category: "Vaccination",
        date: "2024-10-14"
      }
    ],
    inProgress: [
      { 
        id: 5, 
        type: "ACTIVE ROOM 4", 
        amount: 150.00, 
        patient: "Jason Mendoza", 
        service: "Physical Examination", 
        doctor: "Dr. Blake", 
        time: "Started 09:45", 
        duration: "Elapsed 15m",
        category: "Examination",
        date: "2024-10-16"
      }
    ],
    completed: [
      { 
        id: 6, 
        type: "BILLED", 
        amount: 150.00, 
        patient: "Janet Dell-Trello", 
        service: "Routine Vaccination", 
        doctor: "Dr. Aries", 
        time: "08:00 AM",
        category: "Vaccination",
        date: "2024-10-14"
      },
      { 
        id: 7, 
        type: "FOLLOW-UP", 
        amount: 85.00, 
        patient: "Chidi Anagonye", 
        service: "Lab Results Review", 
        doctor: "Dr. Miller", 
        time: "10:30 AM", 
        duration: "20 min",
        category: "Follow-up",
        date: "2024-10-13"
      }
    ],
    cancelled: [
      { 
        id: 8, 
        type: "NO SHOW", 
        amount: 50.00, 
        patient: "Mindy St. Claire", 
        service: "Urgent Consultation", 
        doctor: "Dr. Miller", 
        time: "08:45 AM", 
        status: "CANCELLED",
        category: "Consultation",
        date: "2024-10-12"
      }
    ]
  });

  // Helper function to get next ID
  const getNextId = () => {
    let maxId = 0;
    Object.values(appointments).forEach(section => {
      section.forEach(apt => {
        if (apt.id > maxId) maxId = apt.id;
      });
    });
    return maxId + 1;
  };

  const sectionCounts = {
    pending: appointments.pending.length,
    confirmed: appointments.confirmed.length,
    inProgress: appointments.inProgress.length,
    completed: appointments.completed.length,
    cancelled: appointments.cancelled.length
  };

  // Filter appointments based on search and filters
  const filterAppointments = (appointmentList) => {
    return appointmentList.filter(apt => {
      const matchesSearch = searchTerm === "" || 
        apt.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (apt.doctor && apt.doctor.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === "All" || apt.category === selectedCategory;
      const matchesDate = (!dateRange.from || apt.date >= dateRange.from) &&
        (!dateRange.to || apt.date <= dateRange.to);
      
      return matchesSearch && matchesCategory && matchesDate;
    });
  };

  const showToast = (message, type = "success") => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddAppointment = (section) => {
    setActiveSection(section);
    setNewAppointment({
      patient: "",
      service: "",
      doctor: "",
      date: new Date().toISOString().split('T')[0],
      time: "09:00 AM",
      amount: "",
      type: "",
      duration: "30 min"
    });
    setShowAddModal(true);
  };

  // Function to actually add the new appointment to the system
  const handleNewAppointment = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!newAppointment.patient || !newAppointment.service || !newAppointment.doctor || !newAppointment.amount) {
      showToast("Please fill all required fields!", "error");
      return;
    }
    
    // Determine target section (always add to PENDING by default for new appointments)
    const targetSection = "pending";
    
    // Create new appointment object
    const newApt = {
      id: getNextId(),
      type: "NEEDS REVIEW",
      amount: parseFloat(newAppointment.amount) || 0,
      patient: newAppointment.patient,
      service: newAppointment.service,
      doctor: newAppointment.doctor,
      time: newAppointment.time,
      duration: newAppointment.duration,
      category: newAppointment.service === "Initial Consultation" ? "Consultation" :
                newAppointment.service === "Wellness Screening" ? "Screening" :
                newAppointment.service === "Physical Examination" ? "Examination" :
                newAppointment.service === "Routine Vaccination" ? "Vaccination" : 
                newAppointment.service === "Lab Results Review" ? "Follow-up" : "Consultation",
      date: newAppointment.date || new Date().toISOString().split('T')[0]
    };
    
    // Add to the pending section
    setAppointments(prev => ({
      ...prev,
      [targetSection]: [...prev[targetSection], newApt]
    }));
    
    showToast(`✅ New appointment for "${newAppointment.patient}" added successfully!`, "success");
    setShowAddModal(false);
    setNewAppointment({
      patient: "",
      service: "",
      doctor: "",
      date: new Date().toISOString().split('T')[0],
      time: "09:00 AM",
      amount: "",
      type: "",
      duration: "30 min"
    });
  };

  // Get filtered appointments for each section
  const getFilteredAppointments = (section) => {
    return filterAppointments(appointments[section] || []);
  };

  // Service options
  const serviceOptions = [
    "Initial Consultation",
    "Wellness Screening", 
    "Physical Examination",
    "Routine Vaccination",
    "Lab Results Review",
    "Dental Checkup",
    "Eye Examination",
    "Blood Test"
  ];

  // Doctor options
  const doctorOptions = [
    "Dr. Aries",
    "Dr. Gupta",
    "Dr. Blake", 
    "Dr. Miller",
    "Dr. Abebe Bekele",
    "Dr. Genet Mekonnen"
  ];

  // Appointment Card Component
  const AppointmentCard = ({ appointment }) => (
    <div className="border border-gray-200 rounded-lg p-3 mb-3 bg-white hover:shadow-md transition-all">
      {appointment.type && (
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-semibold text-gray-500">{appointment.type}</span>
          <span className="text-sm font-bold text-gray-900">${appointment.amount.toFixed(2)}</span>
        </div>
      )}
      {!appointment.type && (
        <div className="flex justify-between items-start mb-2">
          <span className="text-sm font-bold text-gray-900">${appointment.amount.toFixed(2)}</span>
        </div>
      )}
      
      <p className="font-semibold text-gray-900 text-sm">{appointment.patient}</p>
      <p className="text-xs text-gray-600">{appointment.service}</p>
      
      <div className="flex justify-between items-center mt-2">
        <div className="flex items-center gap-2 flex-wrap">
          {appointment.doctor && (
            <span className="text-xs text-gray-500">{appointment.doctor}</span>
          )}
          {appointment.time && (
            <span className="text-xs text-gray-400">{appointment.time}</span>
          )}
          {appointment.duration && (
            <span className="text-xs text-gray-400">{appointment.duration}</span>
          )}
          {appointment.status === "CANCELLED" && (
            <span className="text-xs text-red-500 font-medium">CANCELLED</span>
          )}
        </div>
      </div>
      
      <div className="flex gap-2 mt-3 pt-2 border-t border-gray-100">
        <button className="flex-1 px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors">
          Edit
        </button>
        <button className="flex-1 px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors">
          View
        </button>
      </div>
    </div>
  );

  // Section Component with Add Appointment button BELOW the cards
  const AppointmentSection = ({ title, sectionKey }) => {
    const sectionAppointments = appointments[sectionKey] || [];
    const filteredApps = getFilteredAppointments(sectionKey);
    const displayCount = sectionAppointments.length;
    
    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{displayCount}</span>
          </div>
        </div>
        
        {/* Appointment Cards */}
        <div className="space-y-3">
          {filteredApps.map((appointment) => (
            <AppointmentCard key={appointment.id} appointment={appointment} />
          ))}
          {filteredApps.length === 0 && (
            <div className="text-center py-6 text-gray-400 text-sm">
              No appointments found
            </div>
          )}
        </div>
        
        {/* Add appointment button - BELOW the cards */}
        <button 
          onClick={() => handleAddAppointment(title)}
          className="w-full mt-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add appointment
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right">
          <div className={`px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
            toastMessage.type === "success" ? "bg-green-500 text-white" : 
            toastMessage.type === "error" ? "bg-red-500 text-white" : "bg-blue-500 text-white"
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
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">ADMIN CONSOLE</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleAddAppointment("New")}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                New Appointment
              </button>
              <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span>{selectedDate || "Select date"}</span>
              </div>
            </div>

            <button className="relative p-2 text-gray-400 hover:text-gray-600">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2 ml-2 pl-4 border-l border-gray-200">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">AM</span>
              </div>
              <span className="text-sm font-medium text-gray-700">Mr. Abebe</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar + Main Content */}
      <div className="flex">
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-57px)] sticky top-[57px]">
          <div className="p-4">
            <div className="mb-6">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Menu</h2>
              <nav className="space-y-1">
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg text-gray-600 hover:bg-gray-50">
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg text-gray-600 hover:bg-gray-50">
                  <ClipboardList className="w-4 h-4" /> Services
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg text-gray-600 hover:bg-gray-50">
                  <Users className="w-4 h-4" /> Employees
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg bg-blue-50 text-blue-600 font-medium">
                  <CalendarIcon className="w-4 h-4" /> Appointments
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg text-gray-600 hover:bg-gray-50">
                  <CalendarIcon className="w-4 h-4" /> Calendar
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg text-gray-600 hover:bg-gray-50">
                  <FileText className="w-4 h-4" /> Reports
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg text-gray-600 hover:bg-gray-50">
                  <Settings className="w-4 h-4" /> Settings
                </button>
              </nav>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs font-semibold text-gray-600">Organization Admin</p>
                <p className="text-xs text-gray-500 mt-1">MAIN HOSPITAL BRANCH</p>
                <button className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                  Logout
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
            <p className="text-gray-500 text-sm">Manage daily clinical traffic and provider availability.</p>
          </div>

          {/* Search and Filter Bar */}
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by service name or code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white"
              >
                <option value="All">Category</option>
                <option value="All">All Categories</option>
                <option value="Consultation">Consultation</option>
                <option value="Screening">Screening</option>
                <option value="Examination">Examination</option>
                <option value="Vaccination">Vaccination</option>
                <option value="Follow-up">Follow-up</option>
              </select>
              
              <select 
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white"
              >
                <option value="All">Status</option>
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white"
              >
                <option value="date">Sort By</option>
                <option value="date">Date</option>
                <option value="patient">Patient Name</option>
                <option value="doctor">Doctor</option>
                <option value="amount">Amount</option>
              </select>
              
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Status Counts Row */}
          <div className="flex flex-wrap gap-6 mb-6 pb-3 border-b border-gray-200">
            <div><span className="font-semibold text-gray-900">PENDING</span> <span className="text-gray-500 ml-1">{sectionCounts.pending}</span></div>
            <div><span className="font-semibold text-gray-900">CONFIRMED</span> <span className="text-gray-500 ml-1">{sectionCounts.confirmed}</span></div>
            <div><span className="font-semibold text-gray-900">IN PROGRESS</span> <span className="text-gray-500 ml-1">{sectionCounts.inProgress}</span></div>
            <div><span className="font-semibold text-gray-900">COMPLETED</span> <span className="text-gray-500 ml-1">{sectionCounts.completed}</span></div>
            <div><span className="font-semibold text-gray-900">CANCELLED</span> <span className="text-gray-500 ml-1">{sectionCounts.cancelled}</span></div>
          </div>

          {/* Appointments Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AppointmentSection title="PENDING" sectionKey="pending" />
            <AppointmentSection title="CONFIRMED" sectionKey="confirmed" />
            <AppointmentSection title="IN PROGRESS" sectionKey="inProgress" />
            <AppointmentSection title="COMPLETED" sectionKey="completed" />
            <AppointmentSection title="CANCELLED" sectionKey="cancelled" />
          </div>
        </main>
      </div>

      {/* Add Appointment Modal - EASY TIME SELECTION */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-xl font-bold">Add New Appointment</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleNewAppointment} className="p-5 space-y-4">
              {/* Patient Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name *</label>
                <input 
                  type="text" 
                  required
                  value={newAppointment.patient}
                  onChange={(e) => setNewAppointment({...newAppointment, patient: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                  placeholder="Enter patient name" 
                />
              </div>
              
              {/* Service Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service *</label>
                <select 
                  required
                  value={newAppointment.service}
                  onChange={(e) => setNewAppointment({...newAppointment, service: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Service</option>
                  {serviceOptions.map(service => (
                    <option key={service} value={service}>{service}</option>
                  ))}
                </select>
              </div>
              
              {/* Doctor Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Doctor *</label>
                <select 
                  required
                  value={newAppointment.doctor}
                  onChange={(e) => setNewAppointment({...newAppointment, doctor: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Doctor</option>
                  {doctorOptions.map(doctor => (
                    <option key={doctor} value={doctor}>{doctor}</option>
                  ))}
                </select>
              </div>
              
              {/* Date and Time - Easy Selection */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                  <input 
                    type="date" 
                    required
                    value={newAppointment.date}
                    onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
                  <select
                    required
                    value={newAppointment.time}
                    onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {timeSlots.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Amount and Duration */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($) *</label>
                  <input 
                    type="number" 
                    required
                    step="0.01"
                    value={newAppointment.amount}
                    onChange={(e) => setNewAppointment({...newAppointment, amount: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                    placeholder="0.00" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                  <select 
                    value={newAppointment.duration}
                    onChange={(e) => setNewAppointment({...newAppointment, duration: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="15 min">15 min</option>
                    <option value="30 min">30 min</option>
                    <option value="45 min">45 min</option>
                    <option value="60 min">60 min</option>
                  </select>
                </div>
              </div>
              
              <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Schedule Appointment
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          nav, aside, .sticky, button:not(.print\\:block) {
            display: none !important;
          }
          main {
            padding: 20px !important;
          }
        }
      `}</style>
    </div>
  );
}