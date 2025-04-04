"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
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
  Loader2,
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
import { InstagramAccountSelector } from "@/components/InstagramAccountSelector"
import { useInstagramAccount } from "@/app/contexts/InstagramAccountContext"

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
  const router = useRouter()

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(`Navigating to edit page for post ID: ${post.id}`);
    router.push(`/edit/${post.id}`);
  };

  // Ensure post data is valid
  const safePost = {
    ...post,
    username: post.username || "user",
    caption: post.caption || "",
    image: post.image || "/placeholder.svg",
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners} 
      className={`mb-6 cursor-move ${isDragging ? 'ring-2 ring-blue-500 rounded-lg' : ''}`}
    >
      <div className="relative">
        <PostPreview 
          username={safePost.username} 
          caption={safePost.caption} 
          imageUrl={safePost.image} 
        />
        <div className="absolute top-2 right-2 z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-white/80 hover:bg-white rounded-full">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEditClick}>
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Post
              </DropdownMenuItem>
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
        <span>{safePost.date}</span>
        <div className="flex items-center">
          {safePost.platform === "instagram" && <Instagram className="h-3 w-3 mr-1" />}
          {safePost.platform === "facebook" && <Facebook className="h-3 w-3 mr-1" />}
          {safePost.platform === "twitter" && <Twitter className="h-3 w-3 mr-1" />}
          <span className="text-xs">{safePost.platform ? safePost.platform.charAt(0).toUpperCase() + safePost.platform.slice(1) : "Instagram"}</span>
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
    console.log(`Navigating to edit page for post ID: ${post.id}`);
    router.push(`/edit/${post.id}`);
  };

  // Ensure post data is valid
  const safePost = {
    ...post,
    username: post.username || "user",
    caption: post.caption || "",
    image: post.image || "/placeholder.svg",
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`relative aspect-[4/5] group ${isDragging ? 'ring-2 ring-blue-500 z-10 p-4' : ''}`}
    >
      <div {...attributes} {...listeners} className="absolute inset-0 cursor-move" />
      <Image
        src={safePost.image}
        alt={safePost.caption}
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
  const { activeAccount } = useInstagramAccount()
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid")
  const [posts, setPosts] = useState<Post[]>([])
  const [activeId, setActiveId] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingOverAdd, setIsDraggingOverAdd] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  // Fetch posts when component mounts or activeAccount changes
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        // Filter posts by active account
        const filteredPosts = data.filter((post: Post) => post.username === activeAccount.username);
        setPosts(filteredPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, [activeAccount]);

  const router = useRouter()

  // Set up sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  // --- New Handlers for Quick Add ---

  // Handles the actual file processing and post creation
  const handleQuickCreatePost = async (file: File) => {
    if (!file || !file.type.startsWith('image/')) {
      toast({
        title: "Invalid file",
        description: "Please select or drop an image file.",
        variant: "destructive",
      });
      // Reset drag state just in case
      setIsDraggingOverAdd(false);
      return;
    }
    setIsDraggingOverAdd(false); // Reset drag state
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // 1. Upload the image
      const formData = new FormData();
      formData.append('file', file);
      console.log("Uploading file:", file.name); // Debug log
      
      // Simulate progress for upload
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);
      
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.text(); // Get more error details
        console.error("Upload failed:", errorData);
        throw new Error('Failed to upload image');
      }
      const uploadData = await uploadResponse.json();
       // Ensure the filename is correctly accessed, adjust if API returns different structure
      const imageUrl = uploadData.filename || uploadData.url || uploadData.fileUrl;
      console.log("Image uploaded:", imageUrl); // Debug log

      if (!imageUrl) {
         console.error("Upload response did not contain a valid image URL/filename:", uploadData);
         throw new Error("Image URL not found in upload response.")
      }

      // 2. Create the post object (assuming API assigns ID)
      const newPostData = {
        username: activeAccount.username,
        caption: "created automatically",
        image: imageUrl,
        likes: 0,
        comments: 0,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        platform: "instagram",
      };
      console.log("Creating post with data:", newPostData); // Debug log

      // 3. Save the post via API
      const postResponse = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPostData),
      });

      if (!postResponse.ok) {
        const errorData = await postResponse.text(); // Get more error details
        console.error("Post creation failed:", errorData);
        throw new Error('Failed to create post');
      }
      const createdPost = await postResponse.json(); // Assuming API returns the created post with ID
      console.log("Post created:", createdPost); // Debug log

      // Ensure the created post has all required fields
      const safeCreatedPost = {
        ...createdPost,
        username: createdPost.username || activeAccount.username,
        caption: createdPost.caption || "created automatically",
        image: createdPost.image || imageUrl,
        platform: createdPost.platform || "instagram",
      };

      // 4. Update state - add to the beginning of the list
      setPosts(prevPosts => [safeCreatedPost, ...prevPosts]);
      
      // Show success toast
      toast({
        title: "Post created",
        description: "Your post has been successfully created.",
      });

    } catch (error) {
      console.error('Error creating quick post:', error);
      toast({
        title: "Error creating post",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      // Reset file input value in case it was triggered by click
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      // Reset upload state after a short delay to show 100% completion
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
    }
  };

  // Triggers hidden file input click
  const handleQuickAddClick = () => {
    fileInputRef.current?.click();
  };

  // Handles file selection from the hidden input
  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleQuickCreatePost(file);
    }
  };

  // --- Drag and Drop Handlers for the Add Button ---
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault(); // Necessary to allow dropping
    setIsDraggingOverAdd(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDraggingOverAdd(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDraggingOverAdd(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      handleQuickCreatePost(file);
    } else {
       console.log("No file dropped or file type not supported."); // Debug log
    }
  };

  // --- End New Handlers ---

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center">
          <Link href="/" className="mr-4">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-medium text-gray-900">Feed</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept="image/*"
          style={{ display: 'none' }}
        />

        <Card className="overflow-hidden border-0 shadow-lg rounded-xl">
          {/* Phone mockup header */}
          <div className="bg-white p-4 flex items-center justify-between border-b">
            <InstagramAccountSelector />

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
              {viewMode === "list" ? (
                <div className="p-4">
                  {isUploading && (
                    <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          <span className="text-sm font-medium">Uploading post...</span>
                        </div>
                        <span className="text-xs text-gray-500">{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="h-2" />
                    </div>
                  )}
                  
                  {filteredPosts.length > 0 ? (
                    <DndContext 
                      sensors={sensors} 
                      collisionDetection={closestCenter} 
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                    >
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
                </div>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                >
                  <div className="grid grid-cols-3 gap-[1px] bg-gray-200">
                    {/* Add Post Button/Drop Zone */}
                    <div
                      className={`relative aspect-[4/5] flex items-center justify-center bg-slate-100 hover:bg-slate-200 cursor-pointer ${isDraggingOverAdd ? 'ring-2 ring-blue-500 ring-inset' : ''}`}
                      onClick={handleQuickAddClick}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      {isUploading ? (
                        <div className="flex flex-col items-center justify-center p-4">
                          <Loader2 className="h-8 w-8 text-slate-400 animate-spin mb-2" />
                          <span className="text-xs text-slate-500">Uploading...</span>
                          <Progress value={uploadProgress} className="h-1 w-full mt-2" />
                        </div>
                      ) : (
                        <>
                          <Plus className="h-12 w-12 text-slate-400" />
                          <span className="absolute bottom-2 text-xs text-slate-500">Add Post</span>
                        </>
                      )}
                    </div>

                    {/* Existing Sortable Posts */}
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
                    {/* Drag Overlay remains the same */}
                    <DragOverlay>
                      {activeId ? (
                        <SortableGridItem
                          post={filteredPosts.find(p => p.id === activeId)!}
                          isDragging={true}
                        />
                      ) : null}
                    </DragOverlay>
                  </div>
                </DndContext>
              )}
              {/* Display message if grid is empty except for add button */}
              {viewMode === 'grid' && filteredPosts.length === 0 && (
                 <div className="text-center py-12 p-4 col-span-3">
                   <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
                   <p className="text-gray-500 mb-6">Click or drag an image to the '+' to add your first post.</p>
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

