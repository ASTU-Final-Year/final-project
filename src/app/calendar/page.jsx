// app/showcase/page.jsx
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Kenat imports - using the actual exports
import { 
  MonthGrid,
  Time,
  toEC,
  toGC,
  toArabic,
  getHolidaysInMonth,
  getHolidaysForYear,
  getBahireHasab,
  getFastingPeriod,
  getFastingInfo,
  getFastingDays,
  getHoliday,
  HolidayTags,
  HolidayNames,
  monthNames,
  diffBreakdown
} from 'kenat'

import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle,
  Search,
  Filter,
  Download,
  Edit,
  Eye,
  Users,
  Briefcase,
  DollarSign,
  TrendingUp,
  Bot,
  Key,
  LogOut,
  Menu,
  Globe,
  Sun,
  Moon,
  FileText,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"

// Ethiopian Calendar Grid Component using MonthGrid
// Ethiopian Calendar Grid Component using MonthGrid
const EthiopianCalendarGrid = ({ year, month, onSelectDate, selectedDate }) => {
  const [gridData, setGridData] = useState(null)
  
  useEffect(() => {
    // MonthGrid expects (year, month) where month is 1-based (Meskerem = 1)
    const grid = new MonthGrid(year, month)
    const generated = grid.generate()
    setGridData(generated)
  }, [year, month])

  if (!gridData) return null

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            const prevGrid = gridData.down()
            setGridData(prevGrid)
            // Update parent with new year/month
            onSelectDate?.({
              year: prevGrid.year,
              month: prevGrid.month,
              day: 1 // Default to first day of month
            })
          }}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="text-center font-medium">
          {gridData.monthName} {(gridData.year)}
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            const nextGrid = gridData.up()
            setGridData(nextGrid)
            // Update parent with new year/month
            onSelectDate?.({
              year: nextGrid.year,
              month: nextGrid.month,
              day: 1 // Default to first day of month
            })
          }}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {/* Weekday headers - using gridData.headers which has Amharic day names */}
        {gridData.headers.map((header, index) => (
          <div key={index} className="text-center text-xs font-medium py-1 text-muted-foreground">
            {header}
          </div>
        ))}
        
        {/* Calendar days */}
        {gridData.days.map((day, index) => {
          // If day is null, render empty cell
          if (day === null) {
            return <div key={index} className="aspect-square p-2" />
          }
          
          // Day is an object with properties like:
          // {
          //   ethiopian: { year, month, day },
          //   gregorian: Date object,
          //   weekday: number (0-6),
          //   weekdayName: string (እሁድ, ሰኞ, etc.),
          //   isToday: boolean,
          //   holidays: array of holiday objects
          // }
          
          const isSelected = selectedDate?.day === day.ethiopian.day && 
                            selectedDate?.month === gridData.month && 
                            selectedDate?.year === gridData.year
          
          return (
            <button
              key={index}
              onClick={() => onSelectDate?.({
                year: gridData.year,
                month: gridData.month,
                day: day.ethiopian.day,
                fullDate: day // Store the full day object if needed
              })}
              className={cn(
                "aspect-square p-2 text-sm rounded-md hover:bg-accent transition-colors flex items-center justify-center",
                "text-foreground",
                day.isToday && "bg-primary/10 text-primary font-medium ring-2 ring-primary/20",
                day.holidays?.length > 0 && "text-orange-600 font-medium",
                isSelected && "bg-primary text-primary-foreground hover:bg-primary",
              )}
              title={day.holidays?.map(h => h.name).join(', ')}
            >
              <div className="flex flex-col items-center">
                <span>{(day.ethiopian.day)}</span>
                {day.holidays?.length > 0 && (
                  <span className="text-[8px] mt-0.5">●</span>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Holiday Legend */}
      {gridData.days.some(day => day?.holidays?.length > 0) && (
        <div className="mt-4 text-xs text-muted-foreground border-t pt-3">
          <div className="flex items-center gap-2 mb-2">
            <Sun className="h-3 w-3 text-orange-500" />
            <span className="font-medium">በዓላት በዚህ ወር</span>
          </div>
          <div className="space-y-1">
            {gridData.days
              .filter(day => day?.holidays?.length > 0)
              .map((day, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-8 text-right">{(day.ethiopian.day)}</span>
                  <span>{day.holidays.map(h => h.name).join(', ')}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
// Ethiopian Date Picker
const EthiopianDatePicker = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [gridData, setGridData] = useState(null)
  
  // Initialize grid with selected date or current date
  useEffect(() => {
    const initialYear = value?.year || 2017
    const initialMonth = value?.month || 1
    const grid = new MonthGrid(initialYear, initialMonth)
    setGridData(grid.generate())
  }, [])

  const handlePrevMonth = () => {
    if (gridData) {
      const prevGrid = gridData.down()
      setGridData(prevGrid)
    }
  }

  const handleNextMonth = () => {
    if (gridData) {
      const nextGrid = gridData.up()
      setGridData(nextGrid)
    }
  }

  const handleDateSelect = (date) => {
    onChange(date)
    setIsOpen(false)
  }
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? (
            <span>
              {monthNames[value.month]} {(value.day)}, {(value.year)}
            </span>
          ) : (
            <span>ቀን ይምረጡ</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-4">
          {gridData && (
            <>
              {/* Month/Year Navigation */}
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePrevMonth}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="font-medium">
                  {gridData.monthName} {(gridData.year)}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNextMonth}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Headers */}
                {gridData.headers.map((header, index) => (
                  <div key={index} className="text-center text-xs font-medium py-1 text-muted-foreground">
                    {header}
                  </div>
                ))}
                
                {/* Days */}
                {gridData.days.map((day, index) => {
                  if (day === null) {
                    return <div key={index} className="aspect-square p-2" />
                  }
                  
                  const isSelected = value?.day === day.ethiopian.day && 
                                    value?.month === gridData.month && 
                                    value?.year === gridData.year
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handleDateSelect({
                        year: gridData.year,
                        month: gridData.month,
                        day: day.ethiopian.day,
                        fullDate: day
                      })}
                      className={cn(
                        "aspect-square p-2 text-sm rounded-md hover:bg-accent transition-colors flex items-center justify-center",
                        "text-foreground",
                        day.isToday && "bg-primary/10 text-primary font-medium ring-2 ring-primary/20",
                        isSelected && "bg-primary text-primary-foreground hover:bg-primary",
                        day.holidays?.length > 0 && "text-orange-600 font-medium"
                      )}
                      title={day.holidays?.map(h => h.name).join(', ')}
                    >
                      <div className="flex flex-col items-center">
                        <span>{(day.ethiopian.day)}</span>
                        {day.holidays?.length > 0 && (
                          <span className="text-[8px] mt-0.5">●</span>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Today's indicator */}
              {gridData.days.some(day => day?.isToday) && (
                <div className="mt-3 text-xs text-muted-foreground flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full ring-2 ring-primary/20 bg-primary/10" />
                  <span>የዛሬ ቀን</span>
                </div>
              )}
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

// Ethiopian Date Display
const EthiopianDateDisplay = ({ date, format = "full" }) => {
  if (!date) return null
  
  const { year, month, day } = date
  
  if (format === "full") {
    return <span>{monthNames[month]} {(day)}, {(year)}</span>
  } else if (format === "short") {
    return <span>{(day)}/{(month)}/{(year)}</span>
  }
  return <span>{(day)} {monthNames[month]} {(year)}</span>
}

// Ethiopian Time Display
const EthiopianTimeDisplay = ({ time }) => {
  if (!time) return null
  return <span>{(time)} ሰዓት</span>
}

// Holiday Badge Component
const HolidayBadge = ({ date }) => {
  const [holiday, setHoliday] = useState(null)
  
  useEffect(() => {
    if (date) {
      const h = getHoliday(date.year, date.month, date.day)
      setHoliday(h)
    }
  }, [date])
  
  if (!holiday) return null
  
  return (
    <Badge variant="outline" className="gap-1 border-orange-500/20 bg-orange-500/5">
      <Sun className="h-3 w-3 text-orange-500" />
      {holiday.name}
    </Badge>
  )
}

// Fasting Info Component
const FastingInfo = ({ date }) => {
  const [fasting, setFasting] = useState(null)
  
  useEffect(() => {
    if (date) {
      const info = getFastingInfo(date.year, date.month, date.day)
      setFasting(info)
    }
  }, [date])
  
  if (!fasting) return null
  
  return (
    <Badge variant="outline" className="gap-1">
      <Moon className="h-3 w-3" />
      {fasting.name}
    </Badge>
  )
}

// Stepper Component
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

// Chatbot Component
const Chatbot = () => (
  <Card className="w-full">
    <CardHeader className="flex flex-row items-center gap-2">
      <Bot className="h-5 w-5" />
      <CardTitle className="text-sm">AI ረዳት</CardTitle>
    </CardHeader>
    <CardContent>
      <ScrollArea className="h-48 mb-4">
        <div className="space-y-2">
          <div className="bg-muted p-2 rounded-lg max-w-[80%]">ሰላም! እንዴት ልረዳዎት እችላለሁ?</div>
          <div className="bg-primary text-primary-foreground p-2 rounded-lg max-w-[80%] ml-auto">ቀጠሮ መያዝ እፈልጋለሁ</div>
          <div className="bg-muted p-2 rounded-lg max-w-[80%]">እባክዎ የሚፈልጉትን አገልግሎት ይምረጡ</div>
        </div>
      </ScrollArea>
      <div className="flex gap-2">
        <Input placeholder="መልዕክት ይጻፉ..." className="flex-1" />
        <Button size="sm">ላክ</Button>
      </div>
    </CardContent>
  </Card>
)

export default function ComponentShowcase() {
  const [selectedDate, setSelectedDate] = useState({ year: 2017, month: 1, day: 1 })
  const [progress, setProgress] = useState(65)
  const [currentStep, setCurrentStep] = useState(2)
  
  // Get holidays for current month
  const [monthHolidays, setMonthHolidays] = useState([])
  
  useEffect(() => {
    if (selectedDate) {
      const holidays = getHolidaysInMonth(selectedDate.year, selectedDate.month)
      setMonthHolidays(holidays)
    }
  }, [selectedDate])
  
  // Get Bahire Hasab for the year
  const bahireHasab = getBahireHasab(selectedDate.year)
  
  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Menu className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-orange-500" />
              <span className="font-bold">ServeSync+</span>
            </div>
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
            {/* Ethiopian Date Display */}
            <div className="hidden md:flex items-center gap-2 bg-orange-500/10 px-3 py-1 rounded-full">
              <CalendarIcon className="h-4 w-4 text-orange-500" />
              <EthiopianDateDisplay date={selectedDate} format="full" />
            </div>

            <Avatar>
              <AvatarFallback>ኢት</AvatarFallback>
            </Avatar>

            <Button variant="ghost" size="icon">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Alert */}
        <Alert className="mb-8 border-orange-500/20 bg-orange-500/5">
          <CalendarIcon className="h-4 w-4 text-orange-500" />
          <AlertTitle className="text-orange-500">የኢትዮጵያ ቀን መቁጠሪያ</AlertTitle>
          <AlertDescription>
            ሲስተሙ በኢትዮጵያ ቀን መቁጠሪያ ይሰራል። ዛሬ {monthNames[selectedDate.month]} {(selectedDate.day)}, {(selectedDate.year)} ነው።
          </AlertDescription>
        </Alert>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ጠቅላላ ቀጠሮዎች</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">ካለፈው ወር +20.1%</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ንቁ አገልግሎቶች</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <p className="text-xs text-muted-foreground">በ4 ዘርፎች</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ሰራተኞች ኦንላይን</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23/30</div>
              <p className="text-xs text-muted-foreground">+3 AI ወኪሎች ንቁ</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ገቢ</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">ብር 45.2K</div>
              <p className="text-xs text-muted-foreground">በዚህ ሳምንት +12%</p>
            </CardContent>
          </Card>
        </div>

        {/* Ethiopian Calendar Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-orange-500" />
              የኢትዮጵያ ቀን መቁጠሪያ (Kenat)
            </CardTitle>
            <CardDescription>
              ሁሉም ቀጠሮዎች እና መርሐግብሮች በኢትዮጵያ ዘመን አቆጣጠር
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Date Picker */}
              <div>
                <h3 className="text-sm font-medium mb-2">የቀን መምረጫ</h3>
                <EthiopianDatePicker
                  value={selectedDate}
                  onChange={setSelectedDate}
                />
                
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">የተመረጠ ቀን:</span>
                    <EthiopianDateDisplay date={selectedDate} format="full" />
                  </div>
                  
                  {/* Holiday Badge */}
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">በዓል:</span>
                    <HolidayBadge date={selectedDate} />
                  </div>
                  
                  {/* Fasting Info */}
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">ጾም:</span>
                    <FastingInfo date={selectedDate} />
                  </div>
                  
                  {/* Convert to Gregorian */}
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">ግሪጎሪያን:</span>
                    <span>{toGC(selectedDate.year, selectedDate.month, selectedDate.day).day}</span>
                  </div>
                </div>
              </div>

              {/* Calendar Grid */}
              <div>
                <h3 className="text-sm font-medium mb-2">የወር እይታ</h3>
                <div className="border rounded-lg p-4">
                  <EthiopianCalendarGrid
                    year={selectedDate.year}
                    month={selectedDate.month}
                    selectedDate={selectedDate}
                    onSelectDate={(date) => {
                      setSelectedDate(date)
                      // Also update the MonthGrid when date changes
                      const grid = new MonthGrid(date.year, date.month)
                      setGridData(grid.generate())
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Holidays in Month */}
            {monthHolidays.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">በዚህ ወር ያሉ በዓላት</h3>
                <div className="flex flex-wrap gap-2">
                  {monthHolidays.map((holiday, index) => (
                    <Badge key={index} variant="outline" className="gap-1">
                      <Sun className="h-3 w-3" />
                      {holiday.name} - {(holiday.day)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Bahire Hasab Info */}
            {bahireHasab && (
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-3">
                  <p className="text-xs text-muted-foreground">ዘመነ ወንጌል</p>
                  <p className="font-medium">{bahireHasab.zemeneWongel}</p>
                </Card>
                <Card className="p-3">
                  <p className="text-xs text-muted-foreground">ዘመነ ማርቅ</p>
                  <p className="font-medium">{bahireHasab.zemeneMarq}</p>
                </Card>
                <Card className="p-3">
                  <p className="text-xs text-muted-foreground">ዘመነ ዮሐንስ</p>
                  <p className="font-medium">{bahireHasab.zemeneYohannes}</p>
                </Card>
                <Card className="p-3">
                  <p className="text-xs text-muted-foreground">ዘመነ ሉቃስ</p>
                  <p className="font-medium">{bahireHasab.zemeneLuqas}</p>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Multi-Sector Tabs */}
        <Tabs defaultValue="healthcare" className="mb-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="healthcare">ጤና</TabsTrigger>
            <TabsTrigger value="government">መንግስት</TabsTrigger>
            <TabsTrigger value="automotive">መኪና</TabsTrigger>
            <TabsTrigger value="legal">ህግ</TabsTrigger>
          </TabsList>
          
          <TabsContent value="healthcare" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>የጤና አገልግሎቶች</CardTitle>
                <CardDescription>ሆስፒታሎች፣ ክሊኒኮች እና ላቦራቶሪዎች</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 flex-wrap">
                  <Badge>አጠቃላይ ምርመራ</Badge>
                  <Badge variant="secondary">ስፔሻሊስት</Badge>
                  <Badge variant="outline">ላብ ምርመራ</Badge>
                  <Badge variant="destructive">ድንገተኛ</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Authentication Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  የመግቢያ ክፍሎች
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">ኢሜይል</Label>
                  <Input id="email" type="email" placeholder="user@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">የይለፍ ቃል</Label>
                  <Input id="password" type="password" />
                </div>
                <Button className="w-full">ግባ</Button>
              </CardContent>
            </Card>

            {/* Employee Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  የሰራተኞች አስተዳደር
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarFallback>አበ</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">አበበ በቀለ</p>
                      <p className="text-xs text-muted-foreground">ከፍተኛ መካኒክ</p>
                    </div>
                  </div>
                  <Switch />
                </div>
                <Separator className="my-4" />
                <RadioGroup defaultValue="employee">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="admin" id="admin" />
                    <Label htmlFor="admin">አስተዳዳሪ</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="employee" id="employee" />
                    <Label htmlFor="employee">ሰራተኛ</Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Progress Tracking */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  የአገልግሎት እድገት
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">ማጠናቀቂያ</span>
                    <span className="text-sm text-muted-foreground">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-4">የአገልግሎት ሂደት</h4>
                  <Stepper 
                    steps={['ተልኳል', 'ወረፋ', 'በሂደት', 'ጥራት', 'ተጠናቋል']}
                    currentStep={currentStep}
                  />
                </div>
              </CardContent>
            </Card>

            {/* AI Assistant */}
            <Chatbot />
          </div>
        </div>

        {/* Appointments Table */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              የቀጠሮ ዝርዝር
            </CardTitle>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="ቀጠሮ ፈልግ..." className="pl-8" />
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
                  <TableHead>ደንበኛ</TableHead>
                  <TableHead>አገልግሎት</TableHead>
                  <TableHead>ዘርፍ</TableHead>
                  <TableHead>የኢትዮጵያ ቀን</TableHead>
                  <TableHead>ሁኔታ</TableHead>
                  <TableHead>ድርጊት</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[1, 2, 3].map((i) => (
                  <TableRow key={i}>
                    <TableCell>ደንበኛ {i}</TableCell>
                    <TableCell>አጠቃላይ ምርመራ</TableCell>
                    <TableCell>
                      <Badge variant="outline">ጤና</Badge>
                    </TableCell>
                    <TableCell>
                      <EthiopianDateDisplay 
                        date={{ year: 2017, month: 1, day: i + 5 }} 
                        format="short" 
                      />
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-500">ተጠናቋል</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}