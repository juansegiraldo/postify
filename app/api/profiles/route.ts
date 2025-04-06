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
    const username = searchParams.get('username');
    const userId = searchParams.get('id');
    
    let query = supabase.from('profiles').select('*');
    
    if (username) {
      query = query.eq('username', username);
    }
    
    if (userId) {
      query = query.eq('id', userId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error: any) {
    console.error('Error fetching profiles:', error.message);
    return NextResponse.json(
      { error: 'Error fetching profiles' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const profile = await request.json();
    
    // Validate required fields
    if (!profile.username) {
      return NextResponse.json(
        { error: 'username is required' },
        { status: 400 }
      );
    }
    
    // Insert profile into Supabase
    const { data, error } = await supabase
      .from('profiles')
      .insert(profile)
      .select()
      .single();

    if (error) {
      console.error('Error creating profile:', error.message);
      return NextResponse.json(
        { error: error.message },
        { status: 409 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error creating profile:', error.message);
    return NextResponse.json(
      { error: 'Error creating profile: ' + error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const profile = await request.json();
    
    // Validate that the profile has an ID
    if (!profile.id) {
      return NextResponse.json(
        { error: 'Profile ID is required' },
        { status: 400 }
      );
    }
    
    // Update the profile in Supabase
    const { data, error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', profile.id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating profile:', error.message);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error updating profile:', error.message);
    return NextResponse.json(
      { error: 'Error updating profile: ' + error.message },
      { status: 500 }
    );
  }
}
