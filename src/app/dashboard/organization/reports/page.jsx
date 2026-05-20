"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker"; // we'll build a simple one if missing
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { CalendarIcon, Loader2 } from "lucide-react";
import RequestHandler from "@/lib/request-handler";

// Simple DatePicker using native input (you can replace with shadcn date-picker)
const SimpleDatePicker = ({ value, onChange }) => (
  <input
    type="date"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="border border-indigo-200 rounded-md px-3 py-2 text-sm"
  />
);

const COLORS = ["#4f46e5", "#818cf8", "#a5b4fc", "#c7d2fe", "#e0e7ff"];

export default function ReportsPage() {
  const [reportType, setReportType] = useState("appointments");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Set default dates (last 30 days)
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    setEndDate(today.toISOString().split("T")[0]);
    setStartDate(thirtyDaysAgo.toISOString().split("T")[0]);
  }, []);

  const fetchReport = async () => {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await RequestHandler.Get(
        `/api/v1/organization/reports?type=${reportType}&startDate=${startDate}&endDate=${endDate}`
      );
      if (!res.ok) throw new Error("Failed to fetch report");
      const result = await res.json();
      setData(result.data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderChart = () => {
    if (!data || data.length === 0)
      return <p className="text-center text-gray-500 py-8">No data for selected period.</p>;

    if (reportType === "appointments") {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#4f46e5" name="Appointments" />
          </BarChart>
        </ResponsiveContainer>
      );
    }

    if (reportType === "employeePerformance") {
      return (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-indigo-50">
                <th className="p-2 text-left">Employee</th>
                <th className="p-2 text-left">Completed Tasks</th>
                <th className="p-2 text-left">Total Tasks</th>
                <th className="p-2 text-left">Completion Rate</th>
              </tr>
            </thead>
            <tbody>
              {data.map((emp) => (
                <tr key={emp.employeeId} className="border-b">
                  <td className="p-2">{emp.employeeName}</td>
                  <td className="p-2">{emp.completedTasks}</td>
                  <td className="p-2">{emp.totalTasks}</td>
                  <td className="p-2">
                    {emp.totalTasks
                      ? ((emp.completedTasks / emp.totalTasks) * 100).toFixed(1) + "%"
                      : "0%"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (reportType === "servicePopularity") {
      return (
        <div className="grid md:grid-cols-2 gap-6">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                dataKey="bookingCount"
                nameKey="serviceName"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div>
            <h3 className="font-semibold mb-2">Popularity Ranking</h3>
            <ol className="list-decimal pl-5 space-y-1">
              {data.map((service, idx) => (
                <li key={service.serviceId}>
                  {service.serviceName} – {service.bookingCount} bookings
                </li>
              ))}
            </ol>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-indigo-950">Reports & Analytics</h1>

      <Card>
        <CardHeader>
          <CardTitle>Generate Report</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-sm font-medium mb-1">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="appointments">Appointment Trends</SelectItem>
                  <SelectItem value="employeePerformance">Employee Performance</SelectItem>
                  <SelectItem value="servicePopularity">Service Popularity</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <SimpleDatePicker value={startDate} onChange={setStartDate} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <SimpleDatePicker value={endDate} onChange={setEndDate} />
            </div>
            <Button onClick={fetchReport} disabled={loading}>
              {loading ? <Loader2 className="animate-spin mr-2" /> : null}
              Generate Report
            </Button>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </CardContent>
      </Card>

      {data && (
        <Card>
          <CardHeader>
            <CardTitle>
              {reportType === "appointments" && "Appointment Trends"}
              {reportType === "employeePerformance" && "Employee Performance"}
              {reportType === "servicePopularity" && "Service Popularity"}
            </CardTitle>
          </CardHeader>
          <CardContent>{renderChart()}</CardContent>
        </Card>
      )}
    </div>
  );
}