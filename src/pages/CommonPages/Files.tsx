import { FolderOpen } from 'lucide-react';
import {
  CourseFileSection,
  groupFilesByCourse,
  MOCK_FILES,
} from '../../components/files';
import { Callout } from '../../components/feedback';
import { PageHeader, Stack } from '../../components/layout';

const Files = () => {
  const sections = groupFilesByCourse(MOCK_FILES);

  return (
    <Stack gap="lg" className="pb-10">
      <PageHeader
        title="Files"
        description="Course support materials uploaded by your instructors—organized by course. Open any item for a detailed preview and download actions."
        actions={
          <span className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm">
            <FolderOpen className="size-4 text-[var(--color-brand)]" aria-hidden />
            {MOCK_FILES.length} files
          </span>
        }
      />

      <Callout variant="info" title="Demo library">
        File metadata is mocked. When your admin API is ready, replace <code className="rounded bg-white/80 px-1 py-0.5 text-xs">MOCK_FILES</code> with live data and signed download URLs.
      </Callout>

      <div className="space-y-14">
        {sections.map((section) => (
          <CourseFileSection
            key={section.courseId}
            courseId={section.courseId}
            courseName={section.courseName}
            files={section.files}
          />
        ))}
      </div>
    </Stack>
  );
};

export default Files;
