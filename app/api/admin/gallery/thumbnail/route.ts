import { NextRequest, NextResponse } from 'next/server';
import { ObjectStorageService } from '@/server/objectStorage';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');
    const type = searchParams.get('type') || 'image';
    const size = parseInt(searchParams.get('size') || '300', 10);
    const width = parseInt(searchParams.get('width') || size.toString(), 10);
    const height = parseInt(searchParams.get('height') || Math.floor(width * 0.75).toString(), 10);

    if (!path) {
      return new NextResponse('Missing path parameter', { status: 400 });
    }

    const storage = new ObjectStorageService();

    if (type === 'video') {
      // Enhanced video poster with better branding
      const svgPoster = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${height}'>
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#1e3a8a;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#3730a3;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#0f172a;stop-opacity:1" />
          </linearGradient>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#000000" flood-opacity="0.3"/>
          </filter>
        </defs>
        <rect width='${width}' height='${height}' fill='url(#bg)'/>
        <circle cx='${width/2}' cy='${height/2}' r='${Math.min(width, height) * 0.12}' fill='#ffffff' opacity='0.95' filter="url(#shadow)"/>
        <polygon points='${width/2 - Math.min(width, height) * 0.04},${height/2 - Math.min(width, height) * 0.06} ${width/2 - Math.min(width, height) * 0.04},${height/2 + Math.min(width, height) * 0.06} ${width/2 + Math.min(width, height) * 0.06},${height/2}' fill='#1e3a8a'/>
        <text x='${width/2}' y='${height * 0.8}' text-anchor='middle' fill='#e2e8f0' font-size='${Math.min(width, height) * 0.05}' font-family='Arial, sans-serif' font-weight='600'>Ko Lake Villa</text>
        <text x='${width/2}' y='${height * 0.88}' text-anchor='middle' fill='#94a3b8' font-size='${Math.min(width, height) * 0.03}' font-family='Arial, sans-serif'>Luxury Experience</text>
      </svg>`;

      return new NextResponse(svgPoster, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=86400',
          'X-Thumbnail-Type': 'video-poster',
        },
      });
    }

    // For images, try to get from storage and resize
    try {
      // First try local storage for uploaded files
      if (path.startsWith('images/uploaded/') || path.startsWith('/images/uploaded/')) {
        const fs = require('fs').promises;
        const localPath = path.startsWith('/') ? `./public${path}` : `./public/${path}`;
        console.log(`Trying local file: ${localPath}`);
        
        try {
          const buffer = await fs.readFile(localPath);
          console.log(`✅ Local file found: ${localPath}, size: ${buffer.length}`);
          
          // Use Sharp to resize the image for thumbnails
          const sharp = require('sharp');
          const resizedBuffer = await sharp(buffer)
            .resize(width, height, {
              fit: 'cover',
              position: 'center'
            })
            .jpeg({ quality: 85 })
            .toBuffer();

          return new NextResponse(resizedBuffer, {
            headers: {
              'Content-Type': 'image/jpeg',
              'Cache-Control': 'public, max-age=86400',
              'X-Thumbnail-Type': 'local-image-resized',
              'X-Original-Size': buffer.length.toString(),
              'X-Thumbnail-Size': resizedBuffer.length.toString(),
            },
          });
        } catch (localError) {
          console.log(`❌ Local file not found: ${localPath}`);
        }
      }

      // Clean path - remove public/ prefix if it exists since Firebase Storage doesn't use it
      const cleanPath = path.replace(/^public\//, '');
      console.log(`Fetching image thumbnail for path: ${path} -> cleaned: ${cleanPath}, size: ${width}x${height}`);
      const buffer = await storage.getObject(cleanPath);

      if (!buffer || buffer.length === 0) {
        throw new Error('Empty buffer returned from storage');
      }

      // Use Sharp to resize the image for thumbnails
      const sharp = require('sharp');
      const resizedBuffer = await sharp(buffer)
        .resize(width, height, {
          fit: 'cover',
          position: 'center'
        })
        .jpeg({ quality: 85 })
        .toBuffer();

      return new NextResponse(resizedBuffer, {
        headers: {
          'Content-Type': 'image/jpeg',
          'Cache-Control': 'public, max-age=86400',
          'X-Thumbnail-Type': 'image-resized',
          'X-Original-Size': buffer.length.toString(),
          'X-Thumbnail-Size': resizedBuffer.length.toString(),
        },
      });
    } catch (error) {
      console.error(`Image thumbnail error for ${path}:`, error);

      // Enhanced image placeholder
      const placeholderSvg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${height}'>
        <defs>
          <linearGradient id="placeholder-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#f8fafc;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#e2e8f0;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width='${width}' height='${height}' fill='url(#placeholder-bg)' stroke='#cbd5e1' stroke-width='2'/>
        <circle cx='${width * 0.3}' cy='${height * 0.3}' r='${Math.min(width, height) * 0.08}' fill='#94a3b8'/>
        <path d='M${width * 0.2} ${height * 0.6} L${width * 0.4} ${height * 0.45} L${width * 0.6} ${height * 0.65} L${width * 0.8} ${height * 0.5} L${width * 0.8} ${height * 0.8} L${width * 0.2} ${height * 0.8} Z' fill='#64748b'/>
        <text x='${width/2}' y='${height * 0.92}' text-anchor='middle' fill='#64748b' font-size='${Math.min(width, height) * 0.08}' font-family='Arial, sans-serif'>Image</text>
      </svg>`;

      return new NextResponse(placeholderSvg, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=300',
          'X-Thumbnail-Type': 'image-placeholder',
          'X-Error': error instanceof Error ? error.message : 'Unknown error',
        },
      });
    }
  } catch (error) {
    console.error('Thumbnail generation error:', error);

    // Error fallback SVG
    const errorSvg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200'>
      <rect width='300' height='200' fill='#fee2e2'/>
      <text x='150' y='100' text-anchor='middle' fill='#dc2626' font-size='16' font-family='Arial, sans-serif'>Error</text>
    </svg>`;

    return new NextResponse(errorSvg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'no-cache',
        'X-Thumbnail-Type': 'error',
      },
      status: 500,
    });
  }
}