/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, Platform } from 'react-native';
import { useUIStore, useAuthStore, useAppointmentStore } from './store';
import { LayoutGrid, CalendarCheck, User, Plus, Bell } from 'lucide-react-native';
import { tw } from './lib/native-utils';

// Screens
import LoginScreen from './components/LoginScreen';
import SignUpScreen from './components/SignUpScreen';
import HomeScreen from './components/HomeScreen';
import BookingScreen from './components/BookingScreen';
import AppointmentsScreen from './components/AppointmentsScreen';
import DetailScreen from './components/DetailScreen';
import ProfileScreen from './components/ProfileScreen';
import NotificationsScreen from './components/NotificationsScreen';

export default function App() {
  const { activeScreen, setActiveScreen } = useUIStore();
  const { isAuthenticated } = useAuthStore();
  const { appointments } = useAppointmentStore();

  const upcomingCount = useMemo(() => {
    const now = new Date();
    return appointments.filter(app => {
      if (app.status !== 'Booked') return false;
      try {
        const [timePart, ampm] = app.time.split(' ');
        let [hrs, mins] = timePart.split(':').map(Number);
        if (ampm === 'PM' && hrs < 12) hrs += 12;
        if (ampm === 'AM' && hrs === 12) hrs = 0;
        const appDate = new Date(app.date);
        appDate.setHours(hrs, mins, 0, 0);
        const diffInMs = appDate.getTime() - now.getTime();
        const diffInHours = diffInMs / (1000 * 60 * 60);
        return diffInHours > 0 && diffInHours <= 1;
      } catch (e) {
        return false;
      }
    }).length;
  }, [appointments]);

  const renderScreen = () => {
    console.log('Current Screen:', activeScreen, 'Authenticated:', isAuthenticated);
    if (!isAuthenticated) {
      if (activeScreen === 'SIGNUP') return <SignUpScreen />;
      return <LoginScreen />;
    }

    switch (activeScreen) {
      case 'HOME': return <HomeScreen />;
      case 'BOOKING': return <BookingScreen />;
      case 'ACTIVE':
      case 'HISTORY': return <AppointmentsScreen />;
      case 'DETAIL': return <DetailScreen />;
      case 'PROFILE': return <ProfileScreen />;
      case 'NOTIFICATIONS': return <NotificationsScreen />;
      default: return <HomeScreen />;
    }
  };

  const showNavbar = isAuthenticated && !['LOGIN', 'SIGNUP', 'BOOKING', 'DETAIL', 'NOTIFICATIONS'].includes(activeScreen);

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <StatusBar barStyle="dark-content" />
      
      {/* Dynamic Content */}
      <View style={tw`flex-1`}>
        {renderScreen()}
      </View>

      {/* Navigation Bar */}
      {showNavbar && (
        <View style={tw`bg-white border-t border-gray-100 flex-row justify-between items-center px-6 pt-3 pb-8`}>
          <NavButton 
            icon={LayoutGrid} 
            label="Home" 
            active={activeScreen === 'HOME'} 
            onClick={() => setActiveScreen('HOME')} 
          />
          <NavButton 
            icon={CalendarCheck} 
            label="Appointment" 
            active={activeScreen === 'ACTIVE' || activeScreen === 'HISTORY'} 
            onClick={() => setActiveScreen('ACTIVE')} 
            badge={upcomingCount > 0 ? upcomingCount : undefined}
          />
          
          <TouchableOpacity 
            onPress={() => setActiveScreen('BOOKING')}
            style={tw`w-14 h-14 rounded-full bg-blue-600 items-center justify-center shadow-xl shadow-blue-200 -mt-8 border-4 border-white`}
            activeOpacity={0.9}
          >
            <Plus size={28} color="white" strokeWidth={3} />
          </TouchableOpacity>

          <NavButton 
            icon={User} 
            label="Profile" 
            active={activeScreen === 'PROFILE'} 
            onClick={() => setActiveScreen('PROFILE')} 
          />
          
          <NavButton 
            icon={Bell} 
            label="Alerts" 
            active={activeScreen === 'NOTIFICATIONS'} 
            onClick={() => setActiveScreen('NOTIFICATIONS')} 
          />
        </View>
      )}
    </SafeAreaView>
  );
}

function NavButton({ icon: Icon, label, active, onClick, badge }: { icon: any, label: string, active: boolean, onClick: () => void, badge?: number }) {
  return (
    <TouchableOpacity 
      onPress={onClick}
      style={tw`items-center gap-1`}
      activeOpacity={0.7}
    >
      <View style={tw`w-10 h-10 items-center justify-center rounded-2xl ${active ? 'bg-blue-600 shadow-lg shadow-blue-100' : 'bg-transparent'}`}>
        <Icon 
          size={20} 
          color={active ? "white" : "#9CA3AF"} 
        />
        {badge !== undefined && (
          <View style={tw`absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full items-center justify-center border-2 border-white`}>
            <Text style={tw`text-[9px] font-bold text-white`}>{badge}</Text>
          </View>
        )}
      </View>
      <Text style={tw`text-[9px] font-bold tracking-tight uppercase ${active ? 'text-blue-600' : 'text-gray-400 opacity-60'}`}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}


