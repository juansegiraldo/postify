"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ChevronLeft,
  TrendingUp,
  Users,
  Heart,
  MessageSquare,
  BarChart2,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react"

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("last30")

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center">
          <Link href="/" className="mr-4">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-medium text-gray-900">Analytics</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <Tabs defaultValue="overview" className="w-full md:w-auto">
            <TabsList className="grid w-full md:w-[400px] grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="engagement">Engagement</TabsTrigger>
              <TabsTrigger value="audience">Audience</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Select defaultValue="all">
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Platform" />
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

            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last7">Last 7 days</SelectItem>
                <SelectItem value="last30">Last 30 days</SelectItem>
                <SelectItem value="last90">Last 90 days</SelectItem>
                <SelectItem value="custom">Custom range</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Followers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12,546</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                <span className="text-green-500 font-medium">+2.5%</span> from last period
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3.2%</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                <span className="text-green-500 font-medium">+0.8%</span> from last period
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8,642</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                <span className="text-green-500 font-medium">+5.3%</span> from last period
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,253</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                <span className="text-green-500 font-medium">+1.2%</span> from last period
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Engagement Over Time</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <div className="text-center">
                <BarChart2 className="h-16 w-16 text-gray-300 mx-auto" />
                <p className="text-sm text-gray-500 mt-4">Connect your social accounts to see engagement analytics</p>
                <Button variant="outline" size="sm" className="mt-4">
                  Connect Accounts
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Performing Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                    <Instagram className="h-6 w-6 text-gray-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Product Launch Post</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center text-xs text-gray-500">
                        <Heart className="h-3 w-3 mr-1" />
                        <span>1.2k</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        <span>342</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                    <Facebook className="h-6 w-6 text-gray-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Behind the Scenes</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center text-xs text-gray-500">
                        <Heart className="h-3 w-3 mr-1" />
                        <span>856</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        <span>124</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                    <Twitter className="h-6 w-6 text-gray-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Industry News Update</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center text-xs text-gray-500">
                        <Heart className="h-3 w-3 mr-1" />
                        <span>532</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        <span>87</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

