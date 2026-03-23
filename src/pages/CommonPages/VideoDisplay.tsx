import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock } from 'lucide-react';
import { getVideoById, VideoPlayer } from '../../components/videos';
import { EmptyState } from '../../components/feedback';
import { Stack } from '../../components/layout';
import { Badge } from '../../components/ui';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui';
import { ButtonLink } from '../../components/ui/ButtonLink';

const VideoDisplay = () => {
  const { id } = useParams<{ id: string }>();
  const video = getVideoById(id);

  if (!video) {
    return (
      <EmptyState
        title="Video not found"
        description="This lesson is not in the demo library. Return to the catalog and pick another video."
        action={
          <ButtonLink to="/videos" variant="primary" size="md">
            All videos
          </ButtonLink>
        }
      />
    );
  }

  return (
    <Stack gap="lg" className="pb-10">
      <div>
        <Link
          to="/videos"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-brand)] hover:underline"
        >
          <ArrowLeft className="size-4" aria-hidden />
          All videos
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{video.courseName}</Badge>
              <span className="flex items-center gap-1.5 text-sm text-slate-500">
                <Clock className="size-4" aria-hidden />
                {video.duration}
              </span>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              {video.title}
            </h1>
            <p className="max-w-3xl text-slate-600">{video.description}</p>
          </div>
          <ButtonLink
            to={`/courses/${video.courseId}`}
            variant="outline"
            size="md"
            leftIcon={<BookOpen className="size-4" />}
          >
            Course overview
          </ButtonLink>
        </div>
      </div>

      <VideoPlayer youtubeId={video.youtubeId} title={video.title} />

      <Card className="border-slate-200/90 shadow-sm" padding="lg">
        <CardHeader>
          <CardTitle className="text-base">About this lesson</CardTitle>
          <CardDescription>
            Streamed from YouTube (embed). In production, admins save the URL; the app stores the video ID
            for playback and thumbnails.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-slate-600">
          <p>
            Video ID: <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs">{video.youtubeId}</code>
          </p>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default VideoDisplay;
