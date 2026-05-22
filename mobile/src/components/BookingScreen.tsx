
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useUIStore, useBookingStore, useAppointmentStore } from '../store';
import { ArrowLeft, Star, MapPin, ChevronRight, Clock, Check } from 'lucide-react-native';
import { CATEGORIES, BUSINESSES, getStepsByCategory } from '../data/mockData';
import { tw } from '../lib/native-utils';

export default function BookingScreen() {
  const setActiveScreen = useUIStore((state) => state.setActiveScreen);
  const setAppointmentTab = useUIStore((state) => state.setAppointmentTab);
  const addAppointment = useAppointmentStore((state) => state.addAppointment);
  
  const { 
    selectedCategory, selectedBusiness, selectedService, selectedDate, selectedTime,
    setCategory, setBusiness, setService, setDate, setTime, reset
  } = useBookingStore();

  const handleConfirm = () => {
    if (selectedBusiness && selectedService && selectedDate && selectedTime) {
      addAppointment({
        id: Math.random().toString(36).substring(2, 9),
        businessId: selectedBusiness.id,
        businessName: selectedBusiness.name,
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        date: selectedDate,
        time: selectedTime,
        status: 'Booked',
        price: selectedService.price,
        progressSteps: getStepsByCategory(selectedBusiness.category, selectedService.name)
      });
      reset();
      setAppointmentTab('Upcoming');
      setActiveScreen('ACTIVE');
    }
  };

  const dates = [
    { label: 'Today', value: '2024-05-11' },
    { label: 'Tomorrow', value: '2024-05-12' },
    { label: 'Sat, 13', value: '2024-05-13' },
    { label: 'Sun, 14', value: '2024-05-14' },
    { label: 'Mon, 15', value: '2024-05-15' },
  ];

  const times = ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];

  const filteredBusinesses = selectedCategory 
    ? BUSINESSES.filter(b => b.category === selectedCategory)
    : BUSINESSES;

  return (
    <View style={tw`flex-1 bg-white`}>
      {/* Header */}
      <View style={tw`px-6 py-4 flex-row items-center gap-4 border-b border-gray-100`}>
        <TouchableOpacity 
          onPress={() => { reset(); setActiveScreen('HOME'); }} 
          style={tw`p-2 border border-gray-200 bg-gray-50 rounded-xl`}
        >
          <ArrowLeft size={20} color="#374151" />
        </TouchableOpacity>
        <Text style={tw`text-lg font-bold text-gray-900`}>Quick Book</Text>
      </View>

      <ScrollView contentContainerStyle={tw`pb-48`} showsVerticalScrollIndicator={false}>
        {/* Sector Selection */}
        <View style={tw`px-6 py-6`}>
          <Text style={tw`text-lg font-bold text-gray-900 mb-4`}>Choose what you want</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={tw`pb-2 gap-3`}>
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => setCategory(cat.id)}
                  style={tw`px-5 py-2.5 rounded-full flex-row items-center gap-2 border ${isSelected ? 'bg-blue-600 border-blue-600 shadow-lg shadow-blue-100' : 'bg-white border-gray-100'}`}
                >
                  <Icon size={18} color={isSelected ? 'white' : '#2563EB'} />
                  <Text style={tw`text-xs font-bold ${isSelected ? 'text-white' : 'text-gray-500'}`}>{cat.name}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Business Selection */}
        {!selectedBusiness ? (
          <View style={tw`px-6 gap-4`}>
             <View style={tw`flex-row justify-between items-center`}>
               <Text style={tw`text-[10px] font-bold text-gray-400 uppercase tracking-widest`}>Select a provider</Text>
               <Text style={tw`text-[10px] font-bold text-blue-600 uppercase`}>{filteredBusinesses.length} found</Text>
             </View>
             <View style={tw`gap-4`}>
                {filteredBusinesses.map((biz) => (
                  <TouchableOpacity 
                    key={biz.id}
                    onPress={() => setBusiness(biz)}
                    style={tw`w-full p-5 border border-gray-100 bg-white rounded-[32px] flex-row items-center gap-5 shadow-sm`}
                  >
                    <View style={tw`relative`}>
                      <Image source={typeof biz.image === 'string' ? { uri: biz.image } : biz.image} style={tw`w-20 h-20 rounded-3xl`} />
                      <View style={tw`absolute -top-1.5 -right-1.5 bg-white shadow-md border border-yellow-50 p-1.5 rounded-full`}>
                         <Star size={10} color="#FBBF24" fill="#FBBF24" />
                      </View>
                    </View>
                    <View style={tw`flex-1`}>
                      <Text style={tw`font-bold text-gray-900 text-base mb-1`} numberOfLines={1}>{biz.name}</Text>
                      <View style={tw`flex-row items-center gap-1 mb-2`}>
                        <MapPin size={10} color="#3B82F6" />
                        <Text style={tw`text-gray-400 text-[10px] font-bold`} numberOfLines={1}>{biz.location}</Text>
                      </View>
                      <View style={tw`flex-row items-center justify-between`}>
                        <View style={tw`bg-blue-50 px-2 py-1 rounded-lg`}>
                          <Text style={tw`text-[11px] font-bold text-blue-700`}>Starting {biz.services[0].price} ETB</Text>
                        </View>
                        <View style={tw`flex-row items-center gap-0.5`}>
                           <Text style={tw`text-yellow-600 text-[10px] font-bold`}>{biz.rating}</Text>
                           <Text style={tw`text-gray-400 text-[10px] font-medium ml-1`}>★</Text>
                        </View>
                      </View>
                    </View>
                    <View style={tw`w-10 h-10 rounded-2xl bg-gray-50 items-center justify-center`}>
                      <ChevronRight size={18} color="#9CA3AF" />
                    </View>
                  </TouchableOpacity>
                ))}
             </View>

          </View>
        ) : (
          <View>
            {/* Selected Business Card */}
            <View style={tw`px-6 mb-8`}>
               <View style={tw`p-4 bg-blue-50 rounded-3xl border border-blue-100 flex-row items-center justify-between`}>
                 <View style={tw`flex-row items-center gap-3 flex-1`}>
                   <Image source={typeof selectedBusiness.image === 'string' ? { uri: selectedBusiness.image } : selectedBusiness.image} style={tw`w-12 h-12 rounded-2xl`} />
                   <View style={tw`flex-1`}>
                     <Text style={tw`font-bold text-blue-900 text-sm`} numberOfLines={1}>{selectedBusiness.name}</Text>
                     <Text style={tw`text-[10px] font-bold text-blue-500 uppercase`}>{selectedBusiness.location}</Text>
                   </View>
                 </View>
                 <TouchableOpacity onPress={() => setBusiness(null)}>
                   <Text style={tw`text-xs font-bold text-blue-600`}>Change</Text>
                 </TouchableOpacity>
               </View>
            </View>

            {/* Select Service Board */}
            <View style={tw`px-6 mb-8`}>
               <View style={tw`p-6 bg-white rounded-[32px] border border-gray-100 shadow-sm`}>
                  <Text style={tw`text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4`}>Select Service</Text>
                  <View style={tw`gap-4`}>
                    {selectedBusiness.services.map((svc) => {
                      const isSelected = selectedService?.id === svc.id;
                      return (
                        <TouchableOpacity 
                         key={svc.id}
                         onPress={() => setService(svc)}
                         style={tw`w-full p-5 rounded-[28px] border flex-col gap-3 ${isSelected ? 'bg-blue-50 border-blue-600' : 'bg-white border-gray-100 shadow-sm'}`}
                        >
                          <View style={tw`flex-row items-start justify-between w-full`}>
                            <View style={tw`flex-1 pr-4`}>
                              <Text style={tw`font-bold text-base mb-1 ${isSelected ? 'text-blue-900' : 'text-gray-800'}`} numberOfLines={1}>
                                {svc.name}
                              </Text>
                              <Text style={tw`text-[10px] leading-relaxed text-gray-400`} numberOfLines={2}>
                                {svc.description}
                              </Text>
                            </View>
                            <View style={tw`w-8 h-8 rounded-full border-2 items-center justify-center ${isSelected ? 'bg-blue-600 border-blue-600' : 'bg-gray-50 border-gray-100'}`}>
                               {isSelected ? (
                                 <Check size={16} color="white" strokeWidth={3} />
                               ) : (
                                 <View style={tw`w-1.5 h-1.5 rounded-full bg-gray-200`} />
                               )}
                            </View>
                          </View>
                          
                          <View style={tw`flex-row items-center justify-between w-full pt-1 border-t border-gray-50`}>
                            <View style={tw`flex-row items-center gap-2`}>
                               <View style={tw`flex-row items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100`}>
                                  <Clock color="#3B82F6" size={12} />
                                  <Text style={tw`text-[10px] font-bold text-gray-500`}>{svc.duration}</Text>
                               </View>
                               {isSelected && (
                                 <View style={tw`bg-blue-100 px-1.5 py-0.5 rounded`}>
                                   <Text style={tw`text-[9px] font-bold text-blue-600 uppercase tracking-tighter`}>Selected</Text>
                                 </View>
                               )}
                            </View>
                            <Text style={tw`text-sm font-bold ${isSelected ? 'text-blue-600' : 'text-gray-900'}`}>
                              {svc.price} <Text style={tw`text-[10px] font-bold opacity-60`}>ETB</Text>
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
               </View>
            </View>

            {/* Select Date & Time Board */}
            <View style={tw`px-6 mb-12`}>
               <View style={tw`p-6 bg-gray-50 rounded-[32px] border border-gray-100 shadow-sm`}>
                  <View style={tw`mb-6`}>
                    <View style={tw`flex-row items-center gap-2 mb-4`}>
                      <View style={tw`w-5 h-5 rounded-lg bg-blue-100 items-center justify-center`}>
                        <Clock color="#2563EB" size={12} />
                      </View>
                      <Text style={tw`text-[10px] font-bold text-gray-400 uppercase tracking-widest`}>Select Date</Text>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={tw`pb-2 gap-3`}>
                      {dates.map((d) => (
                        <TouchableOpacity 
                         key={d.value}
                         onPress={() => setDate(d.value)}
                         style={tw`min-w-[80px] py-4 rounded-2xl border items-center justify-center ${selectedDate === d.value ? 'bg-blue-600 border-blue-600 shadow-lg shadow-blue-100' : 'bg-white border-gray-100'}`}
                        >
                          <Text style={tw`text-[10px] font-bold uppercase opacity-80 ${selectedDate === d.value ? 'text-white' : 'text-gray-500'}`}>{d.label.split(',')[0]}</Text>
                          <Text style={tw`text-sm font-bold ${selectedDate === d.value ? 'text-white' : 'text-gray-900'}`}>{d.label.includes(',') ? d.label.split(',')[1].trim() : (d.value.split('-')[2])}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>

                  <View>
                    <View style={tw`flex-row items-center gap-2 mb-4`}>
                      <View style={tw`w-5 h-5 rounded-lg bg-blue-100 items-center justify-center`}>
                        <Clock color="#2563EB" size={12} />
                      </View>
                      <Text style={tw`text-[10px] font-bold text-gray-400 uppercase tracking-widest`}>Select Time</Text>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={tw`pb-2 gap-3`}>
                      {(selectedBusiness.availableTimes || times).map((t) => (
                        <TouchableOpacity 
                         key={t}
                         onPress={() => setTime(t)}
                         style={tw`min-w-[95px] py-4 rounded-2xl border items-center justify-center ${selectedTime === t ? 'bg-blue-600 border-blue-600 shadow-lg shadow-blue-100' : 'bg-white border-gray-100'}`}
                        >
                          <Text style={tw`text-[11px] font-bold ${selectedTime === t ? 'text-white' : 'text-gray-500'}`}>{t}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
               </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Sticky Bottom Confirmation */}
      {selectedService ? (
        <View style={tw`absolute bottom-8 left-6 right-6`}>
           <View style={tw`bg-gray-900 p-6 rounded-[32px] shadow-2xl shadow-blue-300 border border-gray-800`}>
              <View style={tw`flex-row justify-between items-center mb-5 px-1`}>
                 <View>
                   <Text style={tw`text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1`}>Estimated Total</Text>
                   <Text style={tw`text-2xl font-black text-blue-400`}>{selectedService.price} <Text style={tw`text-xs font-bold text-blue-500`}>ETB</Text></Text>
                 </View>
                 <View style={tw`items-end`}>
                   <Text style={tw`text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1`}>Selection</Text>
                   <Text style={tw`text-xs font-bold text-white`} numberOfLines={1}>{selectedService.name}</Text>
                 </View>
              </View>
              <TouchableOpacity 
                onPress={handleConfirm}
                disabled={!selectedDate || !selectedTime}
                style={tw`w-full bg-blue-600 py-4.5 rounded-2xl flex-row items-center justify-center gap-3 ${(!selectedDate || !selectedTime) ? 'bg-gray-700 opacity-50' : ''}`}
                activeOpacity={0.8}
              >
                <Text style={tw`text-white font-bold text-base`}>Confirm Appointment</Text>
                <Check color="white" size={22} strokeWidth={3} />
              </TouchableOpacity>
           </View>
        </View>
      ) : null}
    </View>
  );
}
