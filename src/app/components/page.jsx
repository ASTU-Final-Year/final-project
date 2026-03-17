// app/page.jsx
"use client";

import React from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import {
  BellRing,
  Check,
  Globe,
  Info,
  Settings,
  User,
  PlusIcon,
  BluetoothIcon,
  MoreVerticalIcon,
  FileIcon,
  FolderIcon,
  FolderOpenIcon,
  FileCodeIcon,
  MoreHorizontalIcon,
  FolderSearchIcon,
  SaveIcon,
  DownloadIcon,
  EyeIcon,
  LayoutIcon,
  PaletteIcon,
  SunIcon,
  MoonIcon,
  MonitorIcon,
  UserIcon,
  CreditCardIcon,
  SettingsIcon,
  KeyboardIcon,
  LanguagesIcon,
  BellIcon,
  MailIcon,
  ShieldIcon,
  HelpCircleIcon,
  LogOutIcon,
  ClockIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  CircleIcon,
  CalendarDaysIcon,
  FileTextIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { EthiopianCalendar } from "@/components/ui/ethiopian-calendar";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Toggle } from "@/components/ui/toggle";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";

const startMonth = new Date();
const endMonth = new Date(Date.now() + 5 * 365.25 * 24 * 60 * 60 * 1000);
const frameworks = ["Next.js", "SvelteKit", "Nuxt.js", "Remix", "Astro"];

