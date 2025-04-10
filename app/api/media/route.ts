import { NextResponse } from 'next/server';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';

// Path to the JSON file that will store our media
const DATA_DIR = join(process.cwd(), 'data');
const MEDIA_FILE = join(DATA_DIR, 'media.json');

// Helper function to ensure the data directory and files exist
async function ensureDataFilesExist() {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true });
  }
  
  // Create media.json if it doesn't exist
  if (!existsSync(MEDIA_FILE)) {
    await writeFile(MEDIA_FILE, JSON.stringify([]), 'utf8');
  }
}

// Helper function to read media data
async function getMedia() {
  await ensureDataFilesExist();
  const mediaData = await readFile(MEDIA_FILE, 'utf8');
  return JSON.parse(mediaData);
}

// Helper function to write media data
async function saveMedia(media: Media[]) {
  await ensureDataFilesExist();
  await writeFile(MEDIA_FILE, JSON.stringify(media, null, 2), 'utf8');
}

// Type definition for media items
interface Media {
  id: string;
  post_id: string;
  url: string;
  type: string;
  created_at?: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('post_id');
    
    // Get all media
    const media = await getMedia();
    
    // Filter by post_id if provided
    const filteredMedia = postId
      ? media.filter((item: Media) => item.post_id === postId)
      : media;
      
    return NextResponse.json(filteredMedia || []);
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
    
    // Get existing media records
    const mediaItems = await getMedia();
    
    // Create a new media record with a UUID
    const newMediaRecord: Media = {
      id: mediaRecord.id || uuidv4(),
      post_id: mediaRecord.post_id,
      url: mediaRecord.url,
      type: mediaRecord.type || 'image/jpeg',
      created_at: mediaRecord.created_at || new Date().toISOString()
    };
    
    // Add the new media record
    mediaItems.push(newMediaRecord);
    
    // Save to the JSON file
    await saveMedia(mediaItems);
    
    return NextResponse.json(newMediaRecord);
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
