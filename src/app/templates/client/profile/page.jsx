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
      console.log("Saving data:", userData);
    }
    setIsEditing(!isEditing);
  };

  const handleUpdateUser = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

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
    <div className="flex min-h-screen bg-gray-50 font-sans text-slate-700">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full z-20">
        <div className="p-6">
          <h1 className="text-[#2563eb] font-bold text-2xl">ServeSync+</h1>
          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mt-1">Client Portal</p>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <SidebarItem icon={<LayoutDashboard size={20}/>} label="Dashboard" />
          <SidebarItem icon={<Calendar size={20}/>} label="Appointments" />
          <SidebarItem icon={<PlusCircle size={20}/>} label="Book Service" />
          <SidebarItem icon={<CreditCard size={20}/>} label="Payments" />
          <SidebarItem icon={<User size={20}/>} label="Profile" active />
        </nav>

        <div className="p-6 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-gray-100">
              <img src={profilePhoto} alt="Sarah" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-800">Sarah Johnson</p>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <p className="text-[9px] text-gray-400 font-semibold uppercase">Verified Client</p>
              </div>
            </div>
          </div>
          <button className="flex items-center gap-2 text-gray-400 hover:text-red-600 text-sm font-semibold transition-colors">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        
        <header className="h-20 bg-white/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-10 border-b border-gray-100">
          <div className="relative w-[450px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search system..." className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-800">April 23, 2026</p>
              <p className="text-[10px] text-gray-400 font-semibold uppercase">Thursday</p>
            </div>
            <div className="relative cursor-pointer">
              <Bell size={20} className="text-gray-400" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-bold w-4 h-4 flex items-center justify-center rounded-full">3</span>
            </div>
            <div className="h-8 w-px bg-gray-200"></div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs font-semibold text-gray-800">Sarah Johnson</p>
                <p className="text-[10px] text-gray-400 font-semibold uppercase">Administrator</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gray-200 overflow-hidden">
                <img src={profilePhoto} alt="Sarah" />
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
            <p className="text-sm text-gray-400">View and manage your personal information and preferences</p>
          </div>

          <div className="grid grid-cols-12 gap-6">
            
            <div className="col-span-4 space-y-6">
              {/* Profile Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-28 h-28 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-100">
                    <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                  </div>
                  <button 
                    onClick={() => fileInputRef.current.click()}
                    className="absolute bottom-0 right-0 p-1.5 bg-blue-600 text-white rounded-full border-2 border-white shadow-md hover:bg-blue-700 transition-all"
                  >
                    <Camera size={14} />
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handlePhotoChange} className="hidden" accept="image/*" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">{userData.fullName}</h3>
                <p className="text-xs text-gray-400 mb-4 font-medium">Member since Jan 2024</p>
                <button 
                  onClick={() => fileInputRef.current.click()}
                  className="px-4 py-1.5 bg-blue-50 text-blue-600 text-xs font-semibold rounded-lg border border-blue-100 hover:bg-blue-100 transition-all"
                >
                  Change Photo
                </button>
              </div>

              {/* Account Overview */}
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <h4 className="text-[11px] font-bold uppercase text-blue-600 tracking-wide mb-4">Account Overview</h4>
                <div className="grid grid-cols-2 gap-3">
                  <StatCard value="12" label="Total Appointments" />
                  <StatCard value="8" label="Completed Services" />
                  <StatCard value="4.8 ★" label="Avg Rating" />
                  <StatCard value="2" label="Saved Payments" />
                </div>
              </div>

              {/* Regional Preferences */}
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <h4 className="text-[11px] font-bold uppercase text-blue-600 tracking-wide mb-4">Regional Preferences</h4>
                <div className="space-y-3">
                  <DropdownSelector label="Language" value={regional.language} options={['English (US)', 'French (FR)', 'Amharic (ET)']} onSelect={(v) => setRegional({...regional, language: v})}/>
                  <DropdownSelector label="Currency" value={regional.currency} options={['ETB (Birr)', 'USD ($)', 'EUR (€)']} onSelect={(v) => setRegional({...regional, currency: v})}/>
                  <DropdownSelector label="Time Zone" value={regional.timezone} options={['EAT (UTC +3)', 'GMT (UTC +0)', 'EST (UTC -5)']} onSelect={(v) => setRegional({...regional, timezone: v})}/>
                </div>
              </div>
            </div>

            <div className="col-span-8 space-y-6">
              
              {/* Personal Information */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-[11px] font-bold uppercase text-blue-600 tracking-wide">Personal Information</h4>
                  <button 
                    onClick={handleEditSave}
                    className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-blue-600 hover:bg-blue-50 px-3 py-1 rounded-lg transition-colors"
                  >
                    {isEditing ? <><CheckCircle2 size={12}/> Save Changes</> : <><Edit2 size={12} /> Edit Profile</>}
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                  <EditableField label="Full Name" name="fullName" value={userData.fullName} editing={isEditing} onChange={handleUpdateUser} />
                  <EditableField label="Date of Birth" name="dob" value={userData.dob} editing={isEditing} onChange={handleUpdateUser} />
                  <EditableField label="Gender" name="gender" value={userData.gender} editing={isEditing} onChange={handleUpdateUser} isSelect/>
                  <EditableField label="Email Address" name="email" value={userData.email} editing={isEditing} onChange={handleUpdateUser} isVerified/>
                  <EditableField label="Phone Number" name="phone" value={userData.phone} editing={isEditing} onChange={handleUpdateUser} />
                  <EditableField label="Primary Address" name="address" value={userData.address} editing={isEditing} onChange={handleUpdateUser} />
                </div>
              </div>

              {/* Notification Preferences */}
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <h4 className="text-[11px] font-bold uppercase text-blue-600 tracking-wide mb-4">Notification Preferences</h4>
                <div className="space-y-3 divide-y divide-gray-100">
                  <ToggleRow label="Email Notifications" desc="Receive service updates and billing reports via email." active={notifications.email} onClick={() => toggleNotification('email')} />
                  <ToggleRow label="SMS Notifications" desc="Get real-time booking alerts on your mobile phone." active={notifications.sms} onClick={() => toggleNotification('sms')} />
                  <ToggleRow label="Appointment Reminders" desc="Automated reminders for upcoming health services." active={notifications.reminder} onClick={() => toggleNotification('reminder')} />
                  <ToggleRow label="Promotional Offers" desc="Be the first to hear about seasonal discounts." active={notifications.promo} onClick={() => toggleNotification('promo')} />
                </div>
              </div>

              {/* Account Security */}
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <h4 className="text-[11px] font-bold uppercase text-blue-600 tracking-wide mb-4">Account Security</h4>
                <div className="grid grid-cols-3 gap-3">
                  <SecurityCard icon={<Settings2 size={18}/>} label="Change Password" desc="Last updated 3 months ago"/>
                  <SecurityCard icon={<ShieldCheck size={18}/>} label="2-Factor Auth" desc="CURRENTLY ENABLED" isStatus/>
                  <SecurityCard icon={<Monitor size={18}/>} label="Active Sessions" desc="2 devices currently logged in"/>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-white rounded-xl p-5 border border-red-100 shadow-sm hover:border-red-200 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-[11px] font-bold uppercase text-red-600 tracking-wide mb-1">Danger Zone</h4>
                    <p className="text-xs text-gray-400 font-medium">Permanently delete your ServeSync+ account and all associated data. This action cannot be undone.</p>
                  </div>
                  <button 
                    onClick={handleDeleteAccount}
                    className="flex items-center gap-2 text-[10px] font-semibold text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 transition-colors"
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
  <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all ${
    active ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:bg-gray-50'
  }`}>
    {icon}
    <span className={`text-sm font-semibold ${active ? 'text-blue-600' : 'text-gray-600'}`}>{label}</span>
  </div>
);

const StatCard = ({ value, label }) => (
  <div className="bg-gray-50 rounded-lg p-3 text-center flex flex-col items-center justify-center min-h-[65px] border border-gray-100">
    <span className="text-lg font-bold text-blue-600">{value}</span>
    <span className="text-[9px] text-gray-400 font-semibold uppercase mt-1 tracking-tighter text-center">{label}</span>
  </div>
);

const EditableField = ({ label, name, value, editing, onChange, isVerified, isSelect }) => (
  <div>
    <p className="text-[10px] text-gray-400 font-semibold mb-1">{label}</p>
    {editing ? (
      isSelect ? (
        <select name={name} value={value} onChange={onChange} className="w-full text-sm font-semibold text-gray-800 border-b border-blue-200 focus:border-blue-500 outline-none pb-1.5 bg-white">
          <option value="Female">Female</option>
          <option value="Male">Male</option>
          <option value="Other">Other</option>
        </select>
      ) : (
        <input 
          name={name}
          value={value}
          onChange={onChange}
          className="w-full text-sm font-semibold text-gray-800 border-b border-blue-200 focus:border-blue-500 outline-none pb-1.5"
        />
      )
    ) : (
      <div className="flex items-center gap-2">
        <p className="text-sm font-semibold text-gray-800">{value}</p>
        {isVerified && <span className="bg-green-50 text-green-600 text-[8px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">✓ Verified</span>}
      </div>
    )}
  </div>
);

const ToggleRow = ({ label, desc, active, onClick }) => (
  <div className="flex justify-between items-center py-3 group">
    <div>
      <span className="text-sm text-gray-800 font-semibold">{label}</span>
      <p className="text-xs text-gray-400 font-medium">{desc}</p>
    </div>
    <div 
      onClick={onClick}
      className={`w-11 h-5 rounded-full relative cursor-pointer transition-colors duration-200 ${
        active ? 'bg-blue-600' : 'bg-gray-300'
      }`}
    >
      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all duration-200 ${
        active ? 'left-6' : 'left-0.5'
      }`}></div>
    </div>
  </div>
);

const SecurityCard = ({ icon, label, desc, isStatus }) => (
  <div className="flex flex-col items-center justify-center p-4 border border-gray-100 bg-gray-50 rounded-lg text-center min-h-[90px] cursor-pointer hover:bg-white hover:shadow-sm transition-all">
    <div className="text-gray-600 mb-1.5">{icon}</div>
    <span className="text-[10px] font-bold text-gray-800">{label}</span>
    <span className={`text-[8px] font-bold uppercase mt-1 ${
      isStatus ? 'bg-green-50 text-green-600 px-1.5 py-0.5 rounded' : 'text-gray-400'
    }`}>{desc}</span>
  </div>
);

const DropdownSelector = ({ label, value, options, onSelect }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <p className="text-[10px] text-gray-400 font-semibold mb-1">{label}</p>
      <button 
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 hover:border-gray-300 transition-colors"
      >
        {value} <ChevronDown size={14} className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}/>
      </button>
      {open && (
        <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 space-y-0.5 p-1">
          {options.map(opt => (
            <button key={opt} onClick={() => {onSelect(opt); setOpen(false);}} className="w-full text-left text-xs px-3 py-1.5 rounded-md hover:bg-gray-50">
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;