'use client';

import { motion } from 'framer-motion';
import { videos } from '@/lib/videos';
import VideoCard from './VideoCard';
import { useState, useEffect, useRef } from 'react';

export default function VideoGrid() {
  const [visibleVideos, setVisibleVideos] = useState<number>(6);
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 创建交叉观察器
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && visibleVideos < videos.length) {
          setIsLoading(true);
          // 模拟加载延迟
          setTimeout(() => {
            setVisibleVideos((prev) => Math.min(prev + 3, videos.length));
            setIsLoading(false);
          }, 500);
        }
      },
      { threshold: 0.1 }
    );

    // 开始观察加载更多元素
    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [visibleVideos, isLoading]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6"
    >
      {videos.slice(0, visibleVideos).map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
      
      {visibleVideos < videos.length && (
        <div 
          ref={loadMoreRef} 
          className="col-span-full flex justify-center py-8"
        >
          {isLoading ? (
            <div className="w-10 h-10 border-4 border-white/20 rounded-full animate-spin border-t-white"></div>
          ) : (
            <div className="h-10"></div>
          )}
        </div>
      )}
    </motion.div>
  );
} 