import { Link } from 'react-router-dom';
import { Clock, Play } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { cn } from '../../utils/cn';
import type { VideoCatalogItem } from './types';

function youtubeThumbnailUrl(youtubeId: string): string {
  return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
}

export type VideoCardProps = {
  video: VideoCatalogItem;
  className?: string;
  basePath?: string;
};

export function VideoCard({ video, className, basePath = '/videos' }: VideoCardProps) {
  return (
    <Link
      to={`${basePath}/${video.id}`}
      className={cn(
        'group block rounded-2xl outline-none transition-[transform,box-shadow] focus-visible:ring-2 focus-visible:ring-[var(--color-brand)] focus-visible:ring-offset-2',
        className,
      )}
    >
      <Card
        padding="none"
        className="h-full overflow-hidden border-slate-200/90 shadow-sm transition-shadow group-hover:border-slate-300/90 group-hover:shadow-md"
      >
        <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
          <img
            src={youtubeThumbnailUrl(video.youtubeId)}
            alt=""
            className="h-full w-full object-cover opacity-95 transition-opacity group-hover:opacity-100"
            loading="lazy"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/25 transition-colors group-hover:bg-slate-900/35">
            <span className="flex size-14 items-center justify-center rounded-full bg-white/95 text-[var(--color-brand)] shadow-lg ring-2 ring-white/80 transition-transform group-hover:scale-105">
              <Play className="ml-0.5 size-7 fill-current" aria-hidden />
            </span>
          </div>
          <span className="absolute bottom-2 right-2 rounded-md bg-black/75 px-2 py-0.5 text-xs font-medium text-white tabular-nums">
            {video.duration}
          </span>
        </div>
        <div className="space-y-2 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="max-w-full truncate font-normal">
              {video.courseName}
            </Badge>
          </div>
          <h3 className="line-clamp-2 text-base font-semibold leading-snug text-slate-900 group-hover:text-[var(--color-brand)]">
            {video.title}
          </h3>
          <p className="line-clamp-2 text-sm text-slate-600">{video.description}</p>
          <p className="flex items-center gap-1.5 text-xs text-slate-500">
            <Clock className="size-3.5" aria-hidden />
            Lesson · {video.duration}
          </p>
        </div>
      </Card>
    </Link>
  );
}
