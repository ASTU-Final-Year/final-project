"use client";

import { useState, useEffect } from "react";
import { 
  LayoutDashboard, Users, Calendar as CalendarIcon, 
  ClipboardList, FileText, Settings, Bell, 
  Search, Download, Printer, FileSpreadsheet, 
  TrendingUp, TrendingDown, Star, Calendar,
  ChevronLeft, ChevronRight, Filter, X, CheckCircle,
  PieChart, BarChart3, LineChart, RefreshCw,
  Mail, Share2, Eye, FileJson, DollarSign,
  Briefcase, Smile, Activity, Clock, Target,
  UserCheck, Award, BarChart, PieChart as PieChartIcon,
  MoreVertical
} from "lucide-react";

export default function CalendarAnalyticsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [toastMessage, setToastMessage] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedServiceType, setSelectedServiceType] = useState("All Services");
  const [selectedEmployee, setSelectedEmployee] = useState("All Staff");
  const [selectedStatus, setSelectedStatus] = useState("Complete");
  const [dateRange, setDateRange] = useState({ from: "2022-10-01", to: "2022-10-31" });
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showAutomateModal, setShowAutomateModal] = useState(false);
  const [reportType, setReportType] = useState("Weekly Performance Summary");
  const [frequency, setFrequency] = useState("Weekly");
  const itemsPerPage = 4;

  // Stats data
  const stats = {
    totalRevenue: 124500,
    totalAppointments: 1248,
    avgSatisfaction: 4.8,
    completionRate: 94
  };

  // Top Services by Revenue
  const topServices = [
    { name: "General Consultation", amount: 46000, percentage: 38 },
    { name: "Dental X-Ray", amount: 32500, percentage: 27 },
    { name: "Blood Analysis", amount: 25000, percentage: 21 },
    { name: "Vaccinations", amount: 16000, percentage: 14 },
  ];

  // Top Employees by Completion
  const topEmployees = [
    { name: "Dr. Azizul Talibulla", score: 90, color: "bg-green-500" },
    { name: "Dr. Salim Kures", score: 94, color: "bg-blue-500" },
    { name: "Dr. Hossain BBS", score: 91, color: "bg-yellow-500" },
  ];

  // Year-over-Year Comparison Data
  const yearlyComparison = [
    { month: "September", revenue2023: 26200, revenue2024: 112250, growth: "+14.5", trend: "up" },
    { month: "October", revenue2023: 102100, revenue2024: 124250, growth: "-21.5", trend: "down" },
  ];

  // Revenue data for chart
  const revenueData = {
    2023: [31200, 45800, 52300, 58700, 62100, 69800, 74500, 81200, 26200, 102100, 108200, 115000],
    2024: [32500, 47800, 54800, 61200, 65800, 73200, 78900, 85600, 112250, 124250, 131200, 140500]
  };

  // Appointments by Status
  const appointmentStatus = [
    { status: "Completed", percentage: 70, color: "#10b981", count: 874 },
    { status: "Rescheduled", percentage: 20, color: "#f59e0b", count: 250 },
    { status: "Canceled", percentage: 10, color: "#ef4444", count: 124 }
  ];

  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

  const showToast = (message, type = "success") => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Export Functions
  const exportAsPDF = () => {
    window.print();
    showToast("PDF export initiated!", "success");
  };

  const exportAsCSV = () => {
    const excelData = [
      ["Report Type", "Value"],
      ["Total Revenue", `${stats.totalRevenue.toLocaleString()} ETB`],
      ["Total Appointments", stats.totalAppointments],
      ["Avg. Satisfaction", stats.avgSatisfaction],
      ["Completion Rate", `${stats.completionRate}%`],
      [],
      ["Top Services by Revenue"],
      ["Service Type", "Amount (ETB)"],
      ...topServices.map(s => [s.name, `${s.amount.toLocaleString()} ETB`]),
      [],
      ["Top Employees by Completion"],
      ["Employee Name", "Completion Score"],
      ...topEmployees.map(e => [e.name, `${e.score}%`])
    ];
    
    const csvContent = excelData.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `calendar_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("CSV Report exported!", "success");
  };

  const scheduleAutomatedReport = () => {
    showToast(`Report "${reportType}" scheduled ${frequency}ly!`, "success");
    setShowAutomateModal(false);
  };

  // Pagination
  const totalPages = Math.ceil(topServices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedServices = topServices.slice(startIndex, startIndex + itemsPerPage);

  // Stat Card Component
  const StatCard = ({ label, value, icon: Icon, color }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 rounded-lg ${color} bg-opacity-10`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">{label}</p>
    </div>
  );

  // Tab Component
  const TabButton = ({ name, label, isActive, onClick }) => (
    <button
      onClick={() => onClick(name)}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
        isActive 
          ? 'bg-blue-600 text-white shadow-md' 
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {label}
    </button>
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
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">ADMIN CONSOLE</span>
          </div>
          
          {/* Search reports */}
          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search reports..."
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
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
        {/* Sidebar Navigation - CHANGED: Reports is now active instead of Calendar */}
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
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg text-gray-600 hover:bg-gray-50">
                  <CalendarIcon className="w-4 h-4" /> Appointments
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg text-gray-600 hover:bg-gray-50">
                  <CalendarIcon className="w-4 h-4" /> Calendar
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg bg-blue-50 text-blue-600 font-medium">
                  <FileText className="w-4 h-4" /> Reports
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg text-gray-600 hover:bg-gray-50">
                  <Settings className="w-4 h-4" /> Settings
                </button>
              </nav>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          {/* Header with Tabs */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">Calendars</h1>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 text-sm text-gray-600 bg-gray-100 rounded-lg">Overview</button>
              </div>
            </div>
            
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
              <TabButton name="overview" label="Overview" isActive={activeTab === "overview"} onClick={setActiveTab} />
              <TabButton name="revenue" label="Revenue" isActive={activeTab === "revenue"} onClick={setActiveTab} />
              <TabButton name="appointments" label="Appointments" isActive={activeTab === "appointments"} onClick={setActiveTab} />
              <TabButton name="employees" label="Employees" isActive={activeTab === "employees"} onClick={setActiveTab} />
              <TabButton name="services" label="Services" isActive={activeTab === "services"} onClick={setActiveTab} />
              <TabButton name="satisfaction" label="Satisfaction" isActive={activeTab === "satisfaction"} onClick={setActiveTab} />
              <TabButton name="performance" label="Performance" isActive={activeTab === "performance"} onClick={setActiveTab} />
              <TabButton name="custom" label="Custom" isActive={activeTab === "custom"} onClick={setActiveTab} />
            </div>
          </div>

          {/* Revenue and Appointment Row */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Total Revenue Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
              <p className="text-3xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-gray-500 uppercase tracking-wider mt-1">TOTAL REVENUE</p>
              <div className="mt-3 flex items-center justify-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Service Type:</span>
                  <select className="px-2 py-1 text-xs border rounded">
                    <option>S</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Revenue:</span>
                  <select className="px-2 py-1 text-xs border rounded">
                    <option>10/0</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{stats.avgSatisfaction} / 5.0</p>
                <p className="text-xs text-gray-500">AVG. SATISFACTION</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                <Target className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{stats.completionRate}%</p>
                <p className="text-xs text-gray-500">COMPLETION RATE</p>
              </div>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Service Type:</span>
                <select value={selectedServiceType} onChange={(e) => setSelectedServiceType(e.target.value)} className="px-3 py-1.5 text-sm border rounded-lg">
                  <option>All Services</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Employee:</span>
                <select value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)} className="px-3 py-1.5 text-sm border rounded-lg">
                  <option>All Staff</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Status:</span>
                <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="px-3 py-1.5 text-sm border rounded-lg">
                  <option>Complete</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <input type="date" value={dateRange.from} onChange={(e) => setDateRange({...dateRange, from: e.target.value})} className="px-2 py-1.5 text-sm border rounded-lg" />
                <span>-</span>
                <input type="date" value={dateRange.to} onChange={(e) => setDateRange({...dateRange, to: e.target.value})} className="px-2 py-1.5 text-sm border rounded-lg" />
              </div>
              <button onClick={() => showToast("Filters applied!", "success")} className="px-4 py-1.5 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800">
                Apply Filters
              </button>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* LEFT COLUMN */}
            <div className="space-y-6">
              {/* Revenue Trend with proper graph sizing */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Revenue Trend</h3>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 text-sm text-blue-600 bg-blue-50 rounded">Current Year</button>
                    <button className="px-3 py-1 text-sm text-gray-500 hover:bg-gray-100 rounded">Last Year</button>
                  </div>
                </div>
                
                {/* Graph - Properly sized */}
                <div className="relative h-80 w-full">
                  {/* Y-axis labels */}
                  <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-gray-400">
                    <span>1000</span>
                    <span>800</span>
                    <span>600</span>
                    <span>400</span>
                    <span>200</span>
                    <span>0</span>
                  </div>
                  
                  {/* Graph bars */}
                  <div className="ml-14 h-full flex items-end gap-2">
                    {months.map((month, i) => {
                      const height2024 = Math.min((revenueData[2024][i] / 140500) * 100, 100);
                      const height2023 = Math.min((revenueData[2023][i] / 140500) * 100, 100);
                      return (
                        <div key={month} className="flex-1 flex flex-col items-center gap-1">
                          <div className="w-full flex flex-col gap-1 items-center">
                            <div 
                              className="w-6 bg-blue-500 rounded-t hover:bg-blue-600 transition-all cursor-pointer"
                              style={{ height: `${height2024 * 0.7}px` }}
                              title={`2024: ${revenueData[2024][i].toLocaleString()} ETB`}
                            ></div>
                            <div 
                              className="w-6 bg-green-400 rounded-t hover:bg-green-500 transition-all cursor-pointer"
                              style={{ height: `${height2023 * 0.7}px` }}
                              title={`2023: ${revenueData[2023][i].toLocaleString()} ETB`}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500 mt-2 rotate-45 origin-left">{month}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="flex justify-center gap-4 mt-4 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded"></div><span className="text-xs">2024</span></div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-400 rounded"></div><span className="text-xs">2023</span></div>
                </div>
              </div>

              {/* Top Services by Revenue with Pagination */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Top Services by Revenue</h3>
                <div className="space-y-3">
                  {paginatedServices.map((service, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">{service.name}</span>
                      <span className="text-sm font-semibold text-gray-900">{service.amount.toLocaleString()} ETB</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500">Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, topServices.length)} of {topServices.length}</p>
                  <div className="flex gap-2">
                    <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1} className="px-2 py-1 text-xs border rounded disabled:opacity-50">Previous</button>
                    <span className="text-xs text-gray-500">Page {currentPage} of {totalPages}</span>
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages} className="px-2 py-1 text-xs border rounded disabled:opacity-50">Next</button>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
              {/* Appointments by Status */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Appointments by Status</h3>
                <div className="text-center mb-4">
                  <p className="text-3xl font-bold text-gray-900">{stats.totalAppointments.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Total</p>
                </div>
                <div className="space-y-3">
                  {appointmentStatus.map((item, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700">{item.status}</span>
                        <span className="font-medium text-gray-900">{item.percentage}% ({item.count})</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="h-2 rounded-full" style={{ width: `${item.percentage}%`, backgroundColor: item.color }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Employees by Completion */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Top Employees by Completion</h3>
                <div className="space-y-4">
                  {topEmployees.map((emp, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-800">{emp.name}</span>
                        <span className="text-sm font-semibold text-gray-900">{emp.score}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className={`${emp.color} h-2 rounded-full`} style={{ width: `${emp.score}%` }}></div>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Completed: {emp.score}%</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Year-over-Year Comparison Table */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Year-over-Year Comparison</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 font-medium text-gray-500">Month</th>
                    <th className="text-right py-2 font-medium text-gray-500">Revenue 2023</th>
                    <th className="text-right py-2 font-medium text-gray-500">Revenue 2024</th>
                    <th className="text-right py-2 font-medium text-gray-500">YoY Growth</th>
                    <th className="text-center py-2 font-medium text-gray-500">Trend</th>
                   </tr>
                </thead>
                <tbody>
                  {yearlyComparison.map((item, idx) => (
                    <tr key={idx} className="border-b border-gray-100">
                      <td className="py-2 font-medium text-gray-700">{item.month}</td>
                      <td className="py-2 text-right text-gray-600">{item.revenue2023.toLocaleString()} ETB</td>
                      <td className="py-2 text-right text-blue-600 font-medium">{item.revenue2024.toLocaleString()} ETB</td>
                      <td className={`py-2 text-right ${item.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>{item.growth}%</td>
                      <td className="py-2 text-center">{item.trend === 'up' ? '↗️' : '↘️'}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td className="py-2 font-semibold text-gray-700">Total Q3</td>
                    <td className="py-2 text-right font-semibold text-gray-700">200,600 ETB</td>
                    <td className="py-2 text-right font-semibold text-blue-600">327,000 ETB</td>
                    <td className="py-2 text-right font-semibold text-red-600">-12.1%</td>
                    <td className="py-2 text-center">↘️</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Quick Export Options and Automate Reports */}
          <div className="grid grid-cols-2 gap-6">
            {/* Quick Export Options */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Export Options</h3>
              <div className="flex flex-wrap gap-3">
                <button onClick={exportAsPDF} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                  <Printer className="w-4 h-4" /> PDF Document
                </button>
                <button onClick={exportAsCSV} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                  <FileSpreadsheet className="w-4 h-4" /> CSV Report
                </button>
              </div>
            </div>

            {/* Automate Reports */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Automate Reports</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Report Type:</label>
                  <select value={reportType} onChange={(e) => setReportType(e.target.value)} className="w-full px-3 py-2 text-sm border rounded-lg">
                    <option>Weekly Performance Summary</option>
                    <option>Monthly Revenue Report</option>
                    <option>Employee Performance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Frequency:</label>
                  <select value={frequency} onChange={(e) => setFrequency(e.target.value)} className="w-full px-3 py-2 text-sm border rounded-lg">
                    <option>Weekly</option>
                    <option>Monthly</option>
                    <option>Daily</option>
                  </select>
                </div>
                <button onClick={scheduleAutomatedReport} className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Schedule Report
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

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