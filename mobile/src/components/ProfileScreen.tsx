import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Switch } from 'react-native';
import { useAuthStore, useUIStore } from '../store';
import { User, CreditCard, Bell, Globe, HelpCircle, Shield, LogOut, ChevronRight, Moon, Mail, Phone, Save, X } from 'lucide-react-native';
import { tw } from '../lib/native-utils';

export default function ProfileScreen() {
  const { user, logout, updateUser } = useAuthStore();
  const { setActiveScreen } = useUIStore();
  const [darkMode, setDarkMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');

  const handleLogout = () => {
    logout();
    setActiveScreen('LOGIN');
  };

  const handleSave = () => {
    updateUser({ name: editName, email: editEmail, phone: editPhone });
    setIsEditing(false);
  };

  const menuItems = [
    { icon: <CreditCard size={20} color="#2563EB" />, label: 'Saved Payment Methods', bg: 'bg-blue-50', text: 'text-blue-600' },
    { icon: <Bell size={20} color="#EA580C" />, label: 'Notification Preferences', bg: 'bg-orange-50', text: 'text-orange-600' },
    { icon: <Globe size={20} color="#059669" />, label: 'Language', detail: 'English', bg: 'bg-emerald-50', text: 'text-emerald-600' },
    { icon: <HelpCircle size={20} color="#7C3AED" />, label: 'Help & Support', bg: 'bg-purple-50', text: 'text-purple-600' },
    { icon: <Shield size={20} color="#E11D48" />, label: 'Privacy Policy', bg: 'bg-rose-50', text: 'text-rose-600' },
  ];

  if (isEditing) {
    return (
      <View style={tw`flex-1 bg-white`}>
        <View style={tw`px-6 py-6 border-b border-gray-100 flex-row items-center justify-between`}>
           <View style={tw`flex-row items-center gap-3`}>
              <TouchableOpacity 
                onPress={() => setIsEditing(false)}
                style={tw`w-10 h-10 items-center justify-center rounded-xl bg-gray-50`}
              >
                <X size={20} color="#9CA3AF" />
              </TouchableOpacity>
              <Text style={tw`text-xl font-bold text-gray-900`}>Edit Profile</Text>
           </View>
           <TouchableOpacity 
             onPress={handleSave}
             style={tw`w-10 h-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-100`}
           >
              <Save size={20} color="white" />
           </TouchableOpacity>
        </View>

        <ScrollView style={tw`flex-1 px-6 py-8`} showsVerticalScrollIndicator={false}>
           <View style={tw`items-center mb-8`}>
              <View style={tw`relative`}>
                <View style={tw`w-24 h-24 rounded-full bg-blue-600 border-[6px] border-blue-50 items-center justify-center shadow-xl`}>
                  <Text style={tw`text-white text-3xl font-bold`}>{editName?.[0] || 'A'}</Text>
                </View>
                <View style={tw`absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-lg items-center justify-center border-2 border-gray-50`}>
                  <User size={14} color="#2563EB" />
                </View>
              </View>
              <TouchableOpacity onPress={() => {}}>
                <Text style={tw`mt-4 text-xs font-bold text-blue-600`}>Change Profile Photo</Text>
              </TouchableOpacity>
           </View>

           <View style={tw`gap-4`}>
              <Input 
                label="Full Name" 
                icon={<User size={18} color="#9CA3AF" />} 
                value={editName}
                onChangeText={setEditName}
                placeholder="enter your full name" 
              />
              <Input 
                label="Email Address" 
                icon={<Mail size={18} color="#9CA3AF" />} 
                value={editEmail}
                onChangeText={setEditEmail}
                placeholder="enter your email address" 
                keyboardType="email-address"
              />
              <Input 
                label="Phone Number" 
                icon={<Phone size={18} color="#9CA3AF" />} 
                value={editPhone}
                onChangeText={setEditPhone}
                placeholder="enter your phone number" 
                keyboardType="phone-pad"
              />
           </View>

           <TouchableOpacity 
             onPress={handleSave}
             style={tw`w-full py-4 bg-blue-600 rounded-2xl items-center mt-8 shadow-lg shadow-blue-100`}
           >
             <Text style={tw`text-white font-bold`}>Save Changes</Text>
           </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      <View style={tw`bg-white px-6 pt-6 pb-6 rounded-b-[32px] shadow-sm border-b border-gray-100`}>
        <Text style={tw`text-xl font-bold text-gray-900 mb-4`}>Profile</Text>
        
        <View style={tw`flex-row items-center gap-4`}>
           <View style={tw`relative`}>
              <View style={tw`w-16 h-16 rounded-full bg-blue-600 border-[4px] border-blue-50 items-center justify-center shadow-lg`}>
                 <Text style={tw`text-white text-xl font-bold`}>{user?.name?.[0] || 'A'}</Text>
              </View>
              <View style={tw`absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full shadow-md items-center justify-center border-2 border-gray-50`}>
                 <User size={12} color="#2563EB" />
              </View>
           </View>
           <View style={tw`flex-1`}>
              <Text style={tw`text-lg font-bold text-gray-900`}>{user?.name}</Text>
              <Text style={tw`text-xs text-gray-500`}>{user?.email}</Text>
           </View>
           <TouchableOpacity 
             onPress={() => {
               setEditName(user?.name || '');
               setEditEmail(user?.email || '');
               setEditPhone(user?.phone || '');
               setIsEditing(true);
             }}
             style={tw`px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl`}
           >
              <Text style={tw`font-bold text-[10px]`}>Edit</Text>
           </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={tw`flex-1 px-6 py-6`} contentContainerStyle={tw`pb-24`} showsVerticalScrollIndicator={false}>
        <View style={tw`mb-6`}>
           <Text style={tw`text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 ml-2`}>Preferences</Text>
           <View style={tw`bg-white rounded-3xl p-4 flex-row items-center justify-between border border-gray-100 shadow-sm`}>
              <View style={tw`flex-row items-center gap-3`}>
                 <View style={tw`w-10 h-10 rounded-2xl bg-indigo-50 items-center justify-center`}>
                    <Moon size={20} color="#4F46E5" />
                 </View>
                 <Text style={tw`text-sm font-bold text-gray-700`}>Dark Mode</Text>
              </View>
              <Switch 
                value={darkMode} 
                onValueChange={setDarkMode}
                trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
              />
           </View>
        </View>

        <View style={tw`mb-6`}>
           <Text style={tw`text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 ml-2`}>Account Settings</Text>
           <View style={tw`bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm`}>
              {menuItems.map((item, idx) => (
                <TouchableOpacity 
                  key={idx}
                  style={tw`w-full px-5 py-4 flex-row items-center justify-between ${idx !== menuItems.length - 1 ? 'border-b border-gray-50' : ''}`}
                >
                  <View style={tw`flex-row items-center gap-4`}>
                    <View style={tw`w-10 h-10 rounded-2xl flex items-center justify-center ${item.bg}`}>
                       {item.icon}
                    </View>
                    <Text style={tw`text-sm font-bold text-gray-700`}>{item.label}</Text>
                  </View>
                  <View style={tw`flex-row items-center gap-2`}>
                    {item.detail && <Text style={tw`text-xs font-bold text-gray-400`}>{item.detail}</Text>}
                    <ChevronRight size={16} color="#D1D5DB" />
                  </View>
                </TouchableOpacity>
              ))}
           </View>
        </View>

        <TouchableOpacity 
          onPress={handleLogout}
          style={tw`w-full py-4 flex-row items-center justify-center gap-2 bg-red-50 rounded-3xl shadow-sm`}
        >
          <LogOut size={20} color="#EF4444" />
          <Text style={tw`text-red-500 font-bold text-sm`}>Logout</Text>
        </TouchableOpacity>

        <View style={tw`text-center pt-4 opacity-30 items-center`}>
           <Text style={tw`text-[10px] font-bold text-gray-500 uppercase`}>Version 1.2.4 (Build 452)</Text>
           <Text style={tw`text-[10px] font-bold text-gray-500 uppercase mt-1`}>© 2024 ServeSync+ Inc.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

function Input({ label, icon, ...props }: any) {
  return (
    <View style={tw`gap-1.5`}>
      {label && <Text style={tw`text-xs font-bold text-gray-700 ml-1`}>{label}</Text>}
      <View style={tw`relative`}>
        <View style={tw`absolute left-4 top-4.5 z-10`}>
          {icon}
        </View>
        <TextInput
          {...props}
          style={tw`w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 pl-12 pr-4 text-sm`}
        />
      </View>
    </View>
  );
}
