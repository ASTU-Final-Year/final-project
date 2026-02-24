// app/showcase/page.jsx
"use client";

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu"
import { Calendar as CalendarIcon, ChevronDown, CreditCard, Home, Settings, User, Bell, Clock, CheckCircle, XCircle, AlertCircle, Plus, Search, Filter, Download, Upload, Trash2, Edit, Eye, Star, Phone, Mail, MapPin, CalendarDays, Users, Building, Briefcase, FileText, DollarSign, BarChart3, PieChart, TrendingUp, MessageCircle, Bot, Shield, Key, LogOut, Menu, X, ChevronLeft, ChevronRight, ChevronUp, Globe } from 'lucide-react'
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useState } from "react"
import Link from "next/link";

// Custom components for demo
const Stepper = ({ steps, currentStep }) => (
  <div className="w-full">
    <div className="flex items-center justify-between">
      {steps.map((step, index) => (
        <div key={step} className="flex-1 last:flex-none">
          <div className="flex items-center">
            <div className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium",
              index < currentStep ? "bg-primary text-primary-foreground" :
              index === currentStep ? "border-2 border-primary text-primary" :
              "border-2 border-muted text-muted-foreground"
            )}>
              {index < currentStep ? <CheckCircle className="h-5 w-5" /> : index + 1}
            </div>
            {index < steps.length - 1 && (
              <div className={cn(
                "h-0.5 flex-1 mx-2",
                index < currentStep ? "bg-primary" : "bg-muted"
              )} />
            )}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{step}</p>
        </div>
      ))}
    </div>
  </div>
)

const Chatbot = ({ onMessage }) => (
  <Card className="w-full max-w-sm">
    <CardHeader className="flex flex-row items-center gap-2">
      <Bot className="h-5 w-5" />
      <CardTitle className="text-sm">AI Assistant</CardTitle>
    </CardHeader>
    <CardContent>
      <ScrollArea className="h-48 mb-4">
        <div className="space-y-2">
          <div className="bg-muted p-2 rounded-lg max-w-[80%]">Hello! How can I help you today?</div>
          <div className="bg-primary text-primary-foreground p-2 rounded-lg max-w-[80%] ml-auto">I need to book an appointment</div>
          <div className="bg-muted p-2 rounded-lg max-w-[80%]">Sure! Which service sector?</div>
        </div>
      </ScrollArea>
      <div className="flex gap-2">
        <Input placeholder="Type your message..." className="flex-1" />
        <Button size="sm">Send</Button>
      </div>
    </CardContent>
  </Card>
)

