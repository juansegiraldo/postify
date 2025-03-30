"use client"

import { useState, useEffect } from "react"
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
  DragOverlay,
  type DragStartEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  rectSortingStrategy,
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
function SortablePostItem({ post, isDragging }: { post: Post; isDragging?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: post.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners} 
      className={`mb-6 cursor-move ${isDragging ? 'ring-2 ring-blue-500 rounded-lg' : ''}`}
    >
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
function SortableGridItem({ post, isDragging }: { post: Post; isDragging?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: post.id })
  const router = useRouter()

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/edit/${post.id}`);
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`relative aspect-[4/5] group ${isDragging ? 'ring-2 ring-blue-500 z-10 p-4' : ''}`}
    >
      <div {...attributes} {...listeners} className="absolute inset-0 cursor-move" />
      <Image
        src={post.image || "/placeholder.svg"}
        alt={post.caption}
        width={400}
        height={500}
        className="object-cover w-full h-full"
      />
      <div className="absolute top-2 right-2 z-20">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 bg-white/80 hover:bg-white rounded-full shadow-sm"
          onClick={handleEditClick}
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
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid")
  const [posts, setPosts] = useState<Post[]>([])
  const [activeId, setActiveId] = useState<number | null>(null)

  // Fetch posts when component mounts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  const router = useRouter()

  // Set up sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  // Handle drag start event
  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as number)
  }

  // Handle drag end event
  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null)
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center w-full">
              <Link href="/" className="mr-4">
                <ChevronLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-lg font-medium text-gray-900">Feed</h1>
            </div>
            <div className="flex items-center gap-4">
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
                <DndContext 
                  sensors={sensors} 
                  collisionDetection={closestCenter} 
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                >
                  {viewMode === "list" ? (
                    <div className="p-4">
                      <SortableContext
                        items={filteredPosts.map((post) => post.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        {filteredPosts.map((post) => (
                          <SortablePostItem 
                            key={post.id} 
                            post={post} 
                            isDragging={activeId === post.id}
                          />
                        ))}
                      </SortableContext>
                      <DragOverlay>
                        {activeId ? (
                          <SortablePostItem 
                            post={filteredPosts.find(p => p.id === activeId)!} 
                            isDragging={true}
                          />
                        ) : null}
                      </DragOverlay>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-[1px] bg-gray-200">
                      <SortableContext
                        items={filteredPosts.map((post) => post.id)}
                        strategy={rectSortingStrategy}
                      >
                        {filteredPosts.map((post) => (
                          <SortableGridItem 
                            key={post.id} 
                            post={post}
                            isDragging={activeId === post.id}
                          />
                        ))}
                      </SortableContext>
                      <DragOverlay>
                        {activeId ? (
                          <SortableGridItem 
                            post={filteredPosts.find(p => p.id === activeId)!}
                            isDragging={true}
                          />
                        ) : null}
                      </DragOverlay>
                    </div>
                  )}
                </DndContext>
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

