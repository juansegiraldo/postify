"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
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

// Mock data for posts
const mockPosts = [
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
    platforms: ["instagram"],
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
    platforms: ["facebook"],
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
    platforms: ["instagram"],
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
    platforms: ["instagram"],
  },
]

export default function EditPostPage() {
  const router = useRouter()
  const params = useParams()
  const postId = Number(params.id)

  const [activeTab, setActiveTab] = useState("post")
  const [caption, setCaption] = useState("")
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [scheduleOption, setScheduleOption] = useState("draft")
  const [post, setPost] = useState<any>(null)

  // Fetch post data
  useEffect(() => {
    // In a real app, this would be an API call
    const foundPost = mockPosts.find((p) => p.id === postId)
    if (foundPost) {
      setPost(foundPost)
      setCaption(foundPost.caption)
      setSelectedPlatforms(foundPost.platforms)
    } else {
      // Post not found, redirect to feed
      router.push("/feed")
    }
  }, [postId, router])

  const handlePlatformToggle = (platform: string) => {
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(selectedPlatforms.filter((p) => p !== platform))
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform])
    }
  }

  const handleSaveChanges = () => {
    // In a real app, this would save the post to a database
    alert("Post updated successfully!")
    router.push("/feed")
  }

  const handleCancel = () => {
    if (confirm("Are you sure you want to discard your changes?")) {
      router.push("/feed")
    }
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading post...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center">
          <Link href="/feed" className="mr-4">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-medium text-gray-900">Edit Post</h1>
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
                        <Image
                          src={post.image || "/placeholder.svg"}
                          alt="Post preview"
                          width={600}
                          height={600}
                          className="object-cover"
                        />
                        <Button variant="secondary" size="sm" className="absolute bottom-4 right-4">
                          <ImageIcon className="h-4 w-4 mr-2" />
                          Change Image
                        </Button>
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
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                          <Image
                            src={post.image || "/placeholder.svg"}
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
                            <AvatarImage src="/placeholder.svg?height=32&width=32" alt={`@${post.username}`} />
                            <AvatarFallback>{post.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="ml-2">
                            <h4 className="text-sm font-medium">@{post.username.toUpperCase()}</h4>
                          </div>
                        </div>
                      </div>

                      <div className="aspect-square bg-gray-100">
                        <Image
                          src={post.image || "/placeholder.svg"}
                          alt="Post preview"
                          width={400}
                          height={400}
                          className="object-cover w-full h-full"
                        />
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
                        <div className="aspect-square bg-gray-100">
                          <Image
                            src={post.image || "/placeholder.svg"}
                            alt="Grid item"
                            width={100}
                            height={100}
                            className="object-cover w-full h-full"
                          />
                        </div>
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
          <Button variant="default" onClick={handleSaveChanges}>
            <Save className="h-4 w-4 mr-2" />
            SAVE CHANGES
          </Button>
        </div>
      </footer>
    </div>
  )
}

