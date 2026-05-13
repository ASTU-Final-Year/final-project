"use client";

import { useState, useEffect } from "react";
import { Clock, ChevronLeft, ChevronRight } from "lucide-react";

const API_BASE = "http://localhost:4000/api/v1";

// ================= SERVICES =================
const services = [
  { id: 1, name: "General Checkup", duration: "30 min", price: 500 },
  { id: 2, name: "Dental Cleaning", duration: "60 min", price: 600 },
  { id: 3, name: "Eye Examination", duration: "40 min", price: 300 },
];

const allServices = [
  { id: 4, name: "Lab Test", desc: "Blood test & analysis", price: 450 },
  { id: 5, name: "Annual Checkup", desc: "Full body exam", price: 800 },
  { id: 6, name: "Vision Test", desc: "Eye & prescription", price: 300 },
];

// ================= REAL CALENDAR API =================
const fetchOrgCalendar = async (serviceId) => {
  try {
    const serviceRes = await fetch(`${API_BASE}/service/${serviceId}?iorganization=true`, {
      credentials: "include",
    });
    const serviceData = await serviceRes.json();
    const service = serviceData.service;
    if (!service || !service.organizationId) throw new Error("No organization");

    const calRes = await fetch(`${API_BASE}/organization/${service.organizationId}/calendars`, {
      credentials: "include",
    });
    const calData = await calRes.json();
    const calendars = calData.calendars || [];
    if (calendars.length === 0) return null;

    const calendar = calendars[0];
    return {
      weekly: calendar.available?.weekly || [1, 2, 3, 4, 5],
      unavailableExact: calendar.unavailable?.exactly || [],
    };
  } catch (err) {
    console.error("Failed to fetch calendar:", err);
    return null;
  }
};

