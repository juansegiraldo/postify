"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Plus, Instagram, Facebook, Twitter } from "lucide-react"

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState("March 2025")
  const [view, setView] = useState("month")

  // Mock data for calendar posts
  const scheduledPosts = [
    { id: 1, date: "2025-03-15", time: "09:00", platform: "instagram", image: "/placeholder.svg?height=100&width=100" },
    { id: 2, date: "2025-03-18", time: "12:30", platform: "facebook", image: "/placeholder.svg?height=100&width=100" },
    { id: 3, date: "2025-03-22", time: "15:45", platform: "twitter", image: "/placeholder.svg?height=100&width=100" },
    { id: 4, date: "2025-03-29", time: "18:00", platform: "instagram", image: "/placeholder.svg?height=100&width=100" },
  ]

  // Generate calendar days
  const generateCalendarDays = () => {
    // This is a simplified version - in a real app, you'd use a date library
    const days = []
    const daysInMonth = 31 // Simplified for March

    // Add empty cells for days before the 1st of the month
    // For March 2025, the 1st is a Saturday (index 6)
    for (let i = 0; i < 6; i++) {
      days.push({ day: null, isCurrentMonth: false })
    }

    // Add days of the current month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = `2025-03-${i.toString().padStart(2, "0")}`
      const postsForDay = scheduledPosts.filter((post) => post.date === date)
      days.push({
        day: i,
        isCurrentMonth: true,
        posts: postsForDay,
      })
    }

    return days
  }

  const calendarDays = generateCalendarDays()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="mr-4">
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-lg font-medium text-gray-900">Content Calendar</h1>
          </div>
          <Button variant="default" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Create Post
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card>
          <CardHeader className="border-b">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center">
                <Button variant="ghost" size="sm">
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <h2 className="text-lg font-medium px-2">{currentMonth}</h2>
                <Button variant="ghost" size="sm">
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Tabs defaultValue="month" className="w-[300px]" onValueChange={setView}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="month">Month</TabsTrigger>
                    <TabsTrigger value="week">Week</TabsTrigger>
                    <TabsTrigger value="day">Day</TabsTrigger>
                  </TabsList>
                </Tabs>

                <Select defaultValue="all">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All platforms</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="twitter">Twitter</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {view === "month" && (
              <div className="grid grid-cols-7 border-b">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => (
                  <div key={i} className="p-2 text-center text-sm font-medium text-gray-500 border-r last:border-r-0">
                    {day}
                  </div>
                ))}
              </div>
            )}

            {view === "month" && (
              <div className="grid grid-cols-7 auto-rows-fr">
                {calendarDays.map((day, i) => (
                  <div
                    key={i}
                    className={`min-h-[120px] p-2 border-r border-b last:border-r-0 ${
                      !day.isCurrentMonth ? "bg-gray-50" : ""
                    }`}
                  >
                    {day.day && (
                      <>
                        <div className="flex justify-between items-start">
                          <span className={`text-sm font-medium ${day.day === 15 ? "text-primary" : ""}`}>
                            {day.day}
                          </span>
                          {day.posts && day.posts.length > 0 && (
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <Plus className="h-4 w-4" />
                            </Button>
                          )}
                        </div>

                        {day.posts &&
                          day.posts.map((post) => (
                            <div key={post.id} className="mt-2 group cursor-pointer">
                              <div className="flex items-center gap-1">
                                <div className="w-6 h-6 rounded-full flex items-center justify-center bg-gray-100">
                                  {post.platform === "instagram" && <Instagram className="h-3 w-3" />}
                                  {post.platform === "facebook" && <Facebook className="h-3 w-3" />}
                                  {post.platform === "twitter" && <Twitter className="h-3 w-3" />}
                                </div>
                                <span className="text-xs text-gray-500">{post.time}</span>
                              </div>
                              <div className="mt-1 rounded overflow-hidden">
                                <Image
                                  src={post.image || "/placeholder.svg"}
                                  alt="Post thumbnail"
                                  width={100}
                                  height={100}
                                  className="object-cover w-full h-12 group-hover:opacity-80 transition-opacity"
                                />
                              </div>
                            </div>
                          ))}
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}

            {view === "week" && (
              <div className="p-6 flex items-center justify-center h-[500px]">
                <div className="text-center">
                  <h3 className="font-medium">Week View</h3>
                  <p className="text-sm text-gray-500 mt-1">Weekly calendar view coming soon</p>
                </div>
              </div>
            )}

            {view === "day" && (
              <div className="p-6 flex items-center justify-center h-[500px]">
                <div className="text-center">
                  <h3 className="font-medium">Day View</h3>
                  <p className="text-sm text-gray-500 mt-1">Daily calendar view coming soon</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

