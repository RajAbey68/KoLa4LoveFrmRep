
'use client';

import React, { useEffect, useState } from 'react';
import { GalleryGrid } from '@/components/gallery/GalleryGrid';

interface GalleryItem {
  id: string;
  objectPath: string;
  mediaType: 'image' | 'video';
  title?: string;
  altText?: string;
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGallery() {
      try {
        // Load with smaller initial limit for faster response
        const res = await fetch('/api/admin/gallery?limit=20&source=firebase');
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const json = await res.json();
        
        // Use actual Firebase images from database
        console.log('Fetching actual gallery images from Firebase...');
        
        const images = json.images || [];
        const galleryItems = images.map((img: any) => ({
          id: img.id || `gallery-${Date.now()}-${Math.random()}`,
          objectPath: img.objectPath,
          mediaType: img.mediaType === 'video' ? 'video' : 'image',
          title: img.title || img.filename || 'Ko Lake Villa Image',
          altText: img.altText || img.title || 'Ko Lake Villa'
        }));
        
        setItems(galleryItems);
      } catch (e) {
        console.error('Failed to load gallery from API:', e);
        // Always show default images as fallback - these persist across deployments
        const defaultItems = [
          {
            id: 'default-villa',
            objectPath: 'hero/drone-villa.jpg',
            mediaType: 'image' as const,
            title: 'Ko Lake Villa',
            altText: 'Ko Lake Villa - Luxury Accommodation'
          },
          {
            id: 'default-pool',
            objectPath: 'hero/pool.jpg',
            mediaType: 'image' as const,
            title: 'Pool Area',
            altText: 'Swimming pool at Ko Lake Villa'
          },
          {
            id: 'default-room',
            objectPath: 'rooms/villa.jpg',
            mediaType: 'image' as const,
            title: 'Villa Room',
            altText: 'Comfortable villa accommodation'
          }
        ];
        setItems(defaultItems);
      } finally {
        setLoading(false);
      }
    }
    fetchGallery();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="pt-20">
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Ko Lake Villa Gallery
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover the beauty and luxury of Ko Lake Villa through our comprehensive gallery
              </p>
            </div>
            <GalleryGrid items={items} />

            {items.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No images yet</h3>
                <p className="text-gray-500">The gallery is being updated with beautiful photos of Ko Lake Villa.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
