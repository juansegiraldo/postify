import { NextResponse } from 'next/server';
import { writeFile, mkdir, access, constants } from 'fs/promises';
import { join, dirname } from 'path';
import { existsSync } from 'fs';

export async function POST(request: Request) {
  try {
    // Parse the form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    // Validate file existence
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type (optional)
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files are allowed' },
        { status: 400 }
      );
    }

    // Get file content as buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Prepare upload directory
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    
    // Ensure uploads directory exists with proper permissions
    try {
      // Check if directory exists
      if (!existsSync(uploadsDir)) {
        console.log(`Creating uploads directory: ${uploadsDir}`);
        await mkdir(uploadsDir, { recursive: true });
      }
      
      // Verify we have write access
      await access(uploadsDir, constants.W_OK);
    } catch (error) {
      console.error(`Directory access error: ${error}`);
      return NextResponse.json(
        { error: 'Server configuration error: Cannot access upload directory' },
        { status: 500 }
      );
    }
    
    // Create safe filename - fix extra curly brace in the original code
    const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '');
    const filename = `${Date.now()}-${safeFileName}`;
    const filepath = join(uploadsDir, filename);
    
    // Write file to disk
    try {
      await writeFile(filepath, buffer);
      console.log(`File successfully written to ${filepath}`);
    } catch (writeError) {
      console.error(`File write error: ${writeError}`);
      return NextResponse.json(
        { error: `Failed to save file: ${writeError}` },
        { status: 500 }
      );
    }
    
    // Build the public URL for the file
    const publicUrl = `/uploads/${filename}`;
    
    // Return success response
    return NextResponse.json({ 
      success: true,
      filename: publicUrl,
      originalName: file.name,
      size: file.size,
      type: file.type
    });
    
  } catch (error: any) {
    console.error('Error in upload API:', error);
    return NextResponse.json(
      { error: `Error uploading file: ${error.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}