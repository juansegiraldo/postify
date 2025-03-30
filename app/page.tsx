import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Calendar, BarChart2, Settings, Plus, LayoutGrid } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-16 md:w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-primary hidden md:block">Postify</h1>
          <div className="flex items-center justify-center md:hidden">
            <span className="text-xl font-bold text-primary">P</span>
          </div>
        </div>
        <nav className="flex-1 p-2">
          <div className="space-y-1">
            <Link
              href="/"
              className="flex items-center px-2 py-2 text-sm font-medium rounded-md bg-primary/10 text-primary"
            >
              <Home className="mr-3 h-5 w-5" />
              <span className="hidden md:inline-block">Dashboard</span>
            </Link>
            <Link
              href="/create"
              className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-100"
            >
              <Plus className="mr-3 h-5 w-5" />
              <span className="hidden md:inline-block">Create</span>
            </Link>
            <Link
              href="/feed"
              className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-100"
            >
              <LayoutGrid className="mr-3 h-5 w-5" />
              <span className="hidden md:inline-block">Feed</span>
            </Link>
            <Link
              href="/analytics"
              className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-100"
            >
              <BarChart2 className="mr-3 h-5 w-5" />
              <span className="hidden md:inline-block">Analytics</span>
            </Link>
            <Link
              href="/settings"
              className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-100"
            >
              <Settings className="mr-3 h-5 w-5" />
              <span className="hidden md:inline-block">Settings</span>
            </Link>
          </div>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200"></div>
            <div className="ml-3 hidden md:block">
              <p className="text-sm font-medium text-gray-700">Your Account</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Dashboard</h2>
            <Link href="/create">
              <Button variant="default" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create Post
              </Button>
            </Link>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Recent posts */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Calendar className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Scheduled Posts</dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">12</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <Link href="/feed" className="font-medium text-primary hover:text-primary/80">
                      View feed
                    </Link>
                  </div>
                </div>
              </div>

              {/* Engagement */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <BarChart2 className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Engagement</dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">2,854</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <Link href="/analytics" className="font-medium text-primary hover:text-primary/80">
                      View analytics
                    </Link>
                  </div>
                </div>
              </div>

              {/* Quick actions */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
                  <div className="mt-4 space-y-2">
                    <Link href="/create">
                      <Button variant="outline" className="w-full justify-start">
                        <Plus className="h-4 w-4 mr-2" />
                        Create new post
                      </Button>
                    </Link>
                    <Link href="/feed">
                      <Button variant="outline" className="w-full justify-start">
                        <LayoutGrid className="h-4 w-4 mr-2" />
                        View feed
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

