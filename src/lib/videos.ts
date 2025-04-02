export interface Video {
  id: string;
  title: string;
  description: string;
  filename: string;
  thumbnail?: string;
  date: string;
  hostedUrl?: string;
}

export const videos: Video[] = [
  {
    id: '1',
    title: 'Chaozhou',
    description: 'A beautiful video from Chaozhou',
    filename: 'Chaozhou.mp4',
    date: '2025-03-27'
  },
  {
    id: '2',
    title: 'Star Wars',
    description: 'Star Wars themed video',
    filename: 'Star Wars.mp4',
    date: '2025-03-30'
  },
  {
    id: '3',
    title: 'Causeway Bay',
    description: 'Exploring Causeway Bay',
    filename: 'Causeway Bay.mp4',
    date: '2025-02-18'
  },
  {
    id: '4',
    title: 'Robot Memories',
    description: 'Robot themed video',
    filename: 'Robot Memories.mp4',
    date: '2025-03-31'
  },
  {
    id: '5',
    title: 'KOL Shanghai',
    description: 'Shanghai KOL video',
    filename: 'KOL Shanghai.mp4',
    date: '2025-04-02'
  }
]; 