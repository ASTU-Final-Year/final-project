// app/Employee-week-schedule/page.jsx
'use client';

import { useState } from 'react';

const timeSlots = [
  '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
];

const dayNames = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

// ----------------------------- APPOINTMENT DATA (April 2026 – March 2027) -----------------------------
const appointments = {};

function addAppointment(year, month, day, timeSlot, name, desc, confirmed = false) {
  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const key = `${dateStr}_${timeSlot}`;
  appointments[key] = { name, desc, confirmed };
}

// ----- 2026 -----
// April (original week + few extras)
addAppointment(2026, 3, 20, '9:00 AM', 'Sarah Johnson', 'General Checkup');
addAppointment(2026, 3, 20, '10:00 AM', 'Tekle Wondimu', 'Lab Test - Confirmed', true);
addAppointment(2026, 3, 20, '2:00 PM', 'Helen Abebe', 'Physiotherapy');
addAppointment(2026, 3, 21, '9:00 AM', 'Leo Davinci', 'Consultation');
addAppointment(2026, 3, 21, '11:00 AM', 'Samrawit Abate', 'Vaccination', true);
addAppointment(2026, 3, 21, '3:00 PM', 'Dawit Tsegaye', 'Cardiology Check');
addAppointment(2026, 3, 22, '10:00 AM', 'Mekdes Alemu', 'Routine Followup');
addAppointment(2026, 3, 22, '1:00 PM', 'Yonas Tekle', 'Blood Test', true);
addAppointment(2026, 3, 23, '9:00 AM', 'David Smith', 'Vaccination - Confirmed', true);
addAppointment(2026, 3, 23, '2:00 PM', 'Bruktawit Assefa', 'Wellness Visit');
addAppointment(2026, 3, 24, '9:00 AM', 'Staff Meeting', 'Internal');
addAppointment(2026, 3, 24, '1:00 PM', 'Mulugeta Assefa', 'Follow-up');
addAppointment(2026, 3, 24, '4:00 PM', 'Aster Bekele', 'Routine Checkup');
addAppointment(2026, 3, 25, '10:00 AM', 'Michael Brown', 'General Checkup');
addAppointment(2026, 3, 25, '1:00 PM', 'Emma Wilson', 'Heart Checkup', true);
addAppointment(2026, 3, 26, '11:00 AM', 'Olivia Davis', 'Pediatric Follow-up');
addAppointment(2026, 3, 26, '3:00 PM', 'Kaleb Haile', 'Hydrotherapy');

// May 2026
addAppointment(2026, 4, 5, '10:00 AM', 'Chris Evans', 'Cardiology Check', true);
addAppointment(2026, 4, 11, '3:00 PM', 'Zendaya Coleman', 'Vaccination', true);
addAppointment(2026, 4, 20, '11:00 AM', 'Jeremy Renner', 'Post-op Review', true);
addAppointment(2026, 4, 25, '1:00 PM', 'Mark Ruffalo', 'Endocrinology');

// June 2026
addAppointment(2026, 5, 3, '9:00 AM', 'Tom Holland', 'Physical Therapy');
addAppointment(2026, 5, 12, '2:00 PM', 'Scarlett Johansson', 'Dermatology', true);
addAppointment(2026, 5, 21, '11:00 AM', 'Robert Downey', 'Routine Checkup');

// July 2026
addAppointment(2026, 6, 7, '10:00 AM', 'Chris Hemsworth', 'Wellness Visit');
addAppointment(2026, 6, 15, '3:00 PM', 'Natalie Portman', 'Cardiology Follow-up', true);
addAppointment(2026, 6, 27, '1:00 PM', 'Taika Waititi', 'Vaccination');

// August 2026
addAppointment(2026, 7, 4, '9:00 AM', 'Brie Larson', 'General Checkup');
addAppointment(2026, 7, 18, '4:00 PM', 'Samuel Jackson', 'Eye Exam', true);

// September 2026
addAppointment(2026, 8, 9, '11:00 AM', 'Chadwick Boseman', 'Post-op Review', true);
addAppointment(2026, 8, 22, '2:00 PM', 'Lupita Nyong\'o', 'Dermatology');

// October 2026
addAppointment(2026, 9, 6, '10:00 AM', 'Elizabeth Olsen', 'Routine Checkup');
addAppointment(2026, 9, 19, '1:00 PM', 'Paul Bettany', 'Vaccination', true);
addAppointment(2026, 9, 28, '3:00 PM', 'Anthony Mackie', 'Physical Therapy');

