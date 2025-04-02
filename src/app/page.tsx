'use client';

import { videos } from '@/lib/videos';
import VideoCard from '@/components/VideoCard';
import { motion } from 'framer-motion';

export default function Home() {
  const getVideoUrl = (video: typeof videos[0]) => {
    if (video?.hostedUrl) return video.hostedUrl
    const encodedFilename = encodeURIComponent(video?.filename || '')
    return `/videos/${encodedFilename}`
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative h-[80vh] w-full">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black z-10" />
        <div className="absolute inset-0">
          <video 
            className="w-full h-full object-cover"
            autoPlay 
            muted 
            loop 
            playsInline
            poster="/thumbnail.jpg"
          >
            <source src={getVideoUrl(videos[0])} type="video/mp4" />
          </video>
        </div>
        
        <div className="absolute bottom-0 left-0 p-8 z-20 w-full">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Video Showcase
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl">
              Experience our collection of carefully curated videos in stunning quality. Each piece tells a unique story through visual excellence.
            </p>
          </div>
        </div>
      </section>

      {/* Video Grid Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-semibold mb-8 text-gray-100">Featured Videos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-sm text-gray-500 text-center">
            © {new Date().getFullYear()} Video Showcase. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
