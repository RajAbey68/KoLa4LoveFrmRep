"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import VideoOverlay from "./VideoOverlay";
import { EditableText } from "../EditableText";
import { EditableImage } from "../EditableImage";
import ReactDOM from 'react-dom'; // Import ReactDOM for preload
import Script from "next/script";
import GuestyBookingWidget from "../booking/GuestyBookingWidget";

// Static fallback images for instant loading
const FALLBACK_HERO_IMAGE = "/images/hero/pool.jpg";
const FALLBACK_LOGO = "/images/logo.jpeg";

// Utility to validate and sanitize image sources
const sanitizeImageSrc = (src: string | null | undefined): string => {
  if (!src || typeof src !== 'string' || src.trim().length === 0) {
    return FALLBACK_HERO_IMAGE;
  }
  return src.trim();
};
const FALLBACK_HERO_IMAGES = [
  "/images/hero/drone-villa.jpg",
  "/images/hero/pool.jpg",
  "/images/rooms/villa.jpg",
  "/images/rooms/master.jpg"
];

export default function HeroLanding(){
  const adminMode = false;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fadeClass, setFadeClass] = useState("opacity-100");
  const [ctaCardVisible, setCtaCardVisible] = useState(true);
  const [heroMedia, setHeroMedia] = useState<Array<{
    id: string;
    url: string;
    title: string;
    alt: string;
    mediaType: string;
  }>>(FALLBACK_HERO_IMAGES.map((img, idx) => ({
    id: `fallback-${idx}`,
    url: img,
    title: 'Ko Lake Villa',
    alt: 'Ko Lake Villa luxury accommodation',
    mediaType: 'image'
  })));

  const handleContentSave = async (id: string, value: string) => {
    try {
      await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, type: 'text', value })
      });
    } catch (error) {
      console.error('Error saving content:', error);
    }
  };

  const handleImageSave = async (id: string, imageUrl: string) => {
    try {
      await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, type: 'image', value: imageUrl })
      });
    } catch (error) {
      console.error('Error saving image:', error);
    }
  };

  // Fetch hero images from gallery API with fallback to local images
  useEffect(() => {
    const fetchHeroImages = async () => {
      try {
        const response = await fetch('/api/admin/gallery/hero');
        if (response.ok) {
          const result = await response.json();
          const data = result.images || result; // Handle both {images: [...]} and [...] formats
          if (data && data.length > 0) {
            const galleryMedia = data.map((item: any) => ({
              id: item.id || item.objectPath,
              url: item.objectPath ? `/objects/${item.objectPath}` : item.url,
              title: item.title || 'Ko Lake Villa',
              alt: item.altText || 'Ko Lake Villa luxury accommodation',
              mediaType: item.mediaType || 'image'
            }));
            setHeroMedia(galleryMedia);
            console.log('Loaded hero images from gallery API:', galleryMedia.length, 'items');
          } else {
            console.log('No hero images found in gallery, using fallback images');
            // Ensure fallback images are set immediately
            setHeroMedia(FALLBACK_HERO_IMAGES.map((img, idx) => ({
              id: `fallback-${idx}`,
              url: img,
              title: 'Ko Lake Villa',
              alt: 'Ko Lake Villa luxury accommodation',
              mediaType: 'image'
            })));
          }
        } else {
          console.log('Failed to fetch hero images, using fallback images');
          // Set fallback images immediately on API failure
          setHeroMedia(FALLBACK_HERO_IMAGES.map((img, idx) => ({
            id: `fallback-${idx}`,
            url: img,
            title: 'Ko Lake Villa',
            alt: 'Ko Lake Villa luxury accommodation',
            mediaType: 'image'
          })));
        }
      } catch (error) {
        console.error('Error fetching hero images:', error);
        console.log('Using fallback hero images due to API error');
        // Ensure fallback images are set on error
        setHeroMedia(FALLBACK_HERO_IMAGES.map((img, idx) => ({
          id: `fallback-${idx}`,
          url: img,
          title: 'Ko Lake Villa',
          alt: 'Ko Lake Villa luxury accommodation',
          mediaType: 'image'
        })));
      }
    };

    fetchHeroImages();
  }, []);

  // Image rotation with safe validation
  useEffect(() => {
    const interval = setInterval(() => {
      setFadeClass("opacity-0");

      setTimeout(() => {
        let newIndex;
        do {
          newIndex = Math.floor(Math.random() * heroMedia.length);
        } while (newIndex === currentImageIndex && heroMedia.length > 1);

        setCurrentImageIndex(newIndex);
        setFadeClass("opacity-100");
      }, 500);

    }, 4000);

    return () => clearInterval(interval);
  }, [currentImageIndex, heroMedia]);

  // Get current media item safely
  const currentMedia = heroMedia[currentImageIndex];

  // Minimal preloading to prevent blocking - only current image
  const heroImages = heroMedia.filter(item => item.mediaType === 'image');
  useEffect(() => {
    if (typeof window !== 'undefined' && heroImages.length > 0) {
      // Only preload the current visible image
      const currentImage = heroImages[currentImageIndex];
      if (currentImage?.url && 
          currentImage.url.trim() !== '' && 
          currentImage.url !== '/images/logo.jpeg' &&
          (currentImage.url.startsWith('http') || currentImage.url.startsWith('/'))) {
        try {
          ReactDOM.preload(currentImage.url, { as: 'image' });
        } catch (e) {
          console.warn(`Failed to preload current image: ${currentImage.url}`);
        }
      }
    }
  }, [heroImages, currentImageIndex]);

  if (!currentMedia) {
    return (
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
          <p className="text-blue-800 text-lg font-medium">Loading Ko Lake Villa...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Hero media with safe rendering */}
      <div className="absolute inset-0 bg-gray-900">
        {currentMedia.mediaType === 'video' ? (
          <video
            src={currentMedia.url}
            className={`w-full h-full object-contain transition-opacity duration-500 ${fadeClass}`}
            style={{ objectPosition: 'center center' }}
            autoPlay
            muted
            loop
            playsInline
            onError={(e) => {
              console.error('Video load error, switching to image');
              // Force switch to first image fallback
              setHeroMedia(prev => prev.map(item => ({ ...item, mediaType: 'image' })));
            }}
          />
        ) : (
          <Image
            src={currentMedia.url}
            alt={currentMedia.alt}
            fill
            className={`object-contain transition-opacity duration-500 ${fadeClass}`}
            style={{ objectPosition: 'center center' }}
            priority={currentImageIndex === 0}
            quality={90}
            sizes="100vw"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkrHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+kdo="
            onError={(e) => {
              console.log('Hero image missing from storage, using fallbacks');
              // Silently switch to guaranteed local fallbacks
              setHeroMedia(FALLBACK_HERO_IMAGES.map((img, idx) => ({
                id: `fallback-${idx}`,
                url: img,
                title: 'Ko Lake Villa',
                alt: 'Ko Lake Villa luxury accommodation',
                mediaType: 'image'
              })));
              setCurrentImageIndex(0);
            }}
            onLoad={() => {
              console.log('Hero image loaded successfully:', currentMedia.url);
            }}
          />
        )}

        {/* Hero rotation indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-black bg-opacity-50 px-3 py-1 rounded-full">
            <div className="flex space-x-1">
              {heroMedia.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Overlay for text contrast */}
        <div className="absolute inset-0 bg-black bg-opacity-20" />
      </div>

      {/* CTA Card */}
      {ctaCardVisible && (
        <div className="absolute left-4 md:left-8 lg:left-16 top-1/2 transform -translate-y-1/2 z-10">
          <div className="bg-white rounded-xl p-4 md:p-5 shadow-lg max-w-xs relative">
            {/* Close button for mobile space optimization */}
            <button
              onClick={() => setCtaCardVisible(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors md:hidden"
              aria-label="Close information card"
            >
              <X className="w-4 h-4" />
            </button>
          <EditableText
            id="hero-main-title"
            initialValue="Ko Lake Villa"
            element="h1"
            className="text-lg md:text-xl font-bold text-gray-900 mb-1"
            onSave={handleContentSave}
            adminMode={adminMode}
          />
          <EditableText
            id="hero-subtitle"
            initialValue="Luxury Lakefront Accommodation in Sri Lanka"
            element="p"
            className="text-gray-600 mb-1 text-sm"
            onSave={handleContentSave}
            adminMode={adminMode}
          />
          <EditableText
            id="hero-tagline"
            initialValue="Relax, Revive, Reconnect"
            element="p"
            className="text-amber-600 italic text-xs mb-4"
            onSave={handleContentSave}
            adminMode={adminMode}
          />

          <div className="space-y-2">
            {/* Enhanced Guesty Booking Widget */}
            <GuestyBookingWidget 
              listingId="ko-lake-villa-main"
              className="w-full max-w-xs"
            />
            <a
              href="/accommodation"
              className="block w-full bg-amber-600 hover:bg-amber-700 text-white text-center px-2 py-1 rounded-lg text-xs font-medium transition-colors"
            >
              <EditableText
                id="hero-rooms-button"
                initialValue="View Rooms & Rates"
                element="span"
                onSave={handleContentSave}
                adminMode={adminMode}
              />
            </a>
            <a
              href="/gallery"
              className="block w-full border border-gray-300 hover:bg-gray-50 text-gray-700 text-center px-2 py-1 rounded-lg text-xs font-medium transition-colors"
            >
              <EditableText
                id="hero-gallery-button"
                initialValue="Explore Gallery"
                element="span"
                onSave={handleContentSave}
                adminMode={adminMode}
              />
            </a>
          </div>
        </div>
      </div>
      )}

      {/* Video Overlay - CRITICAL: Always render */}
      <VideoOverlay />

      {/* Guesty Booking Widget Scripts */}
      <Script
        src="https://s3.amazonaws.com/guesty-frontend-production/search-bar-production.js"
        strategy="afterInteractive"
        onLoad={() => {
          try {
            if (typeof window !== 'undefined' && (window as any).GuestySearchBarWidget) {
              (window as any).GuestySearchBarWidget.create({
                siteUrl: "www.kolakevilla.com"
              }).catch((e: any) => {
                console.log("[Guesty Widget Error]:", e.message);
              });
            }
          } catch (e: any) {
            console.log("[Guesty Widget Error]:", e.message);
          }
        }}
      />

      {/* Debug info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 bg-black/80 text-white text-xs p-2 rounded z-50">
          Current: {currentMedia.mediaType} | Index: {currentImageIndex} | Total: {heroMedia.length}
        </div>
      )}
    </section>
  );
}