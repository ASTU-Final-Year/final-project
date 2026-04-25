"use client";

import React, { useState, useRef } from 'react';
import { 
  LayoutDashboard, Calendar, PlusCircle, CreditCard, User, 
  Search, Bell, LogOut, Camera, Edit2, 
  Settings2, ShieldCheck, Monitor, MapPin, 
  ChevronDown, Trash2, CheckCircle2, X
} from 'lucide-react';

const ProfilePage = () => {
  // --- STATE MANAGEMENT ---
  const [isEditing, setIsEditing] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState("https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah");
  const fileInputRef = useRef(null);

  const [userData, setUserData] = useState({
    fullName: "Sarah Johnson",
    dob: "March 15, 1985",
    gender: "Female",
    email: "sarah.j@email.com",
    phone: "+251 912 345 678",
    address: "Bole Road, Addis Ababa, Ethiopia"
  });

  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    reminder: true,
    promo: false
  });

  const [regional, setRegional] = useState({
    language: "English (US)",
    currency: "ETB (Birr)",
    timezone: "EAT (UTC +3)"
  });

  // --- HANDLERS ---
  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditSave = () => {
    if (isEditing) {
      // In a real app, you'd send userData to an API here
      console.log("Saving data:", userData);
    }
    setIsEditing(!isEditing);
  };

  const handleUpdateUser = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  // FIXED: Standardized function name and logic
  const toggleNotification = (key) => {
    setNotifications(prev => ({ 
      ...prev, 
      [key]: !prev[key] 
    }));
  };

  const handleDeleteAccount = () => {
    if(confirm("DANGER ZONE: Are you sure you want to permanently delete your ServeSync+ account? This action cannot be undone.")) {
      alert("Account deletion request submitted.");
    }
  };

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
          <SidebarItem icon={<PlusCircle size={20}/>} label="Book Service" />
          <SidebarItem icon={<CreditCard size={20}/>} label="Payments" />
          <SidebarItem icon={<User size={20}/>} label="Profile" active />
        </nav>

        <div className="p-6 border-t border-slate-50">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-slate-100">
               <img src={profilePhoto} alt="Sarah" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">Sarah Johnson</p>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                <p className="text-[9px] text-slate-400 font-bold uppercase">Verified Client</p>
              </div>
            </div>
          </div>
          <button className="flex items-center gap-2 text-slate-400 hover:text-red-600 text-sm font-bold transition-colors">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        
        <header className="h-20 bg-white/80 backdrop-blur-md px-10 flex items-center justify-between sticky top-0 z-10 border-b border-slate-50">
          <div className="relative w-[450px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input type="text" placeholder="Search system..." className="w-full pl-12 pr-4 py-3 bg-[#EEF2F8] border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-100 outline-none" />
          </div>
          
          <div className="flex items-center gap-8">
            <div className="text-right">
              <p className="text-sm font-bold text-slate-800 uppercase tracking-tighter">April 23, 2026</p>
              <p className="text-[10px] text-slate-400 font-bold text-right uppercase">Thursday</p>
            </div>
            <div className="relative cursor-pointer">
              <Bell size={20} className="text-slate-400" />
              <span className="absolute top-1 right-1 bg-red-500 text-white text-[8px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">3</span>
            </div>
            <div className="h-8 w-[1px] bg-slate-200"></div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs font-bold text-slate-800">Sarah Johnson</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Administrator</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-200 overflow-hidden ring-2 ring-blue-50">
                <img src={profilePhoto} alt="Sarah" />
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 space-y-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">My Profile</h2>
            <p className="text-sm text-slate-400">View and manage your personal information and preferences</p>
          </div>

          <div className="grid grid-cols-12 gap-8">
            
            <div className="col-span-4 space-y-8">
              {/* Profile Card */}
              <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm text-center relative">
                <div className="relative inline-block mb-4">
                  <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-slate-100">
                    <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                  </div>
                  <button 
                    onClick={() => fileInputRef.current.click()}
                    className="absolute bottom-1 right-1 p-2 bg-[#2B5A9A] text-white rounded-full border-4 border-white shadow-md hover:bg-[#1e447a] transition-all"
                  >
                    <Camera size={16} />
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handlePhotoChange} className="hidden" accept="image/*" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">{userData.fullName}</h3>
                <p className="text-xs text-slate-400 mb-6 font-medium">Member since Jan 2024</p>
                <button 
                  onClick={() => fileInputRef.current.click()}
                  className="px-6 py-2 bg-blue-50 text-[#2B5A9A] text-xs font-bold rounded-lg border border-blue-100 hover:bg-blue-100 transition-all"
                >
                  Change Photo
                </button>
              </div>

              {/* Account Overview */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <h4 className="text-[11px] font-black uppercase text-[#2B5A9A] tracking-widest mb-6">Account Overview</h4>
                <div className="grid grid-cols-2 gap-4">
                  <StatCard value="12" label="Total Appointments" />
                  <StatCard value="8" label="Completed Services" />
                  <StatCard value="4.8 ★" label="Avg Rating" />
                  <StatCard value="2" label="Saved Payments" />
                </div>
              </div>

              {/* Regional Preferences */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <h4 className="text-[11px] font-black uppercase text-[#2B5A9A] tracking-widest mb-6">Regional Preferences</h4>
                <div className="space-y-4">
                  <DropdownSelector label="Language" value={regional.language} options={['English (US)', 'French (FR)', 'Amharic (ET)']} onSelect={(v) => setRegional({...regional, language: v})}/>
                  <DropdownSelector label="Currency" value={regional.currency} options={['ETB (Birr)', 'USD ($)', 'EUR (€)']} onSelect={(v) => setRegional({...regional, currency: v})}/>
                  <DropdownSelector label="Time Zone" value={regional.timezone} options={['EAT (UTC +3)', 'GMT (UTC +0)', 'EST (UTC -5)']} onSelect={(v) => setRegional({...regional, timezone: v})}/>
                </div>
              </div>
            </div>

            <div className="col-span-8 space-y-8">
              
              {/* Personal Information */}
              <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm relative">
                <div className="flex justify-between items-center mb-8">
                  <h4 className="text-[11px] font-black uppercase text-[#2B5A9A] tracking-widest">Personal Information</h4>
                  <button 
                    onClick={handleEditSave}
                    className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-blue-600 hover:bg-blue-50 px-3 py-1 rounded-lg transition-colors"
                  >
                    {isEditing ? <><CheckCircle2 size={12}/> Save Changes</> : <><Edit2 size={12} /> Edit Profile</>}
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                  <EditableField label="Full Name" name="fullName" value={userData.fullName} editing={isEditing} onChange={handleUpdateUser} />
                  <EditableField label="Date of Birth" name="dob" value={userData.dob} editing={isEditing} onChange={handleUpdateUser} />
                  <EditableField label="Gender" name="gender" value={userData.gender} editing={isEditing} onChange={handleUpdateUser} isSelect/>
                  <EditableField label="Email Address" name="email" value={userData.email} editing={isEditing} onChange={handleUpdateUser} isVerified/>
                  <EditableField label="Phone Number" name="phone" value={userData.phone} editing={isEditing} onChange={handleUpdateUser} />
                  <EditableField label="Primary Address" name="address" value={userData.address} editing={isEditing} onChange={handleUpdateUser} />
                </div>
              </div>

              {/* Notification Preferences - FIXED CLICK HANDLERS */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <h4 className="text-[11px] font-black uppercase text-[#2B5A9A] tracking-widest mb-6">Notification Preferences</h4>
                <div className="space-y-4 divide-y divide-slate-50">
                  <ToggleRow label="Email Notifications" desc="Receive service updates and billing reports via email." active={notifications.email} onClick={() => toggleNotification('email')} />
                  <ToggleRow label="SMS Notifications" desc="Get real-time booking alerts on your mobile phone." active={notifications.sms} onClick={() => toggleNotification('sms')} />
                  <ToggleRow label="Appointment Reminders" desc="Automated reminders for upcoming health services." active={notifications.reminder} onClick={() => toggleNotification('reminder')} />
                  <ToggleRow label="Promotional Offers" desc="Be the first to hear about seasonal discounts." active={notifications.promo} onClick={() => toggleNotification('promo')} />
                </div>
              </div>

              {/* Account Security */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <h4 className="text-[11px] font-black uppercase text-[#2B5A9A] tracking-widest mb-6">Account Security</h4>
                <div className="grid grid-cols-3 gap-4">
                  <SecurityCard icon={<Settings2 size={18}/>} label="Change Password" desc="Last updated 3 months ago"/>
                  <SecurityCard icon={<ShieldCheck size={18}/>} label="2-Factor Auth" desc="CURRENTLY ENABLED" isStatus/>
                  <SecurityCard icon={<Monitor size={18}/>} label="Active Sessions" desc="2 devices currently logged in"/>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-white rounded-2xl p-6 border border-red-100 shadow-sm hover:border-red-200 transition-colors">
                <div className="flex justify-between items-start">
                    <div>
                        <h4 className="text-[11px] font-black uppercase text-red-600 tracking-widest mb-1.5">Danger Zone</h4>
                        <p className="text-xs text-slate-400 font-medium leading-relaxed">Permanently delete your ServeSync+ account and all associated data. This action cannot be undone.</p>
                    </div>
                    <button 
                        onClick={handleDeleteAccount}
                        className="flex items-center gap-2 text-[10px] font-black text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg border border-red-100 transition-colors"
                    >
                      <Trash2 size={14}/> Delete Account
                    </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const SidebarItem = ({ icon, label, active = false }) => (
  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${active ? 'bg-blue-50 text-[#2B5A9A]' : 'text-slate-400 hover:bg-slate-50'}`}>
    {icon}
    <span className={`text-sm font-bold ${active ? 'text-[#2B5A9A]' : 'text-slate-500'}`}>{label}</span>
  </div>
);

const StatCard = ({ value, label }) => (
  <div className="bg-[#F8FAFC] rounded-xl p-4 text-center flex flex-col items-center justify-center min-h-[70px] border border-slate-50">
    <span className="text-xl font-black text-[#2B5A9A]">{value}</span>
    <span className="text-[9px] text-slate-400 font-black uppercase mt-1 tracking-tighter text-center">{label}</span>
  </div>
);

const EditableField = ({ label, name, value, editing, onChange, isVerified, isSelect }) => (
  <div>
    <p className="text-[10px] text-slate-400 font-bold mb-1">{label}</p>
    {editing ? (
      isSelect ? (
        <select name={name} value={value} onChange={onChange} className="w-full text-sm font-bold text-slate-800 border-b border-blue-200 focus:border-blue-500 outline-none pb-1.5 bg-white">
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Other">Other</option>
        </select>
      ) : (
        <input 
            name={name}
            value={value}
            onChange={onChange}
            className="w-full text-sm font-bold text-slate-800 border-b border-blue-200 focus:border-blue-500 outline-none pb-1.5"
        />
      )
    ) : (
      <div className="flex items-center gap-2">
        <p className="text-sm font-bold text-slate-800">{value}</p>
        {isVerified && <span className="bg-emerald-50 text-emerald-600 text-[8px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider">✓ Verified</span>}
      </div>
    )}
  </div>
);

const ToggleRow = ({ label, desc, active, onClick }) => (
  <div className="flex justify-between items-center py-4 group">
    <div>
        <span className="text-sm text-slate-800 font-bold">{label}</span>
        <p className="text-xs text-slate-400 font-medium">{desc}</p>
    </div>
    <div 
      onClick={onClick}
      className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-200 ${active ? 'bg-[#2B5A9A]' : 'bg-slate-200'}`}
    >
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-200 ${active ? 'left-7' : 'left-1'}`}></div>
    </div>
  </div>
);

const SecurityCard = ({ icon, label, desc, isStatus }) => (
  <div className="flex flex-col items-center justify-center p-5 border border-slate-50 bg-[#F8FAFC] rounded-xl text-center min-h-[100px] cursor-pointer hover:bg-white hover:shadow-sm transition-all">
    <div className="text-slate-700 mb-2">{icon}</div>
    <span className="text-[11px] font-bold text-slate-800">{label}</span>
    <span className={`text-[9px] font-bold uppercase mt-1 ${isStatus ? 'bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded' : 'text-slate-400'}`}>{desc}</span>
  </div>
);

const DropdownSelector = ({ label, value, options, onSelect }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="relative">
            <p className="text-[10px] text-slate-400 font-bold mb-1">{label}</p>
            <button 
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-sm text-slate-800 hover:border-slate-200 transition-colors"
            >
                {value} <ChevronDown size={16} className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}/>
            </button>
            {open && (
                <div className="absolute top-full left-0 w-full mt-1 bg-white border border-slate-100 rounded-lg shadow-lg z-20 space-y-1 p-1">
                    {options.map(opt => (
                        <button key={opt} onClick={() => {onSelect(opt); setOpen(false);}} className="w-full text-left text-sm px-3 py-1.5 rounded-md hover:bg-slate-50">
                            {opt}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProfilePage;