'use client';

import { videos } from '@/lib/videos';
import VideoCard from '@/components/VideoCard';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-white">
            Video Showcase
          </h1>
        </div>
      </header>

      {/* Video Grid */}
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-8">
        <div className="grid grid-cols-5 gap-6 h-[calc(100vh-8rem)]">
          {videos.slice(0, 5).map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </div>
    </main>
  );
}
