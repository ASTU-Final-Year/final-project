"use client";

import { useState, useEffect } from "react";
import { 
  LayoutDashboard, Users, Calendar as CalendarIcon, 
  ClipboardList, FileText, Settings, PlusCircle, 
  ArrowRight, Bell, Package, FileWarning, 
  Download, Printer, CheckCircle, Clock, 
  AlertCircle, TrendingUp, X, ChevronRight,
  UserPlus, CalendarPlus, Activity, Star,
  Circle, CircleCheck, CircleAlert
} from "lucide-react";

export default function OrganizationDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const [stats, setStats] = useState({
    totals: 156,
    activeEmployees: 12,
    totalServices: 8,
    totalRevenue: 12450
  });

  const [newService, setNewService] = useState({ name: "", price: "", duration: "" });
  const [newAppointment, setNewAppointment] = useState({ service: "", customer: "", time: "" });
  const [newEmployee, setNewEmployee] = useState({ name: "", role: "", email: "" });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const showToast = (message, type = "success") => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // ============ EXPORT FUNCTIONS ============
  const exportAsCSV = () => {
    const statsData = [
      ["Metric", "Value"],
      ["Totals", stats.totals],
      ["Active Employees", stats.activeEmployees],
      ["Total Services", stats.totalServices],
      ["Total Revenue (ETB)", stats.totalRevenue],
    ];
    const csvContent = statsData.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dashboard_stats_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("CSV exported successfully!");
  };

  const exportAsJSON = () => {
    const fullData = {
      exportDate: new Date().toISOString(),
      metrics: stats,
      schedule: todaySchedule,
      topServices: topServices,
      employeePerformance: employeePerformance,
      recentActivity: recentActivity
    };
    const jsonContent = JSON.stringify(fullData, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dashboard_data_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("JSON exported successfully!");
  };

  const exportAsPDF = () => {
    window.print();
    showToast("Print dialog opened - you can save as PDF");
  };

  // ============ DATA STATES ============
  const [todaySchedule, setTodaySchedule] = useState([
    { time: "09:00 AM", service: "Medical Checkup", provider: "Dr. Abebe", patient: "Abebe K.", status: "in-progress" },
    { time: "10:30 AM", service: "Urgent Care", provider: "Service Bay 2", patient: "Mulugeta T.", status: "waiting" },
    { time: "11:45 AM", service: "Dental Checkup", provider: "Dr. Genet", patient: "Sara H.", status: "confirmed" },
  ]);

  const [topServices, setTopServices] = useState([
    { name: "General Checkup", percentage: 42 },
    { name: "Oil Change", percentage: 28 },
    { name: "Consultation", percentage: 15 },
  ]);

  const [employeePerformance, setEmployeePerformance] = useState([
    { name: "Dr. Abebe", score: 98 },
    { name: "Dr. Genet", score: 92 },
    { name: "Mulugeta T.", score: 85 },
  ]);

  const [recentActivity, setRecentActivity] = useState([
    { action: 'New Service "X-Ray Analysis" added', actor: "By Admin", time: "2 hours ago" },
    { action: "Appointment #8234 completed successfully", actor: "Dr. Genet", time: "4 hours ago" },
    { action: "Updated schedule for Dr. Abebe", actor: "HR Manager", time: "6 hours ago" },
  ]);

  // ============ ACTION HANDLERS ============
  const handleAddService = (e) => {
    e.preventDefault();
    const serviceName = newService.name || "New Service";
    setTopServices([...topServices, { name: serviceName, percentage: 10 }]);
    setStats({ ...stats, totalServices: stats.totalServices + 1 });
    setRecentActivity([{ action: `New Service "${serviceName}" added`, actor: "By Admin", time: "Just now" }, ...recentActivity]);
    setShowAddServiceModal(false);
    setNewService({ name: "", price: "", duration: "" });
    showToast(`Service "${serviceName}" added successfully!`);
  };

  const handleScheduleAppointment = (e) => {
    e.preventDefault();
    const newAppt = {
      time: newAppointment.time || "01:00 PM",
      service: newAppointment.service || "New Appointment",
      provider: "Dr. Assigned",
      patient: newAppointment.customer || "New Patient",
      status: "confirmed"
    };
    setTodaySchedule([...todaySchedule, newAppt]);
    setRecentActivity([{ action: `Appointment scheduled for ${newAppt.patient}`, actor: "By Admin", time: "Just now" }, ...recentActivity]);
    setShowScheduleModal(false);
    setNewAppointment({ service: "", customer: "", time: "" });
    showToast("Appointment scheduled successfully!");
  };

  const handleRegisterEmployee = (e) => {
    e.preventDefault();
    const empName = newEmployee.name || "New Employee";
    setEmployeePerformance([...employeePerformance, { name: empName, score: 75 }]);
    setStats({ ...stats, activeEmployees: stats.activeEmployees + 1, totals: stats.totals + 1 });
    setRecentActivity([{ action: `New employee "${empName}" registered`, actor: "By Admin", time: "Just now" }, ...recentActivity]);
    setShowRegisterModal(false);
    setNewEmployee({ name: "", role: "", email: "" });
    showToast(`Employee "${empName}" registered successfully!`);
  };

  const handleGenerateReport = () => {
    exportAsPDF();
    setRecentActivity([{ action: "Monthly report generated", actor: "By Admin", time: "Just now" }, ...recentActivity]);
    showToast("Report generated!");
  };

  const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
            <h2 className="text-xl font-bold">{title}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
          </div>
          <div className="p-5">{children}</div>
        </div>
      </div>
    );
  };
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const weekDates = [22, 23, 24, 25, 26, 27, 28];

  const getStatusIcon = (status) => {
    if (status === 'in-progress') return <CircleAlert className="w-3 h-3 text-yellow-500" />;
    if (status === 'waiting') return <Circle className="w-3 h-3 text-blue-500" />;
    return <CircleCheck className="w-3 h-3 text-green-500" />;
  };

  const getStatusText = (status) => {
    if (status === 'in-progress') return "IN PROGRESS";
    if (status === 'waiting') return "WAITING";
    return "CONFIRMED";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right">
          <div className={`px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${toastMessage.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
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
          
          <div className="flex items-center gap-2">
            {/* Export Stats Button - BLUE BACKGROUND as requested */}
            <div className="relative">
              <button 
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export Stats
                <ChevronRight className={`w-3 h-3 transition-transform ${showExportMenu ? "rotate-90" : ""}`} />
              </button>
              
              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <button onClick={exportAsCSV} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                    <Download className="w-3 h-3" /> CSV File
                  </button>
                  <button onClick={exportAsJSON} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                    <Download className="w-3 h-3" /> JSON File
                  </button>
                  <button onClick={exportAsPDF} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                    <Printer className="w-3 h-3" /> PDF / Print
                  </button>
                </div>
              )}
            </div>

            <button className="relative p-2 text-gray-400 hover:text-gray-600">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2 ml-4 pl-4 border-l border-gray-200">
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
        {/* Sidebar Navigation - PRESERVED EXACT STYLE */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-57px)] sticky top-[57px]">
          <div className="p-4">
            <div className="mb-6">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Dashboard</h2>
              <nav className="space-y-1">
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg bg-blue-50 text-blue-600 font-medium">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                  <ClipboardList className="w-4 h-4" />
                  Services
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                  <Users className="w-4 h-4" />
                  Employees
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                  <CalendarIcon className="w-4 h-4" />
                  Appointments
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                  <CalendarIcon className="w-4 h-4" />
                  Calendar
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                  <FileText className="w-4 h-4" />
                  Reports
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
              </nav>
            </div>
          </div>
        </aside>

        {/* Main Content - EXACT MATCH TO IMAGE */}
        <main className="flex-1 p-6 overflow-auto">
          {/* Welcome Section */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Good Morning Mr. Abebe</h1>
            <p className="text-gray-500 text-sm">Today is Tuesday, October 24th, 2023. Here's what's happening today.</p>
          </div>

          {/* Top Stats Row - EXACT MATCH TO IMAGE */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {/* 12% circle */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col items-center">
              <div className="relative w-20 h-20 mb-2">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="40" cy="40" r="32" fill="none" stroke="#e5e7eb" strokeWidth="6"/>
                  <circle cx="40" cy="40" r="32" fill="none" stroke="#3b82f6" strokeWidth="6" strokeDasharray="201" strokeDashoffset="177"/>
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-gray-900">12%</span>
              </div>
              <p className="text-xs text-gray-500">10 online</p>
              <p className="text-xs font-medium text-gray-700">+2 new</p>
              <p className="text-xs text-gray-500">~8%</p>
            </div>
            
            {/* TOTALS & ACTIVE EMPLOYEES */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">TOTALS</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totals}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider mt-3 mb-1">ACTIVE EMPLOYEES</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeEmployees}</p>
            </div>
            
            {/* TOTAL SERVICES & TOTAL REVENUE */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">TOTAL SERVICES</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalServices}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider mt-3 mb-1">TOTAL REVENUE (ETB)</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalRevenue.toLocaleString()}</p>
            </div>
            
            {/* Empty spacer to match image layout */}
            <div></div>
          </div>

          {/* QUICK MANAGEMENT ACTIONS - 4 BUTTONS */}
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">QUICK MANAGEMENT ACTIONS</h2>
            <div className="grid grid-cols-4 gap-3">
              <button onClick={() => setShowAddServiceModal(true)} className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all">
                <PlusCircle className="w-4 h-4" /> Add New Service
              </button>
              <button onClick={() => setShowScheduleModal(true)} className="flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-all">
                <CalendarPlus className="w-4 h-4" /> Schedule Appointment
              </button>
              <button onClick={() => setShowRegisterModal(true)} className="flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-all">
                <UserPlus className="w-4 h-4" /> Register Employee
              </button>
              <button onClick={handleGenerateReport} className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-all">
                <FileText className="w-4 h-4" /> Generate Report
              </button>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-2 gap-6">
            {/* LEFT COLUMN */}
            <div className="space-y-6">
              {/* Today's Schedule */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Today's Schedule</h3>
                  <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">View Calendar <ArrowRight className="w-3 h-3" /></button>
                </div>
                <div className="space-y-4">
                  {todaySchedule.map((item, idx) => (
                    <div key={idx} className="pb-4 border-b border-gray-100 last:border-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{item.time}</p>
                          <p className="font-medium text-gray-900 mt-1">{item.service} - {item.provider}</p>
                          <p className="text-sm text-gray-500">Patient: {item.patient}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(item.status)}
                          <span className={`text-xs font-medium ${
                            item.status === 'in-progress' ? 'text-yellow-600' :
                            item.status === 'waiting' ? 'text-blue-600' : 'text-green-600'
                          }`}>{getStatusText(item.status)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Capacity Utilization */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Capacity Utilization</h3>
                <div className="flex items-center justify-between">
                  {weekDays.map((day, idx) => (
                    <div key={idx} className="text-center flex-1">
                      <div className="text-sm font-medium text-gray-600 mb-2">{day}</div>
                      <div className="h-20 flex items-end justify-center">
                        <div className={`w-8 rounded-t ${idx === 2 ? 'bg-blue-500 h-[85%]' : idx === 3 ? 'bg-blue-400 h-[78%]' : idx === 4 ? 'bg-blue-300 h-[62%]' : idx === 0 ? 'bg-gray-300 h-[68%]' : idx === 1 ? 'bg-gray-300 h-[72%]' : idx === 5 ? 'bg-gray-300 h-[45%]' : 'bg-gray-300 h-[38%]'}`}></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">{weekDates[idx]}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Employee Performance */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Employee Performance</h3>
                <div className="space-y-4">
                  {employeePerformance.map((emp, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-800">{emp.name}</span>
                        <span className="text-sm font-bold text-gray-900">{emp.score}% Score</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className={`h-2.5 rounded-full ${emp.score >= 90 ? 'bg-green-500' : emp.score >= 80 ? 'bg-blue-500' : 'bg-yellow-500'}`} style={{ width: `${emp.score}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
              {/* Top Services */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Top Services</h3>
                <div className="space-y-4">
                  {topServices.map((service, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="text-gray-800 font-medium">{service.name}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 bg-gray-200 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full" style={{ width: `${service.percentage}%` }}></div></div>
                        <span className="text-sm font-semibold text-gray-900 w-10">{service.percentage}%</span>
                      </div>
                    </div>
                  ))}
                  <div className="text-right pt-2"><span className="text-xs text-gray-400">This Month</span></div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {recentActivity.map((activity, idx) => (
                    <div key={idx} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                        <p className="text-xs text-gray-400 mt-1">{activity.actor} - {activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Critical Alerts */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Critical Alerts</h3>
                <div className="p-3 bg-red-50 rounded-lg border border-red-100 mb-3">
                  <div className="flex items-start gap-3">
                    <Package className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Inventory Low: Surgical Gloves</p>
                      <p className="text-xs text-gray-600 mt-1">Stock level below 15%. Reorder immediately to avoid service disruption.</p>
                      <button className="mt-2 text-xs font-medium text-red-600 hover:text-red-700">Order Now →</button>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                  <div className="flex items-start gap-3">
                    <FileWarning className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">License Renewal Due</p>
                      <p className="text-xs text-gray-600 mt-1">Facility operating license expires in 12 days. Submit documentation.</p>
                      <button className="mt-2 text-xs font-medium text-yellow-600 hover:text-yellow-700">Renew Now →</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <Modal isOpen={showAddServiceModal} onClose={() => setShowAddServiceModal(false)} title="Add New Service">
        <form onSubmit={handleAddService} className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label><input type="text" value={newService.name} onChange={(e) => setNewService({...newService, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Price (ETB)</label><input type="number" value={newService.price} onChange={(e) => setNewService({...newService, price: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label><input type="number" value={newService.duration} onChange={(e) => setNewService({...newService, duration: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div>
          <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add Service</button>
        </form>
      </Modal>

      <Modal isOpen={showScheduleModal} onClose={() => setShowScheduleModal(false)} title="Schedule Appointment">
        <form onSubmit={handleScheduleAppointment} className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label><input type="text" value={newAppointment.customer} onChange={(e) => setNewAppointment({...newAppointment, customer: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Service</label><select value={newAppointment.service} onChange={(e) => setNewAppointment({...newAppointment, service: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg"><option value="">Select Service</option>{topServices.map((s, i) => <option key={i} value={s.name}>{s.name}</option>)}</select></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Time</label><input type="time" value={newAppointment.time} onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div>
          <button type="submit" className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Schedule Appointment</button>
        </form>
      </Modal>

      <Modal isOpen={showRegisterModal} onClose={() => setShowRegisterModal(false)} title="Register Employee">
        <form onSubmit={handleRegisterEmployee} className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label><input type="text" value={newEmployee.name} onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Role</label><select value={newEmployee.role} onChange={(e) => setNewEmployee({...newEmployee, role: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg"><option value="">Select Role</option><option value="Doctor">Doctor</option><option value="Nurse">Nurse</option><option value="Technician">Technician</option></select></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" value={newEmployee.email} onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div>
          <button type="submit" className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Register Employee</button>
        </form>
      </Modal>

      <style jsx global>{`
        @media print { nav, aside, .sticky, button:not(.print\\:block) { display: none !important; } main { padding: 20px !important; } }
      `}</style>
    </div>
  );
}