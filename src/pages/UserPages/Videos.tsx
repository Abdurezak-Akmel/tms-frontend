import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Film,
  Loader2,
  Play,
  Clock,
  BookOpen
} from 'lucide-react';
import { roleCourseService } from '../../services/roleCourseService';
import { videoService, type Video } from '../../services/videoService';
import { useAuth } from '../../hooks/useAuth';
import { PageHeader, Stack } from '../../components/layout';
import { Callout, EmptyState } from '../../components/feedback';

interface VideoWithCourse extends Video {
  courseName: string;
}

const Videos = () => {
  const { user } = useAuth();
  const [videos, setVideos] = useState<VideoWithCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVideosForUnlockedCourses = useCallback(async () => {
    if (!user?.role_id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 1. Get all courses assigned to this role
      const roleCoursesRes = await roleCourseService.getCoursesByRoleId(user.role_id);

      if (!roleCoursesRes.success || !roleCoursesRes.courses) {
        setVideos([]);
        return;
      }

      const assignedCourses = roleCoursesRes.courses;

      // 2. Fetch videos for all these courses in parallel
      const videoPromises = assignedCourses.map(async (course: any) => {
        try {
          const res = await videoService.getVideosByCourseId(course.course_id);
          if (res.success && res.videos) {
            return res.videos.map(v => ({
              ...v,
              courseName: course.title
            }));
          }
          return [];
        } catch (err) {
          console.error(`Failed to fetch videos for course ${course.course_id}:`, err);
          return [];
        }
      });

      const results = await Promise.all(videoPromises);
      const allVideos = results.flat();

      // Sort by creation date (newest first) to feel like a "Feed"
      allVideos.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setVideos(allVideos);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred while loading videos.');
    } finally {
      setIsLoading(false);
    }
  }, [user?.role_id]);

  useEffect(() => {
    fetchVideosForUnlockedCourses();
  }, [fetchVideosForUnlockedCourses]);

  const groupedVideos = useMemo(() => {
    const groups: Record<string, VideoWithCourse[]> = {};
    videos.forEach(video => {
      if (!groups[video.courseName]) {
        groups[video.courseName] = [];
      }
      groups[video.courseName].push(video);
    });
    return groups;
  }, [videos]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-8 animate-spin text-slate-300" />
      </div>
    );
  }

  return (
    <Stack gap="lg" className="pb-10">
      <PageHeader
        title="Lessons Library"
        description="All video lessons from your assigned courses, organized in a searchable feed."
        actions={
          <span className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm">
            <Film className="size-4 text-[var(--color-brand)]" aria-hidden />
            {videos.length} total lessons
          </span>
        }
      />

      {error && (
        <Callout variant="danger" title="Error">
          {error}
        </Callout>
      )}

      {videos.length === 0 ? (
        <EmptyState
          title="No lessons found"
          description="You don't have access to any video lessons yet. Courses assigned to your role will appear here automatically."
          action={
            <Link
              to="/courses"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-[var(--color-brand)] px-4 text-sm font-medium text-white shadow-sm hover:bg-[var(--color-brand-dark)]"
            >
              Browse all courses
            </Link>
          }
        />
      ) : (
        /* Categorized Layout */
        <div className="flex flex-col gap-10">
          {Object.entries(groupedVideos).map(([courseName, courseVideos]) => (
            <section key={courseName} className="flex flex-col gap-5">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                <BookOpen className="size-5 text-[var(--color-brand)] dark:text-brand-400" />
                {courseName}
              </h2>
              <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {courseVideos.map((video) => {
                  const thumbnail = videoService.getThumbnailUrl(video.youtube_url, 'high');
                  const durationLabel = video.duration ? videoService.formatDuration(video.duration) : '';

                  return (
                    <Link
                      key={video.video_id}
                      to={`/videos/${video.video_id}`}
                      className="group flex flex-col space-y-3 transition-transform duration-200 hover:scale-[1.02]"
                    >
                      {/* Thumbnail Wrapper */}
                      <div className="relative aspect-video overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 shadow-sm hover:shadow-md transition-shadow">
                        {thumbnail ? (
                          <img
                            src={thumbnail}
                            alt={video.title || 'Video thumbnail'}
                            className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-90"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-slate-300 dark:text-slate-600">
                            <Film className="size-12" />
                          </div>
                        )}

                        {/* Play Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                          <div className="flex size-12 items-center justify-center rounded-full bg-[var(--color-brand)] text-white shadow-lg shadow-[var(--color-brand)]/20">
                            <Play className="ml-1 size-6 fill-current" />
                          </div>
                        </div>

                        {/* Duration Badge */}
                        {durationLabel && (
                          <div className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
                            {durationLabel}
                          </div>
                        )}
                      </div>

                      {/* Meta Information */}
                      <div className="flex gap-3">
                        <div className="flex flex-col space-y-1 w-full relative">
                          <h3 className="line-clamp-2 text-sm font-bold leading-tight text-slate-900 dark:text-slate-100 group-hover:text-[var(--color-brand)] dark:group-hover:text-brand-400">
                            {video.title || 'Untitled Lesson'}
                          </h3>
                          <div className="flex flex-col text-xs text-slate-500 dark:text-slate-400">
                            <div className="mt-0.5 flex items-center gap-1">
                              <Clock className="size-3" />
                              <span>Uploaded on {videoService.formatDate(video.created_at).split(',')[0]}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </Stack>
  );
};

export default Videos;