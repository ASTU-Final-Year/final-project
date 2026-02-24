// app/page.jsx
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BellRing, Check, Globe, Info, Settings, User } from 'lucide-react'
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Header with Navigation */}
      <header className="border-b">
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
          
          <div className="flex items-center gap-2">
            {/* Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuItem>Subscription</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Dialog Trigger Button */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Settings</DialogTitle>
                  <DialogDescription>
                    Configure your application preferences here.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input id="name" value="Lyra User" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input id="email" value="user@example.com" className="col-span-3" />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Alert Example */}
        <Alert className="mb-8">
          <Info className="h-4 w-4" />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            This is a sample page showcasing shadcn/ui components with the Lyra style and Orange theme.
          </AlertDescription>
        </Alert>

        {/* Hero Section with Badges */}
        <section className="mb-12 text-center">
          <h2 className="text-4xl font-bold tracking-tight mb-4">
            Welcome to Your Component Showcase
          </h2>
          <p className="text-muted-foreground mb-6">
            A collection of UI components styled with shadcn/ui
          </p>
          <div className="flex gap-2 justify-center">
            <Badge>New</Badge>
            <Badge variant="secondary">Featured</Badge>
            <Badge variant="outline">Beta</Badge>
            <Badge variant="destructive">Limited</Badge>
          </div>
        </section>

        {/* Cards Grid */}
        <section className="mb-12">
          <h3 className="text-2xl font-semibold mb-6">Featured Components</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 - Basic Card */}
            <Card>
              <CardHeader>
                <CardTitle>Getting Started</CardTitle>
                <CardDescription>
                  Learn how to use shadcn/ui components in your project
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Each component is built with accessibility and customization in mind.</p>
              </CardContent>
              <CardFooter>
                <Button>Get Started</Button>
              </CardFooter>
            </Card>

            {/* Card 2 - With Form Elements */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Perform common tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="action-select">Choose action</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="create">Create new</SelectItem>
                      <SelectItem value="edit">Edit existing</SelectItem>
                      <SelectItem value="delete">Delete item</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="action-input">Additional info</Label>
                  <Input id="action-input" placeholder="Enter details..." />
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>Submit</Button>
              </CardFooter>
            </Card>

            {/* Card 3 - Notification Style */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BellRing className="h-5 w-5" />
                  Notifications
                </CardTitle>
                <CardDescription>You have 3 unread messages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Badge variant="outline" className="h-2 w-2 rounded-full p-0 bg-orange-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Notification {i}</p>
                        <p className="text-xs text-muted-foreground">2 minutes ago</p>
                      </div>
                      <Button variant="ghost" size="sm">View</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">View All</Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Interactive Section with Alert Dialog */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Component Interaction Demo</CardTitle>
              <CardDescription>
                Try out different component states and interactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 items-center">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
                <Button disabled>Disabled</Button>
              </div>

              <div className="mt-6">
                <Alert variant="destructive">
                  <AlertTitle className="flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    Warning
                  </AlertTitle>
                  <AlertDescription>
                    This is a destructive alert - use with caution!
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Footer */}
        <footer className="border-t pt-8 mt-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-semibold mb-4">About</h4>
              <p className="text-sm text-muted-foreground">
                Built with shadcn/ui using Lyra style, Orange theme, and Noto Sans font.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Links</h4>
              <div className="space-y-2">
                <Button variant="link" className="p-0 h-auto">Documentation</Button>
                <br />
                <Button variant="link" className="p-0 h-auto">Components</Button>
                <br />
                <Button variant="link" className="p-0 h-auto">Themes</Button>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Subscribe</h4>
              <div className="flex gap-2">
                <Input placeholder="Email address" type="email" />
                <Button>Subscribe</Button>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}