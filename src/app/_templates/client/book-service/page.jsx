"use client";

import React, { useState } from 'react';
import { 
  LayoutDashboard, Calendar, PlusCircle, CreditCard, User, 
  Search, Bell, LogOut, CheckCircle2, ShieldCheck, Lock, ArrowRight,
  Stethoscope, Settings2, HeartPulse, FlaskConical, Eye, Settings 
} from 'lucide-react';

const BookService = () => {
  // --- STATE MANAGEMENT ---
  const [activeCategory, setActiveCategory] = useState('Health');
  const [selectedServiceId, setSelectedServiceId] = useState(1); // Default selection

  // --- DATA ---
  const allServices = [
    { id: 1, name: "General Checkup", time: "30 min", price: "500", category: "Health", popular: true, icon: <Stethoscope size={24} /> },
    { id: 2, name: "Oil Change", time: "45 min", price: "350", category: "Auto", popular: true, icon: <Settings size={24} /> },
    { id: 3, name: "Dental Cleaning", time: "60 min", price: "600", category: "Health", popular: true, icon: <HeartPulse size={24} /> },
    { id: 4, name: "Lab Test", desc: "Comprehensive blood panel and analysis", price: "450", category: "Health", popular: false, icon: <FlaskConical size={18} /> },
    { id: 5, name: "Annual Checkup", desc: "Yearly physical exam and consultation", price: "800", category: "Health", popular: false, icon: <ShieldCheck size={18} /> },
    { id: 6, name: "Eye Exam", desc: "Standard vision testing and prescription", price: "300", category: "Health", popular: false, icon: <Eye size={18} /> },
  ];

  // --- FILTERING LOGIC ---
  const filteredPopular = allServices.filter(s => 
    s.popular && (activeCategory === 'All Categories' || s.category === activeCategory)
  );

  const filteredList = allServices.filter(s => 
    !s.popular && (activeCategory === 'All Categories' || s.category === activeCategory)
  );

  return (
    <div className="flex min-h-screen bg-[#F3F6F9] global-page-font text-slate-700">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col fixed h-full z-20">
        <div className="p-8">
          <h1 className="text-[#2B5A9A] font-black text-2xl tracking-tight">ServeSync+</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest -mt-1">Client Portal</p>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <SidebarItem icon={<LayoutDashboard size={20}/>} label="Dashboard" />
          <SidebarItem icon={<Calendar size={20}/>} label="Appointments" />
          <SidebarItem icon={<PlusCircle size={20}/>} label="Book Service" active />
          <SidebarItem icon={<CreditCard size={20}/>} label="Payments" />
          <SidebarItem icon={<User size={20}/>} label="Profile" />
        </nav>

        <div className="p-6 border-t border-slate-50">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-slate-100">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" alt="Sarah" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">Sarah Johnson</p>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                <p className="text-[9px] text-slate-400 font-bold uppercase">Verified Client</p>
              </div>
            </div>
          </div>
          <button className="flex items-center gap-2 text-slate-400 hover:text-red-500 text-sm font-bold transition-colors">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        
        {/* HEADER */}
        <header className="h-20 bg-white/80 backdrop-blur-md px-10 flex items-center justify-between sticky top-0 z-10 border-b border-slate-50">
          <div className="relative w-[450px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type="text" 
              placeholder="Search for appointments..." 
              className="w-full pl-12 pr-4 py-3 bg-[#EEF2F8] border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-100 outline-none placeholder:text-slate-400 transition-all" 
            />
          </div>
          
          <div className="flex items-center gap-8">
            <div className="text-right">
              <p className="text-xs font-black text-slate-800 uppercase tracking-tighter">April 23, 2026</p>
              <p className="text-[9px] text-slate-400 font-bold text-right uppercase">Thursday</p>
            </div>
            <div className="relative p-2 bg-slate-50 rounded-xl cursor-pointer">
              <Bell size={20} className="text-slate-400" />
              <span className="absolute top-1 right-1 bg-red-500 text-white text-[8px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">3</span>
            </div>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
              <div className="text-right">
                <p className="text-xs font-bold text-slate-800">Sarah Johnson</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase">Administrator</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-200 overflow-hidden ring-2 ring-blue-50">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" alt="Sarah" />
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="p-10 space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-1">Book a Service</h2>
            <p className="text-slate-400 text-sm font-medium">Schedule your next appointment in just a few clicks</p>
          </div>

          {/* STEP PROGRESS */}
          <div className="max-w-4xl mx-auto py-6 relative">
             <div className="absolute top-[42px] left-0 w-full h-[2px] bg-slate-100 z-0"></div>
             <div className="flex justify-between relative z-10">
               <Step number="1" label="Select Service" active />
               <Step number="2" label="Choose Provider" />
               <Step number="3" label="Pick Time" />
               <Step number="4" label="Confirm & Pay" />
             </div>
          </div>

          {/* MAIN FORM CARD */}
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-10">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-xl font-bold text-[#003366]">Step 1: Select a Service</h3>
                <div className="flex bg-[#F8FAFC] p-1.5 rounded-xl border border-slate-100">
                  <FilterBtn 
                    label="All Categories" 
                    active={activeCategory === 'All Categories'} 
                    onClick={() => setActiveCategory('All Categories')} 
                  />
                  <FilterBtn 
                    label="Health" 
                    active={activeCategory === 'Health'} 
                    onClick={() => setActiveCategory('Health')} 
                  />
                </div>
              </div>

              {/* POPULAR GRID */}
              <div className="mb-12">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.15em]">Popular Services</h4>
                  <button className="text-[11px] font-bold text-blue-600 hover:text-blue-800">View All</button>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  {filteredPopular.map(service => (
                    <PopularCard 
                      key={service.id} 
                      service={service}
                      selected={selectedServiceId === service.id}
                      onClick={() => setSelectedServiceId(service.id)}
                    />
                  ))}
                </div>
              </div>

              {/* LIST VIEW */}
              <div className="mb-10">
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.15em] mb-6">All Services List</h4>
                <div className="space-y-4">
                  {filteredList.map(service => (
                    <ListRow 
                      key={service.id} 
                      service={service}
                      selected={selectedServiceId === service.id}
                      onClick={() => setSelectedServiceId(service.id)}
                    />
                  ))}
                </div>
              </div>

              {/* FOOTER ACTIONS */}
              <div className="flex justify-between items-center pt-8 border-t border-slate-50">
                <button 
                  onClick={() => setSelectedServiceId(null)}
                  className="text-[#2B5A9A] text-sm font-bold hover:underline underline-offset-4"
                >
                  Clear Selection
                </button>
                <button className="flex items-center gap-3 bg-[#003366] text-white px-10 py-4 rounded-xl text-sm font-bold hover:bg-[#002244] transition-all shadow-lg shadow-blue-900/10">
                  Continue to Provider <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* BOTTOM INFO CARDS */}
          <div className="grid grid-cols-3 gap-8 pb-10">
            <FeatureCard 
              icon={<CheckCircle2 className="text-emerald-500" size={24} />} 
              title="Verified Professionals" 
              text="All our service providers go through a rigorous background check and verification process."
            />
            <FeatureCard 
              icon={<Lock className="text-[#2B5A9A]" size={24} />} 
              title="Secure Payments" 
              text="Your transactions are protected with enterprise-grade encryption and secure gateway protocols."
            />
            <div className="bg-[#003366] rounded-3xl p-8 text-white relative overflow-hidden group">
               <div className="relative z-10">
                 <p className="text-base font-bold mb-1">Need Help?</p>
                 <p className="text-xs text-blue-100/70 mb-6 leading-relaxed max-w-[200px]">Our support team is available 24/7 to assist with your booking.</p>
                 <button className="bg-white text-[#003366] px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-blue-50 transition-colors shadow-xl">Contact Support</button>
               </div>
               <div className="absolute bottom-[-20%] right-[-10%] opacity-10 group-hover:scale-110 transition-transform duration-700">
                 <Settings2 size={160} />
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// --- HELPER COMPONENTS ---

