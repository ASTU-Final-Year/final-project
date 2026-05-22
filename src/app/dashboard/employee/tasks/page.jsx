"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays, CheckCircle, Clock, Loader2 } from "lucide-react";
import RequestHandler from "@/lib/request-handler";

const STATUS_CONFIG = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  in_progress: { label: "In Progress", color: "bg-blue-100 text-blue-800" },
  completed: { label: "Completed", color: "bg-green-100 text-green-800" },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800" },
};

export default function EmployeeTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    RequestHandler.Get("/api/v1/employee/tasks")
      .then(res => res.json())
      .then(data => setTasks(data.tasks || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-indigo-950">My Tasks</h1>
      
      {tasks.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-gray-500">
            No tasks assigned yet.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {tasks.map(task => (
            <Link href={`/dashboard/employee/tasks/${task.id}`} key={task.id}>
              <Card className="hover:shadow-md transition-all cursor-pointer border-indigo-100">
                <CardContent className="p-5">
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <div>
                      <h3 className="font-semibold text-indigo-900">{task.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Client: {task.clientName || "—"}
                      </p>
                    </div>
                    <Badge className={STATUS_CONFIG[task.status]?.color}>
                      {STATUS_CONFIG[task.status]?.label || task.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center mt-3 text-xs text-gray-400">
                    <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                    <Button variant="ghost" size="sm" className="text-indigo-600">
                      View Details →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}