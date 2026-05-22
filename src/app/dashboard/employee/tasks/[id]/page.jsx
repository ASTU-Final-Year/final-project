"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, CheckCircle, Circle, Loader2 } from "lucide-react";
import RequestHandler from "@/lib/request-handler";

const STATUS_CONFIG = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  in_progress: { label: "In Progress", color: "bg-blue-100 text-blue-800" },
  completed: { label: "Completed", color: "bg-green-100 text-green-800" },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800" },
};

export default function TaskDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    RequestHandler.Get(`/api/v1/employee/task/${id}`)
      .then(res => res.json())
      .then(data => setTask(data.task))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const updateStatus = async (newStatus) => {
    setUpdating(true);
    try {
      const res = await RequestHandler.Patch(`/api/v1/employee/task/${id}`, {
        body: { status: newStatus }
      });
      if (res.ok) {
        const data = await res.json();
        setTask(data.task);
      }
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="p-6"><Skeleton className="h-96" /></div>;
  if (!task) return <div className="p-6 text-center text-red-500">Task not found</div>;

  const progressSteps = task.progress || [];
  const completedCount = progressSteps.filter(s => s.completed).length;
  const percent = progressSteps.length ? (completedCount / progressSteps.length) * 100 : 0;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <Button variant="ghost" onClick={() => router.back()}>
        <ChevronLeft className="h-4 w-4 mr-1" /> Back
      </Button>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start flex-wrap gap-2">
            <CardTitle className="text-indigo-950">{task.name}</CardTitle>
            <Badge className={STATUS_CONFIG[task.status]?.color}>
              {STATUS_CONFIG[task.status]?.label || task.status}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div>
            <span className="font-medium text-gray-700">Client:</span>{" "}
            <span className="text-gray-600">{task.clientName || "—"}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Service:</span>{" "}
            <span className="text-gray-600">{task.serviceName || "—"}</span>
          </div>

          {progressSteps.length > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round(percent)}%</span>
              </div>
              <Progress value={percent} />
              <div className="space-y-2 mt-4">
                {progressSteps.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    {step.completed ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Circle className="h-4 w-4 text-gray-300" />
                    )}
                    <span className={step.completed ? "text-gray-500" : "text-gray-700"}>
                      {step.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            {task.status !== "in_progress" && task.status !== "completed" && (
              <Button onClick={() => updateStatus("in_progress")} disabled={updating}>
                {updating ? <Loader2 className="animate-spin" /> : "Start Task"}
              </Button>
            )}
            {task.status === "in_progress" && (
              <Button onClick={() => updateStatus("completed")} disabled={updating}>
                {updating ? <Loader2 className="animate-spin" /> : "Mark Completed"}
              </Button>
            )}
            {task.status !== "cancelled" && task.status !== "completed" && (
              <Button variant="outline" onClick={() => updateStatus("cancelled")} disabled={updating}>
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}