import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, doc, updateDoc, getDoc } from "firebase/firestore";
import sharp from "sharp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** POST { id: string } -> writes new variant */
export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json().catch(()=>({}));
    if (!id) return NextResponse.json({ ok:false, error:"Missing id" }, { status:400 });

    console.log(`🎨 Starting basic enhancement for image: ${id}`);
    
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

    // Basic enhancement: normalize, sharpen, optimize
    const enhancedBuffer = await sharp(inputBuffer)
      .normalize()                    // Auto-contrast adjustment
      .sharpen({ sigma: 1 })          // Light sharpening
      .modulate({ 
        brightness: 1.05,             // Slight brightness boost
        saturation: 1.1               // Enhanced colors
      })
      .withMetadata({ icc: "sRGB" })  // Ensure sRGB color space
      .jpeg({ quality: 88, progressive: true })
      .toBuffer();

    console.log(`✅ Basic enhancement completed - ${inputBuffer.length} → ${enhancedBuffer.length} bytes`);

    // Convert to base64 for response
    const enhancedBase64 = enhancedBuffer.toString('base64');
    const enhancedDataUrl = `data:image/jpeg;base64,${enhancedBase64}`;

    // Create variant record
    const variant = { 
      kind: "basic", 
      dataUrl: enhancedDataUrl,
      createdAt: Date.now(),
      originalSize: inputBuffer.length,
      enhancedSize: enhancedBuffer.length,
      enhancements: ["normalize", "sharpen", "color_boost"]
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
        enhancedSize: enhancedBuffer.length,
        compressionRatio: (enhancedBuffer.length / inputBuffer.length).toFixed(2)
      }
    });
    
  } catch (error: any) {
    console.error("❌ Basic enhancement error:", error);
    return NextResponse.json({ 
      ok: false, 
      error: error.message || "Enhancement failed" 
    }, { status: 500 });
  }
}