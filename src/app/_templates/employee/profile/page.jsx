"use client";

import React, { useState } from 'react';
import { 
  LayoutDashboard, Calendar, ClipboardList, Users, User, 
  Search, Bell, Settings, HelpCircle, Edit3, 
  Mail, Phone, MapPin, Briefcase, Award, 
  Lock, ShieldCheck, Monitor, LogOut, Camera, Star
} from 'lucide-react';

const MyProfile = () => {
  // --- STATE MANAGEMENT ---
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    fullName: "Dr. Abebe Bekele",
    dob: "March 15, 1985",
    gender: "Male",
    email: "abebe@stpaul.com",
    phone: "+251 911 234 567",
    address: "Mexico Road, Addis Ababa, Ethiopia"
  });

  const [preferences, setPreferences] = useState({
    email: true,
    sms: true,
    daily: false,
    weekly: false
  });

  // --- HANDLERS ---
  const togglePreference = (key) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleUpdateUser = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex min-h-screen bg-[#F3F6F9] font-sans text-slate-700">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6">
          <h1 className="text-[#2B5A9A] font-black text-xl tracking-tight">ServeSync+</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest -mt-1">Clinical Dashboard</p>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <SidebarItem icon={<LayoutDashboard size={20}/>} label="My Dashboard" />
          <SidebarItem icon={<Calendar size={20}/>} label="My Schedule" />
          <SidebarItem icon={<ClipboardList size={20}/>} label="My Tasks" />
          <SidebarItem icon={<Users size={20}/>} label="My Clients" />
          <SidebarItem icon={<User size={20}/>} label="My Profile" active />
        </nav>

        <div className="p-4 mt-auto border-t border-slate-100">
          <div className="bg-[#F8FAFC] rounded-xl p-3 flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-slate-300 overflow-hidden">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Abebe" alt="avatar" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold truncate">Dr. Abebe Bekele</p>
              <p className="text-[10px] text-slate-400 truncate">abebe.b@servesync.com</p>
            </div>
          </div>
          <button className="flex items-center gap-2 text-slate-500 hover:text-red-600 text-sm font-bold px-2 transition-colors">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* HEADER */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between">
          <div className="relative w-96">
            <Search className="absolute left-3 top-2.5 text-slate-300" size={18} />
            <input type="text" placeholder="Search system..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none" />
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
              <Calendar size={18} /> April 23, 2026
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <Bell size={20} className="hover:text-blue-600 cursor-pointer" />
              <Settings size={20} className="hover:text-blue-600 cursor-pointer" />
              <HelpCircle size={20} className="hover:text-blue-600 cursor-pointer" />
            </div>
            <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
            <div className="flex items-center gap-3 text-right">
              <div>
                <p className="text-xs font-bold text-slate-800">Organization Employee</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Main Hospital Branch</p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-slate-800 overflow-hidden">
                 <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Abebe" alt="avatar" />
              </div>
            </div>
          </div>
        </header>

        {/* SCROLLABLE BODY */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">My Profile</h2>
            <p className="text-sm text-slate-400">View and manage your personal and professional information</p>
          </div>

          <div className="grid grid-cols-12 gap-8">
            
            {/* LEFT COLUMN */}
            <div className="col-span-4 space-y-8">
              {/* Profile Card */}
              <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-slate-100">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Abebe" alt="Profile" />
                  </div>
                  <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-4 border-white rounded-full"></div>
                </div>
                <h3 className="text-xl font-bold text-slate-800">Dr. Abebe Bekele</h3>
                <div className="flex items-center justify-center gap-2 mt-1 mb-6">
                  <span className="px-3 py-0.5 bg-[#2B5A9A] text-white text-[10px] font-bold rounded-full">Senior Doctor</span>
                  <span className="text-[10px] text-slate-400 font-bold">EMP-001</span>
                </div>
                <button className="w-full py-2.5 bg-[#003366] text-white rounded-xl text-xs font-bold hover:bg-[#002244] transition-all">
                  Change Photo
                </button>
              </div>

              {/* Professional Info */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-[11px] font-black uppercase text-[#2B5A9A] tracking-widest">Professional Info</h4>
                  <Briefcase size={16} className="text-slate-300" />
                </div>
                <div className="space-y-4">
                  <InfoRow label="Department" value="Cardiology" />
                  <InfoRow label="Specialization" value="Cardiovascular Medicine" />
                  <InfoRow label="Experience" value="12 years" />
                  <InfoRow label="License" value="MD-ETH-12345" />
                  <InfoRow label="Medical School" value="Addis Ababa University" />
                  <InfoRow label="Joined" value="Jan 15, 2024" />
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <StatCard value="156" label="Patients Served" />
                <StatCard value="98%" label="Satisfaction Rate" />
                <StatCard value="12" label="Years Exp." />
                <StatCard value="4.9" label="Star Rating" icon={<Star size={12} className="fill-amber-400 text-amber-400" />} />
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="col-span-8 space-y-8">
              
              {/* Personal Information */}
              <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm relative">
                <div className="flex justify-between items-center mb-8">
                  <h4 className="text-[11px] font-black uppercase text-[#2B5A9A] tracking-widest">Personal Information</h4>
                  <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center gap-1.5 text-[10px] font-bold text-blue-600 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                  >
                    <Edit3 size={12} /> {isEditing ? "Save Profile" : "Edit"}
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                  <EditableField label="Full Name" name="fullName" value={userData.fullName} editing={isEditing} onChange={handleUpdateUser} />
                  <EditableField label="Date of Birth" name="dob" value={userData.dob} editing={isEditing} onChange={handleUpdateUser} />
                  <EditableField label="Gender" name="gender" value={userData.gender} editing={isEditing} onChange={handleUpdateUser} />
                  <EditableField label="Email" name="email" value={userData.email} editing={isEditing} onChange={handleUpdateUser} />
                  <EditableField label="Phone" name="phone" value={userData.phone} editing={isEditing} onChange={handleUpdateUser} />
                  <EditableField label="Address" name="address" value={userData.address} editing={isEditing} onChange={handleUpdateUser} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                {/* Contact Preferences */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                  <h4 className="text-[11px] font-black uppercase text-[#2B5A9A] tracking-widest mb-6">Contact Preferences</h4>
                  <div className="space-y-4">
                    <ToggleRow label="Email Notifications" active={preferences.email} onClick={() => togglePreference('email')} />
                    <ToggleRow label="SMS Alerts" active={preferences.sms} onClick={() => togglePreference('sms')} />
                    <ToggleRow label="Daily Reminders" active={preferences.daily} onClick={() => togglePreference('daily')} />
                    <ToggleRow label="Weekly Reports" active={preferences.weekly} onClick={() => togglePreference('weekly')} />
                  </div>
                </div>

                {/* Work Schedule */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="text-[11px] font-black uppercase text-[#2B5A9A] tracking-widest">Work Schedule</h4>
                    <button className="text-[10px] font-bold text-blue-600">Edit Schedule</button>
                  </div>
                  <div className="space-y-4">
                    <ScheduleRow day="Mon - Fri" time="9:00 AM - 5:00 PM" />
                    <ScheduleRow day="Sat - Sun" time="OFF" highlight />
                    <ScheduleRow day="Lunch Break" time="12:00 PM - 1:00 PM" />
                  </div>
                </div>
              </div>

              {/* Skills & Certifications */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <h4 className="text-[11px] font-black uppercase text-[#2B5A9A] tracking-widest mb-6">Skills & Certifications</h4>
                <div className="flex flex-wrap gap-2 mb-8">
                  {['Cardiology', 'ECG', 'Patient Care', 'Emergency Medicine', 'Telemedicine'].map(skill => (
                    <span key={skill} className="px-3 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-lg border border-blue-100">{skill}</span>
                  ))}
                </div>
                <div className="space-y-4">
                   <CertItem title="Board Certified Cardiologist" subtitle="American Board of Internal Medicine • 2018" />
                   <CertItem title="Advanced Cardiac Life Support (ACLS)" subtitle="American Heart Association • 2023" />
                </div>
              </div>

              {/* Account Security */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <h4 className="text-[11px] font-black uppercase text-[#2B5A9A] tracking-widest mb-6">Account Security</h4>
                <div className="grid grid-cols-3 gap-4">
                  <SecurityCard icon={<Lock size={18}/>} label="Change Password" />
                  <SecurityCard icon={<ShieldCheck size={18}/>} label="Setup 2FA" />
                  <SecurityCard icon={<Monitor size={18}/>} label="Active Sessions" />
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

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between items-center py-0.5">
    <span className="text-[10px] text-slate-400 font-medium">{label}</span>
    <span className="text-[11px] text-slate-800 font-bold">{value}</span>
  </div>
);

const EditableField = ({ label, name, value, editing, onChange }) => (
  <div>
    <p className="text-[10px] text-slate-400 font-bold mb-1">{label}</p>
    {editing ? (
      <input 
        name={name}
        value={value}
        onChange={onChange}
        className="w-full text-sm font-bold text-slate-800 border-b border-blue-200 focus:border-blue-500 outline-none pb-1"
      />
    ) : (
      <p className="text-sm font-bold text-slate-800">{value}</p>
    )}
  </div>
);

const ToggleRow = ({ label, active, onClick }) => (
  <div className="flex justify-between items-center group">
    <span className="text-xs text-slate-500 font-medium">{label}</span>
    <div 
      onClick={onClick}
      className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors duration-200 ${active ? 'bg-[#2B5A9A]' : 'bg-slate-200'}`}
    >
      <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-200 ${active ? 'left-6' : 'left-1'}`}></div>
    </div>
  </div>
);

const StatCard = ({ value, label, icon }) => (
  <div className="bg-white rounded-2xl p-4 border border-slate-100 text-center flex flex-col items-center justify-center min-h-[90px]">
    <div className="flex items-center gap-1">
      <span className="text-xl font-black text-[#2B5A9A]">{value}</span>
      {icon}
    </div>
    <span className="text-[9px] text-slate-400 font-black uppercase mt-1 tracking-tighter">{label}</span>
  </div>
);

const ScheduleRow = ({ day, time, highlight }) => (
  <div className="flex justify-between items-center text-[11px]">
    <span className="text-slate-500 font-medium">{day}</span>
    <span className={`font-bold ${highlight ? 'text-red-500' : 'text-slate-800'}`}>{time}</span>
  </div>
);

const CertItem = ({ title, subtitle }) => (
  <div className="flex items-center gap-4 p-3 bg-[#F8FAFC] rounded-xl border border-slate-50">
    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 border border-blue-100">
      <Award size={20} />
    </div>
    <div>
      <p className="text-xs font-bold text-slate-800">{title}</p>
      <p className="text-[10px] text-slate-400 font-medium">{subtitle}</p>
    </div>
  </div>
);

const SecurityCard = ({ icon, label }) => (
  <div className="flex flex-col items-center justify-center p-4 border border-slate-50 bg-[#F8FAFC] rounded-xl cursor-pointer hover:bg-white hover:shadow-sm transition-all">
    <div className="text-slate-700 mb-2">{icon}</div>
    <span className="text-[10px] font-bold text-slate-600 text-center leading-tight">{label}</span>
  </div>
);

export default MyProfile;