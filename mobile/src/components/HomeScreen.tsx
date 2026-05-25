
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Image, FlatList } from 'react-native';
import { useAuthStore, useUIStore, useAppointmentStore, useBookingStore, useNotificationStore } from '../store';
import { Search, Bell, Star, Clock, MapPin, ChevronRight, Sliders } from 'lucide-react-native';
import { CATEGORIES, BUSINESSES } from '../data/mockData';
import { tw } from '../lib/native-utils';

export default function HomeScreen() {
  const { user } = useAuthStore();
  const { setActiveScreen, setViewingAppointment } = useUIStore();
  const { appointments } = useAppointmentStore();
  const { selectedCategory, setCategory, setBusiness } = useBookingStore();
  const { notifications } = useNotificationStore();

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const recentAppointments = appointments.slice(0, 2);
  const popularBusinesses = BUSINESSES.slice(0, 3);

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      {/* Header */}
      <View style={tw`px-6 pt-10 pb-6 bg-white rounded-b-[40px] shadow-sm`}>
        <View style={tw`flex-row justify-between items-center mb-6`}>
          <View>
            <Text style={tw`text-2xl font-black text-gray-900`}>Hello, {user?.name || 'Guest'}!</Text>
            <Text style={tw`text-sm font-medium text-gray-500`}>Find your next service</Text>
          </View>
          <TouchableOpacity
            onPress={() => setActiveScreen('NOTIFICATIONS')}
            style={tw`relative p-3 bg-gray-100 rounded-2xl`}
            activeOpacity={0.7}
          >
            <Bell size={22} color={unreadCount > 0 ? "#2563EB" : "#4B5563"} fill={unreadCount > 0 ? "#2563EB" : "none"} />
            {unreadCount > 0 && (
              <View style={tw`absolute top-2.5 right-2.5 w-3 h-3 bg-red-500 rounded-full border-2 border-white`} />
            )}
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={tw`flex-row items-center gap-3`}>
          <View style={tw`flex-1 relative`}>
            <View style={tw`absolute left-4 top-4 z-10`}>
              <Search color="#9CA3AF" size={18} />
            </View>
            <TextInput
              placeholder="What service do you need?"
              placeholderTextColor="#9CA3AF"
              style={tw`w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-gray-900 text-sm font-medium`}
            />
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`pb-10`}>
        {/* Choose what you want (Sector Selection) */}
        <View style={tw`px-6 pt-6`}>
          <Text style={tw`text-lg font-bold text-gray-900 mb-4`}>Choose what you want</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={tw`pb-4 gap-4`}
          >
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => {
                    setCategory(cat.id);
                    setActiveScreen('BOOKING');
                  }}
                  style={tw`items-center gap-2`}
                  activeOpacity={0.7}
                >
                  <View style={tw`w-16 h-16 rounded-[22px] ${isSelected ? 'bg-blue-600 shadow-lg shadow-blue-100' : 'bg-white border border-gray-100'} items-center justify-center shadow-sm`}>
                    <Icon size={24} color={isSelected ? 'white' : '#2563EB'} />
                  </View>
                  <Text style={tw`text-[10px] font-bold ${isSelected ? 'text-blue-600' : 'text-gray-600'} uppercase tracking-tight`}>{cat.name}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Horizontal Service Providers for selected sector */}
        <View style={tw`px-6 mb-8`}>
          <View style={tw`flex-row justify-between items-center mb-4`}>
            <Text style={tw`text-base font-bold text-gray-800`}>
              {CATEGORIES.find(c => c.id === selectedCategory)?.name || 'All'} Providers
            </Text>
            <TouchableOpacity onPress={() => setActiveScreen('BOOKING')}>
              <Text style={tw`text-xs font-bold text-blue-600`}>View All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={tw`gap-4`}
          >
            {BUSINESSES.filter(b => !selectedCategory || b.category === selectedCategory).map((biz) => (
              <TouchableOpacity
                key={biz.id}
                onPress={() => {
                  setBusiness(biz);
                  setActiveScreen('BOOKING');
                }}
                style={tw`w-72 bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm`}
              >
                <View style={tw`relative h-32`}>
                  <Image source={typeof biz.image === 'string' ? { uri: biz.image } : biz.image} style={tw`w-full h-full`} resizeMode="cover" />
                  <View style={tw`absolute top-3 right-3 bg-white/90 px-2 py-1 rounded-lg flex-row items-center gap-1 shadow-sm`}>
                    <Star size={12} color="#FBBF24" fill="#FBBF24" />
                    <Text style={tw`text-[10px] font-bold`}>{biz.rating}</Text>
                  </View>
                </View>
                <View style={tw`p-4`}>
                  <View style={tw`flex-row justify-between items-start mb-2`}>
                    <View style={tw`flex-1`}>
                      <Text style={tw`font-bold text-gray-900 text-sm`}>{biz.name}</Text>
                      <Text style={tw`text-[10px] text-gray-500 font-medium`}>Starting {biz.services[0].price} ETB</Text>
                    </View>
                    <View style={tw`bg-blue-600 px-3 py-1.5 rounded-lg`}>
                      <Text style={tw`text-white text-[10px] font-bold`}>Book</Text>
                    </View>
                  </View>
                  <View style={tw`flex-row items-center gap-3 mt-1`}>
                    <View style={tw`flex-row items-center gap-1`}>
                      <Clock color="#9CA3AF" size={10} />
                      <Text style={tw`text-[9px] font-bold text-gray-500`}>{biz.services[0].duration}</Text>
                    </View>
                    <View style={tw`flex-row items-center gap-1 flex-1`}>
                      <MapPin color="#9CA3AF" size={10} />
                      <Text style={tw`text-[9px] font-bold text-gray-500`} numberOfLines={1}>{biz.location}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>




        {/* Recent Appointments */}
        <View style={tw`px-6`}>
          <View style={tw`flex-row justify-between items-center mb-4`}>
            <Text style={tw`text-lg font-bold text-gray-900`}>Recent Appointments</Text>
            <TouchableOpacity onPress={() => setActiveScreen('ACTIVE')}>
              <Text style={tw`text-xs font-bold text-blue-600`}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={tw`gap-3`}>
            {recentAppointments.map((app) => (
              <TouchableOpacity
                key={app.id}
                onPress={() => setViewingAppointment(app.id)}
                style={tw`w-full bg-white p-4 rounded-3xl border border-gray-100 flex-row items-center gap-4 shadow-sm`}
                activeOpacity={0.7}
              >
                <View style={tw`w-12 h-12 rounded-2xl bg-blue-50 items-center justify-center`}>
                  <Clock color="#2563EB" size={20} />
                </View>
                <View style={tw`flex-1`}>
                  <View style={tw`flex-row justify-between items-start mb-1`}>
                    <Text style={tw`font-bold text-sm text-gray-900 flex-1`} numberOfLines={1}>{app.businessName}</Text>
                    <StatusBadge status={app.status} />
                  </View>
                  <Text style={tw`text-xs text-gray-500 mb-1`}>{app.serviceName}</Text>
                  <View style={tw`flex-row items-center gap-2`}>
                    <Clock color="#9CA3AF" size={12} />
                    <Text style={tw`text-[10px] font-medium text-gray-400`}>{app.date} • {app.time}</Text>
                  </View>
                </View>
                <ChevronRight color="#D1D5DB" size={16} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors = {
    'Booked': 'bg-blue-100 text-blue-700',
    'In Progress': 'bg-yellow-100 text-yellow-700',
    'Completed': 'bg-green-100 text-green-700',
    'Cancelled': 'bg-red-100 text-red-700'
  } as any;
  return (
    <View style={tw`px-2 py-0.5 rounded-full ${colors[status] || 'bg-gray-100 text-gray-700'}`}>
      <Text style={tw`text-[9px] font-bold uppercase tracking-wider ${colors[status]?.split(' ')[1] || 'text-gray-700'}`}>
        {status}
      </Text>
    </View>
  );
}
