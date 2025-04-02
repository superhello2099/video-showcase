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
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const getVideoUrl = () => {
    if (video.hostedUrl) return video.hostedUrl;
    const encodedFilename = encodeURIComponent(video.filename);
    return `/videos/${encodedFilename}`;
  };

  useEffect(() => {
    if (videoRef.current) {
      const generateThumbnail = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = videoRef.current!.videoWidth;
          canvas.height = videoRef.current!.videoHeight;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(videoRef.current!, 0, 0, canvas.width, canvas.height);
            setThumbnail(canvas.toDataURL('image/jpeg'));
            setIsLoading(false);
          }
        } catch (error) {
          console.error('Error generating thumbnail:', error);
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
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative overflow-hidden rounded-lg bg-black shadow-lg hover:shadow-xl transition-shadow duration-300"
      >
        <div className="aspect-video relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <div className="w-8 h-8 border-3 border-blue-500/20 rounded-full animate-spin border-t-blue-500"></div>
            </div>
          )}
          {thumbnail ? (
            <motion.img 
              src={thumbnail} 
              alt={video.title}
              initial={false}
              animate={{ scale: isHovered ? 1.05 : 1 }}
              transition={{ duration: 0.3 }}
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
          <motion.div 
            initial={false}
            animate={{ opacity: isHovered ? 0.7 : 0.4 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"
          />
          <motion.div 
            initial={false}
            animate={{ 
              scale: isHovered ? 1.1 : 1,
              y: isHovered ? -2 : 0
            }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-12 h-12 rounded-full bg-blue-500/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <FaPlay className="text-white text-sm ml-1" />
            </div>
          </motion.div>
        </div>
        <motion.div 
          initial={false}
          animate={{ y: isHovered ? -2 : 0 }}
          transition={{ duration: 0.3 }}
          className="p-4"
        >
          <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">{video.title}</h3>
          <p className="text-sm text-gray-300 mb-3 line-clamp-2">{video.description}</p>
          <p className="text-xs text-gray-400 font-medium">{video.date}</p>
        </motion.div>
      </motion.div>
    </Link>
  );
} 