import { NextResponse } from 'next/server';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';

// Path to the JSON file that will store our posts
const DATA_DIR = join(process.cwd(), 'data');
const POSTS_FILE = join(DATA_DIR, 'posts.json');
const MEDIA_FILE = join(DATA_DIR, 'media.json');
const PROFILES_FILE = join(DATA_DIR, 'profiles.json');

// Helper function to ensure the data directory and files exist
async function ensureDataFilesExist() {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true });
  }
  
  // Create posts.json if it doesn't exist
  if (!existsSync(POSTS_FILE)) {
    await writeFile(POSTS_FILE, JSON.stringify([]), 'utf8');
  }
  
  // Create media.json if it doesn't exist
  if (!existsSync(MEDIA_FILE)) {
    await writeFile(MEDIA_FILE, JSON.stringify([]), 'utf8');
  }
  
  // Create profiles.json if it doesn't exist
  if (!existsSync(PROFILES_FILE)) {
    await writeFile(PROFILES_FILE, JSON.stringify([]), 'utf8');
  }
}

// Helper function to read posts
async function getPosts() {
  await ensureDataFilesExist();
  const postsData = await readFile(POSTS_FILE, 'utf8');
  return JSON.parse(postsData);
}

// Helper function to read media
async function getMedia() {
  await ensureDataFilesExist();
  const mediaData = await readFile(MEDIA_FILE, 'utf8');
  return JSON.parse(mediaData);
}

// Helper function to read profiles
async function getProfiles() {
  await ensureDataFilesExist();
  const profilesData = await readFile(PROFILES_FILE, 'utf8');
  return JSON.parse(profilesData);
}

// Type definitions for our data
interface Post {
  id: string;
  user_id?: string;
  title?: string;
  content?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  image?: string;
  caption?: string;
  platform?: string;
  media?: Media[];
  profiles?: Profile | null;
}

interface Media {
  id: string;
  post_id: string;
  url: string;
  type: string;
  created_at?: string;
}

interface Profile {
  id: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
}

// Helper function to write posts
async function savePosts(posts: Post[]): Promise<void> {
  await ensureDataFilesExist();
  await writeFile(POSTS_FILE, JSON.stringify(posts, null, 2), 'utf8');
}

// Helper function to write media
async function saveMedia(media: Media[]): Promise<void> {
  await ensureDataFilesExist();
  await writeFile(MEDIA_FILE, JSON.stringify(media, null, 2), 'utf8');
}

// Helper function to get a post with its related data
async function getPostWithRelations(postId: string): Promise<Post | null> {
  const posts = await getPosts();
  const media = await getMedia();
  const profiles = await getProfiles();
  
  const post = posts.find((p: Post) => p.id === postId);
  if (!post) return null;
  
  // Attach media and profile data
  post.media = media.filter((m: Media) => m.post_id === postId);
  if (post.user_id) {
    post.profiles = profiles.find((p: Profile) => p.id === post.user_id) || null;
  }
  
  return post;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const postId = searchParams.get('id');
    
    // Get all our data
    let posts = await getPosts(); // Changed to let for reassignment
    const media = await getMedia();
    const profiles = await getProfiles();
    
    // If a specific post is requested by ID
    if (postId) {
      // Find the post first (no sorting needed for single fetch)
      const singlePost = posts.find((p: Post) => p.id === postId);
      if (!singlePost) {
        return NextResponse.json(
          { error: 'Post not found' },
          { status: 404 }
        );
      }
       // Attach relations for the single post
      singlePost.media = media.filter((m: Media) => m.post_id === postId);
      if (singlePost.user_id) {
        singlePost.profiles = profiles.find((p: Profile) => p.id === singlePost.user_id) || null;
      }
      return NextResponse.json(singlePost);
    }
    
    // Filter posts by user_id if provided
    let filteredPosts = userId 
      ? posts.filter((post: any) => post.user_id === userId)
      : posts;
    
    // --- Sort by post_order, then by created_at descending --- 
    filteredPosts = filteredPosts.sort((a: any, b: any) => {
      const orderA = a.post_order ?? Infinity; // Treat null/undefined as last
      const orderB = b.post_order ?? Infinity;
      
      if (orderA !== orderB) {
        return orderA - orderB; // Sort by order number first
      }
      // If order is the same (or both are null/undefined), sort by date
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    // --------------------------------------------------------
    
    // Attach media and profiles to each post
    const postsWithRelations = filteredPosts.map((post: any) => {
      return {
        ...post,
        media: media.filter((m: any) => m.post_id === post.id),
        profiles: post.user_id ? profiles.find((p: any) => p.id === post.user_id) : null
      };
    });
    
    return NextResponse.json(postsWithRelations || []);
  } catch (error: any) {
    console.error('Error fetching posts:', error.message);
    return NextResponse.json(
      { error: 'Error fetching posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const post = await request.json();
    
    // Validate required fields
    if (!post.id || !post.user_id) {
      return NextResponse.json(
        { error: 'Post ID and user_id are required' },
        { status: 400 }
      );
    }
    
    // Add timestamps if not provided
    const newPost: Post = {
      ...post,
      created_at: post.created_at || new Date().toISOString(),
      updated_at: post.updated_at || new Date().toISOString(),
    };
    
    console.log('Creating post with data:', newPost);
    
    // Get existing posts and add the new one
    const posts = await getPosts();
    
    // Check if a post with the same ID already exists
    if (posts.some((p: Post) => p.id === newPost.id)) {
      return NextResponse.json(
        { error: 'A post with this ID already exists' },
        { status: 409 }
      );
    }
    
    // Add the new post
    posts.push(newPost);
    
    // Save to the JSON file
    await savePosts(posts);
    
    return NextResponse.json(newPost);
  } catch (error: any) {
    console.error('Error creating post:', error.message);
    return NextResponse.json(
      { error: 'Error creating post: ' + error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const post = await request.json();
    
    // Validate that the post has an ID
    if (!post.id) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }
    
    // Get current posts
    const posts = await getPosts();
    
    // Find the post to update
    const postIndex = posts.findIndex((p: Post) => p.id === post.id);
    
    if (postIndex === -1) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    // Add updated timestamp
    const updatedPost: Post = {
      ...posts[postIndex],
      ...post,
      updated_at: new Date().toISOString(),
    };
    
    // Update the post in our array
    posts[postIndex] = updatedPost;
    
    // Save to the JSON file
    await savePosts(posts);
    
    // Get the updated post with its relations
    const postWithRelations = await getPostWithRelations(updatedPost.id);
    
    return NextResponse.json(postWithRelations);
  } catch (error: any) {
    console.error('Error updating post:', error.message);
    return NextResponse.json(
      { error: 'Error updating post: ' + error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }
    
    // Get current posts and media
    const posts = await getPosts();
    const media = await getMedia();
    
    // Find the post to delete
    const postIndex = posts.findIndex((p: Post) => p.id === id);
    
    if (postIndex === -1) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    // First, filter out any media associated with this post
    const updatedMedia = media.filter((m: Media) => m.post_id !== id);
    await saveMedia(updatedMedia);
    
    // Then remove the post from the posts array
    posts.splice(postIndex, 1);
    await savePosts(posts);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting post:', error.message);
    return NextResponse.json(
      { error: 'Error deleting post: ' + error.message },
      { status: 500 }
    );
  }
}