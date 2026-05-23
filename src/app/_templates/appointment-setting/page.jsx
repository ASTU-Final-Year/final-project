"use client";

import { useState } from "react";

export default function AppointmentPage() {
  const [checkedIn, setCheckedIn] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  const [appointment] = useState({
    status: "confirmed",
    client: {
      name: "selam Abebe",
      email: "sel.chen@example.com",
      phone: "+251986754321",
      gender: "female",
      dob: "Mar 12, 1985",
      bloodType: "A+",
    },
    service: "Cardiology Consultation",
    date: "October 24, 2023",
    specialist: "Dr. Julianne Moore",
    timeSlot: "09:30 AM - 10:30 AM (60 min)",
    timeline: [
      {
        label: "Booking Received",
        description: "Customer booked online via website",
        completed: true,
      },
      {
        label: "Confirmed by Staff",
        description: "Staff confirmed availability",
        completed: true,
      },
      {
        label: "Arrived for Service",
        description: "Customer checked in at front desk",
        completed: false,
      },
    ],
    payment: {
      total: 6500.0,
      currency: "ETB",
      method: "Telebirr",
      transactionId: "#TXN-788921",
      status: "paid",
    },
  });

  const handleDownloadReceipt = () => {
    const receiptHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Receipt - ${appointment.payment.transactionId}</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 2rem; background: #f0f2f5; }
          .receipt { max-width: 600px; margin: 0 auto; background: white; border-radius: 24px; box-shadow: 0 20px 35px -8px rgba(0,0,0,0.1); overflow: hidden; }
          .header { background: linear-gradient(135deg, #2563eb, #1e40af); color: white; padding: 2rem; text-align: center; }
          .header h1 { margin: 0; font-size: 2rem; }
          .content { padding: 2rem; }
          .detail-row { display: flex; justify-content: space-between; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid #e5e7eb; }
          .detail-label { font-weight: 600; color: #4b5563; }
          .detail-value { color: #111827; }
          .total { margin-top: 1.5rem; padding-top: 1rem; border-top: 2px solid #2563eb; font-size: 1.25rem; font-weight: bold; display: flex; justify-content: space-between; }
          .footer { background: #f9fafb; padding: 1.5rem; text-align: center; color: #6b7280; font-size: 0.875rem; }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">
            <h1>📄 RECEIPT</h1>
            <p>Transaction ID: ${appointment.payment.transactionId}</p>
          </div>
          <div class="content">
            <div class="detail-row">
              <span class="detail-label">Customer Name</span>
              <span class="detail-value">${appointment.client.name}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Service</span>
              <span class="detail-value">${appointment.service}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Date</span>
              <span class="detail-value">${appointment.date}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Specialist / Staff</span>
              <span class="detail-value">${appointment.specialist}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Payment Method</span>
              <span class="detail-value">${appointment.payment.method}</span>
            </div>
            <div class="total">
              <span>Total Paid (ETB)</span>
              <span>${appointment.payment.total.toFixed(2)}</span>
            </div>
          </div>
          <div class="footer">
            Thank you for choosing us.<br />
            This is a computer‑generated receipt – no signature required.
          </div>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([receiptHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `receipt_${appointment.payment.transactionId}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRescheduleSubmit = (e) => {
    e.preventDefault();
    alert(`✅ Appointment rescheduled to ${newDate} at ${newTime}. A confirmation has been sent to ${appointment.client.email}.`);
    setShowRescheduleModal(false);
  };

  const handleCheckIn = () => {
    setCheckedIn(true);
    alert(`✅ ${appointment.client.name} has been checked in. Room/Queue assigned.`);
  };

  const statusColor =
    appointment.status === "confirmed"
      ? "bg-green-100 text-green-800"
      : appointment.status === "pending"
      ? "bg-yellow-100 text-yellow-800"
      : "bg-red-100 text-red-800";

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <style jsx>{`
        @keyframes gentlePulse {
          0% { transform: scale(1); opacity: 0.9; box-shadow: 0 0 0 0 rgba(59,130,246,0.4); }
          70% { transform: scale(1.02); opacity: 1; box-shadow: 0 0 0 8px rgba(59,130,246,0); }
          100% { transform: scale(1); opacity: 0.9; box-shadow: 0 0 0 0 rgba(59,130,246,0); }
        }
        .animated-photo {
          animation: gentlePulse 3s ease-in-out infinite;
        }
      `}</style>

      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 flex flex-wrap justify-between items-center gap-3">
          <h2 className="text-2xl font-bold text-gray-900">Appointment Details</h2>
          <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${statusColor}`}>
            {appointment.status.toUpperCase()}
          </span>
        </div>

        <div className="p-6 space-y-8">
          {/* Client Information with animated photo */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
              CLIENT INFORMATION
            </h3>
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-md animated-photo">
                  {appointment.client.name.charAt(0)}
                </div>
              </div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium text-gray-900">{appointment.client.name}</p>
                  <p className="text-sm text-gray-600">{appointment.client.email}</p>
                  <p className="text-sm text-gray-600">{appointment.client.phone}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm">
                    <span className="text-gray-500">Gender</span><br />
                    {appointment.client.gender}
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-500">Date of Birth</span><br />
                    {appointment.client.dob}
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-500">Blood Type</span><br />
                    {appointment.client.bloodType}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Service & Schedule */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">SERVICE</h3>
              <p className="text-gray-900 font-medium">{appointment.service}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">DATE</h3>
              <p className="text-gray-900">{appointment.date}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">STAFF / SPECIALIST</h3>
              <p className="text-gray-900">{appointment.specialist}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">TIME SLOT</h3>
              <p className="text-gray-900">{appointment.timeSlot}</p>
            </div>
          </div>

          {/* Status Timeline - Generic */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
              STATUS TIMELINE
            </h3>
            <div className="relative">
              <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gray-200"></div>
              <div className="space-y-6">
                {appointment.timeline.map((step, idx) => (
                  <div key={idx} className="relative flex gap-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                        step.completed
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {step.completed ? "✓" : idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{step.label}</p>
                      <p className="text-sm text-gray-500">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Payment Status */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
              PAYMENT STATUS
            </h3>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Service Fee (ETB)</span>
                <span className="font-semibold text-gray-900">{appointment.payment.total.toFixed(2)} ETB</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Method:</span>
                <span>{appointment.payment.method}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Transaction ID:</span>
                <span className="font-mono text-sm">{appointment.payment.transactionId}</span>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap justify-between items-center gap-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-3">
              <button onClick={handleDownloadReceipt} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                Download Receipt
              </button>
              <button onClick={() => setShowRescheduleModal(true)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                Reschedule
              </button>
              <button onClick={handleCheckIn} disabled={checkedIn} className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition ${checkedIn ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}>
                {checkedIn ? "Checked In" : "Check In Client"}
              </button>
            </div>
            <span className="px-4 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-semibold">PAID</span>
          </div>
        </div>
      </div>

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-xl font-bold mb-4">Reschedule Appointment</h3>
            <form onSubmit={handleRescheduleSubmit}>
              <label className="block mb-2 text-sm font-medium">New Date</label>
              <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="w-full p-2 border rounded mb-4" required />
              <label className="block mb-2 text-sm font-medium">New Time</label>
              <input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} className="w-full p-2 border rounded mb-4" required />
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowRescheduleModal(false)} className="px-4 py-2 text-gray-600 border rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Confirm</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}