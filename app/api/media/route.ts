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
    const postId = searchParams.get('post_id');
    
    let query = supabase.from('media').select('*');
    
    if (postId) {
      query = query.eq('post_id', postId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error: any) {
    console.error('Error fetching media:', error.message);
    return NextResponse.json(
      { error: 'Error fetching media' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const mediaRecord = await request.json();
    
    // Validate required fields
    if (!mediaRecord.post_id) {
      return NextResponse.json(
        { error: 'post_id is required' },
        { status: 400 }
      );
    }
    
    if (!mediaRecord.url) {
      return NextResponse.json(
        { error: 'url is required' },
        { status: 400 }
      );
    }
    
    // Insert media record into Supabase
    const { data, error } = await supabase
      .from('media')
      .insert(mediaRecord)
      .select()
      .single();

    if (error) {
      console.error('Error creating media record:', error.message);
      return NextResponse.json(
        { error: error.message },
        { status: 409 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error creating media record:', error.message);
    return NextResponse.json(
      { error: 'Error creating media record: ' + error.message },
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
        { error: 'Media ID is required' },
        { status: 400 }
      );
    }
    
    const { error } = await supabase
      .from('media')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting media:', error.message);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting media:', error.message);
    return NextResponse.json(
      { error: 'Error deleting media: ' + error.message },
      { status: 500 }
    );
  }
}
