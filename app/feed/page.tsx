"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  ChevronLeft,
  ChevronDown,
  Edit2,
  MoreHorizontal,
  Plus,
  Instagram,
  Facebook,
  Twitter,
  Grid,
  List,
} from "lucide-react"
import { PostPreview } from "@/components/post-preview"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useRouter } from "next/navigation"

// Define the Post type
interface Post {
  id: number
  username: string
  caption: string
  image: string
  likes: number
  comments: number
  date: string
  platform: string
}

// Sortable Post Item component
function SortablePostItem({ post }: { post: Post }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: post.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="mb-6 cursor-move">
      <div className="relative">
        <PostPreview username={post.username} caption={post.caption} imageUrl={post.image} />
        <div className="absolute top-2 right-2 z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-white/80 hover:bg-white rounded-full">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Link href={`/edit/${post.id}`}>
                <DropdownMenuItem>
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit Post
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem>
                <Instagram className="h-4 w-4 mr-2" />
                Post Now
              </DropdownMenuItem>
              <DropdownMenuItem>Schedule Post</DropdownMenuItem>
              <DropdownMenuItem className="text-red-500">Delete Post</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="mt-2 flex justify-between items-center text-sm text-gray-500">
        <span>{post.date}</span>
        <div className="flex items-center">
          {post.platform === "instagram" && <Instagram className="h-3 w-3 mr-1" />}
          {post.platform === "facebook" && <Facebook className="h-3 w-3 mr-1" />}
          {post.platform === "twitter" && <Twitter className="h-3 w-3 mr-1" />}
          <span className="text-xs">{post.platform.charAt(0).toUpperCase() + post.platform.slice(1)}</span>
        </div>
      </div>
    </div>
  )
}

