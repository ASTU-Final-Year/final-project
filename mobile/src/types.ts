import React from 'react';

export type Role = 'Client' | 'Employee';

export type AppointmentStatus = 'Booked' | 'In Progress' | 'Completed' | 'Cancelled';

export type StepStatus = 'completed' | 'in-progress' | 'upcoming';

export interface ProgressStep {
  id: string;
  label: string;
  status: StepStatus;
  timestamp?: string;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: string;
  description: string;
}

export interface Business {
  id: string;
  name: string;
  category: string;
  rating: number;
  location: string;
  image: any;
  services: Service[];
  availableTimes?: string[];
}

export interface Category {
  id: string;
  name: string;
  icon: any;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
}

export interface Appointment {
  id: string;
  businessId: string;
  businessName: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  price: number;
  technician?: string;
  progressSteps?: ProgressStep[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: 'info' | 'success' | 'warning';
  createdAt: string;
}
