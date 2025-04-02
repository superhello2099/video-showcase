'use client';

import { motion } from 'framer-motion';
import { Video } from '@/lib/videos';
import { FaArrowLeft, FaPlay, FaPause, FaExpand } from 'react-icons/fa';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

interface VideoPlayerProps {
  video: Video;
}

export default function VideoPlayer({ video }: VideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // 获取视频URL，优先使用托管URL
  const getVideoUrl = () => {
    if (video.hostedUrl) return video.hostedUrl;
    // 确保文件名中的空格被正确编码
    const encodedFilename = encodeURIComponent(video.filename);
    return `/videos/${encodedFilename}`;
  };

  const handleError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error('Video error:', e);
    const videoElement = e.target as HTMLVideoElement;
    setError(`Failed to load video: ${videoElement.error?.message || 'Unknown error'}`);
    setIsLoading(false);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error("Error attempting to play:", error);
            setError("Failed to play video. Please try again.");
          });
        }
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progress);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const progressBar = e.currentTarget;
      const rect = progressBar.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = (x / rect.width) * 100;
      const time = (percentage / 100) * videoRef.current.duration;
      videoRef.current.currentTime = time;
      setProgress(percentage);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setIsLoading(false);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
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
          }
        } catch (error) {
          console.error('Error generating thumbnail:', error);
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
    <div className="w-full max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative group bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden shadow-2xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="absolute top-6 left-6 z-10"
        >
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-lg flex items-center justify-center border border-white/20 shadow-lg hover:bg-white/20 transition-all duration-300"
            >
              <FaArrowLeft className="text-white text-lg" />
            </motion.div>
          </Link>
        </motion.div>
        
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
            <div className="w-16 h-16 border-4 border-blue-500/20 rounded-full animate-spin border-t-blue-500"></div>
          </div>
        )}
        
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-6">
            <div className="max-w-md text-center">
              <p className="text-red-400 text-lg mb-4">⚠️ {error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              src={getVideoUrl()}
              className="w-full aspect-video object-contain bg-black"
              poster={thumbnail || undefined}
              onLoadedMetadata={handleLoadedMetadata}
              onTimeUpdate={handleTimeUpdate}
              onError={handleError}
              playsInline
              preload="metadata"
            />
            
            <motion.div 
              initial={false}
              animate={{ opacity: isHovered ? 1 : 0 }}
              className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80"
            >
              <button
                onClick={togglePlay}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-blue-500/80 backdrop-blur-sm flex items-center justify-center hover:bg-blue-600/80 transition-all duration-300 shadow-lg"
              >
                {isPlaying ? (
                  <FaPause className="text-white text-2xl" />
                ) : (
                  <FaPlay className="text-white text-2xl ml-1" />
                )}
              </button>
            </motion.div>
            
            <motion.div 
              initial={false}
              animate={{ opacity: isHovered ? 1 : 0 }}
              className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent"
            >
              <div
                className="h-1.5 bg-white/20 rounded-full mb-4 cursor-pointer overflow-hidden"
                onClick={handleSeek}
              >
                <motion.div
                  className="h-full bg-blue-500 rounded-full relative"
                  style={{ width: `${progress}%` }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg"></div>
                </motion.div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <button
                    onClick={togglePlay}
                    className="group flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    {isPlaying ? (
                      <FaPause className="text-white text-lg group-hover:text-blue-400 transition-colors" />
                    ) : (
                      <FaPlay className="text-white text-lg group-hover:text-blue-400 transition-colors ml-0.5" />
                    )}
                  </button>
                  <span className="text-white font-medium">
                    {videoRef.current
                      ? `${formatTime(videoRef.current.currentTime)} / ${formatTime(duration)}`
                      : '0:00 / 0:00'}
                  </span>
                </div>
                <button
                  onClick={toggleFullscreen}
                  className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
                >
                  <FaExpand className="text-white text-lg hover:text-blue-400 transition-colors" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
} 