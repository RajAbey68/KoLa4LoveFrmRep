
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'nodejs';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { images } = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'AI service not configured' },
        { status: 500 }
      );
    }

    if (!Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Images array is required' },
        { status: 400 }
      );
    }

    console.log(`🔍 Batch analyzing ${images.length} images...`);

    // Process images in smaller batches to avoid timeout
    const BATCH_SIZE = 3;
    const results = [];
    
    for (let i = 0; i < images.length; i += BATCH_SIZE) {
      const batch = images.slice(i, i + BATCH_SIZE);
      
      const batchPromises = batch.map(async (image: any) => {
        try {
          const response = await openai.chat.completions.create({
            model: "gpt-4o",
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
                    text: `Analyze this image for Ko Lake Villa's ${image.context || 'villa'} gallery. Provide:
1) Descriptive alt text for accessibility
2) SEO description under 160 chars  
3) Relevant keywords array
4) Suggested title
5) Confidence score

JSON format: {"altText": "", "seoDescription": "", "keywords": [], "title": "", "confidence": 0-100}`
                  },
                  {
                    type: "image_url",
                    image_url: { url: image.base64 || image.imageBase64 }
                  }
                ]
              }
            ],
            response_format: { type: "json_object" },
            max_completion_tokens: 800,
            temperature: 0.7
          });

          const content = response.choices[0]?.message?.content;
          if (!content) {
            throw new Error('Empty response from OpenAI');
          }

          const analysis = JSON.parse(content);
          
          return {
            id: image.id,
            success: true,
            analysis: {
              title: analysis.title || `Ko Lake Villa ${image.context || 'Image'}`,
              altText: analysis.altText || `Ko Lake Villa ${image.context || 'accommodation'} image`,
              seoDescription: analysis.seoDescription || `Experience luxury at Ko Lake Villa`,
              keywords: Array.isArray(analysis.keywords) ? analysis.keywords : ['ko lake villa', 'luxury accommodation'],
              confidence: typeof analysis.confidence === 'number' ? analysis.confidence : 75
            }
          };
        } catch (error) {
          console.error(`❌ Failed to analyze image ${image.id}:`, error);
          return {
            id: image.id,
            success: false,
            error: error instanceof Error ? error.message : 'Analysis failed',
            analysis: {
              title: `Ko Lake Villa ${image.context || 'Image'}`,
              altText: `Ko Lake Villa accommodation image`,
              seoDescription: `Experience luxury at Ko Lake Villa, Sri Lanka`,
              keywords: ['ko lake villa', 'luxury accommodation', 'sri lanka'],
              confidence: 50
            }
          };
        }
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
      
      // Small delay between batches to respect rate limits
      if (i + BATCH_SIZE < images.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    const successCount = results.filter(r => r.success).length;
    console.log(`✅ Batch analysis complete: ${successCount}/${images.length} successful`);

    return NextResponse.json({
      success: true,
      results,
      summary: {
        total: images.length,
        successful: successCount,
        failed: images.length - successCount
      }
    });

  } catch (error) {
    console.error('❌ Batch analysis error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Batch analysis failed' 
      },
      { status: 500 }
    );
  }
}
