"use client";

import { useState, useEffect } from "react";
import { 
  LayoutDashboard, Calendar, ClipboardList, 
  Users, UserCircle, Bell, 
  Search, CheckCircle, Clock, AlertCircle,
  LogOut, Filter, ChevronRight, Settings, HelpCircle,
  Lock, MoreVertical, Utensils, Briefcase, Stethoscope, HeartPulse,
  ChevronDown, ArrowUpDown, TrendingUp, TrendingDown, X,
  UserCheck, UserX, Eye, Edit3, Trash2
} from "lucide-react";

export default function EmployeeDashboardPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all tasks");
  const [sortBy, setSortBy] = useState("priority");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [checkInData, setCheckInData] = useState({ notes: "", status: "on-time" });
  const [filterStatus, setFilterStatus] = useState("all");
  const [toastMessage, setToastMessage] = useState(null);

  // Summary Stats data - Dynamic
  const [stats, setStats] = useState({
    totalTasks: 12,
    dueToday: 5,
    completed: 3,
    highPriority: 2
  });

  // Sort options
  const sortOptions = [
    { value: "priority", label: "Priority (Highest)", icon: TrendingUp },
    { value: "priority-low", label: "Priority (Lowest)", icon: TrendingDown },
    { value: "time-asc", label: "Time (Earliest)", icon: Clock },
    { value: "time-desc", label: "Time (Latest)", icon: Clock },
    { value: "name-asc", label: "Name (A-Z)", icon: ArrowUpDown },
    { value: "name-desc", label: "Name (Z-A)", icon: ArrowUpDown },
  ];

  // Filter options
  const filterOptions = [
    { value: "all", label: "All Tasks" },
    { value: "in-progress", label: "In Progress" },
    { value: "scheduled", label: "Scheduled" },
    { value: "ready", label: "Ready" },
    { value: "locked", label: "Locked" },
  ];

  const getSortLabel = () => {
    const option = sortOptions.find(opt => opt.value === sortBy);
    return option ? option.label : "Priority (Highest)";
  };

  const getFilterLabel = () => {
    const option = filterOptions.find(opt => opt.value === filterStatus);
    return option ? option.label : "All Tasks";
  };

  const [taskSchedule, setTaskSchedule] = useState([
    { id: 1, time: "8:00 AM", title: "Available Slot", type: "dotted", category: "available" },
    { 
      id: 2, time: "9:00 AM", title: "Sarah Johnson", subtitle: "PATIENT VISIT", 
      desc: "Post-operative consultation • Room 302", type: "card", status: "in-progress", 
      progress: 65, icon: Stethoscope, iconBg: "bg-blue-50", iconColor: "text-blue-600",
      priority: "high", name: "Sarah Johnson"
    },
    { 
      id: 3, time: "10:30 AM", title: "Tekle Wondimu", subtitle: "READY", 
      desc: "Diagnostic Review • Lab A", type: "card", arrival: "Arrived 10:15 AM", 
      priority: "normal", icon: HeartPulse, iconBg: "bg-white border border-gray-100", iconColor: "text-gray-400",
      name: "Tekle Wondimu", status: "ready"
    },
    { 
      id: 4, time: "11:30 AM", title: "Complete Patient Records", subtitle: "CLINICAL DUTY", 
      desc: "Administrative updates for morning sessions", type: "card", isLocked: true, 
      variant: "blue-tint", icon: Briefcase, iconBg: "bg-blue-100", iconColor: "text-blue-700",
      priority: "medium", name: "Complete Patient Records", status: "locked"
    },
    { id: 5, time: "12:00 PM", title: "LUNCH BREAK", type: "divider", category: "break" },
    { 
      id: 6, time: "1:00 PM", title: "Selam Tesfaye", subtitle: "SCHEDULED", 
      desc: "Immunization Protocol - Pediatric Wing", type: "card", hasButton: "CHECK IN", 
      icon: Stethoscope, iconBg: "bg-blue-50", iconColor: "text-blue-600",
      priority: "medium", name: "Selam Tesfaye", status: "scheduled"
    },
    { id: 7, time: "2:00 PM", title: "Available Slot", type: "dotted", category: "available" },
    { 
      id: 8, time: "3:00 PM", title: "Abebe Kebede", subtitle: "SCHEDULED", 
      desc: "Mobility Assessment • Therapy Room 2", type: "card", hasMenu: true, 
      icon: Stethoscope, iconBg: "bg-blue-50", iconColor: "text-blue-600",
      priority: "high", name: "Abebe Kebede", status: "scheduled"
    },
    { id: 9, time: "4:00 PM", title: "Available Slot", type: "dotted", category: "available" },
    { id: 10, time: "5:00 PM", title: "SHIFT END", type: "text-only" },
  ]);

  const showToast = (message, type = "success") => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Update stats dynamically
  const updateStats = () => {
    const total = taskSchedule.filter(t => t.type === "card").length;
    const dueToday = taskSchedule.filter(t => t.type === "card" && t.status !== "completed").length;
    const completed = taskSchedule.filter(t => t.status === "completed").length;
    const highPriority = taskSchedule.filter(t => t.priority === "high").length;
    
    setStats({
      totalTasks: total,
      dueToday: dueToday,
      completed: completed,
      highPriority: highPriority
    });
  };

  // Handle Check In
  const handleCheckIn = (task) => {
    setSelectedTask(task);
    setCheckInData({ notes: "", status: "on-time" });
    setShowCheckInModal(true);
  };

  const submitCheckIn = () => {
    if (selectedTask) {
      const updatedTasks = taskSchedule.map(task => 
        task.id === selectedTask.id 
          ? { ...task, status: "in-progress", progress: 10, checkedIn: true, checkInNotes: checkInData.notes }
          : task
      );
      setTaskSchedule(updatedTasks);
      setShowCheckInModal(false);
      updateStats();
      showToast(`✅ Checked in: ${selectedTask.title}`, "success");
    }
  };

  // Handle Lock/Unlock
  const handleToggleLock = (taskId) => {
    const updatedTasks = taskSchedule.map(task => 
      task.id === taskId ? { ...task, isLocked: !task.isLocked } : task
    );
    setTaskSchedule(updatedTasks);
    const task = taskSchedule.find(t => t.id === taskId);
    showToast(task?.isLocked ? "🔓 Task unlocked" : "🔒 Task locked", "info");
  };

  // Sort function
  const sortTasks = (tasks) => {
    const sorted = [...tasks];
    switch(sortBy) {
      case "priority":
        const priorityOrder = { high: 3, medium: 2, normal: 1, low: 1 };
        return sorted.sort((a, b) => (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0));
      case "priority-low":
        const priorityOrderLow = { high: 1, medium: 2, normal: 3, low: 3 };
        return sorted.sort((a, b) => (priorityOrderLow[b.priority] || 0) - (priorityOrderLow[a.priority] || 0));
      case "time-asc":
        return sorted.sort((a, b) => (a.time || "").localeCompare(b.time || ""));
      case "time-desc":
        return sorted.sort((a, b) => (b.time || "").localeCompare(a.time || ""));
      case "name-asc":
        return sorted.sort((a, b) => (a.title || a.name || "").localeCompare(b.title || b.name || ""));
      case "name-desc":
        return sorted.sort((a, b) => (b.title || b.name || "").localeCompare(a.title || a.name || ""));
      default:
        return sorted;
    }
  };

  // Filter by active tab
  const filterByTab = (tasks) => {
    if (activeTab === "today") {
      return tasks.filter(t => t.type === "card" && (
        t.time === "9:00 AM" || t.time === "10:30 AM" || t.time === "11:30 AM" || 
        t.time === "1:00 PM" || t.time === "3:00 PM"
      ));
    } else if (activeTab === "appointments") {
      return tasks.filter(t => t.type === "card" && t.subtitle !== "CLINICAL DUTY");
    }
    return tasks;
  };

  // Filter by status filter
  const filterByStatus = (tasks) => {
    if (filterStatus === "in-progress") {
      return tasks.filter(t => t.status === "in-progress");
    } else if (filterStatus === "scheduled") {
      return tasks.filter(t => t.status === "scheduled");
    } else if (filterStatus === "ready") {
      return tasks.filter(t => t.subtitle === "READY");
    } else if (filterStatus === "locked") {
      return tasks.filter(t => t.isLocked === true);
    }
    return tasks;
  };

  // Filter by search term
  const filterBySearch = (tasks) => {
    if (!searchTerm) return tasks;
    return tasks.filter(t => 
      t.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.desc?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.subtitle?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Get filtered and sorted tasks
  const getFilteredTasks = () => {
    let filtered = taskSchedule.filter(t => t.type === "card");
    filtered = filterByTab(filtered);
    filtered = filterByStatus(filtered);
    filtered = filterBySearch(filtered);
    return sortTasks(filtered);
  };

  const filteredTasks = getFilteredTasks();

  // Update stats on component mount and task changes
  useEffect(() => {
    updateStats();
  }, [taskSchedule]);

  return (
    <div className="min-h-screen bg-slate-50 flex">
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

      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col sticky top-0">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-10">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xl">S</div>
            <div>
              <h1 className="text-blue-600 font-bold text-lg leading-tight">ServeSync+</h1>
              <p className="text-[10px] text-gray-400 tracking-widest font-semibold uppercase">Clinical Dashboard</p>
            </div>
          </div>
          
          <nav className="space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-50 rounded-lg">
              <LayoutDashboard className="w-4 h-4" /> My Dashboard
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-50 rounded-lg">
              <Calendar className="w-4 h-4" /> My Schedule
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold bg-blue-50 text-blue-600 rounded-lg">
              <ClipboardList className="w-4 h-4" /> My Tasks
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-50 rounded-lg">
              <Users className="w-4 h-4" /> My Clients
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-50 rounded-lg">
              <UserCircle className="w-4 h-4" /> My Profile
            </button>
          </nav>
        </div>

        <div className="mt-auto p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 p-2 mb-4">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Abebe" className="w-10 h-10 rounded-full bg-blue-100" alt="avatar" />
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-gray-900 truncate">Dr. Abebe Bekele</p>
              <p className="text-[10px] text-gray-400 truncate">abebe.b@servesync.com</p>
            </div>
          </div>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-500 hover:text-red-600 transition-colors">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8">
        {/* Header Section */}
        <header className="flex items-center justify-between mb-8">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search system..." 
              className="w-full bg-gray-100 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
              <Calendar className="w-4 h-4 text-gray-400" />
              April 23, 2026
            </div>
            <div className="flex items-center gap-4 text-gray-400">
              <Bell className="w-5 h-5 cursor-pointer hover:text-gray-600" />
              <Settings className="w-5 h-5 cursor-pointer hover:text-gray-600" />
              <HelpCircle className="w-5 h-5 cursor-pointer hover:text-gray-600" />
            </div>
            <div className="flex items-center gap-3 border-l pl-6 border-gray-200">
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">Organization Employee</p>
                <p className="text-[10px] text-gray-400 font-bold">MAIN HOSPITAL BRANCH</p>
              </div>
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Abebe" className="w-9 h-9 rounded-lg bg-gray-200" alt="profile" />
            </div>
          </div>
        </header>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">My Tasks & Appointments</h2>
          <p className="text-sm text-gray-500">Manage your daily appointments and clinical duties</p>
        </section>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-6 mb-10">
          {[
            { label: "TOTAL TASKS", value: stats.totalTasks, icon: ClipboardList, color: "text-blue-600" },
            { label: "DUE TODAY", value: stats.dueToday, icon: Calendar, color: "text-blue-500" },
            { label: "COMPLETED", value: stats.completed, icon: CheckCircle, color: "text-green-500" },
            { label: "HIGH PRIORITY", value: stats.highPriority, icon: AlertCircle, color: "text-red-500" },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
              <div>
                <p className="text-[10px] font-bold text-gray-400 tracking-wider mb-1">{stat.label}</p>
                <p className="text-3xl font-black text-gray-900 leading-none">{stat.value}</p>
              </div>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
          ))}
        </div>

        {/* Filters and Tabs - FUNCTIONAL */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex bg-gray-100 p-1 rounded-lg">
            {["All Tasks", "Today", "Appointments"].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`px-6 py-1.5 text-xs font-bold rounded-md transition-all ${
                  activeTab === tab.toLowerCase() ? "bg-white text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="flex items-center gap-2 px-4 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Sort: {getSortLabel()} <ChevronDown className="w-3 h-3" />
              </button>
              {showSortMenu && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value);
                        setShowSortMenu(false);
                        showToast(`Sorted by: ${option.label}`, "info");
                      }}
                      className={`w-full flex items-center gap-2 px-4 py-2 text-xs font-medium transition-colors ${
                        sortBy === option.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <option.icon className="w-3 h-3" />
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                className="flex items-center gap-2 text-xs font-bold text-gray-600 bg-white border border-gray-200 rounded-full px-4 py-1.5 hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-3 h-3" /> Filter: {getFilterLabel()}
              </button>
              {showFilterMenu && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
                  {filterOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setFilterStatus(option.value);
                        setShowFilterMenu(false);
                        showToast(`Filter: ${option.label}`, "info");
                      }}
                      className={`w-full text-left px-4 py-2 text-xs font-medium transition-colors ${
                        filterStatus === option.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mb-6">
            <h3 className="text-xs font-black text-blue-900 tracking-wider">TASK SCHEDULE</h3>
            <p className="text-xs text-gray-500 font-medium">Wednesday, April 23, 2026</p>
        </div>

        {/* Task List - Filtered and Sorted */}
        <div className="space-y-4 mb-12">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((item) => (
              <div key={item.id} className="flex gap-8 group">
                <div className="w-16 flex flex-col items-end pt-1">
                  <span className="text-xs font-bold text-gray-400">{item.time}</span>
                  <div className={`w-2 h-2 rounded-full mt-2 border-2 border-white shadow-sm ${
                    item.status === 'in-progress' ? 'bg-blue-900 animate-pulse' : 
                    item.subtitle === 'READY' ? 'bg-green-500' : 
                    item.isLocked ? 'bg-gray-400' : 'bg-gray-200'
                  }`} />
                </div>

                <div className="flex-1">
                  <div className={`rounded-2xl p-4 flex items-center justify-between border shadow-sm transition-all hover:shadow-md ${
                    item.variant === 'blue-tint' ? 'bg-blue-50/50 border-blue-100' : 'bg-white border-gray-50'
                  }`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${item.iconBg}`}>
                        <item.icon className={`w-5 h-5 ${item.iconColor}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <h4 className="text-[13px] font-black text-gray-900">{item.title}</h4>
                          <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${
                            item.subtitle === 'READY' ? 'bg-green-100 text-green-700' : 
                            item.subtitle === 'CLINICAL DUTY' ? 'bg-blue-100 text-blue-700' : 
                            item.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-blue-600 text-white'
                          }`}>
                            {item.subtitle || (item.status === 'in-progress' ? 'IN PROGRESS' : 'SCHEDULED')}
                          </span>
                          {item.priority === 'high' && (
                            <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-red-100 text-red-700">
                              HIGH PRIORITY
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-500 font-medium">{item.desc}</p>
                        {item.checkedIn && (
                          <p className="text-[9px] text-green-600 font-medium mt-1">✓ Checked in at {new Date().toLocaleTimeString()}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      {item.progress && (
                        <div className="w-48">
                          <div className="flex justify-between mb-1.5">
                            <span className="text-[9px] font-black text-blue-900">{item.progress}% In Progress</span>
                            <span className="text-[8px] font-bold text-gray-400">EST. DURATION: 45M</span>
                          </div>
                          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-blue-900 h-full rounded-full transition-all" style={{ width: `${item.progress}%` }} />
                          </div>
                        </div>
                      )}
                      {item.arrival && (
                        <div className="text-right">
                          <p className="text-[9px] font-black text-gray-800">{item.arrival}</p>
                          <p className="text-[8px] font-bold text-gray-400">PRIORITY: {item.priority?.toUpperCase()}</p>
                        </div>
                      )}
                      
                      {/* Lock Icon - FUNCTIONAL */}
                      {item.isLocked !== undefined && (
                        <button 
                          onClick={() => handleToggleLock(item.id)}
                          className="hover:scale-110 transition-transform"
                          title={item.isLocked ? "Click to unlock" : "Click to lock"}
                        >
                          <Lock className={`w-4 h-4 ${item.isLocked ? 'text-blue-500' : 'text-gray-300'}`} />
                        </button>
                      )}
                      
                      {/* CHECK IN Button - FUNCTIONAL */}
                      {item.hasButton && (
                        <button 
                          onClick={() => handleCheckIn(item)}
                          className="border border-blue-600 text-blue-600 text-[9px] font-black px-4 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
                        >
                          {item.hasButton}
                        </button>
                      )}
                      
                      {item.hasMenu && <MoreVertical className="w-4 h-4 text-gray-300 cursor-pointer hover:text-gray-600" />}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
              <p className="text-gray-500">No tasks found matching your filters</p>
              <button 
                onClick={() => {
                  setSearchTerm("");
                  setFilterStatus("all");
                  setActiveTab("all tasks");
                }}
                className="mt-3 text-blue-600 text-sm font-medium hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Footer Summary Section */}
        <section className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-gray-800">Today's Summary</h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-gray-400 tracking-widest uppercase">Live Updates</span>
            </div>
          </div>
          
          <div className="grid grid-cols-5 gap-8">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter leading-tight">Total<br />Appointments</p>
              <p className="text-3xl font-black text-gray-900">{stats.totalTasks}</p>
              <p className="text-[9px] font-bold text-gray-400">+2 from yesterday</p>
            </div>
            <div className="space-y-3">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Completed</p>
              <p className="text-3xl font-black text-green-500">{stats.completed}</p>
              <div className="w-full bg-gray-100 h-1 rounded-full">
                <div className="bg-green-500 h-full rounded-full" style={{ width: `${(stats.completed / stats.totalTasks) * 100}%` }} />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">In Progress</p>
              <p className="text-3xl font-black text-blue-900">
                {taskSchedule.filter(t => t.status === "in-progress").length}
              </p>
              <p className="text-[9px] font-bold text-gray-400">
                {taskSchedule.find(t => t.status === "in-progress")?.title || "None"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Remaining</p>
              <p className="text-3xl font-black text-gray-300">{stats.dueToday - stats.completed}</p>
              <p className="text-[9px] font-bold text-gray-400">
                Next: {taskSchedule.find(t => t.type === "card" && t.status !== "completed" && t.status !== "in-progress")?.title || "None"}
              </p>
            </div>
            <div className="bg-blue-900 rounded-2xl p-6 text-white text-center">
              <p className="text-[10px] font-bold opacity-60 uppercase tracking-tighter mb-1">On-Time Rate</p>
              <p className="text-3xl font-black mb-1">
                {Math.round((stats.completed / Math.max(stats.dueToday, 1)) * 100)}%
              </p>
              <p className="text-[9px] font-bold opacity-60">Target: {">"}95%</p>
            </div>
          </div>
        </section>
      </main>

      {/* CHECK IN MODAL */}
      {showCheckInModal && selectedTask && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="bg-blue-600 px-6 py-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5" />
                <h2 className="text-xl font-bold">Check In Patient</h2>
              </div>
              <button onClick={() => setShowCheckInModal(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-xs text-gray-500 font-semibold uppercase">Patient Name</p>
                <p className="text-lg font-bold text-gray-900">{selectedTask.title}</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Check In Status</label>
                <select 
                  value={checkInData.status}
                  onChange={(e) => setCheckInData({...checkInData, status: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                >
                  <option value="on-time">On Time</option>
                  <option value="late">Late (5-10 min)</option>
                  <option value="very-late">Very Late (10+ min)</option>
                  <option value="reschedule">Reschedule Requested</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Notes (Optional)</label>
                <textarea 
                  value={checkInData.notes}
                  onChange={(e) => setCheckInData({...checkInData, notes: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Any additional notes about the patient..."
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setShowCheckInModal(false)}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={submitCheckIn}
                  className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                  Confirm Check In
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}