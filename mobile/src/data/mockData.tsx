
import React from 'react';
import { Wrench, Stethoscope, Landmark, Scissors, Hammer, Scale, Shield } from 'lucide-react-native';
import { Service, Business, Appointment, Category, ProgressStep, Notification } from '../types';

// Image Assets
const garage1 = require('../../assets/images/Garage1.jpg');
const garage2 = require('../../assets/images/Garage2.jpg');
const civilservice1 = require('../../assets/images/civilservice1.jpg');
const civilservice2 = require('../../assets/images/civilservice2.jpeg');
const court1 = require('../../assets/images/court1.jpg');
const court2 = require('../../assets/images/court2.jpeg');
const government1 = require('../../assets/images/government1.jpg');
const government2 = require('../../assets/images/government2.jpg');
const homeservice1 = require('../../assets/images/homeservice1.jpg');
const homeservice2 = require('../../assets/images/homeservice2.png');
const hospital1 = require('../../assets/images/hospital1.jpg');
const hospital2 = require('../../assets/images/hospital2.jpg');
const manbarber1 = require('../../assets/images/manbarber1.jpg');
const womenbeauty1 = require('../../assets/images/womenbeauty1.jpg');

export const CATEGORIES: Category[] = [
  { id: 'auto', name: 'Auto Repair', icon: Wrench },
  { id: 'health', name: 'Healthcare', icon: Stethoscope },
  { id: 'gov', name: 'Government', icon: Landmark },
  { id: 'beauty', name: 'Beauty', icon: Scissors },
  { id: 'home', name: 'Home Services', icon: Hammer },
  { id: 'legal', name: 'Legal', icon: Scale },
  { id: 'civil', name: 'Civil Service', icon: Shield },
];

export const getStepsByCategory = (categoryId: string, serviceName: string): ProgressStep[] => {
  switch (categoryId) {
    case 'auto':
      return [
        { id: 'p1', label: 'Vehicle Received', status: 'completed', timestamp: '9:00 AM' },
        { id: 'p2', label: 'Initial Inspection', status: 'completed', timestamp: '9:15 AM' },
        { id: 'p3', label: serviceName, status: 'in-progress' },
        { id: 'p4', label: 'Quality Check', status: 'upcoming' },
        { id: 'p5', label: 'Ready for Pickup', status: 'upcoming' },
      ];
    case 'health':
      return [
        { id: 'h1', label: 'Checked In', status: 'completed', timestamp: '10:00 AM' },
        { id: 'h2', label: 'Vitals Recorded', status: 'completed', timestamp: '10:10 AM' },
        { id: 'h3', label: serviceName, status: 'in-progress' },
        { id: 'h4', label: 'Consultation Summary', status: 'upcoming' },
        { id: 'h5', label: 'Checkout', status: 'upcoming' },
      ];
    case 'gov':
    case 'civil':
      return [
        { id: 'g1', label: 'Application Filed', status: 'completed', timestamp: 'Yesterday' },
        { id: 'g2', label: 'Documents Verified', status: 'completed', timestamp: '8:30 AM' },
        { id: 'g3', label: 'Payment Confirmed', status: 'completed', timestamp: '8:45 AM' },
        { id: 'g4', label: 'Processing ' + serviceName, status: 'in-progress' },
        { id: 'g5', label: 'Final Approval', status: 'upcoming' },
        { id: 'g6', label: 'Collection Ready', status: 'upcoming' },
      ];
    case 'beauty':
      return [
        { id: 'b1', label: 'Arrived', status: 'completed', timestamp: '11:00 AM' },
        { id: 'b2', label: 'Consultation', status: 'completed', timestamp: '11:10 AM' },
        { id: 'b3', label: 'Treatment: ' + serviceName, status: 'in-progress' },
        { id: 'b4', label: 'Final Styling', status: 'upcoming' },
        { id: 'b5', label: 'Completed', status: 'upcoming' },
      ];
    case 'legal':
      return [
        { id: 'l1', label: 'Consultation Started', status: 'completed', timestamp: '2:00 PM' },
        { id: 'l2', label: 'Case Review', status: 'completed', timestamp: '2:20 PM' },
        { id: 'l3', label: 'Drafting: ' + serviceName, status: 'in-progress' },
        { id: 'l4', label: 'Legal Review', status: 'upcoming' },
        { id: 'l5', label: 'Case Closed', status: 'upcoming' },
      ];
    default:
      return [
        { id: 'd1', label: 'Booked', status: 'completed' },
        { id: 'd2', label: 'Started', status: 'in-progress' },
        { id: 'd3', label: 'Completed', status: 'upcoming' },
      ];
  }
};

