import { NextRequest, NextResponse } from 'next/server';
import { collections, queryCollection } from '@/server/db';
import { GalleryImage } from '@/shared/schema';

// GET /api/admin/gallery/hero - Fetch hero images or videos based on query parameter
export async function GET(request: NextRequest) {
  console.log('Fetching fresh hero images from database...');
  const startTime = Date.now();

  // Check if requesting videos specifically (for video widget)
  const searchParams = request.nextUrl.searchParams;
  const includeVideos = searchParams.get('includeVideos') === 'true';
  const videosOnly = searchParams.get('videosOnly') === 'true';

  try {
    // Query start time for performance tracking
    const queryStart = Date.now();

    // Get hero images (isHero = true) 
    const heroImages = await queryCollection(collections.galleryImages, [
      { field: 'isHero', operator: '==', value: true }
    ]);
    
    // Filter based on request type
    let filteredHeros = heroImages;
    if (videosOnly) {
      // Only return videos for video widget
      filteredHeros = heroImages.filter((item: any) => {
        const isVideo = item.mimeType?.includes('video') || item.mediaType === 'video';
        console.log(`Checking item: ${item.filename}, mimeType: ${item.mimeType}, mediaType: ${item.mediaType}, isVideo: ${isVideo}`);
        return isVideo;
      });
      console.log(`Filtering for videos only - found ${filteredHeros.length} hero videos out of ${heroImages.length} total hero items`);
    } else if (!includeVideos) {
      // Default behavior - exclude videos from hero carousel
      filteredHeros = heroImages.filter((item: any) => {
        const isVideo = item.mimeType?.includes('video') || item.mediaType === 'video';
        return !isVideo;
      });
      console.log(`Excluding videos from hero carousel - ${filteredHeros.length} images only`);
    }

    const queryTime = Date.now() - queryStart;
    console.log(`Hero images query took ${queryTime}ms`);
    console.log(`Found ${heroImages.length} total hero items, ${filteredHeros.length} after filtering`);
    
    // Sort hero images by displayOrder and createdAt
    let allImages = filteredHeros.sort((a: any, b: any) => {
      const aOrder = a.displayOrder || 0;
      const bOrder = b.displayOrder || 0;
      if (aOrder !== bOrder) return bOrder - aOrder;
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });
    
    // If no hero items after filtering, get some featured/recent items as fallback
    if (filteredHeros.length === 0) {
      console.log('No hero images found, using fallback query');
      const fallbackImages = await queryCollection(collections.galleryImages);
      allImages = fallbackImages
        .filter((item: any) => {
          const isVideo = item.mimeType?.includes('video') || item.mediaType === 'video';
          // For video-only requests, only return videos in fallback
          if (videosOnly) return isVideo;
          // For normal requests, exclude videos from fallback
          return !isVideo;
        })
        .sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
        .slice(0, 6);
    } else {
      console.log('Using hero images from database');
    }

    // Transform the data to the desired format, ensuring valid URLs and proper field mapping
    const transformedImages = allImages.map((row: any) => ({
      id: row.id,
      filename: row.filename || 'untitled',
      url: row.objectPath ? `/objects/${row.objectPath}` : '/images/logo.jpeg', // Use objectPath for URL
      objectPath: row.objectPath || '', // Use objectPath for /objects/ route
      title: row.title || 'Untitled',
      altText: row.altText || '',
      seoDescription: row.description || '',
      keywords: row.keywords || [],
      category: row.category || 'villa',
      mediaType: row.mimeType?.includes('video') ? 'video' : 'image', // Use mimeType to determine media type
      isHero: Boolean(row.isHero), // Use Firebase field names
      isFeatured: Boolean(row.isFeatured),
      displayOrder: row.sortOrder || 0, // Firebase uses sortOrder instead of displayOrder
      metadata: row.metadata || {},
      uploadedAt: row.createdAt,
      createdAt: row.createdAt
    })).filter((img: any) => img.url !== '/images/logo.jpeg'); // Filter out entries with fallback URL

    const totalTime = Date.now() - startTime;
    console.log(`Hero API completed in ${totalTime}ms`);

    return NextResponse.json({ 
      success: true,
      images: transformedImages,
      count: transformedImages.length,
      queryTime,
      totalTime
    });

  } catch (error) {
    console.error('❌ Hero gallery fetch error:', error);

    // Return safe fallback with sample data
    return NextResponse.json({
      success: true,
      images: [
        {
          id: 'fallback-1',
          filename: 'villa-hero.jpg',
          title: 'Ko Lake Villa',
          mediaType: 'image',
          objectPath: 'images/hero/drone-villa.jpg',
          isHero: true,
          category: 'villa'
        }
      ],
      count: 1,
      fallback: true
    }, { status: 200 });
  }
}