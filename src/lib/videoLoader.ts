import { Video } from './videos';

// 视频预加载队列
const preloadQueue: string[] = [];
let isPreloading = false;

// 预加载视频
export const preloadVideo = (video: Video) => {
  if (video.hostedUrl && !preloadQueue.includes(video.hostedUrl)) {
    preloadQueue.push(video.hostedUrl);
    if (!isPreloading) {
      startPreloading();
    }
  }
};

// 开始预加载队列中的视频
const startPreloading = () => {
  if (preloadQueue.length === 0) {
    isPreloading = false;
    return;
  }

  isPreloading = true;
  const url = preloadQueue.shift();
  
  if (url) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'video';
    link.href = url;
    document.head.appendChild(link);
    
    // 预加载下一个视频
    setTimeout(() => {
      startPreloading();
    }, 1000);
  }
};

// 预加载所有视频
export const preloadAllVideos = (videos: Video[]) => {
  videos.forEach(video => {
    if (video.hostedUrl) {
      preloadVideo(video);
    }
  });
}; 