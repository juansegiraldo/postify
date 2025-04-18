import { NextResponse } from 'next/server';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import lockfile from 'proper-lockfile';

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

// Helper function to read media data (no locking needed for read generally)
async function getMedia(): Promise<Media[]> {
  await ensureDataFilesExist();
  try {
    const mediaData = await readFile(MEDIA_FILE, 'utf8');
    return JSON.parse(mediaData) as Media[];
  } catch (error: any) {
     if (error.code === 'ENOENT') {
       return []; 
     }
     console.error("Error reading media file:", error);
     return [];
  }
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
  let release;
  try {
    const mediaRecord = await request.json();
    
    // Validation (keep existing checks)
    if (!mediaRecord.post_id || !mediaRecord.url) { 
      return NextResponse.json(
        { error: 'post_id and url are required' }, 
        { status: 400 } 
      );
    }

    console.log(`Attempting to lock ${MEDIA_FILE} for media creation...`);
    release = await lockfile.lock(MEDIA_FILE, { 
      retries: { retries: 5, factor: 3, minTimeout: 100, maxTimeout: 300 },
      lockfilePath: `${MEDIA_FILE}.lock`
    });
    console.log(`${MEDIA_FILE} locked successfully for media creation.`);

    // Get existing media records (while holding lock)
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
    
    // Save to the JSON file (while holding lock)
    await writeFile(MEDIA_FILE, JSON.stringify(mediaItems, null, 2), 'utf8');
    console.log(`${MEDIA_FILE} written successfully after media creation.`);
    
    // Return the created record
    return NextResponse.json(newMediaRecord);

  } catch (error: any) {
    console.error('Error creating media record:', error.message);
    // Ensure error response structure is consistent
    return NextResponse.json(
      { error: `Error creating media record: ${error.message}` }, 
      { status: 500 }
    );
  } finally {
    // Ensure lock is always released
    if (release) {
      try {
        await release();
        console.log(`${MEDIA_FILE} media creation lock released.`);
      } catch (releaseError) {
        console.error(`Error releasing media creation lock for ${MEDIA_FILE}:`, releaseError);
      }
    }
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
    
    // --- Comment out Supabase code --- 
    /*
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
    */
    // -------------------------------

    // TODO: Implement deletion from media.json using locking
    console.warn(`Deletion for media ID ${id} not implemented for JSON file storage yet.`);
    
    // Return success temporarily, or an error indicating not implemented
    // return NextResponse.json({ success: true }); 
    return NextResponse.json(
        { error: 'Media deletion from JSON not implemented yet.' },
        { status: 501 } // 501 Not Implemented
     );

  } catch (error: any) {
    console.error('Error deleting media:', error.message);
    return NextResponse.json(
      { error: 'Error deleting media: ' + error.message },
      { status: 500 }
    );
  }
}
