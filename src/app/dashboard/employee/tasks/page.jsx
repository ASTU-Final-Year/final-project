"use client"

import { useState } from "react"
import {
  Plus,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  AlertCircle,
  MoreHorizontal,
  Calendar,
  Flag,
  GripVertical,
  LayoutGrid,
  List,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Mock tasks data
const mockTasks = [
  {
    id: "task-1",
    title: "Prepare station for morning appointments",
    description: "Clean and organize workstation, check supplies",
    status: "completed",
    priority: "high",
    dueDate: "2024-01-15",
    dueTime: "9:00 AM",
    category: "preparation",
  },
  {
    id: "task-2",
    title: "Inventory check - hair products",
    description: "Count remaining stock and note items to reorder",
    status: "in_progress",
    priority: "medium",
    dueDate: "2024-01-15",
    dueTime: "12:00 PM",
    category: "inventory",
  },
  {
    id: "task-3",
    title: "Client follow-up calls",
    description: "Call clients from last week to check satisfaction",
    status: "pending",
    priority: "low",
    dueDate: "2024-01-15",
    dueTime: "3:00 PM",
    category: "client",
  },
  {
    id: "task-4",
    title: "Update client notes from morning sessions",
    description: "Document service details and preferences",
    status: "pending",
    priority: "medium",
    dueDate: "2024-01-15",
    dueTime: "5:00 PM",
    category: "documentation",
  },
  {
    id: "task-5",
    title: "Review new product training materials",
    description: "Complete online training module for new color line",
    status: "pending",
    priority: "high",
    dueDate: "2024-01-16",
    dueTime: "10:00 AM",
    category: "training",
  },
  {
    id: "task-6",
    title: "Prepare for team meeting",
    description: "Review agenda and prepare updates",
    status: "pending",
    priority: "medium",
    dueDate: "2024-01-16",
    dueTime: "2:00 PM",
    category: "meeting",
  },
]

const statusConfig = {
  pending: {
    label: "To Do",
    color: "outline",
    icon: AlertCircle,
    iconColor: "text-muted-foreground",
  },
  in_progress: {
    label: "In Progress",
    color: "secondary",
    icon: Clock,
    iconColor: "text-blue-600",
  },
  completed: {
    label: "Completed",
    color: "default",
    icon: CheckCircle2,
    iconColor: "text-emerald-600",
  },
}

const priorityConfig = {
  high: { label: "High", color: "text-red-600 bg-red-50 border-red-200" },
  medium: { label: "Medium", color: "text-amber-600 bg-amber-50 border-amber-200" },
  low: { label: "Low", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
}

export default function TasksPage() {
  const [tasks, setTasks] = useState(mockTasks)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [viewMode, setViewMode] = useState("kanban")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || task.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const tasksByStatus = {
    pending: filteredTasks.filter((t) => t.status === "pending"),
    in_progress: filteredTasks.filter((t) => t.status === "in_progress"),
    completed: filteredTasks.filter((t) => t.status === "completed"),
  }

  const handleStatusChange = (taskId, newStatus) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    )
  }

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId))
  }

  const TaskCard = ({ task }) => {
    const StatusIcon = statusConfig[task.status].icon

    return (
      <Card className="cursor-pointer transition-shadow hover:shadow-md">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-3">
              <StatusIcon
                className={cn("h-5 w-5 mt-0.5", statusConfig[task.status].iconColor)}
              />
              <div className="space-y-1">
                <p className={cn(
                  "font-medium",
                  task.status === "completed" && "line-through text-muted-foreground"
                )}>
                  {task.title}
                </p>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {task.description}
                </p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleStatusChange(task.id, "pending")}>
                  Mark as To Do
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange(task.id, "in_progress")}>
                  Mark as In Progress
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange(task.id, "completed")}>
                  Mark as Completed
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => handleDeleteTask(task.id)}
                >
                  Delete Task
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <Badge
              variant="outline"
              className={cn("text-xs", priorityConfig[task.priority].color)}
            >
              <Flag className="mr-1 h-3 w-3" />
              {priorityConfig[task.priority].label}
            </Badge>
            <Badge variant="outline" className="text-xs">
              <Calendar className="mr-1 h-3 w-3" />
              {task.dueTime}
            </Badge>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>
          <p className="text-muted-foreground">
            Manage and track your daily tasks and assignments.
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
              <DialogDescription>
                Add a new task to your list. Set the priority and due date.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Task Title</Label>
                <Input id="title" placeholder="Enter task title" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the task..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input id="dueDate" type="date" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueTime">Due Time</Label>
                <Input id="dueTime" type="time" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsAddDialogOpen(false)}>
                Create Task
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tasks</SelectItem>
                  <SelectItem value="pending">To Do</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Tabs value={viewMode} onValueChange={setViewMode}>
              <TabsList>
                <TabsTrigger value="kanban">
                  <LayoutGrid className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="list">
                  <List className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Kanban View */}
      {viewMode === "kanban" && (
        <div className="grid gap-6 lg:grid-cols-3">
          {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
            <div key={status} className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{statusConfig[status].label}</h3>
                  <Badge variant="secondary" className="rounded-full">
                    {statusTasks.length}
                  </Badge>
                </div>
              </div>
              <div className="space-y-3">
                {statusTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
                {statusTasks.length === 0 && (
                  <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-8">
                      <p className="text-sm text-muted-foreground">No tasks</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <Card>
          <CardHeader>
            <CardTitle>All Tasks</CardTitle>
            <CardDescription>
              {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""} total
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
              {filteredTasks.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12">
                  <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No tasks found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function cn(...classes) {
  return classes.filter(Boolean).join(" ")
}
