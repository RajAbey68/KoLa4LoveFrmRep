import { NextRequest, NextResponse } from 'next/server';
import { getBucket } from '@/lib/firebase-admin-fixed';
import { db, collections } from '@/server/db';

const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const SUPPORTED_VIDEO_TYPES = ['video/mp4', 'video/mov', 'video/avi', 'video/webm'];

// Ensure Firebase Admin is initialized
function ensureFirebaseInitialized() {
  try {
    const bucket = getBucket();
    if (!bucket) {
      throw new Error('Firebase Storage not available during build phase');
    }
    console.log(`🗑️ Using Firebase bucket: ${bucket.name}`);
    return bucket;
  } catch (error) {
    console.error('❌ Firebase Storage initialization error:', error);
    
    // Try alternative bucket naming patterns
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
    
    console.log('🔍 Alternative bucket patterns to try:');
    console.log(`  - ${projectId}.appspot.com`);
    console.log(`  - ${bucketName}`);
    console.log(`  - ${projectId}.firebasestorage.app`);
    
    throw new Error(`Firebase Storage bucket not found. Please create bucket in Firebase Console: ${bucketName}`);
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Gallery upload endpoint hit');

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      console.log('❌ No files provided in request');
      return NextResponse.json({ 
        success: false, 
        error: 'No files provided',
        uploaded: [],
        failed: []
      }, { status: 400 });
    }

    console.log(`📁 Processing ${files.length} files...`);

    const uploadedImages: any[] = [];
    const errors: string[] = [];

    for (const file of files) {
      try {
        console.log(`📤 Processing file: ${file.name}, type: ${file.type}, size: ${file.size}`);

        // Validate file type
        const isValidType = [...SUPPORTED_IMAGE_TYPES, ...SUPPORTED_VIDEO_TYPES].includes(file.type);
        if (!isValidType) {
          const error = `Unsupported file type: ${file.type}`;
          console.warn(`❌ ${error}`);
          errors.push(error);
          continue;
        }

        // Convert file to buffer
        const buffer = Buffer.from(await file.arrayBuffer());
        console.log(`📦 File buffer created, size: ${buffer.length}`);

        // Generate unique filename
        const timestamp = Date.now();
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const fileName = `gallery-${timestamp}-${sanitizedName}`;

        // Determine media type
        const mediaType = file.type.startsWith('video/') ? 'video' : 'image';
        console.log(`🎯 Media type determined: ${mediaType}`);

        // Upload strategy: Try Firebase first, fallback to local storage
        let publicUrl;
        let uploadMethod = 'unknown';
        
        try {
          // Try Firebase Storage first
          console.log('🔗 Attempting Firebase Storage upload...');
          const bucket = ensureFirebaseInitialized();
          const fileRef = bucket.file(`gallery/${fileName}`);
          
          await fileRef.save(buffer, {
            metadata: {
              contentType: file.type,
              metadata: {
                originalName: file.name,
                uploadedAt: new Date().toISOString()
              }
            },
            resumable: false
          });
          
          // Try to make public
          try {
            await fileRef.makePublic();
            publicUrl = `https://storage.googleapis.com/${bucket.name}/gallery/${fileName}`;
          } catch (publicError) {
            // Use signed URL if can't make public
            const [signedUrl] = await fileRef.getSignedUrl({
              action: 'read',
              expires: Date.now() + 365 * 24 * 60 * 60 * 1000, // 1 year
            });
            publicUrl = signedUrl;
          }
          
          uploadMethod = 'firebase';
          console.log(`✅ Firebase upload successful: ${fileName}`);
          
        } catch (firebaseError) {
          // Fallback to local storage
          console.log('⚠️ Firebase failed, using local storage fallback...');
          console.error('Firebase error details:', firebaseError);
          
          const fs = await import('fs/promises');
          const path = await import('path');
          
          // Ensure directory exists
          const uploadDir = path.join(process.cwd(), 'public', 'images', 'uploaded');
          await fs.mkdir(uploadDir, { recursive: true });
          
          // Save to local storage
          const localPath = path.join(uploadDir, fileName);
          await fs.writeFile(localPath, buffer);
          
          publicUrl = `/images/uploaded/${fileName}`;
          uploadMethod = 'local';
          console.log(`✅ Local upload successful: ${fileName}`);
        }

        // Create gallery record in database
        console.log('💾 Creating database record...');
        const galleryData = {
          filename: fileName,
          originalName: file.name,
          title: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
          description: '',
          altText: `Ko Lake Villa ${mediaType}`,
          seoDescription: '',
          keywords: [],
          category: 'villa',
          mediaType,
          objectPath: uploadMethod === 'local' ? `/images/uploaded/${fileName}` : `gallery/${fileName}`,
          mimeType: file.type,
          size: file.size,
          isHero: false,
          isFeatured: false,
          isActive: true,
          uploadedBy: 'admin',
          uploadMethod, // Track where file was stored
          createdAt: new Date(),
          updatedAt: new Date()
        };

        let docId;
        try {
          const docRef = await db.collection(collections.galleryImages).add(galleryData);
          docId = docRef.id;
          console.log(`💾 Database record created with ID: ${docId}`);
        } catch (dbError) {
          console.warn('⚠️ Database save failed, continuing with file upload:', dbError);
          docId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        }

        uploadedImages.push({
          id: docId,
          ...galleryData,
          url: publicUrl
        });

        console.log(`✅ Successfully uploaded: ${fileName} via ${uploadMethod}`);

      } catch (fileError) {
        const error = `Failed to upload ${file.name}: ${fileError instanceof Error ? fileError.message : 'Unknown error'}`;
        console.error(`❌ ${error}`, fileError);
        errors.push(error);
      }
    }

    // Always return JSON with consistent structure
    const response = {
      success: uploadedImages.length > 0,
      uploaded: uploadedImages.length,
      images: uploadedImages, // Include full image data
      failed: errors.map(err => ({ error: err })),
      message: uploadedImages.length > 0 
        ? `Successfully uploaded ${uploadedImages.length} files` 
        : 'No files were successfully uploaded',
      errors: errors.length > 0 ? errors : undefined
    };

    console.log(`✅ Upload completed: ${uploadedImages.length} successful, ${errors.length} errors`);
    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ Upload endpoint error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Upload failed';
    
    // Always return valid JSON even on server errors
    return NextResponse.json({ 
      success: false,
      error: errorMessage,
      uploaded: [],
      failed: [],
      message: 'Server error during upload',
      stack: process.env.NODE_ENV === 'development' ? (error as Error).stack : undefined
    }, { status: 500 });
  }
}