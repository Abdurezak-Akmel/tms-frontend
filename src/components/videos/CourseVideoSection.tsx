import { VideoCard } from './VideoCard';
import type { VideoCatalogItem } from './types';

export type CourseVideoSectionProps = {
  courseId: string;
  courseName: string;
  videos: VideoCatalogItem[];
};

export function CourseVideoSection({ courseId, courseName, videos }: CourseVideoSectionProps) {
  const headingId = `videos-course-${courseId}`;

  return (
    <section className="space-y-4" aria-labelledby={headingId}>
      <div className="flex flex-wrap items-end justify-between gap-2 border-b border-slate-200/90 pb-3">
        <h2 id={headingId} className="text-lg font-semibold text-slate-900">
          {courseName}
        </h2>
        <p className="text-sm text-slate-500">
          {videos.length} video{videos.length === 1 ? '' : 's'}
        </p>
      </div>
      <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {videos.map((video) => (
          <li key={video.id}>
            <VideoCard video={video} />
          </li>
        ))}
      </ul>
    </section>
  );
}
