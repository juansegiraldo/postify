import { NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import lockfile from 'proper-lockfile'; // Import the locking library

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

// Helper function to write posts with locking
async function savePosts(posts: Post[]): Promise<void> {
  // Assuming ensureDataFilesExist is handled elsewhere or not needed if we always create
  let release;
  try {
    console.log(`Attempting to lock ${POSTS_FILE} for ordering...`);
    release = await lockfile.lock(POSTS_FILE, { 
      retries: { retries: 5, factor: 3, minTimeout: 100, maxTimeout: 300 },
      lockfilePath: `${POSTS_FILE}.lock`
    });
    console.log(`${POSTS_FILE} locked successfully for ordering.`);
    
    await writeFile(POSTS_FILE, JSON.stringify(posts, null, 2), 'utf8');
    console.log(`${POSTS_FILE} written successfully after ordering.`);

  } catch (error) {
    console.error(`Error during savePosts for ordering ${POSTS_FILE}:`, error);
    throw error; 
  } finally {
    if (release) {
      try {
        await release();
        console.log(`${POSTS_FILE} order lock released.`);
      } catch (releaseError) {
        console.error(`Error releasing order lock for ${POSTS_FILE}:`, releaseError);
      }
    }
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

    // --- Lock before read-modify-write --- 
    // It's safer to lock *before* reading if the read depends on consistent state
    let release;
    let updatedPosts: Post[] = [];
    try {
      console.log(`Attempting to lock ${POSTS_FILE} for read-modify-write...`);
      release = await lockfile.lock(POSTS_FILE, { 
        retries: { retries: 5, factor: 3, minTimeout: 100, maxTimeout: 300 },
        lockfilePath: `${POSTS_FILE}.lock`
      });
      console.log(`${POSTS_FILE} locked successfully for read-modify-write.`);

      // 2. Read the current posts from the JSON file (while holding lock)
      const posts: Post[] = await getPosts(); 

      // 3. Create a map for efficient lookup
      const postMap = new Map(posts.map((post: Post) => [post.id, post]));

      // 4. Update the post_order for each post based on the received order
      updatedPosts = posts.map((post: Post) => { 
        const index = orderedIds.indexOf(post.id);
        const newOrder = index !== -1 ? index : (post.post_order ?? null);
        return { ...post, post_order: newOrder }; 
      });
      
      // 5. Save the updated posts array back to the JSON file (while holding lock)
      await writeFile(POSTS_FILE, JSON.stringify(updatedPosts, null, 2), 'utf8');
      console.log("Post order updated and written successfully.");

    } catch (error) {
      console.error('Error during locked post order update:', error);
      throw error; // Re-throw to be caught by outer handler
    } finally {
       if (release) {
         try {
           await release();
           console.log(`${POSTS_FILE} read-modify-write lock released.`);
         } catch (releaseError) {
           console.error(`Error releasing read-modify-write lock for ${POSTS_FILE}:`, releaseError);
         }
       }
    }
    // --- End lock ---

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