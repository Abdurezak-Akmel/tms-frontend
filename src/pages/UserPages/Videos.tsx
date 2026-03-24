import { Film } from 'lucide-react';
import {
  CourseVideoSection,
  groupVideosByCourse,
  MOCK_VIDEOS,
} from '../../components/videos';
import { Callout } from '../../components/feedback';
import { PageHeader, Stack } from '../../components/layout';

const Videos = () => {
  const sections = groupVideosByCourse(MOCK_VIDEOS);

  return (
    <Stack gap="lg" className="pb-10">
      <PageHeader
        title="Videos"
        description="Watch lessons grouped by course. Each item opens the full player with the YouTube video your admin published."
        actions={
          <span className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm">
            <Film className="size-4 text-[var(--color-brand)]" aria-hidden />
            {MOCK_VIDEOS.length} videos
          </span>
        }
      />

      <Callout variant="info" title="Demo catalog">
        Titles and courses are static. In production, admins paste a YouTube URL — store the video ID and
        use it for thumbnails and embeds.
      </Callout>

      <div className="space-y-12">
        {sections.map((section) => (
          <CourseVideoSection
            key={section.courseId}
            courseId={section.courseId}
            courseName={section.courseName}
            videos={section.videos}
          />
        ))}
      </div>
    </Stack>
  );
};

export default Videos;
