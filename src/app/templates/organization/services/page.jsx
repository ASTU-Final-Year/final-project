"use client";

import { useState, useEffect } from "react";
import { 
  Search, RefreshCw, Plus, Calendar, LogOut, Edit, Eye,
  Activity, Inbox, Clock, Tag, X, ChevronDown, Filter,
  ArrowUpDown, CheckCircle, Circle, Trash2, Save
} from "lucide-react";

// Mock data matching both uploaded images
const MOCK_SERVICES = [
  { id: "1", name: "General Checkup", description: "Comprehensive physical examination including vital signs monitoring and assessment of overall health...", isActive: true, duration: 30, price: 500, category: "HEALTHCARE", bookingCapacity: 85, createdAt: "2026-03-12" },
  { id: "2", name: "Urgent Care", description: "Premium synthetic oil replacement with filter change and multi-point inspection for vehicle maintenance...", isActive: true, duration: 45, price: 1200, category: "MAINTENANCE", bookingCapacity: 42, createdAt: "2026-03-10" },
  { id: "3", name: "Lab Test", description: "Full blood panel analysis and diagnostic laboratory services with comprehensive reporting...", isActive: true, duration: 15, price: 850, category: "HEALTHCARE", bookingCapacity: 68, createdAt: "2026-03-08" },
  { id: "4", name: "Dental Checkup", description: "Professional teeth cleaning, X-rays, and comprehensive oral health examination by certified dentist...", isActive: false, duration: 60, price: 1500, category: "HEALTHCARE", bookingCapacity: 0, createdAt: "2026-03-05" },
  { id: "5", name: "X-Ray", description: "Digital radiographic imaging for skeletal assessment and internal organ evaluation...", isActive: false, duration: 20, price: 2000, category: "HEALTHCARE", bookingCapacity: 30, createdAt: "2026-03-01" },
  { id: "6", name: "Physical Therapy", description: "One-on-one session focused on rehabilitation, mobility improvement and pain management...", isActive: false, duration: 45, price: 1100, category: "HEALTHCARE", bookingCapacity: 95, createdAt: "2026-02-28" },
  { id: "7", name: "Vaccination", description: "Administration of routine immunizations and travel vaccines with proper documentation...", isActive: true, duration: 10, price: 300, category: "HEALTHCARE", bookingCapacity: 25, createdAt: "2026-03-15" },
  { id: "8", name: "Eye Exam", description: "Comprehensive vision testing and eye health screening by professional optometrist...", isActive: true, duration: 30, price: 750, category: "HEALTHCARE", bookingCapacity: 55, createdAt: "2026-03-14" },
];

