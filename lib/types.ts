export interface Profile {
  id: string
  username: string
  full_name: string
  avatar_url: string
  created_at: string
  updated_at: string
}

export interface Post {
  id: string
  user_id: string
  title: string
  content: string
  status: string
  created_at: string
  updated_at: string
  profiles: Profile
  media?: Media[]
}

export interface Media {
  id: string
  post_id: string
  url: string
  type: string
  created_at: string
} 