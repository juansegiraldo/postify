"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
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
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

export default function CreatePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("post")
  const [caption, setCaption] = useState("")
  const [selectedPlatforms, setSelectedPlatforms] = useState(["instagram"])
  const [scheduleOption, setScheduleOption] = useState("draft")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePlatformToggle = (platform: string) => {
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(selectedPlatforms.filter((p) => p !== platform))
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform])
    }
  }

  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file')
        return
      }

      // Show preview immediately
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result as string)
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

        // Update the image with the uploaded file URL
        setSelectedImage(data.filename)
      } catch (error) {
        console.error('Error uploading file:', error)
        alert('Error uploading file. Please try again.')
      }
    }
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleSaveAsDraft = async () => {
    try {
      if (!selectedImage) {
        alert("Please select an image first");
        return;
      }

      if (!caption) {
        alert("Please add a caption");
        return;
      }

      if (selectedPlatforms.length === 0) {
        alert("Please select at least one platform");
        return;
      }

      // Create the post
      const postData = {
        username: "juan", // This would come from auth in a real app
        caption,
        image: selectedImage,
        platform: selectedPlatforms[0], // Use first selected platform as main
        platforms: selectedPlatforms,
      };

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error('Failed to save post');
      }

      alert("Post saved as draft!");
      router.push("/feed");
    } catch (error) {
      console.error('Error saving post:', error);
      alert("Error saving post. Please try again.");
    }
  };

  const handleCancel = () => {
    if (confirm("Are you sure you want to discard this post?")) {
      router.push("/feed")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center">
          <Link href="/" className="mr-4">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-medium text-gray-900">Create New Post</h1>
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
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageSelect}
                      />
                      <div 
                        className="aspect-square bg-gray-100 rounded-md flex items-center justify-center overflow-hidden relative cursor-pointer"
                        onClick={handleImageClick}
                      >
                        <Image
                          src={selectedImage || "/placeholder.svg?height=600&width=600"}
                          alt="Post preview"
                          width={600}
                          height={600}
                          className="object-cover"
                        />
                        <Button variant="secondary" size="sm" className="absolute bottom-4 right-4" onClick={(e) => {
                          e.stopPropagation()
                          handleImageClick()
                        }}>
                          <ImageIcon className="h-4 w-4 mr-2" />
                          {selectedImage ? 'Change Image' : 'Upload Image'}
                        </Button>
                      </div>
                    </div>

                    {/* Caption input */}
                    <div className="space-y-4">
                      <div className="relative">
                        <Textarea
                          placeholder="Hey Juan, craft your caption, or, press spacebar to launch AI Caption Generator"
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
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                          <Image
                            src="/placeholder.svg?height=64&width=64"
                            alt="Thumbnail"
                            width={64}
                            height={64}
                            className="object-cover h-full w-full"
                          />
                        </div>
                        <Button variant="outline" className="w-16 h-16 flex-shrink-0">
                          <Plus className="h-5 w-5" />
                        </Button>
                      </div>
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

              <CardContent className="p-0">
                {/* This section is now empty as we moved the TabsContent components inside the Tabs component */}
              </CardContent>

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

            <div className="mt-6">
              <Card>
                <CardHeader className="py-4">
                  <div className="flex items-center">
                    <h3 className="text-sm font-medium">Cross Post</h3>
                    <Badge variant="outline" className="ml-2">
                      Beta
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    Tweak one post for each social media platform. Update image ratios, edit captions and schedule it
                    across different platforms and different times.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right side - Preview */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <Card>
              <CardHeader className="border-b py-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-gray-500">
                    Unscheduled
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
                            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="@juan" />
                            <AvatarFallback>JN</AvatarFallback>
                          </Avatar>
                          <div className="ml-2">
                            <h4 className="text-sm font-medium">@JUAN</h4>
                          </div>
                        </div>
                      </div>

                      <div className="aspect-square bg-gray-100">
                        <Image
                          src="/placeholder.svg?height=400&width=400"
                          alt="Post preview"
                          width={400}
                          height={400}
                          className="object-cover w-full h-full"
                        />
                      </div>

                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-heart"
                            >
                              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                            </svg>
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-message-circle"
                            >
                              <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                            </svg>
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-send"
                            >
                              <path d="m22 2-7 20-4-9-9-4Z" />
                              <path d="M22 2 11 13" />
                            </svg>
                          </Button>
                          <div className="flex-1"></div>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-bookmark"
                            >
                              <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                            </svg>
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
                        <div className="aspect-square bg-gray-100">
                          <Image
                            src="/placeholder.svg?height=100&width=100"
                            alt="Grid item"
                            width={100}
                            height={100}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <p className="text-sm text-center text-gray-500">
                        Finish setting up your Plann account to reveal your own posts.
                      </p>
                      <div className="flex justify-center gap-2 mt-4">
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full">
                          <Instagram className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full">
                          <Facebook className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full">
                          <Twitter className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full">
                          <Linkedin className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full">
                          <Youtube className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="mt-4">
                        <Button variant="outline" size="sm" className="w-full">
                          CONNECT SOCIAL ACCOUNT
                        </Button>
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
          <Button variant="default" onClick={handleSaveAsDraft}>
            <Save className="h-4 w-4 mr-2" />
            SAVE AS DRAFT
          </Button>
        </div>
      </footer>
    </div>
  )
}

