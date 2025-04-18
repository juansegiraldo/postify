import { NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

// Path to the JSON file that stores our posts
const DATA_DIR = join(process.cwd(), 'data');
const POSTS_FILE = join(DATA_DIR, 'posts.json');

// Basic Post type (adjust if needed)
interface Post {
  id: string | number; // Allow both based on previous errors
  post_order?: number | null;
  // Add other fields if necessary for type checking, though not strictly needed for this logic
  [key: string]: any; // Allow other properties
}

// Helper function to read posts
async function getPosts(): Promise<Post[]> {
  // Assuming ensureDataFilesExist is handled elsewhere or posts.json always exists
  try {
    const postsData = await readFile(POSTS_FILE, 'utf8');
    return JSON.parse(postsData) as Post[];
  } catch (error) {
    console.error("Error reading posts file:", error);
    return []; // Return empty array if file doesn't exist or error occurs
  }
}

// Helper function to write posts
async function savePosts(posts: Post[]): Promise<void> {
  // Assuming ensureDataFilesExist is handled elsewhere
  try {
    await writeFile(POSTS_FILE, JSON.stringify(posts, null, 2), 'utf8');
  } catch (error) {
    console.error("Error writing posts file:", error);
    throw error; // Re-throw the error to be caught by the handler
  }
}

export async function POST(request: Request) {
  try {
    // 1. Get the ordered list of IDs from the request body
    const { orderedIds } = await request.json();

    if (!Array.isArray(orderedIds)) {
      return NextResponse.json(
        { error: 'orderedIds must be an array' },
        { status: 400 }
      );
    }

    console.log("Received ordered IDs:", orderedIds);

    // 2. Read the current posts from the JSON file
    const posts: Post[] = await getPosts();

    // 3. Create a map for efficient lookup
    const postMap = new Map(posts.map((post: Post) => [post.id, post]));

    // 4. Update the post_order for each post based on the received order
    const updatedPosts = posts.map((post: Post) => {
      const index = orderedIds.indexOf(post.id);
      // Assign index as order if found, otherwise keep original or null
      const newOrder = index !== -1 ? index : (post.post_order ?? null);
      return { ...post, post_order: newOrder }; 
    });
    
    // Optional: You could also choose to *only* update posts present in orderedIds
    // and leave others untouched or assign them a high order number.
    // The current approach re-orders all existing posts based on the list provided.

    // 5. Save the updated posts array back to the JSON file
    await savePosts(updatedPosts);

    console.log("Post order updated successfully.");

    // 6. Return a success response
    return NextResponse.json({ message: 'Post order updated successfully' });

  } catch (error: any) {
    console.error('Error updating post order:', error.message);
    return NextResponse.json(
      { error: 'Error updating post order' },
      { status: 500 }
    );
  }
} 