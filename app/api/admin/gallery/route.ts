import { NextRequest, NextResponse } from 'next/server';
import { db, collections } from '@/server/db';


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Fetching gallery images with filters

    // Build query - use direct collection name to ensure we get the right data
    let query = db.collection('galleryImages');


    if (category && category !== 'all') {
      query = query.where('category', '==', category);
    }

    // Get all documents without orderBy to avoid stub function issues
    const snapshot = await query.get();

    if (!snapshot || !snapshot.docs) {
      return NextResponse.json({
        success: true,
        images: [],
        total: 0,
        pagination: { limit, offset, hasMore: false }
      });
    }

    // Process and sort gallery images
    const images = snapshot.docs
    .map((doc: any) => {
      const data = doc.data();

      // Determine media type for compatibility
      let mediaType = 'image';
      if (data.mediaType) {
        mediaType = data.mediaType;
      } else if (data.mimeType && data.mimeType.startsWith('video/')) {
        mediaType = 'video';
      } else if (data.objectPath && /\.(mp4|mov|avi|webm|mkv)$/i.test(data.objectPath)) {
        mediaType = 'video';
      }

      return {
        id: doc.id,
        ...data,
        objectPath: data.objectPath || data.src || data.url,
        displayUrl: data.objectPath ? `/api/objects/${data.objectPath}` : '/api/placeholder/400/300',
        mediaType // Add mediaType field for frontend compatibility
      };
    })
    .sort((a: any, b: any) => {
      // Sort by createdAt descending
      const aTime = a.createdAt || 0;
      const bTime = b.createdAt || 0;
      return bTime - aTime;
    })
    .slice(offset, offset + limit);


    return NextResponse.json({
      success: true,
      images,
      total: snapshot.docs.length,
      pagination: {
        limit,
        offset,
        hasMore: offset + limit < snapshot.docs.length
      }
    });

  } catch (error) {
    console.error('Error fetching gallery images:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch gallery images',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const newImage = {
      ...data,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isActive: true
    };

    const docRef = await db.collection(collections.galleryImages).add(newImage);

    return NextResponse.json({
      success: true,
      id: docRef.id,
      image: { id: docRef.id, ...newImage }
    });

  } catch (error) {
    console.error('Error creating gallery image:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create gallery image'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...data } = await request.json();

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Image ID required'
      }, { status: 400 });
    }

    const updateData = {
      ...data,
      updatedAt: Date.now()
    };

    await db.collection(collections.galleryImages).doc(id).update(updateData);

    return NextResponse.json({
      success: true,
      id,
      image: { id, ...updateData }
    });

  } catch (error) {
    console.error('Error updating gallery image:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update gallery image'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const action = searchParams.get('action');

    // Handle clear-all action
    if (action === 'clear-all') {
      console.log('🗑️ Clearing all gallery images from database...');
      const snapshot = await db.collection('galleryImages').get();
      
      const deletePromises = snapshot.docs.map(doc => db.collection('galleryImages').doc(doc.id).delete());
      await Promise.all(deletePromises);
      
      console.log(`✅ Cleared ${snapshot.docs.length} gallery entries`);
      
      return NextResponse.json({
        success: true,
        message: `Cleared ${snapshot.docs.length} gallery entries`,
        cleared: snapshot.docs.length
      });
    }

    // Handle single image deletion
    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Image ID required'
      }, { status: 400 });
    }

    await db.collection(collections.galleryImages).doc(id).delete();

    return NextResponse.json({
      success: true,
      id
    });

  } catch (error) {
    console.error('Error deleting gallery image:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete gallery image'
    }, { status: 500 });
  }
}