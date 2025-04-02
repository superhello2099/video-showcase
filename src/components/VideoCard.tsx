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
    <Link href={`/video/${video.id}`} className="block h-full">
      <div 
        className="relative h-full rounded-lg overflow-hidden bg-gray-800 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-black/30"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Video Preview */}
        <div className="absolute inset-0">
          <video
            className="w-full h-full object-cover"
            src={getVideoUrl()}
            muted
            loop
            playsInline
            autoPlay={isHovered}
            poster={video.thumbnail}
          />
          <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-50' : 'opacity-70'}`} />
        </div>

        {/* Content */}
        <div className="absolute inset-x-0 bottom-0 p-4 flex flex-col justify-end min-h-[40%]">
          <h3 className="text-lg font-medium text-white mb-2 line-clamp-1">
            {video.title}
          </h3>
          <p className="text-sm text-gray-300 line-clamp-2 opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
            {video.description}
          </p>
        </div>

        {/* Play Button */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isHovered ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
          <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur flex items-center justify-center border border-white/20">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
} 