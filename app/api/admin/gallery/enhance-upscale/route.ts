import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, doc, updateDoc, getDoc } from "firebase/firestore";
import sharp from "sharp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** POST { id: string, scale?: 2|4 } */
export async function POST(req: NextRequest) {
  try {
    const { id, scale = 2 } = await req.json().catch(()=>({}));
    if (!id) return NextResponse.json({ ok:false, error:"Missing id" }, { status:400 });
    
    console.log(`🎨 Starting Sharp ${scale}x upscaling for image: ${id}`);
    
    // Get image data from Firestore
    const imageRef = doc(collection(db, 'galleryImages'), id);
    const imageDoc = await getDoc(imageRef);
    
    if (!imageDoc.exists()) {
      return NextResponse.json({ ok:false, error:"Image not found" }, { status:404 });
    }
    
    const imageData = imageDoc.data();
    const imageUrl = `/objects/${imageData.objectPath}`;
    
    // Fetch the image
    const fullUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5000'}${imageUrl}`;
    const response = await fetch(fullUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }
    
    const inputBuffer = Buffer.from(await response.arrayBuffer());
    console.log(`📸 Original image size: ${inputBuffer.length} bytes`);

    // Get original dimensions
    const { width, height } = await sharp(inputBuffer).metadata();
    const targetWidth = (width || 800) * scale;
    const targetHeight = (height || 600) * scale;
    
    // Use Sharp for upscaling with high-quality interpolation
    const upscaledResult = await sharp(inputBuffer)
      .resize(targetWidth, targetHeight, { 
        kernel: sharp.kernel.lanczos3,
        fit: 'fill'
      })
      .withMetadata()
      .toBuffer();
    
    // Optimize the upscaled image
    const optimizedBuffer = await sharp(upscaledResult)
      .jpeg({ quality: 92, progressive: true })
      .toBuffer();

    console.log(`✅ Sharp upscaling completed - ${inputBuffer.length} → ${optimizedBuffer.length} bytes`);

    // Convert to base64 for response
    const enhancedBase64 = optimizedBuffer.toString('base64');
    const enhancedDataUrl = `data:image/jpeg;base64,${enhancedBase64}`;

    // Create variant record
    const variant = { 
      kind: `upscale-${scale}x`, 
      dataUrl: enhancedDataUrl,
      createdAt: Date.now(),
      originalSize: inputBuffer.length,
      enhancedSize: optimizedBuffer.length,
      scale: scale,
      model: "SHARP_LANCZOS3"
    };

    // Update Firestore with the new variant
    const existingVariants = imageData.variants || [];
    await updateDoc(imageRef, { 
      variants: [...existingVariants, variant], 
      updatedAt: new Date().toISOString()
    });

    return NextResponse.json({ 
      ok: true, 
      variant,
      enhancedImage: enhancedDataUrl,
      stats: {
        originalSize: inputBuffer.length,
        enhancedSize: optimizedBuffer.length,
        scale: scale,
        compressionRatio: (optimizedBuffer.length / inputBuffer.length).toFixed(2)
      }
    });
    
  } catch (error: any) {
    console.error("❌ Sharp upscaling error:", error);
    return NextResponse.json({ 
      ok: false, 
      error: error.message || "Upscaling failed" 
    }, { status: 500 });
  }
}