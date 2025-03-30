import { NextResponse } from 'next/server';

// In-memory storage for posts (this would be a database in a real app)
let posts: any[] = [];

export async function GET() {
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  try {
    const post = await request.json();
    
    // Add required fields
    const newPost = {
      ...post,
      id: posts.length + 1,
      likes: 0,
      comments: 0,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    };
    
    posts.unshift(newPost); // Add to beginning of array
    
    return NextResponse.json(newPost);
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Error creating post' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const post = await request.json();
    const index = posts.findIndex(p => p.id === post.id);
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    // Update the post while preserving fields that shouldn't change
    const updatedPost = {
      ...posts[index],
      ...post,
      id: posts[index].id, // Ensure ID doesn't change
    };
    
    posts[index] = updatedPost;
    
    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Error updating post' },
      { status: 500 }
    );
  }
} 