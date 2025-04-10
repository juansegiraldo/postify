import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase configuration in environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    
    let query = supabase.from('posts').select(`
      *,
      profiles(*),
      media(*)
    `).order('created_at', { ascending: false });
    
    if (userId) {
      query = query.eq('user_id', userId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return NextResponse.json(data || []);
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
    const newPost = {
      ...post,
      created_at: post.created_at || new Date().toISOString(),
      updated_at: post.updated_at || new Date().toISOString(),
    };
    
    console.log('Creating post with data:', newPost);
    
    // Insert post record into Supabase
    const { data, error } = await supabase
      .from('posts')
      .insert(newPost)
      .select()
      .single();

    if (error) {
      console.error('Error creating post:', error.message);
      return NextResponse.json(
        { error: error.message },
        { status: 409 }
      );
    }
    
    return NextResponse.json(data);
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
    
    // Add updated timestamp
    const updatedPost = {
      ...post,
      updated_at: new Date().toISOString(),
    };
    
    // Update the post in Supabase
    const { data, error } = await supabase
      .from('posts')
      .update(updatedPost)
      .eq('id', post.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating post:', error.message);
      return NextResponse.json(
        { error: error.message },
        { status: 409 }
      );
    }
    
    if (!data) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(data);
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
    
    // First, delete any media associated with the post
    const { error: mediaError } = await supabase
      .from('media')
      .delete()
      .eq('post_id', id);
    
    if (mediaError) {
      console.error('Error deleting post media:', mediaError.message);
      return NextResponse.json(
        { error: mediaError.message },
        { status: 500 }
      );
    }
    
    // Then delete the post
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting post:', error.message);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting post:', error.message);
    return NextResponse.json(
      { error: 'Error deleting post: ' + error.message },
      { status: 500 }
    );
  }
}