"use client";

import { useState } from "react";
import { 
  LayoutDashboard, Calendar, ClipboardList, 
  Users, UserCircle, Bell, Search, Settings, 
  HelpCircle, MoreVertical, CheckCircle, 
  Clock, X, LogOut, ChevronDown, 
  Play, Pause, Phone, FileText, Check, Eye, History,
  ArrowUpDown, TrendingUp, TrendingDown, Filter,
  Edit2, Trash2, Plus, Save, AlertCircle
} from "lucide-react";

export default function MyTasksDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All Tasks");
  const [toastMessage, setToastMessage] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [sortBy, setSortBy] = useState("priority");
  const [sortOrder, setSortOrder] = useState("desc");
  const [modalMode, setModalMode] = useState("view"); // 'view', 'edit', 'add'
  const [editingTask, setEditingTask] = useState({
    name: "",
    sub: "",
    time: "",
    group: "",
    priority: "medium"
  });

  // Stats Data - Dynamic
  const [stats, setStats] = useState({
    totalTasks: 16,
    dueToday: 6,
    completed: 5,
    highPriority: 3
  });

  // Completed Tasks History
  const [completedHistory, setCompletedHistory] = useState([
    { id: 1, title: "Routine Checkup — Michael O.", time: "Completed at 08:30 AM", date: "2026-04-23", duration: "30 min", doctor: "Dr. Abebe" },
    { id: 2, title: "Morning Ward Rounds", time: "Completed at 08:15 AM", date: "2026-04-23", duration: "45 min", doctor: "Dr. Sarah" },
    { id: 3, title: "Shift Handover Meeting", time: "Completed at 08:00 AM", date: "2026-04-22", duration: "20 min", doctor: "Dr. Tekle" },
    { id: 4, title: "Patient Consultation — Tigist W.", time: "Completed at 03:00 PM", date: "2026-04-22", duration: "60 min", doctor: "Dr. Abebe" },
    { id: 5, title: "Lab Results Review", time: "Completed at 11:30 AM", date: "2026-04-21", duration: "25 min", doctor: "Dr. Genet" }
  ]);

  // Urgent Task Data
  const [urgentTasks, setUrgentTasks] = useState([
    { 
      id: 1, 
      patient: "Sarah Johnson", 
      type: "APPOINTMENT - IN PROGRESS", 
      time: "09:00 AM", 
      room: "Room 204", 
      progress: 65, 
      desc: "CONSULTATION PROGRESS",
      urgent: true,
      status: "in-progress",
      priority: "high",
      phone: "+251 911 223 344",
      email: "sarah.j@email.com"
    },
    { 
      id: 2, 
      patient: "Tekle Wondimu", 
      type: "APPOINTMENT - READY", 
      time: "10:30 AM", 
      room: "Lab 2", 
      note: "Patient fasting required",
      urgent: true,
      confirmed: true,
      status: "pending",
      priority: "high",
      phone: "+251 912 345 678",
      email: "tekle.w@email.com"
    },
    { 
      id: 3, 
      patient: "Complete Patient Records", 
      type: "CLINICAL DUTY", 
      time: "11:30 AM - 12:00 PM", 
      isDuty: true,
      status: "pending",
      priority: "medium"
    },
    { 
      id: 4, 
      patient: "Lunch Break", 
      type: "Break", 
      time: "12:00 PM - 1:00 PM", 
      isBreak: true,
      status: "break",
      priority: "low"
    }
  ]);

  // All Tasks Data
  const [allTasksList, setAllTasksList] = useState([
    { id: 5, name: "Selam Tesfaye", sub: "Standard Follow-up", time: "01:00 PM", group: "TODAY (REMAINING)", initials: "ST", color: "bg-blue-100 text-blue-600", status: "pending", priority: "medium", phone: "+251 911 123 456", email: "selam.t@email.com" },
    { id: 6, name: "Abebe Kebede", sub: "Initial Consultation", time: "03:00 PM", group: "TODAY (REMAINING)", initials: "AK", color: "bg-purple-100 text-purple-600", status: "pending", priority: "high", phone: "+251 912 987 654", email: "abebe.k@email.com" },
    { id: 7, name: "Hiwot Alemu", sub: "Post-Op Review", time: "09:00 AM", group: "TOMORROW", initials: "HA", color: "bg-orange-100 text-orange-600", status: "pending", priority: "medium", phone: "+251 913 456 789", email: "hiwot.a@email.com" },
    { id: 8, name: "Solomon Desta", sub: "Lab Results Discussion", time: "11:00 AM", group: "TOMORROW", initials: "SD", color: "bg-blue-50 text-blue-500", status: "pending", priority: "high", phone: "+251 914 567 890", email: "solomon.d@email.com" },
    { id: 9, name: "Equipment Check", sub: "CLINICAL DUTY", time: "02:00 PM", group: "TOMORROW", icon: Settings, color: "bg-slate-800 text-white", status: "pending", priority: "low" },
    { id: 10, name: "Tigist Worku", sub: "Consultation", time: "10:00 AM", group: "APRIL 25, 2026", initials: "TW", color: "bg-pink-100 text-pink-600", status: "pending", priority: "medium", phone: "+251 915 678 901", email: "tigist.w@email.com" },
  ]);

  const showToast = (message, type = "success") => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Update stats dynamically
  const updateStats = () => {
    const total = allTasksList.length + urgentTasks.filter(t => !t.isBreak && !t.isDuty).length;
    const completed = completedHistory.length;
    const highPriority = allTasksList.filter(t => t.priority === "high").length + urgentTasks.filter(t => t.priority === "high").length;
    const dueToday = allTasksList.filter(t => t.group === "TODAY (REMAINING)").length + urgentTasks.filter(t => t.time?.includes("AM")).length;
    
    setStats({
      totalTasks: total,
      dueToday: dueToday,
      completed: completed,
      highPriority: highPriority
    });
  };

  // Sort options
  const sortOptions = [
    { value: "priority", label: "Priority (Highest)", icon: TrendingUp },
    { value: "priority-low", label: "Priority (Lowest)", icon: TrendingDown },
    { value: "time-asc", label: "Time (Earliest)", icon: Clock },
    { value: "time-desc", label: "Time (Latest)", icon: Clock },
    { value: "name-asc", label: "Name (A-Z)", icon: ArrowUpDown },
    { value: "name-desc", label: "Name (Z-A)", icon: ArrowUpDown },
  ];

  const getSortLabel = () => {
    const option = sortOptions.find(opt => opt.value === sortBy);
    return option ? option.label : "Priority (Highest)";
  };

  // Sort function for tasks
  const sortTasks = (tasks, isUrgent = false) => {
    const sorted = [...tasks];
    switch(sortBy) {
      case "priority":
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return sorted.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
      case "priority-low":
        const priorityOrderLow = { high: 1, medium: 2, low: 3 };
        return sorted.sort((a, b) => priorityOrderLow[b.priority] - priorityOrderLow[a.priority]);
      case "time-asc":
        return sorted.sort((a, b) => (a.time || "").localeCompare(b.time || ""));
      case "time-desc":
        return sorted.sort((a, b) => (b.time || "").localeCompare(a.time || ""));
      case "name-asc":
        return sorted.sort((a, b) => (a.patient || a.name || "").localeCompare(b.patient || b.name || ""));
      case "name-desc":
        return sorted.sort((a, b) => (b.patient || b.name || "").localeCompare(a.patient || a.name || ""));
      default:
        return sorted;
    }
  };

  // CRUD OPERATIONS

  // CREATE - Add new task
  const handleAddTask = () => {
    setModalMode("add");
    setEditingTask({
      id: Date.now(),
      name: "",
      sub: "",
      time: "",
      group: "TODAY (REMAINING)",
      priority: "medium",
      phone: "",
      email: "",
      status: "pending"
    });
    setShowTaskModal(true);
  };

  const handleSaveNewTask = () => {
    if (!editingTask.name) {
      showToast("Please enter task name", "error");
      return;
    }
    
    const newTask = {
      id: editingTask.id,
      name: editingTask.name,
      sub: editingTask.sub || "General Task",
      time: editingTask.time || "12:00 PM",
      group: editingTask.group,
      initials: editingTask.name.substring(0, 2).toUpperCase(),
      color: "bg-green-100 text-green-600",
      status: "pending",
      priority: editingTask.priority,
      phone: editingTask.phone,
      email: editingTask.email
    };
    
    setAllTasksList([newTask, ...allTasksList]);
    setShowTaskModal(false);
    updateStats();
    showToast(`✅ Task "${editingTask.name}" added successfully!`, "success");
  };

  // READ - View task details
  const handleViewTask = (task) => {
    setSelectedTask(task);
    setModalMode("view");
    setShowTaskModal(true);
  };

  // UPDATE - Edit task
  const handleEditTask = (task) => {
    setEditingTask({
      id: task.id,
      name: task.name,
      sub: task.sub,
      time: task.time,
      group: task.group,
      priority: task.priority,
      phone: task.phone || "",
      email: task.email || ""
    });
    setModalMode("edit");
    setShowTaskModal(true);
  };

  const handleSaveEditTask = () => {
    const updatedTasks = allTasksList.map(task => 
      task.id === editingTask.id 
        ? { 
            ...task, 
            name: editingTask.name,
            sub: editingTask.sub,
            time: editingTask.time,
            group: editingTask.group,
            priority: editingTask.priority,
            phone: editingTask.phone,
            email: editingTask.email,
            initials: editingTask.name.substring(0, 2).toUpperCase()
          }
        : task
    );
    setAllTasksList(updatedTasks);
    setShowTaskModal(false);
    updateStats();
    showToast(`✏️ Task "${editingTask.name}" updated successfully!`, "success");
  };

  // DELETE - Delete task
  const handleDeleteTask = (taskId) => {
    setSelectedTask(allTasksList.find(t => t.id === taskId));
    setShowDeleteConfirm(true);
  };

  const confirmDeleteTask = () => {
    const taskToDelete = allTasksList.find(t => t.id === selectedTask?.id);
    const updatedTasks = allTasksList.filter(t => t.id !== selectedTask?.id);
    setAllTasksList(updatedTasks);
    setShowDeleteConfirm(false);
    setSelectedTask(null);
    updateStats();
    showToast(`🗑️ Task "${taskToDelete?.name}" deleted successfully!`, "success");
  };

  // Handle Start Service
  const handleStartService = (taskId) => {
    const updatedTasks = urgentTasks.map(task => 
      task.id === taskId ? { ...task, progress: (task.progress || 0) + 10, status: "in-progress" } : task
    );
    setUrgentTasks(updatedTasks);
    showToast(`Service started for ${updatedTasks.find(t => t.id === taskId)?.patient || "task"}`, "success");
  };

  // Handle Mark Complete and move to history
  const handleMarkComplete = (taskId, isUrgent = true) => {
    let task;
    if (isUrgent) {
      task = urgentTasks.find(t => t.id === taskId);
      if (task) {
        const updatedTasks = urgentTasks.filter(t => t.id !== taskId);
        setUrgentTasks(updatedTasks);
        
        // Add to completed history
        const newCompleted = {
          id: Date.now(),
          title: `${task.patient} — ${task.type}`,
          time: `Completed at ${new Date().toLocaleTimeString()}`,
          date: new Date().toISOString().split('T')[0],
          duration: task.duration || "30 min",
          doctor: task.doctor || "Dr. Abebe"
        };
        setCompletedHistory([newCompleted, ...completedHistory]);
        showToast(`✅ ${task.patient} marked as complete!`, "success");
      }
    } else {
      task = allTasksList.find(t => t.id === taskId);
      if (task) {
        const updatedTasks = allTasksList.filter(t => t.id !== taskId);
        setAllTasksList(updatedTasks);
        
        const newCompleted = {
          id: Date.now(),
          title: `${task.name} — ${task.sub}`,
          time: `Completed at ${new Date().toLocaleTimeString()}`,
          date: new Date().toISOString().split('T')[0],
          duration: "30 min",
          doctor: "Dr. Abebe"
        };
        setCompletedHistory([newCompleted, ...completedHistory]);
        showToast(`✅ ${task.name} marked as complete!`, "success");
      }
    }
    updateStats();
  };

  // Handle Reschedule
  const handleReschedule = (taskId) => {
    const newTime = prompt("Enter new time for this appointment (e.g., 02:00 PM):");
    if (newTime) {
      const updatedTasks = urgentTasks.map(task => 
        task.id === taskId ? { ...task, time: newTime } : task
      );
      setUrgentTasks(updatedTasks);
      showToast(`Rescheduled to ${newTime}`, "success");
    }
  };

  // Handle Contact
  const handleContact = (patientName, phone) => {
    if (phone) {
      showToast(`📞 Calling ${patientName} at ${phone}...`, "info");
    } else {
      showToast(`📧 Sending email to ${patientName}...`, "info");
    }
  };

  // Handle End Break
  const handleEndBreak = () => {
    const updatedTasks = urgentTasks.filter(t => !t.isBreak);
    setUrgentTasks(updatedTasks);
    showToast("Break ended! Ready for next task.", "success");
  };

  // Handle Defer
  const handleDefer = (taskId) => {
    const newTime = prompt("Defer to what time? (e.g., 03:00 PM):");
    if (newTime) {
      showToast(`Task deferred to ${newTime}`, "info");
    }
  };

  // Filter Logic based on active tab
  const getFilteredUrgent = () => {
    let filtered = urgentTasks;
    
    if (activeTab === "Today") {
      filtered = urgentTasks.filter(t => t.time?.includes("AM") || t.time?.includes("PM"));
    } else if (activeTab === "Appointments") {
      filtered = urgentTasks.filter(t => !t.isDuty && !t.isBreak);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(t => t.patient?.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    
    return sortTasks(filtered, true);
  };

  const getFilteredAll = () => {
    let filtered = allTasksList;
    
    if (activeTab === "Today") {
      filtered = allTasksList.filter(t => t.group === "TODAY (REMAINING)");
    } else if (activeTab === "Appointments") {
      filtered = allTasksList.filter(t => !t.sub?.includes("DUTY") && !t.sub?.includes("Check"));
    }
    
    if (searchTerm) {
      filtered = filtered.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    
    return sortTasks(filtered);
  };

  const filteredUrgent = getFilteredUrgent();
  const filteredAll = getFilteredAll();

  // Navigation handler for tabs
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    showToast(`Switched to ${tab} view`, "info");
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      
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

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col sticky top-0 h-screen">
        <div className="p-6">
          <h1 className="text-blue-600 font-bold text-2xl">ServeSync+</h1>
          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mt-1">Clinical Dashboard</p>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <NavItem icon={LayoutDashboard} label="My Dashboard" />
          <NavItem icon={Calendar} label="My Schedule" />
          <NavItem icon={ClipboardList} label="My Tasks" active />
          <NavItem icon={Users} label="My Clients" />
          <NavItem icon={UserCircle} label="My Profile" />
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 p-2">
            <img src="https://ui-avatars.com/api/?name=Abebe+Bekele&background=2563eb&color=fff" className="w-10 h-10 rounded-full object-cover" alt="Profile" />
            <div>
              <p className="text-sm font-bold text-gray-900">Dr. Abebe Bekele</p>
              <p className="text-[10px] text-gray-500">abebe.b@servesync.com</p>
            </div>
          </div>
          <button className="w-full mt-4 flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-red-600 transition-colors font-medium">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search system..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
              <Calendar className="w-4 h-4" /> April 23, 2026
            </div>
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
              <Settings className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
              <HelpCircle className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
            </div>
            <div className="flex items-center gap-3 border-l pl-6">
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900 leading-none">Organization Employee</p>
                <p className="text-[10px] text-gray-400 uppercase font-semibold mt-1">Main Hospital Branch</p>
              </div>
              <img src="https://ui-avatars.com/api/?name=OE&background=1e293b&color=fff" className="w-8 h-8 rounded-full" alt="Avatar" />
            </div>
          </div>
        </header>

        <section className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">My Tasks & Appointments</h2>
          <p className="text-gray-500 mt-1">Manage your daily appointments and clinical duties</p>
        </section>

        {/* Stats Grid - Dynamic */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">TOTAL TASKS</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalTasks}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-xl"><ClipboardList className="w-6 h-6 text-blue-600" /></div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">DUE TODAY</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.dueToday}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-xl"><Calendar className="w-6 h-6 text-blue-500" /></div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">COMPLETED</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.completed}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-xl"><CheckCircle className="w-6 h-6 text-green-500" /></div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">HIGH PRIORITY</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.highPriority}</p>
            </div>
            <div className="bg-red-50 p-3 rounded-xl"><Bell className="w-6 h-6 text-red-500" /></div>
          </div>
        </div>

        {/* Filter Tabs + Add Task Button */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex bg-gray-100 p-1 rounded-xl">
            {["All Tasks", "Today", "Appointments"].map((tab) => (
              <button 
                key={tab} 
                onClick={() => handleTabClick(tab)}
                className={`px-6 py-2 text-sm font-semibold rounded-lg transition-all ${
                  activeTab === tab ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-3">
            {/* Add Task Button */}
            <button 
              onClick={handleAddTask}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add New Task
            </button>
            
            {/* Sort By Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Sort by: {getSortLabel()}
                <ChevronDown className={`w-4 h-4 transition-transform ${showSortMenu ? 'rotate-180' : ''}`} />
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
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                        sortBy === option.value 
                          ? 'bg-blue-50 text-blue-600 font-semibold' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <option.icon className="w-4 h-4" />
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* URGENT Section */}
        <div className="bg-red-50 rounded-2xl p-8 mb-8 border border-red-100">
          <div className="flex items-center gap-2 mb-6 text-red-600">
            <Bell className="w-5 h-5" />
            <h3 className="font-bold uppercase tracking-wide text-sm">URGENT - Due Today</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            {filteredUrgent.length > 0 ? (
              filteredUrgent.map((task) => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onStart={() => handleStartService(task.id)}
                  onComplete={() => handleMarkComplete(task.id, true)}
                  onReschedule={() => handleReschedule(task.id)}
                  onContact={() => handleContact(task.patient, task.phone)}
                  onEndBreak={handleEndBreak}
                  onDefer={() => handleDefer(task.id)}
                  onView={() => handleViewTask(task)}
                  onEdit={() => handleEditTask(task)}
                  onDelete={() => handleDeleteTask(task.id)}
                />
              ))
            ) : (
              <div className="col-span-2 text-center py-12 bg-white rounded-xl">
                <p className="text-gray-500">No urgent tasks in this view</p>
              </div>
            )}
          </div>
        </div>

        {/* All Tasks Table Area */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-8">
            <ClipboardList className="w-6 h-6 text-gray-400" />
            <h3 className="text-xl font-bold text-gray-800">All Tasks</h3>
          </div>

          <div className="space-y-8">
            {["TODAY (REMAINING)", "TOMORROW", "APRIL 25, 2026"].map(group => {
              const groupTasks = filteredAll.filter(t => t.group === group);
              if (groupTasks.length === 0) return null;
              return (
                <div key={group}>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-4">{group}</p>
                  <table className="w-full">
                    <thead>
                      <tr className="text-[10px] text-gray-400 uppercase font-semibold text-left border-b border-gray-100">
                        <th className="pb-4 font-semibold tracking-wide w-1/2">Name</th>
                        <th className="pb-4 font-semibold tracking-wide">Time</th>
                        <th className="pb-4 font-semibold tracking-wide text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {groupTasks.map((t) => (
                        <tr key={t.id} className="group hover:bg-gray-50 transition-colors">
                          <td className="py-4">
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${t.color}`}>
                                {t.initials ? t.initials : <t.icon className="w-5 h-5" />}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-800">{t.name}</p>
                                <p className="text-xs text-gray-400">{t.sub}</p>
                              </div>
                            </div>
                           </td>
                          <td className="py-4 text-sm font-medium text-gray-600">{t.time}</td>
                          <td className="py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => handleMarkComplete(t.id, false)}
                                className="px-3 py-1.5 bg-green-50 text-green-600 rounded-lg text-xs font-semibold hover:bg-green-100 transition-colors flex items-center gap-1"
                                title="Mark Complete"
                              >
                                <CheckCircle className="w-3 h-3" /> Complete
                              </button>
                              <button 
                                onClick={() => handleViewTask(t)}
                                className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold hover:bg-blue-100 transition-colors flex items-center gap-1"
                                title="View Details"
                              >
                                <Eye className="w-3 h-3" /> View
                              </button>
                              <button 
                                onClick={() => handleEditTask(t)}
                                className="px-3 py-1.5 bg-yellow-50 text-yellow-600 rounded-lg text-xs font-semibold hover:bg-yellow-100 transition-colors flex items-center gap-1"
                                title="Edit Task"
                              >
                                <Edit2 className="w-3 h-3" /> Edit
                              </button>
                              <button 
                                onClick={() => handleDeleteTask(t.id)}
                                className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-100 transition-colors flex items-center gap-1"
                                title="Delete Task"
                              >
                                <Trash2 className="w-3 h-3" /> Delete
                              </button>
                            </div>
                           </td>
                         </tr>
                      ))}
                    </tbody>
                   </table>
                </div>
              );
            })}
            {filteredAll.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No tasks found in this view</p>
                <button 
                  onClick={handleAddTask}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4 inline mr-1" /> Add New Task
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Recently Completed Section */}
        <div className="mt-8 bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <h3 className="text-xl font-bold text-gray-800">Recently Completed</h3>
            </div>
            <button 
              onClick={() => setShowHistoryModal(true)}
              className="text-blue-600 text-sm font-semibold hover:underline flex items-center gap-1"
            >
              <History className="w-4 h-4" /> View All History
            </button>
          </div>
          <div className="space-y-3">
            {completedHistory.slice(0, 3).map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="bg-green-100 p-1 rounded-full"><Check className="w-3 h-3 text-green-600" /></div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-700">{item.title}</p>
                  <p className="text-[10px] text-gray-400 font-medium uppercase mt-0.5">{item.time}</p>
                </div>
                <button 
                  onClick={() => {
                    setSelectedTask(item);
                    setShowHistoryModal(true);
                  }}
                  className="text-blue-500 text-xs font-medium hover:underline"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Task Modal (View/Edit/Add) */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden shadow-2xl">
            <div className={`px-6 py-4 flex justify-between items-center ${
              modalMode === 'view' ? 'bg-blue-600 text-white' : 
              modalMode === 'edit' ? 'bg-yellow-500 text-white' : 'bg-green-600 text-white'
            }`}>
              <div className="flex items-center gap-2">
                {modalMode === 'view' && <Eye className="w-5 h-5" />}
                {modalMode === 'edit' && <Edit2 className="w-5 h-5" />}
                {modalMode === 'add' && <Plus className="w-5 h-5" />}
                <h2 className="text-xl font-bold">
                  {modalMode === 'view' ? 'Task Details' : modalMode === 'edit' ? 'Edit Task' : 'Add New Task'}
                </h2>
              </div>
              <button onClick={() => setShowTaskModal(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {modalMode === 'view' && selectedTask && (
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <label className="text-xs font-semibold text-gray-500 uppercase">Task Name</label>
                    <p className="text-lg font-bold text-gray-800">{selectedTask.name}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <label className="text-xs font-semibold text-gray-500 uppercase">Description</label>
                      <p className="font-medium text-gray-700">{selectedTask.sub}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <label className="text-xs font-semibold text-gray-500 uppercase">Time</label>
                      <p className="font-medium text-gray-700">{selectedTask.time}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <label className="text-xs font-semibold text-gray-500 uppercase">Priority</label>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        selectedTask.priority === 'high' ? 'bg-red-100 text-red-700' :
                        selectedTask.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {selectedTask.priority?.toUpperCase()}
                      </span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <label className="text-xs font-semibold text-gray-500 uppercase">Group</label>
                      <p className="font-medium text-gray-700">{selectedTask.group}</p>
                    </div>
                  </div>
                  {selectedTask.phone && (
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <label className="text-xs font-semibold text-gray-500 uppercase">Phone</label>
                      <p className="font-medium text-gray-700">{selectedTask.phone}</p>
                    </div>
                  )}
                  {selectedTask.email && (
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <label className="text-xs font-semibold text-gray-500 uppercase">Email</label>
                      <p className="font-medium text-gray-700">{selectedTask.email}</p>
                    </div>
                  )}
                </div>
              )}
              
              {(modalMode === 'edit' || modalMode === 'add') && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Task Name *</label>
                    <input 
                      type="text" 
                      value={editingTask.name}
                      onChange={(e) => setEditingTask({...editingTask, name: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter task name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Description</label>
                    <input 
                      type="text" 
                      value={editingTask.sub}
                      onChange={(e) => setEditingTask({...editingTask, sub: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter description"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Time</label>
                      <input 
                        type="text" 
                        value={editingTask.time}
                        onChange={(e) => setEditingTask({...editingTask, time: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., 02:00 PM"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Priority</label>
                      <select 
                        value={editingTask.priority}
                        onChange={(e) => setEditingTask({...editingTask, priority: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Group</label>
                    <select 
                      value={editingTask.group}
                      onChange={(e) => setEditingTask({...editingTask, group: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="TODAY (REMAINING)">Today (Remaining)</option>
                      <option value="TOMORROW">Tomorrow</option>
                      <option value="APRIL 25, 2026">April 25, 2026</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Phone (Optional)</label>
                      <input 
                        type="text" 
                        value={editingTask.phone}
                        onChange={(e) => setEditingTask({...editingTask, phone: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Phone number"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Email (Optional)</label>
                      <input 
                        type="email" 
                        value={editingTask.email}
                        onChange={(e) => setEditingTask({...editingTask, email: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Email address"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="border-t p-4 flex justify-end gap-3">
              <button 
                onClick={() => setShowTaskModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
              {(modalMode === 'edit' || modalMode === 'add') && (
                <button 
                  onClick={modalMode === 'edit' ? handleSaveEditTask : handleSaveNewTask}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-4 h-4 inline mr-1" /> Save Changes
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedTask && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="bg-red-600 px-6 py-4 text-white">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-6 h-6" />
                <h2 className="text-xl font-bold">Confirm Delete</h2>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-2">Are you sure you want to delete this task?</p>
              <p className="font-semibold text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedTask.name}</p>
              <p className="text-xs text-gray-500 mt-2">This action cannot be undone.</p>
            </div>
            <div className="border-t p-4 flex justify-end gap-3">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDeleteTask}
                className="px-4 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4 inline mr-1" /> Delete Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl">
            <div className="bg-blue-600 px-6 py-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5" />
                <h2 className="text-xl font-bold">Task History</h2>
              </div>
              <button onClick={() => setShowHistoryModal(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-3">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-xs text-gray-500 font-semibold uppercase mb-2">Total Completed Tasks</p>
                  <p className="text-3xl font-bold text-blue-600">{completedHistory.length}</p>
                </div>
                <div className="divide-y divide-gray-100">
                  {completedHistory.map((item) => (
                    <div key={item.id} className="py-4 flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{item.title}</p>
                        <p className="text-xs text-gray-500 mt-1">Date: {item.date}</p>
                        <p className="text-xs text-gray-500">Duration: {item.duration}</p>
                        <p className="text-xs text-gray-500">Doctor: {item.doctor}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400">{item.time}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-600 text-xs rounded-full font-semibold">Completed</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="border-t p-4 flex justify-end">
              <button 
                onClick={() => setShowHistoryModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-components for clarity
function NavItem({ icon: Icon, label, active = false }) {
  return (
    <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
      active ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
    }`}>
      <Icon className="w-5 h-5" /> {label}
    </button>
  );
}

function TaskCard({ task, onStart, onComplete, onReschedule, onContact, onEndBreak, onDefer, onView, onEdit, onDelete }) {
  if (task.isBreak) {
    return (
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-orange-100 p-3 rounded-xl text-orange-500 text-2xl">🍽️</div>
          <div>
            <h4 className="font-bold text-gray-900 text-lg">Lunch Break</h4>
            <p className="text-xs text-gray-500 font-medium">{task.time}</p>
          </div>
        </div>
        <button 
          onClick={onEndBreak}
          className="px-8 py-3 border-2 border-orange-300 rounded-xl text-orange-600 font-bold text-sm hover:bg-orange-100 transition-colors"
        >
          End Break
        </button>
      </div>
    );
  }

  if (task.isDuty) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 relative group hover:shadow-lg transition-all">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Clinical Duty</p>
            <h4 className="font-bold text-gray-900 text-lg">{task.patient}</h4>
            <p className="text-xs text-gray-500 font-medium">{task.time}</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={onEdit}
              className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
              title="Edit"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button 
              onClick={onDelete}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <FileText className="w-5 h-5 text-gray-300" />
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={onStart}
            className="flex-1 bg-gray-800 text-white py-3 rounded-xl font-semibold text-sm hover:bg-gray-900 transition-colors"
          >
            Start
          </button>
          <button 
            onClick={onDefer}
            className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors"
          >
            Defer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-b-4 border-blue-600 rounded-xl p-6 shadow-sm hover:shadow-xl transition-all relative group">
      {task.confirmed && (
        <div className="absolute top-4 right-4 flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
          <CheckCircle className="w-3 h-3" /> CONFIRMED
        </div>
      )}
      
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[10px] font-semibold text-blue-600 uppercase tracking-wide mb-1">{task.type}</p>
          <h4 className="font-bold text-gray-900 text-xl">{task.patient}</h4>
          <p className="text-sm text-gray-400 font-medium mb-4">{task.time} • {task.room}</p>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={onView}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button 
            onClick={onEdit}
            className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button 
            onClick={onDelete}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {task.progress ? (
        <div className="mb-6">
          <div className="flex justify-between text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2">
            <span>{task.desc}</span>
            <span className="text-gray-900">{task.progress}%</span>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full rounded-full" style={{ width: `${task.progress}%` }}></div>
          </div>
        </div>
      ) : (
        <div className="mb-6 p-3 bg-yellow-50 rounded-xl border border-yellow-100 flex gap-2">
          <FileText className="w-4 h-4 text-orange-400 shrink-0" />
          <p className="text-[10px] text-orange-700 font-bold leading-tight">Note: '{task.note}'</p>
        </div>
      )}

      <div className="flex gap-2">
        <button 
          onClick={task.progress ? onComplete : onStart}
          className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-colors ${
            task.progress ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {task.progress ? 'Mark Complete' : 'Start Service'}
        </button>
        <button 
          onClick={task.progress ? onReschedule : onContact}
          className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
        >
          {task.progress ? 'Reschedule' : <><Phone className="w-4 h-4" /> Contact</>}
        </button>
      </div>
    </div>
  );
}