"use client"

import PostPage from "@/components/PostPage"
import { useParams } from "next/navigation"

export default function EditPost() {
  const params = useParams()
  const id = Number(params.id)
  
  console.log(`Edit page loaded with ID: ${id}`)
  
  return <PostPage mode="edit" id={id} />
} 