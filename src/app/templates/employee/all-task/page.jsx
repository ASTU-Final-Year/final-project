"use client";

import { useState, useEffect } from "react";
import { 
  LayoutDashboard, Calendar, ClipboardList, 
  Users, UserCircle, Bell, 
  Search, CheckCircle, Clock, AlertCircle,
  Eye, FileText, Video as VideoIcon,
  Camera, LogOut, CircleCheck, CircleAlert, Circle,
  ArrowUpDown, Filter, ChevronDown, ChevronRight,
  TrendingUp, Activity, Award, Target, Flag,
  Phone, Mail, MoreVertical, Play, Pause,
  Edit, Trash2, Copy, ViewIcon, Check,
  X, Menu, Coffee
} from "lucide-react";

export default function EmployeeDashboardPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedView, setSelectedView] = useState("all");
  const [sortBy, setSortBy] = useState("priority");
  const [toastMessage, setToastMessage] = useState(null);
  const [openActionMenu, setOpenActionMenu] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editFormData, setEditFormData] = useState({ title: "", time: "", location: "", note: "" });

  const stats = {
    totalTasks: 12,
    dueToday: 5,
    completed: 3,
    highPriority: 2
  };

  // Task Data Structure
  const [tasks, setTasks] = useState([
    { 
      id: 1,
      title: "Sarah Johnson",
      type: "appointment",
      category: "APPOINTMENT - IN PROGRESS",
      status: "IN PROGRESS",
      time: "09:00 AM",
      location: "Room 204",
      progress: 63,
      priority: "urgent",
      dueDate: "today",
      hasMarkComplete: true,
      hasReschedule: true,
      description: "CONSULTATION PROGRESS"
    },
    { 
      id: 2,
      title: "Tekle Wondimu",
      type: "appointment",
      category: "APPOINTMENT - READY",
      status: "READY",
      time: "10:30 AM",
      location: "Lab 2",
      priority: "urgent",
      dueDate: "today",
      hasStartService: true,
      hasContact: true,
      note: "Patient fasting required",
      description: "Diagnostic Review"
    },
    { 
      id: 3,
      title: "Complete Patient Records",
      type: "duty",
      category: "CLINICAL DUTY",
      time: "11:30 AM - 12:00 PM",
      priority: "normal",
      dueDate: "today",
      hasStart: true,
      hasDefer: true
    },
    { 
      id: 4,
      title: "Lunch Break",
      type: "break",
      category: "Lunch Break",
      time: "12:00 PM - 1:00 PM",
      hasEndBreak: true
    }
  ]);

  // Today Remaining Tasks
  const [todayRemaining, setTodayRemaining] = useState([
    { id: 5, title: "Selam Tesfaye", subtitle: "Standard Follow-up", time: "01:00 PM", order: 1, initials: "ST" },
    { id: 6, title: "Abebe Kebede", subtitle: "Initial Consultation", time: "03:00 PM", order: 1, initials: "AK" }
  ]);

  // Tomorrow Tasks
  const [tomorrowTasks, setTomorrowTasks] = useState([
    { id: 7, title: "Hiwot Alemu", subtitle: "Post-Op Review", time: "09:00 AM", order: 1, initials: "HA" },
    { id: 8, title: "Solomon Desta", subtitle: "Lab Results Discussion", time: "11:00 AM", order: 1, initials: "SD" },
    { id: 9, title: "Equipment Check", subtitle: "CLINICAL DUTY", time: "02:00 PM", order: 1, type: "duty" }
  ]);

  // April 25 Tasks
  const [apr25Tasks, setApr25Tasks] = useState([
    { id: 10, title: "Tigist Worku", subtitle: "Consultation", time: "10:00 AM", order: 1, initials: "TW" }
  ]);

  // Recently Completed Tasks
  const [recentlyCompleted, setRecentlyCompleted] = useState([
    { title: "Routine Checkup — Mihekol O.", time: "Completed at 08:30 AM" },
    { title: "Morning Ward Rounds", time: "Completed at 08:15 AM" },
    { title: "Shift Handover Meeting", time: "Completed at 08:00 AM" }
  ]);

  const showToast = (message, type = "success") => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // CRUD Operations for all tasks including Lunch Break
  const handleEditTask = (task) => {
    setSelectedTask(task);
    setEditFormData({
      title: task.title,
      time: task.time,
      location: task.location || "",
      note: task.note || ""
    });
    setShowEditModal(true);
    setOpenActionMenu(null);
  };

  const handleSaveEdit = () => {
    setTasks(prev => prev.map(task => 
      task.id === selectedTask.id 
        ? { ...task, title: editFormData.title, time: editFormData.time, location: editFormData.location, note: editFormData.note }
        : task
    ));
    setShowEditModal(false);
    showToast(`Task "${editFormData.title}" updated successfully!`, "success");
  };

  const handleDeleteTask = (task) => {
    setSelectedTask(task);
    setShowDeleteConfirm(true);
    setOpenActionMenu(null);
  };

  const confirmDelete = () => {
    setTasks(prev => prev.filter(task => task.id !== selectedTask.id));
    setShowDeleteConfirm(false);
    showToast(`Task "${selectedTask.title}" deleted successfully!`, "success");
  };

  const handleDuplicateTask = (task) => {
    const newTask = {
      ...task,
      id: Date.now(),
      title: `${task.title} (Copy)`
    };
    setTasks(prev => [...prev, newTask]);
    setOpenActionMenu(null);
    showToast(`Task duplicated successfully!`, "success");
  };

  const handleMarkComplete = (taskId) => {
    const completedTask = tasks.find(t => t.id === taskId);
    if (completedTask) {
      setRecentlyCompleted(prev => [
        { title: completedTask.title, time: `Completed at ${new Date().toLocaleTimeString()}` },
        ...prev
      ]);
      setTasks(prev => prev.filter(task => task.id !== taskId));
      showToast(`Task marked as completed!`, "success");
    }
    setOpenActionMenu(null);
  };

  const handleStartService = (taskId) => {
    showToast(`Service started for task!`, "success");
    setOpenActionMenu(null);
  };

  const handleContact = (taskId) => {
    showToast(`Contact initiated!`, "success");
    setOpenActionMenu(null);
  };

  const handleStart = (taskId) => {
    showToast(`Task started!`, "success");
    setOpenActionMenu(null);
  };

  const handleDefer = (taskId) => {
    showToast(`Task deferred to later!`, "success");
    setOpenActionMenu(null);
  };

  const handleEndBreak = () => {
    showToast(`Break ended. Ready for next task!`, "success");
    setOpenActionMenu(null);
  };

  const handleReschedule = (taskId) => {
    showToast(`Reschedule option opened!`, "success");
    setOpenActionMenu(null);
  };

  const handleViewDetails = (task) => {
    showToast(`Viewing details for ${task.title}`, "info");
    setOpenActionMenu(null);
  };

  // Action Menu Component
  const ActionMenu = ({ task, onClose }) => (
    <div className="absolute right-0 top-8 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-1">
      <button onClick={() => { handleViewDetails(task); onClose(); }} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
        <Eye className="w-4 h-4 text-gray-500" /> View Details
      </button>
      <button onClick={() => { handleEditTask(task); onClose(); }} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
        <Edit className="w-4 h-4 text-blue-500" /> Edit Task
      </button>
      <button onClick={() => { handleDuplicateTask(task); onClose(); }} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
        <Copy className="w-4 h-4 text-gray-500" /> Duplicate
      </button>
      <button onClick={() => { handleMarkComplete(task.id); onClose(); }} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
        <CheckCircle className="w-4 h-4 text-green-500" /> Mark Complete
      </button>
      <div className="border-t border-gray-100 my-1"></div>
      <button onClick={() => { handleDeleteTask(task); onClose(); }} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600">
        <Trash2 className="w-4 h-4" /> Delete Task
      </button>
    </div>
  );

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

  // Urgent Task Card Component
  const UrgentTaskCard = ({ task }) => (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4 relative">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-red-600">URGENT - Due Today</span>
            <div className="relative">
              <button 
                onClick={() => setOpenActionMenu(openActionMenu === task.id ? null : task.id)}
                className="p-1 hover:bg-red-100 rounded-lg transition-colors"
              >
                <MoreVertical className="w-5 h-5 text-gray-500" />
              </button>
              {openActionMenu === task.id && (
                <ActionMenu task={task} onClose={() => setOpenActionMenu(null)} />
              )}
            </div>
          </div>
          <p className="text-xs font-semibold text-gray-500">{task.category}</p>
          <p className="font-bold text-gray-900 text-lg">{task.title}</p>
          <p className="text-sm text-gray-600">{task.time} • {task.location}</p>
          {task.note && (
            <p className="text-xs text-gray-500 mt-1">📌 Note: {task.note}</p>
          )}
          {task.progress && (
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>{task.description}</span>
                <span>{task.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: `${task.progress}%` }}></div>
              </div>
            </div>
          )}
          <div className="flex gap-3 mt-4">
            {task.hasMarkComplete && (
              <button onClick={() => handleMarkComplete(task.id)} className="flex-1 text-sm font-medium text-white bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700">
                Mark Complete
              </button>
            )}
            {task.hasReschedule && (
              <button onClick={() => handleReschedule(task.id)} className="flex-1 text-sm font-medium text-gray-700 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200">
                Reschedule
              </button>
            )}
            {task.hasStartService && (
              <>
                <button onClick={() => handleStartService(task.id)} className="flex-1 text-sm font-medium text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700">
                  Start Service
                </button>
                <button onClick={() => handleContact(task.id)} className="flex-1 text-sm font-medium text-gray-700 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200">
                  Contact
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Clinical Duty Card Component
  const ClinicalDutyCard = ({ task }) => (
    <div className="bg-white border border-gray-200 rounded-xl p-4 relative">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <span className="text-xs font-semibold text-gray-500">{task.category}</span>
          <p className="font-bold text-gray-900 text-lg">{task.title}</p>
          <p className="text-sm text-gray-600">{task.time}</p>
          <div className="flex gap-3 mt-4">
            <button onClick={() => handleStart(task.id)} className="flex-1 text-sm font-medium text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700">
              Start
            </button>
            <button onClick={() => handleDefer(task.id)} className="flex-1 text-sm font-medium text-gray-700 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200">
              Defer
            </button>
          </div>
        </div>
        <div className="relative">
          <button 
            onClick={() => setOpenActionMenu(openActionMenu === task.id ? null : task.id)}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <MoreVertical className="w-5 h-5 text-gray-500" />
          </button>
          {openActionMenu === task.id && (
            <ActionMenu task={task} onClose={() => setOpenActionMenu(null)} />
          )}
        </div>
      </div>
    </div>
  );

  // Lunch Break Card Component with CRUD Operations
  const LunchBreakCard = ({ task }) => (
    <div className="bg-white border border-gray-200 rounded-xl p-4 relative">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Coffee className="w-5 h-5 text-orange-500" />
            <span className="text-xs font-semibold text-orange-600">BREAK TIME</span>
          </div>
          <p className="font-bold text-gray-900 text-lg">{task.title}</p>
          <p className="text-sm text-gray-600">{task.time}</p>
          <button onClick={handleEndBreak} className="mt-4 text-sm font-medium text-white bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700">
            End Break
          </button>
        </div>
        <div className="relative">
          <button 
            onClick={() => setOpenActionMenu(openActionMenu === task.id ? null : task.id)}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <MoreVertical className="w-5 h-5 text-gray-500" />
          </button>
          {openActionMenu === task.id && (
            <ActionMenu task={task} onClose={() => setOpenActionMenu(null)} />
          )}
        </div>
      </div>
    </div>
  );

  // Small Task Item Component
  const SmallTaskItem = ({ task, type }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0 group">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
          {task.initials || task.title.substring(0, 2).toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-gray-900">{task.title}</p>
          <p className="text-xs text-gray-500">{task.subtitle}</p>
          <p className="text-xs text-gray-400">{task.time}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
          {task.order}
        </span>
        <div className="relative">
          <button 
            onClick={() => setOpenActionMenu(openActionMenu === `small-${task.id}` ? null : `small-${task.id}`)}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded-lg transition-all"
          >
            <MoreVertical className="w-4 h-4 text-gray-400" />
          </button>
          {openActionMenu === `small-${task.id}` && (
            <div className="absolute right-0 top-8 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-1">
              <button onClick={() => { handleEditTask(task); setOpenActionMenu(null); }} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                <Edit className="w-4 h-4 text-blue-500" /> Edit
              </button>
              <button onClick={() => { handleDuplicateTask(task); setOpenActionMenu(null); }} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                <Copy className="w-4 h-4 text-gray-500" /> Duplicate
              </button>
              <button onClick={() => { handleMarkComplete(task.id); setOpenActionMenu(null); }} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" /> Complete
              </button>
              <div className="border-t border-gray-100 my-1"></div>
              <button onClick={() => { handleDeleteTask(task); setOpenActionMenu(null); }} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600">
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          )}
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

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Edit Task</h2>
            <div className="space-y-4">
              <input type="text" value={editFormData.title} onChange={(e) => setEditFormData({...editFormData, title: e.target.value})} className="w-full px-3 py-2 border rounded-lg" placeholder="Title" />
              <input type="text" value={editFormData.time} onChange={(e) => setEditFormData({...editFormData, time: e.target.value})} className="w-full px-3 py-2 border rounded-lg" placeholder="Time" />
              <input type="text" value={editFormData.location} onChange={(e) => setEditFormData({...editFormData, location: e.target.value})} className="w-full px-3 py-2 border rounded-lg" placeholder="Location" />
              <textarea value={editFormData.note} onChange={(e) => setEditFormData({...editFormData, note: e.target.value})} className="w-full px-3 py-2 border rounded-lg" placeholder="Note" rows="2" />
              <div className="flex gap-3">
                <button onClick={() => setShowEditModal(false)} className="flex-1 px-4 py-2 border rounded-lg">Cancel</button>
                <button onClick={handleSaveEdit} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Delete Task</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to delete "{selectedTask?.title}"? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 px-4 py-2 border rounded-lg">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg">Delete</button>
            </div>
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
              <span>Wednesday, April 23, 2026</span>
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
            <StatCard label="TOTALS TASKS" value={stats.totalTasks} icon={ClipboardList} color="text-blue-600" bgColor="bg-blue-50" />
            <StatCard label="DUE TODAY" value={stats.dueToday} icon={Clock} color="text-yellow-600" bgColor="bg-yellow-50" />
            <StatCard label="COMPLETED" value={stats.completed} icon={CheckCircle} color="text-green-600" bgColor="bg-green-50" />
            <StatCard label="HIGH PRIORITY" value={stats.highPriority} icon={AlertCircle} color="text-red-600" bgColor="bg-red-50" />
          </div>
          {/* Tabs and Filters */}
          <div className="flex flex-wrap justify-between items-center mb-6">
            <div className="flex gap-2">
              <button onClick={() => setSelectedView("all")} className={`px-4 py-2 text-sm font-medium rounded-lg ${selectedView === "all" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}>All Tasks</button>
              <button onClick={() => setSelectedView("today")} className={`px-4 py-2 text-sm font-medium rounded-lg ${selectedView === "today" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}>Today</button>
              <button onClick={() => setSelectedView("appointments")} className={`px-4 py-2 text-sm font-medium rounded-lg ${selectedView === "appointments" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}>Appointments</button>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Sort by:</span>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-3 py-2 text-sm border border-gray-200 rounded-lg">
                  <option value="priority">Priority (Highest)</option>
                  <option value="time">Time (Earliest)</option>
                </select>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg w-48" />
              </div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-2 gap-6">
            {/* LEFT COLUMN - Task Lists */}
            <div className="space-y-6">
              {/* TODAY (REMAINING) */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-3">TODAY (REMAINING)</h3>
                <div className="divide-y divide-gray-100">
                  {todayRemaining.map(task => <SmallTaskItem key={task.id} task={task} type="today" />)}
                </div>
              </div>

              {/* TOMORROW */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-3">TOMORROW</h3>
                <div className="divide-y divide-gray-100">
                  {tomorrowTasks.map(task => <SmallTaskItem key={task.id} task={task} type="tomorrow" />)}
                </div>
              </div>

              {/* APRIL 25, 2025 */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-3">APRIL 25, 2025</h3>
                <div className="divide-y divide-gray-100">
                  {apr25Tasks.map(task => <SmallTaskItem key={task.id} task={task} type="apr25" />)}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN - 4 CARDS IN ONE CONTAINER */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="divide-y divide-gray-200">
                {/* URGENT CARD 1 - Sarah Johnson */}
                <div className="p-4 bg-red-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-red-600">URGENT - Due Today</span>
                        <div className="relative">
                          <button onClick={() => setOpenActionMenu(openActionMenu === 1 ? null : 1)} className="p-1 hover:bg-red-100 rounded-lg">
                            <MoreVertical className="w-5 h-5 text-gray-500" />
                          </button>
                          {openActionMenu === 1 && <ActionMenu task={tasks[0]} onClose={() => setOpenActionMenu(null)} />}
                        </div>
                      </div>
                      <p className="text-xs font-semibold text-gray-500">APPOINTMENT - IN PROGRESS</p>
                      <p className="font-bold text-gray-900 text-lg">Sarah Johnson</p>
                      <p className="text-sm text-gray-600">09:00 AM • Room 204</p>
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>CONSULTATION PROGRESS</span>
                          <span>63%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-red-500 h-2 rounded-full" style={{ width: "63%" }}></div>
                        </div>
                      </div>
                      <div className="flex gap-3 mt-4">
                        <button onClick={() => handleMarkComplete(1)} className="flex-1 text-sm font-medium text-white bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700">Mark Complete</button>
                        <button onClick={() => handleReschedule(1)} className="flex-1 text-sm font-medium text-gray-700 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200">Reschedule</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* URGENT CARD 2 - Tekle Wondimu */}
                <div className="p-4 bg-red-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-red-600">URGENT - Due Today</span>
                        <div className="relative">
                          <button onClick={() => setOpenActionMenu(openActionMenu === 2 ? null : 2)} className="p-1 hover:bg-red-100 rounded-lg">
                            <MoreVertical className="w-5 h-5 text-gray-500" />
                          </button>
                          {openActionMenu === 2 && <ActionMenu task={tasks[1]} onClose={() => setOpenActionMenu(null)} />}
                        </div>
                      </div>
                      <p className="text-xs font-semibold text-gray-500">APPOINTMENT - READY</p>
                      <p className="font-bold text-gray-900 text-lg">Tekle Wondimu</p>
                      <p className="text-sm text-gray-600">10:30 AM • Lab 2</p>
                      <p className="text-xs text-gray-500 mt-1">📌 Note: Patient fasting required</p>
                      <div className="flex gap-3 mt-4">
                        <button onClick={() => handleStartService(2)} className="flex-1 text-sm font-medium text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700">Start Service</button>
                        <button onClick={() => handleContact(2)} className="flex-1 text-sm font-medium text-gray-700 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200">Contact</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CLINICAL DUTY CARD */}
                <div className="p-4 bg-white">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <span className="text-xs font-semibold text-gray-500">CLINICAL DUTY</span>
                      <p className="font-bold text-gray-900 text-lg">Complete Patient Records</p>
                      <p className="text-sm text-gray-600">11:30 AM - 12:00 PM</p>
                      <div className="flex gap-3 mt-4">
                        <button onClick={() => handleStart(3)} className="flex-1 text-sm font-medium text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700">Start</button>
                        <button onClick={() => handleDefer(3)} className="flex-1 text-sm font-medium text-gray-700 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200">Defer</button>
                      </div>
                    </div>
                    <div className="relative">
                      <button onClick={() => setOpenActionMenu(openActionMenu === 3 ? null : 3)} className="p-1 hover:bg-gray-100 rounded-lg">
                        <MoreVertical className="w-5 h-5 text-gray-500" />
                      </button>
                      {openActionMenu === 3 && <ActionMenu task={tasks[2]} onClose={() => setOpenActionMenu(null)} />}
                    </div>
                  </div>
                </div>

                {/* LUNCH BREAK CARD with CRUD */}
                <div className="p-4 bg-white">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Coffee className="w-5 h-5 text-orange-500" />
                        <span className="text-xs font-semibold text-orange-600">BREAK TIME</span>
                      </div>
                      <p className="font-bold text-gray-900 text-lg">Lunch Break</p>
                      <p className="text-sm text-gray-600">12:00 PM - 1:00 PM</p>
                      <button onClick={handleEndBreak} className="mt-4 text-sm font-medium text-white bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700">End Break</button>
                    </div>
                    <div className="relative">
                      <button onClick={() => setOpenActionMenu(openActionMenu === 4 ? null : 4)} className="p-1 hover:bg-gray-100 rounded-lg">
                        <MoreVertical className="w-5 h-5 text-gray-500" />
                      </button>
                      {openActionMenu === 4 && <ActionMenu task={tasks[3]} onClose={() => setOpenActionMenu(null)} />}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recently Completed Section */}
          <div className="mt-6 bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Recently Completed</h3>
            <div className="space-y-3">
              {recentlyCompleted.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{item.title}</p>
                    <p className="text-xs text-gray-400">{item.time}</p>
                  </div>
                  <button className="text-xs text-blue-600 hover:text-blue-700">View</button>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      <style jsx global>{`
        @media print { nav, aside, .sticky { display: none !important; } main { padding: 20px !important; } }
      `}</style>
    </div>
  );
}