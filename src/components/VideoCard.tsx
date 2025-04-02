'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Video } from '@/lib/videos';
import { FaPlay } from 'react-icons/fa';
import { useState, useRef, useEffect } from 'react';

interface VideoCardProps {
  video: Video;
}

export default function VideoCard({ video }: VideoCardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // 获取视频URL，优先使用托管URL
  const getVideoUrl = () => {
    return video.hostedUrl || `/videos/${video.filename}`;
  };

  useEffect(() => {
    if (videoRef.current) {
      const generateThumbnail = () => {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current!.videoWidth;
        canvas.height = videoRef.current!.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(videoRef.current!, 0, 0, canvas.width, canvas.height);
          setThumbnail(canvas.toDataURL('image/jpeg'));
          setIsLoading(false);
        }
      };

      videoRef.current.addEventListener('loadeddata', generateThumbnail);
      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener('loadeddata', generateThumbnail);
        }
      };
    }
  }, []);

  return (
    <Link href={`/videos/${video.id}`}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="relative group overflow-hidden rounded-xl bg-gray-900/50 backdrop-blur-sm"
      >
        <div className="aspect-video relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
              <div className="w-8 h-8 border-4 border-white/20 rounded-full animate-spin border-t-white"></div>
            </div>
          )}
          {thumbnail ? (
            <img 
              src={thumbnail} 
              alt={video.title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <video
              ref={videoRef}
              src={getVideoUrl()}
              className="w-full h-full object-cover"
              preload="metadata"
            />
          )}
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300" />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
            >
              <FaPlay className="text-white text-2xl ml-1" />
            </motion.div>
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-2xl font-semibold text-white mb-2">{video.title}</h3>
          <p className="text-lg text-gray-300 mb-3">{video.description}</p>
          <p className="text-sm text-gray-400">{video.date}</p>
        </div>
      </motion.div>
    </Link>
  );
} 