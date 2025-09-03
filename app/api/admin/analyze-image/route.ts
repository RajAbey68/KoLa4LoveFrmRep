
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'nodejs';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { image, context, filename } = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      console.error('❌ OPENAI_API_KEY not configured');
      return NextResponse.json(
        { success: false, error: 'AI service not configured' },
        { status: 500 }
      );
    }

    if (!image) {
      return NextResponse.json(
        { success: false, error: 'Image data is required' },
        { status: 400 }
      );
    }

    // Ensure proper image format for OpenAI
    let imageUrl = image;
    if (!imageUrl.startsWith('data:image/')) {
      // If it's a base64 string without proper data URL format
      const base64Content = imageUrl.replace(/^data:.*;base64,/, '').replace(/^data:/, '');
      imageUrl = `data:image/jpeg;base64,${base64Content}`;
    }

    // Validate that we have a proper base64 image
    if (!imageUrl.includes('base64,')) {
      console.error('❌ Invalid image format - not base64 encoded');
      throw new Error('Image must be base64 encoded for AI analysis');
    }

    // Validate base64 content
    try {
      const base64Data = imageUrl.split('base64,')[1];
      if (!base64Data || base64Data.length < 500) {
        throw new Error('Image data too small or invalid');
      }
      
      // Test decode the base64 to ensure it's valid
      const buffer = Buffer.from(base64Data, 'base64');
      if (buffer.length < 100) {
        throw new Error('Decoded image too small');
      }
      
      console.log(`✅ Image validation passed - size: ${buffer.length} bytes`);
    } catch (validationError) {
      console.error('❌ Image validation failed:', validationError);
      throw new Error('Invalid image data format');
    }

    console.log('🔍 Analyzing image with AI...');
    console.log('📝 Context:', context, '| Filename:', filename);

    const response = await openai.chat.completions.create({
      model: "gpt-5", // Using GPT-5 as per user preferences
      messages: [
        {
          role: "system",
          content: "You are an expert at analyzing luxury villa and accommodation images for Ko Lake Villa, a premium lakeside property in Sri Lanka. Generate SEO-optimized descriptions, alt text, and keywords. Always respond with valid JSON."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this Ko Lake Villa ${context || 'accommodation'} image. Generate:
1. A compelling title (max 60 chars)
2. Accessible alt text describing the image
3. SEO description (max 160 chars) 
4. Relevant keywords array (5-8 keywords)
5. Confidence score (0-100)

Focus on luxury accommodation, lakeside location, Sri Lankan setting, and guest experience.

Respond with JSON only: {"title": "...", "altText": "...", "seoDescription": "...", "keywords": ["..."], "confidence": 85}`
            },
            {
              type: "image_url",
              image_url: { url: imageUrl }
            }
          ]
        }
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 1000,
      temperature: 0.7
    });

    console.log('✅ OpenAI API response received');

    const responseContent = response.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error('Empty response from OpenAI');
    }

    let analysis;
    try {
      analysis = JSON.parse(responseContent);
    } catch (parseError) {
      console.error('❌ Failed to parse OpenAI JSON response:', parseError);
      throw new Error('Invalid JSON response from AI');
    }

    // Ensure required fields exist with fallbacks
    const result = {
      title: analysis.title || `Ko Lake Villa ${context || 'Image'}`,
      altText: analysis.altText || `Ko Lake Villa ${context || 'accommodation'} image`,
      seoDescription: analysis.seoDescription || `Experience luxury at Ko Lake Villa - ${context || 'premium accommodation'} in Sri Lanka`,
      keywords: Array.isArray(analysis.keywords) ? analysis.keywords : ['ko lake villa', 'luxury accommodation', 'sri lanka'],
      confidence: typeof analysis.confidence === 'number' ? analysis.confidence : 75
    };

    console.log('✅ AI Analysis Result:', {
      title: result.title,
      confidence: result.confidence,
      keywordCount: result.keywords.length
    });

    return NextResponse.json({
      success: true,
      analysis: result
    });

  } catch (error) {
    console.error('❌ AI image analysis error:', error);
    
    // Return fallback analysis instead of complete failure
    const fallbackAnalysis = {
      title: `Ko Lake Villa Image`,
      altText: `Ko Lake Villa accommodation - luxury lakeside property in Sri Lanka`,
      seoDescription: `Experience premium accommodation at Ko Lake Villa, a luxury lakeside retreat in Sri Lanka featuring world-class amenities and stunning natural surroundings.`,
      keywords: ['ko lake villa', 'luxury accommodation', 'sri lanka', 'lakeside villa', 'premium hotel'],
      confidence: 50
    };

    return NextResponse.json({
      success: true,
      analysis: fallbackAnalysis,
      fallback: true,
      error: error instanceof Error ? error.message : 'AI analysis failed'
    });
  }
}
