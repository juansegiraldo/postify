import { supabase } from './supabaseClient'
import { Profile, Post, Media } from './types'

// Profiles
export async function getProfile(userId: string): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}

export async function updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

// Posts
export async function getPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*, profiles(*)')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getPost(postId: string): Promise<Post> {
  const { data, error } = await supabase
    .from('posts')
    .select('*, profiles(*), media(*)')
    .eq('id', postId)
    .single()

  if (error) throw error
  return data
}

export async function createPost(post: Omit<Post, 'id' | 'created_at' | 'updated_at' | 'profiles' | 'media'>): Promise<Post> {
  const { data, error } = await supabase
    .from('posts')
    .insert(post)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updatePost(postId: string, updates: Partial<Post>): Promise<Post> {
  const { data, error } = await supabase
    .from('posts')
    .update(updates)
    .eq('id', postId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deletePost(postId: string): Promise<void> {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId)

  if (error) throw error
}

// Media
export async function uploadMedia(file: File, postId: string): Promise<Media> {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random()}.${fileExt}`
  const filePath = `${postId}/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('media')
    .upload(filePath, file)

  if (uploadError) throw uploadError

  const { data: { publicUrl } } = supabase.storage
    .from('media')
    .getPublicUrl(filePath)

  const { data, error } = await supabase
    .from('media')
    .insert({ post_id: postId, url: publicUrl, type: file.type })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteMedia(mediaId: string): Promise<void> {
  const { error } = await supabase
    .from('media')
    .delete()
    .eq('id', mediaId)

  if (error) throw error
} 