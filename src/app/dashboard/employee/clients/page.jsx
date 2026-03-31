"use client"

import { useState } from "react"
import {
  Search,
  Filter,
  MoreHorizontal,
  Mail,
  Phone,
  Calendar,
  Star,
  Clock,
  ChevronRight,
  User,
  History,
  MessageSquare,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock clients data
const mockClients = [
  {
    id: "client-1",
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 555-0101",
    avatarUrl: null,
    totalVisits: 24,
    lastVisit: "2024-01-10",
    preferredServices: ["Haircut", "Beard Trim"],
    rating: 5,
    notes: "Prefers classic style, allergic to certain products",
    history: [
      { date: "2024-01-10", service: "Haircut", amount: "35.00", rating: 5 },
      { date: "2023-12-15", service: "Haircut + Beard Trim", amount: "50.00", rating: 5 },
      { date: "2023-11-20", service: "Haircut", amount: "35.00", rating: 5 },
    ],
  },
  {
    id: "client-2",
    name: "Emily Davis",
    email: "emily.davis@email.com",
    phone: "+1 555-0102",
    avatarUrl: null,
    totalVisits: 12,
    lastVisit: "2024-01-08",
    preferredServices: ["Hair Coloring", "Highlights"],
    rating: 4,
    notes: "Likes vibrant colors, brings reference photos",
    history: [
      { date: "2024-01-08", service: "Hair Coloring", amount: "85.00", rating: 4 },
      { date: "2023-11-25", service: "Highlights", amount: "120.00", rating: 5 },
    ],
  },
  {
    id: "client-3",
    name: "Michael Brown",
    email: "michael.brown@email.com",
    phone: "+1 555-0103",
    avatarUrl: null,
    totalVisits: 8,
    lastVisit: "2024-01-05",
    preferredServices: ["Haircut"],
    rating: 5,
    notes: "Quick appointments, minimal conversation",
    history: [
      { date: "2024-01-05", service: "Haircut", amount: "35.00", rating: 5 },
      { date: "2023-12-01", service: "Haircut", amount: "35.00", rating: 5 },
    ],
  },
  {
    id: "client-4",
    name: "Sarah Wilson",
    email: "sarah.wilson@email.com",
    phone: "+1 555-0104",
    avatarUrl: null,
    totalVisits: 18,
    lastVisit: "2024-01-12",
    preferredServices: ["Highlights", "Deep Conditioning"],
    rating: 5,
    notes: "VIP client, always tips well",
    history: [
      { date: "2024-01-12", service: "Highlights", amount: "120.00", rating: 5 },
      { date: "2023-12-20", service: "Deep Conditioning", amount: "25.00", rating: 5 },
      { date: "2023-11-15", service: "Highlights", amount: "120.00", rating: 5 },
    ],
  },
  {
    id: "client-5",
    name: "Robert Chen",
    email: "robert.chen@email.com",
    phone: "+1 555-0105",
    avatarUrl: null,
    totalVisits: 6,
    lastVisit: "2024-01-02",
    preferredServices: ["Haircut", "Hot Towel Shave"],
    rating: 4,
    notes: "New client, referred by John Smith",
    history: [
      { date: "2024-01-02", service: "Haircut", amount: "35.00", rating: 4 },
      { date: "2023-12-10", service: "Hot Towel Shave", amount: "30.00", rating: 4 },
    ],
  },
  {
    id: "client-6",
    name: "Lisa Martinez",
    email: "lisa.martinez@email.com",
    phone: "+1 555-0106",
    avatarUrl: null,
    totalVisits: 15,
    lastVisit: "2024-01-14",
    preferredServices: ["Keratin Treatment", "Haircut"],
    rating: 5,
    notes: "Damaged hair, on treatment plan",
    history: [
      { date: "2024-01-14", service: "Keratin Treatment", amount: "200.00", rating: 5 },
      { date: "2023-12-28", service: "Haircut", amount: "35.00", rating: 5 },
    ],
  },
  {
    id: "client-7",
    name: "David Lee",
    email: "david.lee@email.com",
    phone: "+1 555-0107",
    avatarUrl: null,
    totalVisits: 3,
    lastVisit: "2023-12-20",
    preferredServices: ["Haircut"],
    rating: 3,
    notes: "New client, still building relationship",
    history: [
      { date: "2023-12-20", service: "Haircut", amount: "35.00", rating: 3 },
    ],
  },
]

export default function ClientsPage() {
  const [clients, setClients] = useState(mockClients)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("recent")
  const [selectedClient, setSelectedClient] = useState(null)

  const filteredClients = clients
    .filter((client) => {
      const matchesSearch =
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.phone.includes(searchQuery)
      return matchesSearch
    })
    .sort((a, b) => {
      if (sortBy === "recent") {
        return new Date(b.lastVisit) - new Date(a.lastVisit)
      } else if (sortBy === "visits") {
        return b.totalVisits - a.totalVisits
      } else if (sortBy === "name") {
        return a.name.localeCompare(b.name)
      } else if (sortBy === "rating") {
        return b.rating - a.rating
      }
      return 0
    })

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getTimeSinceVisit = (dateStr) => {
    const date = new Date(dateStr)
    const now = new Date("2024-01-15") // Mock current date
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return `${Math.floor(diffDays / 30)} months ago`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Clients</h1>
          <p className="text-muted-foreground">
            View your client history and manage relationships.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-blue-50 p-3">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Clients</p>
                <p className="text-2xl font-bold">{clients.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-emerald-50 p-3">
                <Star className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
                <p className="text-2xl font-bold">
                  {(clients.reduce((acc, c) => acc + c.rating, 0) / clients.length).toFixed(1)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-violet-50 p-3">
                <History className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Visits</p>
                <p className="text-2xl font-bold">
                  {clients.reduce((acc, c) => acc + c.totalVisits, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-amber-50 p-3">
                <Calendar className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">This Week</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search clients by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="visits">Most Visits</SelectItem>
                <SelectItem value="name">Name (A-Z)</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Clients Table */}
      <Card>
        <CardHeader>
          <CardTitle>Client List</CardTitle>
          <CardDescription>
            {filteredClients.length} client{filteredClients.length !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Last Visit</TableHead>
                <TableHead>Total Visits</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow
                  key={client.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedClient(client)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={client.avatarUrl} />
                        <AvatarFallback>{getInitials(client.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{client.name}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {client.preferredServices.slice(0, 2).map((service) => (
                            <Badge key={service} variant="secondary" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm">{client.email}</p>
                      <p className="text-sm text-muted-foreground">{client.phone}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{formatDate(client.lastVisit)}</p>
                      <p className="text-xs text-muted-foreground">
                        {getTimeSinceVisit(client.lastVisit)}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{client.totalVisits}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-4 w-4",
                            i < client.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-muted-foreground"
                          )}
                        />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setSelectedClient(client)}>
                          <User className="mr-2 h-4 w-4" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="mr-2 h-4 w-4" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Phone className="mr-2 h-4 w-4" />
                          Call
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Calendar className="mr-2 h-4 w-4" />
                          Schedule Appointment
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredClients.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <User className="h-8 w-8 text-muted-foreground" />
                      <p className="text-muted-foreground">No clients found</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Client Detail Sheet */}
      <Sheet open={!!selectedClient} onOpenChange={() => setSelectedClient(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selectedClient && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedClient.avatarUrl} />
                    <AvatarFallback className="text-lg">
                      {getInitials(selectedClient.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <SheetTitle>{selectedClient.name}</SheetTitle>
                    <SheetDescription>
                      Client since {Math.floor(selectedClient.totalVisits / 2)} months
                    </SheetDescription>
                    <div className="flex items-center gap-1 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-4 w-4",
                            i < selectedClient.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-muted-foreground"
                          )}
                        />
                      ))}
                      <span className="text-sm text-muted-foreground ml-1">
                        ({selectedClient.rating}.0)
                      </span>
                    </div>
                  </div>
                </div>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Contact Info */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground">Contact</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedClient.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedClient.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2">
                  <Button className="flex-1" variant="outline">
                    <Mail className="mr-2 h-4 w-4" />
                    Email
                  </Button>
                  <Button className="flex-1" variant="outline">
                    <Phone className="mr-2 h-4 w-4" />
                    Call
                  </Button>
                  <Button className="flex-1">
                    <Calendar className="mr-2 h-4 w-4" />
                    Book
                  </Button>
                </div>

                {/* Preferred Services */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Preferred Services
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedClient.preferredServices.map((service) => (
                      <Badge key={service} variant="secondary">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                {selectedClient.notes && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-muted-foreground">Notes</h4>
                    <Card>
                      <CardContent className="pt-4">
                        <p className="text-sm">{selectedClient.notes}</p>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Visit History */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Recent Visits
                  </h4>
                  <div className="space-y-3">
                    {selectedClient.history.map((visit, index) => (
                      <Card key={index}>
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{visit.service}</p>
                              <p className="text-sm text-muted-foreground">
                                {formatDate(visit.date)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">${visit.amount}</p>
                              <div className="flex items-center gap-0.5">
                                {Array.from({ length: visit.rating }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className="h-3 w-3 fill-amber-400 text-amber-400"
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="pt-4 text-center">
                      <p className="text-2xl font-bold">{selectedClient.totalVisits}</p>
                      <p className="text-sm text-muted-foreground">Total Visits</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4 text-center">
                      <p className="text-2xl font-bold">
                        ${selectedClient.history.reduce((acc, v) => acc + parseFloat(v.amount), 0).toFixed(0)}
                      </p>
                      <p className="text-sm text-muted-foreground">Total Spent</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

function cn(...classes) {
  return classes.filter(Boolean).join(" ")
}
