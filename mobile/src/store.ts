
import { create } from 'zustand';
import { User, Role, Appointment, Business, Service, AppointmentStatus, Notification } from './types';
import { MOCK_APPOINTMENTS, MOCK_NOTIFICATIONS } from './data/mockData';

// ... (existing stores)

// --- Notification Store ---
interface NotificationState {
  notifications: Notification[];
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: MOCK_NOTIFICATIONS,
  deleteNotification: (id) => set((state) => ({
    notifications: state.notifications.filter((n) => n.id !== id)
  })),
  clearAll: () => set({ notifications: [] }),
  markAsRead: (id) => set((state) => ({
    notifications: state.notifications.map((n) => n.id === id ? { ...n, isRead: true } : n)
  })),
  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map((n) => ({ ...n, isRead: true }))
  })),
}));

// --- Auth Store ---
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, role: Role) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (email, role) => set({ 
    user: { id: 'u1', name: 'Abraham', email, role, phone: '+1 234 567 890' },
    isAuthenticated: true 
  }),
  logout: () => set({ user: null, isAuthenticated: false }),
  updateUser: (data) => set((state) => ({
    user: state.user ? { ...state.user, ...data } : null
  })),
}));

// --- Booking Store ---
interface BookingState {
  selectedCategory: string | null;
  selectedBusiness: Business | null;
  selectedService: Service | null;
  selectedDate: string | null;
  selectedTime: string | null;
  
  setCategory: (id: string | null) => void;
  setBusiness: (business: Business | null) => void;
  setService: (service: Service | null) => void;
  setDate: (date: string | null) => void;
  setTime: (time: string | null) => void;
  reset: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  selectedCategory: null,
  selectedBusiness: null,
  selectedService: null,
  selectedDate: null,
  selectedTime: null,

  setCategory: (id) => set({ selectedCategory: id }),
  setBusiness: (business) => set({ selectedBusiness: business }),
  setService: (service) => set({ selectedService: service }),
  setDate: (date) => set({ selectedDate: date }),
  setTime: (time) => set({ selectedTime: time }),
  reset: () => set({ 
    selectedCategory: null, 
    selectedBusiness: null, 
    selectedService: null, 
    selectedDate: null, 
    selectedTime: null 
  }),
}));

// --- Appointment Store ---
interface AppointmentState {
  appointments: Appointment[];
  addAppointment: (appointment: Appointment) => void;
  updateStatus: (id: string, status: AppointmentStatus) => void;
  cancelAppointment: (id: string) => void;
}

export const useAppointmentStore = create<AppointmentState>((set) => ({
  appointments: MOCK_APPOINTMENTS,
  addAppointment: (appointment) => set((state) => ({ 
    appointments: [appointment, ...state.appointments] 
  })),
  updateStatus: (id, status) => set((state) => ({
    appointments: state.appointments.map((a) => a.id === id ? { ...a, status } : a)
  })),
  cancelAppointment: (id) => set((state) => ({
    appointments: state.appointments.map((a) => a.id === id ? { ...a, status: 'Cancelled' } : a)
  })),
}));

// --- UI Store ---
interface UIState {
  activeScreen: string;
  viewingAppointmentId: string | null;
  appointmentTab: 'Upcoming' | 'Active' | 'History';
  setActiveScreen: (screen: string) => void;
  setViewingAppointment: (id: string | null) => void;
  setAppointmentTab: (tab: 'Upcoming' | 'Active' | 'History') => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeScreen: 'LOGIN',
  viewingAppointmentId: null,
  appointmentTab: 'Upcoming',
  setActiveScreen: (screen) => set({ activeScreen: screen }),
  setViewingAppointment: (id) => set({ viewingAppointmentId: id, activeScreen: id ? 'DETAIL' : 'ACTIVE' }),
  setAppointmentTab: (tab) => set({ appointmentTab: tab }),
}));
