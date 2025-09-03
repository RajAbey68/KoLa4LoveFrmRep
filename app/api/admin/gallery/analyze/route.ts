import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { db } from '@/lib/firebase';
import { collection, doc, updateDoc, getDocs, query, where } from 'firebase/firestore';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: NextRequest) {
  try {
    console.log('🤖 AI Analysis Request received...');

    const body = await request.json();
    console.log('📝 Request body keys:', Object.keys(body));

    const { imageBase64, filename, category = 'villa', image, base64, mediaType } = body;

    // Handle different parameter names
    const actualImageData = imageBase64 || image || base64;

    // Enhanced video analysis with GPT-5
    if (mediaType === 'video' || (filename && filename.includes('.mp4') || filename.includes('.mov') || filename.includes('.avi'))) {
      console.log('🎬 Starting GPT-5 video analysis for:', filename);
      
      const videoAnalysisPrompt = `Create professional SEO content for this Ko Lake Villa video file: "${filename}".
      
      Ko Lake Villa is a premium lakeside accommodation in Sri Lanka featuring luxury amenities, stunning lake views, beautiful gardens, spa services, and authentic Sri Lankan experiences.
      
      Generate appropriate SEO content based on the filename and villa context:
      
      Return JSON: {
        "title": "Professional video title (under 60 chars)",
        "altText": "Descriptive alt text for video content",
        "seoDescription": "Meta description (under 160 chars)",
        "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
        "confidence": 90
      }`;
      
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-5",
          messages: [
            {
              role: "system",
              content: "You are an SEO expert for Ko Lake Villa, a luxury lakeside property in Sri Lanka. Create compelling, accurate video SEO content."
            },
            {
              role: "user",
              content: videoAnalysisPrompt
            }
          ],
          response_format: { type: "json_object" },
          max_completion_tokens: 1000
        });

        const responseContent = response.choices[0]?.message?.content;
        if (!responseContent) {
          throw new Error('Empty response from video analysis');
        }

        const analysis = JSON.parse(responseContent);
        
        // Validate and enhance video analysis
        const result = {
          altText: analysis.altText || `Ko Lake Villa ${category} video showcasing luxury lakeside accommodation`,
          seoDescription: analysis.seoDescription || `Experience Ko Lake Villa's premium ${category} through this stunning video tour of our Sri Lankan lakeside retreat`,
          keywords: Array.isArray(analysis.keywords) ? analysis.keywords : ['ko lake villa', 'luxury villa', 'sri lanka', 'video tour', category],
          title: analysis.title || `Ko Lake Villa ${category} - Premium Video`,
          confidence: Math.max(80, Math.min(100, analysis.confidence || 90))
        };

        // Update document if filename provided
        if (filename) {
          const imagesRef = collection(db, 'galleryImages');
          const q = query(imagesRef, where('filename', '==', filename));
          const querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
            const imageDoc = querySnapshot.docs[0];
            await updateDoc(imageDoc.ref, {
              altText: result.altText,
              seoDescription: result.seoDescription,
              keywords: result.keywords,
              title: result.title,
              confidenceScore: result.confidence,
              analysis: result,
              updatedAt: Date.now()
            });
            console.log(`✅ Video SEO updated for: ${filename}`);
          }
        }

        console.log('✅ Video analysis completed');
        return NextResponse.json({ success: true, analysis: result });
        
      } catch (videoError) {
        console.error('❌ Video analysis failed:', videoError);
        // Fallback for videos
        const fallbackResult = {
          altText: `Ko Lake Villa ${category} video tour`,
          seoDescription: `Premium video showcasing Ko Lake Villa's luxury ${category} and Sri Lankan lakeside accommodation`,
          keywords: ['ko lake villa', 'luxury villa', 'sri lanka', 'video tour', category],
          title: `Ko Lake Villa ${category} - Video Tour`,
          confidence: 75
        };
        return NextResponse.json({ success: true, analysis: fallbackResult });
      }
    }

    if (!actualImageData) {
      console.error('❌ No image data provided in any expected field');
      console.error('❌ Available fields:', Object.keys(body));
      return NextResponse.json(
        { success: false, error: 'Image data required (imageBase64, image, or base64)' },
        { status: 400 }
      );
    }

    console.log('✅ Image data found, length:', actualImageData.length);

    if (!process.env.OPENAI_API_KEY) {
      console.error('❌ OpenAI API key not configured');
      return NextResponse.json(
        { success: false, error: 'AI service not configured' },
        { status: 500 }
      );
    }

    // Ensure proper image format for OpenAI
    let imageUrl = actualImageData;
    if (!actualImageData.startsWith('data:image/')) {
      // Extract base64 content if it includes data URL prefix
      const base64Content = actualImageData.replace(/^data:image\/[a-zA-Z]*;base64,/, '');
      imageUrl = `data:image/jpeg;base64,${base64Content}`;
    }

    console.log('🔍 Image URL format check:', imageUrl.substring(0, 50) + '...');

    // Validate base64 format
    try {
      const base64Data = imageUrl.split(',')[1];
      if (!base64Data || base64Data.length < 100) {
        throw new Error('Invalid or too small image data');
      }
      // Test if it's valid base64
      Buffer.from(base64Data, 'base64');
    } catch (e) {
      console.error('❌ Invalid base64 image data:', e instanceof Error ? e.message : 'Unknown error');
      console.error('❌ Image URL format:', imageUrl.substring(0, 100), '...');
      return NextResponse.json(
        { success: false, error: 'Invalid image format', details: e instanceof Error ? e.message : 'Unknown error' },
        { status: 400 }
      );
    }

    console.log('🔍 Calling OpenAI API for image analysis...');
    console.log('📝 Category:', category, '| Filename:', filename);

    const response = await openai.chat.completions.create({
      model: "gpt-5", // Using GPT-5 for advanced Ko Lake Villa image analysis
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
              text: `Analyze this ${category} image. Return JSON only: {"title": "Brief title", "altText": "Description", "seoDescription": "Short description", "keywords": ["word1", "word2"], "confidence": 85}`
            },
            {
              type: "image_url",
              image_url: { url: imageUrl }
            }
          ]
        }
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 2000
    });

    console.log('✅ OpenAI API response received');

    const responseContent = response.choices[0]?.message?.content;
    if (!responseContent || responseContent.trim().length === 0) {
      console.error('❌ Empty response from GPT-4 API');
      console.error('❌ Full response:', JSON.stringify(response, null, 2));

      // Check if GPT-4 used all tokens for reasoning
      const usage = response.usage;
      if (usage && usage.completion_tokens_details?.reasoning_tokens === usage.completion_tokens) {
        throw new Error('GPT-4 used all tokens for reasoning without generating output. Try simpler image or retry.');
      }

      throw new Error('GPT-4 returned empty response - API may be overloaded');
    }

    console.log('📝 GPT-4 Response Content:', responseContent.substring(0, 200));

    let analysis;
    try {
      analysis = JSON.parse(responseContent);
    } catch (parseError) {
      console.error('❌ JSON Parse Error:', parseError);
      console.error('❌ Raw content:', responseContent);
      throw new Error('Invalid JSON response from GPT-4');
    }

    // Validate required fields
    const result = {
      altText: analysis.altText || `Ko Lake Villa ${category} image`,
      seoDescription: analysis.seoDescription || `Premium ${category} at Ko Lake Villa luxury accommodation`,
      keywords: Array.isArray(analysis.keywords) ? analysis.keywords : ['ko lake villa', category, 'luxury', 'sri lanka'],
      title: analysis.title || `Ko Lake Villa ${category}`,
      confidence: Math.max(50, Math.min(100, analysis.confidence || 85))
    };

    // Find the image document in Firestore
    const imagesRef = collection(db, 'galleryImages');
    const q = query(imagesRef, where('filename', '==', filename));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.error(`❌ No image found with filename: ${filename}`);
      return NextResponse.json(
        { success: false, error: `Image with filename '${filename}' not found.` },
        { status: 404 }
      );
    }

    // Assuming filename is unique, take the first match
    const imageDoc = querySnapshot.docs[0];
    const imageId = imageDoc.id;

    // Update the document with the analysis results
    await updateDoc(doc(db, 'galleryImages', imageId), {
      altText: result.altText,
      seoDescription: result.seoDescription,
      keywords: result.keywords,
      title: result.title,
      confidence: result.confidence,
      analyzed: true // Mark as analyzed
    });

    console.log(`✅ Image document (ID: ${imageId}) updated successfully with analysis.`);

    console.log('🎯 Analysis completed successfully:', {
      title: result.title,
      confidence: result.confidence,
      keywordCount: result.keywords.length
    });

    return NextResponse.json({
      success: true,
      analysis: result,
      message: `Image '${filename}' analyzed and updated successfully.`
    });
  } catch (error) {
    console.error('❌ Gallery analysis error:', error);

    // Provide detailed error information
    let errorMessage = 'Failed to analyze image';
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        errorMessage = 'OpenAI API key invalid or missing';
      } else if (error.message.includes('quota')) {
        errorMessage = 'OpenAI API quota exceeded';
      } else if (error.message.includes('rate limit')) {
        errorMessage = 'Rate limit exceeded, please try again later';
      } else if (error.message.includes('not found')) {
        errorMessage = error.message;
      } else {
        errorMessage = error.message;
      }
    }

    return NextResponse.json(
      { success: false, error: errorMessage, details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}