import { NextResponse } from "next/server";
import { db, collections, queryCollection } from '@/server/db';

// Keep this Node runtime if you touch fs/crypto/etc.
export const runtime = "nodejs";

/**
 * Gallery Cache API - Returns active gallery images for public display
 */
export async function GET() {
  try {
    console.log('📸 Fetching cached gallery images for public display...');
    
    // Query for active images only
    const filters = [
      { field: 'isActive', operator: '==', value: true }
    ];
    
    const images = await queryCollection(collections.galleryImages, filters);
    console.log(`✅ Found ${images.length} active images`);
    
    // Format for public gallery consumption and filter out problematic entries
    const publicImages = images
      .filter((img: any) => {
        // Filter out test uploads and sample data that don't exist in storage
        if (!img.objectPath) return false;
        if (img.objectPath.includes('test-upload.jpg')) return false;
        if (img.objectPath.includes('sample/')) return false;
        return true;
      })
      .map((img: any) => ({
        id: img.id,
        objectPath: img.objectPath,
        filename: img.filename,
        title: img.title,
        description: img.description,
        altText: img.altText,
        seoDescription: img.seoDescription,
        category: img.category || 'villa', // Default to villa if no category
        mediaType: img.mediaType || (img.filename && /\.(mp4|mov|avi|webm|mkv)$/i.test(img.filename) ? 'video' : 'image'), // Auto-detect if missing
        mimeType: img.mimeType, // Include mimeType for fallback detection
        isHero: img.isHero,
        isFeatured: img.isFeatured,
        keywords: img.keywords,
        createdAt: img.createdAt
      }));
    
    return NextResponse.json(
      { 
        success: true, 
        images: publicImages, 
        count: publicImages.length 
      },
      { 
        status: 200, 
        headers: { "Cache-Control": "public, max-age=300" } // 5 minute cache
      }
    );
    
  } catch (error) {
    console.error('❌ Error fetching cached gallery images:', error);
    return NextResponse.json(
      { 
        success: false, 
        images: [], 
        count: 0,
        error: 'Failed to fetch gallery images'
      },
      { status: 500 }
    );
  }
}
