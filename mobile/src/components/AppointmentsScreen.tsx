
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useUIStore, useAppointmentStore, useBookingStore } from '../store';
import { ChevronRight, Clock, MapPin, Receipt, RefreshCw } from 'lucide-react-native';
import { tw } from '../lib/native-utils';
import { AppointmentStatus } from '../types';
import { BUSINESSES, getStepsByCategory } from '../data/mockData';
import { apiClient } from '../lib/apiClient';

export default function AppointmentsScreen() {
  const { setActiveScreen, setViewingAppointment, appointmentTab, setAppointmentTab } = useUIStore();
  const { appointments, cancelAppointment, addAppointment } = useAppointmentStore();
  const { setCategory, setBusiness, setService } = useBookingStore();
  
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await apiClient('/query/v1/appointment?mine');
        if (response.ok) {
          const data = await response.json();
          const fetchedAppointments = data.appointments || data.appointment || [];
          useAppointmentStore.setState({ appointments: fetchedAppointments.map((a: any) => ({
            id: a.id,
            businessId: a.organizationId,
            businessName: a.organization?.name || 'Business',
            serviceId: a.serviceId,
            serviceName: a.service?.name || 'Service',
            date: a.startTime ? a.startTime.split('T')[0] : '2024-05-12',
            time: a.startTime ? new Date(a.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '12:00 PM',
            status: a.status || 'Booked',
            price: a.service?.price || 0,
            progressSteps: []
          }))});
        }
      } catch (e) {
        console.error('Failed to fetch appointments', e);
      }
    };
    fetchAppointments();
  }, [appointmentTab]);
  
  const filteredAppointments = appointments.filter(app => {
    if (appointmentTab === 'Upcoming') {
      return app.status === 'Booked';
    } else if (appointmentTab === 'Active') {
      return app.status === 'In Progress';
    } else {
      return app.status === 'Completed' || app.status === 'Cancelled';
    }
  });

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      <View style={tw`bg-white px-6 pt-10 border-b border-gray-100`}>
        <Text style={tw`text-2xl font-bold text-gray-900 mb-6`}>Appointments</Text>
        
        {/* Tabs */}
        <View style={tw`flex-row gap-6 mb-4`}>
          <TabItem 
            label="Upcoming" 
            isActive={appointmentTab === 'Upcoming'} 
            onPress={() => setAppointmentTab('Upcoming')} 
          />
          <TabItem 
            label="Active" 
            isActive={appointmentTab === 'Active'} 
            onPress={() => setAppointmentTab('Active')} 
          />
          <TabItem 
            label="History" 
            isActive={appointmentTab === 'History'} 
            onPress={() => { setAppointmentTab('History'); setActiveScreen('HISTORY'); }} 
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={tw`p-6 pb-24 gap-4`} showsVerticalScrollIndicator={false}>
        {filteredAppointments.length === 0 ? (
          <View style={tw`mt-20 items-center justify-center opacity-40`}>
            <Clock size={64} color="#D1D5DB" />
            <Text style={tw`font-bold text-gray-400 mt-4`}>No appointments found</Text>
            <Text style={tw`text-sm text-gray-300 text-center px-10`}>When you book a service, it will appear here.</Text>
          </View>
        ) : (
          filteredAppointments.map((app) => (
            <View 
              key={app.id}
              style={tw`bg-white rounded-[32px] p-5 border border-gray-100 shadow-sm`}
            >
              <View style={tw`flex-row justify-between items-start mb-4`}>
                <View style={tw`flex-row items-center gap-3 flex-1`}>
                  <View style={tw`w-10 h-10 rounded-2xl bg-blue-50 items-center justify-center`}>
                    <Clock color="#2563EB" size={20} />
                  </View>
                  <View style={tw`flex-1`}>
                    <Text style={tw`font-bold text-gray-900 text-sm`} numberOfLines={1}>{app.businessName}</Text>
                    <Text style={tw`text-[10px] font-bold text-gray-400 uppercase`}>{app.serviceName}</Text>
                  </View>
                </View>
                <StatusBadge status={app.status} />
              </View>

              {(appointmentTab === 'Active' || appointmentTab === 'Upcoming') && (
                <View style={tw`mb-6`}>
                   <ProgressStepper status={app.status} />
                   <View style={tw`mt-3`}>
                      <Text style={tw`text-[11px] font-bold text-gray-500`}>
                        {app.status === 'In Progress' 
                          ? 'Your specialist is working on your service right now.' 
                          : 'Your appointment is confirmed. Please arrive on time.'}
                      </Text>
                   </View>
                </View>
              )}

              <View style={tw`py-6 border-y border-gray-50 mb-2`}>
                <View style={tw`flex-row items-center justify-center gap-10`}>
                  <View style={tw`items-center`}>
                    <Text style={tw`text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1`}>Date & Time</Text>
                    <Text style={tw`text-sm font-bold text-gray-900`}>{app.date.split('-').slice(1).join('/')} • {app.time}</Text>
                  </View>
                  <View style={tw`w-[1px] h-10 bg-gray-100`} />
                  <View style={tw`items-center`}>
                    <Text style={tw`text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1`}>Total Bill</Text>
                    <Text style={tw`text-lg font-black text-blue-600`}>{app.price} ETB</Text>
                  </View>
                </View>
                
                {appointmentTab === 'Active' && (
                  <TouchableOpacity 
                    onPress={() => setViewingAppointment(app.id)}
                    style={tw`w-full py-4 bg-blue-600 rounded-2xl shadow-xl shadow-blue-100 mt-6 items-center flex-row justify-center gap-2`}
                  >
                    <Text style={tw`text-white text-sm font-bold`}>View Tracking Details</Text>
                  </TouchableOpacity>
                )}
              </View>

              {appointmentTab === 'History' ? (
                <View style={tw`flex-row gap-3`}>
                  <TouchableOpacity 
                    onPress={() => {
                      const biz = BUSINESSES.find(b => b.id === app.businessId);
                      const svc = biz?.services.find(s => s.id === app.serviceId);
                      if (biz && svc) {
                        setCategory(biz.category);
                        setBusiness(biz);
                        setService(svc);
                        setActiveScreen('BOOKING');
                      }
                    }}
                    style={tw`flex-1 flex-row items-center justify-center gap-2 py-3 bg-blue-50 rounded-2xl`}
                  >
                    <RefreshCw color="#1D4ED8" size={14} />
                    <Text style={tw`text-blue-700 text-xs font-bold`}>Re-book</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={tw`flex-1 flex-row items-center justify-center gap-2 py-3 bg-gray-50 rounded-2xl`}>
                    <Receipt color="#374151" size={14} />
                    <Text style={tw`text-gray-700 text-xs font-bold`}>View Invoice</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity 
                  onPress={() => cancelAppointment(app.id)}
                  style={tw`w-full py-2 items-center`}
                >
                  <Text style={tw`text-red-500 text-[11px] font-bold opacity-80`}>Cancel Appointment</Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

function TabItem({ label, isActive, onPress }: { label: string, isActive: boolean, onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={tw`pb-3 relative`}>
      <Text style={tw`text-sm font-bold ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>{label}</Text>
      {isActive && <View style={tw`absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-full`} />}
    </TouchableOpacity>
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
    <View style={tw`px-2.5 py-1 rounded-full ${colors[status] || 'bg-gray-100 text-gray-700'}`}>
      <Text style={tw`text-[9px] font-bold uppercase tracking-wider ${colors[status]?.split(' ')[1] || 'text-gray-700'}`}>
        {status}
      </Text>
    </View>
  );
}

function ProgressStepper({ status }: { status: string }) {
  const step = status === 'Booked' ? 0 : (status === 'In Progress' ? 1 : 2);
  
  return (
    <View style={tw`flex-row items-center justify-between relative mt-4 px-2`}>
      <View style={tw`absolute top-[5px] left-8 right-8 h-1 bg-gray-100`}>
        <View 
          style={[tw`h-full bg-blue-600`, { width: `${step === 0 ? 0 : (step === 1 ? 50 : 100)}%` }]} 
        />
      </View>
      
      <View style={tw`items-center gap-2 z-10`}>
        <View style={tw`w-3 h-3 rounded-full border-2 ${step >= 0 ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}`} />
        <Text style={tw`text-[8px] font-bold uppercase ${step >= 0 ? 'text-blue-600' : 'text-gray-400'}`}>Booked</Text>
      </View>

      <View style={tw`items-center gap-2 z-10`}>
        <View style={tw`w-3 h-3 rounded-full border-2 ${step >= 1 ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}`} />
        <Text style={tw`text-[8px] font-bold uppercase ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>In Progress</Text>
      </View>

      <View style={tw`items-center gap-2 z-10`}>
        <View style={tw`w-3 h-3 rounded-full border-2 ${step >= 2 ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}`} />
        <Text style={tw`text-[8px] font-bold uppercase ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>Completed</Text>
      </View>
    </View>
  );
}
