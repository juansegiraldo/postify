"use client"

import PostPage from "@/components/PostPage"
import { useParams } from "next/navigation"

export default function EditPost() {
  const params = useParams()
  return <PostPage mode="edit" id={Number(params.id)} />
} 