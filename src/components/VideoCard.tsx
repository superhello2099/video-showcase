'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Video } from '@/lib/videos';

interface VideoCardProps {
  video: Video;
}

export default function VideoCard({ video }: VideoCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getVideoUrl = () => {
    if (video.hostedUrl) return video.hostedUrl;
    const encodedFilename = encodeURIComponent(video.filename);
    return `/videos/${encodedFilename}`;
  };

  return (
    <Link href={`/video/${video.id}`}>
      <div 
        className="relative group rounded-lg overflow-hidden bg-gray-900 transition-transform duration-300 hover:scale-105"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Video Preview */}
        <div className="aspect-video relative">
          <video
            className="w-full h-full object-cover"
            src={getVideoUrl()}
            muted
            loop
            playsInline
            autoPlay={isHovered}
            poster={video.thumbnail}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-lg font-semibold text-white mb-1 line-clamp-1">
            {video.title}
          </h3>
          <p className="text-sm text-gray-300 line-clamp-2">
            {video.description}
          </p>
          <p className="text-xs text-gray-400 mt-2">{video.date}</p>
        </div>

        {/* Play Button Overlay */}
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
} 