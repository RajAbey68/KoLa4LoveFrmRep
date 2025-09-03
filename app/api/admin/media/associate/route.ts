
import { NextRequest, NextResponse } from 'next/server';
import { db, collections, createDocument, queryCollection } from '@/server/db';
import { GalleryImage } from '@/shared/schema';

export async function POST(request: NextRequest) {
  try {
    const { filename, objectPath, metadata } = await request.json();
    
    if (!filename || !objectPath) {
      return NextResponse.json(
        { error: 'Filename and object path are required' },
        { status: 400 }
      );
    }
    
    // Check if association already exists
    const existing = await queryCollection(collections.galleryImages, [
      { field: 'objectPath', operator: '==', value: objectPath }
    ]);
    
    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'Media already associated with this object path' },
        { status: 409 }
      );
    }
    
    // Create new gallery image association
    const imageData: Partial<GalleryImage> = {
      filename,
      originalName: filename,
      objectPath,
      mimeType: metadata?.mimeType || 'image/jpeg',
      size: metadata?.size || 0,
      title: metadata?.title || filename,
      description: metadata?.description || '',
      altText: metadata?.altText || filename,
      tags: metadata?.tags || [],
      category: metadata?.category || 'general',
      isHero: false,
      isActive: true,
      sortOrder: 0,
      uploadedBy: 'admin',
      metadata: metadata || {}
    };
    
    const result = await createDocument(collections.galleryImages, imageData);
    
    return NextResponse.json({
      success: true,
      imageId: result.id,
      message: 'Media successfully associated with gallery'
    });
    
  } catch (error) {
    console.error('Error associating media:', error);
    return NextResponse.json(
      { error: 'Failed to associate media' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const objectPath = searchParams.get('objectPath');
    
    if (!objectPath) {
      return NextResponse.json(
        { error: 'Object path is required' },
        { status: 400 }
      );
    }
    
    const images = await queryCollection(collections.galleryImages, [
      { field: 'objectPath', operator: '==', value: objectPath }
    ]);
    
    return NextResponse.json({
      success: true,
      images,
      count: images.length
    });
    
  } catch (error) {
    console.error('Error fetching associated media:', error);
    return NextResponse.json(
      { error: 'Failed to fetch associated media' },
      { status: 500 }
    );
  }
}
