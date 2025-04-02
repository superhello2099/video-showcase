'use client';

import { videos } from '@/lib/videos';
import VideoCard from '@/components/VideoCard';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <div className="container mx-auto px-4 py-8">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
              Video Showcase
            </span>
          </motion.h1>
          <motion.p 
            className="text-lg text-gray-300 max-w-2xl mx-auto font-light"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Explore our collection of amazing videos
          </motion.p>
        </motion.header>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          initial="hidden"
          animate="show"
        >
          {videos.map((video) => (
            <motion.div
              key={video.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { 
                  opacity: 1, 
                  y: 0,
                  transition: {
                    type: "spring",
                    stiffness: 200,
                    damping: 20
                  }
                }
              }}
            >
              <VideoCard video={video} />
            </motion.div>
          ))}
        </motion.div>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center"
        >
          <p className="text-sm text-gray-400">
            Powered by{' '}
            <span className="font-medium bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text">
              AWAKE ABOVE
            </span>
          </p>
        </motion.footer>
      </div>
    </main>
  );
}
