import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, LayoutAnimation, Platform, UIManager } from 'react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
import { useUIStore, useAppointmentStore } from '../store';
import { ArrowLeft, User, Clock, CheckCircle2, ChevronDown, ChevronUp, Phone, Mail } from 'lucide-react-native';
import { tw } from '../lib/native-utils';

export default function DetailScreen() {
  const { viewingAppointmentId, setViewingAppointment } = useUIStore();
  const { appointments, cancelAppointment } = useAppointmentStore();
  const [isProviderExpanded, setIsProviderExpanded] = useState(false);

  const toggleProviderDetails = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsProviderExpanded(!isProviderExpanded);
  };
  
  const appointment = appointments.find(a => a.id === viewingAppointmentId);

  if (!appointment) return null;

  return (
    <View style={tw`flex-1 bg-white`}>
      {/* Header */}
      <View style={tw`px-6 py-4 flex-row items-center justify-between border-b border-gray-50`}>
        <TouchableOpacity 
          onPress={() => setViewingAppointment(null)} 
          style={tw`p-2 border border-gray-200 bg-gray-50 rounded-xl`}
        >
          <ArrowLeft size={20} color="#374151" />
        </TouchableOpacity>
        <Text style={tw`text-[10px] font-bold text-gray-400 uppercase tracking-widest`}>Order Details</Text>
        <View style={tw`w-10`} />
      </View>

      <ScrollView style={tw`flex-1 px-6 py-6`} showsVerticalScrollIndicator={false}>
        {/* Business Info */}
        <View style={tw`mb-8`}>
           <View style={tw`flex-row justify-between items-start mb-4`}>
              <View style={tw`flex-1 pr-2`}>
                <Text style={tw`text-xl font-bold text-gray-900`}>{appointment.businessName}</Text>
                <Text style={tw`text-sm text-gray-500`}>{appointment.serviceName}</Text>
              </View>
              <StatusBadge status={appointment.status} />
           </View>
           
           <View style={tw`flex-row gap-4`}>
              <View style={tw`flex-1 p-4 bg-gray-50 rounded-2xl border border-gray-100`}>
                 <Text style={tw`text-[9px] font-bold text-gray-400 uppercase mb-1`}>OrderID</Text>
                 <Text style={tw`text-xs font-bold`}>#{appointment.id}</Text>
              </View>
              <View style={tw`flex-1 p-4 bg-gray-50 rounded-2xl border border-gray-100`}>
                 <Text style={tw`text-[9px] font-bold text-gray-400 uppercase mb-1`}>Location</Text>
                 <Text style={tw`text-xs font-bold`} numberOfLines={1}>Addis Ababa</Text>
              </View>
           </View>
        </View>

        {/* Technician */}
        <View style={tw`mb-8 p-4 bg-blue-600 rounded-3xl shadow-lg shadow-blue-100`}>
           <View style={tw`flex-row items-center justify-between`}>
             <View style={tw`flex-row items-center gap-3 flex-1`}>
               <View style={tw`w-10 h-10 rounded-full bg-white bg-opacity-20 items-center justify-center`}>
                 <User size={20} color="white" />
               </View>
               <View style={tw`flex-1`}>
                 <Text style={tw`text-[9px] font-bold text-white text-opacity-60 uppercase`}>Service Provider</Text>
                 <Text style={tw`text-sm font-bold text-white`}>{appointment.technician || 'Pending Assignment'}</Text>
               </View>
             </View>
             <TouchableOpacity 
               onPress={toggleProviderDetails}
               style={tw`w-10 h-10 bg-white bg-opacity-20 rounded-full items-center justify-center`}
             >
                {isProviderExpanded ? <ChevronUp size={16} color="white" /> : <ChevronDown size={16} color="white" />}
             </TouchableOpacity>
           </View>
           {isProviderExpanded && (
             <View style={tw`mt-4 pt-4 border-t border-white border-opacity-20 gap-3`}>
                <View style={tw`flex-row items-center gap-3`}>
                   <View style={tw`w-8 h-8 rounded-full bg-white bg-opacity-20 items-center justify-center`}>
                      <Phone size={14} color="white" />
                   </View>
                   <Text style={tw`text-xs font-bold text-white`}>+251 911 234 567</Text>
                </View>
                <View style={tw`flex-row items-center gap-3`}>
                   <View style={tw`w-8 h-8 rounded-full bg-white bg-opacity-20 items-center justify-center`}>
                      <Mail size={14} color="white" />
                   </View>
                   <Text style={tw`text-xs font-bold text-white`}>
                     {appointment.technician ? appointment.technician.toLowerCase().replace(' ', '.') + '@servesync.com' : 'support@servesync.com'}
                   </Text>
                </View>
             </View>
           )}
        </View>

        {/* Detailed Progress */}
        <View style={tw`mb-10`}>
           <Text style={tw`text-sm font-bold text-gray-900 mb-6 px-1 uppercase tracking-tight`}>Service Timeline</Text>
           <View style={tw`pl-2`}>
             {appointment.progressSteps?.map((step, idx) => (
               <View key={step.id} style={tw`relative pl-8 pb-8`}>
                  {/* Timeline Line */}
                  {idx !== appointment.progressSteps!.length - 1 && (
                    <View style={[
                      tw`absolute left-[7px] top-[14px] bottom-[-14px] w-[2px]`,
                      { backgroundColor: step.status === 'completed' ? '#22C55E' : '#F3F4F6' }
                    ]} />
                  )}
                  
                  {/* Icon */}
                  <View style={tw`absolute left-[-2px] top-0`}>
                    {step.status === 'completed' ? (
                      <CheckCircle2 size={20} color="#22C55E" fill="white" />
                    ) : step.status === 'in-progress' ? (
                      <View style={tw`w-5 h-5 rounded-full border-4 border-blue-600 bg-white`} />
                    ) : (
                      <View style={tw`w-5 h-5 rounded-full border-2 border-gray-200 bg-gray-50`} />
                    )}
                  </View>

                  <View style={tw`flex-row justify-between items-start`}>
                    <View style={tw`flex-1 pr-2`}>
                      <Text style={tw`text-sm font-bold ${step.status === 'upcoming' ? 'text-gray-400' : 'text-gray-900'}`}>
                        {step.label}
                      </Text>
                      <Text style={tw`text-[10px] font-bold text-gray-400`}>
                        {step.status === 'completed' ? 'Success' : (step.status === 'in-progress' ? 'Currently working' : 'Waiting...')}
                      </Text>
                    </View>
                    {step.timestamp && (
                      <View style={tw`bg-gray-50 px-2 py-1 rounded-md`}>
                        <Text style={tw`text-[10px] font-bold text-gray-400`}>
                          {step.timestamp}
                        </Text>
                      </View>
                    )}
                  </View>
               </View>
             ))}
           </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={tw`p-6 border-t border-gray-50`}>
         <TouchableOpacity 
           onPress={() => {
             cancelAppointment(appointment.id);
             setViewingAppointment(null);
           }}
           style={tw`w-full py-4 bg-red-50 rounded-2xl items-center`}
         >
           <Text style={tw`text-red-500 text-xs font-bold`}>Cancel Appointment</Text>
         </TouchableOpacity>
      </View>
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
  const colorStyle = colors[status] || 'bg-gray-100 text-gray-700';
  const parts = colorStyle.split(' ');
  const bg = parts[0];
  const text = parts[1];
  return (
    <View style={tw`px-3 py-1.5 rounded-full ${bg}`}>
      <Text style={tw`text-[10px] font-bold uppercase tracking-wider ${text}`}>
        {status === 'In Progress' ? 'SERVICE IN PROGRESS' : status}
      </Text>
    </View>
  );
}