const SidebarItem = ({ icon, label, active = false }) => (
  <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl cursor-pointer transition-all ${active ? 'bg-[#EEF2F8] text-[#2B5A9A] border-r-[4px] border-[#2B5A9A] rounded-r-none' : 'text-slate-400 hover:bg-slate-50'}`}>
    <div className={`${active ? 'text-[#2B5A9A]' : 'text-slate-400'}`}>{icon}</div>
    <span className={`text-sm font-bold ${active ? 'text-[#2B5A9A]' : 'text-slate-500'}`}>{label}</span>
  </div>
);

const Step = ({ number, label, active }) => (
  <div className="flex flex-col items-center gap-3">
    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold border-4 border-white shadow-lg transition-all ${active ? 'bg-[#003366] text-white' : 'bg-white text-slate-300'}`}>
      {number}
    </div>
    <span className={`text-[10px] font-black uppercase tracking-wider ${active ? 'text-[#2B5A9A]' : 'text-slate-400'}`}>{label}</span>
  </div>
);

const FilterBtn = ({ label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`px-6 py-2.5 rounded-xl text-[11px] font-bold transition-all ${active ? 'bg-[#003366] text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'}`}
  >
    {label}
  </button>
);

const PopularCard = ({ service, selected, onClick }) => (
  <div 
    onClick={onClick}
    className={`relative p-8 rounded-[28px] border-2 transition-all cursor-pointer bg-white ${selected ? 'border-[#2B5A9A] bg-[#F4F8FC]' : 'border-slate-100 hover:border-blue-200'}`}
  >
    {service.id === 1 && (
      <span className="absolute top-0 left-8 -translate-y-1/2 bg-[#003366] text-white text-[8px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">Most Popular</span>
    )}
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${selected ? 'bg-[#003366] text-white' : 'bg-[#F0F4F8] text-[#2B5A9A]'}`}>
      {service.icon}
    </div>
    <div className="flex justify-between items-start">
      <div>
        <h5 className="text-base font-bold text-slate-800 mb-0.5">{service.name}</h5>
        <p className="text-[10px] text-slate-400 font-bold mb-6 flex items-center gap-1.5"><Calendar size={10}/> {service.time}</p>
        <p className="text-2xl font-black text-[#003366] tracking-tight">{service.price} <span className="text-[11px] text-slate-400 font-bold uppercase ml-1">ETB</span></p>
      </div>
      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selected ? 'bg-[#2B5A9A] border-[#2B5A9A]' : 'border-slate-200'}`}>
        {selected && <CheckCircle2 size={16} className="text-white" />}
      </div>
    </div>
  </div>
);

