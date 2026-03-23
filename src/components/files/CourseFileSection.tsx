import { FileCard } from './FileCard';
import type { FileCatalogItem } from './types';

export type CourseFileSectionProps = {
  courseId: string;
  courseName: string;
  files: FileCatalogItem[];
};

export function CourseFileSection({ courseId, courseName, files }: CourseFileSectionProps) {
  const headingId = `files-course-${courseId}`;

  return (
    <section className="space-y-5" aria-labelledby={headingId}>
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-200/90 pb-4">
        <div>
          <h2 id={headingId} className="text-xl font-semibold tracking-tight text-slate-900">
            {courseName}
          </h2>
          <p className="mt-1 text-sm text-slate-500">Course materials & downloads</p>
        </div>
        <p className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          {files.length} file{files.length === 1 ? '' : 's'}
        </p>
      </div>
      <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {files.map((file) => (
          <li key={file.id}>
            <FileCard file={file} />
          </li>
        ))}
      </ul>
    </section>
  );
}
