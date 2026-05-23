'use client'
import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, ClipboardList, Users, CalendarCheck, 
  CalendarDays, FileText, Settings, Search, Bell, 
  HelpCircle, Plus, RotateCw, MoreVertical, 
  Clock, Trash2, X, Edit3, Activity, Sparkles, Car, LayoutGrid
} from 'lucide-react';

const AllServicesPage = () => {
  // --- State ---
  const [services, setServices] = useState([
    { 
      id: 1, 
      name: 'General Checkup', 
      description: 'Comprehensive physical examination including vital signs monitoring and health assessment.',
      price: 500, 
      duration: '30 min', 
      type: 'HEALTHCARE', 
      capacity: 85, 
      status: 'ACTIVE', 
      icon: <Activity size={20} />,
      createdAt: '2024-05-01'
    },
    { 
      id: 2, 
      name: 'Urgent Care', 
      description: 'Immediate medical attention for non-life-threatening illnesses or injuries requiring prompt care.',
      price: 1200, 
      duration: '45 min', 
      type: 'HEALTHCARE', 
      capacity: 42, 
      status: 'ACTIVE', 
      icon: <Activity size={20} />,
      createdAt: '2024-05-02'
    },
    { 
      id: 3, 
      name: 'Oil Change', 
      description: 'Premium synthetic oil replacement with filter change and multi-point safety inspection.',
      price: 1800, 
      duration: '45 min', 
      type: 'AUTOMOTIVE', 
      capacity: 68, 
      status: 'ACTIVE', 
      icon: <Car size={20} />,
      createdAt: '2024-05-03'
    },
    { 
      id: 4, 
      name: 'Facial Treatment', 
      description: 'Deep cleansing and hydration treatment using premium organic skincare products.',
      price: 850, 
      duration: '60 min', 
      type: 'BEAUTY', 
      capacity: 25, 
      status: 'ACTIVE', 
      icon: <Sparkles size={20} />,
      createdAt: '2024-05-04'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [dateFilter, setDateFilter] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  // --- Filtering & Sorting Logic ---
  const filteredServices = useMemo(() => {
    return services
      .filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCat = categoryFilter === 'All' || s.type === categoryFilter;
        const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
        const matchesDate = !dateFilter || s.createdAt === dateFilter;
        return matchesSearch && matchesCat && matchesStatus && matchesDate;
      })
      .sort((a, b) => {
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'capacity') return b.capacity - a.capacity;
        if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
        return a.name.localeCompare(b.name);
      });
  }, [services, searchQuery, categoryFilter, statusFilter, sortBy, dateFilter]);

  const handleSaveService = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const serviceData = {
      id: editingService ? editingService.id : Date.now(),
      name: formData.get('name'),
      description: formData.get('description'),
      price: Number(formData.get('price')),
      duration: formData.get('duration'),
      type: formData.get('type'),
      status: formData.get('status'),
      capacity: Number(formData.get('capacity')),
      icon: editingService?.icon || <LayoutGrid size={20} />,
      createdAt: editingService?.createdAt || new Date().toISOString().split('T')[0]
    };

    if (editingService) {
      setServices(services.map(s => s.id === editingService.id ? serviceData : s));
    } else {
      setServices([...services, serviceData]);
    }
    closeModal();
  };

  const openModal = (service = null) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      {/* NEW SIDEBAR INTEGRATED */}
      <aside className="w-64 bg-white border-r border-gray-200 min-h-screen sticky top-0 overflow-y-auto">
        <div className="p-4">
          <div className="mb-6">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">Dashboard</h2>
            <nav className="space-y-1">
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </button>
              {/* Active Item for Services */}
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg bg-blue-50 text-blue-600 font-medium transition-colors">
                <ClipboardList className="w-4 h-4" />
                Services
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                <Users className="w-4 h-4" />
                Employees
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                <CalendarCheck className="w-4 h-4" />
                Appointments
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                <CalendarDays className="w-4 h-4" />
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

      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by service name or code..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-10 pr-4 text-sm outline-none focus:ring-1 focus:ring-blue-100"
            />
          </div>
          <div className="flex items-center gap-6">
            <Bell size={20} className="text-slate-400 cursor-pointer hover:text-blue-600" />
            <HelpCircle size={20} className="text-slate-400 cursor-pointer hover:text-blue-600" />
            <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
              <div className="text-right">
                <p className="text-xs font-bold text-slate-700">Organization Admin</p>
                <p className="text-[10px] text-slate-400 font-medium uppercase">Main Hospital Branch</p>
              </div>
              <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md shadow-blue-100">OA</div>
            </div>
          </div>
        </header>

        <div className="p-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">All Services</h2>
              <p className="text-slate-500 text-sm mt-1">Manage the services your organization offers to clients ({filteredServices.length} total)</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => {setSearchQuery(''); setCategoryFilter('All'); setStatusFilter('All'); setDateFilter('');}} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 text-sm font-semibold transition-all">
                <RotateCw size={16} /> Refresh
              </button>
              <button 
                onClick={() => openModal()}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all text-sm font-semibold">
                <Plus size={16} /> Add New Service
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-wrap gap-3 mb-8 shadow-sm">
            <div className="relative flex-[1.5] min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search services..." 
                className="w-full border border-slate-200 rounded-lg py-2 pl-10 pr-4 text-sm outline-none focus:border-blue-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <select 
              className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none text-slate-600 cursor-pointer focus:border-blue-300"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="All">Category</option>
              <option value="HEALTHCARE">Healthcare</option>
              <option value="AUTOMOTIVE">Automotive</option>
              <option value="BEAUTY">Beauty</option>
              <option value="OTHER">Other Sector</option>
            </select>

            <select 
              className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none text-slate-600 cursor-pointer focus:border-blue-300"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>

            <select 
              className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none text-slate-600 cursor-pointer focus:border-blue-300"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Sort By</option>
              <option value="name">Name</option>
              <option value="price-high">Price: High-Low</option>
              <option value="price-low">Price: Low-High</option>
            </select>

            <div className="flex-1 relative min-w-[140px]">
              <CalendarDays className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="date" 
                className="w-full border border-slate-200 rounded-lg py-2 pl-3 pr-10 text-sm outline-none text-slate-500 cursor-pointer focus:border-blue-300" 
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
          </div>

          {/* Grid View */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <ServiceCard 
                key={service.id} 
                service={service} 
                onEdit={() => openModal(service)}
                onDelete={(id) => setServices(services.filter(s => s.id !== id))}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Modal logic ... */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-bold text-slate-800">{editingService ? 'Edit Service' : 'Add New Service'}</h3>
              <button onClick={closeModal} className="p-2 hover:bg-white border rounded-full transition-all"><X size={20}/></button>
            </div>
            <form onSubmit={handleSaveService} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5 tracking-wider">Service Name</label>
                <input name="name" defaultValue={editingService?.name} required className="w-full border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5 tracking-wider">Description</label>
                <textarea name="description" defaultValue={editingService?.description} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm h-20 resize-none outline-none focus:ring-2 focus:ring-blue-100" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5 tracking-wider">Category</label>
                  <select name="type" defaultValue={editingService?.type || 'HEALTHCARE'} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm outline-none">
                    <option value="HEALTHCARE">Healthcare</option>
                    <option value="AUTOMOTIVE">Automotive</option>
                    <option value="BEAUTY">Beauty</option>
                    <option value="OTHER">Other Sector</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5 tracking-wider">Status</label>
                  <select name="status" defaultValue={editingService?.status || 'ACTIVE'} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm outline-none">
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5 tracking-wider">Price (ETB)</label>
                <input name="price" type="number" defaultValue={editingService?.price} required className="w-full border border-slate-200 rounded-lg p-2.5 text-sm outline-none" />
              </div>
              <div className="flex gap-3 mt-8">
                <button type="button" onClick={closeModal} className="flex-1 py-2.5 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all">Save Service</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const ServiceCard = ({ service, onEdit, onDelete }) => {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 relative flex flex-col h-full hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600">
          {service.icon}
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full tracking-wider ${
            service.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
          }`}>{service.status}</span>
          <div className="relative">
             <button onClick={() => setShowOptions(!showOptions)} className="p-1 hover:bg-slate-50 rounded text-slate-400 transition-colors">
               <MoreVertical size={16} />
             </button>
             {showOptions && (
               <div className="absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-xl z-20 py-1 ring-1 ring-black ring-opacity-5">
                 <button onClick={onEdit} className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 flex items-center gap-2 font-medium text-slate-700 transition-colors"><Edit3 size={14}/> Edit</button>
                 <button onClick={() => onDelete(service.id)} className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 text-red-600 flex items-center gap-2 font-medium transition-colors"><Trash2 size={14}/> Delete</button>
               </div>
             )}
          </div>
        </div>
      </div>

      <h3 className="font-bold text-slate-800 text-lg mb-2">{service.name}</h3>
      <p className="text-slate-500 text-xs leading-relaxed mb-6 flex-grow line-clamp-2">
        {service.description}
      </p>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Clock size={14} />
            <span className="text-[11px] font-medium">{service.duration}</span>
          </div>
          <span className="text-[11px] font-bold text-blue-700 tracking-tight">{service.price} ETB</span>
        </div>
        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{service.type}</span>
      </div>

      <div className="space-y-1.5 mb-8">
        <div className="flex justify-between text-[10px] font-bold">
          <span className="text-slate-500 uppercase tracking-wide">Booking Capacity</span>
          <span className="text-slate-400">{service.capacity}% Full</span>
        </div>
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 transition-all duration-700 rounded-full" style={{ width: `${service.capacity}%` }} />
        </div>
      </div>

      <div className="flex gap-2 pt-4 border-t border-slate-50">
        <button onClick={onEdit} className="flex-1 py-2 text-xs font-bold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Edit</button>
        <button className="flex-1 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-md shadow-blue-100 transition-all">View Details</button>
      </div>
    </div>
  );
};

export default AllServicesPage;