// November 2026
addAppointment(2026, 10, 2, '9:00 AM', 'Sebastian Stan', 'Dental Cleaning');
addAppointment(2026, 10, 14, '2:00 PM', 'Florence Pugh', 'Cardiology Check', true);
addAppointment(2026, 10, 26, '11:00 AM', 'David Harbour', 'General Checkup');

// December 2026
addAppointment(2026, 11, 4, '10:00 AM', 'Julia Louis-Dreyfus', 'Wellness Visit');
addAppointment(2026, 11, 12, '4:00 PM', 'Tim Roth', 'Endocrinology', true);
addAppointment(2026, 11, 23, '1:00 PM', 'Harrison Ford', 'Post-op Review');

// ----- 2027 (first few months) -----
// January 2027
addAppointment(2027, 0, 8, '9:00 AM', 'Pedro Pascal', 'General Checkup');
addAppointment(2027, 0, 17, '2:00 PM', 'Bella Ramsey', 'Vaccination', true);
addAppointment(2027, 0, 25, '11:00 AM', 'Carl Weathers', 'Physiotherapy');

// February 2027
addAppointment(2027, 1, 2, '10:00 AM', 'Giancarlo Esposito', 'Cardiology Follow-up', true);
addAppointment(2027, 1, 14, '1:00 PM', 'Rhea Seehorn', 'Dermatology');
addAppointment(2027, 1, 21, '3:00 PM', 'Bob Odenkirk', 'Routine Blood Work');

// March 2027
addAppointment(2027, 2, 9, '9:00 AM', 'Jonathan Banks', 'Eye Exam');
addAppointment(2027, 2, 18, '2:00 PM', 'Michael Mando', 'Vaccination', true);

// Helper functions
function getAppointment(date, timeSlot) {
  if (timeSlot === '12:00 PM') return { isLunch: true };
  const dateStr = date.toISOString().split('T')[0];
  const key = `${dateStr}_${timeSlot}`;
  return appointments[key] || null;
}

function shouldShowOff(date, timeSlot) {
  const dayOfWeek = date.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  if (timeSlot === '8:00 AM') return true;
  if (isWeekend && timeSlot !== '12:00 PM') return true;
  return false;
}

function renderCellContent(date, timeSlot) {
  if (timeSlot === '12:00 PM') {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <span className="text-sm font-medium text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full">
          🍽️ Lunch Break
        </span>
      </div>
    );
  }
  const apt = getAppointment(date, timeSlot);
  if (apt && !apt.isLunch) {
    const showBadge = apt.confirmed && !apt.desc.includes('Confirmed');
    return (
      <div className="flex flex-col leading-tight gap-0.5">
        <div className="flex items-center flex-wrap gap-1">
          <span className="font-semibold text-gray-800 text-sm">{apt.name}</span>
          {showBadge && (
            <span className="inline-block text-[10px] font-semibold bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
              Confirmed
            </span>
          )}
        </div>
        <div className="text-xs text-gray-500">{apt.desc}</div>
      </div>
    );
  }
  if (shouldShowOff(date, timeSlot)) {
    return (
      <div className="flex justify-center items-center h-full">
        <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-full">OFF</span>
      </div>
    );
  }
  return <div className="w-full h-full" />;
}

function getFirstAppointmentOfDay(date) {
  for (const slot of timeSlots) {
    const apt = getAppointment(date, slot);
    if (apt && !apt.isLunch) return apt;
  }
  return null;
}

