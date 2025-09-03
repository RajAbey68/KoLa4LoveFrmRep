import { NextResponse } from "next/server";
import { sanitizeInput, logSecurityEvent } from "@/lib/security";
import { withCorsJson, corsPreflight } from "@/utils/cors";
import { z } from "zod";

const enquirySchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(255),
  message: z.string().min(10).max(2000),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  rooms: z.number().int().min(1).max(20).optional(),
  guests: z.number().int().min(1).max(50).optional(),
});

type Enquiry = z.infer<typeof enquirySchema>;

export const runtime = "nodejs";

// Rate limiting map (basic implementation)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function getRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 5;
  
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (record.count >= maxRequests) {
    return false;
  }
  
  record.count++;
  return true;
}

export async function POST(req: Request) {
  try {
    // Basic rate limiting
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0] : "unknown";
    
    if (!getRateLimit(ip)) {
      logSecurityEvent("enquiry_rate_limit_exceeded", { ip });
      return withCorsJson({ ok: false, error: "Too many requests" }, 429, req);
    }

    const payload = await req.json();
    
    // Validate input with Zod
    const validationResult = enquirySchema.safeParse(payload);
    if (!validationResult.success) {
      logSecurityEvent("enquiry_validation_failed", { errors: validationResult.error.errors });
      return withCorsJson({ ok: false, error: "Invalid input", details: validationResult.error.errors }, 400, req);
    }

    const clean = sanitizeInput(validationResult.data);
    
    // TODO: Persist to database and send email notification
    // For now, just log the validated enquiry
    console.log("Valid enquiry received:", clean);
    
    return withCorsJson({ ok: true, message: "Enquiry received successfully" }, 200, req);
  } catch (e: any) {
    logSecurityEvent("enquiry_post_error", { error: e?.message });
    return withCorsJson({ ok: false, error: "Invalid request" }, 400, req);
  }
}

export async function OPTIONS(req: Request) {
  return corsPreflight(req);
}

export async function GET(req: Request) { 
  return withCorsJson({ ok: true, service: "enquiries", status: "operational" }, 200, req); 
}
