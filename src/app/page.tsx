'use client';

import { videos } from '@/lib/videos';
import VideoCard from '@/components/VideoCard';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="container mx-auto px-6 py-16">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-24"
        >
          <motion.h1 
            className="text-6xl md:text-7xl font-bold mb-8"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
              Video Showcase
            </span>
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto font-light"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Explore our collection of amazing videos
          </motion.p>
        </motion.header>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-12 mb-24"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15
              }
            }
          }}
          initial="hidden"
          animate="show"
        >
          {videos.map((video, index) => (
            <motion.div
              key={video.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { 
                  opacity: 1, 
                  y: 0,
                  transition: {
                    type: "spring",
                    stiffness: 260,
                    damping: 20
                  }
                }
              }}
              className="transform hover:scale-[1.02] transition-transform duration-300"
            >
              <VideoCard video={video} />
            </motion.div>
          ))}
        </motion.div>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center"
        >
          <p className="text-base text-gray-400">
            Powered by{' '}
            <span className="font-medium bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text">
              AWAKE ABOVE
            </span>
          </p>
        </motion.footer>
      </div>
    </main>
  );
}
