"use client"

import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Send, Bookmark } from "lucide-react"

interface PostPreviewProps {
  username: string
  caption: string
  imageUrl: string
  onLike?: () => void
  onComment?: () => void
  onShare?: () => void
  onSave?: () => void
}

export function PostPreview({
  username,
  caption,
  imageUrl,
  onLike = () => {},
  onComment = () => {},
  onShare = () => {},
  onSave = () => {},
}: PostPreviewProps) {
  return (
    <div className="rounded-lg overflow-hidden border border-gray-200 bg-white">
      <div className="p-4">
        <div className="flex items-center">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt={`@${username}`} />
            <AvatarFallback>{username.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="ml-2">
            <h4 className="text-sm font-medium">@{username.toUpperCase()}</h4>
          </div>
        </div>
      </div>

      <div className="aspect-square bg-gray-100">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt="Post preview"
          width={400}
          height={400}
          className="object-cover w-full h-full"
        />
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onLike}>
            <Heart className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onComment}>
            <MessageCircle className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onShare}>
            <Send className="h-4 w-4" />
          </Button>
          <div className="flex-1"></div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onSave}>
            <Bookmark className="h-4 w-4" />
          </Button>
        </div>

        <div className="text-sm">
          {caption ? <p>{caption}</p> : <p className="text-gray-500">No caption provided</p>}
        </div>
      </div>
    </div>
  )
}

