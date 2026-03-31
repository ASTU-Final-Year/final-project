// app/dashboard/page.jsx
'use client';

import { useState } from 'react';
import { 
  Users, 
  Calendar as CalendarIcon, 
  Clock, 
  Briefcase,
  Menu,
  Mail,
  Phone,
  MapPin,
  Bell,
  Search,
  Settings,
  Home,
  LogOut,
  Star,
  Award,
  ChevronRight,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronDown,
  X,
  Clock3,
  Sparkles,
  TrendingUp,
  Heart,
  Scissors,
  Coffee,
  Sun,
  Moon,
  Wind,
  Droplets,
  Flower2
} from 'lucide-react';

export default function DashboardPage() {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userRole, setUserRole] = useState('admin');

  // Company data
  const companyData = {
    companyName: 'Samri Beauty Salon',
    email: 'contact@samribeauty.com',
    phone: '+251 91 234 5678',
    city: 'Addis Ababa',
    description: 'Premium beauty salon offering professional services.',
    rating: 4.9,
    reviews: 328,
    
    services: [
      { id: 1, name: 'Hair Styling', price: '500 ETB', icon: '💇', color: 'from-amber-400 to-orange-500', bg: 'bg-amber-50' },
      { id: 2, name: 'Makeup', price: '800 ETB', icon: '💄', color: 'from-rose-400 to-pink-500', bg: 'bg-rose-50' },
      { id: 3, name: 'Manicure', price: '600 ETB', icon: '💅', color: 'from-purple-400 to-purple-500', bg: 'bg-purple-50' },
      { id: 4, name: 'Spa', price: '1200 ETB', icon: '🧖', color: 'from-blue-400 to-cyan-500', bg: 'bg-blue-50' },
    ]
  };

  // GREGORIAN CALENDAR
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 1));
  const [selectedDate, setSelectedDate] = useState('2026-03-26');
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);
  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  // Time slots
  const timeSlots = [
    '12:00 AM', '1:00 AM', '2:00 AM', '3:00 AM', '4:00 AM', '5:00 AM', '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM', '11:00 PM'
  ];

  // Calendar functions
  const getMonthData = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const prevMonthLastDate = new Date(year, month, 0).getDate();
    return { year, month, firstDay, lastDate, prevMonthLastDate };
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const selectMonth = (monthIndex) => {
    setCurrentDate(new Date(currentDate.getFullYear(), monthIndex, 1));
    setShowMonthDropdown(false);
  };

  const selectYear = (year) => {
    setCurrentDate(new Date(year, currentDate.getMonth(), 1));
    setShowYearDropdown(false);
  };

  // Build calendar days
  const buildCalendarDays = () => {
    const { year, month, firstDay, lastDate, prevMonthLastDate } = getMonthData();
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push({
        day: prevMonthLastDate - firstDay + i + 1,
        isCurrentMonth: false,
        date: `${year}-${String(month).padStart(2, '0')}-${String(prevMonthLastDate - firstDay + i + 1).padStart(2, '0')}`
      });
    }

    for (let i = 1; i <= lastDate; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({
        day: i,
        isCurrentMonth: true,
        date: dateStr,
        isToday: dateStr === new Date().toISOString().split('T')[0]
      });
    }

    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        date: `${year}-${String(month + 2).padStart(2, '0')}-${String(i).padStart(2, '0')}`
      });
    }

    return days;
  };

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  // Availability data
  const [availability, setAvailability] = useState([
    { id: 1, date: '2026-03-15', serviceId: 1, serviceName: 'Hair Styling', fromTime: '9:00 AM', toTime: '11:00 AM', price: '500 ETB', icon: '💇', color: 'amber' },
    { id: 2, date: '2026-03-15', serviceId: 1, serviceName: 'Hair Styling', fromTime: '2:00 PM', toTime: '4:00 PM', price: '500 ETB', icon: '💇', color: 'amber' },
    { id: 3, date: '2026-03-18', serviceId: 2, serviceName: 'Makeup', fromTime: '10:00 AM', toTime: '11:00 AM', price: '800 ETB', icon: '💄', color: 'rose' },
    { id: 4, date: '2026-03-18', serviceId: 2, serviceName: 'Makeup', fromTime: '2:00 PM', toTime: '3:00 PM', price: '800 ETB', icon: '💄', color: 'rose' },
    { id: 5, date: '2026-03-20', serviceId: 3, serviceName: 'Manicure', fromTime: '3:00 PM', toTime: '4:30 PM', price: '600 ETB', icon: '💅', color: 'purple' },
    { id: 6, date: '2026-03-26', serviceId: 4, serviceName: 'Spa', fromTime: '9:00 AM', toTime: '11:00 AM', price: '1200 ETB', icon: '🧖', color: 'blue' },
    { id: 7, date: '2026-03-26', serviceId: 4, serviceName: 'Spa', fromTime: '2:00 PM', toTime: '4:00 PM', price: '1200 ETB', icon: '🧖', color: 'blue' },
    { id: 8, date: '2026-03-28', serviceId: 2, serviceName: 'Makeup', fromTime: '11:00 AM', toTime: '1:00 PM', price: '800 ETB', icon: '💄', color: 'rose' },
    { id: 9, date: '2026-03-30', serviceId: 1, serviceName: 'Hair Styling', fromTime: '10:00 AM', toTime: '12:00 PM', price: '500 ETB', icon: '💇', color: 'amber' },
  ]);

  // Add Service Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newService, setNewService] = useState({
    date: '2026-03-26',
    serviceId: '',
    fromTime: '',
    toTime: '',
  });

  const getAvailabilityForDate = (date) => {
    return availability.filter(a => a.date === date);
  };

  const handleAddService = () => {
    if (newService.serviceId && newService.fromTime && newService.toTime && newService.date) {
      const service = companyData.services.find(s => s.id === parseInt(newService.serviceId));
      
      const newEntry = {
        id: availability.length + 1,
        date: newService.date,
        serviceId: parseInt(newService.serviceId),
        serviceName: service.name,
        fromTime: newService.fromTime,
        toTime: newService.toTime,
        price: service.price,
        icon: service.icon,
        color: service.color?.split('-')[1] || 'amber'
      };
      
      setAvailability([...availability, newEntry]);
      setShowAddModal(false);
      setNewService({ date: '2026-03-26', serviceId: '', fromTime: '', toTime: '' });
    }
  };

  const handleDeleteService = (id) => {
    setAvailability(availability.filter(a => a.id !== id));
  };

  // Stats data
  const stats = [
    { label: 'Total Bookings', value: availability.length, icon: CalendarIcon, color: 'from-violet-500 to-purple-600', bg: 'bg-violet-100' },
    { label: "Today's Bookings", value: availability.filter(a => a.date === new Date().toISOString().split('T')[0]).length, icon: Clock, color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-100' },
    { label: 'Services', value: companyData.services.length, icon: Briefcase, color: 'from-amber-500 to-orange-500', bg: 'bg-amber-100' },
    { label: 'Team', value: '8', icon: Users, color: 'from-emerald-500 to-green-500', bg: 'bg-emerald-100' },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      {/* Sidebar - Glass morphism */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-20'} backdrop-blur-xl bg-white/70 border-r border-white/20 transition-all duration-500 h-full relative flex flex-col shadow-2xl shadow-purple-200/20`}>
        {/* Logo Area with Gradient */}
        <div className="p-8">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-600 via-pink-600 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-300/50 transform hover:scale-105 transition-transform duration-300">
              <span className="text-white font-bold text-2xl">S</span>
            </div>
            {sidebarOpen && (
              <div className="overflow-hidden">
                <h2 className="font-bold text-xl bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent">
                  {companyData.companyName}
                </h2>
                <p className="text-xs text-gray-500 flex items-center mt-1">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
                  <span>Open now · 9:00 AM - 10:00 PM</span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* User Profile Card - Glass */}
        <div className="mx-6 p-5 backdrop-blur-xl bg-gradient-to-br from-purple-100/50 to-pink-100/50 rounded-2xl border border-white/50 shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md">
              S
            </div>
            {sidebarOpen && (
              <div className="flex-1">
                <p className="font-semibold text-gray-800">Admin User</p>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="flex items-center">
                    <Star size={12} className="text-amber-400 fill-current" />
                    <span className="text-xs text-gray-600 ml-1">{companyData.rating}</span>
                  </div>
                  <div className="flex items-center">
                    <Heart size={12} className="text-rose-400" />
                    <span className="text-xs text-gray-600 ml-1">{companyData.reviews}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Menu */}
        <div className="flex-1 p-6">
          <p className="text-xs font-semibold text-gray-400 mb-4 px-3 tracking-wider">NAVIGATION</p>
          <div className="space-y-2">
            {[
              { id: 'dashboard', icon: Home, label: 'Dashboard', gradient: 'from-violet-500 to-purple-500' },
              { id: 'services', icon: Briefcase, label: 'Services', gradient: 'from-blue-500 to-cyan-500' },
              { id: 'calendar', icon: CalendarIcon, label: 'Calendar', gradient: 'from-amber-500 to-orange-500' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                className={`
                  w-full flex items-center space-x-3 px-5 py-4 rounded-xl text-sm transition-all duration-300
                  ${activeMenu === item.id 
                    ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg shadow-${item.gradient.split('-')[1]}-300/50 scale-105` 
                    : 'text-gray-600 hover:bg-white/50 hover:shadow-md'
                  }
                `}
              >
                <item.icon size={20} className={activeMenu === item.id ? 'text-white' : 'text-gray-500'} />
                {sidebarOpen && (
                  <>
                    <span className="flex-1 text-left font-medium">{item.label}</span>
                    <ChevronRight size={16} className={activeMenu === item.id ? 'text-white' : 'text-gray-400'} />
                  </>
                )}
              </button>
            ))}
          </div>

          {/* ADD SERVICE BUTTON - Modern */}
          {sidebarOpen && (userRole === 'admin' || userRole === 'employee') && (
            <div className="mt-8 px-2">
              <button
                onClick={() => setShowAddModal(true)}
                className="group w-full bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 text-white py-4 rounded-xl font-semibold text-sm hover:shadow-2xl hover:shadow-purple-300/50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <Plus size={20} className="relative z-10" />
                <span className="relative z-10">Add Service Slot</span>
              </button>
            </div>
          )}
        </div>

        {/* Bottom */}
        <div className="p-6 border-t border-white/30">
          <button className="w-full flex items-center space-x-3 px-5 py-3 text-sm text-gray-600 hover:bg-white/50 rounded-xl transition-all duration-300 group">
            <Settings size={18} className="group-hover:rotate-90 transition-transform duration-500" />
            {sidebarOpen && <span>Settings</span>}
          </button>
          <button className="w-full flex items-center space-x-3 px-5 py-3 text-sm text-rose-600 hover:bg-rose-50/50 rounded-xl transition-all duration-300 mt-1">
            <LogOut size={18} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header - Glass */}
        <header className="backdrop-blur-xl bg-white/50 border-b border-white/30 px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-700 via-pink-700 to-rose-600 bg-clip-text text-transparent">
                {activeMenu === 'dashboard' && 'Dashboard'}
                {activeMenu === 'services' && 'Available Services'}
                {activeMenu === 'calendar' && 'Calendar'}
              </h1>
              <div className="relative">
                <select 
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value)}
                  className="appearance-none text-sm border-0 bg-white/70 backdrop-blur-sm rounded-xl px-4 py-2 pr-10 focus:ring-2 focus:ring-purple-300 cursor-pointer shadow-sm"
                >
                  <option value="client">👤 View as Client</option>
                  <option value="employee">👥 View as Employee</option>
                  <option value="admin">⚡ View as Admin</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="pl-12 pr-6 py-3 border-0 bg-white/70 backdrop-blur-sm rounded-2xl w-72 text-sm focus:ring-2 focus:ring-purple-300 focus:bg-white/90 transition-all placeholder:text-gray-400"
                />
              </div>
              
              {/* Notifications */}
              <button className="relative p-3 text-gray-600 hover:bg-white/70 backdrop-blur-sm rounded-xl transition-all group">
                <Bell size={20} className="group-hover:rotate-12 transition-transform" />
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse"></span>
              </button>
              
              {/* Profile */}
              <div className="w-11 h-11 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-purple-300/50 cursor-pointer hover:scale-110 transition-transform">
                S
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {/* Dashboard View - MODERN */}
          {activeMenu === 'dashboard' && (
            <div className="space-y-8">
              {/* Hero Section */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-700 via-pink-700 to-rose-600 p-10 text-white">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/10 rounded-full -ml-20 -mb-20"></div>
                
                <div className="relative flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-3 mb-4">
                      <Sparkles size={24} className="text-yellow-300" />
                      <span className="text-sm font-medium tracking-wider text-purple-100">WELCOME BACK</span>
                    </div>
                    <h2 className="text-4xl font-bold mb-3">{companyData.companyName}</h2>
                    <p className="text-purple-100 max-w-2xl text-lg">{companyData.description}</p>
                    
                    <div className="flex items-center space-x-6 mt-6">
                      <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                        <Mail size={16} className="mr-2" />
                        <span className="text-sm">{companyData.email}</span>
                      </div>
                      <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                        <Phone size={16} className="mr-2" />
                        <span className="text-sm">{companyData.phone}</span>
                      </div>
                      <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                        <MapPin size={16} className="mr-2" />
                        <span className="text-sm">{companyData.city}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                      <p className="text-3xl font-bold">4.9</p>
                      <div className="flex items-center mt-1">
                        {[1,2,3,4,5].map(star => (
                          <Star key={star} size={14} className="text-yellow-300 fill-current" />
                        ))}
                      </div>
                      <p className="text-xs mt-1 text-purple-100">328 reviews</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Cards - Modern */}
              <div className="grid grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="group relative backdrop-blur-xl bg-white/70 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/50">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                          <p className="text-4xl font-bold mt-2 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                            {stat.value}
                          </p>
                        </div>
                        <div className={`w-14 h-14 ${stat.bg} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                          <stat.icon size={28} className={`bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
                        </div>
                      </div>
                      <div className="mt-4 flex items-center text-xs text-emerald-600">
                        <TrendingUp size={14} className="mr-1" />
                        <span>+12% from last month</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Today's Schedule */}
              <div className="backdrop-blur-xl bg-white/70 rounded-2xl p-8 shadow-xl border border-white/50">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold flex items-center">
                    <Clock size={20} className="mr-2 text-purple-600" />
                    Today's Schedule
                  </h2>
                  <button className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center">
                    View All <ChevronRight size={16} className="ml-1" />
                  </button>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  {availability.filter(a => a.date === new Date().toISOString().split('T')[0]).map(item => {
                    const service = companyData.services.find(s => s.name === item.serviceName);
                    return (
                      <div key={item.id} className={`${service?.bg} rounded-xl p-5 hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer`}>
                        <div className="flex items-center space-x-3 mb-3">
                          <span className="text-3xl">{item.icon}</span>
                          <div>
                            <p className="font-semibold">{item.serviceName}</p>
                            <p className="text-xs text-gray-500">{item.fromTime} - {item.toTime}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-lg font-bold text-purple-600">{item.price}</p>
                          <button className="text-xs bg-white px-3 py-1.5 rounded-full shadow-sm hover:shadow-md transition">
                            Book Now
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Services View */}
          {activeMenu === 'services' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent">
                  Available Services
                </h2>
                <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium">
                  {availability.length} slots available
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                {availability.map((item) => {
                  const service = companyData.services.find(s => s.name === item.serviceName);
                  return (
                    <div key={item.id} className={`group backdrop-blur-xl bg-white/70 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/50 ${service?.bg}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-16 h-16 bg-gradient-to-br ${service?.color} rounded-2xl flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform`}>
                            {item.icon}
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold">{item.serviceName}</h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {formatDisplayDate(item.date)}
                            </p>
                            <div className="flex items-center mt-2 text-sm text-gray-600">
                              <Clock3 size={14} className="mr-1" />
                              {item.fromTime} - {item.toTime}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-purple-600">{item.price}</p>
                          <p className="text-xs text-gray-400 mt-1">per session</p>
                        </div>
                      </div>
                      
                      <div className="mt-6 flex space-x-3">
                        {userRole === 'client' && (
                          <button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-purple-300/50 transition-all transform hover:scale-105">
                            Book Now
                          </button>
                        )}
                        {(userRole === 'admin' || userRole === 'employee') && (
                          <>
                            <button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-medium hover:shadow-lg transition">
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteService(item.id)}
                              className="px-6 py-3 border-2 border-rose-200 text-rose-600 rounded-xl font-medium hover:bg-rose-50 transition"
                            >
                              <Trash2 size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Calendar View - MODERN */}
          {activeMenu === 'calendar' && (
            <div className="max-w-5xl mx-auto">
              <div className="backdrop-blur-xl bg-white/70 rounded-3xl p-8 shadow-2xl border border-white/50">
                {/* Header with selected date */}
                <div className="mb-8">
                  <p className="text-sm text-gray-500 mb-2 tracking-wider">SELECTED DATE</p>
                  <p className="text-4xl font-light bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent">
                    {selectedDate ? formatDisplayDate(selectedDate) : 'No date selected'}
                  </p>
                </div>

                {/* Month/Year Selection */}
                <div className="flex items-center justify-between mb-8">
                  <button 
                    onClick={goToPreviousMonth}
                    className="p-3 hover:bg-white/70 rounded-xl transition-all hover:shadow-md"
                  >
                    <ChevronLeft size={24} className="text-gray-600" />
                  </button>
                  
                  <div className="flex items-center space-x-4">
                    {/* Month Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setShowMonthDropdown(!showMonthDropdown)}
                        className="flex items-center space-x-3 px-6 py-3 bg-white/70 backdrop-blur-sm rounded-xl hover:shadow-md transition-all"
                      >
                        <span className="font-medium text-lg">{months[currentDate.getMonth()]}</span>
                        <ChevronDown size={18} className="text-gray-500" />
                      </button>
                      
                      {showMonthDropdown && (
                        <div className="absolute top-full left-0 mt-2 w-56 bg-white/90 backdrop-blur-xl rounded-xl shadow-2xl border border-white py-3 z-10">
                          {months.map((month, index) => (
                            <button
                              key={month}
                              onClick={() => selectMonth(index)}
                              className={`w-full text-left px-5 py-3 hover:bg-purple-50 transition ${
                                currentDate.getMonth() === index ? 'bg-purple-100 text-purple-700 font-medium' : ''
                              }`}
                            >
                              {month}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Year Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setShowYearDropdown(!showYearDropdown)}
                        className="flex items-center space-x-3 px-6 py-3 bg-white/70 backdrop-blur-sm rounded-xl hover:shadow-md transition-all"
                      >
                        <span className="font-medium text-lg">{currentDate.getFullYear()}</span>
                        <ChevronDown size={18} className="text-gray-500" />
                      </button>
                      
                      {showYearDropdown && (
                        <div className="absolute top-full left-0 mt-2 w-40 bg-white/90 backdrop-blur-xl rounded-xl shadow-2xl border border-white py-3 z-10 max-h-80 overflow-y-auto">
                          {years.map(year => (
                            <button
                              key={year}
                              onClick={() => selectYear(year)}
                              className={`w-full text-left px-5 py-3 hover:bg-purple-50 transition ${
                                currentDate.getFullYear() === year ? 'bg-purple-100 text-purple-700 font-medium' : ''
                              }`}
                            >
                              {year}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <button 
                    onClick={goToNextMonth}
                    className="p-3 hover:bg-white/70 rounded-xl transition-all hover:shadow-md"
                  >
                    <ChevronRight size={24} className="text-gray-600" />
                  </button>
                </div>

                {/* Week Days */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {weekDays.map(day => (
                    <div key={day} className="text-center text-sm font-semibold text-gray-500 py-3">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2">
                  {buildCalendarDays().map((day, index) => {
                    const isSelected = day.date === selectedDate;
                    const hasService = getAvailabilityForDate(day.date).length > 0;
                    
                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedDate(day.date)}
                        className={`
                          aspect-square flex items-center justify-center text-base rounded-xl transition-all duration-300
                          ${!day.isCurrentMonth ? 'text-gray-300' : 'text-gray-700 hover:bg-white/70 hover:shadow-md'}
                          ${isSelected ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white font-bold shadow-lg scale-105' : ''}
                          ${hasService && day.isCurrentMonth && !isSelected ? 'font-medium' : ''}
                        `}
                      >
                        <div className="relative">
                          {day.day}
                          {hasService && day.isCurrentMonth && !isSelected && (
                            <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-emerald-500 rounded-full ring-2 ring-white"></span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Clear and Today Buttons */}
                <div className="flex items-center justify-end space-x-4 mt-8">
                  <button
                    onClick={() => setSelectedDate('')}
                    className="px-6 py-3 text-gray-600 hover:bg-white/70 rounded-xl text-sm transition-all"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => {
                      const today = new Date();
                      setCurrentDate(today);
                      setSelectedDate(today.toISOString().split('T')[0]);
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-sm hover:shadow-lg hover:shadow-purple-300/50 transition-all transform hover:scale-105"
                  >
                    Today
                  </button>
                </div>

                {/* Selected Date Services */}
                {selectedDate && (
                  <div className="mt-8 border-t border-white/30 pt-8">
                    <h3 className="text-xl font-semibold mb-6 flex items-center">
                      <Sparkles size={20} className="mr-2 text-purple-600" />
                      Services on {formatDisplayDate(selectedDate)}
                    </h3>
                    
                    {getAvailabilityForDate(selectedDate).length > 0 ? (
                      <div className="grid grid-cols-2 gap-4">
                        {getAvailabilityForDate(selectedDate).map(item => {
                          const service = companyData.services.find(s => s.name === item.serviceName);
                          return (
                            <div key={item.id} className={`group ${service?.bg} rounded-xl p-5 hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer`}>
                              <div className="flex items-center space-x-3 mb-3">
                                <span className="text-2xl">{item.icon}</span>
                                <div>
                                  <p className="font-semibold">{item.serviceName}</p>
                                  <p className="text-xs text-gray-500">{item.fromTime} - {item.toTime}</p>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <p className="text-lg font-bold text-purple-600">{item.price}</p>
                                <button className="text-xs bg-white px-3 py-1.5 rounded-full shadow-sm hover:shadow-md transition">
                                  Book
                                </button>
                              </div>
                              {(userRole === 'admin' || userRole === 'employee') && (
                                <button 
                                  onClick={() => handleDeleteService(item.id)}
                                  className="absolute top-3 right-3 p-2 hover:bg-red-100 rounded-lg opacity-0 group-hover:opacity-100 transition"
                                >
                                  <Trash2 size={14} className="text-red-500" />
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CalendarIcon size={32} className="text-purple-400" />
                        </div>
                        <p className="text-gray-500">No services available on this date</p>
                        {(userRole === 'admin' || userRole === 'employee') && (
                          <button
                            onClick={() => setShowAddModal(true)}
                            className="mt-4 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-sm hover:shadow-lg transition-all inline-flex items-center space-x-2"
                          >
                            <Plus size={16} />
                            <span>Add Service</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Add Service Modal - Modern */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/50 animate-in fade-in zoom-in duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent">
                Add Service Slot
              </h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-white/70 rounded-xl transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5">
              {/* Date Selection */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Select Date</label>
                <input
                  type="date"
                  value={newService.date}
                  onChange={(e) => setNewService({...newService, date: e.target.value})}
                  className="w-full p-4 border-0 bg-white/70 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-purple-300 transition"
                />
              </div>

              {/* Service Selection */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Select Service</label>
                <select
                  value={newService.serviceId}
                  onChange={(e) => setNewService({...newService, serviceId: e.target.value})}
                  className="w-full p-4 border-0 bg-white/70 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-purple-300 transition appearance-none cursor-pointer"
                >
                  <option value="">Choose a service</option>
                  {companyData.services.map(service => (
                    <option key={service.id} value={service.id}>
                      {service.icon} {service.name} - {service.price}
                    </option>
                  ))}
                </select>
              </div>

              {/* FROM TIME */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center">
                  <Clock3 size={14} className="mr-1" /> From Time
                </label>
                <select
                  value={newService.fromTime}
                  onChange={(e) => setNewService({...newService, fromTime: e.target.value})}
                  className="w-full p-4 border-0 bg-white/70 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-purple-300 transition appearance-none cursor-pointer"
                >
                  <option value="">Select start time</option>
                  {timeSlots.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>

              {/* TO TIME */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center">
                  <Clock3 size={14} className="mr-1" /> To Time
                </label>
                <select
                  value={newService.toTime}
                  onChange={(e) => setNewService({...newService, toTime: e.target.value})}
                  className="w-full p-4 border-0 bg-white/70 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-purple-300 transition appearance-none cursor-pointer"
                >
                  <option value="">Select end time</option>
                  {timeSlots.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>

              {/* Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleAddService}
                  disabled={!newService.serviceId || !newService.fromTime || !newService.toTime}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-medium hover:shadow-lg hover:shadow-purple-300/50 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Service
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-white/70 backdrop-blur-sm text-gray-700 py-4 rounded-xl font-medium hover:bg-white/90 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}