// Grid Item component
function GridItem({ post, onEdit }: { post: Post; onEdit: (id: number) => void }) {
  return (
    <div className="relative aspect-square group">
      <Image
        src={post.image || "/placeholder.svg"}
        alt={post.caption}
        width={400}
        height={400}
        className="object-cover w-full h-full"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 bg-white/80 hover:bg-white rounded-full"
          onClick={() => onEdit(post.id)}
        >
          <Edit2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export default function FeedPage() {
  const [activeTab, setActiveTab] = useState("posts")
  const [activeAccount, setActiveAccount] = useState("@JUAN")
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      username: "juan",
      caption:
        "Friday, Oct. 15th, 2023 - Global Data Shopping Festival - Celebrate the world's biggest shopping day with our exclusive deals! #GlobalShopping #Deals",
      image: "/placeholder.svg?height=400&width=400",
      likes: 245,
      comments: 32,
      date: "Oct 15",
      platform: "instagram",
    },
    {
      id: 2,
      username: "juan",
      caption: "New product launch coming soon! Stay tuned for updates.",
      image: "/placeholder.svg?height=400&width=400",
      likes: 189,
      comments: 24,
      date: "Oct 18",
      platform: "facebook",
    },
    {
      id: 3,
      username: "juan",
      caption: "Exploring hidden gems in the city. What's your favorite spot?",
      image: "/placeholder.svg?height=400&width=400",
      likes: 312,
      comments: 45,
      date: "Oct 20",
      platform: "instagram",
    },
    {
      id: 4,
      username: "juan",
      caption: "Homemade pasta night! Recipe in bio.",
      image: "/placeholder.svg?height=400&width=400",
      likes: 278,
      comments: 36,
      date: "Oct 25",
      platform: "instagram",
    },
    {
      id: 5,
      username: "juan",
      caption: "Art is the chronicle of our time.",
      image: "/placeholder.svg?height=400&width=400",
      likes: 345,
      comments: 42,
      date: "Oct 27",
      platform: "instagram",
    },
    {
      id: 6,
      username: "juan",
      caption: "Exhibitions - Madrid Art Week",
      image: "/placeholder.svg?height=400&width=400",
      likes: 289,
      comments: 31,
      date: "Oct 30",
      platform: "instagram",
    },
    {
      id: 7,
      username: "juan",
      caption: "New Publication",
      image: "/placeholder.svg?height=400&width=400",
      likes: 198,
      comments: 24,
      date: "Nov 2",
      platform: "instagram",
    },
    {
      id: 8,
      username: "juan",
      caption: "Artist Series",
      image: "/placeholder.svg?height=400&width=400",
      likes: 267,
      comments: 29,
      date: "Nov 5",
      platform: "instagram",
    },
    {
      id: 9,
      username: "juan",
      caption: "Contracts",
      image: "/placeholder.svg?height=400&width=400",
      likes: 176,
      comments: 18,
      date: "Nov 8",
      platform: "instagram",
    },
  ])

  const router = useRouter()

  // Set up sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  // Handle drag end event
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setPosts((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)

        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  // Handle edit post
  const handleEditPost = (id: number) => {
    router.push(`/edit/${id}`)
  }

  // Filter posts based on active tab
  const filteredPosts = posts.filter((post) => {
    if (activeTab === "posts") return true
    if (activeTab === "reels") return false // No reels in mock data
    if (activeTab === "saved") return false // No saved in mock data
    if (activeTab === "tagged") return false // No tagged in mock data
    return true
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="mr-4">
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-lg font-medium text-gray-900">Feed</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex border rounded-md overflow-hidden">
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                className="rounded-none"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                className="rounded-none"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
            </div>
            <Link href="/create">
              <Button variant="default" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create Post
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        <Card className="overflow-hidden border-0 shadow-lg rounded-xl">
          {/* Phone mockup header */}
          <div className="bg-white p-4 flex items-center justify-between border-b">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-0 h-auto font-bold text-blue-600 flex items-center">
                  {activeAccount}
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setActiveAccount("@JUAN")}>@JUAN</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveAccount("@BUSINESS")}>@BUSINESS</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveAccount("@TRAVEL")}>@TRAVEL</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3 16V8C3 5.23858 5.23858 3 8 3H16C18.7614 3 21 5.23858 21 8V16C21 18.7614 18.7614 21 16 21H8C5.23858 21 3 18.7614 3 16Z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M17.5 6.51L17.51 6.49889"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="posts" onValueChange={setActiveTab}>
            <TabsList className="w-full bg-white border-b h-auto p-0 rounded-none">
              <TabsTrigger
                value="posts"
                className="flex-1 uppercase text-xs py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:shadow-none"
              >
                Posts
              </TabsTrigger>
              <TabsTrigger
                value="reels"
                className="flex-1 uppercase text-xs py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:shadow-none"
              >
                Reels
              </TabsTrigger>
              <TabsTrigger
                value="saved"
                className="flex-1 uppercase text-xs py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:shadow-none"
              >
                Saved
              </TabsTrigger>
              <TabsTrigger
                value="tagged"
                className="flex-1 uppercase text-xs py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:shadow-none"
              >
                Tagged
              </TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="m-0 p-0 bg-gray-50">
              {filteredPosts.length > 0 ? (
                viewMode === "list" ? (
                  <div className="p-4">
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                      <SortableContext
                        items={filteredPosts.map((post) => post.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        {filteredPosts.map((post) => (
                          <SortablePostItem key={post.id} post={post} />
                        ))}
                      </SortableContext>
                    </DndContext>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-[1px] bg-gray-200">
                    {filteredPosts.map((post) => (
                      <GridItem key={post.id} post={post} onEdit={(id) => router.push(`/edit/${id}`)} />
                    ))}
                  </div>
                )
              ) : (
                <div className="text-center py-12 p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
                  <p className="text-gray-500 mb-6">Create your first post to see it here.</p>
                  <Link href="/create">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create a new post
                    </Button>
                  </Link>
                </div>
              )}
            </TabsContent>

            <TabsContent value="reels" className="m-0 p-4 bg-gray-50">
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No reels yet</h3>
                <p className="text-gray-500 mb-6">Create your first reel to see it here.</p>
                <Link href="/create">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create a new reel
                  </Button>
                </Link>
              </div>
            </TabsContent>

            <TabsContent value="saved" className="m-0 p-4 bg-gray-50">
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No saved posts</h3>
                <p className="text-gray-500 mb-6">Save posts to see them here.</p>
              </div>
            </TabsContent>

            <TabsContent value="tagged" className="m-0 p-4 bg-gray-50">
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tagged posts</h3>
                <p className="text-gray-500 mb-6">Posts you're tagged in will appear here.</p>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </main>
    </div>
  )
}