const ListRow = ({ service, selected, onClick }) => (
  <div 
    onClick={onClick}
    className={`flex items-center justify-between p-6 rounded-3xl border-2 transition-all cursor-pointer bg-white ${selected ? 'border-[#2B5A9A] bg-[#F4F8FC]' : 'border-slate-50 hover:border-blue-100 shadow-sm'}`}
  >
    <div className="flex items-center gap-5">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${selected ? 'bg-[#003366] text-white' : 'bg-[#F0F4F8] text-[#2B5A9A]'}`}>
        {service.icon}
      </div>
      <div>
        <h5 className="text-sm font-bold text-slate-800 mb-0.5">{service.name}</h5>
        <p className="text-[11px] text-slate-400 font-medium">{service.desc}</p>
      </div>
    </div>
    <div className="flex items-center gap-8">
      <p className="text-base font-black text-slate-800">{service.price} <span className="text-[10px] text-slate-400 font-bold ml-1">ETB</span></p>
      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selected ? 'bg-[#2B5A9A] border-[#2B5A9A]' : 'border-slate-200'}`}>
        {selected && <CheckCircle2 size={16} className="text-white" />}
      </div>
    </div>
  </div>
);

const FeatureCard = ({ icon, title, text }) => (
  <div className="bg-white rounded-3xl p-8 border border-slate-50 shadow-sm flex flex-col items-start gap-6">
    <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-slate-50">
      {icon}
    </div>
    <div>
      <p className="text-base font-bold text-slate-800 mb-2">{title}</p>
      <p className="text-[11px] text-slate-400 leading-relaxed font-medium">{text}</p>
    </div>
  </div>
);

export default BookService;