export default function OrganizationServicesPage() {
  const [services, setServices] = useState(MOCK_SERVICES);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [loading, setLoading] = useState(false);
  
  // Form state for add/edit
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: 30,
    price: 0,
    category: "HEALTHCARE",
    isActive: true,
    bookingCapacity: 0,
  });

  // Filter and sort services
  const filteredServices = services.filter(service => {
    // Search filter
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Category filter
    const matchesCategory = selectedCategory === "ALL" || service.category === selectedCategory;
    
    // Status filter
    const matchesStatus = statusFilter === "ALL" || 
                         (statusFilter === "ACTIVE" && service.isActive) ||
                         (statusFilter === "INACTIVE" && !service.isActive);
    
    // Date range filter
    const matchesDate = (!dateRange.from || service.createdAt >= dateRange.from) &&
                       (!dateRange.to || service.createdAt <= dateRange.to);
    
    return matchesSearch && matchesCategory && matchesStatus && matchesDate;
  });

  // Sort services
  const sortedServices = [...filteredServices].sort((a, b) => {
    let comparison = 0;
    if (sortBy === "name") comparison = a.name.localeCompare(b.name);
    if (sortBy === "price") comparison = a.price - b.price;
    if (sortBy === "duration") comparison = a.duration - b.duration;
    if (sortBy === "capacity") comparison = a.bookingCapacity - b.bookingCapacity;
    if (sortBy === "date") comparison = new Date(a.createdAt) - new Date(b.createdAt);
    return sortOrder === "asc" ? comparison : -comparison;
  });

  const activeServices = sortedServices.filter(s => s.isActive);
  const inactiveServices = sortedServices.filter(s => !s.isActive);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setServices([...MOCK_SERVICES]);
      setLoading(false);
    }, 500);
  };

  const handleAddService = (e) => {
    e.preventDefault();
    const newService = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setServices([newService, ...services]);
    setShowAddModal(false);
    resetForm();
  };

  const handleEditService = (e) => {
    e.preventDefault();
    setServices(services.map(s => 
      s.id === selectedService.id ? { ...selectedService, ...formData } : s
    ));
    setShowEditModal(false);
    resetForm();
  };

  const handleDeleteService = (id) => {
    if (confirm("Are you sure you want to delete this service?")) {
      setServices(services.filter(s => s.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      duration: 30,
      price: 0,
      category: "HEALTHCARE",
      isActive: true,
      bookingCapacity: 0,
    });
    setSelectedService(null);
  };

  const openEditModal = (service) => {
    setSelectedService(service);
    setFormData(service);
    setShowEditModal(true);
  };

  const ServiceCard = ({ service }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all duration-200">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-gray-900">{service.name}</h3>
            <span className={`px-2 py-0.5 text-xs font-semibold rounded ${
              service.category === "HEALTHCARE" 
                ? "bg-green-100 text-green-700" 
                : "bg-orange-100 text-orange-700"
            }`}>
              {service.category}
            </span>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">{service.description}</p>
        </div>
        <button 
          onClick={() => handleDeleteService(service.id)}
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex items-center gap-4 mb-3 text-sm">
        <div className="flex items-center gap-1 text-gray-500">
          <Clock className="w-4 h-4" />
          <span>{service.duration} min</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-gray-500">•</span>
          <span className="font-bold text-gray-900">{service.price.toLocaleString()} ETB</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-gray-500">•</span>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            service.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
          }`}>
            {service.isActive ? "ACTIVE" : "INACTIVE"}
          </span>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>Booking Capacity</span>
          <span className="font-medium">{service.bookingCapacity}% Full</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-300 ${
              service.bookingCapacity > 70 ? "bg-red-500" : 
              service.bookingCapacity > 40 ? "bg-yellow-500" : "bg-green-500"
            }`}
            style={{ width: `${service.bookingCapacity}%` }}
          />
        </div>
      </div>
      
      <div className="flex gap-2 pt-3 border-t border-gray-100">
        <button 
          onClick={() => openEditModal(service)}
          className="flex-1 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-1"
        >
          <Edit className="w-4 h-4" />
          Edit
        </button>
        <button className="flex-1 px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-1">
          <Eye className="w-4 h-4" />
          View Details
        </button>
      </div>
    </div>
  );

  // Add/Edit Service Modal
  const ServiceModal = ({ isOpen, onClose, onSubmit, title, isEdit }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
            <h2 className="text-xl font-bold">{title}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={onSubmit} className="p-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  min="5"
                  step="5"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (ETB)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  min="0"
                  step="100"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="HEALTHCARE">Healthcare</option>
                <option value="MAINTENANCE">Maintenance</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Booking Capacity (%)</label>
              <input
                type="range"
                value={formData.bookingCapacity}
                onChange={(e) => setFormData({ ...formData, bookingCapacity: parseInt(e.target.value) })}
                className="w-full"
                min="0"
                max="100"
                step="5"
              />
              <div className="text-center text-sm text-gray-600 mt-1">{formData.bookingCapacity}%</div>
            </div>
            
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Active Service</span>
              </label>
            </div>
            
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isEdit ? "Update Service" : "Add Service"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
            <button className="text-gray-600 hover:text-gray-900 px-3 py-1 text-sm">Services</button>
            <button className="text-gray-600 hover:text-gray-900 px-3 py-1 text-sm">Manage</button>
            <button className="text-gray-600 hover:text-gray-900 px-3 py-1 text-sm">Appointments</button>
            <button className="text-gray-600 hover:text-gray-900 px-3 py-1 text-sm">Notifications</button>
            <button className="text-gray-600 hover:text-gray-900 px-3 py-1 text-sm">Hosting</button>
            <button className="text-gray-600 hover:text-gray-900 px-3 py-1 text-sm">Fees</button>
            <button 
              onClick={() => { window.location.href = "/login"; }}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">All Services</h1>
          <p className="text-gray-500 text-sm">Manage the services your organization offers to clients</p>
        </div>

        {/* Control Bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by service name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Category Filter */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Categories</option>
                <option value="HEALTHCARE">Healthcare</option>
                <option value="MAINTENANCE">Maintenance</option>
              </select>
            </div>
            
            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
            
            {/* Sort By */}
            <div className="relative flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white"
              >
                <option value="name">Sort by Name</option>
                <option value="price">Sort by Price</option>
                <option value="duration">Sort by Duration</option>
                <option value="capacity">Sort by Capacity</option>
                <option value="date">Sort by Date</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <ArrowUpDown className={`w-4 h-4 ${sortOrder === "desc" ? "text-blue-600" : "text-gray-500"}`} />
              </button>
            </div>
            
            {/* Date Range */}
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg"
                placeholder="From"
              />
              <span className="text-gray-400">—</span>
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg"
                placeholder="To"
              />
            </div>
            
            {/* Action Buttons */}
            <button 
              onClick={handleRefresh}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            
            <button 
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add New Service
            </button>
          </div>
        </div>

        {/* Active Services Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <h2 className="text-lg font-semibold text-gray-900">ACTIVE</h2>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {activeServices.length} services
            </span>
          </div>
          
          {activeServices.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <Inbox className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No active services found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
              {activeServices.map(service => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}
        </div>

        {/* Inactive Services Section */}
        {inactiveServices.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-gray-400"></div>
              <h2 className="text-lg font-semibold text-gray-900">INACTIVE</h2>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                {inactiveServices.length} services
              </span>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
              {inactiveServices.map(service => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Add Service Modal */}
      <ServiceModal
        isOpen={showAddModal}
        onClose={() => { setShowAddModal(false); resetForm(); }}
        onSubmit={handleAddService}
        title="Add New Service"
        isEdit={false}
      />

      {/* Edit Service Modal */}
      <ServiceModal
        isOpen={showEditModal}
        onClose={() => { setShowEditModal(false); resetForm(); }}
        onSubmit={handleEditService}
        title="Edit Service"
        isEdit={true}
      />
    </div>
  );
}