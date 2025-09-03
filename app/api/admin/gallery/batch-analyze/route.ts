import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const { images } = await request.json();
    
    if (!images || !Array.isArray(images)) {
      return NextResponse.json(
        { success: false, error: 'Images array required' },
        { status: 400 }
      );
    }

    // Process images in parallel with controlled concurrency
    const BATCH_SIZE = 3;
    const results = [];
    
    for (let i = 0; i < images.length; i += BATCH_SIZE) {
      const batch = images.slice(i, i + BATCH_SIZE);
      
      const batchPromises = batch.map(async (image: any) => {
        try {
          const response = await openai.chat.completions.create({
            model: "gpt-5", // GPT-5 provides enhanced reasoning capabilities for Ko Lake Villa's AI gallery analysis
            messages: [
              {
                role: "system",
                content: "You are an expert at analyzing luxury villa and accommodation images for Ko Lake Villa, a premium lakeside property in Sri Lanka. Generate SEO-optimized descriptions, alt text, and keywords. Respond in JSON format."
              },
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: `Analyze this image for Ko Lake Villa's ${image.category || 'villa'} gallery. Provide: 1) descriptive alt text for accessibility, 2) SEO description under 160 chars, 3) relevant keywords array, 4) suggested title. JSON format: {"altText": "", "seoDescription": "", "keywords": [], "title": "", "confidence": 0-100}`
                  },
                  {
                    type: "image_url",
                    image_url: { url: image.imageBase64 }
                  }
                ]
              }
            ],
            response_format: { type: "json_object" },
            max_completion_tokens: 500
          });

          const analysis = JSON.parse(response.choices[0].message.content || '{}');
          
          return {
            filename: image.filename,
            success: true,
            analysis: {
              altText: analysis.altText || '',
              seoDescription: analysis.seoDescription || '',
              keywords: analysis.keywords || [],
              title: analysis.title || image.filename,
              confidence: analysis.confidence || 75
            }
          };
        } catch (error) {
          console.error(`Analysis failed for ${image.filename}:`, error);
          return {
            filename: image.filename,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
          };
        }
      });
      
      const batchResults = await Promise.allSettled(batchPromises);
      results.push(...batchResults.map(result => 
        result.status === 'fulfilled' ? result.value : { success: false, error: 'Promise rejected' }
      ));
      
      // Small delay between batches to avoid overwhelming the API
      if (i + BATCH_SIZE < images.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      results,
      processed: results.length,
      successful: results.filter(r => r.success).length
    });
  } catch (error) {
    console.error('Batch analysis error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process batch analysis' },
      { status: 500 }
    );
  }
}