// Generate time slots for a specific date (same as before)
const getTimeSlotsForDate = (dateStr, calendarConfig) => {
  if (!calendarConfig) {
    const slots = [];
    for (let hour = 9; hour < 17; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`);
      slots.push(`${hour.toString().padStart(2, "0")}:30`);
    }
    return slots;
  }

  const { weekly, unavailableExact } = calendarConfig;
  const date = new Date(dateStr);
  const dayOfWeek = date.getDay();

  if (unavailableExact.includes(dateStr)) return [];
  if (!weekly.includes(dayOfWeek)) return [];

  const slots = [];
  for (let hour = 9; hour < 17; hour++) {
    slots.push(`${hour.toString().padStart(2, "0")}:00`);
    slots.push(`${hour.toString().padStart(2, "0")}:30`);
  }
  return slots;
};

// ================= FIXED CALENDAR COMPONENT =================
const Calendar = ({ selectedDate, onSelectDate, availableDates }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [daysMatrix, setDaysMatrix] = useState([]);

  useEffect(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const startWeekday = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const matrix = [];
    let dayCounter = 1;
    for (let i = 0; i < 6; i++) {
      const row = [];
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < startWeekday) {
          row.push(null);
        } else if (dayCounter <= daysInMonth) {
          const date = new Date(year, month, dayCounter);
          row.push(date);
          dayCounter++;
        } else {
          row.push(null);
        }
      }
      matrix.push(row);
    }
    setDaysMatrix(matrix);
  }, [currentMonth]);

  const changeMonth = (delta) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + delta, 1);
    setCurrentMonth(newDate);
  };

  const isAvailable = (date) => {
    if (!date) return false;
    const dateStr = date.toISOString().split("T")[0];
    return availableDates.includes(dateStr);
  };

  const isSelected = (date) => {
    if (!selectedDate || !date) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const isPast = (date) => {
    if (!date) return true;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-gray-100 rounded-full transition">
          <ChevronLeft size={20} />
        </button>
        <span className="font-semibold text-gray-800">
          {currentMonth.toLocaleString("default", { month: "long" })} {currentMonth.getFullYear()}
        </span>
        <button onClick={() => changeMonth(1)} className="p-2 hover:bg-gray-100 rounded-full transition">
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium text-gray-500 mb-2">
        {weekdays.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {daysMatrix.flat().map((date, idx) => {
          if (!date) return <div key={`empty-${idx}`} className="p-2" />;

          const available = isAvailable(date);
          const selected = isSelected(date);
          const past = isPast(date);
          const clickable = !past && available;

          return (
            <button
              key={date.toISOString()}
              onClick={() => clickable && onSelectDate(date)}
              disabled={!clickable}
              className={`
                p-2 text-sm rounded-lg transition-all duration-200
                ${clickable ? "cursor-pointer hover:bg-blue-100" : "cursor-not-allowed text-gray-300"}
                ${selected ? "bg-blue-600 text-white shadow-md" : clickable ? "text-gray-700 hover:bg-blue-50" : ""}
              `}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default function BookingPage() {
  const [selectedService, setSelectedService] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [calendarConfig, setCalendarConfig] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [bookingData, setBookingData] = useState({
    serviceId: null,
    name: "",
    email: "",
    phone: "",
    dateTime: null,
  });

  const handleSelectService = (service) => {
    setSelectedService(service);
    setBookingData((prev) => ({ ...prev, serviceId: service.id }));
  };

  const openBookingForm = async () => {
    if (!selectedService) return alert("Select a service first");
    const config = await fetchOrgCalendar(selectedService.id);
    setCalendarConfig(config);

    // 🔥 FIX: generate available dates for the next 365 days (all future months)
    const dates = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0); // start of today

    if (config) {
      // Use real calendar config
      for (let i = 0; i <= 365; i++) { // up to one year ahead
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dayOfWeek = date.getDay();
        const dateStr = date.toISOString().split("T")[0];
        if (!config.unavailableExact.includes(dateStr) && config.weekly.includes(dayOfWeek)) {
          dates.push(dateStr);
        }
      }
    } else {
      // Fallback: all weekdays for the next 90 days (so any future month works)
      for (let i = 1; i <= 90; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dayOfWeek = date.getDay();
        // default Mon-Fri
        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
          dates.push(date.toISOString().split("T")[0]);
        }
      }
    }
    setAvailableDates(dates);
    setShowForm(true);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    const dateStr = date.toISOString().split("T")[0];
    const slots = getTimeSlotsForDate(dateStr, calendarConfig);
    setTimeSlots(slots);
    setSelectedTime(null);
    setBookingData((prev) => ({ ...prev, dateTime: null }));
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    if (selectedDate) {
      const dateStr = selectedDate.toISOString().split("T")[0];
      setBookingData((prev) => ({ ...prev, dateTime: `${dateStr} ${time}` }));
    }
  };

  const handleSubmit = () => {
    if (!bookingData.name || !bookingData.email || !bookingData.phone || !bookingData.dateTime) {
      alert("Fill all fields");
      return;
    }
    console.log("FINAL BOOKING:", bookingData);
    alert("Booking Successful!");
    setShowForm(false);
    setSelectedService(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setBookingData({ serviceId: null, name: "", email: "", phone: "", dateTime: null });
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg border-r p-4 hidden md:block">
        <h2 className="font-bold text-xl text-gray-800 mb-6">ServeSync+</h2>
        <div className="space-y-3 text-sm text-gray-600">
          <p className="hover:text-blue-600 cursor-pointer">Dashboard</p>
          <p className="hover:text-blue-600 cursor-pointer">Appointments</p>
          <p className="text-blue-600 font-semibold">Book Service</p>
          <p className="hover:text-blue-600 cursor-pointer">Payments</p>
          <p className="hover:text-blue-600 cursor-pointer">Profile</p>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Book a Service</h1>
          <p className="text-gray-500">Schedule your next appointment in just a few clicks</p>
        </div>

        {/* SERVICES */}
        <div className="bg-white rounded-xl shadow-lg p-6 transition-shadow hover:shadow-xl">
          <h2 className="font-semibold text-xl mb-4">Step 1: Select a Service</h2>

          {/* Popular Services Cards with Shadow */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {services.map((service) => (
              <div
                key={service.id}
                onClick={() => handleSelectService(service)}
                className={`border rounded-xl p-5 cursor-pointer transition-all duration-300 hover:-translate-y-1 ${
                  selectedService?.id === service.id
                    ? "border-blue-500 bg-blue-50 shadow-md"
                    : "border-gray-200 shadow-md hover:shadow-xl"
                }`}
              >
                <h3 className="font-semibold text-lg">{service.name}</h3>
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                  <Clock size={14} /> {service.duration}
                </p>
                <p className="mt-3 font-bold text-blue-600">{service.price} ETB</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectService(service);
                    openBookingForm();
                  }}
                  className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition shadow-sm"
                >
                  Book Now
                </button>
              </div>
            ))}
          </div>

          {/* All Services List */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-700 mb-2">All Services</h3>
            {allServices.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div>
                  <p className="font-medium text-gray-800">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-blue-600">{item.price} ETB</span>
                  <button
                    onClick={() => {
                      handleSelectService(item);
                      openBookingForm();
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-lg transition shadow-sm"
                  >
                    Book
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOOKING MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Complete Your Booking</h2>

              <div className="space-y-4">
                <input
                  placeholder="Full Name"
                  className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                />
                <input
                  placeholder="Email"
                  type="email"
                  className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                />
                <input
                  placeholder="Phone"
                  className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                />
              </div>

              {/* Calendar */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                <Calendar
                  selectedDate={selectedDate}
                  onSelectDate={handleDateSelect}
                  availableDates={availableDates}
                />
              </div>

              {/* Time slots */}
              {selectedDate && timeSlots.length > 0 && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Time</label>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => handleTimeSelect(time)}
                        className={`px-3 py-2 rounded-lg border transition ${
                          selectedTime === time
                            ? "bg-blue-600 text-white border-blue-600 shadow-md"
                            : "hover:bg-gray-50 border-gray-200"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedDate && timeSlots.length === 0 && (
                <p className="text-red-500 text-sm mt-3">No available time slots for this date.</p>
              )}

              <div className="flex justify-between gap-3 mt-8">
                <button
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!bookingData.dateTime}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}