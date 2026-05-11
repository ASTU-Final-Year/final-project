"use client";

import { useSessionStore } from "@/store";
import { redirect, RedirectType, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { 
  Search, Bell, HelpCircle, Calendar, Download, Plus, 
  Users, Briefcase, BarChart3, Settings, LogOut, 
  ChevronLeft, ChevronRight, MoreVertical, AlertTriangle, 
  CheckCircle2, Clock, FileText, UserPlus, TrendingUp, X,
  Upload
} from 'lucide-react';

export default function OrganizationDashboard() {
  const session = useSessionStore(({ session }) => session);
  const router = useRouter();
  const [_loaded, _setLoaded] = useState(false);
  
  // Ref for the hidden file input
  const fileInputRef = useRef(null);

  // --- FUNCTIONAL STATES ---
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(24);
  const [isUploading, setIsUploading] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (!_loaded) (async () => _setLoaded(true))();
    if (_loaded && session?.user == null) {
      return redirect("/login", RedirectType.push);
    }
  }, [_loaded, session?.user]);

  // --- FILE UPLOAD HANDLERS ---
  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsUploading(true);
      
      // Simulate an upload process
      setTimeout(() => {
        setIsUploading(false);
        showToast(`File "${file.name}" uploaded successfully!`);
        // Reset the input so the same file can be uploaded again if needed
        event.target.value = '';
      }, 1500);
    }
  };

  const showToast = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  if (!_loaded || session?.user == null) {
    return <div className="flex h-screen items-center justify-center font-bold text-slate-400">Loading ServeSync+...</div>;
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-700 font-sans">
      
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept=".csv,.xlsx,.pdf,.json"
      />

      {/* MODAL: ADD NEW SERVICE */}
      {showServiceForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setShowServiceForm(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Add New Service</h3>
            <p className="text-sm text-slate-500 mb-6">Enter details to register a new service in the system.</p>
            
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setShowServiceForm(false); showToast("Service Created!"); }}>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Service Name</label>
                <input type="text" placeholder="General Consultation" className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Price (ETB)</label>
                  <input type="number" placeholder="400" className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Duration (Min)</label>
                  <input type="number" placeholder="30" className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-sm outline-none" />
                </div>
              </div>
              <button type="submit" className="w-full py-3 bg-[#2B5A9A] text-white font-bold rounded-xl shadow-lg hover:bg-[#1e447a] transition-all transform active:scale-[0.98]">Create Service</button>
            </form>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-300">
          <CheckCircle2 size={18} className="text-emerald-400" />
          <span className="text-sm font-bold">{notification}</span>
        </div>
      )}

      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col fixed h-full z-20">
        <div className="p-8">
          <h1 className="text-[#2B5A9A] font-black text-2xl tracking-tight">ServeSync+</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest -mt-1">Admin Console</p>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          <SidebarItem icon={<LayoutDashboard size={18}/>} label="Dashboard" active />
          <SidebarItem icon={<Briefcase size={18}/>} label="Services" />
          <SidebarItem icon={<Users size={18}/>} label="Employees" />
          <SidebarItem icon={<Calendar size={18}/>} label="Calendar" />
          <SidebarItem icon={<BarChart3 size={18}/>} label="Reports" />
          <SidebarItem icon={<Settings size={18}/>} label="Settings" />
        </nav>
        <div className="p-6 border-t border-slate-50">
          <button className="flex items-center gap-2 text-slate-400 hover:text-red-500 text-sm font-bold transition-colors w-full">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* TOP NAVBAR */}
        <header className="h-16 bg-white border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
            <input type="text" placeholder="Search operations..." className="w-full pl-10 pr-4 py-2 bg-[#F1F5F9] border-none rounded-lg text-sm outline-none" />
          </div>
          <div className="flex items-center gap-6">
            <Bell size={18} className="text-slate-400 cursor-pointer" />
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs font-bold text-slate-800">Organization Admin</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Hospital Branch</p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-slate-800 overflow-hidden ring-2 ring-slate-50">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Abebe" alt="Admin" />
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 space-y-8">
          {/* HEADER SECTION */}
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Good Morning Mr. Abebe</h2>
              <p className="text-sm text-slate-400">Today is Tuesday, Oct {selectedDate}, 2023.</p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold shadow-sm">
                <Calendar size={14} className="text-slate-400"/> Oct {selectedDate}, 2023
              </button>
              <button 
                onClick={handleTriggerUpload} 
                className="flex items-center gap-2 px-6 py-2 bg-[#2B5A9A] text-white rounded-lg text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-95"
                disabled={isUploading}
              >
                {isUploading ? <Clock size={14} className="animate-spin" /> : <Upload size={14}/>}
                {isUploading ? "exporting..." : "Export stats"}
              </button>
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <section>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Quick Management Actions</p>
            <div className="grid grid-cols-4 gap-4">
              <ActionButton onClick={() => setShowServiceForm(true)} icon={<Plus size={18}/>} label="Add New Service" />
              <ActionButton onClick={() => showToast("Scheduler opened")} icon={<Calendar size={18}/>} label="Schedule Appointment" />
              <ActionButton onClick={() => showToast("Employee Registration")} icon={<UserPlus size={18}/>} label="Register Employee" />
              <ActionButton onClick={() => showToast("Generating Report...")} icon={<FileText size={18}/>} label="Generate Report" />
            </div>
          </section>

          {/* MIDDLE GRID: SCHEDULE & UTILIZATION */}
          <div className="grid grid-cols-3 gap-8">
            <div className="col-span-2 bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-800">Today's Schedule</h3>
                <button onClick={() => showToast("Viewing full calendar")} className="text-xs font-bold text-blue-600 hover:underline">View Calendar</button>
              </div>
              <div className="space-y-4">
                <ScheduleItem time="09:00" ampm="AM" title="Medical Checkup - Dr. Abebe" sub="Patient: Abebe K." status="IN PROGRESS" statusColor="bg-blue-50 text-blue-600" dotColor="bg-blue-500" />
                <ScheduleItem time="10:30" ampm="AM" title="Urgent Care - Bay 2" sub="Customer: Mulugeta T." status="WAITING" statusColor="bg-orange-50 text-orange-600" dotColor="bg-orange-500" />
              </div>
            </div>

            <div className="space-y-6">
              {/* MINI CALENDAR */}
              <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold">October 2023</h3>
                  <div className="flex gap-2 text-slate-400">
                    <ChevronLeft size={16} className="cursor-pointer hover:text-slate-600" onClick={() => setSelectedDate(d => d-1)}/>
                    <ChevronRight size={16} className="cursor-pointer hover:text-slate-600" onClick={() => setSelectedDate(d => d+1)}/>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center">
                  {['M','T','W','T','F','S','S'].map((d, i) => <span key={i} className="text-[10px] font-bold text-slate-300 py-2">{d}</span>)}
                  {[22,23,24,25,26,27,28].map((d) => (
                    <span key={d} onClick={() => setSelectedDate(d)} className={`text-xs py-2 rounded-lg font-bold cursor-pointer transition-all ${d === selectedDate ? 'bg-[#2B5A9A] text-white' : 'hover:bg-slate-50'}`}>{d}</span>
                  ))}
                </div>
              </div>

              {/* CAPACITY UTILIZATION */}
              <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
                <h3 className="text-sm font-bold mb-6">Capacity Utilization</h3>
                <div className="h-32 flex items-end justify-between px-2">
                  {[40, 65, 45, 85, 55].map((val, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 group cursor-pointer">
                      <div className="w-8 bg-slate-50 rounded-t-sm relative h-24 overflow-hidden border border-slate-50">
                        <div style={{ height: `${val}%` }} className="absolute bottom-0 w-full bg-blue-100 group-hover:bg-blue-200 transition-all duration-500"></div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-300 group-hover:text-slate-500">{['M','T','W','T','F'][i]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM SECTION */}
          <div className="grid grid-cols-3 gap-8">
            <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-6">Top Services</h3>
              <div className="space-y-5">
                <ProgressBar label="General Checkup" percent="42%" color="bg-[#2B5A9A]" />
                <ProgressBar label="Oil Change" percent="28%" color="bg-blue-300" />
                <ProgressBar label="Consultation" percent="15%" color="bg-slate-200" />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-6">Employee Performance</h3>
              <div className="space-y-4">
                <PerformanceRow name="Dr. Abebe" score="98%" />
                <PerformanceRow name="Dr. Genet" score="92%" />
                <PerformanceRow name="Mulugeta T." score="85%" />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-800">Critical Alerts</h3>
                <span className="bg-red-50 text-red-600 text-[8px] font-black px-2 py-1 rounded">ACTION REQUIRED</span>
              </div>
              <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                <div className="flex gap-3">
                  <AlertTriangle size={16} className="text-red-500 shrink-0" />
                  <div className="text-xs">
                    <p className="font-bold text-slate-900">Inventory Low: Gloves</p>
                    <p className="text-slate-500 mt-1">Stock level below 15%.</p>
                    <button onClick={() => showToast("Order Placed!")} className="font-black text-red-600 uppercase mt-2 underline block">Order Now</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

// --- SHARED COMPONENTS ---
const SidebarItem = ({ icon, label, active = false }) => (
  <div className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all ${active ? 'bg-[#EEF2F8] text-[#2B5A9A] font-bold' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}>
    {icon} <span className="text-sm">{label}</span>
  </div>
);

const ActionButton = ({ icon, label, onClick }) => (
  <button onClick={onClick} className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-xl hover:shadow-md transition-all group w-full text-left">
    <div className="p-2 bg-slate-50 rounded-lg group-hover:text-blue-500 group-hover:bg-blue-50 transition-colors">{icon}</div>
    <span className="text-xs font-bold text-slate-700">{label}</span>
  </button>
);

const ScheduleItem = ({ time, ampm, title, sub, status, statusColor, dotColor }) => (
  <div className="flex gap-4 items-start py-2 group">
    <div className="w-12 text-center pt-2">
      <p className="text-xs font-bold text-slate-900">{time}</p>
      <p className="text-[8px] font-bold text-slate-400 uppercase">{ampm}</p>
    </div>
    <div className={`w-2.5 h-2.5 rounded-full ${dotColor} mt-2 ring-4 ring-white`}></div>
    <div className="flex-1 bg-white border border-slate-100 rounded-[12px] p-4 flex items-center justify-between shadow-sm group-hover:border-blue-100 group-hover:shadow-md transition-all cursor-pointer">
      <div><p className="text-sm font-bold text-slate-800">{title}</p><p className="text-[10px] text-slate-400">{sub}</p></div>
      <span className={`text-[8px] font-black px-3 py-1.5 rounded-full ${statusColor}`}>{status}</span>
    </div>
  </div>
);

const ProgressBar = ({ label, percent, color }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-[11px] font-bold"><span>{label}</span><span className="text-slate-400">{percent}</span></div>
    <div className="h-2 bg-slate-50 rounded-full overflow-hidden"><div style={{width: percent}} className={`h-full ${color} rounded-full transition-all duration-1000`}></div></div>
  </div>
);

const PerformanceRow = ({ name, score }) => (
  <div className="flex items-center gap-3">
    <div className="w-8 h-8 rounded-full bg-slate-100 shrink-0" />
    <div className="flex-1">
      <div className="flex justify-between text-[11px] font-bold mb-1"><span>{name}</span><span className="text-slate-400">{score}</span></div>
      <div className="h-1.5 bg-slate-50 rounded-full"><div style={{width: score}} className="h-full bg-emerald-500 rounded-full"></div></div>
    </div>
  </div>
);

const LayoutDashboard = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" /><rect x="14" y="12" width="7" height="9" /><rect x="3" y="16" width="7" height="5" />
  </svg>
);