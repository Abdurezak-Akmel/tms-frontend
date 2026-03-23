import { Link } from 'react-router-dom';
import { FileText, Film, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import type { CourseFileItem, CourseVideoItem } from './types';

export type CourseResourceListsProps = {
  videos: CourseVideoItem[];
  files: CourseFileItem[];
};

export function CourseResourceLists({ videos, files }: CourseResourceListsProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="border-slate-200/90 shadow-sm" padding="lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Film className="size-5 text-[var(--color-brand)]" aria-hidden />
            Videos
          </CardTitle>
          <CardDescription>
            Lessons published by your instructor — open a video to watch in the video player.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-0 pt-0">
          <ul className="divide-y divide-slate-100">
            {videos.map((v) => (
              <li key={v.id}>
                <Link
                  to={`/videos/${v.id}`}
                  className="group flex items-center justify-between gap-3 py-3 text-sm transition-colors hover:bg-slate-50/80"
                >
                  <span className="font-medium text-slate-900 group-hover:text-[var(--color-brand)]">
                    {v.title}
                  </span>
                  <span className="flex shrink-0 items-center gap-2 text-slate-500">
                    <span className="tabular-nums">{v.duration}</span>
                    <ExternalLink className="size-4 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="border-slate-200/90 shadow-sm" padding="lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="size-5 text-[var(--color-brand)]" aria-hidden />
            Files
          </CardTitle>
          <CardDescription>
            Slides, code, and readings uploaded by admins — download from the file viewer.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-0 pt-0">
          <ul className="divide-y divide-slate-100">
            {files.map((f) => (
              <li key={f.id}>
                <Link
                  to={`/files/${f.id}`}
                  className="group flex items-center justify-between gap-3 py-3 text-sm transition-colors hover:bg-slate-50/80"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900 group-hover:text-[var(--color-brand)]">
                      {f.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {f.kind} · {f.sizeLabel}
                    </p>
                  </div>
                  <ExternalLink className="size-4 shrink-0 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
