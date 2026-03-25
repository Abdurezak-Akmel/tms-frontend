import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Loader2,
  Calendar
} from 'lucide-react';
import { EmptyState } from '../../components/feedback';
import { Stack } from '../../components/layout';
import { Badge } from '../../components/ui';
import { Card, CardContent, CardHeader } from '../../components/ui';
import { videoService, type Video } from '../../services/videoService';
import { courseService } from '../../services/courseService';

/* Simple VideoPlayer Component using iframe for YouTube */
const VideoPlayer = ({ youtubeUrl, title }: { youtubeUrl: string; title?: string }) => {
  const videoId = videoService.extractYouTubeId(youtubeUrl);
  if (!videoId) return <div className="aspect-video bg-slate-900 flex items-center justify-center text-white">Invalid video URL</div>;

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-2xl">
      <iframe
        className="absolute inset-0 h-full w-full"
        src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=1`}
        title={title || "Video Player"}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

const VideoDisplay = () => {
  const { id } = useParams<{ id: string }>();

  const [video, setVideo] = useState<Video | null>(null);
  const [courseName, setCourseName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const videoId = parseInt(id, 10);
    if (isNaN(videoId)) {
      setError('Invalid video ID');
      setIsLoading(false);
      return;
    }

    const fetchVideoData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // 1. Fetch main video data
        const videoRes = await videoService.getVideoById(videoId);
        if (!videoRes.success || !videoRes.video) {
          setError(videoRes.message || 'Video not found');
          return;
        }
        const v = videoRes.video;
        setVideo(v);

        // 2. Fetch course name for the header
        const courseRes = await courseService.getCourseById(v.course_id);
        if (courseRes.success && courseRes.course) {
          setCourseName(courseRes.course.title);
        }
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred while loading the video.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideoData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="size-10 animate-spin text-slate-300" />
      </div>
    );
  }

  if (error || !video) {
    return (
      <EmptyState
        title="Lesson not found"
        description={error || "This video lesson does not exist or has been removed."}
        action={
          <Link
            to="/videos"
            className="inline-flex h-10 items-center justify-center rounded-xl bg-[var(--color-brand)] px-4 text-sm font-medium text-white shadow-sm hover:bg-[var(--color-brand-dark)]"
          >
            Explore all lessons
          </Link>
        }
      />
    );
  }

  const durationLabel = video.duration ? videoService.formatDuration(video.duration) : '';
  const dateFormatted = videoService.formatDate(video.created_at).split(',')[0];

  return (
    <Stack className="mx-auto max-w-6xl pb-20 pt-6">
      {/* 1. Header Navigation & Breadcrumbs */}
      <div className="space-y-6">
        <Link
          to="/videos"
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-brand)] transition-colors hover:text-[var(--color-brand-dark)]"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back to library
        </Link>

        {/* 2. Main Title section */}
        <div className="flex flex-wrap items-start justify-between gap-6 pb-2">
          <div className="min-w-0 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="outline" className="border-slate-300 text-slate-700">
                {courseName || 'Loading course...'}
              </Badge>
              {durationLabel && (
                <span className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
                  <Clock className="size-4" />
                  {durationLabel}
                </span>
              )}
              <span className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
                <Calendar className="size-4" />
                Uploaded {dateFormatted}
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {video.title}
            </h1>
          </div>

          <Link
            to={`/courses/${video.course_id}`}
            className="group flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:shadow"
          >
            <BookOpen className="size-4 text-[var(--color-brand)]" aria-hidden />
            Go to full course
          </Link>
        </div>
      </div>

      {/* 3. The Video Player Wrapper */}
      <VideoPlayer youtubeUrl={video.youtube_url} title={video.title || "Lesson Player"} />

      {/* 4. Lesson Description & Metadata */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-4 text-xl font-bold text-slate-900">About this lesson</h2>
          <div className="prose prose-slate max-w-none text-slate-600">
            <p className="whitespace-pre-wrap leading-relaxed">
              {video.description || "No detailed description provided for this lesson."}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="border-slate-100 bg-slate-50/50" padding="lg">
            <CardHeader className="pb-3 text-sm font-bold uppercase tracking-wider text-slate-400">
              Course Context
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-slate-600">
                You are watching a lesson from the dynamic curriculum of
                <span className="block mt-1 font-bold text-slate-900 italic">"{courseName}"</span>
              </p>
              <Link
                to={`/courses/${video.course_id}`}
                className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--color-brand)] hover:underline"
              >
                View curriculum
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </Stack>
  );
};

export default VideoDisplay;
