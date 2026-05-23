// app/client-dashboard/page.jsx
'use client';

import { useState, useEffect } from 'react';

export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // -------------------- DYNAMIC ORGANIZATIONS & SERVICES --------------------
  const [organizationsData, setOrganizationsData] = useState([
    {
      id: 1,
      name: 'QuickFix Garage',
      sector: 'garage',
      services: ['Engine Oil Change', 'Tire Rotation', 'Brake Inspection', 'Battery Replacement', 'AC Recharge'],
      schedule: { days: [1, 2, 3, 4, 5], startHour: 8, endHour: 18, timezone: 'local' },
      contactEmail: 'support@quickfixgarage.com',
      contactPhone: '+251-911-123456'
    },
    {
      id: 2,
      name: 'St. Paul Hospital',
      sector: 'healthcare',
      services: ['General Checkup', 'Dental Cleaning', 'Lab Test', 'Physiotherapy', 'Cardiology Consult', 'X-Ray', 'MRI Scan'],
      schedule: { days: [1, 2, 3, 4, 5, 6], startHour: 9, endHour: 17 },
      contactEmail: 'appointments@stpaulhospital.et',
      contactPhone: '+251-115-789012'
    },
    {
      id: 3,
      name: 'City Dental Clinic',
      sector: 'healthcare',
      services: ['Teeth Whitening', 'Root Canal', 'Braces Consultation', 'Scaling & Polishing'],
      schedule: { days: [1, 2, 3, 4, 5], startHour: 10, endHour: 19 },
      contactEmail: 'info@citydental.com',
      contactPhone: '+251-922-334455'
    },
    {
      id: 4,
      name: 'Speedy Lube',
      sector: 'garage',
      services: ['Express Oil Change', 'Tire Balancing', 'Fluid Top-up', 'Filter Replacement'],
      schedule: { days: [1, 2, 3, 4, 5, 6], startHour: 7, endHour: 20 },
      contactEmail: 'hello@speedylube.et',
      contactPhone: '+251-933-667788'
    }
  ]);

  const [selectedOrg, setSelectedOrg] = useState(organizationsData[0]);
  const [serviceType, setServiceType] = useState(selectedOrg.services[0]);
  const [dateTime, setDateTime] = useState('');
  const [scheduleError, setScheduleError] = useState('');

  const [showContactModal, setShowContactModal] = useState(false);
  const [contactOrg, setContactOrg] = useState(null);

  const isWithinSchedule = (datetime, org) => {
    if (!datetime) return false;
    const dateObj = new Date(datetime);
    const dayOfWeek = dateObj.getDay();
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    const totalMinutes = hours * 60 + minutes;
    const startTotal = org.schedule.startHour * 60;
    const endTotal = org.schedule.endHour * 60;
    const isValidDay = org.schedule.days.includes(dayOfWeek);
    const isValidTime = totalMinutes >= startTotal && totalMinutes <= endTotal;
    return isValidDay && isValidTime;
  };

  const validateDateTime = (datetime, org) => {
    if (!datetime) return 'Please select a date and time.';
    if (!isWithinSchedule(datetime, org)) {
      const daysStr = org.schedule.days.map(d => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d]).join(', ');
      return `Organization works only on ${daysStr} between ${org.schedule.startHour}:00 and ${org.schedule.endHour}:00. Please choose a valid time.`;
    }
    return '';
  };

  const handleOrgChange = (orgId) => {
    const newOrg = organizationsData.find(o => o.id === parseInt(orgId));
    if (newOrg) {
      setSelectedOrg(newOrg);
      setServiceType(newOrg.services[0]);
      setScheduleError('');
      if (dateTime && !isWithinSchedule(dateTime, newOrg)) {
        setDateTime('');
        setScheduleError('Selected time not available for this organization. Please choose a new slot.');
      } else {
        setScheduleError(validateDateTime(dateTime, newOrg));
      }
    }
  };

  useEffect(() => {
    setServiceType(selectedOrg.services[0]);
  }, [selectedOrg]);

  useEffect(() => {
    setScheduleError(validateDateTime(dateTime, selectedOrg));
  }, [dateTime, selectedOrg]);

  // -------------------- UPCOMING APPOINTMENTS & DYNAMIC LOG --------------------
  const [upcomingAppointments, setUpcomingAppointments] = useState([
    {
      id: 1,
      title: 'Engine Oil Change',
      garage: 'QuickFix Garage',
      time: 'Today, 12:30 PM',
      status: 'IN PROGRESS 65%',
      statusColor: 'bg-gray-100 text-gray-700',
      orgId: 1
    },
    {
      id: 2,
      title: 'Annual Checkup',
      garage: 'St. Paul Hospital',
      time: 'April 25, 10:00 AM',
      status: 'CONFIRMED',
      statusColor: 'bg-gray-100 text-gray-700',
      orgId: 2
    },
  ]);

  const [actionLog, setActionLog] = useState([
    { id: Date.now() + 1, text: 'Appointment Confirmed: Annual Checkup at St. Paul Hospital (Apr 25, 10:00 AM)', timestamp: '2 hours ago', type: 'confirmed' },
    { id: Date.now() + 2, text: 'Payment Successful: Engine Oil Change (500 ETB)', timestamp: 'Yesterday, 4:15 PM', type: 'payment' },
    { id: Date.now() + 3, text: 'Service In Progress: Technician started Engine Oil Change', timestamp: 'Yesterday, 2:00 PM', type: 'progress' }
  ]);

  const [toast, setToast] = useState({ message: '', visible: false });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, message: '', onConfirm: null, onCancel: null });
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [newDateTime, setNewDateTime] = useState('');

  const addLogEntry = (message, type = 'info') => {
    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const today = now.toLocaleDateString([], { month: 'short', day: 'numeric' });
    setActionLog(prev => [{ id: Date.now(), text: message, timestamp: `${today}, ${formattedTime}`, type }, ...prev]);
  };

  const showToast = (message, duration = 3000) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: '', visible: false }), duration);
  };

  const showConfirm = (message, onConfirm, onCancel) => {
    setConfirmDialog({
      open: true,
      message,
      onConfirm: () => {
        onConfirm();
        setConfirmDialog({ open: false, message: '', onConfirm: null, onCancel: null });
      },
      onCancel: () => {
        if (onCancel) onCancel();
        setConfirmDialog({ open: false, message: '', onConfirm: null, onCancel: null });
      }
    });
  };

  const addAppointment = (title, garage, dateTimeStr, status = 'CONFIRMED', statusColor = 'bg-gray-100 text-gray-700', orgId) => {
    const newAppointment = {
      id: Date.now(),
      title,
      garage,
      time: dateTimeStr,
      status,
      statusColor,
      orgId
    };
    setUpcomingAppointments(prev => [newAppointment, ...prev]);
    addLogEntry(`📅 New booking: "${title}" at ${garage} on ${dateTimeStr}`, 'booking');
    showToast(`✅ Booking confirmed!\n\nService: ${title}\nOrganization: ${garage}\nDate & Time: ${dateTimeStr}`);
  };

  const handleCancel = (id) => {
    const apt = upcomingAppointments.find(a => a.id === id);
    if (!apt) return;
    showConfirm('Are you sure you want to cancel this appointment?', () => {
      setUpcomingAppointments(prev => prev.filter(a => a.id !== id));
      addLogEntry(`❌ Appointment Cancelled: "${apt.title}" at ${apt.garage} (was on ${apt.time})`, 'cancellation');
      showToast('❌ Appointment cancelled. A confirmation email has been sent.');
      const remainingApps = upcomingAppointments.filter(a => a.id !== id);
      if (remainingApps.length > 0 && apt.orgId === selectedOrg.id) {
        const firstRemaining = remainingApps[0];
        const newOrg = organizationsData.find(o => o.id === firstRemaining.orgId);
        if (newOrg) {
          setSelectedOrg(newOrg);
          setServiceType(newOrg.services[0]);
          setDateTime('');
          setScheduleError('Please select a new date & time.');
        }
      }
    });
  };

  const openRescheduleModal = (apt) => {
    setSelectedAppointment(apt);
    const org = organizationsData.find(o => o.name === apt.garage) || selectedOrg;
    let defaultDate = new Date();
    if (apt.time !== 'Today, 12:30 PM' && apt.time !== 'IN PROGRESS 65%') {
      defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 1);
      defaultDate.setHours(10, 0, 0);
    } else {
      defaultDate.setHours(defaultDate.getHours() + 1);
    }
    setNewDateTime(defaultDate.toISOString().slice(0, 16));
    setShowRescheduleModal(true);
  };

  const confirmReschedule = () => {
    if (!newDateTime) {
      showToast('⚠️ Please select a new date and time.');
      return;
    }
    const org = organizationsData.find(o => o.name === selectedAppointment.garage);
    if (org && !isWithinSchedule(newDateTime, org)) {
      showToast(`⚠️ ${validateDateTime(newDateTime, org)}`);
      return;
    }
    const formatted = new Date(newDateTime).toLocaleString(undefined, {
      month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
    });
    const oldTime = selectedAppointment.time;
    setUpcomingAppointments(prev =>
      prev.map(a =>
        a.id === selectedAppointment.id
          ? { ...a, time: formatted, status: 'RESCHEDULED', statusColor: 'bg-yellow-100 text-yellow-800' }
          : a
      )
    );
    addLogEntry(`🔄 Rescheduled "${selectedAppointment.title}" from ${oldTime} to ${formatted}`, 'reschedule');
    showToast(`✅ Appointment rescheduled to ${formatted}. We’ve notified the provider.`);
    setShowRescheduleModal(false);
    setSelectedAppointment(null);
    setNewDateTime('');
  };

  const handleConfirmBooking = () => {
    if (scheduleError) {
      showToast(scheduleError);
      return;
    }
    if (!dateTime) {
      showToast('Please select a date & time.');
      return;
    }
    const formattedDateTime = new Date(dateTime).toLocaleString(undefined, {
      month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
    });
    addAppointment(serviceType, selectedOrg.name, formattedDateTime, 'CONFIRMED', 'bg-gray-100 text-gray-700', selectedOrg.id);
  };

  const handleQuickBook = (service, orgName) => {
    const org = organizationsData.find(o => o.name === orgName);
    if (!org) return;
    let candidateDate = new Date();
    candidateDate.setDate(candidateDate.getDate() + 1);
    candidateDate.setHours(org.schedule.startHour, 0, 0);
    while (!isWithinSchedule(candidateDate.toISOString(), org)) {
      candidateDate.setDate(candidateDate.getDate() + 1);
      candidateDate.setHours(org.schedule.startHour, 0, 0);
    }
    const formattedTime = candidateDate.toLocaleString(undefined, {
      month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
    });
    addAppointment(service, orgName, formattedTime, 'CONFIRMED', 'bg-gray-100 text-gray-700', org.id);
  };

  const handleTrackProgress = (apt) => {
    const messages = {
      'Engine Oil Change': '🔧 Oil change in progress: 65% complete. Refill needed.',
      'General Checkup': '🩺 Checking vitals. 50% complete. Blood pressure pending.'
    };
    const msg = messages[apt.title] || `📊 ${apt.title} is in progress. Current status: 50% complete.`;
    showToast(msg);
    addLogEntry(`📊 Tracked progress for "${apt.title}": ${msg}`, 'progress');
  };

  const handleContactProvider = (orgName) => {
    const org = organizationsData.find(o => o.name === orgName);
    if (org) {
      setContactOrg(org);
      setShowContactModal(true);
    } else {
      showToast('Contact information not available.');
    }
  };

  const completedServices = upcomingAppointments.filter(apt => apt.status === 'COMPLETED').length;
  const savedPayments = 1;

  const getRecommendations = () => {
    if (selectedOrg.sector === 'garage') {
      return [
        { name: 'Battery Check', price: '350 ETB', rating: '★ 4.6', sectorOrg: selectedOrg.name },
        { name: 'AC Service', price: '550 ETB', rating: '★ 4.7', sectorOrg: selectedOrg.name },
        { name: 'Wheel Alignment', price: '400 ETB', rating: '★ 4.9', sectorOrg: selectedOrg.name }
      ];
    } else {
      return [
        { name: 'Blood Test', price: '500 ETB', rating: '★ 4.7', sectorOrg: selectedOrg.name },
        { name: 'ECG', price: '600 ETB', rating: '★ 4.8', sectorOrg: selectedOrg.name },
        { name: 'Nutrition Consult', price: '450 ETB', rating: '★ 4.9', sectorOrg: selectedOrg.name }
      ];
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {toast.visible && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 bg-white text-gray-800 px-6 py-3 rounded-lg shadow-lg max-w-md whitespace-pre-line border border-gray-200">
          {toast.message}
        </div>
      )}

      {confirmDialog.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl">
            <p className="mb-4 text-gray-800">{confirmDialog.message}</p>
            <div className="flex justify-end gap-3">
              <button onClick={confirmDialog.onCancel} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">No</button>
              <button onClick={confirmDialog.onConfirm} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Yes, Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showRescheduleModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl w-full">
            <h3 className="text-lg font-semibold mb-2">Reschedule Appointment</h3>
            <p className="text-sm text-gray-600 mb-4">{selectedAppointment.title} at {selectedAppointment.garage}</p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">New Date & Time</label>
              <input type="datetime-local" value={newDateTime} onChange={(e) => setNewDateTime(e.target.value)} className="w-full border rounded-lg px-3 py-2" min={new Date().toISOString().slice(0, 16)} />
              <p className="text-xs text-gray-500 mt-1">Respects organization's working hours</p>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowRescheduleModal(false)} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
              <button onClick={confirmReschedule} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Confirm Reschedule</button>
            </div>
          </div>
        </div>
      )}

      {showContactModal && contactOrg && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl w-full">
            <h3 className="text-lg font-semibold mb-2">Contact {contactOrg.name}</h3>
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="text-sm text-gray-900">{contactOrg.contactEmail}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <p className="text-sm text-gray-900">{contactOrg.contactPhone}</p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => window.location.href = `mailto:${contactOrg.contactEmail}`}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Send Email
              </button>
              <button
                onClick={() => window.location.href = `tel:${contactOrg.contactPhone}`}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Call
              </button>
              <button
                onClick={() => setShowContactModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex">
        <aside className="w-64 bg-white shadow-md h-screen sticky top-0">
          <div className="p-5 border-b">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center"><span className="text-white font-bold text-lg">S</span></div>
              <span className="text-xl font-bold text-gray-800">ServeSync+</span>
            </div>
          </div>
          <nav className="p-4 space-y-2">
            {/* SEARCH BAR REMOVED */}
            <div className="text-xs text-gray-500 mb-2">USER OF SERVESYNC+</div>
            <div className="space-y-1 mt-4">
              {['Dashboard', 'Appointments', 'Book Service', 'Payments'].map((item, idx) => (
                <a key={idx} href="#" className={`flex items-center gap-3 px-3 py-2 rounded-lg ${activeTab === item.toLowerCase().replace(' ', '') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`} onClick={() => setActiveTab(item.toLowerCase().replace(' ', ''))}>
                  <span>{item}</span>
                </a>
              ))}
            </div>
          </nav>
          <div className="absolute bottom-0 w-64 p-4 border-t">
            <div className="text-xs text-gray-500">Contact Support</div>
            <div className="text-sm">Need help? Contact support 24/7 for immediate assistance.</div>
            <button className="mt-2 text-blue-600 text-sm font-medium">Logout</button>
          </div>
        </aside>

        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <div><h1 className="text-2xl font-bold text-gray-800">Welcome back, Sarah!</h1><p className="text-gray-500">Your health is our priority.</p></div>
            <div className="text-right"><div className="text-sm text-gray-500">{new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</div><div className="text-lg font-semibold text-gray-800">Sarah Johnson</div></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500"><div className="text-2xl font-bold">{upcomingAppointments.length}</div><div className="text-sm text-gray-500">Active Appointments</div></div>
            <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500"><div className="text-2xl font-bold">{completedServices}</div><div className="text-sm text-gray-500">Completed Services</div></div>
            <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-yellow-500"><div className="text-2xl font-bold">4.8</div><div className="text-sm text-gray-500">My Rating</div></div>
            <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-purple-500"><div className="text-2xl font-bold">{savedPayments}</div><div className="text-sm text-gray-500">Saved Payments</div></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-5">
                <div className="flex justify-between items-center mb-4"><h2 className="text-lg font-semibold">Upcoming Appointments</h2><a href="#" className="text-blue-600 text-sm">View Schedule</a></div>
                <div className="space-y-4">
                  {upcomingAppointments.map((apt) => (
                    <div key={apt.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <div><div className="font-semibold">{apt.title}</div><div className="text-sm text-gray-500">{apt.garage} · {apt.time}</div></div>
                        <span className={`${apt.statusColor} text-xs px-2 py-1 rounded-full`}>{apt.status}</span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <button onClick={() => handleTrackProgress(apt)} className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300">Track Progress</button>
                        <button onClick={() => handleContactProvider(apt.garage)} className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300">Contact Provider</button>
                        <button onClick={() => { showToast(`🔍 Appointment Details\n\nService: ${apt.title}\nOrganization: ${apt.garage}\nDate & Time: ${apt.time}\nStatus: ${apt.status}`); addLogEntry(`🔍 Viewed details for ${apt.title}`, 'info'); }} className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300">View Details</button>
                        <button onClick={() => openRescheduleModal(apt)} className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300">Reschedule</button>
                        <button onClick={() => handleCancel(apt.id)} className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-5">
                <h2 className="text-lg font-semibold mb-3">Recent Activity</h2>
                <div className="space-y-3">
                  {actionLog.slice(0, 3).map((log) => (
                    <div key={log.id}>
                      <div className="text-sm font-medium capitalize">{log.type === 'booking' ? 'Appointment Confirmed' : log.type === 'cancellation' ? 'Appointment Cancelled' : log.type === 'reschedule' ? 'Appointment Rescheduled' : log.type === 'payment' ? 'Payment Successful' : log.type === 'completion' ? 'Service Completed' : 'Activity'}</div>
                      <div className="text-xs text-gray-500">{log.text}</div>
                      <div className="text-xs text-gray-400 mt-1">{log.timestamp}</div>
                    </div>
                  ))}
                  {actionLog.length === 0 && <p className="text-xs text-gray-400">No recent activities.</p>}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-5">
                <h2 className="text-lg font-semibold mb-4">Quick Booking</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ORGANIZATION</label>
                    <select value={selectedOrg.id} onChange={(e) => handleOrgChange(e.target.value)} className="w-full border rounded-lg px-3 py-2">
                      {organizationsData.map(org => <option key={org.id} value={org.id}>{org.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SERVICE TYPE</label>
                    <select value={serviceType} onChange={(e) => setServiceType(e.target.value)} className="w-full border rounded-lg px-3 py-2">
                      {selectedOrg.services.map(opt => <option key={opt}>{opt}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">DATE & TIME</label>
                    <input type="datetime-local" value={dateTime} onChange={(e) => setDateTime(e.target.value)} className="w-full border rounded-lg px-3 py-2" />
                    {scheduleError && <p className="text-red-500 text-xs mt-1">{scheduleError}</p>}
                    <p className="text-xs text-gray-500 mt-1">Selected: {dateTime ? new Date(dateTime).toLocaleString() : 'Not set'}</p>
                  </div>
                  <button onClick={handleConfirmBooking} className="w-full bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition font-medium">Confirm Booking</button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-5">
                <h2 className="text-lg font-semibold mb-3">Activity Log</h2>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {actionLog.length === 0 ? <p className="text-xs text-gray-400">No actions yet.</p> : actionLog.map(log => (<div key={log.id} className="text-xs border-b pb-2"><span className="font-medium">{log.timestamp}</span> – {log.text}</div>))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-5">
                <h2 className="text-lg font-semibold mb-3">Recommended For You</h2>
                <div className="space-y-3">
                  {getRecommendations().map((rec, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{rec.name}</div>
                        <div className="text-xs text-gray-500">{rec.rating} ({rec.price})</div>
                      </div>
                      <button onClick={() => handleQuickBook(rec.name, rec.sectorOrg)} className="text-blue-600 text-sm">Book</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}