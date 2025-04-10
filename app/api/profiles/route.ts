import { NextResponse } from 'next/server';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';

// Path to the JSON file that will store our profiles
const DATA_DIR = join(process.cwd(), 'data');
const PROFILES_FILE = join(DATA_DIR, 'profiles.json');

// Type definition for profile items
interface Profile {
  id: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

// Helper function to ensure the data directory and files exist
async function ensureDataFilesExist() {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true });
  }
  
  // Create profiles.json if it doesn't exist
  if (!existsSync(PROFILES_FILE)) {
    await writeFile(PROFILES_FILE, JSON.stringify([]), 'utf8');
  }
}

// Helper function to read profiles data
async function getProfiles(): Promise<Profile[]> {
  await ensureDataFilesExist();
  const profilesData = await readFile(PROFILES_FILE, 'utf8');
  return JSON.parse(profilesData);
}

// Helper function to write profiles data
async function saveProfiles(profiles: Profile[]): Promise<void> {
  await ensureDataFilesExist();
  await writeFile(PROFILES_FILE, JSON.stringify(profiles, null, 2), 'utf8');
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    const userId = searchParams.get('id');
    
    let profiles = await getProfiles();
    
    // Filter by username if provided
    if (username) {
      profiles = profiles.filter(profile => profile.username === username);
    }
    
    // Filter by id if provided
    if (userId) {
      profiles = profiles.filter(profile => profile.id === userId);
    }
    
    return NextResponse.json(profiles || []);
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
    
    // Get existing profiles
    const profiles = await getProfiles();
    
    // Check if username already exists
    if (profiles.some(p => p.username === profile.username)) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 409 }
      );
    }
    
    // Create a new profile with a UUID
    const newProfile: Profile = {
      id: profile.id || uuidv4(),
      username: profile.username,
      full_name: profile.full_name,
      avatar_url: profile.avatar_url,
      created_at: profile.created_at || new Date().toISOString(),
      updated_at: profile.updated_at || new Date().toISOString()
    };
    
    // Add the new profile
    profiles.push(newProfile);
    
    // Save to the JSON file
    await saveProfiles(profiles);
    
    return NextResponse.json(newProfile);
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
    
    // Get existing profiles
    const profiles = await getProfiles();
    
    // Find the profile to update
    const profileIndex = profiles.findIndex(p => p.id === profile.id);
    
    if (profileIndex === -1) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }
    
    // If username is being changed, check if it already exists
    if (profile.username && profile.username !== profiles[profileIndex].username) {
      if (profiles.some(p => p.username === profile.username && p.id !== profile.id)) {
        return NextResponse.json(
          { error: 'Username already exists' },
          { status: 409 }
        );
      }
    }
    
    // Update the profile
    const updatedProfile: Profile = {
      ...profiles[profileIndex],
      ...profile,
      updated_at: new Date().toISOString()
    };
    
    // Replace the old profile in the array
    profiles[profileIndex] = updatedProfile;
    
    // Save to the JSON file
    await saveProfiles(profiles);
    
    return NextResponse.json(updatedProfile);
  } catch (error: any) {
    console.error('Error updating profile:', error.message);
    return NextResponse.json(
      { error: 'Error updating profile: ' + error.message },
      { status: 500 }
    );
  }
}
