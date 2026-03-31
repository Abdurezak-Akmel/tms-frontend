import { useEffect, useState } from 'react';
import { Film } from 'lucide-react';
import { toast } from 'react-toastify';
import {
  CourseVideoSection,
} from '../../components/videos';
import type { VideoCatalogItem } from '../../components/videos/types';
import { Callout, EmptyState } from '../../components/feedback';
import { PageHeader, Stack } from '../../components/layout';
import { videoService } from '../../services/videoService';
import type { Video } from '../../services/videoService';
import { courseService } from '../../services/courseService';
import type { Course } from '../../services/courseService';

const Videos = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [videoRes, courseRes] = await Promise.all([
        videoService.getAllVideos(),
        courseService.getAllCourses()
      ]);

      if (videoRes.success && videoRes.videos) {
        setVideos(videoRes.videos);
      }
      if (courseRes.success && courseRes.courses) {
        setCourses(courseRes.courses);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch videos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteVideo = async (videoId: string) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return;

    try {
      setIsDeletingId(videoId);
      const res = await videoService.deleteVideo(parseInt(videoId));
      
      if (res.success) {
        toast.success('Video deleted successfully');
        setVideos((prev) => prev.filter((v) => v.video_id.toString() !== videoId));
      } else {
        toast.error(res.message || 'Failed to delete video');
      }
    } catch (err: any) {
      toast.error(err.message || 'An error occurred while deleting the video');
    } finally {
      setIsDeletingId(null);
    }
  };

  const courseMap = new Map(courses.map(c => [c.course_id, c.title]));

  const mappedVideos: VideoCatalogItem[] = videos.map(v => ({
    id: v.video_id.toString(),
    courseId: v.course_id.toString(),
    courseName: courseMap.get(v.course_id) || 'Unknown Course',
    title: v.title || 'Untitled Video',
    description: v.description || '',
    duration: videoService.formatDuration(v.duration),
    youtubeId: videoService.extractYouTubeId(v.youtube_url) || '',
  }));

  type VideoGroup = { courseName: string; courseId: string; videos: VideoCatalogItem[] };
  const groupVideos = (items: VideoCatalogItem[]): VideoGroup[] => {
    const map = new Map<string, VideoGroup>();
    for (const v of items) {
      if (!map.has(v.courseId)) {
        map.set(v.courseId, { courseName: v.courseName, courseId: v.courseId, videos: [] });
      }
      map.get(v.courseId)!.videos.push(v);
    }
    return Array.from(map.values()).sort((a, b) => a.courseName.localeCompare(b.courseName));
  };

  const sections = groupVideos(mappedVideos);

  if (loading) {
    return <div className="flex h-64 items-center justify-center">Loading videos...</div>;
  }

  if (error) {
    return <Callout variant="danger" title="Error">{error}</Callout>;
  }

  return (
    <Stack gap="lg" className="pb-10">
      <PageHeader
        title="Videos"
        description="Admin view of all course lessons. Watch and manage your published content."
        actions={
          <span className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm">
            <Film className="size-4 text-[var(--color-brand)]" aria-hidden />
            {videos.length} videos
          </span>
        }
      />

      {sections.length === 0 ? (
        <EmptyState 
          title="No videos found" 
          description="Start by adding videos to your courses from the course preview page."
        />
      ) : (
        <div className="space-y-12">
          {sections.map((section) => (
            <CourseVideoSection
              key={section.courseId}
              courseId={section.courseId}
              courseName={section.courseName}
              videos={section.videos}
              basePath="/admin/videos"
              onDelete={handleDeleteVideo}
              isDeletingId={isDeletingId}
            />
          ))}
        </div>
      )}
    </Stack>
  );
};

export default Videos;
