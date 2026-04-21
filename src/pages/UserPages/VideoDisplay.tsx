import { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Loader2,
  Calendar,
  Play,
  Pause,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { EmptyState } from '../../components/feedback';
import { Stack } from '../../components/layout';
import { Badge } from '../../components/ui';
import { Card, CardContent, CardHeader } from '../../components/ui';
import { videoService, type Video } from '../../services/videoService';
import { courseService } from '../../services/courseService';

/* Robust Custom VideoPlayer — No YouTube branding or redirects */
const VideoPlayer = ({ youtubeUrl, title, initialDuration }: { youtubeUrl: string; title?: string; initialDuration?: number }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(initialDuration || 0);
  const videoId = videoService.extractYouTubeId(youtubeUrl);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const postCommand = (func: string, args: any[] = [], id: number = 0) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func, args, id }),
      '*'
    );
  };

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const next = !isPlaying;
    postCommand(next ? 'playVideo' : 'pauseVideo');
    setIsPlaying(next);
  };

  const seek = (time: number) => {
    postCommand('seekTo', [time, true]);
    setCurrentTime(time);
  };

  const toggleFullscreen = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => { });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.origin.includes('youtube')) return;
      try {
        const data = JSON.parse(event.data);

        // 1. infoDelivery is the automatic push
        if (data.event === 'infoDelivery' && data.info) {
          if (data.info.currentTime !== undefined) setCurrentTime(data.info.currentTime);
          if (data.info.duration !== undefined) setDuration(data.info.duration);
          if (data.info.playerState !== undefined) setIsPlaying(data.info.playerState === 1);
        }

        // 2. onStateChange for play/pause sync
        if (data.event === 'onStateChange') {
          setIsPlaying(data.info === 1);
        }

        // 3. Handle explicit command results (e.g. from getCurrentTime)
        if (data.id === 1 && data.result !== undefined) {
          setCurrentTime(data.result);
        }
        if (data.id === 2 && data.result !== undefined) {
          setDuration(data.result);
        }
      } catch (err) { }
    };

    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);

    window.addEventListener('message', handleMessage);
    document.addEventListener('fullscreenchange', handleFsChange);

    // Heartbeat: Poll for player info as YouTube doesn't always push it frequently
    const heartbeat = setInterval(() => {
      postCommand('getCurrentTime', [], 1);
      postCommand('getDuration', [], 2);
    }, 500);

    // Initial signal to activate API
    const init = setTimeout(() => {
      postCommand('listening');
    }, 500);

    return () => {
      window.removeEventListener('message', handleMessage);
      document.removeEventListener('fullscreenchange', handleFsChange);
      clearInterval(heartbeat);
      clearTimeout(init);
    };
  }, []);

  if (!videoId) return <div className="aspect-video bg-slate-900 flex items-center justify-center text-white">Invalid video URL</div>;

  return (
    <div
      ref={containerRef}
      className={`relative aspect-video w-full overflow-hidden bg-black shadow-2xl group transition-all duration-300 ${isFullscreen ? 'rounded-0' : 'rounded-2xl'}`}
    >
      {/* 1. The Iframe: Controls=0 and Pointer-Events=None makes it unclickable */}
      <iframe
        ref={iframeRef}
        className="absolute inset-0 h-full w-full pointer-events-none scale-[1.01]"
        src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=1&iv_load_policy=3&controls=0&showinfo=0&disablekb=1&enablejsapi=1`}
        title={title || "Video Player"}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />

      {/* 2. Full Shield: Capture all clicks for play/pause, prevents secondary interaction */}
      <div className="absolute inset-0 z-10 cursor-pointer" onClick={togglePlay} />

      {/* 3. Custom Controls Overlay */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">

        {/* Tracker / Progress Bar */}
        <div className="mb-4 flex items-center gap-4">
          <span className="text-[11px] font-mono font-medium text-white/80 tabular-nums min-w-[40px]">
            {formatTime(currentTime)}
          </span>
          <div className="relative flex-1">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={(e) => seek(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer accent-[var(--color-brand)] transition-all hover:h-2"
              style={{
                background: `linear-gradient(to right, var(--color-brand) ${(currentTime / (duration || 1)) * 100}%, rgba(255,255,255,0.2) ${(currentTime / (duration || 1)) * 100}%)`
              }}
            />
          </div>
          <span className="text-[11px] font-mono font-medium text-white/80 tabular-nums min-w-[40px]">
            {formatTime(duration)}
          </span>
        </div>

        {/* Lower Controls */}
        <div className="flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-sm transition-all active:scale-95"
            >
              {isPlaying ? <Pause className="size-4 text-white fill-white" /> : <Play className="size-4 text-white fill-white" />}
              <span className="text-xs font-semibold text-white tracking-wider uppercase">
                {isPlaying ? "Pause" : "Play"}
              </span>
            </button>
          </div>

          <button
            onClick={toggleFullscreen}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-sm transition-all active:scale-95"
          >
            {isFullscreen ? <Minimize2 className="size-4 text-white" /> : <Maximize2 className="size-4 text-white" />}
            <span className="text-xs font-semibold text-white tracking-wider uppercase">
              {isFullscreen ? "Exit" : "Maximize"}
            </span>
          </button>
        </div>
      </div>

      {/* Play/Pause Large indicator in center */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none group-hover:opacity-100 transition-opacity">
          <div className="rounded-full bg-white/20 p-6 backdrop-blur-md border border-white/30 shadow-xl">
            <Play className="size-12 text-white fill-white" />
          </div>
        </div>
      )}
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
      <VideoPlayer
        youtubeUrl={video.youtube_url}
        title={video.title || "Lesson Player"}
        initialDuration={videoService.parseDuration(video.duration)}
      />

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
