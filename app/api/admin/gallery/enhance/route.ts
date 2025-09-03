
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/firebase-admin-fixed";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST body:
 * { galleryId: string, model: "realesrgan|gfpgan|codeformer|swinir",
 *   preset?: "small|medium|full", // maps to parameters
 *   params?: Record<string, any>  // optional override
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    
    if (!body?.galleryId || !body?.model) {
      return NextResponse.json({ 
        success: false, 
        error: "Missing galleryId or model" 
      }, { status: 400 });
    }

    // Validate model
    const validModels = ["realesrgan", "gfpgan", "codeformer", "swinir"];
    if (!validModels.includes(body.model)) {
      return NextResponse.json({ 
        success: false, 
        error: `Invalid model. Must be one of: ${validModels.join(', ')}` 
      }, { status: 400 });
    }

    // Check if gallery item exists
    const db = getDb();
    if (!db) {
      return NextResponse.json({ 
        success: false, 
        error: 'Database not available during build phase' 
      }, { status: 503 });
    }
    
    const galleryRef = db.collection('galleryImages').doc(body.galleryId);
    const galleryDoc = await galleryRef.get();
    
    if (!galleryDoc.exists) {
      return NextResponse.json({ 
        success: false, 
        error: `Gallery item not found: ${body.galleryId}` 
      }, { status: 404 });
    }

    const job = {
      galleryId: String(body.galleryId),
      model: String(body.model),
      preset: body.preset || "medium",
      params: body.params || {},
      status: "queued",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      originalImagePath: galleryDoc.data()?.objectPath
    };

    const ref = await db!.collection("enhanceJobs").add(job);
    
    return NextResponse.json({ 
      success: true, 
      jobId: ref.id,
      message: `Enhancement job queued for ${body.model} model` 
    });

  } catch (error) {
    console.error('Enhancement API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: "Internal server error" 
    }, { status: 500 });
  }
}

// GET endpoint to check job status
export async function GET(req: NextRequest) {
  try {
    const db = getDb();
    if (!db) {
      return NextResponse.json({ 
        success: false, 
        error: 'Database not available during build phase' 
      }, { status: 503 });
    }

    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get('jobId');
    const galleryId = searchParams.get('galleryId');

    if (jobId) {
      // Get specific job status
      const jobDoc = await db.collection("enhanceJobs").doc(jobId).get();
      if (!jobDoc.exists) {
        return NextResponse.json({ success: false, error: "Job not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, job: jobDoc.data() });
    }

    if (galleryId) {
      // Get all jobs for a gallery item
      const jobsSnapshot = await db.collection("enhanceJobs")
        .where("galleryId", "==", galleryId)
        .orderBy("createdAt", "desc")
        .get();
      
      const jobs = jobsSnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
      return NextResponse.json({ success: true, jobs });
    }

    // Get all recent jobs
    const jobsSnapshot = await db.collection("enhanceJobs")
      .orderBy("createdAt", "desc")
      .limit(20)
      .get();
    
    const jobs = jobsSnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ success: true, jobs });

  } catch (error) {
    console.error('Enhancement status API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: "Internal server error" 
    }, { status: 500 });
  }
}
