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
    <div className="w-full max-w-7xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative group bg-black rounded-xl overflow-hidden shadow-2xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="absolute top-4 left-4 z-20"
        >
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-lg flex items-center justify-center border border-white/20 shadow-lg hover:bg-black/70 transition-all duration-300"
            >
              <FaArrowLeft className="text-white text-sm" />
            </motion.div>
          </Link>
        </motion.div>
        
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
            <div className="w-12 h-12 border-3 border-blue-500/20 rounded-full animate-spin border-t-blue-500"></div>
          </div>
        )}
        
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black p-6 z-10">
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
            <div className="relative aspect-video bg-black">
              <video
                ref={videoRef}
                src={getVideoUrl()}
                className="w-full h-full object-contain"
                poster={thumbnail || undefined}
                onLoadedMetadata={handleLoadedMetadata}
                onTimeUpdate={handleTimeUpdate}
                onError={handleError}
                playsInline
                preload="metadata"
              />
            </div>
            
            <motion.div 
              initial={false}
              animate={{ opacity: isHovered ? 1 : 0 }}
              className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 z-10"
            >
              <button
                onClick={togglePlay}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-blue-500/90 backdrop-blur-sm flex items-center justify-center hover:bg-blue-600/90 transition-all duration-300 shadow-lg"
              >
                {isPlaying ? (
                  <FaPause className="text-white text-xl" />
                ) : (
                  <FaPlay className="text-white text-xl ml-1" />
                )}
              </button>
            </motion.div>
            
            <motion.div 
              initial={false}
              animate={{ opacity: isHovered ? 1 : 0 }}
              className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/70 to-transparent z-10"
            >
              <div
                className="h-1 bg-white/20 rounded-full mb-3 cursor-pointer"
                onClick={handleSeek}
              >
                <motion.div
                  className="h-full bg-blue-500 rounded-full relative"
                  style={{ width: `${progress}%` }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg"></div>
                </motion.div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={togglePlay}
                    className="group flex items-center justify-center w-8 h-8 rounded-lg bg-black/50 hover:bg-black/70 transition-colors"
                  >
                    {isPlaying ? (
                      <FaPause className="text-white text-sm group-hover:text-blue-400 transition-colors" />
                    ) : (
                      <FaPlay className="text-white text-sm group-hover:text-blue-400 transition-colors ml-0.5" />
                    )}
                  </button>
                  <span className="text-white text-sm font-medium">
                    {videoRef.current
                      ? `${formatTime(videoRef.current.currentTime)} / ${formatTime(duration)}`
                      : '0:00 / 0:00'}
                  </span>
                </div>
                <button
                  onClick={toggleFullscreen}
                  className="w-8 h-8 rounded-lg bg-black/50 hover:bg-black/70 transition-colors flex items-center justify-center"
                >
                  <FaExpand className="text-white text-sm hover:text-blue-400 transition-colors" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
} 