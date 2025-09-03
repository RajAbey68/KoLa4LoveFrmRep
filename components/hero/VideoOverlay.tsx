'use client';

import { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, X } from 'lucide-react';
import { generateVideoPoster } from '@/lib/video-utils';

interface VideoOverlayProps {
  className?: string;
}

export default function VideoOverlay({ className = "" }: VideoOverlayProps) {
  // REGRESSION LOCK: This component size and positioning MUST NOT be changed
  // Size: w-80 h-48 (320x192px) - Position: top-20 right-4 - Z-index: z-50
  const [tourVideo, setTourVideo] = useState<{ url: string; title: string } | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Need state to store video URL and title
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [videoTitle, setVideoTitle] = useState<string>('Ko Lake Villa Tour');

  // Ensure component is mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Only run on client-side after component is mounted
    if (!mounted || typeof window === 'undefined') {
      return;
    }

    const fetchVideos = async () => {
      try {

        const abortController = new AbortController();
        const timeoutId = setTimeout(() => abortController.abort(), 10000);

        const response = await fetch('/api/admin/gallery/hero?videosOnly=true', {
          signal: abortController.signal
        }).catch(err => {
          return null;
        });

        clearTimeout(timeoutId);

        if (!response || !response.ok) {
          setIsVisible(false);
          return;
        }

        const data = await response.json();

        // Handle both success and fallback responses
        if (data.images && Array.isArray(data.images)) {
          // Check for videos using both mediaType and mimeType fields
          const videoItems = data.images.filter((item: any) => 
            item.mediaType === 'video' || 
            item.mimeType?.includes('video') ||
            item.filename?.toLowerCase().includes('.mp4')
          );

          if (videoItems.length > 0) {
            const selectedVideo = videoItems[0]; // Use first video
            const videoUrl = `/objects/${selectedVideo.objectPath}`;
            
            // ALWAYS show video widget even if file missing (shows poster with play button)
            setVideoSrc(videoUrl);
            setVideoTitle(selectedVideo.title || selectedVideo.filename || 'Ko Lake Villa Tour');
            setIsVisible(true);
            // Set tourVideo directly to ensure it shows
            setTourVideo({ 
              url: videoUrl, 
              title: selectedVideo.title || selectedVideo.filename || 'Ko Lake Villa Tour' 
            });
          } else {
            // FORCE VISIBLE: Show demo video when no real videos available
            setVideoSrc('/api/admin/gallery/thumbnail?type=video&size=1200&path=demo.mp4');
            setVideoTitle('Ko Lake Villa Tour');
            setIsVisible(true);
            // Set tourVideo directly to ensure it shows
            setTourVideo({ 
              url: '/api/admin/gallery/thumbnail?type=video&size=1200&path=demo.mp4', 
              title: 'Ko Lake Villa Tour' 
            });
          }
        } else {
          // FORCE VISIBLE: Always show video widget even when API fails
          setVideoSrc('/api/admin/gallery/thumbnail?type=video&size=1200&path=demo.mp4');
          setVideoTitle('Ko Lake Villa Tour');
          setIsVisible(true);
          setTourVideo({ 
            url: '/api/admin/gallery/thumbnail?type=video&size=1200&path=demo.mp4', 
            title: 'Ko Lake Villa Tour' 
          });
        }

      } catch (error) {
        // FORCE VISIBLE: Always show video widget even on error
        setVideoSrc('/api/admin/gallery/thumbnail?type=video&size=1200&path=demo.mp4');
        setVideoTitle('Ko Lake Villa Tour');
        setIsVisible(true);
        setTourVideo({ 
          url: '/api/admin/gallery/thumbnail?type=video&size=1200&path=demo.mp4', 
          title: 'Ko Lake Villa Tour' 
        });
      }
    };

    fetchVideos();
  }, [mounted]);

  // Remove this useEffect - it's conflicting with direct setTourVideo calls
  // The tourVideo state is now set directly in the fetchVideos function

  // Early return for server-side rendering - AFTER all hooks
  if (!mounted) {
    return null;
  }


  const togglePlay = () => {
    if (videoRef) {
      if (isPlaying) {
        videoRef.pause();
      } else {
        videoRef.play();
      }
    }
  };

  const toggleMute = () => {
    if (videoRef) {
      videoRef.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // Additional client-side check for safety
  if (typeof window === 'undefined') {
    return null;
  }
  
  if (!isVisible || !tourVideo) {
    return null;
  }

  return (
    <>
      {/* Medium overlay video player */}
      <div className={`fixed top-16 md:top-20 right-2 md:right-4 z-50 ${isExpanded ? 'hidden' : 'block'} ${className}`}>
        <div className="bg-black/95 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden">
          {/* Video Container - LOCKED SIZE: w-80 h-48 (320x192px) - DO NOT MODIFY */}
          <div className="relative w-72 h-44 md:w-80 md:h-48">
            <video
              ref={setVideoRef}
              src={tourVideo.url}
              className="w-full h-full object-contain object-center cursor-pointer"
              muted={isMuted}
              loop
              playsInline
              controls
              preload="metadata"
              poster="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjE0NCIgdmlld0JveD0iMCAwIDI1NiAxNDQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9InNreSIgeDI9IjAlIiB5Mj0iMTAwJSI+CjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM3ZGQ3Zjk7c3RvcC1vcGFjaXR5OjEiIC8+CjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzMzODRkMjtzdG9wLW9wYWNpdHk6MSIgLz4KPC9saW5lYXJHcmFkaWVudD4KPGxpbmVhckdyYWRpZW50IGlkPSJ3YXRlciIgeDI9IjAlIiB5Mj0iMTAwJSI+CjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM2NWE0Y2M7c3RvcC1vcGFjaXR5OjEiIC8+CjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzI5NzliOTtzdG9wLW9wYWNpdHk6MSIgLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8cmVjdCB3aWR0aD0iMjU2IiBoZWlnaHQ9Ijg2IiBmaWxsPSJ1cmwoI3NreSkiLz4KPHJlY3QgeT0iODYiIHdpZHRoPSIyNTYiIGhlaWdodD0iNTgiIGZpbGw9InVybCgjd2F0ZXIpIi8+Cjxwb2x5Z29uIHBvaW50cz0iODUsNzIgMTE0LDI2IDE0Myw3MiAiIGZpbGw9IiM0YTQ0M2EiLz4KPHJlY3QgeD0iMTAwIiB5PSI3MiIgd2lkdGg9IjI4IiBoZWlnaHQ9IjIwIiBmaWxsPSIjZGMyNjI2Ii8+CjxyZWN0IHg9IjEwMyIgeT0iNzUiIHdpZHRoPSI2IiBoZWlnaHQ9IjgiIGZpbGw9IiM2NjY2NjYiLz4KPHJlY3QgeD0iMTE5IiB5PSI3NSIgd2lkdGg9IjYiIGhlaWdodD0iOCIgZmlsbD0iIzY2NjY2NiIvPgo8cmVjdCB4PSIxMTAiIHk9IjgyIiB3aWR0aD0iNCIgaGVpZ2h0PSI2IiBmaWxsPSIjOGI0NTEzIi8+CjxlbGxpcHNlIGN4PSIxMjgiIGN5PSIxMTQiIHJ4PSI4NSIgcnk9IjE3IiBmaWxsPSIjMzM4NGQyIiBvcGFjaXR5PSIwLjYiLz4KPGVsbGlwc2UgY3g9IjEyOCIgY3k9IjEyMCIgcng9IjcwIiByeT0iMTIiIGZpbGw9IiM2NWE0Y2MiIG9wYWNpdHk9IjAuNCIvPgo8Y2lyY2xlIGN4PSIxMjgiIGN5PSI3MiIgcj0iMjMiIGZpbGw9IiMyNTc3NGQiIG9wYWNpdHk9IjAuNyIvPgo8Y2lyY2xlIGN4PSIxMjgiIGN5PSI3MiIgcj0iMTciIGZpbGw9IiMzNGQ1NGUiIG9wYWNpdHk9IjAuNSIvPgo8Y2lyY2xlIGN4PSIxMjgiIGN5PSI3MiIgcj0iMjgiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIxLjUiIG9wYWNpdHk9IjAuOCIvPgo8cG9seWdvbiBwb2ludHM9IjEyMiw2NSAxMzQsNjUgMTI4LDc5IiBmaWxsPSIjZmZmIi8+CjxjaXJjbGUgY3g9IjEyOCIgY3k9IjcyIiByPSI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMSIvPgo8dGV4dCB4PSIxMjgiIHk9IjEzNiIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+S28gTGFrZSBWaWxsYTwvdGV4dD4KPC9zdmc+"
              onClick={togglePlay}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onLoadedData={() => {
                console.log('VideoOverlay: Video loaded and ready to play');
                // Auto-start video on mobile for better UX
                if (videoRef && !isPlaying) {
                  videoRef.play().catch(e => console.log('VideoOverlay: Autoplay blocked:', e));
                }
              }}
              onError={(e) => {
                console.log('VideoOverlay: Video file not found, showing poster (expected behavior)');
                // Keep widget visible - just show poster when video file missing
              }}
              onCanPlay={() => {
                console.log('VideoOverlay: Video can play');
                // Ensure video starts playing on mobile
                if (videoRef && !isPlaying) {
                  videoRef.play().catch(e => console.log('VideoOverlay: Play failed:', e));
                }
              }}
            />

            {/* Controls Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-2 md:p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 md:space-x-3">
                  <button
                    onClick={togglePlay}
                    className="text-white hover:text-blue-300 transition-colors bg-black/50 p-1.5 md:p-2 rounded-full"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 md:w-5 md:h-5" /> : <Play className="w-4 h-4 md:w-5 md:h-5" />}
                  </button>

                  <button
                    onClick={toggleMute}
                    className="text-white hover:text-blue-300 transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 md:w-5 md:h-5" /> : <Volume2 className="w-4 h-4 md:w-5 md:h-5" />}
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={toggleExpanded}
                    className="text-white hover:text-blue-300 transition-colors text-xs md:text-sm bg-black/50 px-2 md:px-3 py-1 rounded-full"
                  >
                    Expand
                  </button>
                  <button
                    onClick={() => setIsVisible(false)}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded modal */}
      {isExpanded && tourVideo && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-black rounded-xl shadow-2xl overflow-hidden max-w-4xl w-full">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 flex items-center justify-between">
              <div className="text-white font-medium">{tourVideo.title}</div>
              <button
                onClick={toggleExpanded}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Container */}
            <div className="relative aspect-video">
              <video
                src={tourVideo.url}
                className="w-full h-full object-contain object-center"
                controls
                autoPlay={isPlaying}
                muted={isMuted}
                playsInline
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}