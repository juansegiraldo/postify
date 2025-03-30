"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ChevronLeft, Instagram, Facebook, Twitter, Linkedin, Youtube, Plus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center">
          <Link href="/" className="mr-4">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-medium text-gray-900">Settings</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full md:w-[400px] grid-cols-3">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="connections">Connections</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account information and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src="/placeholder.svg?height=64&width=64" alt="Profile" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm">
                      Change avatar
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" defaultValue="Juan Doe" />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="juan@example.com" />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" defaultValue="juandoe" />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="connections" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Social Connections</CardTitle>
                <CardDescription>Connect your social media accounts to schedule and publish content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                        <Instagram className="h-5 w-5 text-pink-500" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">Instagram</h3>
                        <p className="text-xs text-gray-500">Not connected</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Connect
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Facebook className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">Facebook</h3>
                        <p className="text-xs text-gray-500">Not connected</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Connect
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Twitter className="h-5 w-5 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">Twitter</h3>
                        <p className="text-xs text-gray-500">Not connected</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Connect
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Linkedin className="h-5 w-5 text-blue-700" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">LinkedIn</h3>
                        <p className="text-xs text-gray-500">Not connected</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Connect
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                        <Youtube className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">YouTube</h3>
                        <p className="text-xs text-gray-500">Not connected</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Connect
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add another account
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>Customize your experience and notification settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Notifications</h3>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email notifications</Label>
                      <p className="text-xs text-gray-500">Receive email notifications about your scheduled posts</p>
                    </div>
                    <Switch id="email-notifications" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="post-reminders">Post reminders</Label>
                      <p className="text-xs text-gray-500">Get reminders before your scheduled posts go live</p>
                    </div>
                    <Switch id="post-reminders" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="analytics-reports">Analytics reports</Label>
                      <p className="text-xs text-gray-500">Receive weekly analytics reports for your accounts</p>
                    </div>
                    <Switch id="analytics-reports" />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Appearance</h3>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="dark-mode">Dark mode</Label>
                      <p className="text-xs text-gray-500">Switch between light and dark mode</p>
                    </div>
                    <Switch id="dark-mode" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="compact-view">Compact view</Label>
                      <p className="text-xs text-gray-500">Use a more compact layout for the calendar</p>
                    </div>
                    <Switch id="compact-view" />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save preferences</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

