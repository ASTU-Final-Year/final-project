"use client";
import { useState, useEffect } from "react";
import { 
  LayoutDashboard, Users, Calendar as CalendarIcon, 
  ClipboardList, FileText, Settings, Bell, 
  Search, Edit, Calendar, ChevronLeft, ChevronRight, 
  Mail, Phone, Star, Filter, X, CheckCircle, UserPlus,
  UserCheck, UserX, UserPlus as UserPlusIcon, Activity, Clock
} from "lucide-react";

export default function EmployeeManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [toastMessage, setToastMessage] = useState(null);
  const [selectedRole, setSelectedRole] = useState("All Roles");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [scheduleData, setScheduleData] = useState({ date: "", time: "", type: "" });
  const [editData, setEditData] = useState({ name: "", role: "", email: "", department: "" });
  const [newEmployee, setNewEmployee] = useState({ name: "", role: "", email: "", department: "" });
  const itemsPerPage = 6;

  // Employee data - exactly matching both images
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: "Dr. Abebe Bekele",
      role: "Senior Doctor",
      department: "Cardiology",
      email: "abebe.b@servesync.com",
      hiredDate: "Oct 2021",
      workload: 95,
      status: "active"
    },
    {
      id: 2,
      name: "Dr. Genet Mekonnen",
      role: "Lab Specialist",
      department: "Lab Tests",
      email: "genet.m@servesync.com",
      hiredDate: "Jan 2022",
      workload: 92,
      status: "active"
    },
    {
      id: 3,
      name: "Dr. Tekle Wolde",
      role: "Radiologist",
      department: "X-Ray",
      email: "tekle.w@servesync.com",
      hiredDate: "Mar 2020",
      workload: 88,
      status: "active"
    },
    {
      id: 4,
      name: "Nurse Sarah Hailu",
      role: "Senior Nurse",
      department: "Patient Care",
      email: "sarah.h@servesync.com",
      hiredDate: "May 2019",
      workload: 100,
      status: "active"
    },
    {
      id: 5,
      name: "Dr. Selam Tesfaye",
      role: "Dentist",
      department: "Dental Surgery",
      email: "selam.t@servesync.com",
      hiredDate: "Mar 2021",
      workload: 90,
      status: "leave",
      targetRecovery: 90
    },
    {
      id: 6,
      name: "Mr. Kebede Alemu",
      role: "Admin Staff",
      department: "Reception",
      email: "kebede.a@servesync.com",
      phone: "+251 911 223 344",
      efficiency: "High",
      status: "active"
    },
    {
      id: 7,
      name: "Dr. Marta Tadesse",
      role: "Pediatrician",
      department: "Pediatrics",
      email: "marta.t@servesync.com",
      hiredDate: "Aug 2020",
      workload: 87,
      status: "active"
    },
    {
      id: 8,
      name: "Nurse Birtukan Alemu",
      role: "ICU Nurse",
      department: "Intensive Care",
      email: "birtukan.a@servesync.com",
      hiredDate: "Nov 2021",
      workload: 94,
      status: "active"
    },
    {
      id: 9,
      name: "Dr. Yared Mekonnen",
      role: "Orthopedic",
      department: "Orthopedics",
      email: "yared.m@servesync.com",
      hiredDate: "Feb 2019",
      workload: 91,
      status: "leave"
    },
    {
      id: 10,
      name: "Pharmacist Selamawit",
      role: "Pharmacist",
      department: "Pharmacy",
      email: "selamawit.t@servesync.com",
      hiredDate: "Apr 2022",
      workload: 96,
      status: "active"
    },
    {
      id: 11,
      name: "Dr. Henok Assefa",
      role: "Neurologist",
      department: "Neurology",
      email: "henok.a@servesync.com",
      hiredDate: "Jul 2020",
      workload: 89,
      status: "active"
    },
    {
      id: 12,
      name: "Nurse Tsehay Demeke",
      role: "Head Nurse",
      department: "Nursing",
      email: "tsehay.d@servesync.com",
      hiredDate: "Jan 2018",
      workload: 98,
      status: "active"
    },
  ]);

  // Stats data
  const stats = {
    totalEmployees: 12,
    activeToday: 10,
    onLeave: 2,
    newHires: 3
  };

  const roles = ["All Roles", "Doctor", "Nurse", "Specialist", "Staff", "Pharmacist"];
  const statuses = ["All Status", "Active", "On Leave"];
  const departments = ["All Departments", "Cardiology", "Lab Tests", "X-Ray", "Patient Care", "Dental Surgery", "Reception", "Pediatrics", "Intensive Care", "Orthopedics", "Pharmacy", "Neurology", "Nursing"];

  const showToast = (message, type = "success") => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filter employees
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = searchTerm === "" || 
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = selectedRole === "All Roles" || emp.role === selectedRole || 
      (selectedRole === "Doctor" && emp.role.includes("Dr.")) ||
      (selectedRole === "Nurse" && emp.role.includes("Nurse"));
    
    const matchesStatus = selectedStatus === "All Status" || 
      (selectedStatus === "Active" && emp.status === "active") ||
      (selectedStatus === "On Leave" && emp.status === "leave");
    
    const matchesDepartment = selectedDepartment === "All Departments" || emp.department === selectedDepartment;
    
    return matchesSearch && matchesRole && matchesStatus && matchesDepartment;
  });

  // Pagination
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + itemsPerPage);

  // FUNCTIONAL Edit button - Opens Edit Modal
  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setEditData({
      name: employee.name,
      role: employee.role,
      email: employee.email,
      department: employee.department
    });
    setShowEditModal(true);
  };

  // Save Edit Changes
  const handleSaveEdit = (e) => {
    e.preventDefault();
    const updatedEmployees = employees.map(emp => 
      emp.id === selectedEmployee.id 
        ? { ...emp, name: editData.name, role: editData.role, email: editData.email, department: editData.department }
        : emp
    );
    setEmployees(updatedEmployees);
    setShowEditModal(false);
    showToast(`${editData.name} has been updated successfully!`, "success");
  };

  // FUNCTIONAL Schedule button - Opens Schedule Modal
  const handleSchedule = (employee) => {
    setSelectedEmployee(employee);
    setScheduleData({ date: "", time: "", type: "" });
    setShowScheduleModal(true);
  };

  // Save Schedule
  const handleSaveSchedule = (e) => {
    e.preventDefault();
    setShowScheduleModal(false);
    showToast(`Appointment scheduled for ${selectedEmployee.name} on ${scheduleData.date} at ${scheduleData.time}`, "success");
  };

  const handleResetFilters = () => {
    setSelectedRole("All Roles");
    setSelectedStatus("All Status");
    setSelectedDepartment("All Departments");
    setSearchTerm("");
    setCurrentPage(1);
    showToast("All filters reset", "info");
  };

  // Add Member functionality
  const handleAddMember = (e) => {
    e.preventDefault();
    const newEmp = {
      id: employees.length + 1,
      name: newEmployee.name,
      role: newEmployee.role,
      department: newEmployee.department,
      email: newEmployee.email,
      hiredDate: new Date().toLocaleString('default', { month: 'short', year: 'numeric' }),
      workload: 0,
      status: "active"
    };
    setEmployees([...employees, newEmp]);
    setShowAddModal(false);
    setNewEmployee({ name: "", role: "", email: "", department: "" });
    showToast(`New employee ${newEmployee.name} added successfully!`, "success");
  };

  // Stat Card Component with Icons
  const StatCard = ({ label, value, icon: Icon, color }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
      <div className="flex items-center justify-center mb-2">
        <div className={`p-2 rounded-full ${color} bg-opacity-10`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">{label}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-[9999] animate-in slide-in-from-right">
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
        {/* Sidebar Navigation - PRESERVED */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-57px)] sticky top-[57px]">
          <div className="p-4">
            <div className="mb-6">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Dashboard</h2>
              <nav className="space-y-1">
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                  <ClipboardList className="w-4 h-4" />
                  Services
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg bg-blue-50 text-blue-600 font-medium">
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

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Employee Management</h1>
            <p className="text-gray-500 text-sm">Manage and monitor your healthcare professionals across all departments.</p>
          </div>

          {/* Stats Cards Row - 4 cards WITH ICONS */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <StatCard label="TOTAL EMPLOYEES" value={stats.totalEmployees} icon={Users} color="text-blue-600" />
            <StatCard label="ACTIVE TODAY" value={stats.activeToday} icon={UserCheck} color="text-green-600" />
            <StatCard label="ON LEAVE" value={stats.onLeave} icon={UserX} color="text-yellow-600" />
            <StatCard label="NEW HIRES" value={stats.newHires} icon={UserPlusIcon} color="text-purple-600" />
          </div>

          {/* Search and Filter Bar with Roles, Status, Departments */}
          <div className="mb-6">
            {/* Search Input with Add Members Button */}
            <div className="flex gap-3 mb-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, or ID..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              {/* ADD MEMBERS BUTTON - BLUE BACKGROUND */}
              <button 
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                Add Members
              </button>
            </div>
            
            {/* Filter Bar - Rectangle with ALL ROLES, ALL STATUS, ALL DEPARTMENTS */}
            <div className="flex flex-wrap items-center gap-2 p-2 bg-white border border-gray-200 rounded-lg">
              {/* All Roles Dropdown */}
              <div className="relative">
                <select
                  value={selectedRole}
                  onChange={(e) => { setSelectedRole(e.target.value); setCurrentPage(1); }}
                  className="px-3 py-1.5 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                >
                  {roles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              
              {/* Separator */}
              <span className="text-gray-300">|</span>
              
              {/* All Status Dropdown */}
              <div className="relative">
                <select
                  value={selectedStatus}
                  onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
                  className="px-3 py-1.5 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              
              {/* Separator */}
              <span className="text-gray-300">|</span>
              
              {/* All Departments Dropdown */}
              <div className="relative flex-1 max-w-xs">
                <select
                  value={selectedDepartment}
                  onChange={(e) => { setSelectedDepartment(e.target.value); setCurrentPage(1); }}
                  className="w-full px-3 py-1.5 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              
              {/* Reset Button */}
              {(selectedRole !== "All Roles" || selectedStatus !== "All Status" || selectedDepartment !== "All Departments" || searchTerm) && (
                <button
                  onClick={handleResetFilters}
                  className="flex items-center gap-1 px-2 py-1.5 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Employee Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {paginatedEmployees.map((employee) => (
              <div key={employee.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all">
                {/* Employee Name */}
                <h3 className="text-lg font-bold text-gray-900 mb-2">{employee.name}</h3>
                
                {/* Role and Department */}
                <div className="mb-2">
                  <span className="font-medium text-gray-800">{employee.role}</span>
                  {employee.department && (
                    <span className="text-gray-400 text-sm"> • {employee.department}</span>
                  )}
                </div>
                
                {/* Email */}
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  <a href={`mailto:${employee.email}`} className="hover:text-blue-600">{employee.email}</a>
                </div>
                
                {/* Phone (for Kebede) */}
                {employee.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    <span>{employee.phone}</span>
                  </div>
                )}
                
                {/* Hired Date */}
                {employee.hiredDate && (
                  <p className="text-sm text-gray-500 mb-2">Hired {employee.hiredDate}</p>
                )}
                
                {/* Workload Completion Progress Bar */}
                {employee.workload && (
                  <div className="mb-2">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Workload Completion</span>
                      <span className="font-medium">{employee.workload}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full ${
                          employee.workload >= 90 ? 'bg-green-500' : 
                          employee.workload >= 80 ? 'bg-blue-500' : 'bg-yellow-500'
                        }`}
                        style={{ width: `${employee.workload}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                {/* Target Recovery (for Dr. Selam) */}
                {employee.targetRecovery && (
                  <div className="mb-2">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Target Recovery</span>
                      <span className="font-medium">{employee.targetRecovery}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${employee.targetRecovery}%` }}></div>
                    </div>
                  </div>
                )}
                
                {/* Efficiency Score (for Kebede) */}
                {employee.efficiency && (
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-3.5 h-3.5 text-yellow-500" />
                    <span className="text-sm text-gray-700">Efficiency score: <strong>{employee.efficiency}</strong></span>
                  </div>
                )}
                
                {/* On Leave Badge */}
                {employee.status === "leave" && (
                  <div className="mb-2">
                    <span className="text-xs font-medium px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full">On Leave</span>
                  </div>
                )}
                
                {/* Buttons - Edit and Schedule */}
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                  {/* EDIT Button - FUNCTIONAL - Opens Edit Modal */}
                  <button 
                    onClick={() => handleEdit(employee)}
                    className="flex-1 px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  
                  {/* SCHEDULE Button - BLUE BACKGROUND & FUNCTIONAL - Opens Schedule Modal */}
                  <button 
                    onClick={() => handleSchedule(employee)}
                    className="flex-1 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    {employee.status === "leave" ? "Unavailable" : "Schedule"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Showing info and Pagination */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Showing {filteredEmployees.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredEmployees.length)} of {filteredEmployees.length} employees
            </p>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* --- MODALS FIXED (Moved into main return to prevent focus loss) --- */}

      {/* ADD MEMBER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">Add New Member</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:bg-gray-100 p-2 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddMember} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Full Name</label>
                <input 
                  type="text" 
                  required 
                  value={newEmployee.name} 
                  onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})} 
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Role</label>
                  <input 
                    type="text" 
                    required 
                    value={newEmployee.role} 
                    onChange={(e) => setNewEmployee({...newEmployee, role: e.target.value})} 
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Department</label>
                  <input 
                    type="text" 
                    required 
                    value={newEmployee.department} 
                    onChange={(e) => setNewEmployee({...newEmployee, department: e.target.value})} 
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Email</label>
                <input 
                  type="email" 
                  required 
                  value={newEmployee.email} 
                  onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})} 
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                />
              </div>
              <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg transition-all flex items-center justify-center gap-2">
                <UserPlus className="w-5 h-5" /> Add Member
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">Edit Employee</h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:bg-gray-100 p-2 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Full Name</label>
                <input 
                  type="text" 
                  required 
                  value={editData.name} 
                  onChange={(e) => setEditData({...editData, name: e.target.value})} 
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Role</label>
                  <input 
                    type="text" 
                    required 
                    value={editData.role} 
                    onChange={(e) => setEditData({...editData, role: e.target.value})} 
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Department</label>
                  <input 
                    type="text" 
                    required 
                    value={editData.department} 
                    onChange={(e) => setEditData({...editData, department: e.target.value})} 
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Email</label>
                <input 
                  type="email" 
                  required 
                  value={editData.email} 
                  onChange={(e) => setEditData({...editData, email: e.target.value})} 
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                />
              </div>
              <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg transition-all flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5" /> Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SCHEDULE MODAL */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">Schedule Appointment</h2>
              <button onClick={() => setShowScheduleModal(false)} className="text-gray-400 hover:bg-gray-100 p-2 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveSchedule} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Employee</label>
                <input 
                  type="text" 
                  value={selectedEmployee?.name || ""} 
                  disabled 
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-xl text-gray-600 cursor-not-allowed" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Date</label>
                  <input 
                    type="date" 
                    required 
                    value={scheduleData.date} 
                    onChange={(e) => setScheduleData({...scheduleData, date: e.target.value})} 
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Time</label>
                  <input 
                    type="time" 
                    required 
                    value={scheduleData.time} 
                    onChange={(e) => setScheduleData({...scheduleData, time: e.target.value})} 
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Appointment Type</label>
                <select 
                  required 
                  value={scheduleData.type} 
                  onChange={(e) => setScheduleData({...scheduleData, type: e.target.value})} 
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                >
                  <option value="">Select Type</option>
                  <option value="Consultation">Consultation</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Emergency">Emergency</option>
                  <option value="Routine Check">Routine Check</option>
                </select>
              </div>
              <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg transition-all flex items-center justify-center gap-2">
                <Calendar className="w-5 h-5" /> Confirm Schedule
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}