export default function Home() {
  const [dates, setDates] = React.useState([new Date()]);
  const [notifications, setNotifications] = React.useState({
    email: true,
    sms: false,
    push: true,
  });
  const [theme, setTheme] = React.useState("light");

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans text-foreground">
      <SiteHeader />

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 lg:px-8 py-10 space-y-24">
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto pt-10">
          <Badge
            variant="outline"
            className="px-3 py-1 text-sm font-medium rounded-full bg-primary/10 text-primary border-primary/20"
          >
            LyraUI Showcase
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Building Beautiful Interfaces
          </h1>
          <p className="text-lg text-muted-foreground">
            A comprehensive overview of our UI components. Built with shadcn/ui,
            styled with the Lyra design system, tailored for maximum
            flexibility.
          </p>
          <div className="flex gap-4 pt-4">
            <Button size="lg" className="rounded px-8">
              Get Started
            </Button>
            <Button size="lg" variant="outline" className="rounded px-8">
              Browse Components
            </Button>
          </div>
        </section>

        {/* Feature Highlights (From Component Example) */}
        <section className="space-y-10">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-3xl font-semibold tracking-tight">
              Advanced Patterns
            </h2>
            <p className="text-sm text-muted-foreground hidden md:block">
              Complex component configurations
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 items-start">
            {/* Advanced Card */}
            <div className="flex justify-center">
              <Card className="relative w-full max-w-sm overflow-hidden pt-0 border-border/50 transition-all">
                <div className="absolute inset-0 z-30 aspect-video bg-primary opacity-50 mix-blend-color" />
                <img
                  src="https://images.unsplash.com/photo-1604076850742-4c7221f3101b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Photo by mymind on Unsplash"
                  title="Photo by mymind on Unsplash"
                  className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale"
                />
                <CardHeader>
                  <CardTitle>
                    Observability Plus is replacing Monitoring
                  </CardTitle>
                  <CardDescription>
                    Switch to the improved way to explore your data, with
                    natural language. Monitoring will no longer be available on
                    the Pro plan in November, 2025
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button>
                        <PlusIcon
                          data-icon="inline-start"
                          className="mr-2 h-4 w-4"
                        />
                        Show Dialog
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent size="sm">
                      <AlertDialogHeader>
                        <AlertDialogMedia>
                          <BluetoothIcon className="h-6 w-6 text-primary" />
                        </AlertDialogMedia>
                        <AlertDialogTitle>
                          Allow accessory to connect?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Do you want to allow the USB accessory to connect to
                          this device?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Don&apos;t allow</AlertDialogCancel>
                        <AlertDialogAction>Allow</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <Badge variant="secondary" className="ml-auto">
                    Warning
                  </Badge>
                </CardFooter>
              </Card>
            </div>

            {/* Advanced Form */}
            <div className="flex justify-center">
              <Card className="w-full max-w-md border-border/50">
                <CardHeader className="bg-muted/30">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>User Profile</CardTitle>
                      <CardDescription>
                        Advanced form with multiple field types
                      </CardDescription>
                    </div>
                    <CardAction>
                      {/* Integrated Dropdown Menu Example */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="-mr-2">
                            <MoreVerticalIcon className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuGroup>
                            <DropdownMenuLabel>Appearance</DropdownMenuLabel>
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger>
                                <PaletteIcon className="mr-2 h-4 w-4" /> Theme
                              </DropdownMenuSubTrigger>
                              <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                  <DropdownMenuRadioGroup
                                    value={theme}
                                    onValueChange={setTheme}
                                  >
                                    <DropdownMenuRadioItem value="light">
                                      <SunIcon className="mr-2 h-4 w-4" /> Light
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="dark">
                                      <MoonIcon className="mr-2 h-4 w-4" /> Dark
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="system">
                                      <MonitorIcon className="mr-2 h-4 w-4" />{" "}
                                      System
                                    </DropdownMenuRadioItem>
                                  </DropdownMenuRadioGroup>
                                </DropdownMenuSubContent>
                              </DropdownMenuPortal>
                            </DropdownMenuSub>
                          </DropdownMenuGroup>
                          <DropdownMenuSeparator />
                          <DropdownMenuCheckboxItem
                            checked={notifications.push}
                            onCheckedChange={(c) =>
                              setNotifications({ ...notifications, push: !!c })
                            }
                          >
                            <BellIcon className="mr-2 h-4 w-4" /> Push
                            Notifications
                          </DropdownMenuCheckboxItem>
                          <DropdownMenuCheckboxItem
                            checked={notifications.email}
                            onCheckedChange={(c) =>
                              setNotifications({ ...notifications, email: !!c })
                            }
                          >
                            <MailIcon className="mr-2 h-4 w-4" /> Email
                            Notifications
                          </DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardAction>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <form>
                    <FieldGroup>
                      <div className="grid grid-cols-2 gap-4">
                        <Field>
                          <FieldLabel htmlFor="sf-name">Name</FieldLabel>
                          <Input id="sf-name" placeholder="John Doe" required />
                        </Field>
                        <Field>
                          <FieldLabel htmlFor="sf-role">Role</FieldLabel>
                          <Select defaultValue="">
                            <SelectTrigger id="sf-role">
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="developer">
                                  Developer
                                </SelectItem>
                                <SelectItem value="designer">
                                  Designer
                                </SelectItem>
                                <SelectItem value="manager">Manager</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </Field>
                      </div>
                      <Field>
                        <FieldLabel htmlFor="sf-framework">
                          Preferred Framework
                        </FieldLabel>
                        <Combobox items={frameworks}>
                          <ComboboxInput
                            id="sf-framework"
                            placeholder="Select a framework..."
                            required
                          />
                          <ComboboxContent>
                            <ComboboxEmpty>No frameworks found.</ComboboxEmpty>
                            <ComboboxList>
                              {(item) => (
                                <ComboboxItem key={item} value={item}>
                                  {item}
                                </ComboboxItem>
                              )}
                            </ComboboxList>
                          </ComboboxContent>
                        </Combobox>
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="sf-comments">
                          Additional Context
                        </FieldLabel>
                        <Textarea
                          id="sf-comments"
                          placeholder="Why do you prefer this framework?"
                          className="resize-none"
                        />
                      </Field>
                      <Field
                        orientation="horizontal"
                        className="pt-4 mt-2 border-t"
                      >
                        <Button type="submit" className="w-full">
                          Save Changes
                        </Button>
                      </Field>
                    </FieldGroup>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Form Controls Section */}
        <section className="space-y-10">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-3xl font-semibold tracking-tight">
              Form Controls
            </h2>
            <p className="text-sm text-muted-foreground hidden md:block">
              Inputs, toggles, and selections
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Toggles & Checks</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="airplane-mode"
                    className="flex flex-col items-start"
                  >
                    <span>Airplane Mode</span>
                    <span className="font-normal text-xs text-muted-foreground">
                      Disables all network connections
                    </span>
                  </Label>
                  <Switch id="airplane-mode" />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" />
                  <Label htmlFor="terms" className="font-normal">
                    I accept the terms and conditions
                  </Label>
                </div>
                <div className="pt-2">
                  <Label className="mb-3 block text-sm font-medium">
                    Notification Preferences
                  </Label>
                  <RadioGroup defaultValue="mentions" className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="r1" />
                      <Label htmlFor="r1" className="font-normal">
                        Everything
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="mentions" id="r2" />
                      <Label htmlFor="r2" className="font-normal">
                        Mentions only
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Input Types</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email-input">Email Address</Label>
                  <Input
                    id="email-input"
                    type="email"
                    placeholder="m@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-input">Password</Label>
                  <Input
                    id="password-input"
                    type="password"
                    placeholder="••••••••"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Volume Level</Label>
                  <Slider
                    defaultValue={[50]}
                    max={100}
                    step={1}
                    className="py-2"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Date Pickers (Calendars)</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="gregorian" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="gregorian">Gregorian</TabsTrigger>
                    <TabsTrigger value="ethiopian">Ethiopian</TabsTrigger>
                  </TabsList>
                  <TabsContent
                    value="gregorian"
                    className="flex justify-center mt-0"
                  >
                    <Calendar
                      mode="single"
                      selected={dates}
                      onSelect={setDates}
                      startMonth={startMonth}
                      endMonth={endMonth}
                      reverseYears
                      className="rounded border"
                      captionLayout="dropdown"
                    />
                  </TabsContent>
                  <TabsContent
                    value="ethiopian"
                    className="flex justify-center mt-0"
                  >
                    <EthiopianCalendar
                      mode="single"
                      selected={dates}
                      onSelect={setDates}
                      startMonth={startMonth}
                      endMonth={endMonth}
                      reverseYears
                      className="rounded border"
                      captionLayout="dropdown"
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Data Display Section */}
        <section className="space-y-10">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-3xl font-semibold tracking-tight">
              Data Display
            </h2>
            <p className="text-sm text-muted-foreground hidden md:block">
              Tables, Lists, and Skeletons
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Table Component */}
            <Card className="lg:col-span-2 shadow-sm">
              <CardHeader>
                <CardTitle>Recent Invoices</CardTitle>
                <CardDescription>
                  You have 3 unpaid invoices this month.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-25">Invoice</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">INV001</TableCell>
                      <TableCell>
                        <Badge variant="outline">Paid</Badge>
                      </TableCell>
                      <TableCell>Credit Card</TableCell>
                      <TableCell className="text-right">$250.00</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">INV002</TableCell>
                      <TableCell>
                        <Badge variant="secondary">Pending</Badge>
                      </TableCell>
                      <TableCell>PayPal</TableCell>
                      <TableCell className="text-right">$150.00</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">INV003</TableCell>
                      <TableCell>
                        <Badge variant="destructive">Unpaid</Badge>
                      </TableCell>
                      <TableCell>Bank Transfer</TableCell>
                      <TableCell className="text-right">$350.00</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Avatars</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold">shadcn</h4>
                      <p className="text-sm text-muted-foreground">
                        m@example.com
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Loading States</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-50" />
                      <Skeleton className="h-4 w-37.5" />
                    </div>
                  </div>
                  <div className="space-y-2 mt-4">
                    <span className="text-sm font-medium">
                      Migration Progress
                    </span>
                    <Progress value={60} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Workflows & Tracking Section */}
        <section className="space-y-10">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-3xl font-semibold tracking-tight">
              Workflows & Tracking
            </h2>
            <p className="text-sm text-muted-foreground hidden md:block">
              Progress steps, assignments, and timelines
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Step Progress & Task Assignment Column */}
            <div className="space-y-6">
              {/* Horizontal Stepper */}
              <Card>
                <CardHeader>
                  <CardTitle>Service Request Progress</CardTitle>
                  <CardDescription>
                    Track the journey of a client&apos;s request through the
                    system.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <div className="absolute left-0 top-1/2 -translate-y-7/2 w-full h-1 bg-muted"></div>
                    <div className="absolute left-0 top-1/2 -translate-y-7/2 w-1/2 h-1 bg-primary"></div>
                    <div className="relative flex justify-between items-center z-10">
                      <div className="flex flex-col items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center shadow-sm">
                          <Check className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-medium text-foreground">
                          Intake
                        </span>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center shadow-sm border-[3px] border-background">
                          <CircleIcon className="h-3 w-3 fill-current" />
                        </div>
                        <span className="text-xs font-medium text-foreground">
                          Processing
                        </span>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center border-[3px] border-background">
                          <CircleIcon className="h-3 w-3" />
                        </div>
                        <span className="text-xs font-medium text-muted-foreground">
                          QA
                        </span>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center border-[3px] border-background">
                          <CircleIcon className="h-3 w-3" />
                        </div>
                        <span className="text-xs font-medium text-muted-foreground">
                          Dispatch
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Task Assignment Card */}
              <Card>
                <CardHeader className="pb-4 border-b">
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge variant="destructive" className="mb-2">
                        Urgent Priority
                      </Badge>
                      <CardTitle className="text-lg">
                        Review Compliance Docs
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <CalendarDaysIcon className="h-3 w-3" /> Due Today, 5:00
                        PM
                      </CardDescription>
                    </div>
                    <Avatar className="h-10 w-10 border shadow-sm">
                      <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      Please review the attached client compliance documents for
                      the upcoming service handoff. The previous sector has
                      cleared their requirements.
                    </p>
                    <div className="bg-muted/50 rounded p-3 flex items-center gap-4 text-sm border">
                      <FileTextIcon className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="font-medium">Client_Tax_Forms.pdf</p>
                        <p className="text-xs text-muted-foreground">2.4 MB</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <DownloadIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/20 flex-col items-stretch gap-4 pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <ArrowRightIcon className="h-4 w-4 text-primary" />
                    Assign Next Handoff
                  </div>
                  <div className="flex gap-2">
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select next sector/employee..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="qa">
                            Quality Assurance Team
                          </SelectItem>
                          <SelectItem value="dispatch">
                            Dispatch Officer
                          </SelectItem>
                          <SelectItem value="manager">
                            Sector Manager
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <Button>Handoff</Button>
                  </div>
                </CardFooter>
              </Card>
            </div>

            {/* Vertical Timeline Card */}
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>Service Timeline</CardTitle>
                <CardDescription>
                  Detailed audit log of SRQ-8902.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="relative border-l-2 border-muted ml-4 mt-2 space-y-8 pb-4">
                  {/* Timeline Item 1 */}
                  <div className="relative pl-6">
                    <span className="absolute -left-2.75 top-1 h-5 w-5 rounded-full bg-primary flex items-center justify-center ring-4 ring-background">
                      <Check className="h-3 w-3 text-white" />
                    </span>
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold text-sm">
                          Service Request Created
                        </h4>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <ClockIcon className="h-3 w-3" /> 09:00 AM
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Initiated by Client Portal
                      </p>
                    </div>
                  </div>

                  {/* Timeline Item 2 */}
                  <div className="relative pl-6">
                    <span className="absolute -left-2.75 top-1 h-5 w-5 rounded-full bg-primary flex items-center justify-center ring-4 ring-background">
                      <Check className="h-3 w-3 text-white" />
                    </span>
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold text-sm">
                          Initial Intake Completed
                        </h4>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <ClockIcon className="h-3 w-3" /> 10:30 AM
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Avatar className="h-5 w-5">
                          <AvatarImage src="https://i.pravatar.cc/150?u=b042581f4e29026704c" />
                          <AvatarFallback>AK</AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-medium text-foreground/80">
                          Anna K. (Clerk)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Item 3 (Current) */}
                  <div className="relative pl-6">
                    <span className="absolute -left-2.75 top-1 h-5 w-5 rounded-full bg-background border-2 border-primary flex items-center justify-center ring-4 ring-background">
                      <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    </span>
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold text-sm text-primary">
                          Processing Documents
                        </h4>
                        <span className="text-xs text-primary font-medium flex items-center gap-1">
                          In Progress
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Avatar className="h-5 w-5">
                          <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-medium text-foreground/80">
                          John D. (Analyst)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Item 4 (Future) */}
                  <div className="relative pl-6">
                    <span className="absolute -left-2.75 top-1 h-5 w-5 rounded-full bg-muted border-2 border-background flex items-center justify-center ring-4 ring-background"></span>
                    <div className="flex flex-col gap-1">
                      <h4 className="font-medium text-sm text-muted-foreground">
                        Awaiting Quality Assurance
                      </h4>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Feedback & Overlays Section */}
        <section className="space-y-10">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-3xl font-semibold tracking-tight">
              Feedback & Overlays
            </h2>
            <p className="text-sm text-muted-foreground hidden md:block">
              Dialogs, Sheets, and Tooltips
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Contextual Information</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-4 items-center">
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button variant="link">@nextjs</Button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="flex justify-between space-x-4">
                      <Avatar>
                        <AvatarImage src="https://github.com/vercel.png" />
                        <AvatarFallback>VC</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold">@nextjs</h4>
                        <p className="text-sm">
                          The React Framework – created and maintained by
                          @vercel.
                        </p>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full"
                      >
                        <Info className="h-4 w-4" />
                        <span className="sr-only">Info</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View properties</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">Options</Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-4">
                    <h4 className="font-medium mb-2">Display Settings</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Adjust your viewing preferences.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Compact mode</span>
                      <Switch />
                    </div>
                  </PopoverContent>
                </Popover>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Accordions & Alerts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert>
                  <AlertTitle className="flex flex-row justify-between">
                    System Alert
                    <span className="h-4 w-4 flex items-center justify-center -translate-y-0.5">
                      <Check className="h-4 w-4" />
                    </span>
                  </AlertTitle>
                  <AlertDescription>
                    Your deployment has successfully completed.
                  </AlertDescription>
                </Alert>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Advanced Features</AccordionTrigger>
                    <AccordionContent>
                      Gain access to powerful analytical tools and custom
                      integrations.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>Overlays</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="secondary" className="w-full">
                      Open Side Sheet
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Edit Profile</SheetTitle>
                      <SheetDescription>
                        Make changes to your profile here.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="grid gap-4 px-4 py-6">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="sp-name">Name</Label>
                        <Input id="sp-name" defaultValue="Pedro Duarte" />
                      </div>
                    </div>
                    <SheetFooter>
                      <SheetClose asChild>
                        <Button type="submit">Save changes</Button>
                      </SheetClose>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>

                <div className="text-center mt-6">
                  <Toggle aria-label="Toggle pin">
                    {/* <Badge
                      variant="outline"
                      className="px-4 py-2 cursor-pointer transition-colors"
                    > */}
                    Toggle Active State
                    {/* </Badge> */}
                  </Toggle>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Carousel Section */}
        <section className="space-y-10">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-3xl font-semibold tracking-tight">
              Carousels & Media
            </h2>
          </div>
          <div className="flex justify-center py-4 bg-muted/20 border rounded-xl overflow-hidden">
            <Carousel className="w-full max-w-xl">
              <CarouselContent>
                {Array.from({ length: 5 }).map((_, index) => (
                  <CarouselItem
                    key={index}
                    className="md:basis-1/2 lg:basis-1/3"
                  >
                    <div className="p-1">
                      <Card className="border-0 shadow-none bg-transparent">
                        <CardContent className="flex aspect-square items-center justify-center p-6 bg-muted/50 rounded-xl">
                          <span className="text-4xl font-semibold text-muted-foreground/50">
                            {index + 1}
                          </span>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </Carousel>
          </div>

          <div className="flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    2
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </section>
      </main>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}
