import type { VideoCatalogItem } from './types';

/**
 * Static library for UI — replace with API.
 * `youtubeId` is parsed from admin URLs: youtube.com/watch?v=ID or youtu.be/ID
 * Demo uses a few well-known public IDs so thumbnails + embeds always work.
 */
const DEMO_IDS = ['jNQXAC9IVRw', 'M7lc1UVf-VE', 'dQw4w9WgXcQ'] as const;

function demoYoutubeId(index: number): string {
  return DEMO_IDS[index % DEMO_IDS.length];
}

export const MOCK_VIDEOS: VideoCatalogItem[] = [
  {
    id: 'v101',
    courseId: '1',
    courseName: 'Frontend fundamentals',
    title: 'Welcome & toolchain setup',
    description: 'Install Node, VS Code, and create your first Vite + React app.',
    duration: '12:40',
    youtubeId: demoYoutubeId(0),
  },
  {
    id: 'v102',
    courseId: '1',
    courseName: 'Frontend fundamentals',
    title: 'CSS layout: flexbox & grid',
    description: 'Build responsive layouts with modern CSS.',
    duration: '24:15',
    youtubeId: demoYoutubeId(1),
  },
  {
    id: 'v103',
    courseId: '1',
    courseName: 'Frontend fundamentals',
    title: 'React components & props',
    description: 'Compose UI from reusable components.',
    duration: '18:22',
    youtubeId: demoYoutubeId(2),
  },
  {
    id: 'v201',
    courseId: '2',
    courseName: 'Backend essentials',
    title: 'HTTP & REST recap',
    description: 'Verbs, status codes, and resource naming.',
    duration: '15:02',
    youtubeId: demoYoutubeId(3),
  },
  {
    id: 'v202',
    courseId: '2',
    courseName: 'Backend essentials',
    title: 'Auth: sessions vs JWT',
    description: 'Compare approaches for browser and API clients.',
    duration: '28:44',
    youtubeId: demoYoutubeId(4),
  },
  {
    id: 'v301',
    courseId: '3',
    courseName: 'Database design & SQL',
    title: 'Entities & relationships',
    description: 'Model real-world data before writing SQL.',
    duration: '20:00',
    youtubeId: demoYoutubeId(5),
  },
  {
    id: 'v401',
    courseId: '4',
    courseName: 'DevOps & deployment',
    title: 'Containers 101',
    description: 'Why images and containers matter for shipping software.',
    duration: '22:11',
    youtubeId: demoYoutubeId(6),
  },
  {
    id: 'v501',
    courseId: '5',
    courseName: 'UI/UX for developers',
    title: 'Layout & spacing systems',
    description: 'Align UI to a consistent rhythm.',
    duration: '17:33',
    youtubeId: demoYoutubeId(7),
  },
  {
    id: 'v601',
    courseId: '6',
    courseName: 'Advanced system design',
    title: 'Scaling reads & writes',
    description: 'High-level patterns for growing traffic.',
    duration: '40:12',
    youtubeId: demoYoutubeId(8),
  },
];

export function getVideoById(id: string | undefined): VideoCatalogItem | undefined {
  if (!id) return undefined;
  return MOCK_VIDEOS.find((v) => v.id === id);
}

/** Group videos by course name for section headings */
export function groupVideosByCourse(
  videos: VideoCatalogItem[],
): { courseName: string; courseId: string; videos: VideoCatalogItem[] }[] {
  const map = new Map<string, { courseName: string; courseId: string; videos: VideoCatalogItem[] }>();
  for (const v of videos) {
    const key = v.courseId;
    if (!map.has(key)) {
      map.set(key, { courseName: v.courseName, courseId: v.courseId, videos: [] });
    }
    map.get(key)!.videos.push(v);
  }
  return Array.from(map.values()).sort((a, b) => a.courseName.localeCompare(b.courseName));
}
