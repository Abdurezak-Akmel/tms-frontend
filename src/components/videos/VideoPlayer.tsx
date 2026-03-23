import { cn } from '../../utils/cn';

export type VideoPlayerProps = {
  youtubeId: string;
  title: string;
  className?: string;
};

/** YouTube embed — admin-supplied URLs resolve to `youtubeId` for storage */
export function VideoPlayer({ youtubeId, title, className }: VideoPlayerProps) {
  const src = `https://www.youtube.com/embed/${youtubeId}?rel=0`;

  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border border-slate-200/90 bg-black shadow-lg ring-1 ring-slate-900/5',
        className,
      )}
    >
      <div className="relative aspect-video w-full">
        <iframe
          title={title}
          src={src}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    </div>
  );
}
