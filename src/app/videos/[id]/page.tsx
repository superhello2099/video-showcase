import { notFound } from 'next/navigation';
import { videos } from '@/lib/videos';
import VideoPlayer from '@/components/VideoPlayer';

interface VideoPageProps {
  params: {
    id: string;
  };
}

// 生成静态路径
export async function generateStaticParams() {
  return videos.map((video) => ({
    id: video.id,
  }));
}

// 启用ISR，每小时重新生成一次
export const revalidate = 3600;

export default function VideoPage({ params }: VideoPageProps) {
  const video = videos.find((v) => v.id === params.id);

  if (!video) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <div className="container mx-auto px-4 py-12">
        <div className="space-y-8">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
            {video.title}
          </h1>
          <p className="text-xl text-gray-300">
            {video.description}
          </p>
          <div className="aspect-video w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-1">
            <div className="rounded-xl overflow-hidden">
              <VideoPlayer video={video} />
            </div>
          </div>
        </div>

        <footer className="mt-16 text-center">
          <p className="text-sm text-gray-500">
            Powered by{' '}
            <span className="font-semibold bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">
              AWAKE ABOVE
            </span>
          </p>
        </footer>
      </div>
    </main>
  );
} 