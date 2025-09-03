
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'nodejs';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, category, existingTitle, existingDescription } = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'AI service not configured' },
        { status: 500 }
      );
    }

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, error: 'Image URL is required' },
        { status: 400 }
      );
    }

    console.log('🎯 Generating SEO content for', category, 'image...');

    const contextPrompt = `Generate SEO-optimized content for this Ko Lake Villa ${category || 'accommodation'} image.

Current content:
- Title: ${existingTitle || 'Not set'}
- Description: ${existingDescription || 'Not set'}

Requirements:
1. SEO title (max 60 characters, include "Ko Lake Villa")
2. Meta description (max 160 characters, compelling and descriptive)
3. Alt text (descriptive, accessible, include location context)
4. Keywords array (5-8 relevant terms for Sri Lankan luxury accommodation)
5. Focus keyword (primary SEO target)

Focus on luxury accommodation, lakeside location, Sri Lankan hospitality, and guest experience.

Respond with JSON: {"title": "...", "description": "...", "altText": "...", "keywords": [...], "focusKeyword": "..."}`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are an SEO expert specializing in luxury hospitality and accommodation marketing. Generate compelling, search-optimized content that appeals to travelers seeking premium experiences in Sri Lanka."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: contextPrompt
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
      temperature: 0.8
    });

    const responseContent = response.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error('Empty response from OpenAI');
    }

    let seoContent;
    try {
      seoContent = JSON.parse(responseContent);
    } catch (parseError) {
      console.error('❌ Failed to parse SEO JSON response:', parseError);
      throw new Error('Invalid JSON response from AI');
    }

    // Ensure all required fields exist with fallbacks
    const result = {
      title: seoContent.title || `Ko Lake Villa - Luxury ${category || 'Accommodation'}`,
      description: seoContent.description || `Experience luxury at Ko Lake Villa, a premium lakeside retreat in Sri Lanka featuring world-class amenities and stunning natural surroundings.`,
      altText: seoContent.altText || `Ko Lake Villa ${category || 'accommodation'} - luxury lakeside property in Sri Lanka`,
      keywords: Array.isArray(seoContent.keywords) ? seoContent.keywords : [
        'ko lake villa',
        'luxury accommodation sri lanka',
        'lakeside villa',
        'premium hotel sri lanka',
        'luxury resort'
      ],
      focusKeyword: seoContent.focusKeyword || 'ko lake villa luxury accommodation'
    };

    console.log('✅ SEO Content Generated:', {
      titleLength: result.title.length,
      descriptionLength: result.description.length,
      keywordCount: result.keywords.length
    });

    return NextResponse.json({
      success: true,
      seoContent: result
    });

  } catch (error) {
    console.error('❌ SEO generation error:', error);
    
    // Return fallback SEO content
    const fallbackSEO = {
      title: `Ko Lake Villa - Luxury Accommodation Sri Lanka`,
      description: `Experience premium accommodation at Ko Lake Villa, a luxury lakeside retreat in Sri Lanka featuring world-class amenities, stunning lake views, and exceptional hospitality.`,
      altText: `Ko Lake Villa accommodation - luxury lakeside property in Sri Lanka`,
      keywords: [
        'ko lake villa',
        'luxury accommodation sri lanka',
        'lakeside villa',
        'premium hotel sri lanka',
        'luxury resort',
        'sri lanka vacation',
        'lake view accommodation'
      ],
      focusKeyword: 'ko lake villa luxury accommodation'
    };

    return NextResponse.json({
      success: true,
      seoContent: fallbackSEO,
      fallback: true,
      error: error instanceof Error ? error.message : 'SEO generation failed'
    });
  }
}