// Sidebar link component (unchanged)
function SidebarLink({ href, icon, active, children }) {
  const icons = {
    dashboard: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
    schedule: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    tasks: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>,
    clients: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
    profile: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  };
  const activeClasses = active ? 'bg-indigo-50 text-indigo-800' : 'text-gray-600 hover:bg-gray-50';
  const iconColor = active ? 'text-indigo-600' : 'text-gray-500 group-hover:text-indigo-600';
  return (
    <a href={href} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-150 group ${activeClasses}`} onClick={(e) => e.preventDefault()}>
      <div className={`${iconColor} transition-colors`}>{icons[icon]}</div>
      <span className="text-[15px] font-medium">{children}</span>
    </a>
  );
}

export default function EmployeeWeekSchedule() {
  const [view, setView] = useState('week');
  const [dayIndex, setDayIndex] = useState(0);
  const [weekStart, setWeekStart] = useState(new Date(2026, 3, 20));
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 3, 1));

  const getWeekDates = (start) => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      dates.push(d);
    }
    return dates;
  };
  const weekDates = getWeekDates(weekStart);

  const prevDay = () => setDayIndex((prev) => (prev === 0 ? 6 : prev - 1));
  const nextDay = () => setDayIndex((prev) => (prev === 6 ? 0 : prev + 1));
  const prevWeek = () => {
    const newStart = new Date(weekStart);
    newStart.setDate(weekStart.getDate() - 7);
    setWeekStart(newStart);
  };
  const nextWeek = () => {
    const newStart = new Date(weekStart);
    newStart.setDate(weekStart.getDate() + 7);
    setWeekStart(newStart);
  };
  const prevMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() - 1);
    setCurrentMonth(newMonth);
  };
  const nextMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + 1);
    setCurrentMonth(newMonth);
  };

  const renderDayView = () => {
    const selectedDate = weekDates[dayIndex];
    const dayName = dayNames[dayIndex];
    const dayNumber = selectedDate.getDate();
    return (
      <div>
        <div className="flex justify-between items-center mb-4 px-2">
          <h2 className="text-lg font-semibold text-gray-700">{dayName} {dayNumber}, {selectedDate.getFullYear()}</h2>
          <div className="flex gap-2">
            <button onClick={prevDay} className="px-3 py-1 text-sm border rounded-md hover:bg-gray-100">← Previous Day</button>
            <button onClick={nextDay} className="px-3 py-1 text-sm border rounded-md hover:bg-gray-100">Next Day →</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="sticky top-0 bg-gray-50/80 z-10">
              <tr className="border-b border-gray-200">
                <th className="py-4 px-3 text-left text-xs font-semibold text-gray-500 uppercase w-[110px]">Time</th>
                <th className="py-4 px-2 text-center font-semibold text-gray-800">{dayName} {dayNumber}</th>
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((time) => (
                <tr key={time} className="border-b border-gray-100">
                  <td className="py-3 px-3 text-sm font-medium text-gray-600 bg-white sticky left-0 border-r border-gray-100">{time}</td>
                  <td className="py-2 px-2 bg-white border-r align-top">
                    <div className="text-sm break-words">{renderCellContent(selectedDate, time)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderWeekView = () => (
    <div>
      <div className="flex justify-between items-center mb-4 px-2">
        <h2 className="text-lg font-semibold text-gray-700">Week of {weekStart.toLocaleDateString()}</h2>
        <div className="flex gap-2">
          <button onClick={prevWeek} className="px-3 py-1 text-sm border rounded-md hover:bg-gray-100">← Previous Week</button>
          <button onClick={nextWeek} className="px-3 py-1 text-sm border rounded-md hover:bg-gray-100">Next Week →</button>
        </div>
      </div>
      <div className="overflow-x-auto schedule-scrollbar">
        <div className="min-w-[900px]">
          <table className="w-full border-collapse text-sm">
            <thead className="sticky top-0 bg-gray-50/80 z-10">
              <tr className="border-b border-gray-200">
                <th className="py-4 px-3 text-left text-xs font-semibold text-gray-500 uppercase w-[110px]">Time</th>
                {weekDates.map((date, idx) => (
                  <th key={idx} className="py-4 px-2 text-center font-semibold text-gray-800">
                    {dayNames[idx]}<br /><span className="text-lg font-bold text-gray-900">{date.getDate()}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((time) => (
                <tr key={time} className="border-b border-gray-100 hover:bg-gray-50/40">
                  <td className="py-3 px-3 text-sm font-medium text-gray-600 bg-white sticky left-0 border-r border-gray-100">{time}</td>
                  {weekDates.map((date, idx) => {
                    const isWeekend = idx === 5 || idx === 6;
                    const bgClass = isWeekend ? 'bg-gray-50/30' : 'bg-white';
                    return (
                      <td key={idx} className={`py-2 px-2 ${bgClass} border-r align-top`} style={{ minHeight: '88px' }}>
                        <div className="text-sm break-words">{renderCellContent(date, time)}</div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderMonthView = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const startWeekday = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const weeks = [];
    let day = 1;
    for (let w = 0; w < 6; w++) {
      const week = [];
      for (let d = 0; d < 7; d++) {
        if (w === 0 && d < startWeekday) week.push(null);
        else if (day > daysInMonth) week.push(null);
        else week.push(day++);
      }
      weeks.push(week);
      if (day > daysInMonth) break;
    }
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const renderAppointment = (apt) => {
      const showBadge = apt.confirmed && !apt.desc.includes('Confirmed');
      return (
        <div className="mt-1 text-xs leading-tight">
          <div className="flex items-center flex-wrap gap-1">
            <span className="font-semibold text-gray-800">{apt.name}</span>
            {showBadge && <span className="text-[9px] font-semibold bg-green-100 text-green-700 px-1 py-0.5 rounded-full">Confirmed</span>}
          </div>
          <div className="text-gray-500 text-[11px]">{apt.desc}</div>
        </div>
      );
    };

    return (
      <div>
        <div className="flex justify-between items-center mb-4 px-2">
          <h2 className="text-lg font-semibold text-gray-700">{monthNames[month]} {year}</h2>
          <div className="flex gap-2">
            <button onClick={prevMonth} className="px-3 py-1 text-sm border rounded-md hover:bg-gray-100">← Previous Month</button>
            <button onClick={nextMonth} className="px-3 py-1 text-sm border rounded-md hover:bg-gray-100">Next Month →</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <th key={d} className="border p-2">{d}</th>)}
              </tr>
            </thead>
            <tbody>
              {weeks.map((week, wi) => (
                <tr key={wi}>
                  {week.map((dayNum, di) => {
                    if (dayNum === null) return <td key={di} className="border p-1 bg-gray-50" style={{ height: '100px' }} />;
                    const date = new Date(year, month, dayNum);
                    const apt = getFirstAppointmentOfDay(date);
                    // Yellow highlight only for the original week (April 20-26, 2026)
                    const isYellow = (year === 2026 && month === 3 && dayNum >= 20 && dayNum <= 26);
                    return (
                      <td key={di} className={`border p-1 align-top ${isYellow ? 'bg-yellow-50' : ''}`} style={{ height: '100px', verticalAlign: 'top' }}>
                        <div className="font-bold text-sm mb-1 ml-1">{dayNum}</div>
                        {apt && renderAppointment(apt)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#f7f9fc] min-h-screen antialiased">
      <div className="max-w-[1600px] mx-auto p-4 md:p-5 lg:p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="w-full lg:w-80 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between overflow-hidden">
            <div className="p-5 pb-2">
              <div className="flex items-center gap-2 mb-8 mt-1">
                <div className="h-8 w-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M20 7h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z" />
                    <path d="M4 3v12a2 2 0 0 0 2 2h4" />
                    <path d="M12 7v10" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-slate-800">ServeSync</span>
              </div>
              <nav className="space-y-1.5">
                <SidebarLink href="#" icon="dashboard" active={false}>My Dashboard</SidebarLink>
                <SidebarLink href="#" icon="schedule" active={true}>My Schedule</SidebarLink>
                <SidebarLink href="#" icon="tasks" active={false}>My Tasks</SidebarLink>
                <SidebarLink href="#" icon="clients" active={false}>My Clients</SidebarLink>
                <SidebarLink href="#" icon="profile" active={false}>My Profile</SidebarLink>
              </nav>
            </div>
            <div className="p-5 border-t border-gray-100 mt-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold">AB</div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-800">Dr. Abebe Bekele</span>
                  <span className="text-xs text-gray-500">abebe.b@servesync.com</span>
                </div>
              </div>
            </div>
          </aside>
          <main className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">My Work Schedule</h1>
                <p className="text-sm text-gray-500 mt-1">View and manage your daily appointments</p>
              </div>
              <div className="flex bg-gray-100 rounded-xl p-1">
                <button onClick={() => setView('day')} className={`px-5 py-2 text-sm font-medium rounded-lg transition ${view === 'day' ? 'bg-[#1e40af] text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Day</button>
                <button onClick={() => setView('week')} className={`px-5 py-2 text-sm font-medium rounded-lg transition ${view === 'week' ? 'bg-[#1e40af] text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Week</button>
                <button onClick={() => setView('month')} className={`px-5 py-2 text-sm font-medium rounded-lg transition ${view === 'month' ? 'bg-[#1e40af] text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Month</button>
              </div>
            </div>
            <div className="p-4">
              {view === 'day' && renderDayView()}
              {view === 'week' && renderWeekView()}
              {view === 'month' && renderMonthView()}
            </div>
          </main>
        </div>
      </div>
      <style jsx global>{`
        .schedule-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
        .schedule-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
        .schedule-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .calendar-cell { min-height: 88px; }
        @media (max-width: 768px) { .calendar-cell { min-height: 70px; } }
      `}</style>
    </div>
  );
}