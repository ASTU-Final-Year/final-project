import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Image } from 'react-native';
import { useUIStore } from '../store';
import { ArrowLeft, CreditCard, ChevronRight, Lock, Building, Smartphone, Plus, CheckCircle2 } from 'lucide-react-native';
import { tw } from '../lib/native-utils';

export default function PaymentScreen() {
  const { setActiveScreen } = useUIStore();
  const [selectedMethod, setSelectedMethod] = useState<string>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Chapa form fields
  const [chapaName, setChapaName] = useState('');
  const [chapaPhone, setChapaPhone] = useState('');
  const [chapaEmail, setChapaEmail] = useState('');
  const [errors, setErrors] = useState<{ name?: string; phone?: string; email?: string }>({});

  const handlePayment = () => {
    // Validate Chapa fields
    if (selectedMethod === 'card') {
      const newErrors: { name?: string; phone?: string; email?: string } = {};

      if (!chapaName.trim() || chapaName.trim().length < 3) {
        newErrors.name = 'Full name must be at least 3 characters.';
      }
      if (!chapaPhone.trim() || !/^[79]\d{8}$/.test(chapaPhone.trim())) {
        newErrors.phone = 'Enter a valid 9-digit Ethiopian phone number (e.g. 911234567).';
      }
      if (!chapaEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(chapaEmail.trim())) {
        newErrors.email = 'Enter a valid email address.';
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      setErrors({});
    }

    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);

      // Auto redirect to home after 3 seconds
      setTimeout(() => {
        setActiveScreen('HOME');
      }, 3000);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <View style={tw`flex-1 bg-white items-center justify-center px-6`}>
         <View style={tw`w-24 h-24 bg-green-50 rounded-full items-center justify-center mb-6`}>
           <CheckCircle2 size={48} color="#22C55E" />
         </View>
         <Text style={tw`text-2xl font-bold text-gray-900 mb-2`}>Payment Successful!</Text>
         <Text style={tw`text-center text-gray-500 mb-10`}>Your payment of 1,250 ETB has been successfully processed.</Text>
         <TouchableOpacity 
           onPress={() => setActiveScreen('HOME')}
           style={tw`w-full bg-blue-600 py-4 rounded-2xl items-center shadow-lg shadow-blue-200`}
         >
            <Text style={tw`text-white font-bold`}>Back to Home</Text>
         </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      {/* Header */}
      <View style={tw`bg-white px-6 pt-6 pb-4 rounded-b-[32px] shadow-sm border-b border-gray-100 flex-row items-center justify-between`}>
        <Text style={tw`text-xl font-bold text-gray-900`}>Checkout</Text>
        <View style={tw`px-3 py-1 bg-blue-50 rounded-full`}>
           <Text style={tw`text-xs font-bold text-blue-600 uppercase tracking-widest`}>Secure</Text>
        </View>
      </View>

      <ScrollView style={tw`flex-1 px-6 py-6`} showsVerticalScrollIndicator={false} contentContainerStyle={tw`pb-24`}>
         {/* Amount Card */}
         <View style={tw`bg-blue-600 rounded-[32px] p-6 mb-8 shadow-xl shadow-blue-200 items-center justify-center`}>
            <Text style={tw`text-blue-200 text-sm font-bold uppercase tracking-widest mb-1`}>Total Amount Due</Text>
            <View style={tw`flex-row items-end gap-1 mb-4`}>
               <Text style={tw`text-white text-4xl font-extrabold`}>1,250</Text>
               <Text style={tw`text-blue-200 text-xl font-bold mb-1`}>ETB</Text>
            </View>
            <View style={tw`bg-white bg-opacity-20 px-4 py-2 rounded-xl flex-row items-center gap-2`}>
               <Lock size={12} color="white" />
               <Text style={tw`text-white text-xs font-semibold`}>End-to-End Encrypted</Text>
            </View>
         </View>

         {/* Payment Methods */}
         <Text style={tw`text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 ml-2`}>Select Payment Method</Text>
         
         <View style={tw`gap-3 mb-8`}>
            <PaymentMethodCard 
               id="card"
               title="Chapa Payment"
               subtitle="Pay securely via Chapa"
               icon={<CreditCard size={20} color={selectedMethod === 'card' ? '#2563EB' : '#6B7280'} />}
               selected={selectedMethod === 'card'}
               onSelect={() => setSelectedMethod('card')}
            />
            <PaymentMethodCard 
               id="telebirr"
               title="Telebirr"
               subtitle="Pay using mobile money"
               icon={<Smartphone size={20} color={selectedMethod === 'telebirr' ? '#2563EB' : '#6B7280'} />}
               selected={selectedMethod === 'telebirr'}
               onSelect={() => setSelectedMethod('telebirr')}
            />
            <PaymentMethodCard 
               id="cbebirr"
               title="CBE Birr"
               subtitle="Commercial Bank of Ethiopia"
               icon={<Building size={20} color={selectedMethod === 'cbebirr' ? '#2563EB' : '#6B7280'} />}
               selected={selectedMethod === 'cbebirr'}
               onSelect={() => setSelectedMethod('cbebirr')}
            />
         </View>

         {/* Chapa Input Details (Conditional) */}
         {selectedMethod === 'card' && (
            <View style={tw`bg-white p-5 rounded-3xl border border-gray-100 shadow-sm mb-8`}>
               {/* Full Name */}
               <View style={tw`mb-4`}>
                  <Text style={tw`text-xs font-bold text-gray-700 mb-2 ml-1`}>Full Name</Text>
                  <TextInput
                     placeholder="Enter your full name"
                     autoCapitalize="words"
                     placeholderTextColor="#C4C9D4"
                     value={chapaName}
                     onChangeText={setChapaName}
                     style={[
                       tw`w-full bg-gray-50 border rounded-2xl py-3.5 px-4 text-gray-900 font-medium`,
                       { borderColor: errors.name ? '#EF4444' : '#F3F4F6' }
                     ]}
                  />
                  {errors.name && <Text style={tw`text-red-500 text-[10px] font-semibold mt-1 ml-1`}>{errors.name}</Text>}
               </View>

               {/* Phone Number */}
               <View style={tw`mb-4`}>
                  <Text style={tw`text-xs font-bold text-gray-700 mb-2 ml-1`}>Phone Number</Text>
                  <View style={[
                    tw`flex-row items-center border rounded-2xl overflow-hidden`,
                    { borderColor: errors.phone ? '#EF4444' : '#F3F4F6' }
                  ]}>
                     <View style={tw`bg-gray-100 py-3.5 px-4`}>
                        <Text style={tw`font-bold text-gray-600`}>+251</Text>
                     </View>
                     <TextInput
                        placeholder="911 234 567"
                        keyboardType="phone-pad"
                        placeholderTextColor="#C4C9D4"
                        value={chapaPhone}
                        onChangeText={setChapaPhone}
                        style={tw`flex-1 bg-gray-50 py-3.5 px-4 text-gray-900 font-medium`}
                     />
                  </View>
                  {errors.phone && <Text style={tw`text-red-500 text-[10px] font-semibold mt-1 ml-1`}>{errors.phone}</Text>}
               </View>

               {/* Email Address */}
               <View>
                  <Text style={tw`text-xs font-bold text-gray-700 mb-2 ml-1`}>Email Address</Text>
                  <TextInput
                     placeholder="you@example.com"
                     keyboardType="email-address"
                     autoCapitalize="none"
                     placeholderTextColor="#C4C9D4"
                     value={chapaEmail}
                     onChangeText={setChapaEmail}
                     style={[
                       tw`w-full bg-gray-50 border rounded-2xl py-3.5 px-4 text-gray-900 font-medium`,
                       { borderColor: errors.email ? '#EF4444' : '#F3F4F6' }
                     ]}
                  />
                  {errors.email && <Text style={tw`text-red-500 text-[10px] font-semibold mt-1 ml-1`}>{errors.email}</Text>}
               </View>
            </View>
         )}

         {/* Telebirr Details */}
         {selectedMethod === 'telebirr' && (
            <View style={tw`bg-white p-5 rounded-3xl border border-gray-100 shadow-sm mb-8`}>
               <View>
                  <Text style={tw`text-xs font-bold text-gray-700 mb-2 ml-1`}>Phone Number</Text>
                  <View style={tw`flex-row items-center`}>
                     <View style={tw`bg-gray-100 py-3.5 px-4 rounded-l-2xl border border-r-0 border-gray-100`}>
                        <Text style={tw`font-bold text-gray-600`}>+251</Text>
                     </View>
                     <TextInput
                        placeholder="911 234 567"
                        placeholderTextColor="#C4C9D4"
                        keyboardType="phone-pad"
                        style={tw`flex-1 bg-gray-50 border border-gray-100 rounded-r-2xl py-3.5 px-4 text-gray-900 font-medium`}
                     />
                  </View>
               </View>
            </View>
         )}

         {/* CBE Birr Details */}
         {selectedMethod === 'cbebirr' && (
            <View style={tw`bg-white p-5 rounded-3xl border border-gray-100 shadow-sm mb-8`}>
               <View style={tw`mb-4`}>
                  <Text style={tw`text-xs font-bold text-gray-700 mb-2 ml-1`}>CBE Account Number</Text>
                  <TextInput
                     placeholder="e.g. 1000123456789"
                     placeholderTextColor="#C4C9D4"
                     keyboardType="numeric"
                     style={tw`w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 px-4 text-gray-900 font-medium`}
                  />
               </View>
               <View>
                  <Text style={tw`text-xs font-bold text-gray-700 mb-2 ml-1`}>Phone Number</Text>
                  <View style={tw`flex-row items-center`}>
                     <View style={tw`bg-gray-100 py-3.5 px-4 rounded-l-2xl border border-r-0 border-gray-100`}>
                        <Text style={tw`font-bold text-gray-600`}>+251</Text>
                     </View>
                     <TextInput
                        placeholder="911 234 567"
                        placeholderTextColor="#C4C9D4"
                        keyboardType="phone-pad"
                        style={tw`flex-1 bg-gray-50 border border-gray-100 rounded-r-2xl py-3.5 px-4 text-gray-900 font-medium`}
                     />
                  </View>
               </View>
            </View>
         )}

         {/* Pay Button */}
         <TouchableOpacity 
           onPress={handlePayment}
           disabled={isProcessing}
           style={tw`w-full bg-gray-900 py-4 rounded-2xl flex-row items-center justify-center shadow-xl shadow-gray-200 ${isProcessing ? 'opacity-70' : ''}`}
           activeOpacity={0.8}
         >
           {isProcessing ? (
              <Text style={tw`text-white font-bold text-base`}>Processing...</Text>
           ) : (
              <>
                 <Text style={tw`text-white font-bold text-base mr-2`}>Pay 1,250 ETB</Text>
                 <ChevronRight color="white" size={20} />
              </>
           )}
         </TouchableOpacity>
         <View style={tw`flex-row items-center justify-center gap-1 mt-4`}>
            <Lock size={10} color="#9CA3AF" />
            <Text style={tw`text-[10px] text-gray-400 font-semibold uppercase`}>Payments are 100% secure & encrypted</Text>
         </View>
      </ScrollView>
    </View>
  );
}

function PaymentMethodCard({ title, subtitle, icon, selected, onSelect }: any) {
   return (
      <TouchableOpacity 
         onPress={onSelect}
         activeOpacity={0.7}
         style={tw`w-full p-4 rounded-2xl flex-row items-center border ${selected ? 'border-blue-600 bg-blue-50' : 'border-gray-100 bg-white'}`}
      >
         <View style={tw`w-10 h-10 rounded-full items-center justify-center mr-3 ${selected ? 'bg-blue-100' : 'bg-gray-50'}`}>
            {icon}
         </View>
         <View style={tw`flex-1`}>
            <Text style={tw`text-sm font-bold ${selected ? 'text-blue-900' : 'text-gray-900'}`}>{title}</Text>
            <Text style={tw`text-[10px] font-semibold text-gray-500`}>{subtitle}</Text>
         </View>
         <View style={tw`w-5 h-5 rounded-full border-2 items-center justify-center ${selected ? 'border-blue-600' : 'border-gray-300'}`}>
            {selected && <View style={tw`w-2.5 h-2.5 rounded-full bg-blue-600`} />}
         </View>
      </TouchableOpacity>
   )
}
