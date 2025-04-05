"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ChevronLeft,
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
  Youtube,
  ImageIcon,
  Smile,
  AtSign,
  Hash,
  MapPin,
  Plus,
  Save,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { DragEndEvent } from '@dnd-kit/core';

interface SortableImageProps {
  image: string;
  isSelected: boolean;
  onClick: () => void;
  onDelete: () => void;
}

interface PostPageProps {
  mode: "create" | "edit";
  id?: number;
}

function SortableImage({ image, isSelected, onClick, onDelete }: SortableImageProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: image,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClick();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete();
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={`w-20 h-20 rounded-md overflow-hidden flex-shrink-0 group relative ${isSelected ? 'ring-2 ring-blue-500' : 'ring-1 ring-gray-200'}`}
    >
      <div className="w-full h-full relative">
        <Image
          src={image}
          alt={`Thumbnail`}
          width={80}
          height={80}
          className="object-cover h-full w-full"
        />
        <div 
          {...attributes} 
          {...listeners}
          className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors cursor-move"
        />
        <button
          type="button"
          onClick={handleClick}
          className="absolute inset-0 z-10"
        />
        <button
          type="button"
          onClick={handleDelete}
          className="absolute top-1 right-1 z-20 w-5 h-5 rounded-full bg-black/50 hover:bg-black/75 flex items-center justify-center group-hover:opacity-100 opacity-0 transition-opacity"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="12" 
            height="12" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="white" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function PostPage({ mode, id }: PostPageProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("post")
  const [caption, setCaption] = useState("")
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["instagram"])
  const [images, setImages] = useState<string[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [scheduleOption, setScheduleOption] = useState("draft")
  const [post, setPost] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  // Fetch post data if in edit mode
  useEffect(() => {
    if (mode === "edit" && id) {
      console.log(`Fetching post data for ID: ${id}`);
      
      const fetchPost = async () => {
        try {
          const response = await fetch('/api/posts');
          if (!response.ok) {
            throw new Error('Failed to fetch posts');
          }
          const posts = await response.json();
          console.log(`Fetched ${posts.length} posts`);
          
          const foundPost = posts.find((p: any) => p.id === id);
          console.log(`Found post:`, foundPost);
          
          if (foundPost) {
            setPost(foundPost);
            setCaption(foundPost.caption);
            setSelectedPlatforms(foundPost.platforms || [foundPost.platform]);
            if (foundPost.image) {
              setImages([foundPost.image]);
            }
          } else {
            console.error(`Post with ID ${id} not found`);
            router.push("/feed");
          }
        } catch (error) {
          console.error('Error fetching post:', error);
          router.push("/feed");
        }
      };

      fetchPost();
    }
  }, [mode, id, router]);

  // Fix the useEffect dependency array
  useEffect(() => {
    if (images.length === 0) {
      setCurrentImageIndex(0);
    } else if (currentImageIndex >= images.length) {
      setCurrentImageIndex(images.length - 1);
    }
  }, [images.length, currentImageIndex]);

  const handlePlatformToggle = (platform: string) => {
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(selectedPlatforms.filter((p) => p !== platform))
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform])
    }
  }

  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    // Limit to 10 images
    const remainingSlots = 10 - images.length
    const filesToProcess = Array.from(files).slice(0, remainingSlots)

    for (const file of filesToProcess) {
      if (!file.type.startsWith('image/')) {
        alert('Please select valid image files')
        continue
      }

      // Show preview immediately
      const reader = new FileReader()
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)

      // Upload file
      try {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.error || 'Error uploading file')
        }

        // Update the images with the uploaded file URL
        setImages(prev => {
          const newImages = [...prev]
          const index = newImages.length - 1
          newImages[index] = data.filename
          return newImages
        })
      } catch (error) {
        console.error('Error uploading file:', error)
        alert('Error uploading file. Please try again.')
      }
    }
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleSelectImage = (index: number) => {
    setCurrentImageIndex(index)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    console.log("DragEnd Event:", { activeId: active.id, overId: over?.id });

    if (over && active.id !== over.id) {
      // Find indices based on current state before update
      const oldIndex = images.findIndex(img => img === active.id);
      const newIndex = images.findIndex(img => img === over.id);
      console.log("Calculated Indices:", { oldIndex, newIndex });

      if (oldIndex === -1 || newIndex === -1) {
         console.warn("Could not find dragged items in state:", { activeId: active.id, overId: over.id });
         return; // Exit if indices aren't found
      }

      // Create the new array
      const newImagesArray = [...images];
      const [movedImage] = newImagesArray.splice(oldIndex, 1);
      newImagesArray.splice(newIndex, 0, movedImage);
      console.log("New Images Array:", newImagesArray);
      
      // Update the images state
      setImages(newImagesArray);

      // Update currentImageIndex based on the original move
      if (currentImageIndex === oldIndex) {
        console.log(`Updating currentImageIndex: ${currentImageIndex} -> ${newIndex}`);
        setCurrentImageIndex(newIndex);
      } else if (
        currentImageIndex > oldIndex && 
        currentImageIndex <= newIndex
      ) {
        console.log(`Updating currentImageIndex: ${currentImageIndex} -> ${currentImageIndex - 1}`);
        setCurrentImageIndex(prev => prev - 1);
      } else if (
        currentImageIndex < oldIndex && 
        currentImageIndex >= newIndex
      ) {
        console.log(`Updating currentImageIndex: ${currentImageIndex} -> ${currentImageIndex + 1}`);
        setCurrentImageIndex(prev => prev + 1);
      } else {
        console.log(`CurrentImageIndex (${currentImageIndex}) not affected by move (${oldIndex} -> ${newIndex})`);
      }
      // Otherwise, the selected index wasn't affected relative to the moved item
    } else {
      console.log("DragEnd ignored:", { overExists: !!over, idChanged: over ? active.id !== over.id : 'N/A' });
    }
  };

  const handleDeleteImage = (indexToDelete: number) => {
    setImages(prevImages => prevImages.filter((_, index) => index !== indexToDelete));
    if (currentImageIndex === indexToDelete) {
      setCurrentImageIndex(Math.max(0, indexToDelete - 1));
    } else if (currentImageIndex > indexToDelete) {
      setCurrentImageIndex(prev => prev - 1);
    }
  };

  const handleSave = async () => {
    try {
      if (!caption) {
        alert("Please add a caption");
        return;
      }

      if (selectedPlatforms.length === 0) {
        alert("Please select at least one platform");
        return;
      }

      if (images.length === 0) {
        alert("Please add at least one image");
        return;
      }

      const postData = {
        ...(post || {}),
        caption,
        platform: selectedPlatforms[0],
        platforms: selectedPlatforms,
        image: images[0],
        images: images,
      };

      // Ensure the post ID is included when updating
      if (mode === "edit" && id) {
        postData.id = id;
      }

      const method = mode === "edit" ? "PUT" : "POST";
      console.log(`Saving post with method ${method}:`, postData);
      
      const response = await fetch('/api/posts', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save post');
      }

      const savedPost = await response.json();
      console.log('Post saved successfully:', savedPost);
      
      alert(`Post ${mode === "edit" ? "updated" : "created"} successfully!`);
      router.push("/feed");
    } catch (error) {
      console.error('Error saving post:', error);
      alert(`Error ${mode === "edit" ? "updating" : "creating"} post: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleCancel = () => {
    if (confirm("Are you sure you want to discard your changes?")) {
      router.push("/feed")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center">
          <Link href="/feed" className="mr-4">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-medium text-gray-900">{mode === "edit" ? "Edit Post" : "Create Post"}</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left side - Post editor */}
          <div className="flex-1">
            <Card>
              <CardHeader className="border-b p-0">
                <Tabs defaultValue="post" className="w-full" onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="post">POST</TabsTrigger>
                    <TabsTrigger value="stories">STORIES</TabsTrigger>
                    <TabsTrigger value="reels">REELS</TabsTrigger>
                  </TabsList>

                  <TabsContent value="post" className="m-0 p-6">
                    {/* Platform selection */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      <Button
                        variant={selectedPlatforms.includes("instagram") ? "default" : "outline"}
                        size="sm"
                        className="rounded-full"
                        onClick={() => handlePlatformToggle("instagram")}
                      >
                        <Instagram className="h-4 w-4 mr-2" />
                        <span className="sr-only md:not-sr-only">Instagram</span>
                      </Button>
                      <Button
                        variant={selectedPlatforms.includes("facebook") ? "default" : "outline"}
                        size="sm"
                        className="rounded-full"
                        onClick={() => handlePlatformToggle("facebook")}
                      >
                        <Facebook className="h-4 w-4 mr-2" />
                        <span className="sr-only md:not-sr-only">Facebook</span>
                      </Button>
                      <Button
                        variant={selectedPlatforms.includes("linkedin") ? "default" : "outline"}
                        size="sm"
                        className="rounded-full"
                        onClick={() => handlePlatformToggle("linkedin")}
                      >
                        <Linkedin className="h-4 w-4 mr-2" />
                        <span className="sr-only md:not-sr-only">LinkedIn</span>
                      </Button>
                      <Button
                        variant={selectedPlatforms.includes("twitter") ? "default" : "outline"}
                        size="sm"
                        className="rounded-full"
                        onClick={() => handlePlatformToggle("twitter")}
                      >
                        <Twitter className="h-4 w-4 mr-2" />
                        <span className="sr-only md:not-sr-only">Twitter</span>
                      </Button>
                      <Button
                        variant={selectedPlatforms.includes("youtube") ? "default" : "outline"}
                        size="sm"
                        className="rounded-full"
                        onClick={() => handlePlatformToggle("youtube")}
                      >
                        <Youtube className="h-4 w-4 mr-2" />
                        <span className="sr-only md:not-sr-only">YouTube</span>
                      </Button>
                    </div>

                    {/* Media upload area */}
                    <div className="mb-6">
                      <div className="aspect-square bg-gray-100 rounded-md flex items-center justify-center overflow-hidden relative">
                        {images.length > 0 ? (
                          <Image
                            src={images[currentImageIndex]}
                            alt="Post preview"
                            width={600}
                            height={600}
                            className="object-cover"
                          />
                        ) : (
                          <div className="text-center p-4">
                            <ImageIcon className="h-12 w-12 mx-auto text-gray-400" />
                            <p className="mt-2 text-sm text-gray-500">Click to add images</p>
                          </div>
                        )}
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="absolute bottom-4 right-4"
                          onClick={handleImageClick}
                        >
                          <ImageIcon className="h-4 w-4 mr-2" />
                          {images.length > 0 ? "Change Image" : "Add Image"}
                        </Button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={handleImageSelect}
                        />
                      </div>
                    </div>

                    {/* Caption input */}
                    <div className="space-y-4">
                      <div className="relative">
                        <Textarea
                          placeholder="Write your caption here..."
                          className="min-h-[120px] resize-none"
                          value={caption}
                          onChange={(e) => setCaption(e.target.value)}
                        />
                        <div className="absolute bottom-2 right-2 flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <AtSign className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Hash className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Smile className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MapPin className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Add hashtags and mentions</span>
                        <span>{caption.length} / 2200</span>
                      </div>
                    </div>

                    {/* Media gallery */}
                    <div className="mt-6">
                      <h3 className="text-sm font-medium mb-2">Media</h3>
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                      >
                        <div className="flex gap-2 overflow-x-auto pb-2">
                          <SortableContext
                            items={images}
                            strategy={horizontalListSortingStrategy}
                          >
                            {images.map((image, index) => (
                              <SortableImage
                                key={image}
                                image={image}
                                isSelected={currentImageIndex === index}
                                onClick={() => handleSelectImage(index)}
                                onDelete={() => handleDeleteImage(index)}
                              />
                            ))}
                          </SortableContext>
                          {images.length < 10 && (
                            <Button
                              variant="outline"
                              className="w-20 h-20 flex-shrink-0"
                              onClick={handleImageClick}
                            >
                              <Plus className="h-5 w-5" />
                            </Button>
                          )}
                        </div>
                      </DndContext>
                    </div>
                  </TabsContent>

                  <TabsContent value="stories" className="m-0">
                    <div className="p-6 flex items-center justify-center h-[400px]">
                      <div className="text-center">
                        <h3 className="font-medium">Stories Creator</h3>
                        <p className="text-sm text-gray-500 mt-1">Create and schedule Instagram stories</p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="reels" className="m-0">
                    <div className="p-6 flex items-center justify-center h-[400px]">
                      <div className="text-center">
                        <h3 className="font-medium">Reels Creator</h3>
                        <p className="text-sm text-gray-500 mt-1">Create and schedule Instagram reels</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardHeader>

              <CardFooter className="border-t p-6">
                <div className="w-full">
                  <h3 className="text-sm font-medium mb-4">Schedule your post</h3>
                  <RadioGroup value={scheduleOption} onValueChange={setScheduleOption} className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="draft" id="draft" />
                      <Label htmlFor="draft">Save as draft</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="now" id="now" />
                      <Label htmlFor="now">Post now</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="schedule" id="schedule" />
                      <Label htmlFor="schedule">Custom time</Label>
                    </div>
                  </RadioGroup>

                  {scheduleOption === "schedule" && (
                    <div className="mt-4 flex gap-2">
                      <Input type="date" className="flex-1" />
                      <Input type="time" className="flex-1" />
                    </div>
                  )}
                </div>
              </CardFooter>
            </Card>
          </div>

          {/* Right side - Preview */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <Card>
              <CardHeader className="border-b py-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-gray-500">
                    {scheduleOption === "draft" ? "Draft" : scheduleOption === "now" ? "Ready to Post" : "Scheduled"}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        Strategy
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Best time to post</DropdownMenuItem>
                      <DropdownMenuItem>Engagement analysis</DropdownMenuItem>
                      <DropdownMenuItem>Hashtag suggestions</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <ScrollArea className="h-[500px]">
                  <div className="p-4">
                    <div className="rounded-lg overflow-hidden border border-gray-200 bg-white">
                      <div className="p-4">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="@username" />
                            <AvatarFallback>UN</AvatarFallback>
                          </Avatar>
                          <div className="ml-2">
                            <h4 className="text-sm font-medium">@USERNAME</h4>
                          </div>
                        </div>
                      </div>

                      <div className="aspect-square bg-gray-100">
                        {images.length > 0 ? (
                          <Image
                            src={images[currentImageIndex]}
                            alt="Post preview"
                            width={400}
                            height={400}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                      </div>

                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Send className="h-4 w-4" />
                          </Button>
                          <div className="flex-1"></div>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Bookmark className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="text-sm">
                          {caption ? (
                            <p>{caption}</p>
                          ) : (
                            <p className="text-gray-500">Your caption will appear here...</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="text-sm font-medium mb-2">Account Preview</h4>
                      <div className="grid grid-cols-3 gap-1">
                        <div className="aspect-square bg-gray-100">
                          <Image
                            src="/placeholder.svg?height=100&width=100"
                            alt="Grid item"
                            width={100}
                            height={100}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="aspect-square bg-gray-100">
                          <Image
                            src="/placeholder.svg?height=100&width=100"
                            alt="Grid item"
                            width={100}
                            height={100}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        {images.length > 0 ? (
                          <div className="aspect-square bg-gray-100">
                            <Image
                              src={images[0]}
                              alt="Grid item"
                              width={100}
                              height={100}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        ) : (
                          <div className="aspect-square bg-gray-100 flex items-center justify-center">
                            <ImageIcon className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="default" onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            {mode === "edit" ? "SAVE CHANGES" : "CREATE POST"}
          </Button>
        </div>
      </footer>
    </div>
  )
} 