export const BUSINESSES: Business[] = [
  // --- AUTO REPAIR ---
  {
    id: 'b1',
    name: 'YG Garage',
    category: 'auto',
    rating: 4.8,
    location: 'Bole Road, Addis Ababa',
    image: garage1,
    availableTimes: ['8:30 AM', '9:00 AM', '10:30 AM', '1:00 PM', '2:30 PM', '4:00 PM'],
    services: [
      { id: 's1', name: 'Oil Change', price: 500, duration: '30 mins', description: 'Complete engine oil and filter replacement' },
      { id: 's2', name: 'Brake Inspection', price: 350, duration: '45 mins', description: 'Full inspection of brake pads and rotors' },
      { id: 's3', name: 'Engine Diagnostic', price: 800, duration: '60 mins', description: 'Comprehensive engine health check' },
      { id: 's4', name: 'Tire Replacement', price: 600, duration: '45 mins', description: 'New tire installation and balancing' },
    ]
  },
  {
    id: 'b2',
    name: 'Elite Auto Center',
    category: 'auto',
    rating: 4.6,
    location: 'Kazanchis, Addis Ababa',
    image: garage2,
    availableTimes: ['9:30 AM', '11:00 AM', '2:00 PM', '4:30 PM'],
    services: [
      { id: 's5', name: 'Oil Change', price: 550, duration: '30 mins', description: 'Premium oil change service' },
      { id: 's6', name: 'Transmission Service', price: 1500, duration: '2 hours', description: 'Complete gearbox maintenance' },
    ]
  },
  // --- HEALTHCARE ---
  {
    id: 'b3',
    name: 'City Clinic',
    category: 'health',
    rating: 4.9,
    location: 'Bole Road, Addis Ababa',
    image: hospital1,
    availableTimes: ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'],
    services: [
      { id: 's7', name: 'General Checkup', price: 300, duration: '30 mins', description: 'Comprehensive physical examination' },
      { id: 's8', name: 'Dental Cleaning', price: 500, duration: '45 mins', description: 'Professional teeth scaling and cleaning' },
      { id: 's9', name: 'Eye Examination', price: 400, duration: '30 mins', description: 'Vision check and prescription' },
    ]
  },
  {
    id: 'b7',
    name: 'HealthFirst Hospital',
    category: 'health',
    rating: 4.7,
    location: 'Sarbet, Addis Ababa',
    image: hospital2,
    availableTimes: ['9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM'],
    services: [
      { id: 's17', name: 'Cardiology Consult', price: 600, duration: '45 mins', description: 'Heart health assessment' },
      { id: 's18', name: 'Pediatric Visit', price: 400, duration: '30 mins', description: 'Specialized child healthcare' },
    ]
  },
  // --- GOVERNMENT ---
  {
    id: 'b4',
    name: 'Citizenship Service',
    category: 'gov',
    rating: 4.2,
    location: 'Mexico, Addis Ababa',
    image: government1,
    availableTimes: ['8:30 AM', '9:30 AM', '11:00 AM', '2:30 PM', '4:00 PM'],
    services: [
      { id: 's10', name: 'Passport Renewal', price: 100, duration: '2 hours', description: 'Official passport update service' },
      { id: 's11', name: 'Visa Processing', price: 80, duration: '1 hour', description: 'International travel permit handling' },
    ]
  },
  {
    id: 'b8',
    name: 'Document Authentication',
    category: 'gov',
    rating: 4.0,
    location: 'Piazza, Addis Ababa',
    image: government2,
    availableTimes: ['8:30 AM', '10:00 AM', '2:00 PM'],
    services: [
      { id: 's19', name: 'Notary Service', price: 50, duration: '30 mins', description: 'Official document verification' },
      { id: 's20', name: 'ID Card Renewal', price: 30, duration: '1 hour', description: 'National identity card update' },
    ]
  },
  // --- BEAUTY ---
  {
    id: 'b5',
    name: 'Glamour Beauty',
    category: 'beauty',
    rating: 4.7,
    location: 'Bole, Addis Ababa',
    image: womenbeauty1,
    availableTimes: ['10:00 AM', '11:30 AM', '1:00 PM', '2:30 PM', '4:00 PM', '5:30 PM'],
    services: [
      { id: 's12', name: 'Haircut (Men)', price: 200, duration: '30 mins', description: 'Modern style haircut' },
      { id: 's13', name: 'Haircut (Women)', price: 350, duration: '45 mins', description: 'Professional cutting and styling' },
      { id: 's14', name: 'Facial Treatment', price: 400, duration: '1 hour', description: 'Skin rejuvenation and deep cleaning' },
    ]
  },
  {
    id: 'b9',
    name: 'Radiance Spa',
    category: 'beauty',
    rating: 4.9,
    location: 'Old Airport, Addis Ababa',
    image: manbarber1,
    availableTimes: ['9:00 AM', '12:00 PM', '3:00 PM', '6:00 PM'],
    services: [
      { id: 's21', name: 'Swedish Massage', price: 800, duration: '1 hour', description: 'Full body relaxation massage' },
      { id: 's22', name: 'Manicure & Pedicure', price: 500, duration: '1.5 hours', description: 'Complete nail care service' },
    ]
  },
  // --- HOME SERVICES ---
  {
    id: 'b10',
    name: 'Pro Fixers',
    category: 'home',
    rating: 4.5,
    location: 'Gerji, Addis Ababa',
    image: homeservice1,
    availableTimes: ['8:00 AM', '10:00 AM', '2:00 PM', '4:00 PM'],
    services: [
      { id: 's23', name: 'Plumbing Repair', price: 300, duration: '1 hour', description: 'Fixing leaks and pipe issues' },
      { id: 's24', name: 'Electrical Maintenance', price: 400, duration: '1 hour', description: 'Safe electrical repairs and installs' },
    ]
  },
  {
    id: 'b11',
    name: 'Clean Sweepers',
    category: 'home',
    rating: 4.8,
    location: 'Lebu, Addis Ababa',
    image: homeservice2,
    availableTimes: ['9:00 AM', '1:00 PM', '4:00 PM'],
    services: [
      { id: 's25', name: 'House Cleaning', price: 500, duration: '3 hours', description: 'Deep cleaning for your entire home' },
      { id: 's26', name: 'Carpet Washing', price: 200, duration: '1 hour', description: 'Professional rug and carpet care' },
    ]
  },
  // --- LEGAL ---
  {
    id: 'b6',
    name: 'EthioLaw Services',
    category: 'legal',
    rating: 4.6,
    location: 'Bole, Addis Ababa',
    image: court1,
    availableTimes: ['9:00 AM', '10:30 AM', '2:00 PM', '4:00 PM'],
    services: [
      { id: 's15', name: 'Legal Consultation', price: 500, duration: '30 mins', description: 'Expert legal advice on any matter' },
      { id: 's16', name: 'Contract Review', price: 1000, duration: '1 hour', description: 'Thorough analysis of legal documents' },
    ]
  },
  {
    id: 'b12',
    name: 'Justice Advocates',
    category: 'legal',
    rating: 4.4,
    location: 'Megenagna, Addis Ababa',
    image: court2,
    availableTimes: ['8:30 AM', '11:00 AM', '3:00 PM'],
    services: [
      { id: 's27', name: 'Property Law Consult', price: 700, duration: '45 mins', description: 'Legal advice on real estate' },
      { id: 's28', name: 'Business Registration', price: 1500, duration: '2 hours', description: 'Full business licensing support' },
    ]
  },
  // --- CIVIL SERVICE ---
  {
    id: 'b13',
    name: 'Municipal Office',
    category: 'civil',
    rating: 4.1,
    location: 'City Center, Addis Ababa',
    image: civilservice1,
    availableTimes: ['8:30 AM', '10:30 AM', '2:30 PM'],
    services: [
      { id: 's29', name: 'Birth Certificate', price: 50, duration: '1 hour', description: 'Official registration of birth' },
      { id: 's30', name: 'Land Registration', price: 200, duration: '2 hours', description: 'Property ownership documentation' },
    ]
  },
  {
    id: 'b14',
    name: 'Civil Registry',
    category: 'civil',
    rating: 4.3,
    location: 'Piazza, Addis Ababa',
    image: civilservice2,
    availableTimes: ['9:00 AM', '11:30 AM', '3:30 PM'],
    services: [
      { id: 's31', name: 'Marriage License', price: 100, duration: '1.5 hours', description: 'Official marriage certification' },
      { id: 's32', name: 'Name Change', price: 150, duration: '2 hours', description: 'Legal name update service' },
    ]
  }
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'a1',
    businessId: 'b1',
    businessName: 'YG Garage',
    serviceId: 's1',
    serviceName: 'Oil Change',
    date: '2024-05-12',
    time: '2:00 PM',
    status: 'In Progress',
    price: 500,
    technician: 'Mike Johnson',
    progressSteps: getStepsByCategory('auto', 'Oil Change')
  },
  {
    id: 'a2',
    businessId: 'b3',
    businessName: 'City Clinic',
    serviceId: 's7',
    serviceName: 'General Checkup',
    date: '2024-05-12',
    time: '10:30 AM',
    status: 'In Progress',
    price: 300,
    progressSteps: getStepsByCategory('health', 'General Checkup')
  },
  {
    id: 'a3',
    businessId: 'b5',
    businessName: 'Glamour Beauty',
    serviceId: 's13',
    serviceName: 'Haircut (Women)',
    date: '2024-05-10',
    time: '11:00 AM',
    status: 'Completed',
    price: 350,
  },
  {
    id: 'a4',
    businessId: 'b4',
    businessName: 'Citizenship Service',
    serviceId: 's10',
    serviceName: 'Passport Renewal',
    date: '2024-05-15',
    time: '10:00 AM',
    status: 'Booked',
    price: 100,
    progressSteps: getStepsByCategory('gov', 'Passport Renewal')
  }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    title: 'Upcoming Service',
    message: 'Reminder: Oil Change at YG Garage scheduled for tomorrow.',
    time: 'In 1 day',
    isRead: false,
    type: 'info',
    createdAt: '2026-05-12T09:00:00Z'
  },
  {
    id: 'n2',
    title: 'Appointment Confirmed',
    message: 'Your appointment at Advanced Auto for Oil Change is confirmed for today.',
    time: '2 mins ago',
    isRead: false,
    type: 'success',
    createdAt: '2026-05-11T14:20:00Z'
  },
  {
    id: 'n3',
    title: 'Service in Progress',
    message: 'Mike Johnson has started the Oil Change on your Toyota Camry.',
    time: '1 hour ago',
    isRead: true,
    type: 'info',
    createdAt: '2026-05-11T13:00:00Z'
  },
  {
    id: 'n4',
    title: 'Payment Received',
    message: 'Payment of 350 ETB for Haircut (Women) was successful.',
    time: 'Yesterday',
    isRead: true,
    type: 'success',
    createdAt: '2026-05-10T15:00:00Z'
  },
  {
    id: 'n5',
    title: 'Welcome to Applet',
    message: 'Thank you for joining our booking platform!',
    time: 'May 5',
    isRead: true,
    type: 'info',
    createdAt: '2026-05-05T10:00:00Z'
  },
  {
    id: 'n6',
    title: 'Profile Updated',
    message: 'Your security settings were updated successfully.',
    time: 'April 20',
    isRead: true,
    type: 'success',
    createdAt: '2026-04-20T14:00:00Z'
  }
];
