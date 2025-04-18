"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { v4 as uuidv4 } from 'uuid'
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
  Upload,
  X,
  Pencil,
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
import { cn } from "@/lib/utils"

// Define the Post type to match both the UI needs and database structure
interface Post {
  id: number | string
  username?: string
  caption?: string
  image?: string
  likes?: number
  comments?: number
  date?: string
  platform?: string
  
  // Database fields
  user_id?: string
  title?: string
  content?: string
  status?: string
  created_at?: string
  updated_at?: string
  
  // Joined data
  profiles?: {
    id: string
    username: string
    full_name: string
    avatar_url?: string
  }
  media?: {
    id: string
    post_id: string
    url: string
    type: string
  }[]
}

// Sortable Post Item component
function SortablePostItem({ post, isDragging, onDelete, onEdit }: {
  post: Post;
  isDragging?: boolean;
  onDelete: (id: string | number) => void;
  onEdit: (id: string | number) => void;
}) {
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
    onEdit(post.id); // Use the passed handler
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(post.id); // Use the passed handler
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
        {/* Edit Button (Top Left) */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 left-2 z-10 h-8 w-8 p-0 bg-white/80 hover:bg-white rounded-full shadow-sm"
          onClick={handleEditClick}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        {/* Delete Button (Top Right) */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 z-10 h-8 w-8 p-0 bg-white/80 hover:bg-red-100 text-red-500 rounded-full shadow-sm"
          onClick={handleDeleteClick}
        >
          <X className="h-4 w-4" />
        </Button>
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
function SortableGridItem({ post, isDragging, onDelete, onEdit }: {
  post: Post;
  isDragging?: boolean;
  onDelete: (id: string | number) => void;
  onEdit: (id: string | number) => void;
}) {
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
    onEdit(post.id); // Use the passed handler
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(post.id); // Use the passed handler
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
      {/* Edit Button (Top Left) */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-2 left-2 z-20 h-8 w-8 p-0 bg-white/80 hover:bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        onClick={handleEditClick}
      >
        <Pencil className="h-4 w-4" />
      </Button>
      {/* Delete Button (Top Right) */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2 z-20 h-8 w-8 p-0 bg-white/80 hover:bg-red-100 text-red-500 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        onClick={handleDeleteClick}
      >
        <X className="h-4 w-4" />
      </Button>
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
  const { toast } = useToast()

  // Fetch posts when component mounts or activeAccount changes
  useEffect(() => {
    if (!activeAccount) return; // Skip if no active account
    
    const fetchPosts = async () => {
      try {
        // Get posts with profiles and media
        const response = await fetch('/api/posts');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        
        // For debugging
        console.log("Raw posts data:", data);
        
        // Filter posts by active account username
        const filteredPosts = data.filter((post: Post) => 
          post.profiles?.username === activeAccount.username
        );
        
        console.log("Filtered posts:", filteredPosts);
        
        // For each post that doesn't have media info, fetch it separately
        const enhancedPosts = await Promise.all(filteredPosts.map(async (post: Post) => {
          let postMedia = post.media;
          
          // If we don't have media info, fetch it for this post
          if (!postMedia || postMedia.length === 0) {
            try {
              const mediaResponse = await fetch(`/api/media?post_id=${post.id}`);
              if (mediaResponse.ok) {
                const mediaData = await mediaResponse.json();
                if (mediaData && mediaData.length > 0) {
                  postMedia = mediaData;
                  console.log(`Found ${mediaData.length} media items for post ${post.id}`);
                }
              }
            } catch (mediaError) {
              console.error("Error fetching media for post:", post.id, mediaError);
            }
          }
          
          // Transform each post to have UI-friendly fields
          const uiPost = {
            ...post,
            id: post.id,
            username: post.profiles?.username || activeAccount.username,
            caption: post.title || '',
            // Use media URL if available, otherwise empty string
            image: postMedia && postMedia.length > 0 ? postMedia[0].url : '',
            platform: 'instagram',
            likes: 0,
            comments: 0,
            date: new Date(post.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            media: postMedia  // Keep the full media array for reference
          };
          return uiPost;
        }));
        
        console.log("Enhanced posts with media:", enhancedPosts);

        // Set posts directly from enhancedPosts - backend now handles sorting
        setPosts(enhancedPosts);
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
    if (!activeAccount) {
      toast({
        title: "No active account",
        description: "Please select an Instagram account first.",
        variant: "destructive",
      });
      return;
    }

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

      // 2. Look for an existing profile or create a new one for the post
      // First check if a profile exists for the username
      let userId;
      
      try {
        // Try to fetch an existing profile first
        const username = activeAccount?.username || 'test_user';
        const profilesResponse = await fetch(`/api/profiles?username=${username}`);
        
        if (profilesResponse.ok) {
          const profilesData = await profilesResponse.json();
          
          if (profilesData && profilesData.length > 0) {
            // Use existing profile's ID
            userId = profilesData[0].id;
            console.log("Using existing profile with ID:", userId);
          } else {
            // No existing profile found, create a new one
            const testUserId = uuidv4();
            
            const createProfileResponse = await fetch('/api/profiles', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                id: testUserId,
                username: username,
                full_name: activeAccount?.displayName || 'Test User',
                avatar_url: null
              })
            });
            
            if (createProfileResponse.ok) {
              const profileData = await createProfileResponse.json();
              userId = profileData.id;
              console.log("Created new profile with ID:", userId);
            } else {
              throw new Error("Failed to create profile");
            }
          }
        } else {
          throw new Error("Failed to fetch profiles");
        }
      } catch (error) {
        console.error("Profile handling error:", error);
        throw new Error("Failed to handle user profile for post creation");
      }
      
      // Generate a unique post ID
      const postId = uuidv4();
      
      // 3. Create the post object
      const newPostData = {
        id: postId,
        user_id: userId, // Use the profile ID we found or created
        title: "created automatically", // Title field
        content: "Post created from feed page", // Content field
        status: "published"
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

      // 3. Create media record to link the image with the post
      const mediaResponse = await fetch('/api/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post_id: postId, // Link to the post
          url: imageUrl,
          type: file.type,
        }),
      });

      if (!mediaResponse.ok) {
        const errorData = await mediaResponse.text();
        console.error("Media record creation failed:", errorData);
        throw new Error('Failed to create media record');
      }
      
      const mediaData = await mediaResponse.json();
      console.log("Media record created:", mediaData);
      
      // 4. Ensure the created post has all required fields and adapt it to the UI expected format
      // For newly created posts, we set the media manually for immediate display
      const safeCreatedPost = {
        ...createdPost,
        id: createdPost.id, 
        username: activeAccount?.username || 'anonymous', // UI display username with fallback
        caption: createdPost.title || "created automatically",
        image: imageUrl, // Use the uploaded image URL for immediate display
        date: new Date(createdPost.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        platform: "instagram",
        likes: 0,
        comments: 0,
        // Also include the media object to match the database structure
        media: [{
          id: mediaData.id,
          post_id: postId,
          url: imageUrl,
          type: file.type
        }]
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
    console.log("handleDragEnd triggered");
    setActiveId(null)
    const { active, over } = event

    if (over && active.id !== over.id) {
      console.log(`Dragging item ${active.id} over ${over.id}`);
      // No outer orderedIds variable needed

      setPosts((items) => {
        console.log("setPosts callback started");
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)

        // Generate the newly ordered list for UI update
        const newItems = arrayMove(items, oldIndex, newIndex)
        
        // Extract the IDs *from the new list*
        const currentOrderedIds = newItems.map(item => item.id);
        console.log("Inside setPosts - currentOrderedIds:", currentOrderedIds);

        // --- Call the API to save the order *from inside the callback* ---
        if (currentOrderedIds.length > 0) {
           console.log("Calling savePostOrder from within setPosts...");
           savePostOrder(currentOrderedIds).catch(error => {
             console.error("Failed to save post order to backend:", error);
             toast({
               title: "Error Saving Order",
               description: "Could not save the new post order. It might be lost on refresh.",
               variant: "destructive",
             });
           });
        } else {
           console.error("Cannot save order: currentOrderedIds array is empty inside setPosts.");
        }
        // ------------------------------------------------------------

        // Return the new state for the immediate UI update
        return newItems
      })

      // Ensure the code that referenced the old outer orderedIds variable is removed
    }
  }

  // --- Add the API calling function --- 
  async function savePostOrder(orderedIds: (string | number)[]) {
    console.log("savePostOrder function called with IDs:", orderedIds); // Log function entry
    try {
      const response = await fetch('/api/posts/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderedIds }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save post order');
      }

      const result = await response.json();
      console.log('Post order saved successfully:', result.message);
      // Optional: Show a success toast if desired
      // toast({ title: "Order Saved", description: "Post order updated." });

    } catch (error) {
      // Error is logged and handled by the caller in handleDragEnd
      throw error; 
    }
  }
  // ------------------------------------

  // Handle edit post
  const handleEditPost = (id: number | string) => {
    router.push(`/edit/${id}`)
  }

  // Handle delete post
  const handleDeletePost = async (id: number | string) => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return; // Cancelled by user
    }

    try {
      const response = await fetch(`/api/posts?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Delete failed:", errorData);
        throw new Error('Failed to delete post');
      }

      // Remove post from local state
      setPosts(currentPosts => currentPosts.filter(post => post.id !== id));
      
      toast({
        title: "Post Deleted",
        description: "The post has been successfully deleted.",
      });

    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        title: "Error Deleting Post",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
        variant: "destructive",
      });
    }
  };

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
                            onDelete={handleDeletePost}
                            onEdit={handleEditPost}
                          />
                        ))}
                      </SortableContext>
                      <DragOverlay>
                        {activeId ? (
                          <SortablePostItem 
                            post={filteredPosts.find(p => p.id === activeId)!} 
                            isDragging={true}
                            onDelete={handleDeletePost}
                            onEdit={handleEditPost}
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
                          onDelete={handleDeletePost}
                          onEdit={handleEditPost}
                        />
                      ))}
                    </SortableContext>
                    {/* Drag Overlay remains the same */}
                    <DragOverlay>
                      {activeId ? (
                        <SortableGridItem
                          post={filteredPosts.find(p => p.id === activeId)!}
                          isDragging={true}
                          onDelete={handleDeletePost}
                          onEdit={handleEditPost}
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
