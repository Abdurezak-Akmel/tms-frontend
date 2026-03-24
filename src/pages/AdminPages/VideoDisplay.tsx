import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock } from 'lucide-react';
import { VideoPlayer } from '../../components/videos';
import { EmptyState, Callout } from '../../components/feedback';
import { Stack } from '../../components/layout';
import { Badge } from '../../components/ui';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui';
import { ButtonLink } from '../../components/ui/ButtonLink';
import { videoService } from '../../services/videoService';
import type { Video } from '../../services/videoService';
import { courseService } from '../../services/courseService';
import type { Course } from '../../services/courseService';

const VideoDisplay = () => {
  const { id } = useParams<{ id: string }>();
  const [video, setVideo] = useState<Video | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideoData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const videoId = parseInt(id);
        const videoRes = await videoService.getVideoById(videoId);
        
        if (videoRes.success && videoRes.video) {
          setVideo(videoRes.video);
          
          // Fetch course to get the name
          const courseRes = await courseService.getCourseById(videoRes.video.course_id);
          if (courseRes.success && courseRes.course) {
            setCourse(courseRes.course);
          }
        } else {
          setError('Video not found');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch video');
      } finally {
        setLoading(false);
      }
    };

    fetchVideoData();
  }, [id]);

  if (loading) {
    return <div className="flex h-64 items-center justify-center">Loading video...</div>;
  }

  if (error || !video) {
    return (
      <EmptyState
        title={error || "Video not found"}
        description="This lesson is not in the library. Return to the catalog and pick another video."
        action={
          <ButtonLink to="/admin/videos" variant="primary" size="md">
            All videos
          </ButtonLink>
        }
      />
    );
  }

  const youtubeId = videoService.extractYouTubeId(video.youtube_url) || '';

  return (
    <Stack gap="lg" className="pb-10">
      <div>
        <Link
          to="/admin/videos"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-brand)] hover:underline"
        >
          <ArrowLeft className="size-4" aria-hidden />
          All videos
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{course?.title || 'Loading course...'}</Badge>
              <span className="flex items-center gap-1.5 text-sm text-slate-500">
                <Clock className="size-4" aria-hidden />
                {videoService.formatDuration(video.duration)}
              </span>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              {video.title}
            </h1>
            <p className="max-w-3xl text-slate-600">{video.description}</p>
          </div>
          <ButtonLink
            to={`/admin/courses/${video.course_id}`}
            variant="outline"
            size="md"
            leftIcon={<BookOpen className="size-4" />}
          >
            Course overview
          </ButtonLink>
        </div>
      </div>

      {youtubeId ? (
        <VideoPlayer youtubeId={youtubeId} title={video.title || 'Lesson Video'} />
      ) : (
        <Callout variant="danger" title="Invalid Video URL">
          The YouTube URL provided for this video is invalid.
        </Callout>
      )}

      <Card className="border-slate-200/90 shadow-sm" padding="lg">
        <CardHeader>
          <CardTitle className="text-base">About this lesson</CardTitle>
          <CardDescription>
            Lesson ID: <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs">{video.video_id}</code>
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-slate-600">
           <p>This video belongs to the <strong>{course?.title}</strong> course.</p>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default VideoDisplay;
