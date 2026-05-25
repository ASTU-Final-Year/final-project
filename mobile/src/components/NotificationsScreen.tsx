import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useUIStore, useNotificationStore } from '../store';
import { ArrowLeft, Bell, CheckCircle2, Info, AlertTriangle, Trash2, Clock, Check } from 'lucide-react-native';
import { tw } from '../lib/native-utils';
import { isToday, isYesterday, isTomorrow, isSameWeek, isSameMonth, parseISO, format } from 'date-fns';

export default function NotificationsScreen() {
  const { setActiveScreen, setAppointmentTab } = useUIStore();
  const { notifications, deleteNotification, clearAll, markAllAsRead, markAsRead } = useNotificationStore();

  const handleNotificationClick = (id: string) => {
    const notification = notifications.find(n => n.id === id);
    markAsRead(id);

    if (notification) {
      const title = notification.title.toLowerCase();

      if (title.includes('upcoming')) {
        setAppointmentTab('Upcoming');
        setActiveScreen('ACTIVE');
      } else if (title.includes('progress') || title.includes('confirmed')) {
        setAppointmentTab('Active');
        setActiveScreen('ACTIVE');
      } else if (title.includes('payment')) {
        setAppointmentTab('History');
        setActiveScreen('HISTORY');
      } else {
        // Fallback for general notifications
        setAppointmentTab('History');
        setActiveScreen('HISTORY');
      }
    } else {
      setActiveScreen('ACTIVE');
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={16} color="#22C55E" />;
      case 'warning':
        return <AlertTriangle size={16} color="#F59E0B" />;
      default:
        return <Info size={16} color="#3B82F6" />;
    }
  };

  // Grouping logic
  const groupedNotifications = notifications.reduce((acc, n) => {
    const date = parseISO(n.createdAt);
    const now = new Date();
    let group = 'Older';

    if (isTomorrow(date)) group = 'Tomorrow';
    else if (isToday(date)) group = 'Today';
    else if (isYesterday(date)) group = 'Yesterday';
    else if (isSameWeek(date, now)) group = 'Last Week';
    else if (isSameMonth(date, now)) group = 'Last Month';

    if (!acc[group]) acc[group] = [];
    acc[group].push(n);
    return acc;
  }, {} as Record<string, typeof notifications>);

  const groupOrder = ['Tomorrow', 'Today', 'Yesterday', 'Last Week', 'Last Month', 'Older'];

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      {/* Header */}
      <View style={tw`bg-white px-6 pt-6 pb-6 rounded-b-[32px] shadow-sm border-b border-gray-100 flex-row items-center justify-between`}>
        <View style={tw`flex-row items-center gap-4`}>
          <TouchableOpacity
            onPress={() => setActiveScreen('HOME')}
            style={tw`p-2 bg-gray-50 rounded-full`}
          >
            <ArrowLeft size={20} color="#4B5563" />
          </TouchableOpacity>
          <Text style={tw`text-xl font-bold text-gray-900`}>Notifications</Text>
        </View>
      </View>

      {/* Notifications List */}
      <ScrollView style={tw`flex-1 p-4`} showsVerticalScrollIndicator={false}>
        {notifications.length > 0 ? (
          groupOrder.map(group => {
            const groupItems = groupedNotifications[group];
            if (!groupItems || groupItems.length === 0) return null;

            return (
              <View key={group} style={tw`mb-8`}>
                <View style={tw`px-2 flex-row items-center justify-between mb-3`}>
                  <Text style={tw`text-[10px] font-bold text-gray-400 uppercase tracking-widest`}>{group}</Text>
                  <Text style={tw`text-[9px] font-bold text-gray-300`}>{groupItems.length} items</Text>
                </View>
                <View style={tw`gap-3`}>
                  {groupItems.map((notification) => (
                    <TouchableOpacity
                      key={notification.id}
                      onPress={() => handleNotificationClick(notification.id)}
                      style={tw`relative p-4 rounded-3xl border shadow-sm bg-white flex-row gap-4 items-center ${notification.isRead ? 'border-gray-100' : 'border-blue-100'}`}
                    >
                      {!notification.isRead && (
                        <View style={tw`absolute top-4 right-10 w-2 h-2 bg-blue-500 rounded-full`} />
                      )}

                      <View style={tw`w-12 h-12 rounded-[20px] items-center justify-center flex-shrink-0 ${notification.type === 'success' ? 'bg-green-50' : notification.type === 'warning' ? 'bg-amber-50' : 'bg-blue-50'}`}>
                        {getIcon(notification.type)}
                      </View>

                      <View style={tw`flex-1 pr-2`}>
                        <Text style={tw`text-[13px] font-bold mb-0.5 ${notification.isRead ? 'text-gray-900' : 'text-blue-900'}`} numberOfLines={1}>
                          {notification.title}
                        </Text>
                        <Text style={tw`text-[11px] text-gray-500 leading-relaxed mb-2`} numberOfLines={2}>
                          {notification.message}
                        </Text>

                        <View style={tw`flex-row items-center gap-2`}>
                          <View style={tw`flex-row items-center gap-1`}>
                            <Clock size={10} color="#9CA3AF" />
                            <Text style={tw`text-[9px] font-bold uppercase tracking-wider text-gray-400`}>{notification.time}</Text>
                          </View>
                          {(group === 'Last Week' || group === 'Last Month' || group === 'Older') && (
                            <>
                              <View style={tw`w-1 h-1 rounded-full bg-gray-200`} />
                              <Text style={tw`text-[9px] font-bold text-gray-400`}>
                                {format(parseISO(notification.createdAt), 'MMM dd, yyyy')}
                              </Text>
                            </>
                          )}
                        </View>
                      </View>

                      <TouchableOpacity
                        onPress={() => deleteNotification(notification.id)}
                        style={tw`p-2.5`}
                      >
                        <Trash2 size={16} color="#D1D5DB" />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            );
          })
        ) : (
          <View style={tw`flex-1 items-center justify-center py-20 px-10`}>
            <View style={tw`w-20 h-20 bg-gray-50 rounded-full items-center justify-center mb-6`}>
              <Bell size={40} color="#D1D5DB" />
            </View>
            <Text style={tw`text-lg font-bold text-gray-900 mb-2`}>No notifications yet</Text>
            <Text style={tw`text-sm text-gray-400 text-center leading-relaxed`}>
              We'll notify you when there are updates on your appointments or account.
            </Text>
          </View>
        )}
      </ScrollView>

      {notifications.length > 0 && (
        <View style={tw`p-6 bg-white border-t border-gray-100`}>
          <TouchableOpacity
            onPress={markAllAsRead}
            style={tw`w-full py-4 bg-blue-600 rounded-2xl flex-row items-center justify-center gap-2 shadow-lg shadow-blue-100`}
          >
            <Check size={14} color="white" />
            <Text style={tw`text-white text-[11px] font-bold uppercase tracking-widest`}>Mark All Read</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