export default function ComponentShowcase() {
  const [date, setDate] = useState(new Date())
  const [progress, setProgress] = useState(65)
  const [currentStep, setCurrentStep] = useState(2)

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background font-sans">
        {/* Header with Navigation */}
        <header className="border-b sticky top-0 bg-background z-50">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-orange-500" />
            <span className="font-bold">ServeSync+</span>
          </div>
          <div className="flex items-center gap-6">
            {/* <h1 className="text-xl font-bold">LyraUI</h1> */}
            <nav className="hidden md:flex gap-4">
              <Link className="text-sm" href="/">home</Link>
              <Link className="text-sm" href="/components">components</Link>
              <Link className="text-sm" href="/calendar">calendar</Link>
              <Link className="text-sm" href="/contact">contact</Link>
            </nav>
          </div>
            <div className="flex items-center gap-4">
              <SidebarProvider>
                <SidebarTrigger>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SidebarTrigger>
              </SidebarProvider>
              
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>ServeSync+</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid gap-3 p-4 w-[400px]">
                        <li className="row-span-3">
                          <NavigationMenuLink asChild>
                            <a className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md">
                              <Building className="h-6 w-6" />
                              <div className="mb-2 mt-4 text-lg font-medium">Multi-Sector Platform</div>
                              <p className="text-sm leading-tight text-muted-foreground">
                                Healthcare, Government, Automotive & Legal Services
                              </p>
                            </a>
                          </NavigationMenuLink>
                        </li>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              {/* <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/components">Components</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Showcase</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb> */}
            </div>

            <div className="flex items-center gap-2">
              {/* Avatar */}
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>

              {/* Dropdown Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Billing</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          
          {/* Command Palette */}
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Quick Search (Command Palette)</CardTitle>
            </CardHeader>
            <CardContent>
              <Command className="rounded-lg border shadow-md">
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup heading="Suggestions">
                    <CommandItem>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      <span>Book Appointment</span>
                    </CommandItem>
                    <CommandItem>
                      <Users className="mr-2 h-4 w-4" />
                      <span>View Employees</span>
                    </CommandItem>
                    <CommandItem>
                      <BarChart3 className="mr-2 h-4 w-4" />
                      <span>View Reports</span>
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </CardContent>
          </Card>

          {/* Welcome Alert */}
          <Alert className="mb-8">
            <Bell className="h-4 w-4" />
            <AlertTitle>ServeSync+ Component Showcase</AlertTitle>
            <AlertDescription>
              All shadcn/ui components needed for your multi-sector service scheduling system with Lyra style, Orange theme.
            </AlertDescription>
          </Alert>

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Services</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45</div>
                <p className="text-xs text-muted-foreground">Across 4 sectors</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Staff Online</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23/30</div>
                <p className="text-xs text-muted-foreground">+3 AI agents active</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">ETB 45.2K</div>
                <p className="text-xs text-muted-foreground">+12% this week</p>
              </CardContent>
            </Card>
          </div>

          {/* Multi-Sector Tabs */}
          <Tabs defaultValue="healthcare" className="mb-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="healthcare">Healthcare</TabsTrigger>
              <TabsTrigger value="government">Government</TabsTrigger>
              <TabsTrigger value="automotive">Automotive</TabsTrigger>
              <TabsTrigger value="legal">Legal</TabsTrigger>
            </TabsList>
            <TabsContent value="healthcare" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Healthcare Services</CardTitle>
                  <CardDescription>Medical appointments, consultations, and lab tests</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Badge>General Checkup</Badge>
                    <Badge variant="secondary">Specialist</Badge>
                    <Badge variant="outline">Lab Test</Badge>
                    <Badge variant="destructive">Emergency</Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="government">...</TabsContent>
            <TabsContent value="automotive">...</TabsContent>
            <TabsContent value="legal">...</TabsContent>
          </Tabs>

          {/* Two Column Layout for Components */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-8">
              {/* Authentication Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    Authentication Components
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="user@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type="password" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="remember" />
                      <Label htmlFor="remember">Remember me</Label>
                    </div>
                    <Button>Sign In</Button>
                    <Button variant="outline">Create Account</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Employee Management */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Employee Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage src="/avatars/01.png" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">John Doe</p>
                        <p className="text-xs text-muted-foreground">Senior Mechanic</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Active</Badge>
                      <Switch />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label>Assign Role</Label>
                    <RadioGroup defaultValue="employee">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="admin" id="admin" />
                        <Label htmlFor="admin">Admin</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="employee" id="employee" />
                        <Label htmlFor="employee">Employee</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="ai" id="ai" />
                        <Label htmlFor="ai">AI Agent</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Edit Employee</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Delete Employee</TooltipContent>
                    </Tooltip>
                  </div>
                </CardContent>
              </Card>

              {/* Service Management */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Service Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="health">
                      <AccordionTrigger>Healthcare Services</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>General Checkup</span>
                            <Badge>30 min</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Specialist Consultation</span>
                            <Badge>45 min</Badge>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="auto">
                      <AccordionTrigger>Automotive Services</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Oil Change</span>
                            <Badge>1 hour</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Engine Repair</span>
                            <Badge>3 days</Badge>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  <Sheet>
                    <SheetTrigger asChild>
                      <Button className="w-full mt-4" variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Service
                      </Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>Add Service</SheetTitle>
                        <SheetDescription>
                          Create a new service offering for your organization.
                        </SheetDescription>
                      </SheetHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label>Service Name</Label>
                          <Input placeholder="e.g., Dental Checkup" />
                        </div>
                        <div className="space-y-2">
                          <Label>Duration</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="15">15 minutes</SelectItem>
                              <SelectItem value="30">30 minutes</SelectItem>
                              <SelectItem value="60">1 hour</SelectItem>
                              <SelectItem value="120">2 hours</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Scheduling & Calendar */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    Scheduling & Calendar
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                      />
                    </PopoverContent>
                  </Popover>

                  <div className="space-y-2">
                    <Label>Available Time Slots</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button variant="outline" size="sm">9:00 AM</Button>
                      <Button variant="outline" size="sm">10:00 AM</Button>
                      <Button variant="outline" size="sm">11:00 AM</Button>
                      <Button variant="outline" size="sm">2:00 PM</Button>
                      <Button variant="outline" size="sm">3:00 PM</Button>
                      <Button variant="secondary" size="sm">4:00 PM</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Progress Tracking */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Progress Tracking
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Service Completion</span>
                      <span className="text-sm text-muted-foreground">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-4">Service Workflow</h4>
                    <Stepper 
                      steps={['Submitted', 'In Queue', 'In Progress', 'Quality Check', 'Completed']}
                      currentStep={currentStep}
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="gap-1">
                      <Clock className="h-3 w-3" />
                      Est. Time: 45 min
                    </Badge>
                    <Badge className="gap-1 bg-orange-500">
                      <CheckCircle className="h-3 w-3" />
                      In Progress
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Processing */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Processing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Card className="p-4 flex-1">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        <div>
                          <p className="text-sm font-medium">•••• 4242</p>
                          <p className="text-xs text-muted-foreground">Expires 12/25</p>
                        </div>
                      </div>
                    </Card>
                    <Button variant="outline" size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button className="w-full">Make Payment</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Payment</AlertDialogTitle>
                        <AlertDialogDescription>
                          Amount: ETB 1,500.00 for General Checkup
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction>Confirm</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>

              {/* AI Agent Interface */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    AI Agent Interface
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Chatbot />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Data Tables Section */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Appointments Table
              </CardTitle>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search appointments..." className="pl-8" />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Sector</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback>U{i}</AvatarFallback>
                          </Avatar>
                          Client {i}
                        </div>
                      </TableCell>
                      <TableCell>General Checkup</TableCell>
                      <TableCell>
                        <Badge variant="outline">Healthcare</Badge>
                      </TableCell>
                      <TableCell>2024-01-{10 + i}</TableCell>
                      <TableCell>
                        <Badge className={
                          i === 1 ? "bg-green-500" :
                          i === 2 ? "bg-yellow-500" :
                          i === 3 ? "bg-blue-500" :
                          "bg-gray-500"
                        }>
                          {i === 1 ? "Completed" :
                           i === 2 ? "In Progress" :
                           i === 3 ? "Scheduled" :
                           "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Hover Cards & Tooltips Demo */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="outline">Hover over me</Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="flex justify-between space-x-4">
                  <Avatar>
                    <AvatarImage src="https://github.com/vercel.png" />
                    <AvatarFallback>VC</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">@nextjs</h4>
                    <p className="text-sm">The React Framework – created and maintained by @vercel.</p>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Tooltip</Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>This is a tooltip</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </main>
      </div>
    </TooltipProvider>
  )
}