import { NextRequest, NextResponse } from 'next/server';
import { ObjectStorageService } from '@/server/objectStorage';

export async function POST(request: NextRequest) {
  try {
    const { folder, fileName, contentType } = await request.json();
    
    if (!folder) {
      return NextResponse.json(
        { error: 'Folder is required' },
        { status: 400 }
      );
    }

    const objectStorageService = new ObjectStorageService();
    const uploadURL = await objectStorageService.getObjectEntityUploadURL(folder);
    
    return NextResponse.json({
      uploadURL,
      folder,
      fileName
    });
    
  } catch (error) {
    console.error('Media upload error:', error);
    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 }
    );
  }
}